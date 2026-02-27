

"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from "@/lib/auth-client"; // Importăm clientul Better Auth
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast"; // Folosești react-hot-toast
import { Loader2Icon, Mail } from "lucide-react";

// Schema și Type 
const ResetSchema = z.object({
    email: z.string().email("Email invalid"),
});

type ResetSchemaData = z.infer<typeof ResetSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetSchemaData>({
        resolver: zodResolver(ResetSchema),
        defaultValues: { email: "" },
    });

    // 💡 Funcția de Submit Corecăt
    const onSubmit = async (data: ResetSchemaData) => {
        setIsLoading(true);

        try {
            // 💡 1. Apelăm metoda corectă: requestPasswordReset
            // 💡 2. Trimitem email-ul din formular: data.email
            await authClient.requestPasswordReset({
                email: data.email,
                redirectTo: "/reset-password",
            }, {
                onSuccess: () => {
                    toast.success("Email sent successfully, check your inbox!", { duration: 5000 });
                },
                onError: (ctx) => {
                    // Afișăm eroarea primită de la server
                    toast.error(ctx.error.message || "An error occurred.");
                },
            });
        } catch (error) {
            console.error(error);
            toast.error("Eroare de rețea. Te rugăm să încerci din nou.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md relative animate-in zoom-in-95 duration-300">


            <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    {/* ... Textul ... */}
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                    <p className="text-slate-400 text-sm">Enter your email address and we'll send you a link to reset it.</p>
                </div>

                {/* 💡 SINTAXA CORECTĂ: handleSubmit(onSubmit) pe tag-ul form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Input Email */}
                    <Input
                        className="text-slate-200"
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        {...register('email')}
                    />
                    {/* 💡 Afișare manuală a erorilor Zod */}
                    {errors.email?.message && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}

                    {/* Butonul de Submit */}
                    {/* 💡 Nu mai avem nevoie de onClick=onSubmit aici, e preluat de form */}
                    <Button
                        type="submit" // Tipul trebuie să fie 'submit'
                        variant='destructive'
                        disabled={isLoading}
                        className="cursor-pointer mx-auto w-full flex items-center justify-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        {isLoading ? <Loader2Icon className="animate-spin" /> : "Send Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}