// src/app/dashboard/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { deleteBusinessById } from '@/lib/db';

export async function deleteBusiness(id: number): Promise<{ success: boolean; message?: string }> {
  if (!id) {
    return { success: false, message: 'Business ID is required.' };
  }
  try {
    await deleteBusinessById(id);
    revalidatePath('/dashboard'); // Revalidate the dashboard page to reflect changes
    return { success: true };
  } catch (error) {
    console.error('Failed to delete business:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete business: ${errorMessage}` };
  }
}
