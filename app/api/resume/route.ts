// app/api/resume/route.ts
import pdf from 'pdf-parse';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { loadSummarizationChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { TokenTextSplitter } from 'langchain/text_splitter';

const PROMPT_TEMPLATE = `
You are an expert at generating interview-style walkthrough questions based on a candidate's resume.
Your goal is to ensure the candidate is fully prepared to discuss and explain every technical detail they've mentioned, across all tools, systems, and projects listed — regardless of specific job role.
The questions should test their depth of understanding, decision-making, and practical use of technologies, as well as their ability to reflect on and communicate technical work clearly.

RESUME:
------------
{text}
------------

Generate a thorough set of interview preparation questions. Include:
- Technical walkthroughs (e.g., "How did you implement X?", "Why did you choose Y?")
- Tool-specific probing (e.g., "How have you used GitHub Actions?", "What was your CI/CD setup?")
- System/architecture deep-dives
- Optimization or debugging scenarios
- Ownership, impact, and trade-off questions
- Reflection and improvement prompts (e.g., "What would you do differently now?")

Be specific to the resume's content. Cover all key experiences, projects, and technologies mentioned.
Each question should be on a new line and end with either a question mark (?) or period (.).

QUESTIONS:
`;

const REFINE_TEMPLATE = `
You are an expert at refining technical interview preparation questions based on a candidate's resume.
We already have a list of questions: {existing_answer}

Now, we are providing more of the candidate's resume below. Use this to:
- Improve or clarify existing questions
- Add missing questions related to new tools, systems, or work
- Ensure the candidate can explain **everything** they have listed
- Remove or reword anything irrelevant or redundant

RESUME CONTEXT:
------------
{text}
------------

Update the list of questions accordingly. If the new content doesn't add anything new, keep the original questions.
Each question should be on a new line and end with either a question mark (?) or period (.).

QUESTIONS:
`;

function corsHeaders() {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
}

async function processResumeText(resumeText: string): Promise<string[]> {
    const splitter = new TokenTextSplitter({
        encodingName: 'gpt2',
        chunkSize: 10000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(resumeText);
    const documents = chunks.map(chunk => new Document({ pageContent: chunk }));

    // Replace ChatOpenAI with ChatGoogleGenerativeAI
    const llm = new ChatGoogleGenerativeAI({
        temperature: 0.3,
        modelName: 'gemini-2.0-flash-001',
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const promptQuestions = PromptTemplate.fromTemplate(PROMPT_TEMPLATE);
    const refinePromptQuestions = PromptTemplate.fromTemplate(REFINE_TEMPLATE);

    const chain = loadSummarizationChain(llm, {
        type: 'refine',
        verbose: true,
        questionPrompt: promptQuestions,
        refinePrompt: refinePromptQuestions,
    });

    const result = await chain.invoke({ input_documents: documents });
    const questions = result.output_text;

    return questions
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 10 && (q.endsWith('?') || q.endsWith('.')))
        .map(q => q.replace(/^\d+\.\s*/, ''));
}

export async function POST(request: Request) {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Google Generative AI API key missing' }), {
                status: 500,
                headers: corsHeaders(),
            });
        }

        const formData = await request.formData();
        const file = formData.get('resume') as File;

        if (!file || file.type !== 'application/pdf') {
            return new Response(JSON.stringify({ error: 'Only PDF files are supported' }), {
                status: 400,
                headers: corsHeaders(),
            });
        }

        if (file.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), {
                status: 400,
                headers: corsHeaders(),
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const resumeText = await extractTextFromPDF(buffer);

        if (!resumeText || resumeText.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Empty or unreadable PDF text' }), {
                status: 400,
                headers: corsHeaders(),
            });
        }

        const questions = await processResumeText(resumeText);

        if (questions.length === 0) {
            return new Response(JSON.stringify({ error: 'No questions could be generated' }), {
                status: 400,
                headers: corsHeaders(),
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                questions,
                totalQuestions: questions.length,
                message: `Generated ${questions.length} interview questions using Gemini.`,
            }),
            {
                status: 200,
                headers: corsHeaders(),
            }
        );
    } catch (err: any) {
        console.error('API Error:', err);
        return new Response(JSON.stringify({
            error: err.message || 'An error occurred while processing the resume',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }), {
            status: 500,
            headers: corsHeaders(),
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders(),
    });
}

export async function GET() {
    return Response.json({ success: true, data: "Resume API with Gemini and LangChain ready" }, { status: 200 });
}