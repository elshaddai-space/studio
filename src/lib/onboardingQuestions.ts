import type { OnboardingQuestion, BusinessFieldKey } from '@/types';
import { businessTypes } from './schemas';

export const onboardingQuestions: ReadonlyArray<OnboardingQuestion> = [
  {
    key: 'businessName',
    questionText: "Hello! Let's get your business onboarded. What is the name of your business?",
    isRequired: true,
  },
  {
    key: 'businessType',
    questionText: `Great! What type of business is it? Please choose one: ${businessTypes.join(', ')}.`,
    isRequired: true,
    enumOptions: businessTypes,
  },
  {
    key: 'contactPerson',
    questionText: "What is the name of the primary contact person for this business?",
    isRequired: true,
  },
  {
    key: 'phone',
    questionText: "Understood. What is your business phone number? Please use the format +91XXXXXXXXXX (e.g., +919876543210).",
    isRequired: true,
  },
  {
    key: 'gstin',
    questionText: "Thanks! What is your GSTIN? (e.g., 22AAAAA0000A1Z5). This is optional, you can type 'skip' or press Enter if you don't have one.",
    isRequired: false,
  },
  {
    key: 'email',
    questionText: "Almost done! What is your business email address? (e.g., contact@example.com). This is optional, you can type 'skip' or press Enter to skip.",
    isRequired: false,
  },
];

export const getInitialQuestion = (): OnboardingQuestion => onboardingQuestions[0];

export const getNextQuestion = (currentKey: BusinessFieldKey | null): OnboardingQuestion | null => {
  if (!currentKey) return getInitialQuestion();
  const currentIndex = onboardingQuestions.findIndex(q => q.key === currentKey);
  if (currentIndex === -1 || currentIndex === onboardingQuestions.length - 1) {
    return null; // No next question or current key not found
  }
  return onboardingQuestions[currentIndex + 1];
};
