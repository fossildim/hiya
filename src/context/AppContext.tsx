import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Entry {
  id: string;
  date: string;
  rating: number;
  content: string;
  weather: string;
  createdAt: string;
}

interface AppSettings {
  userId: string;
  firstUseDate: string;
}

interface AppContextType {
  entries: Entry[];
  settings: AppSettings;
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => Entry;
  getEntryByDate: (date: string) => Entry | undefined;
  getTodayEntry: () => Entry | undefined;
  getWeekEntries: () => Entry[];
  updateSettings: (settings: Partial<AppSettings>) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  getDaysUsed: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ENTRIES: 'haiya_entries',
  SETTINGS: 'haiya_settings',
};

const getRandomWeather = () => {
  const weathers = ['☀️ 晴天', '⛅ 多云', '🌧️ 小雨', '❄️ 下雪', '🌤️ 晴转多云', '🌈 雨后彩虹'];
  return weathers[Math.floor(Math.random() * weathers.length)];
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    userId: '',
    firstUseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const addEntry = (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
    const newEntry: Entry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // Remove existing entry for the same date
    const filteredEntries = entries.filter(e => e.date !== entryData.date);
    setEntries([...filteredEntries, newEntry]);
    return newEntry;
  };

  const getEntryByDate = (date: string) => {
    return entries.find(e => e.date === date);
  };

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return getEntryByDate(today);
  };

  const getWeekEntries = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    return entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= weekAgo && entryDate <= today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const exportData = () => {
    return JSON.stringify({ entries, settings }, null, 2);
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.entries) setEntries(parsed.entries);
      if (parsed.settings) setSettings(parsed.settings);
      return true;
    } catch {
      return false;
    }
  };

  const getDaysUsed = () => {
    const firstUse = new Date(settings.firstUseDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - firstUse.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <AppContext.Provider
      value={{
        entries,
        settings,
        addEntry,
        getEntryByDate,
        getTodayEntry,
        getWeekEntries,
        updateSettings,
        exportData,
        importData,
        getDaysUsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { getRandomWeather };
