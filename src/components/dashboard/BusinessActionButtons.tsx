// src/components/dashboard/BusinessActionButtons.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteBusiness } from '@/app/dashboard/actions'; // Import server action

interface BusinessActionButtonsProps {
  businessId: number;
  businessName: string;
}

export default function BusinessActionButtons({ businessId, businessName }: BusinessActionButtonsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    startTransition(async () => {
      const result = await deleteBusiness(businessId);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Business "${businessName}" has been deleted.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete business.',
          variant: 'destructive',
        });
      }
      setIsDeleteDialogOpen(false);
    });
  };

  return (
    <>
      <div className="flex justify-center space-x-2">
        <Button variant="outline" size="icon" aria-label="Edit business" disabled>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          aria-label="Delete business"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business record for "{businessName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
