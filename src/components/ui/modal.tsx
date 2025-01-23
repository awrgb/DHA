"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store";

interface ModalProps {
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen }) => {
  const { closeModal, setUserOrgId } = useAuthStore();
  const [organizationId, setOrganizationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/places/verify-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserOrgId(organizationId);
      } else {
        setErrorMessage(data.error || 'Invalid organization ID');
      }
    } catch (error) {
      console.error('Error verifying organization ID:', error);
      setErrorMessage('Oops! Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className={cn("font-sans", "animate-in", "fade-in-90", "zoom-in-95", "duration-200", "bg-black")}>
        <DialogHeader>
          <DialogTitle className="">
            Enter Organization ID
          </DialogTitle>
          <DialogDescription className="">
            Please enter your organization's ID to proceed.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          placeholder="Organization ID"
          className="mt-4"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 mb-4">{errorMessage}</p>
        )}
        <DialogFooter className="">
          <Button onClick={handleSubmit} disabled={isLoading} className="font-medium">
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
