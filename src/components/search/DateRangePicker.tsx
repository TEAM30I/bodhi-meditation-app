
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-full bg-[#F5F5F5] border-none",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "yyyy-MM-dd", { locale: ko })} ~{" "}
                {format(dateRange.to, "yyyy-MM-dd", { locale: ko })}
              </>
            ) : (
              format(dateRange.from, "yyyy-MM-dd", { locale: ko })
            )
          ) : (
            <span>날짜 선택</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          locale={ko}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
