"use client";

import { useState } from "react";
import { updateQuotationStatus } from "@/app/actions/quotation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Quotation } from "@prisma/client";

const statuses = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function QuotationStatus({ quotation }: { quotation: Quotation }) {
  const [status, setStatus] = useState(quotation.status);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateQuotationStatus(quotation.id, newStatus);
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}