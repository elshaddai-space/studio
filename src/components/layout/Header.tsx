
"use client";

import Link from 'next/link';
import { BotIcon, LogOut, UserPlus, LogIn as LogInIconLucide } from 'lucide-react'; 
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { signOutUser } from '@/app/(auth)/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/'); // Redirect to home page after logout
    } else {
      toast({
        title: "Logout Failed",
        description: result.error || "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: '/', label: 'Home', public: true },
    { href: '/onboarding', label: 'Onboarding', public: false },
    { href: '/dashboard', label: 'Dashboard', public: false },
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
            (item.public || user) && ( // Show item if public or user is logged in
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-md font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          ))}
          {user ? (
            <div className="flex items-center space-x-2">
              {user.displayName && <span className="text-sm text-muted-foreground hidden md:inline">Hi, {user.displayName}!</span>}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-primary">
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-primary", pathname === "/login" && "text-primary")}>
                  <LogInIconLucide className="mr-1 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className={pathname === "/signup" ? "ring-2 ring-ring ring-offset-2" : ""}>
                   <UserPlus className="mr-1 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
