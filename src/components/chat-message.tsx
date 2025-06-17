"use client";

import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, BotIcon } from 'lucide-react'; // Changed Bot to BotIcon as Bot might be a reserved name or a component

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex animate-fade-in-message items-end space-x-2 py-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <BotIcon size={20} aria-label="Bot Avatar" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-2 shadow-md',
          isUser
            ? 'ml-auto rounded-br-none bg-primary text-primary-foreground'
            : 'mr-auto rounded-bl-none bg-card text-card-foreground'
        )}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={cn(
            'mt-1 text-xs',
            isUser ? 'text-primary-foreground/80 text-right' : 'text-muted-foreground text-left'
          )}
        >
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
           <AvatarFallback className="bg-accent text-accent-foreground">
            <User size={20} aria-label="User Avatar" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
