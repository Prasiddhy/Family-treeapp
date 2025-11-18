'use client';

import React, { useEffect, useState } from 'react';
import { Person, FamilyData } from '../../types/family';

export type PersonPopoverMode = 'view' | 'edit';

export interface PersonFormValues {
  name: string;
  birthYear: string;
  deathYear: string;
  location: string;
  occupation: string;
  notes: string;
}

interface FamilyNodeProps {
  personId: string;
  familyData: FamilyData;
  depth?: number;
  collapsedNodes?: Set<string>;
  onToggleCollapse?: (personId: string) => void;
  onOpenDetails?: (person: Person) => void;
  onCloseDetails?: () => void;
  onToggleEditMode?: (personId: string) => void;
  onDeletePerson?: (personId: string) => void;
  onSavePerson?: (personId: string, values: PersonFormValues) => void;
  activePersonId?: string | null;
  popoverMode?: PersonPopoverMode;
}

const getSurname = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1]?.toLowerCase() ?? '';
};

const colorClasses = {
  male: 'bg-[#d9ecff]',
  female: 'bg-[#ffe0f2]',
  child: 'bg-[#fff7c2]',
  spouseDifferent: 'bg-[#d4f7c5]',
  default: 'bg-white',
};

const resolveCardColor = ({
  person,
  depth,
  isSpouse,
  partner,
}: {
  person: Person;
  depth: number;
  isSpouse: boolean;
  partner?: Person | null;
}) => {
  if (isSpouse && partner) {
    const personSurname = getSurname(person.name);
    const partnerSurname = getSurname(partner.name);
    if (personSurname && partnerSurname && personSurname !== partnerSurname) {
      return colorClasses.spouseDifferent;
    }
    if (person.gender === 'male') return colorClasses.male;
    if (person.gender === 'female') return colorClasses.female;
    return colorClasses.default;
  }
  if (depth > 0) {
    return colorClasses.child;
  }
  if (person.gender === 'male') return colorClasses.male;
  if (person.gender === 'female') return colorClasses.female;
  return colorClasses.default;
};

