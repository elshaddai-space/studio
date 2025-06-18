
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BotIcon as PageBotIcon, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message'; 
import { ChatInput } from '@/components/chat-input'; 
import type { Message, OnboardingState } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { onboardingQuestions } from '@/lib/onboardingQuestions';
import { processOnboardingStep } from './actions'; 
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk

const initialBotMessage: Message = {
  id: crypto.randomUUID(),
  text: onboardingQuestions[0].questionText,
  sender: 'bot',
  timestamp: new Date(),
};

const initialOnboardingState: OnboardingState = {
  collectedData: {},
  currentQuestionKey: onboardingQuestions[0].key,
  currentQuestionIndex: 0,
  isComplete: false,
  fieldErrors: {},
  history: [initialBotMessage],
};

export default function OnboardingPage() {
  const { isSignedIn, isLoaded } = useUser(); // Get user and loading state from Clerk
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(initialOnboardingState);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', isLoadingMsg: boolean = false) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date(),
      isLoading: isLoadingMsg,
    };
    setMessages((prevMessages) => {
      if (isLoadingMsg && sender === 'bot') {
        const filteredMessages = prevMessages.filter(m => !(m.sender === 'bot' && m.isLoading));
        return [...filteredMessages, newMessage];
      }
      const filteredMessages = prevMessages.filter(m => !(m.sender === 'bot' && m.isLoading));
      return [...filteredMessages, newMessage];
    });
    return newMessage;
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (onboardingState.isComplete || isLoading || !isSignedIn) return; // Prevent action if not signed in

    addMessage(text, 'user');
    setIsLoading(true);
    addMessage("Thinking...", 'bot', true); 

    try {
      const response = await processOnboardingStep({
        userInput: text,
        currentState: onboardingState,
      });

      setMessages(prev => prev.filter(m => !(m.sender ==='bot' && m.isLoading)));
      addMessage(response.botResponse, 'bot');
      setOnboardingState(response.updatedState);

      if (response.updatedState.isComplete) {
        toast({
          title: "Onboarding Complete!",
          description: "Your business details have been collected.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error processing onboarding step:", error);
      setMessages(prev => prev.filter(m => !(m.sender ==='bot' && m.isLoading)));
      addMessage("Sorry, something went wrong. Please try again.", 'bot');
      toast({
        title: "Error",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onboardingState, isLoading, toast, isSignedIn]);

  if (!isLoaded) { 
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.36))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If middleware is set up correctly, this page shouldn't render if not signed in.

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-2xl mx-auto bg-background shadow-xl rounded-lg border my-4">
      <header className="p-4 border-b shadow-sm sticky top-0 bg-card z-10 rounded-t-lg">
        <h1 className="text-xl font-headline font-semibold flex items-center text-primary">
          <PageBotIcon className="mr-3 h-6 w-6" />
          Business Onboarding Assistant
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </main>

      <footer className="p-4 border-t bg-card sticky bottom-0 z-10 rounded-b-lg">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={onboardingState.isComplete || isLoading || !isSignedIn}
          placeholder={
            isLoading ? "Processing..." : 
            onboardingState.isComplete ? "Onboarding finished. Thank you!" : 
            !isSignedIn ? "Please sign in to start onboarding." : "Type your answer..."
          }
        />
         {isLoading && <Loader2 className="animate-spin h-4 w-4 text-muted-foreground absolute right-20 bottom-7" />}
      </footer>
    </div>
  );
}
