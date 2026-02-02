import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Entry {
  id: string;
  date: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface AppSettings {
  userId: string;
  firstUseDate: string;
  unlockedThemes: string[];
  currentTheme: string;
  devMode?: boolean;
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

const getLocalISODate = (d: Date = new Date()) => {
  // Use local time (not UTC) to avoid date shifting around midnight.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    userId: '',
    firstUseDate: getLocalISODate(),
    unlockedThemes: ['white-orange', 'white-black', 'white-red', 'white-green', 'white-blue'],
    currentTheme: 'white-orange',
    devMode: false,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const safeParse = <T,>(raw: string | null): T | null => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    };

    // Primary keys
    const savedEntries = safeParse<Entry[]>(localStorage.getItem(STORAGE_KEYS.ENTRIES));
    const savedSettings = safeParse<Partial<AppSettings>>(localStorage.getItem(STORAGE_KEYS.SETTINGS));

    // Legacy compatibility (in case older builds used different keys)
    const legacyEntries =
      safeParse<Entry[]>(localStorage.getItem('entries')) ||
      safeParse<Entry[]>(localStorage.getItem('haiyaEntries'));
    const legacySettings =
      safeParse<Partial<AppSettings>>(localStorage.getItem('settings')) ||
      safeParse<Partial<AppSettings>>(localStorage.getItem('haiyaSettings'));

    const finalEntries = savedEntries ?? legacyEntries;
    const finalSettings = savedSettings ?? legacySettings;

    if (finalEntries) {
      setEntries(finalEntries);
      // Migrate legacy -> current key
      if (!savedEntries && legacyEntries) {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(legacyEntries));
      }
    }

    if (finalSettings) {
      // Migrate old theme IDs to new ones
      let migratedSettings = { ...finalSettings };
      if (migratedSettings.currentTheme === 'default') {
        migratedSettings.currentTheme = 'white-orange';
      }
      // All themes are now free
      migratedSettings.unlockedThemes = ['white-orange', 'white-black', 'white-red', 'white-green', 'white-blue'];
      
      setSettings((prev) => ({ ...prev, ...migratedSettings }));
      // Migrate legacy -> current key
      if (!savedSettings && legacySettings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...settings, ...migratedSettings }));
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings, hydrated]);

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
    const today = getLocalISODate();
    return getEntryByDate(today);
  };

  const getWeekEntries = () => {
    const today = new Date();
    // 获取上周的日期范围（上周一到上周日）
    const dayOfWeek = today.getDay();
    const daysToLastSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - daysToLastSunday);
    lastSunday.setHours(23, 59, 59, 999);
    
    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);
    lastMonday.setHours(0, 0, 0, 0);
    
    return entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= lastMonday && entryDate <= lastSunday;
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
