
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { calendarData } from '@/data/scriptureData';

const ScriptureCalendar: React.FC = () => {
  return (
    <div className="mt-6">
      <Calendar
        mode="single"
        selected={new Date()}
        className="rounded-md border"
        highlightedDays={calendarData.map(item => new Date(item.date))}
      />
    </div>
  );
};

export default ScriptureCalendar;
