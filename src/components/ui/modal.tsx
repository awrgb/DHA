"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onVerify: (orgId: string) => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, onVerify }) => {
  const [orgId, setOrgId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await onVerify(orgId);
      closeModal(); // Close the modal on successful verification
    } catch (error) {
      setErrorMessage('Invalid organization ID');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="">
            Enter Organization ID
          </DialogTitle>
          <DialogDescription className="">
            Please enter your organization's ID to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input
            type="text"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            placeholder="Organization ID"
            className=""
          />
        </div>
        {errorMessage && (
          <p className="">{errorMessage}</p>
        )}
        <DialogFooter className="">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className=""
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            onClick={closeModal}
            className=""
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
