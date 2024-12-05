"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Quotation, QuotationService, Client, Service } from "@prisma/client";

type QuotationWithRelations = Quotation & {
  client: Client;
  services: (QuotationService & {
    service: Service;
  })[];
};

export function InvoiceActions({ 
  quotation 
}: { 
  quotation: QuotationWithRelations;
}) {
  const handleDownload = () => {
    // TODO: Implement invoice PDF download
    console.log("Download invoice for quotation:", quotation.id);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}