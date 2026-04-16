"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/authentication/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader, Mail } from "lucide-react";

const ResetSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ResetSchemaData = z.infer<typeof ResetSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetSchemaData>({
        resolver: zodResolver(ResetSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ResetSchemaData) => {
        setIsLoading(true);

        try {
            await authClient.requestPasswordReset({
                email: data.email,
                redirectTo: "/reset-password",
            }, {
                onSuccess: () => {
                    toast.success("Reset link sent! Check your inbox.", { duration: 5000 });
                    setEmailSent(true);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "An error occurred. Please try again.");
                },
            });
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard
            subtitle="Enter your email and we'll send you a reset link"
            footerText="Remember your password?"
            footerActionText="Log in"
            footerActionHref="/login"
        >
            <div className="space-y-4">
                {/* Mail icon */}
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                </div>

                {emailSent ? (
                    <div className="text-center space-y-3 py-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                            ✓ Email sent successfully
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Check your inbox for the password reset link. If you don&apos;t see it, check your spam folder.
                        </p>
                        <Button
                            onClick={() => setEmailSent(false)}
                            variant="outline"
                            className="mt-2 text-slate-400 border-slate-800 hover:bg-slate-800"
                        >
                            Send again
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-slate-400 text-xs font-medium mb-1.5 block">Email Address</label>
                            <Input
                                className="text-slate-200"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isLoading}
                                {...register('email')}
                            />
                            {errors.email?.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer h-12 shadow-violet-500/25 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Send Reset Link
                                </>
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </AuthCard>
    );
}