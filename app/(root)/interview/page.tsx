import React from 'react'
import Agent  from "@/components/agent";
const Page = () => {
    return (
        <>
            <h3>
                Conversation Generator
            </h3>
            <Agent userName = "You" userId = "user1" type="generate"/>
        </>
    )
}
export default Page
