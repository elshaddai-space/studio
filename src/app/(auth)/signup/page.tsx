
// src/app/(auth)/signup/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";
import { KeyRound } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.36))] py-12">
      <div className="text-center mb-8">
        <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-headline text-primary">Create your Account</h1>
        <p className="text-muted-foreground">Enter your details to get started with FinPlatform.</p>
      </div>
      <SignUp path="/signup" routing="path" signInUrl="/login" forceRedirectUrl="/dashboard" />
    </div>
  );
}
