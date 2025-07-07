import React from "react";
import Agent from "@/components/agent";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const interview = await getInterviewById(id);
    const user = await getCurrentUser();

    if (!interview) {
        redirect("/");
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Interview Assistant</h2>
            <Agent
                userName={user?.name!}
                userId={user?.id}
                interviewId={id}
                type="interview"
                questions={interview.questions}
                role = {interview.role}

            />
        </div>
    );
};

export default Page;
