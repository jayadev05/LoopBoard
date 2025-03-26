"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  classname?: string;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  classname,
  placeholder = "Select Date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !value && "text-muted-foreground",
            classname
          )}
          variant="outline"
          size="lg"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
       
          
      <Calendar
        mode="single"
        selected={value}
        onSelect={(date) => onChange(date as Date)}
        disabled={(date) => date < new Date()}
        initialFocus
        className="w-full rounded-md p-4"
        classNames={{
         
          month: "mt-6 ",
        
        }}
        
      />
          
      </PopoverContent>
    </Popover>
  );
}
