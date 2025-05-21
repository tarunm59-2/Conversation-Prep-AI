"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.actions";
import { auth } from "@/firebase/client";

type FormType = "sign-in" | "sign-up";

// Schema generator based on form type
const authFormSchema = (type: FormType) =>
    type === "sign-up"
        ? z.object({
            name: z.string().min(3).max(20),
            email: z.string().email(),
            password: z.string().min(3).max(20),
        })
        : z.object({
            email: z.string().email(),
            password: z.string().min(3).max(20),
        });

const AuthForm = ({ kind }: { kind: FormType }) => {
    const formSchema = authFormSchema(kind);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(kind);
        try {
            if (kind === "sign-up") {
                const { name, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await signUp({ uid: userCredentials.user.uid, name: name!, email, password });
                if (!result?.success) {
                    toast.error("Error creating account");
                    return;
                }
                toast.success("Account created");
                router.push("/sign-in");
            } else {
                const { email, password } = values;
                console.log(email, password);
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                if (!userCredentials.user) {
                    toast.error("Error signing in");
                    return;
                }
                const idToken = await userCredentials.user.getIdToken();
                if (!idToken) {
                    toast.error("Error signing in");
                    return;
                }
                const signInResult = await signIn({ email, idToken });

                // Check if sign-in was successful
                if (signInResult && !signInResult.success) {
                    toast.error(signInResult.message || "Error signing in");
                    return;
                }

                toast.success("Signed in");
                router.push("/");
            }
        } catch (error: any) {
            console.error(error);
            // More specific error handling
            if (error.code === 'auth/user-not-found') {
                toast.error("No account found with this email");
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect password");
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email address");
            } else {
                toast.error("Error submitting");
            }
        }
    };

    const isSignin = () => kind === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.png" alt="logo" width={30} height={38} />
                    <h2 className="text-primary-100">Conversations</h2>
                </div>
                <h3>Conversations prepping with AI</h3>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 w-full mt-4 form"
                >
                    {!isSignin() && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="btn"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? (isSignin() ? "Signing in..." : "Signing up...")
                            : (isSignin() ? "Sign in" : "Sign up")
                        }
                    </Button>
                </form>
            </Form>

            <p className="text-center mt-4">
                {isSignin() ? "No account yet?" : "Already have an account?"}
                <Link
                    href={isSignin() ? "/sign-up" : "/sign-in"}
                    className="font-bold text-user-primary ml-1"
                >
                    {isSignin() ? "Sign up" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;