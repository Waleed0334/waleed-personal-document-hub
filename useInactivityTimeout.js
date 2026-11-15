import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to monitor user activity and automatically trigger logout on inactivity.
 *
 * @param {Function} onTimeout Callback function executed when inactivity timer expires.
 * @param {number} timeoutMinutes Number of minutes before auto-logout (default: 15).
 * @param {number} warningSeconds Number of seconds before timeout to show warning (default: 60).
 */
export function useInactivityTimeout({
  onTimeout,
  timeoutMinutes = 15,
  warningSeconds = 60,
  enabled = true,
}) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(warningSeconds);
  const lastActivityRef = useRef(Date.now());
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = warningSeconds * 1000;

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsWarningVisible(false);
    setSecondsRemaining(warningSeconds);
  }, [warningSeconds]);

  useEffect(() => {
    if (!enabled) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleUserActivity = () => {
      // If user acts while warning is shown, reset warning
      if (isWarningVisible) {
        resetTimer();
      } else {
        lastActivityRef.current = Date.now();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remainingTotal = timeoutMs - elapsed;

      if (remainingTotal <= 0) {
        setIsWarningVisible(false);
        if (onTimeout) onTimeout();
      } else if (remainingTotal <= warningMs) {
        setIsWarningVisible(true);
        setSecondsRemaining(Math.max(1, Math.ceil(remainingTotal / 1000)));
      } else {
        setIsWarningVisible(false);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [enabled, timeoutMs, warningMs, onTimeout, isWarningVisible, resetTimer]);

  return {
    isWarningVisible,
    secondsRemaining,
    resetTimer,
  };
}
