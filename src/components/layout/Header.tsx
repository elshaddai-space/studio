
"use client";

import Link from 'next/link';
import { BotIcon, LogIn as LogInIconLucide, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/onboarding', label: 'Onboarding', protected: true },
    { href: '/dashboard', label: 'Dashboard', protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <BotIcon className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">FinPlatform</span>
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              {!item.protected && (
                 <Link
                  href={item.href}
                  className={cn(
                    "text-md font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )}
              <SignedIn>
                {item.protected && (
                   <Link
                    href={item.href}
                    className={cn(
                      "text-md font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </SignedIn>
            </React.Fragment>
          ))}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-primary", pathname === "/login" && "text-primary")}>
                <LogInIconLucide className="mr-1 h-4 w-4" />
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" size="sm" className={pathname === "/signup" ? "ring-2 ring-ring ring-offset-2" : ""}>
                 <UserPlus className="mr-1 h-4 w-4" />
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
