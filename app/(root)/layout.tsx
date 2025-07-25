import React, {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated} from "@/lib/actions/auth.actions";
import {redirect} from "next/navigation";

const RootLayout = async ({children}:{children:ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        redirect("/sign-in");
    }
    return (
        <div className="root-layout">
            <nav className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={30} height={32} />
                    <h2 className="text-primary-100">Conversations</h2>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-primary-100 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-600 hover:text-primary-100 transition-colors"
                    >
                        About
                    </Link>
                </div>
            </nav>
            {children}
        </div>
    )
}
export default RootLayout