"use client";

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

const NewPasswordSchema = z.object({
    newPassword: z.string().min(6, "Parola trebuie să aibă minim 6 caractere"),
});

type NewPasswordSchemaData = z.infer<typeof NewPasswordSchema>;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Obținem token-ul din URL query
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<NewPasswordSchemaData>({
        resolver: zodResolver(NewPasswordSchema),
    });

    const onSubmit = async (data: NewPasswordSchemaData) => {
        if (!token) {
            toast.error("Token invalid sau lipsă.");
            return;
        }

        setIsLoading(true);

        // 💡 Apelăm funcția Better Auth pentru a finaliza resetarea
        await authClient.resetPassword({
            token, // Trimitem token-ul primit
            newPassword: data.newPassword,
        }, {
            onRequest: () => {
                toast.loading("Se resetează parola...");
            },
            onSuccess: () => {
                toast.dismiss();
                toast.success("Parola a fost resetată cu succes! Te poți autentifica.");
                // Redirecționează către pagina de login
                router.push("/login");
            },
            onError: (ctx) => {
                toast.dismiss();
                toast.error(ctx.error.message || "Eroare la resetare. Linkul a expirat?");
            },
        });
        setIsLoading(false);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-8 bg-slate-900 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold text-white">Setează o Parolă Nouă</h2>
            <Input
                placeholder="Parolă nouă"
                type="password"
                disabled={isLoading}
                {...form.register("newPassword")}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700">
                {isLoading ? "Se resetează..." : "Setează Parola"}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Suspense fallback={<div className="text-white">Se încarcă...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}