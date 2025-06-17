import type { z } from 'zod';
import type { BusinessDetailsSchema } from '@/lib/schemas';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean; // Optional: for showing loading indicator for bot message
}

// Base type for data collection
export type BusinessDetailsBase = z.infer<typeof BusinessDetailsSchema>;

// Type for data stored in and retrieved from the database
export interface BusinessDetails extends BusinessDetailsBase {
  id?: number; // Optional because it's not present during collection, but is in DB
  createdAt?: Date; // Optional for the same reason
}

export type BusinessFieldKey = keyof BusinessDetailsBase;

export interface OnboardingQuestion {
  key: BusinessFieldKey;
  questionText: string;
  isRequired: boolean;
  isSensitive?: boolean;
  validate?: (value: string) => string | null;
  enumOptions?: readonly string[];
}

export interface OnboardingState {
  collectedData: Partial<BusinessDetailsBase>; // Use Base here as ID/createdAt not part of collection
  currentQuestionKey: BusinessFieldKey | null;
  currentQuestionIndex: number;
  isComplete: boolean;
  fieldErrors: Partial<Record<BusinessFieldKey, string>>;
  history: Message[];
}

export interface OnboardingRequestPayload {
  userInput: string;
  currentState: OnboardingState;
}

export interface OnboardingResponsePayload {
  botResponse: string;
  updatedState: OnboardingState;
  shouldEndConversation?: boolean;
}
