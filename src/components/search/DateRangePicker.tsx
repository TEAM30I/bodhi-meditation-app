
import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  onClose?: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  dateRange, 
  onChange,
  onClose 
}) => {
  // For navigating between months
  const [month, setMonth] = React.useState<Date>(dateRange.from || new Date());

  // Go to previous/next month
  const handlePrevMonth = () => {
    const prevMonth = new Date(month);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setMonth(nextMonth);
  };

  // Format the selected date range for display
  const formatSelectedRange = () => {
    if (!dateRange.from) return "날짜를 선택하세요";
    
    const fromDate = dateRange.from.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
    
    if (!dateRange.to) return `${fromDate} 선택됨`;
    
    const toDate = dateRange.to.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
    
    return `${fromDate} - ${toDate}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">날짜 선택</h3>
        {onClose && (
          <button 
            className="text-gray-400"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Selected Range Display */}
      <div className="text-center mb-4 text-sm font-medium">
        {formatSelectedRange()}
      </div>
      
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={handlePrevMonth}
          className="p-1"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="font-medium">
          {month.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
        </h4>
        <button 
          onClick={handleNextMonth}
          className="p-1"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Calendar */}
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={(range) => onChange(range || { from: undefined, to: undefined })}
        month={month}
        onMonthChange={setMonth}
        numberOfMonths={1}
        defaultMonth={new Date()}
        className="rounded-md border"
      />
      
      {/* Apply Button */}
      <Button 
        className="w-full mt-6 bg-gray-900 hover:bg-black"
        onClick={onClose}
      >
        선택 완료
      </Button>
    </div>
  );
};

export default DateRangePicker;
