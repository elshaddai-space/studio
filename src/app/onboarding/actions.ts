// src/app/onboarding/actions.ts
"use server";

import type { OnboardingRequestPayload, OnboardingResponsePayload, OnboardingState, BusinessFieldKey, BusinessDetailsBase } from '@/types';
import { BusinessDetailsSchema, businessTypes } from '@/lib/schemas';
import { onboardingQuestions } from '@/lib/onboardingQuestions';
import { insertBusinessDetails } from '@/lib/db'; // Import DB function
import { z } from 'zod';

function validateField(fieldKey: BusinessFieldKey, value: string): { error: string | null; parsedValue: any } {
  const fieldSchema = BusinessDetailsSchema.shape[fieldKey];
  const isEmptyOptional = !onboardingQuestions.find(q => q.key === fieldKey)?.isRequired && (value === '' || value.toLowerCase() === 'skip');

  if (isEmptyOptional) {
    return { error: null, parsedValue: undefined };
  }
  
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
  
  fieldErrors = {};

  const currentQuestion = onboardingQuestions[currentQuestionIndex];

  if (!currentQuestion || isComplete) {
    return {
      botResponse: "The onboarding process is already complete. Thank you!",
      updatedState: currentState,
      shouldEndConversation: true,
    };
  }

  const { error: validationError, parsedValue } = validateField(currentQuestion.key, userInput);

  if (validationError) {
    fieldErrors[currentQuestion.key] = validationError;
    const reaskMessage = `${validationError} ${currentQuestion.questionText.startsWith("Hello!") ? "" : "Could you please try again? " } ${currentQuestion.questionText}`;
    return {
      botResponse: reaskMessage,
      updatedState: { ...currentState, fieldErrors },
    };
  }

  collectedData = { ...collectedData, [currentQuestion.key]: parsedValue };

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
    isComplete = true;
    const finalData = collectedData as BusinessDetailsBase;

    try {
      await insertBusinessDetails(finalData); // Save to database
      let summary = "Thank you for providing your business details! Your information has been saved.\nHere's a summary:\n";
      for (const key in finalData) {
        const typedKey = key as BusinessFieldKey;
        if (finalData[typedKey] !== undefined) {
           summary += `- ${onboardingQuestions.find(q=>q.key === typedKey)?.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || key}: ${finalData[typedKey]}\n`;
        }
      }
      summary += "\nWe will get in touch with you shortly.";
      
      return {
        botResponse: summary,
        updatedState: {
          ...currentState,
          collectedData,
          isComplete: true,
          currentQuestionKey: null,
          currentQuestionIndex: nextQuestionIndex,
          fieldErrors: {},
        },
        shouldEndConversation: true,
      };
    } catch (dbError: any) {
      console.error("Database submission error:", dbError);
      return {
        botResponse: "We encountered an issue saving your details. Please try completing the onboarding again later. Our team has been notified.",
        updatedState: { 
            ...currentState, 
            collectedData, // Keep collected data in case user wants to retry later or for diagnostics
            isComplete: false, // Mark as not complete so they could potentially retry
            fieldErrors: { submit: "Failed to save to database." } 
        },
        shouldEndConversation: true, // End conversation due to error
      };
    }
  }
}
