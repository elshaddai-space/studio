// src/components/chat-input.tsx (Adapted)
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, CornerDownLeft } from 'lucide-react'; // Added Enter icon for guidance

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    } else if (inputValue === '' && !disabled && (placeholder?.toLowerCase().includes("skip") || placeholder?.toLowerCase().includes("press enter"))) {
      // Allow sending empty message if placeholder suggests skipping (e.g. for optional fields)
      onSendMessage(''); // Send empty string to signify skip
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent default to avoid newline in some cases, then submit
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 relative">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 rounded-full px-4 py-3 text-sm focus-visible:ring-primary pr-12" // Increased padding right for icon
        disabled={disabled}
        aria-label="Chat input"
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8"
        disabled={disabled || (!inputValue.trim() && !(placeholder?.toLowerCase().includes("skip") || placeholder?.toLowerCase().includes("press enter")))}
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </Button>
      {!inputValue && (
         <CornerDownLeft size={16} className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground opacity-70 pointer-events-none md:hidden" />
      )}
    </form>
  );
}
