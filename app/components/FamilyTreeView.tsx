'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFamily } from '@/app/contexts/FamilyContext';
import FamilyNode, { PersonFormValues, PersonPopoverMode } from './family-tree/FamilyNode';
import FamilyTreeControls from './FamilyTreeControls';
import AddMemberModal from './members/AddMemberModal';
import { Plus, Share2, Download, Upload } from 'lucide-react';
import { Person } from '@/app/types/family';

export default function FamilyTreeView() {
  const {
    familyMembers,
    deleteFamilyMember,
    updateFamilyMember,
  } = useFamily();
  const [showAddMember, setShowAddMember] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [autoScale, setAutoScale] = useState(1);
  const [preferredRootId, setPreferredRootId] = useState(() => {
    const ids = Object.keys(familyMembers);
    return ids[0] ?? '';
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollShellRef = useRef<HTMLDivElement>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [popoverMode, setPopoverMode] = useState<PersonPopoverMode>('view');

  const familyMembersList: Person[] = useMemo(
    () => Object.values(familyMembers).sort((a, b) => a.name.localeCompare(b.name)),
    [familyMembers]
  );
  const fallbackRootId = useMemo(() => Object.keys(familyMembers)[0] ?? '', [familyMembers]);
  const activeRootId = familyMembers[preferredRootId] ? preferredRootId : fallbackRootId;
  const hasMembers = familyMembersList.length > 0;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const handleExport = () => console.log('Exporting family tree...');
  const handleShare = () => console.log('Sharing family tree...');
  const handleImport = () => console.log('Importing family tree...');

  const toggleCollapse = useCallback((personId: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(personId)) {
        next.delete(personId);
      } else {
        next.add(personId);
      }
      return next;
    });
  }, []);

  const handlePersonClick = useCallback((person: Person) => {
    setActivePersonId(person.id);
    setPopoverMode('view');
  }, []);

  const closeDetails = useCallback(() => {
    setActivePersonId(null);
    setPopoverMode('view');
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const shell = scrollShellRef.current;
    if (!container || !shell) return;

    const observer = new ResizeObserver(() => {
      const parentWidth = shell.clientWidth || window.innerWidth;
      const parentHeight = shell.clientHeight || window.innerHeight;
      const treeWidth = container.scrollWidth || parentWidth;
      const treeHeight = container.scrollHeight || parentHeight;
      const widthScale = treeWidth ? parentWidth / treeWidth : 1;
      const heightScale = treeHeight ? parentHeight / treeHeight : 1;
      const scale = Math.min(widthScale, heightScale, 1);
      setAutoScale(scale);
    });

    observer.observe(shell);
    observer.observe(container);
    return () => observer.disconnect();
  }, [familyMembersList, activeRootId]);

  useEffect(() => {
    if (!activePersonId) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest('[data-person-popover="true"]') ||
        target.closest('[data-person-icon="true"]')
      ) {
        return;
      }
      closeDetails();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activePersonId, closeDetails]);

  const handleDeletePerson = useCallback((personId: string) => {
    const person = familyMembers[personId];
    if (person && window.confirm(`Delete ${person.name || 'this member'} from the tree?`)) {
      deleteFamilyMember(personId);
      setCollapsedNodes(prev => {
        if (!prev.has(personId)) return prev;
        const next = new Set(prev);
        next.delete(personId);
        return next;
      });
      closeDetails();
    }
  }, [deleteFamilyMember, familyMembers, closeDetails]);

  const handleToggleEdit = useCallback((personId: string) => {
    setPopoverMode(prev => (prev === 'edit' && activePersonId === personId ? 'view' : 'edit'));
  }, [activePersonId]);

  const handleSavePerson = useCallback((personId: string, values: PersonFormValues) => {
    const birthYear = values.birthYear ? Number(values.birthYear) : undefined;
    const deathYear = values.deathYear ? Number(values.deathYear) : undefined;
    updateFamilyMember(personId, {
      name: values.name.trim() || familyMembers[personId]?.name,
      birthYear: Number.isNaN(birthYear) ? undefined : birthYear,
      deathYear: Number.isNaN(deathYear) ? undefined : deathYear,
      location: values.location.trim() || undefined,
      occupation: values.occupation.trim() || undefined,
      notes: values.notes.trim() || undefined,
    });
    setPopoverMode('view');
  }, [familyMembers, updateFamilyMember]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
          <p className="text-gray-600">Explore and manage your family history</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddMember(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </button>
          <button onClick={handleShare} className="btn-secondary flex items-center">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
          <button onClick={handleImport} className="btn-secondary flex items-center">
            <Upload className="h-4 w-4 mr-2" /> Import
          </button>
        </div>
      </div>

      {/* Zoom & Root Controls */}
      <FamilyTreeControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        selectedRootId={activeRootId}
        onRootChange={setPreferredRootId}
        familyMembers={familyMembersList}
      />

      {/* Family Tree */}
      <div className="rounded-[32px] border border-gray-200 bg-white/80 shadow-lg backdrop-blur-xl">
        <div ref={scrollShellRef} className="p-0 overflow-auto max-h-[80vh] min-h-[60vh]">
          <div
            ref={containerRef}
            className="family-tree-canvas p-6 md:p-10 origin-top-center"
            style={{
              transform: `scale(${(zoom / 100) * autoScale})`,
              minHeight: '600px',
            }}
          >
            {hasMembers && activeRootId ? (
              <FamilyNode
                personId={activeRootId}
                familyData={familyMembers}
                collapsedNodes={collapsedNodes}
                onToggleCollapse={toggleCollapse}
                onOpenDetails={handlePersonClick}
                onCloseDetails={closeDetails}
                onToggleEditMode={handleToggleEdit}
                onDeletePerson={handleDeletePerson}
                onSavePerson={handleSavePerson}
                activePersonId={activePersonId}
                popoverMode={popoverMode}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Start building your family tree by adding your first member.
                </p>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="btn-primary flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add First Member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} />}
    </div>
  );
}
