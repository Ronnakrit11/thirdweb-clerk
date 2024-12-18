"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuotationForm } from "./quotation-form";
import { deleteQuotation } from "@/app/actions/quotation";
import { DeleteAlert } from "@/components/shared/alert-dialog/delete-alert";
import { useActionToast } from "@/hooks/use-action-toast";
import type { Client, Quotation, QuotationService, Service } from "@prisma/client";

type QuotationWithRelations = Quotation & {
  services: (QuotationService & {
    service: Service;
  })[];
};

export function QuotationActions({ 
  quotation,
  clients,
  services,
}: { 
  quotation: QuotationWithRelations;
  clients: Client[];
  services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { successToast, errorToast } = useActionToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteQuotation(quotation.id);
      successToast("Quotation deleted successfully");
    } catch (error) {
      errorToast("Failed to delete quotation");
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quotation</DialogTitle>
          </DialogHeader>
          <QuotationForm 
            quotation={quotation}
            clients={clients}
            services={services}
            closeModal={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setShowDeleteAlert(true)}
        disabled={isDeleting}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <DeleteAlert
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onConfirm={handleDelete}
        title="Delete Quotation"
        description="Are you sure you want to delete this quotation? This action cannot be undone."
      />
    </div>
  );
}