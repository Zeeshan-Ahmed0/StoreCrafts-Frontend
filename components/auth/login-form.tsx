"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean(),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useNotification();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          "Invalid credentials. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }

      const token =
        data?.token ||
        data?.accessToken ||
        data?.access_token ||
        data?.jwt ||
        data?.authToken ||
        data?.data?.token;

      if (token) {
        auth.login(token);
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        // No token returned - still consider success if API indicates so
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.message || "An unexpected error occurred. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-2xl border-none rounded-xl overflow-hidden">
      <CardHeader className="space-y-4 pt-8 px-8">
        <div className="flex justify-start">
          <div className="relative h-12 w-40">
            <Image
              src="/assets/acplus-logo.jpg"
              alt="ACPlus Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Login to continue
          </h2>
          <p className="text-gray-500">Please login with your credentials</p>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {/* {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="e.g. johndoe@email.com"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                    </div>
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
                  <FormLabel className="font-semibold text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="enter your password"
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                    <FormLabel className="text-gray-600 font-normal cursor-pointer">
                      Remember Me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forget Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Login <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
