"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient, updateClient } from "@/app/actions/client";
import { useActionToast } from "@/hooks/use-action-toast";
import type { Client } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ClientForm({ 
  client,
  closeModal 
}: { 
  client?: Client;
  closeModal?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { successToast, errorToast } = useActionToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: client || {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        if (client) {
          await updateClient(client.id, data);
          successToast("Client updated successfully");
        } else {
          await createClient(data);
          successToast("Client created successfully");
        }
        closeModal?.();
      } catch (error) {
        errorToast(client ? "Failed to update client" : "Failed to create client");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {client ? "Update" : "Create"} Client
        </Button>
      </form>
    </Form>
  );
}