import React from 'react'
import Image from 'next/image'
import {cn} from "@/lib/utils";


interface AgentProps {
    userName: string,
    userId?: string,
    type?: string
}

const Agent = ({userName, userId, type}: AgentProps) => {
    const messages = [
        'Whats your name',
        "my name is tarun"
    ]
    const lastMessage = messages[messages.length - 1]
    return (
        <>
            <div className="call-view">
                <div className="card-interview">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="avatar"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        <span className="animate-speak"/>
                    </div>
                    <h3>Here is the interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="user-avatar"
                            width={550}
                            height={550}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastMessage}
                           className={cn('transition-opacity duration-500 opacity-0,animate fade-in opacity-100')}>{lastMessage}</p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                <button className="btn-disconnect">Call Action</button>
            </div>
        </>
    )
}

export default Agent
