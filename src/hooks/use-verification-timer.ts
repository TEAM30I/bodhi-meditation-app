import { useState, useEffect } from 'react';
import { getVerificationTimeRemaining } from '@/services/smsService';

export const useVerificationTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeLeft, isActive]);

  // Check for existing verification timer on component mount
  useEffect(() => {
    const checkExistingTimer = async () => {
      const remaining = await getVerificationTimeRemaining();
      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsActive(true);
      }
    };
    
    checkExistingTimer();
  }, []);

  // Start or reset the timer
  const startTimer = (seconds = 180) => {
    setTimeLeft(seconds);
    setIsActive(true);
  };

  // Format the time for display (MM:SS)
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return {
    timeLeft,
    isActive,
    startTimer,
    formatTime,
  };
};