'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Moon, Sun, Users, User, LogOut, Menu, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth } from '@/context/AuthContext';

// 🔹 Theme Toggle Button
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}

export function Header() {
  const { user, role, signOutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white dark:bg-gray-900 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              CreatorConnect
            </span>
          </Link>

          {/* Center: Navigation */}
         {/* Center: Navigation */}
<nav className="hidden md:flex items-center space-x-8 -ml-24">
  <Link
    href="/directory"
    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
  >
    Creator Directory
  </Link>

  {/* Role-aware Brand section */}
  {user && role === "brand" ? (
    <Link
      href="/brand/profile"
      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
    >
      My Brand
    </Link>
  ) : (
    <Link
      href="/brands"
      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
    >
      Brands Directory
    </Link>
  )}

  {/* Only for creators */}
  {user && role === "creator" && (
    <Link
      href="/profile"
      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
    >
      My Profile
    </Link>
  )}
</nav>

          {/* Right: Theme Toggle + User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user && (
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
                  {role === "creator" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
      </div>
    </header>
  );
}
