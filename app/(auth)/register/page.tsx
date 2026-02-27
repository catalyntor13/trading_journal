"use client"

import { AuthCard } from "@/components/authentication/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
// Am importat si User pentru iconita de la nume
import { FaGoogle } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import toast from 'react-hot-toast';



export default function RegisterPage() {

  const [isLoading, setIsLoading] = useState(false);



  // 1. Definim schema de validare Zod
  const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Name is required, min 2 characters' }),
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password is required, min 6 characters' }),
  });

  // 2. Extragem tipul de date din schema

  type RegisterSchemaData = z.infer<typeof RegisterSchema>;

  // 3. Inițializăm formularul
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // 4. Funcția de submit
  const onSubmit = async (data: RegisterSchemaData) => {
    setIsLoading(true);

    // CORECȚIE 1: Folosim signUp.email
    await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/login?verified=true"
    }, {
      onRequest: () => {

      },
      onSuccess: () => {
        toast.success("Account created successfully, check your email to verify your account!");
        setIsLoading(false);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "An error occurred.");
        setIsLoading(false);
      }
    });

  }


  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <AuthCard

      subtitle="Create your account"
      footerText="Already have an account?"
      footerActionText="Sign In"
      footerActionHref="/login" // Aici facem legătura inversă către Login
    >
      <div className="space-y-4">
        {/* Butonul de GitHub rămâne (poate fi folosit și la sign up) */}
        <button onClick={handleGoogleSignIn} className="w-full h-11 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-medium text-sm">
          <FaGoogle className="w-5 h-5 cursor-pointer" /> Sign up with Google
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">or register with email</span>
          </div>
        </div>


        {/* Formularul cu Inputuri */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Câmp nou pentru Nume Complet */}
          <div className="space-y-1">
            <Input
              className="text-slate-100"
              // icon={User} -> Daca ai Input customizat cu icon
              type="text"
              placeholder="Full Name"

              disabled={isLoading}
              {...register("name")}
            />
            {errors.name?.message}
          </div>

          <div className="space-y-1">
            <Input
              className="text-slate-100"

              type="email"
              placeholder="name@example.com"

              disabled={isLoading}
              {...register("email")}

            />
            {errors.email?.message}
          </div>

          <div className="space-y-1">
            <Input
              className="text-slate-100"
              // icon={Lock}
              type="password"
              placeholder="Create Password"

              disabled={isLoading}
              {...register("password")}
            />
            {errors.password?.message}
          </div>

          <Button type="submit" disabled={isLoading} variant="default" className="w-full h-12 shadow-violet-500/25 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
            {isLoading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}