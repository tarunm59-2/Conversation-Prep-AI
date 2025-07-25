import React from 'react'
import dayjs from "dayjs";
import Image from 'next/image';
import {getRandomInterviewCover} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
const InterviewCard = ({id,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normaizedType = /mix/gi.test(type) ? "mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM DD, YYYY");


    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-800 ">
                        <p className = "badge-text">{normaizedType}</p>
                    </div>
                    <Image src="tech.svg" alt="cover image" width={90} height={90}  className = "rounded-full object-fit size-[90px]"/>
                    <h3 className="mt-5 capitalize">{role} Conversation</h3>
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2">
                            <Image src = "/calendar.svg" alt="avatar" width={22} height={22}/>
                            <p>{formattedDate}</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image src = "/star.svg" alt="star" width={22} height={22}/>
                            <p>{feedback?.totalScore || '---'}/100</p>
                        </div>

                    </div>


                </div>
                <div className="flex flex-row justify-between ">

                    <Button asChild className="btn-primary">
                        <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                            {feedback? 'Check-res' : 'Take your interview!'}
                        </Link>
                    </Button>
                </div>
            </div>
            </div>

    )
}
export default InterviewCard
