"use client";

import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createQuotation, updateQuotation } from "@/app/actions/quotation";
import { Plus, Trash } from "lucide-react";
import type { Client, Quotation, QuotationService, Service } from "@prisma/client";

const formSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  services: z.array(z.object({
    serviceId: z.string().min(1, "Please select a service"),
    quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  })).min(1, "At least one service is required"),
});

type FormData = z.infer<typeof formSchema>;

type QuotationWithRelations = Quotation & {
  services: (QuotationService & {
    service: Service;
  })[];
};

export function QuotationForm({ 
  quotation,
  clients,
  services,
  closeModal 
}: { 
  quotation?: QuotationWithRelations;
  clients: Client[];
  services: Service[];
  closeModal?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: quotation
      ? {
          clientId: quotation.clientId,
          services: quotation.services.map((qs) => ({
            serviceId: qs.serviceId,
            quantity: qs.quantity.toString(),
          })),
        }
      : {
          clientId: "",
          services: [{ serviceId: "", quantity: "1" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const quotationServices = data.services.map((item) => {
        const service = services.find((s) => s.id === item.serviceId)!;
        return {
          serviceId: item.serviceId,
          quantity: Number(item.quantity),
          price: service.price,
        };
      });

      if (quotation) {
        await updateQuotation(quotation.id, {
          clientId: data.clientId,
          services: quotationServices,
        });
      } else {
        await createQuotation({
          clientId: data.clientId,
          services: quotationServices,
        });
      }
      closeModal?.();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name={`services.${index}.serviceId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Service {index + 1}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(service.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`services.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                className="mb-2"
                disabled={fields.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ serviceId: "", quantity: "1" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>

        <Button type="submit" disabled={isPending} className="w-full">
          {quotation ? "Update" : "Create"} Quotation
        </Button>
      </form>
    </Form>
  );
}