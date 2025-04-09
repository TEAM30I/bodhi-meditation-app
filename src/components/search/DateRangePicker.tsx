
import React from 'react';

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
    <div className="bg-white rounded-lg p-4 mt-2 border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">체크인</label>
          <div className="border border-gray-300 rounded-lg p-3 text-center cursor-pointer">
            {dateRange.from ? dateRange.from.toLocaleDateString() : '날짜 선택'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">체크아웃</label>
          <div className="border border-gray-300 rounded-lg p-3 text-center cursor-pointer">
            {dateRange.to ? dateRange.to.toLocaleDateString() : '날짜 선택'}
          </div>
        </div>
      </div>
    </div>
  );
};
