// src/app/reset-password/[token]/page.tsx

"use client";

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useState } from "react";

const NewPasswordSchema = z.object({
  newPassword: z.string().min(6, "Parola trebuie să aibă minim 6 caractere"),
});

type NewPasswordSchemaData = z.infer<typeof NewPasswordSchema>;

export default function ResetPasswordPage() {
    const { token } = useParams(); // Obținem token-ul din URL
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<NewPasswordSchemaData>({
        resolver: zodResolver(NewPasswordSchema),
    });

    const onSubmit = async (data: NewPasswordSchemaData) => {
        setIsLoading(true);

        // 💡 Apelăm funcția Better Auth pentru a finaliza resetarea
        await authClient.resetPassword({
            token: token as string, // Trimitem token-ul primit
            newPassword: data.newPassword,
        }, {
            onRequest: () => {
                toast.loading("Se resetează parola...");
            },
                
            onSuccess: () => {
                toast.success("Parola a fost resetată cu succes! Te poți autentifica.");
                // Redirecționează către pagina de login
                // router.push("/login"); 
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || "Eroare la resetare. Linkul a expirat?");
            },
        });
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
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
        </div>
    );
}