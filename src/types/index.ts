import type { z } from 'zod';
import type { BusinessDetailsSchema } from '@/lib/schemas';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean; // Optional: for showing loading indicator for bot message
}

export type BusinessDetails = z.infer<typeof BusinessDetailsSchema>;

export type BusinessFieldKey = keyof BusinessDetails;

export interface OnboardingQuestion {
  key: BusinessFieldKey;
  questionText: string;
  isRequired: boolean;
  isSensitive?: boolean; // For masking input, e.g. passwords, not used here but good for future
  validate?: (value: string) => string | null; // Specific validation if needed beyond Zod
  enumOptions?: readonly string[]; // For businessType
}

export interface OnboardingState {
  collectedData: Partial<BusinessDetails>;
  currentQuestionKey: BusinessFieldKey | null;
  currentQuestionIndex: number; // To track progress through defined questions
  isComplete: boolean;
  fieldErrors: Partial<Record<BusinessFieldKey, string>>; // Store validation errors per field
  history: Message[]; // To keep track of conversation for context if needed by AI later
}

export interface OnboardingRequestPayload {
  userInput: string;
  currentState: OnboardingState;
}

export interface OnboardingResponsePayload {
  botResponse: string;
  updatedState: OnboardingState;
  shouldEndConversation?: boolean; // If all data collected or major error
}
