"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerListItem } from "./customer-list-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import type { Client } from "@prisma/client";

interface CustomerListProps {
  customers: Client[];
  onSelectCustomer: (customer: Client) => void;
  selectedCustomerId?: string;
}

export function CustomerList({ 
  customers, 
  onSelectCustomer, 
  selectedCustomerId 
}: CustomerListProps) {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b relative">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="flex-1">
        {filteredCustomers.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No customers found
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              isSelected={customer.id === selectedCustomerId}
              onClick={() => onSelectCustomer(customer)}
            />
          ))
        )}
      </ScrollArea>
    </Card>
  );
}