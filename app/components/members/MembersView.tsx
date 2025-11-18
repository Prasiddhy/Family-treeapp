'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useFamily } from '@/app/contexts/FamilyContext';
import PersonCard from '@/app/components/PersonCard';

export default function MembersView() {
  const { familyMembers, searchFamilyMembers } = useFamily();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'alive' | 'deceased'>('all');
  const [minYear, setMinYear] = useState<number | ''>('');
  const [maxYear, setMaxYear] = useState<number | ''>('');

  const members = useMemo(() => {
    const base = query ? searchFamilyMembers(query) : Object.values(familyMembers);
    return base.filter(m => {
      if (status !== 'all') {
        const isAlive = typeof m.isAlive === 'boolean' ? m.isAlive : !m.deathYear;
        if (status === 'alive' && !isAlive) return false;
        if (status === 'deceased' && isAlive) return false;
      }
      if (minYear !== '' && (m.birthYear ?? 0) < (minYear as number)) return false;
      if (maxYear !== '' && (m.birthYear ?? 9999) > (maxYear as number)) return false;
      return true;
    });
  }, [familyMembers, query, searchFamilyMembers, status, minYear, maxYear]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Search</label>
          <input
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search by name, occupation, location"
            className="px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Status</label>
          <select
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as 'all' | 'alive' | 'deceased')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="alive">Living</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Birth Year Min</label>
          <input
            type="number"
            value={minYear}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMinYear(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm w-28"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Birth Year Max</label>
          <input
            type="number"
            value={maxYear}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxYear(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm w-28"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {members.map((person) => (
          <div key={person.id} className="flex justify-center">
            <PersonCard person={person} level={0} size="normal" />
          </div>
        ))}
      </div>
    </div>
  );
}


