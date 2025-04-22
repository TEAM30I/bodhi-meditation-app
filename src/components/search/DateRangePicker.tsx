
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
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
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
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
          className="pointer-events-auto"
        />
      </div>
    </div>
  );
};
