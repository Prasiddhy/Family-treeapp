'use client';

import { useMemo } from 'react';
import { useFamily } from '@/app/contexts/FamilyContext';

export default function TimelinePage() {
  const { events, familyMembers } = useFamily();
  const items = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Family Timeline</h1>
      {items.length === 0 && <p className="text-gray-600">No events yet.</p>}
      <ul className="space-y-4">
        {items.map(ev => (
          <li key={ev.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-gray-500">{new Date(ev.date).toLocaleDateString()}</div>
            <div className="font-medium">{ev.title}</div>
            {ev.description && <div className="text-sm text-gray-700 dark:text-zinc-300">{ev.description}</div>}
            {ev.personIds?.length ? (
              <div className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                People: {ev.personIds.map(id => familyMembers[id]?.name || id).join(', ')}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}






