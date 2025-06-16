import React from "react";
import Agent from "@/components/agent";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const Page = async () => {
    const user = await getCurrentUser();

    if (!user?.name || !user?.id) {
        return <div>Loading user info...</div>; // or redirect, error, etc.
    }

    return (
        <>
            <h3>Conversation Generator</h3>
            <Agent userName={user.name} userId={user.id} type="generate" />
        </>
    );
};

export default Page;
