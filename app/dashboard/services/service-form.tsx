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
import { Textarea } from "@/components/ui/textarea";
import { createService, updateService } from "@/app/actions/service";
import { useActionToast } from "@/hooks/use-action-toast";
import type { Service } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ServiceForm({ 
  service,
  closeModal 
}: { 
  service?: Service;
  closeModal?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { successToast, errorToast } = useActionToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          price: service.price.toString(),
        }
      : {
          name: "",
          description: "",
          price: "",
        },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        if (service) {
          await updateService(service.id, {
            ...data,
            price: Number(data.price),
          });
          successToast("Service updated successfully");
        } else {
          await createService({
            ...data,
            price: Number(data.price),
          });
          successToast("Service created successfully");
        }
        closeModal?.();
      } catch (error) {
        errorToast(service ? "Failed to update service" : "Failed to create service");
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {service ? "Update" : "Create"} Service
        </Button>
      </form>
    </Form>
  );
}