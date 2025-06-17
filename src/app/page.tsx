"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BotIcon as PageBotIcon } from 'lucide-react'; // Renamed to avoid conflict with BotIcon in ChatMessage
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { ChatCompleteButton } from '@/components/chat-complete-button';
import type { Message } from '@/types';
import { useToast } from "@/hooks/use-toast";

const MAX_USER_MESSAGES = 3;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConversationEnded, setIsConversationEnded] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const handleSendMessage = (text: string) => {
    if (isConversationEnded) return;

    addMessage(text, 'user');
    const newCount = userMessagesCount + 1;
    setUserMessagesCount(newCount);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I'm a simple bot. Thanks for your message!";
      if (newCount >= MAX_USER_MESSAGES) {
        botResponse = "Our chat is now concluding. You can submit the conversation when you're ready.";
        setIsConversationEnded(true);
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        botResponse = "Hi there! How can I help you today?";
      } else if (text.toLowerCase().includes('help')) {
        botResponse = "Sure, what do you need assistance with?";
      }
      addMessage(botResponse, 'bot');
    }, 1000);
  };

  const handleSubmitConversation = () => {
    // Functionality for submitting the conversation is not defined
    // For now, just show a toast message
    toast({
      title: "Conversation Submitted",
      description: "Your chat has been logged. (This is a demo action)",
      variant: "default", 
    });
    // Potentially reset the chat or navigate away
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b shadow-sm sticky top-0 bg-background z-10">
        <h1 className="text-2xl font-headline font-semibold flex items-center text-primary">
          <PageBotIcon className="mr-3 h-7 w-7" />
          Chat Complete
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ScrollArea className="h-full pr-4"> {/* Added pr-4 to prevent scrollbar overlap */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </main>

      <footer className="p-4 border-t bg-background sticky bottom-0 z-10">
        <ChatInput onSendMessage={handleSendMessage} disabled={isConversationEnded} />
        {isConversationEnded && (
          <div className="mt-4 animate-fade-in-message">
            <ChatCompleteButton onClick={handleSubmitConversation} />
          </div>
        )}
      </footer>
    </div>
  );
}
