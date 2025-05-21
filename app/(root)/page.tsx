import React from 'react'
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/interview-card";

const Page = () => {
    return (
        <>
            <section className="card-cta" >
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2> Get conversation ready</h2>
                    <p className="text-lg">Practice questions </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start a convo</Link>
                    </Button>
                    <Image src="/robot.png" alt="robo" width={400} height={400}  className = "max-sm:hidden"/>
                </div>
            </section>
            <section className = "flex flex-col gap-6 mt-8">
                <h2>Conversations so far</h2>
                <div className="interviews-section">
                    {dummyInterviews.map((interview) => (<InterviewCard {... interview} key = {interview.id}/>))}
                    {<p>None yet</p>}
                </div>

            </section>
            <section className = "flex flex-col gap-6 mt-8">
                <h2>Start one</h2>
                <div className="interviews-section">
                    {dummyInterviews.map((interview) => (<InterviewCard {... interview} key = {interview.id}/>))}
                    <p>none available for you</p></div>

            </section>
        </>
    )
}
export default Page
