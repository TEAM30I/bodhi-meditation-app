
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

export const dayAfterTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d;
};

export const fmt = (d: Date | undefined | null) => {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) {
    return '';
  }
  try {
    return format(d, 'MM.dd(EEE)', { locale: ko });
  } catch (e) {
    console.error("Date formatting error:", e);
    return '';
  }
};

export const formatDateSafe = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    return format(d, 'MM.dd(EEE)', { locale: ko });
  } catch (e) {
    console.error("Date formatting error:", e);
    return '';
  }
};
