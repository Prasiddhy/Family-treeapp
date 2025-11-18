'use client';

import React, { useState, useRef } from 'react';
import { X, User, TreePine, Lock, Cloud, Palette, Bell, Settings as SettingsIcon, HelpCircle, Download, Upload, Trash2, Mail, Bug, FileText } from 'lucide-react';
import { useSettings } from '@/app/contexts/SettingsContext';
import type { Settings } from '@/app/contexts/SettingsContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useFamily } from '@/app/contexts/FamilyContext';
import { useTheme } from '@/app/hooks/useTheme';
import { useNotification } from '@/app/contexts/NotificationContext';
import { cn } from '@/app/utils/cn';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'profile' | 'tree' | 'privacy' | 'data' | 'appearance' | 'notifications' | 'advanced' | 'help';

type TreeDisplayToggleKey =
  | 'showBirthYear'
  | 'showDeathYear'
  | 'showPhotos'
  | 'showNotes'
  | 'showExtendedInfo';

const treeDisplayToggleOptions: Array<{ key: TreeDisplayToggleKey; label: string }> = [
  { key: 'showBirthYear', label: 'Birth Year' },
  { key: 'showDeathYear', label: 'Death Year' },
  { key: 'showPhotos', label: 'Photos' },
  { key: 'showNotes', label: 'Notes' },
  { key: 'showExtendedInfo', label: 'Extended Info' },
];

