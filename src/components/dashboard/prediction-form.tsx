"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { PredictionFormValues } from "@/lib/schema"
import { predictionSchema } from "@/lib/schema"
import { format } from "date-fns"
import * as React from 'react';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2 } from "lucide-react"

interface PredictionFormProps {
  onSubmit: (data: PredictionFormValues) => void;
  isLoading: boolean;
  initialValues?: Partial<PredictionFormValues>;
  onValuesChange?: (values: PredictionFormValues) => void;
}

export default function PredictionForm({ onSubmit, isLoading, initialValues, onValuesChange }: PredictionFormProps) {
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionSchema),
    defaultValues: initialValues || {
      patient_id: "",
      age: 30,
      gender: "female",
      // Dates are initialized client-side in useEffect to prevent hydration errors
      scheduled_iso: undefined, 
      appointment_iso: undefined,
      sms_received: true,
      comorb_count: 0,
      neighbourhood: "Downtown",
      past_no_shows: 0,
    },
  })

  // Set dates on the client side to avoid hydration mismatch
  React.useEffect(() => {
    if (!form.getValues('scheduled_iso') && !initialValues) {
      const now = new Date();
      form.reset({
        ...form.getValues(),
        scheduled_iso: now,
        appointment_iso: now,
      });
    }
  }, [form, initialValues]);
  
  React.useEffect(() => {
    if (onValuesChange) {
      const subscription = form.watch((value) => {
        predictionSchema.safeParseAsync(value).then(result => {
          if (result.success) {
            onValuesChange(result.data as PredictionFormValues);
          }
        });
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onValuesChange]);


  function handleSubmit(data: PredictionFormValues) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., P12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 35" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduled_iso"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointment_iso"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Appointment Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const scheduledDate = form.getValues("scheduled_iso");
                        return scheduledDate ? date < scheduledDate : false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="past_no_shows"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Past No-Shows</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="comorb_count"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Comorbidities</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="neighbourhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neighbourhood</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sms_received"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>SMS Reminder Sent</FormLabel>
                <FormDescription>
                  Was a reminder sent to the patient?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full !mt-8" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            'Predict Risk'
          )}
        </Button>
      </form>
    </Form>
  )
}
