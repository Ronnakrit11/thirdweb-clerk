import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Client } from "@prisma/client";

interface CustomerListItemProps {
  customer: Client;
  isSelected: boolean;
  onClick: () => void;
}

export function CustomerListItem({ 
  customer, 
  isSelected, 
  onClick 
}: CustomerListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          {customer.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <p className="font-medium">{customer.name}</p>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
      </div>
    </button>
  );
}