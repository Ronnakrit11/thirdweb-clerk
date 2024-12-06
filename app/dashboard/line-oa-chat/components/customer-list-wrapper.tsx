"use client";

import { useState } from "react";
import { CustomerList } from "./customer-list";
import type { Client } from "@prisma/client";

interface CustomerListWrapperProps {
  customers: Client[];
}

export function CustomerListWrapper({ customers }: CustomerListWrapperProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();

  const handleSelectCustomer = (customer: Client) => {
    setSelectedCustomerId(customer.id);
    // TODO: Update chat context/state with selected customer
  };

  return (
    <CustomerList
      customers={customers}
      selectedCustomerId={selectedCustomerId}
      onSelectCustomer={handleSelectCustomer}
    />
  );
}