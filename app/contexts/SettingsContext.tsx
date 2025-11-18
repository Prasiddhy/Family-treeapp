'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Settings {
  // Profile & Account
  profile: {
    name: string;
    email: string;
    displayPicture?: string;
    bio?: string;
    language: 'en' | 'ne' | 'hi' | 'es' | 'fr';
  };
  
  // Theme
  theme: 'light' | 'dark' | 'auto';
  
  // Family Tree Display
  treeDisplay: {
    layout: 'vertical' | 'horizontal' | 'circular';
    showBirthYear: boolean;
    showDeathYear: boolean;
    showPhotos: boolean;
    showNotes: boolean;
    showExtendedInfo: boolean;
    nodeColor: string;
    connectionLineColor: string;
    textSize: 'small' | 'medium' | 'large';
    photoShape: 'circle' | 'square' | 'rounded';
    generationLimit: number;
  };
  
  // Privacy & Security
  privacy: {
    passwordLock: boolean;
    passwordHash?: string;
    visibilityControl: 'public' | 'private' | 'family';
    dataEncryption: boolean;
    sharePermissions: 'view' | 'edit' | 'admin';
  };
  
  // Data & Sync
  dataSync: {
    cloudSync: boolean;
    offlineMode: boolean;
    autoSaveInterval: number; // in seconds
    lastBackup?: Date;
  };
  
  // Appearance
  appearance: {
    themePreset: 'classic' | 'modern' | 'minimalist';
    accentColor: string;
    backgroundType: 'solid' | 'pattern';
    nodeSize: 'small' | 'medium' | 'large';
  };
  
  // Notifications
  notifications: {
    birthdayReminders: boolean;
    anniversaryReminders: boolean;
    familyUpdates: boolean;
    syncAlerts: boolean;
    backupAlerts: boolean;
  };
  
  // Advanced
  advanced: {
    caseSensitiveSearch: boolean;
    sortBy: 'name' | 'birthYear' | 'createdAt';
    debugMode: boolean;
  };
}

const defaultSettings: Settings = {
  profile: {
    name: '',
    email: '',
    language: 'en',
  },
  theme: 'auto',
  treeDisplay: {
    layout: 'vertical',
    showBirthYear: true,
    showDeathYear: true,
    showPhotos: true,
    showNotes: false,
    showExtendedInfo: false,
    nodeColor: '#5a78c9',
    connectionLineColor: '#999999',
    textSize: 'medium',
    photoShape: 'circle',
    generationLimit: 10,
  },
  privacy: {
    passwordLock: false,
    visibilityControl: 'family',
    dataEncryption: false,
    sharePermissions: 'view',
  },
  dataSync: {
    cloudSync: false,
    offlineMode: true,
    autoSaveInterval: 30,
  },
  appearance: {
    themePreset: 'modern',
    accentColor: '#5a78c9',
    backgroundType: 'solid',
    nodeSize: 'medium',
  },
  notifications: {
    birthdayReminders: true,
    anniversaryReminders: true,
    familyUpdates: true,
    syncAlerts: true,
    backupAlerts: true,
  },
  advanced: {
    caseSensitiveSearch: false,
    sortBy: 'name',
    debugMode: false,
  },
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

const mergeSettings = (base: Settings, updates: Partial<Settings> = {}): Settings => {
  const result: Settings = { ...base };
  (Object.keys(updates) as (keyof Settings)[]).forEach(key => {
    const updateValue = updates[key];
    if (updateValue === undefined) {
      return;
    }
    if (typeof updateValue === 'object' && updateValue !== null && !Array.isArray(updateValue)) {
      result[key] = {
        ...(result[key] as Record<string, unknown>),
        ...(updateValue as Record<string, unknown>),
      } as Settings[typeof key];
    } else {
      result[key] = updateValue as Settings[typeof key];
    }
  });
  return result;
};

const getInitialSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  const stored = window.localStorage.getItem('appSettings');
  if (!stored) {
    return defaultSettings;
  }
  try {
    const parsed = JSON.parse(stored) as Partial<Settings>;
    return mergeSettings(defaultSettings, parsed);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => mergeSettings(prev, updates));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
  }, []);

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<Settings>;
      setSettings(mergeSettings(defaultSettings, parsed));
      return true;
    } catch (e) {
      console.error('Failed to import settings:', e);
      return false;
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, exportSettings, importSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};






