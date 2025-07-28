import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InterviewCard from "@/components/interview-card";
import ResumeUploadButton from "@/components/ResumeUploadButton"; // ADD THIS
import {
    getCurrentUser,
    getInterviewByUserId,
    getLatestInterviews
} from "@/lib/actions/auth.actions";

const Page = async () => {
    const user = await getCurrentUser();

    const [userInterviews, latestInterviews] = await Promise.all([
        getInterviewByUserId(user?.id!),
        getLatestInterviews({ userId: user?.id! })
    ]);

    const hasPastInterviews = userInterviews.length > 0;
    const hasUpcomingInterviews = latestInterviews.length > 0;

    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get conversation ready</h2>
                    <p className="text-lg">Practice questions</p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Setup your own interview!</Link>
                    </Button>
                    <ResumeUploadButton user={user} /> {/* ADD THIS */}
                    <Image
                        src="/robot.png"
                        alt="robo"
                        width={400}
                        height={400}
                        className="max-sm:hidden"
                    />
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Conversations so far</h2>
                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews.map((interview) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p>None yet</p>
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Start one</h2>
                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        latestInterviews.map((interview) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p>None yet</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Page;