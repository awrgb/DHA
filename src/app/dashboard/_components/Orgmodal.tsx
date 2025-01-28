  // src/components/ui/Modal.tsx
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
  import { useState, useEffect } from 'react';
  import useAuthStore from '@/store';

  interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onVerify: (orgId: string) => Promise<void>;
  }

  const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, onVerify }) => {
    const [orgId, setOrgId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { userOrgId } = useAuthStore();

    useEffect(() => {
      if (userOrgId) {
        setOrgId(userOrgId);
      }
    }, [userOrgId]);

    const handleSubmit = async () => {
      setIsLoading(true);
      setErrorMessage('');
      if (orgId) {
        await onVerify(orgId);
        // Don't close the modal automatically after verification
        // closeModal();
      } else {
        setErrorMessage('Please enter a valid organization ID');
      }
      setIsLoading(false);
    };

    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md mx-auto p-6 bg-black text-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Enter Organization ID
            </DialogTitle>
            <DialogDescription className="text-sm">
              Please enter your organization's ID to proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              placeholder="Organization ID"
              className="w-full px-4 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
          <DialogFooter className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button
              onClick={closeModal}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  export default Modal;
