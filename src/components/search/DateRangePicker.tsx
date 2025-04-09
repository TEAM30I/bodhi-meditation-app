
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onChange }) => {
  return (
    <div className="mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'PPP', { locale: ko })} -{' '}
                  {format(dateRange.to, 'PPP', { locale: ko })}
                </>
              ) : (
                format(dateRange.from, 'PPP', { locale: ko })
              )
            ) : (
              <span className="text-gray-500">날짜를 선택하세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range: any) => {
              onChange(range || { from: undefined, to: undefined });
            }}
            locale={ko}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
