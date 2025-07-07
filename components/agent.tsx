"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { generator, interviewer } from "@/constants";

import { useRef } from "react";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

interface AgentProps {
    userName: string;
    userId: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
    role?: string;
}

// Code Editor Component
const CodeEditor = ({
                        onCodeChange,
                        questions,
                        isCodingInterview
                    }: {
    onCodeChange: (code: string, language: string) => void;
    questions?: string[];
    isCodingInterview: boolean;
}) => {
    const [code, setCode] = useState(`// Write your code here
function example() {
    console.log("Hello World!");
}`);
    const [language, setLanguage] = useState("javascript");

    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
    ];

    // Notify parent component when code changes
    useEffect(() => {
        onCodeChange(code, language);
    }, [code, language, onCodeChange]);

    return (
        <div className="w-full space-y-4">
            {/* Coding Questions Display */}
            {isCodingInterview && questions && questions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Coding Questions</h3>
                    <div className="space-y-2">
                        {questions.map((question, index) => (
                            <div key={index} className="bg-white p-3 rounded border border-blue-100">
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    <span className="font-medium text-blue-700">Q{index + 1}:</span> {question}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Code Editor */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-300 text-sm font-medium">Code Editor</span>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="Write your code here..."
                        spellCheck={false}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                        Lines: {code.split('\n').length}
                    </div>
                </div>
                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                                Run
                            </button>
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                                Save
                            </button>
                            <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                                Clear
                            </button>
                        </div>
                        <div className="text-xs text-gray-400">
                            Ctrl+S to save • Ctrl+R to run
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Agent = ({
                   userName,
                   userId,
                   interviewId,
                   feedbackId,
                   type,
                   questions,
                   role
               }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

    // Add state for code editor content
    const [currentCode, setCurrentCode] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<string>("javascript");

    // Check if role contains coding-related keywords
    const isCodingInterview = role && (
        role.toLowerCase().includes('code') ||
        role.toLowerCase().includes('coding') ||
        role.toLowerCase().includes('program') ||
        role.toLowerCase().includes('structures') ||
        role.toLowerCase().includes('algorithms')
    );

    // Handler for code editor changes
    const handleCodeChange = (code: string, language: string) => {
        setCurrentCode(code);
        setCurrentLanguage(language);
    };

    console.log(userId);

    useEffect(() => {
        const onCallStart = async () => {
            setCallStatus(CallStatus.ACTIVE);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Failed to start webcam:", err);
            }
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);

            // Stop video stream
            if (videoStream) {
                videoStream.getTracks().forEach((track) => track.stop());
                setVideoStream(null);
            }
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.error("Error:", error);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, [videoStream]);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }

        // Modified handleGenerateFeedback function
        const handleGenerateFeedback = async (messages: SavedMessage[]) => {
            try {
                // Prepare the payload with conversation transcript
                const payload: any = {
                    interviewId: interviewId!,
                    userId: userId!,
                    transcript: messages,
                    feedbackId,
                };

                // Add code content if it's a coding interview and code was written
                if (isCodingInterview && currentCode.trim() !== "" &&
                    currentCode.trim() !== `// Write your code here\nfunction example() {\n    console.log("Hello World!");\n}`) {
                    payload.candidateCode = {
                        heading: "Candidate Code to Review",
                        language: currentLanguage,
                        code: currentCode
                    };
                }

                const response = await fetch('https://conversation-prep-ai.vercel.app/api/vapi/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const { success, feedbackId: id } = await response.json();

                if (success && id) {
                    router.push(`/interview/${interviewId}/feedback`);
                } else {
                    console.log("Error saving feedback");
                    router.push("/");
                }
            } catch (error) {
                console.error("Error creating feedback:", error);
                router.push("/");
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, feedbackId, interviewId, router, type, userId, isCodingInterview, currentCode, currentLanguage]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(
                undefined,
                undefined,
                undefined,
                process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                }
            );
        } else {
            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                },
            });
        }
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    const latestMessage = messages[messages.length - 1]?.content || "";
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="AI Avatar"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/* User Profile Card */}
                <div className="card-border">
                    <div className="card-content">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width={500}
                            height={500}
                            className="rounded object-cover"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p
                            key={lastMessage}
                            className={cn(
                                "transition-opacity duration-500 opacity-0",
                                "animate-fadeIn opacity-100"
                            )}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== CallStatus.CONNECTING && "hidden"
                            )}
                        />
                        <span className="relative">
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                                ? "Call"
                                : ". . ."}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>

            {/* Code Editor - Only show for coding interviews */}
            {isCodingInterview && (
                <div className="w-full mt-6 px-4">
                    <CodeEditor
                        onCodeChange={handleCodeChange}
                        questions={questions}
                        isCodingInterview={isCodingInterview}
                    />
                </div>
            )}
        </>
    );
};

export default Agent;