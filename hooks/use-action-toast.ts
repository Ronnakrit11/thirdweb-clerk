import { useToast } from "./use-toast";

export function useActionToast() {
  const { toast } = useToast();

  const successToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const errorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    successToast,
    errorToast,
  };
}