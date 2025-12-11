"use client"
import { AuthCard } from "@/components/authentication/auth-card"; // Importam componenta, nu layout-ul
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Mail, Lock, Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from 'next/navigation';
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";

// 1. Definim schema simplă pentru Login
const LoginSchema = z.object({
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(1, { message: "Introdu parola" }),
});

type LoginSchemaData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
   const [isLoading, setIsLoading] = useState(false)
   const router = useRouter();

   const searchParams = useSearchParams();
   const hasAccessError = searchParams.get('error'); // Citim parametrul error cel din login?error=unauthorized
   const hasAnyQuery = searchParams.toString().length > 0 // Verifică dacă există ORICE parametru

   useEffect(() => {
    if (hasAccessError === 'unauthorized') {
      toast.error('Access Denined. Please log in')
      router.replace('/login');
    } else if (hasAnyQuery &&  !hasAccessError) {
      toast.error('Un parametru necunoscut');
      router.replace('/login')
    }
   }, [hasAccessError, router]) // Rulează doar când parametrul se schimbă

   // 2. Inițializăm formularul
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


// 3. Logică Submit
  const onSubmit = async (data: LoginSchemaData) => {
    setIsLoading(true);

    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    }, {
      onSuccess: () => {
        toast.success("Te-ai autentificat cu succes!");
        router.push("/dashboard");
       
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Email sau parolă incorecte.");
        setIsLoading(false);
      }
    });
  };


  return (
    <AuthCard
      title="Welcome back"
      subtitle="Enter your details to access your account"
      footerText="Don't have an account?"
      footerActionText="Sign Up"
      footerActionHref="/register" // Aici setam linkul catre register
    >
      <div className="space-y-4">
        <button className="w-full h-11 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-medium text-sm">
          <Github className="w-5 h-5" /> Continue with GitHub
        </button>
        
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">or email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Asigura-te ca Input suporta props-ul icon daca e custom, altfel sterge icon={...} */}
          <Input 
                className="text-slate-200" 
                type="email" 
                placeholder="name@example.com"
                disabled={isLoading}
                {...register("email")}
            />
            {/* Afișăm manual eroarea pentru email */}
            {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          <Input 
                className="text-slate-200" 
                type="password" 
                placeholder="Password"
                disabled={isLoading}
                {...register("password")}
            />
            {/* Afișăm manual eroarea pentru parolă */}
            {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          
          <Button type="submit" variant="default" className="w-full cursor-pointer h-12 shadow-violet-500/25 bg-violet-600 hover:bg-violet-700 text-white">
            {isLoading? <Loader className="animate-spin"/> : "Log in"}
          </Button>
        </form>
              <Link className="text-slate-400 hover:text-slate-200" href='/forgot-password'>
              Forgot password?</Link>
      </div>
    </AuthCard>
  );
}