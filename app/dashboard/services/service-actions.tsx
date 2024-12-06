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
import { ServiceForm } from "./service-form";
import { deleteService } from "@/app/actions/service";
import { DeleteAlert } from "@/components/shared/alert-dialog/delete-alert";
import { useActionToast } from "@/hooks/use-action-toast";
import type { Service } from "@prisma/client";

export function ServiceActions({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { successToast, errorToast } = useActionToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteService(service.id);
      successToast("Service deleted successfully");
    } catch (error) {
      errorToast("Failed to delete service");
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
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm 
            service={service} 
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
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
}