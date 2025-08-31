'use client';

import { useEffect,useState } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Users, User, LogOut } from 'lucide-react';

import { useAuth } from '@/context/AuthContext'; // 👈 use our AuthContext

// 🔹 Theme Toggle Button
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until client is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by rendering nothing until mounted
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}


export function Header() {
  const { user, signInWithGoogle, signOutUser } = useAuth(); // 👈 get auth functions
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white dark:bg-gray-900 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              CreatorConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/directory"
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
            >
              Directory
            </Link>
            {user && (
              <Link
                href="/profile"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
              >
                My Profile
              </Link>
            )}
          </nav>

          {/* User Menu + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle /> {/* 🌙 Theme toggle */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={signInWithGoogle}>Sign in with Google</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/directory"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Directory
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              )}

              {/* Theme Toggle inside mobile menu */}
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>

              <div className="border-t pt-4 pb-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-medium text-gray-800 dark:text-gray-100">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3"
                      onClick={signOutUser}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signInWithGoogle();
                      }}
                    >
                      Sign in with Google
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
