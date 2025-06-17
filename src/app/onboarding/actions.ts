// src/app/onboarding/actions.ts
"use server";

import type { BusinessDetails, OnboardingRequestPayload, OnboardingResponsePayload, OnboardingState, BusinessFieldKey } from '@/types';
import { BusinessDetailsSchema, businessTypes } from '@/lib/schemas';
import { onboardingQuestions } from '@/lib/onboardingQuestions';
import { z } from 'zod';

function validateField(fieldKey: BusinessFieldKey, value: string): { error: string | null; parsedValue: any } {
  const fieldSchema = BusinessDetailsSchema.shape[fieldKey];
  const isEmptyOptional = !onboardingQuestions.find(q => q.key === fieldKey)?.isRequired && (value === '' || value.toLowerCase() === 'skip');

  if (isEmptyOptional) {
    return { error: null, parsedValue: undefined };
  }
  
  // Special handling for enum with user-friendly input
  if (fieldKey === 'businessType') {
    const foundType = businessTypes.find(bt => bt.toLowerCase() === value.toLowerCase().trim());
    if (foundType) {
      return { error: null, parsedValue: foundType };
    }
    const safeParseResult = fieldSchema.safeParse(value);
    if (!safeParseResult.success) {
      const formattedError = safeParseResult.error.errors.map(e => e.message).join(', ');
      return { error: formattedError, parsedValue: value };
    }
     return { error: null, parsedValue: safeParseResult.data };
  }


  const safeParseResult = fieldSchema.safeParse(value);

  if (!safeParseResult.success) {
    // Flatten Zod errors into a single string.
    const formattedError = safeParseResult.error.errors.map(e => e.message).join(', ');
    return { error: formattedError, parsedValue: value };
  }
  return { error: null, parsedValue: safeParseResult.data };
}

export async function processOnboardingStep(
  payload: OnboardingRequestPayload
): Promise<OnboardingResponsePayload> {
  const { userInput, currentState } = payload;
  let { collectedData, currentQuestionIndex, fieldErrors, isComplete } = currentState;
  
  fieldErrors = {}; // Clear previous errors for the current field attempt

  const currentQuestion = onboardingQuestions[currentQuestionIndex];

  if (!currentQuestion || isComplete) {
    return {
      botResponse: "The onboarding process is already complete. Thank you!",
      updatedState: currentState,
      shouldEndConversation: true,
    };
  }

  // Validate user input for the current question
  const { error: validationError, parsedValue } = validateField(currentQuestion.key, userInput);

  if (validationError) {
    fieldErrors[currentQuestion.key] = validationError;
    const reaskMessage = `${validationError} ${currentQuestion.questionText.startsWith("Hello!") ? "" : "Could you please try again? " } ${currentQuestion.questionText}`;
    return {
      botResponse: reaskMessage,
      updatedState: { ...currentState, fieldErrors },
    };
  }

  // Input is valid, store it
  collectedData = { ...collectedData, [currentQuestion.key]: parsedValue };

  // Move to the next question
  const nextQuestionIndex = currentQuestionIndex + 1;

  if (nextQuestionIndex < onboardingQuestions.length) {
    const nextQuestion = onboardingQuestions[nextQuestionIndex];
    return {
      botResponse: nextQuestion.questionText,
      updatedState: {
        ...currentState,
        collectedData,
        currentQuestionIndex: nextQuestionIndex,
        currentQuestionKey: nextQuestion.key,
        fieldErrors: {},
      },
    };
  } else {
    // All questions answered
    isComplete = true;
    let summary = "Thank you for providing your business details!\nHere's a summary:\n";
    for (const key in collectedData) {
      const TypedKey = key as BusinessFieldKey;
      if (collectedData[TypedKey] !== undefined) {
         summary += `- ${onboardingQuestions.find(q=>q.key === TypedKey)?.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || key}: ${collectedData[TypedKey]}\n`;
      }
    }
    summary += "\nWe will get in touch with you shortly."
    
    return {
      botResponse: summary,
      updatedState: {
        ...currentState,
        collectedData,
        isComplete: true,
        currentQuestionKey: null,
        currentQuestionIndex: nextQuestionIndex, //  Should be onboardingQuestions.length
        fieldErrors: {},
      },
      shouldEndConversation: true,
    };
  }
}
