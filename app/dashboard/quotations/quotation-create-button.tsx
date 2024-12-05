"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuotationForm } from "./quotation-form";
import type { Client, Service } from "@prisma/client";

export function QuotationCreateButton({
  clients,
  services,
}: {
  clients: Client[];
  services: Service[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Quotation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Quotation</DialogTitle>
        </DialogHeader>
        <QuotationForm clients={clients} services={services} />
      </DialogContent>
    </Dialog>
  );
}