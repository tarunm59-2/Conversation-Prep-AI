'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists"
            }
        }
        await db.collection("users").doc(uid).set({
            name,
            email
        })
        return {
            success: true,
            message: "User created"
        }
    }
    catch (e: any) {
        console.log("error creating user", e)
        if (e && typeof e === 'object' && 'code' in e && e.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "Email already exists"
            }
        }
        return {
            success: false,
            message: "Failed to create account"
        }
    }
}

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 30, // Match the expiration time
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: '/',
        sameSite: 'lax'
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        // Verify the ID token first
        const decodedToken = await auth.verifyIdToken(idToken);
        if (!decodedToken) {
            return {
                success: false,
                message: "Invalid token"
            }
        }

        // Get user by email to verify they exist in your system
        const user = await auth.getUserByEmail(email);
        if (!user) {
            return {
                success: false,
                message: "User not found"
            }
        }

        // Set the session cookie
        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Signed in successfully"
        }

    } catch (e: any) {
        console.log("Sign in error:", e);
        return {
            success: false,
            message: e.message || "Failed to sign in"
        }
    }
}


export async function getCurrentUser