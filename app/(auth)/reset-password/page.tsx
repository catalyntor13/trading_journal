"use client";

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/authentication/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

const NewPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type NewPasswordSchemaData = z.infer<typeof NewPasswordSchema>;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewPasswordSchemaData>({
        resolver: zodResolver(NewPasswordSchema),
    });

    const onSubmit = async (data: NewPasswordSchemaData) => {
        if (!token) {
            toast.error("Invalid or missing token. Please request a new reset link.");
            return;
        }

        setIsLoading(true);

        await authClient.resetPassword({
            token,
            newPassword: data.newPassword,
        }, {
            onRequest: () => {
                toast.loading("Resetting your password...");
            },
            onSuccess: () => {
                toast.dismiss();
                toast.success("Password reset successfully! You can now log in.");
                router.push("/login");
            },
            onError: (ctx) => {
                toast.dismiss();
                toast.error(ctx.error.message || "Reset failed. The link may have expired.");
            },
        });
        setIsLoading(false);
    };

    return (
        <AuthCard
            subtitle="Enter your new password below"
            footerText="Remember your password?"
            footerActionText="Log in"
            footerActionHref="/login"
        >
            <div className="space-y-4">
                {/* Security icon */}
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block">New Password</label>
                        <Input
                            className="text-slate-200"
                            type="password"
                            placeholder="Enter your new password"
                            disabled={isLoading}
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block">Confirm Password</label>
                        <Input
                            className="text-slate-200"
                            type="password"
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer h-12 shadow-violet-500/25 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Set New Password"}
                    </Button>
                </form>

                <p className="text-slate-600 text-xs text-center leading-relaxed">
                    Make sure your password is at least 8 characters and includes a mix of letters and numbers.
                </p>
            </div>
        </AuthCard>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center"><Loader className="animate-spin text-orange-500 w-8 h-8" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}