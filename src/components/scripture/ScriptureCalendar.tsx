
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { calendarData } from '@/data/scriptureData';

const ScriptureCalendar: React.FC = () => {
  // Create a function to modify the CSS class of specific dates
  const modifiers = {
    highlighted: calendarData.map(item => new Date(item.date)),
  };

  // Create custom modifiers styles
  const modifiersStyles = {
    highlighted: { 
      backgroundColor: '#FF8433',
      color: 'white',
      borderRadius: '50%'
    }
  };

  return (
    <div className="mt-6">
      <Calendar
        mode="single"
        selected={new Date()}
        className="rounded-md border pointer-events-auto"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
      />
    </div>
  );
};

export default ScriptureCalendar;
