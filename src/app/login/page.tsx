"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Dummy login
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-background relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] p-4">
        <div className="bg-white dark:bg-card rounded-2xl border border-zinc-200 dark:border-border shadow-xl shadow-black/5 overflow-hidden">
          
          {/* Main Form Content */}
          <div className="p-6 pt-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-medium text-xs">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border-zinc-200 dark:border-border placeholder:text-zinc-400 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-medium text-xs">Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-lg border-zinc-200 dark:border-border pr-10 placeholder:text-zinc-400 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#18181b] hover:bg-[#27272a] text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-card px-2 text-zinc-400 font-medium">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button type="button" variant="outline" className="w-full h-11 rounded-lg border-zinc-200 dark:border-border text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
              <Button type="button" variant="outline" className="w-full h-11 rounded-lg border-zinc-200 dark:border-border text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <svg className="w-5 h-5 mr-2 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-1.99.04-3.834 1.159-4.858 2.946-2.072 3.606-.528 8.948 1.492 11.87 1.002 1.455 2.154 3.109 3.738 3.056 1.505-.054 2.102-.973 3.916-.973 1.815 0 2.348.973 3.932.947 1.637-.027 2.628-1.5 3.618-2.946 1.15-1.685 1.623-3.32 1.644-3.407-.035-.015-3.195-1.229-3.226-4.887-.025-3.072 2.508-4.545 2.62-4.6-1.501-2.196-3.829-2.496-4.664-2.548-1.956-.134-3.91 1.205-4.252 1.582zM15.42 4.212c.844-1.026 1.411-2.457 1.258-3.882-1.229.049-2.721.821-3.593 1.838-.783.896-1.463 2.355-1.282 3.754 1.373.107 2.769-.684 3.617-1.71z" />
                </svg>
                Continue with Apple
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
