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

export const fmt = (d: Date) => format(d, 'MM.dd(EEE)', { locale: ko });
