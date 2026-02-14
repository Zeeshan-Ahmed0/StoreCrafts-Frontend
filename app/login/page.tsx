import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#00A651] to-[#8CC63F] p-4">
      {/* Background Pattern */}
      <div className="absolute right-[-10%] top-1/2 h-[120%] w-[60%] -translate-y-1/2 opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-white">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