const notificationToggleOptions: Array<{ key: keyof Settings['notifications']; label: string }> = [
  { key: 'birthdayReminders', label: 'Birthday Reminders' },
  { key: 'anniversaryReminders', label: 'Anniversary Reminders' },
  { key: 'familyUpdates', label: 'Family Updates' },
  { key: 'syncAlerts', label: 'Sync & Backup Alerts' },
  { key: 'backupAlerts', label: 'Backup Alerts' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { settings, updateSettings, resetSettings } = useSettings();
  const { user } = useAuth();
  const { familyMembers, exportToGEDCOM } = useFamily();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportFileRef = useRef<HTMLAnchorElement>(null);

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile & Account', icon: <User className="w-4 h-4" /> },
    { id: 'tree', label: 'Tree Display', icon: <TreePine className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'data', label: 'Data & Sync', icon: <Cloud className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleExportData = (format: 'json' | 'csv' | 'gedcom') => {
    if (format === 'json') {
      const data = JSON.stringify(familyMembers, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addNotification({ type: 'success', title: 'Export Complete', message: 'Family data exported successfully' });
    } else if (format === 'csv') {
      const headers = ['ID', 'Name', 'Birth Year', 'Death Year', 'Gender', 'Occupation', 'Location'];
      const rows = Object.values(familyMembers).map(m => [
        m.id, m.name, m.birthYear || '', m.deathYear || '', m.gender || '', m.occupation || '', m.location || ''
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-tree-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      addNotification({ type: 'success', title: 'Export Complete', message: 'Family data exported as CSV' });
    } else {
      exportToGEDCOM();
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        JSON.parse(event.target?.result as string);
        addNotification({ type: 'info', title: 'Import Started', message: 'Data import functionality coming soon' });
      } catch (error) {
        console.error('Failed to parse import data', error);
        addNotification({ type: 'error', title: 'Import Failed', message: 'Invalid file format' });
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete all family data? This cannot be undone.')) {
      localStorage.removeItem('familyData');
      localStorage.removeItem('user');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] max-h-[800px] flex flex-col m-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-zinc-800 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left",
                  activeTab === tab.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                )}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Profile & Account Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={settings.profile.name || user?.firstName + ' ' + user?.lastName || ''}
                      onChange={(e) => updateSettings({ profile: { ...settings.profile, name: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email || user?.email || ''}
                      onChange={(e) => updateSettings({ profile: { ...settings.profile, email: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Bio</label>
                    <textarea
                      value={settings.profile.bio || ''}
                      onChange={(e) => updateSettings({ profile: { ...settings.profile, bio: e.target.value } })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Language</label>
                    <select
                      value={settings.profile.language}
                      onChange={(e) =>
                        updateSettings({
                          profile: {
                            ...settings.profile,
                            language: e.target.value as Settings['profile']['language'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    >
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Theme Mode</label>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                      >
                        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </button>
                      <button
                        onClick={() => updateSettings({ theme: settings.theme === 'auto' ? 'light' : 'auto' })}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                      >
                        {settings.theme === 'auto' ? '✓ Auto' : 'Auto'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-3">Backup & Restore</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportData('json')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        Export Data (JSON)
                      </button>
                      <button
                        onClick={() => handleExportData('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        <Upload className="w-4 h-4" />
                        Import
                      </button>
                      <input ref={fileInputRef} type="file" accept=".json,.csv" onChange={handleImportData} className="hidden" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-red-200 dark:border-red-900">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account & Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tree' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Family Tree Display Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Tree Layout</label>
                    <select
                      value={settings.treeDisplay.layout}
                      onChange={(e) =>
                        updateSettings({
                          treeDisplay: {
                            ...settings.treeDisplay,
                            layout: e.target.value as Settings['treeDisplay']['layout'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="vertical">Vertical</option>
                      <option value="horizontal">Horizontal</option>
                      <option value="circular">Circular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Show/Hide Details</label>
                    <div className="space-y-2">
                      {treeDisplayToggleOptions.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.treeDisplay[key]}
                            onChange={(e) => {
                              const nextTreeDisplay: Settings['treeDisplay'] = {
                                ...settings.treeDisplay,
                                [key]: e.target.checked,
                              };
                              updateSettings({ treeDisplay: nextTreeDisplay });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-zinc-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Node Color</label>
                    <input
                      type="color"
                      value={settings.treeDisplay.nodeColor}
                      onChange={(e) => updateSettings({ treeDisplay: { ...settings.treeDisplay, nodeColor: e.target.value } })}
                      className="w-20 h-10 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Connection Line Color</label>
                    <input
                      type="color"
                      value={settings.treeDisplay.connectionLineColor}
                      onChange={(e) => updateSettings({ treeDisplay: { ...settings.treeDisplay, connectionLineColor: e.target.value } })}
                      className="w-20 h-10 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Text Size</label>
                    <select
                      value={settings.treeDisplay.textSize}
                      onChange={(e) =>
                        updateSettings({
                          treeDisplay: {
                            ...settings.treeDisplay,
                            textSize: e.target.value as Settings['treeDisplay']['textSize'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Profile Photo Shape</label>
                    <select
                      value={settings.treeDisplay.photoShape}
                      onChange={(e) =>
                        updateSettings({
                          treeDisplay: {
                            ...settings.treeDisplay,
                            photoShape: e.target.value as Settings['treeDisplay']['photoShape'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="rounded">Rounded Rectangle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Generation Limit: {settings.treeDisplay.generationLimit}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={settings.treeDisplay.generationLimit}
                      onChange={(e) => updateSettings({ treeDisplay: { ...settings.treeDisplay, generationLimit: parseInt(e.target.value) } })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Privacy & Security Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.privacy.passwordLock}
                        onChange={(e) => updateSettings({ privacy: { ...settings.privacy, passwordLock: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Password/PIN Lock</span>
                    </label>
                    {settings.privacy.passwordLock && (
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Visibility Control</label>
                    <select
                      value={settings.privacy.visibilityControl}
                      onChange={(e) =>
                        updateSettings({
                          privacy: {
                            ...settings.privacy,
                            visibilityControl: e.target.value as Settings['privacy']['visibilityControl'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="public">Public</option>
                      <option value="family">Family Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataEncryption}
                        onChange={(e) => updateSettings({ privacy: { ...settings.privacy, dataEncryption: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Enable Data Encryption</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Share Permissions</label>
                    <select
                      value={settings.privacy.sharePermissions}
                      onChange={(e) =>
                        updateSettings({
                          privacy: {
                            ...settings.privacy,
                            sharePermissions: e.target.value as Settings['privacy']['sharePermissions'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="view">View Only</option>
                      <option value="edit">Edit</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Data & Sync Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.dataSync.cloudSync}
                        onChange={(e) => updateSettings({ dataSync: { ...settings.dataSync, cloudSync: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Enable Cloud Sync</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.dataSync.offlineMode}
                        onChange={(e) => updateSettings({ dataSync: { ...settings.dataSync, offlineMode: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Offline Mode</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                      Auto Save Interval: {settings.dataSync.autoSaveInterval} seconds
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={300}
                      step={5}
                      value={settings.dataSync.autoSaveInterval}
                      onChange={(e) => updateSettings({ dataSync: { ...settings.dataSync, autoSaveInterval: parseInt(e.target.value) } })}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-3">Import/Export</h4>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleExportData('json')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Export JSON
                      </button>
                      <button onClick={() => handleExportData('csv')} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        Export CSV
                      </button>
                      <button onClick={() => handleExportData('gedcom')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Export GEDCOM
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                        Import
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Appearance & Layout</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Theme Preset</label>
                    <select
                      value={settings.appearance.themePreset}
                      onChange={(e) =>
                        updateSettings({
                          appearance: {
                            ...settings.appearance,
                            themePreset: e.target.value as Settings['appearance']['themePreset'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="classic">Classic</option>
                      <option value="modern">Modern</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Accent Color</label>
                    <input
                      type="color"
                      value={settings.appearance.accentColor}
                      onChange={(e) => updateSettings({ appearance: { ...settings.appearance, accentColor: e.target.value } })}
                      className="w-20 h-10 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Background Type</label>
                    <select
                      value={settings.appearance.backgroundType}
                      onChange={(e) =>
                        updateSettings({
                          appearance: {
                            ...settings.appearance,
                            backgroundType: e.target.value as Settings['appearance']['backgroundType'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="solid">Solid Color</option>
                      <option value="pattern">Pattern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Node Size</label>
                    <select
                      value={settings.appearance.nodeSize}
                      onChange={(e) =>
                        updateSettings({
                          appearance: {
                            ...settings.appearance,
                            nodeSize: e.target.value as Settings['appearance']['nodeSize'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Notifications & Alerts</h3>
                
                <div className="space-y-4">
                  {notificationToggleOptions.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications[key]}
                        onChange={(e) => {
                          const nextNotifications: Settings['notifications'] = {
                            ...settings.notifications,
                            [key]: e.target.checked,
                          };
                          updateSettings({ notifications: nextNotifications });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-zinc-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Advanced Tools</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.advanced.caseSensitiveSearch}
                        onChange={(e) => updateSettings({ advanced: { ...settings.advanced, caseSensitiveSearch: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Case Sensitive Search</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Sort By</label>
                    <select
                      value={settings.advanced.sortBy}
                      onChange={(e) =>
                        updateSettings({
                          advanced: {
                            ...settings.advanced,
                            sortBy: e.target.value as Settings['advanced']['sortBy'],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                    >
                      <option value="name">Name</option>
                      <option value="birthYear">Birth Year</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.advanced.debugMode}
                        onChange={(e) => updateSettings({ advanced: { ...settings.advanced, debugMode: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Developer/Debug Mode</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-3">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                        Merge Duplicate Members
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                        Relationship Calculator
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                        Timeline View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Help & Support</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">User Guide & FAQs</h4>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                      <FileText className="w-4 h-4" />
                      View Documentation
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">Contact Support</h4>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">Report Issues</h4>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                      <Bug className="w-4 h-4" />
                      Report Bug / Suggest Feature
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">Version Info</h4>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Family Tree App v1.0.0</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Last Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={resetSettings}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save & Close
          </button>
        </div>
      </div>
      <a ref={exportFileRef} className="hidden" />
    </div>
  );
}






