
// src/app/(auth)/login/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.36))] py-12">
      <div className="text-center mb-8">
        <LogInIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-headline text-primary">Welcome Back</h1>
        <p className="text-muted-foreground">Log in to access your FinPlatform dashboard.</p>
      </div>
      <SignIn path="/login" routing="path" signUpUrl="/signup" forceRedirectUrl="/dashboard" />
    </div>
  );
}
