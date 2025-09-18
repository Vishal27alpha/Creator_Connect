/*"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RoleSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (role: "creator" | "brand") => void;
};

export function RoleSelectionModal({ open, onClose, onSelect }: RoleSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Continue as</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button onClick={() => onSelect("creator")} className="w-full">
            🎨 I’m a Creator
          </Button>
          <Button onClick={() => onSelect("brand")} variant="outline" className="w-full">
            🏢 I’m a Brand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}*/
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (role: "creator" | "brand") => void; // ✅ required
}

export function RoleSelectionModal({ open, onClose, onSelect }: RoleSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Continue as a</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            className="w-full"
            onClick={() => onSelect("creator")} // ✅ call parent function
          >
             Creator
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onSelect("brand")} // ✅ call parent function
          >
              Brand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
