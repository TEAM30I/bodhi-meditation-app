
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { calendarData } from '@/data/scriptureData';

const ScriptureCalendar: React.FC = () => {
  // Convert calendar data to dates for highlighting
  const highlightedDates = calendarData.map(item => new Date(item.date));

  return (
    <div className="mt-6">
      <Calendar
        mode="single"
        selected={new Date()}
        className="rounded-md border pointer-events-auto"
        modifiers={{
          highlighted: highlightedDates
        }}
        modifiersStyles={{
          highlighted: { 
            backgroundColor: '#FF8433',
            color: 'white',
            borderRadius: '50%'
          }
        }}
      />
    </div>
  );
};

export default ScriptureCalendar;
