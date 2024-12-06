import { formatDate } from "@/lib/date";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isFromClient: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isFromClient, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex w-full gap-2 p-4",
      isFromClient ? "flex-row" : "flex-row-reverse"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {isFromClient ? "U" : "A"}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex max-w-[80%] flex-col gap-1",
        isFromClient ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isFromClient ? "bg-secondary" : "bg-primary text-primary-foreground"
        )}>
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(timestamp)}
        </span>
      </div>
    </div>
  );
}