'use client';

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { FamilyData, FamilyDocument, FamilyEvent, Person } from '../types/family';
import { familyData as seededFamilyData } from '../data/family-data';

interface FamilyContextType {
  familyMembers: FamilyData;
  selectedPerson: Person | null;
  setSelectedPerson: (person: Person | null) => void;

  // Members
  addFamilyMember: (person: Person) => void;
  updateFamilyMember: (id: string, updates: Partial<Person>) => void;
  deleteFamilyMember: (id: string) => void;

  // Events
  events: FamilyEvent[];
  addEvent: (event: FamilyEvent) => void;
  updateEvent: (id: string, updates: Partial<FamilyEvent>) => void;
  deleteEvent: (id: string) => void;

  // Documents
  documents: FamilyDocument[];
  addDocument: (doc: FamilyDocument) => void;
  updateDocument: (id: string, updates: Partial<FamilyDocument>) => void;
  deleteDocument: (id: string) => void;

  // Search & Data import/export
  searchFamilyMembers: (query: string) => Person[];
  exportToPDF: () => void;
  exportToGEDCOM: () => void;
  importFromGEDCOM: (file: File) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamily = () => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within a FamilyProvider');
  return ctx;
};

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyData>({ ...seededFamilyData });
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [documents, setDocuments] = useState<FamilyDocument[]>([]);

  const searchFamilyMembers = useCallback((query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.values(familyMembers).filter((p) =>
      [p.name, p.occupation, p.location]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [familyMembers]);

  const addFamilyMember = useCallback((person: Person) => {
    setFamilyMembers(prev => {
      // Duplicate detection: same normalized name and birthYear
      const normalizedName = (person.name || '').trim().toLowerCase();
      const duplicate = Object.values(prev).some(p =>
        (p.name || '').trim().toLowerCase() === normalizedName && (!!p.birthYear && !!person.birthYear ? p.birthYear === person.birthYear : false)
      );
      if (duplicate) {
        console.warn('Duplicate member detected. Skipping add:', person.name, person.birthYear);
        return prev;
      }
      return { ...prev, [person.id]: person };
    });
  }, []);

  const updateFamilyMember = useCallback((id: string, updates: Partial<Person>) => {
    setFamilyMembers(prev => ({ ...prev, [id]: { ...prev[id], ...updates, updatedAt: new Date() } }));
  }, []);

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers(prev => {
      const clone = { ...prev } as FamilyData;
      delete clone[id];
      // Remove references from others (children/spouses)
      Object.values(clone).forEach(member => {
        if (member.spouseId === id) member.spouseId = undefined;
        if (member.children) member.children = member.children.filter(cid => cid !== id);
        if (member.parents) member.parents = member.parents.filter(pid => pid !== id);
      });
      return clone;
    });
  }, []);

  const addEvent = useCallback((event: FamilyEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<FamilyEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addDocument = useCallback((doc: FamilyDocument) => {
    setDocuments(prev => [...prev, doc]);
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<FamilyDocument>) => {
    setDocuments(prev => prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d)));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      familyMembers,
      selectedPerson,
      setSelectedPerson,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
      searchFamilyMembers,
      exportToPDF: () => { /* no-op placeholder */ },
      exportToGEDCOM: () => { /* no-op placeholder */ },
      importFromGEDCOM: (file: File) => { void file; /* no-op placeholder */ },
    }),
    [familyMembers, selectedPerson, addFamilyMember, updateFamilyMember, deleteFamilyMember, events, addEvent, updateEvent, deleteEvent, documents, addDocument, updateDocument, deleteDocument, searchFamilyMembers]
  );

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};