const PersonIcon = ({
  person,
  hasChildren,
  isCollapsed,
  onClick,
  onCollapseToggle,
  depth,
  isSpouse,
  partner,
}: {
  person: Person;
  hasChildren: boolean;
  isCollapsed: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCollapseToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  depth: number;
  isSpouse: boolean;
  partner?: Person | null;
}) => {
  const birth = person.birthDate || (person.birthYear ? `b. ${person.birthYear}` : null);
  const death = person.deathDate || (person.deathYear ? `d. ${person.deathYear}` : null);
  const cardColor = resolveCardColor({ person, depth, isSpouse, partner });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-person-icon="true"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative w-32 rounded-2xl border-2 border-black px-3 py-2 text-center text-black shadow-[0_6px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${cardColor}`}
      title="View details"
    >
      <p className="text-sm font-semibold leading-tight">{person.name || 'Unknown'}</p>
      {birth && <p className="text-[11px] uppercase tracking-wide mt-1">{birth}</p>}
      {death && <p className="text-[11px] uppercase tracking-wide">{death}</p>}
      {person.location && <p className="text-[10px] mt-1">{person.location}</p>}
      {hasChildren && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCollapseToggle?.(event);
          }}
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full border border-black bg-white text-[11px] font-bold flex items-center justify-center"
          aria-label={isCollapsed ? 'Expand branch' : 'Collapse branch'}
        >
          {isCollapsed ? '+' : '–'}
        </button>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-black/60 text-white text-xs font-semibold opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
        View
      </span>
    </div>
  );
};

const FamilyNode = ({
  personId,
  familyData,
  depth = 0,
  collapsedNodes,
  onToggleCollapse,
  onOpenDetails,
  onCloseDetails,
  onToggleEditMode,
  onDeletePerson,
  onSavePerson,
  activePersonId,
  popoverMode = 'view',
}: FamilyNodeProps) => {
  const person = familyData[personId];
  if (!person) return null;

  const spouse = person.spouseId ? familyData[person.spouseId] : null;
  const children = (person.children ?? []).filter((childId) => !!familyData[childId]);
  const hasChildren = children.length > 0;
  const isCollapsed = collapsedNodes?.has(personId) ?? false;
  const hasMultipleChildren = children.length > 1;
  const horizontalWidth = hasMultipleChildren ? Math.max(children.length * 140, 140) : 0;

  const handlePersonClick = (target: Person) => {
    onOpenDetails?.(target);
  };

  const handleCollapseToggle = (targetId: string) => {
    onToggleCollapse?.(targetId);
  };

  return (
    <div className="flex flex-col items-center gap-2 text-black" data-depth={depth}>
      <div className="flex items-start gap-3">
        <div className="relative flex items-start gap-0">
          <PersonIcon
            person={person}
            hasChildren={hasChildren}
            isCollapsed={isCollapsed}
            onClick={() => handlePersonClick(person)}
            onCollapseToggle={() => handleCollapseToggle(personId)}
            depth={depth}
            isSpouse={false}
            partner={spouse}
          />
          {activePersonId === person.id && (
            <PersonInfoCard
              person={person}
              mode={popoverMode}
              onClose={onCloseDetails}
              onEditToggle={() => onToggleEditMode?.(person.id)}
              onDelete={() => onDeletePerson?.(person.id)}
              onSave={(values) => onSavePerson?.(person.id, values)}
            />
          )}
        </div>
        {spouse && (
          <div className="flex items-start gap-3">
            <span className="h-0.5 w-6 bg-black mt-5" aria-hidden="true" />
            <div className="relative flex items-start">
              <PersonIcon
                person={spouse}
                hasChildren={false}
                isCollapsed={false}
                onClick={() => handlePersonClick(spouse)}
                depth={depth}
                isSpouse
                partner={person}
              />
              {activePersonId === spouse.id && (
                <PersonInfoCard
                  person={spouse}
                  mode={popoverMode}
                  onClose={onCloseDetails}
                  onEditToggle={() => onToggleEditMode?.(spouse.id)}
                  onDelete={() => onDeletePerson?.(spouse.id)}
                  onSave={(values) => onSavePerson?.(spouse.id, values)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {hasChildren && (
        <div className="flex flex-col items-center w-full">
          <div className={`w-0.5 ${hasMultipleChildren ? 'h-6' : 'h-10'} bg-black`} aria-hidden="true" />
          {!isCollapsed && (
            <>
              {hasMultipleChildren && (
                <span
                  className="mt-1 h-0.5 bg-black"
                  aria-hidden="true"
                  style={{ width: `${horizontalWidth}px` }}
                />
              )}
              {hasMultipleChildren ? (
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 pt-4 w-full">
                  {children.map((childId) => (
                    <div key={childId} className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-black" aria-hidden="true" />
                      <div className="pt-4">
                        <FamilyNode
                          personId={childId}
                          familyData={familyData}
                          depth={depth + 1}
                          collapsedNodes={collapsedNodes}
                          onToggleCollapse={onToggleCollapse}
                          onOpenDetails={onOpenDetails}
                          onCloseDetails={onCloseDetails}
                          onToggleEditMode={onToggleEditMode}
                          onDeletePerson={onDeletePerson}
                          onSavePerson={onSavePerson}
                          activePersonId={activePersonId}
                          popoverMode={popoverMode}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-4">
                  <FamilyNode
                    personId={children[0]}
                    familyData={familyData}
                    depth={depth + 1}
                    collapsedNodes={collapsedNodes}
                    onToggleCollapse={onToggleCollapse}
                    onOpenDetails={onOpenDetails}
                    onCloseDetails={onCloseDetails}
                    onToggleEditMode={onToggleEditMode}
                    onDeletePerson={onDeletePerson}
                    onSavePerson={onSavePerson}
                    activePersonId={activePersonId}
                    popoverMode={popoverMode}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyNode;

const toFormValues = (person: Person): PersonFormValues => ({
  name: person.name || '',
  birthYear: person.birthYear?.toString() || '',
  deathYear: person.deathYear?.toString() || '',
  location: person.location || '',
  occupation: person.occupation || '',
  notes: person.notes || '',
});

interface PersonInfoCardProps {
  person: Person;
  mode: PersonPopoverMode;
  onClose?: () => void;
  onEditToggle?: () => void;
  onDelete?: () => void;
  onSave?: (values: PersonFormValues) => void;
}

const PersonInfoCard: React.FC<PersonInfoCardProps> = ({
  person,
  mode,
  onClose,
  onEditToggle,
  onDelete,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<PersonFormValues>(() => toFormValues(person));

  useEffect(() => {
    setFormValues(toFormValues(person));
  }, [person]);

  const handleChange = (field: keyof PersonFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave?.(formValues);
  };

  let content: React.ReactNode;
  if (mode === 'edit') {
    content = (
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="text-xs font-semibold uppercase tracking-wide">Name</label>
        <input
          className="w-full rounded-xl border border-black/40 px-3 py-1.5 text-sm"
          value={formValues.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide">Birth Year</label>
            <input
              className="w-full rounded-xl border border-black/40 px-3 py-1.5 text-sm"
              value={formValues.birthYear}
              onChange={(e) => handleChange('birthYear', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide">Death Year</label>
            <input
              className="w-full rounded-xl border border-black/40 px-3 py-1.5 text-sm"
              value={formValues.deathYear}
              onChange={(e) => handleChange('deathYear', e.target.value)}
            />
          </div>
        </div>
        <label className="text-xs font-semibold uppercase tracking-wide">Location</label>
        <input
          className="w-full rounded-xl border border-black/40 px-3 py-1.5 text-sm"
          value={formValues.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
        <label className="text-xs font-semibold uppercase tracking-wide">Occupation</label>
        <input
          className="w-full rounded-xl border border-black/40 px-3 py-1.5 text-sm"
          value={formValues.occupation}
          onChange={(e) => handleChange('occupation', e.target.value)}
        />
        <label className="text-xs font-semibold uppercase tracking-wide">Notes</label>
        <textarea
          className="w-full rounded-xl border border-black/40 px-3 py-2 text-sm"
          rows={3}
          value={formValues.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onEditToggle}
            className="rounded border-2 border-black px-3 py-1 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded border-2 border-black bg-black px-4 py-1 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </form>
    );
  } else {
    content = (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">{person.name || 'Unknown'}</h4>
            {person.occupation && <p className="text-xs uppercase tracking-wide">{person.occupation}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close details" className="p-1">
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-black/60">Born</p>
            <p>{person.birthDate || person.birthYear || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/60">Died</p>
            <p>{person.deathDate || person.deathYear || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/60">Location</p>
            <p>{person.location || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/60">Status</p>
            <p>{person.isAlive ? 'Living' : 'Deceased'}</p>
          </div>
        </div>
        {person.notes && (
          <div>
            <p className="text-xs uppercase tracking-wide text-black/60">Notes</p>
            <p className="text-sm leading-snug">{person.notes}</p>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onEditToggle}
            className="rounded border-2 border-black px-3 py-1 text-sm font-semibold"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded border-2 border-black bg-black px-3 py-1 text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-full top-0 ml-4 w-80 max-w-sm rounded-3xl border-2 border-black bg-white p-4 text-black shadow-2xl z-10"
      data-person-popover="true"
      onClick={(event) => event.stopPropagation()}
    >
      {content}
    </div>
  );
};
