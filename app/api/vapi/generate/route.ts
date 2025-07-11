import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";

export async function GET () {
    return Response.json({success:true,data:"THANK YOU"},{status:200})
}

export async function POST (request: Request) {
    const {type,role,level,techstack,amount,userid} = await request.json()
    console.log(amount)
    try {
        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare a set of questions for a job interview. The job is for a ${role} role and the questions must specifically pertain to that only, the questions should be ${type} and according to job experience ${level}. The questions should be related to ${techstack} technologies. There should only be ${amount} questions in the interview, no more. Please only return the questions and not additional text, the questions are going to be used by a voice assistant, and they need to be formatted like ["Question1","Question2"...] also no using characters that can break a voice assistant`
        });

        const interview = {
            questions: JSON.parse(questions),
            role: role,
            level: level,
            techstack: techstack.split(','),
            userid: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }

        await db.collection("interviews").add(interview);

        return Response.json({success:true,data:interview},{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({success:false,error:error instanceof Error ? error.message : 'An unknown error occurred'},{status:500})
    }
}