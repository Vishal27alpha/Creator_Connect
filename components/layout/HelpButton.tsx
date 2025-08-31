'use client';

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpButton() {
  return (
    <a 
      href="mailto:vishalalpha01@gmail.com" 
      className="fixed bottom-4 right-4 z-50"
    >
      <Button size="icon" variant="outline" className="rounded-full shadow-lg">
        <Mail className="h-5 w-5" />
      </Button>
    </a>
  );
}
