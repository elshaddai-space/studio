// src/components/chat-message.tsx (Adapted)
"use client";

import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, BotIcon as BotAvatarIcon, Loader2 } from 'lucide-react'; // Renamed BotIcon to BotAvatarIcon

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex items-end space-x-2 py-2 animate-fade-in-message',
        isUser ? 'justify-end' : 'justify-start'
      )}
      aria-live={message.isLoading ? "off" : "polite"} // Don't announce loading messages as they change quickly
      aria-atomic="true"
    >
      {!isUser && (
        <Avatar className="h-8 w-8 self-start"> {/* Align avatar to top for multiline messages */}
          <AvatarFallback className="bg-muted text-muted-foreground">
            <BotAvatarIcon size={20} aria-label="Bot Avatar" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-3 shadow-md break-words', // Increased py for better spacing
          isUser
            ? 'ml-auto rounded-br-none bg-primary text-primary-foreground'
            : 'mr-auto rounded-bl-none bg-card text-card-foreground border' // Added border for bot messages
        )}
      >
        {message.isLoading && message.sender === 'bot' ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{message.text}</span>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        )}
        {!message.isLoading && (
           <p
            className={cn(
              'mt-1.5 text-xs', // Increased margin top
              isUser ? 'text-primary-foreground/80 text-right' : 'text-muted-foreground text-left'
            )}
          >
            {format(message.timestamp, 'HH:mm')}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 self-start"> {/* Align avatar to top for multiline messages */}
           <AvatarFallback className="bg-accent text-accent-foreground">
            <User size={20} aria-label="User Avatar" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
