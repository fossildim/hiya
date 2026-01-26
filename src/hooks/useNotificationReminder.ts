import { useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

const REMINDER_STORAGE_KEY = 'haiya_reminder_last_check';

export const useNotificationReminder = () => {
  const { getEntryByDate } = useApp();

  const getYesterdayDate = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  }, []);

  const showNotification = useCallback(() => {
    if (Notification.permission === 'granted') {
      new Notification('嗨呀！📝', {
        body: '昨天忘记记录了哦，快来补录一下吧！',
        icon: '/favicon.ico',
        tag: 'haiya-reminder',
      });
    }
  }, []);

  const checkAndNotify = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Check if it's around 9:09 AM (between 9:09 and 9:10)
    if (hours !== 9 || minutes !== 9) {
      return;
    }
    
    // Check if we already notified today
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const lastCheck = localStorage.getItem(REMINDER_STORAGE_KEY);
    
    if (lastCheck === today) {
      return;
    }
    
    // Check if yesterday has an entry
    const yesterdayDate = getYesterdayDate();
    const yesterdayEntry = getEntryByDate(yesterdayDate);
    
    if (!yesterdayEntry) {
      showNotification();
    }
    
    // Mark as checked for today
    localStorage.setItem(REMINDER_STORAGE_KEY, today);
  }, [getYesterdayDate, getEntryByDate, showNotification]);

  useEffect(() => {
    // Request permission on mount
    requestNotificationPermission();
    
    // Check immediately
    checkAndNotify();
    
    // Check every minute
    const interval = setInterval(checkAndNotify, 60000);
    
    return () => clearInterval(interval);
  }, [requestNotificationPermission, checkAndNotify]);

  return {
    requestNotificationPermission,
  };
};
