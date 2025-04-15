
import { useState, useEffect } from 'react';

export interface Timer {
  minutes: number;
  seconds: number;
}

export function useTimer(initialMinutes = 3, initialSeconds = 0) {
  const [timer, setTimer] = useState<Timer>({ minutes: initialMinutes, seconds: initialSeconds });
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            clearInterval(interval);
            setTimerActive(false);
            setTimerExpired(true);
            return;
          }
          setTimer({ minutes: timer.minutes - 1, seconds: 59 });
        } else {
          setTimer({ ...timer, seconds: timer.seconds - 1 });
        }
      }, 1000);
    } else if (timer.minutes === 0 && timer.seconds === 0) {
      setTimerExpired(true);
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, timerActive]);

  const startTimer = () => {
    setTimer({ minutes: initialMinutes, seconds: initialSeconds });
    setTimerActive(true);
    setTimerExpired(false);
  };

  const resetTimer = () => {
    setTimer({ minutes: initialMinutes, seconds: initialSeconds });
    setTimerExpired(false);
  };

  // Modify formatTime to accept a Timer object or a single number
  const formatTime = (time: number | Timer): string => {
    if (typeof time === 'number') {
      return time < 10 ? `0${time}` : `${time}`;
    }
    
    return `${formatTime(time.minutes)}:${formatTime(time.seconds)}`;
  };

  return {
    timer,
    timerActive,
    timerExpired,
    startTimer,
    resetTimer,
    setTimerActive,
    setTimerExpired,
    formatTime,
  };
}
