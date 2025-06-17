import React from "react";
import Agent from "@/components/agent";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const Page = async () => {
    const user = await getCurrentUser();


    console.log(user);
    return (
        <>
            <h3>Conversation Generator</h3>
            <Agent userName={user?.name!} userId={user?.id!} type="generate" />
        </>
    );
};

export default Page;
