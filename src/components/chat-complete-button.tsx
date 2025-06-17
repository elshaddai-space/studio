"use client";

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ChatCompleteButtonProps {
  onClick: () => void;
}

export function ChatCompleteButton({ onClick }: ChatCompleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
      aria-label="Submit Conversation"
    >
      <CheckCircle className="mr-2 h-5 w-5" />
      Submit Conversation
    </Button>
  );
}
