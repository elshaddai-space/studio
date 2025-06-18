
// src/app/(auth)/actions.ts
"use server";

import { auth } from "@/lib/firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { redirect } from 'next/navigation';
import { LoginFormSchema, SignupFormSchema, type LoginFormValues, type SignupFormValues } from "@/lib/schemas";
import { z } from "zod";

interface ActionResult {
  success: boolean;
  error?: string | null;
}

export async function signUpUser(values: SignupFormValues): Promise<ActionResult> {
  try {
    const validatedFields = SignupFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Invalid form data." };
    }
    const { name, email, password } = validatedFields.data;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }
    // Redirect handled by client-side after successful signup
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Signup failed. Please try again." };
  }
}

export async function signInUser(values: LoginFormValues): Promise<ActionResult> {
  try {
    const validatedFields = LoginFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Invalid form data." };
    }
    const { email, password } = validatedFields.data;

    await signInWithEmailAndPassword(auth, email, password);
    // Redirect handled by client-side after successful login
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Login failed. Please check your credentials." };
  }
}

export async function signOutUser(): Promise<ActionResult> {
  try {
    await signOut(auth);
    // Client-side will handle redirect after signOut via AuthContext
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Logout failed. Please try again." };
  }
}
