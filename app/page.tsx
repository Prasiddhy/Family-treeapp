'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { Users, PlusCircle, TreeDeciduous, FolderOpen } from 'lucide-react';
import { useFamily } from './contexts/FamilyContext';

export default function HomePage() {
  const { familyMembers } = useFamily();
  const members = Object.values(familyMembers);
  
  // Quick family data calculations
  const stats = useMemo(() => {
    const total = members.length;
    const generations = new Set<number>();
    let alive = 0;
    let deceased = 0;
    let lastUpdated: Date | undefined;
    members.forEach(m => {
      if (typeof m.isAlive === 'boolean' ? m.isAlive : !m.deathYear) alive++;
      else deceased++;
      if (m.birthYear) generations.add(m.birthYear);
      if (!lastUpdated || (m.updatedAt > lastUpdated)) lastUpdated = m.updatedAt;
    });
    // Use birthYear for gen count as fallback, or children arrays if present.
    let genCount = 1;
    if (members.length > 0) {
      // crude: get unique generations by birthYear, else count root to leaves
      const byGeneration = new Map<number, number>();
      members.forEach(m => {
        if (m.birthYear) byGeneration.set(m.birthYear, (byGeneration.get(m.birthYear) || 0) + 1);
      });
      genCount = byGeneration.size || 1;
    }
    return {
      total,
      alive,
      deceased,
      generations: genCount,
      lastUpdated: lastUpdated ? new Date(lastUpdated) : undefined,
    };
  }, [members]);

  // Most recently added/updated members
  const recent = useMemo(() => (
    [...members]
      .sort((a, b) => (b.updatedAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? 0))
      .slice(0, 4)
  ), [members]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-16">
      {/* Header/Welcome */}
      <div className="w-full max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight flex items-center justify-center gap-2">
          Family Roots
          <span className="inline-block w-4 h-4 rounded-full bg-[var(--accent)]"></span>
        </h1>
        <p className="text-lg text-[var(--muted)] font-medium max-w-xl mx-auto">Explore your family history visually—grow and preserve your legacy.</p>
      </div>

      {/* Quick Actions Row */}
      <div className="w-full max-w-3xl flex flex-wrap justify-center gap-6 mb-10">
        <Link href="/family">
          <div className="w-48 rounded-2xl bg-[var(--card-bg)] hover:shadow-lg shadow transition p-6 flex flex-col items-center cursor-pointer border border-[var(--border-color)]">
            <TreeDeciduous className="w-8 h-8 mb-2 text-[var(--accent)]" />
            <span className="text-lg font-semibold">View Family Tree</span>
          </div>
        </Link>
        <Link href="/add-member">
          <div className="w-48 rounded-2xl bg-[var(--card-bg)] hover:shadow-lg shadow transition p-6 flex flex-col items-center cursor-pointer border border-[var(--border-color)]">
            <PlusCircle className="w-8 h-8 mb-2 text-[var(--accent)]" />
            <span className="text-lg font-semibold">Add Member</span>
          </div>
        </Link>
        <Link href="/members">
          <div className="w-48 rounded-2xl bg-[var(--card-bg)] hover:shadow-lg shadow transition p-6 flex flex-col items-center cursor-pointer border border-[var(--border-color)]">
            <Users className="w-8 h-8 mb-2 text-[var(--accent)]" />
            <span className="text-lg font-semibold">Members List</span>
          </div>
        </Link>
        <Link href="/documents">
          <div className="w-48 rounded-2xl bg-[var(--card-bg)] hover:shadow-lg shadow transition p-6 flex flex-col items-center cursor-pointer border border-[var(--border-color)]">
            <FolderOpen className="w-8 h-8 mb-2 text-[var(--accent)]" />
            <span className="text-lg font-semibold">Media / Documents</span>
          </div>
        </Link>
      </div>
      {/* Statistics Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="rounded-xl bg-[var(--card-bg)] p-5 shadow border border-[var(--border-color)] flex flex-col items-center">
          <span className="text-sm text-[var(--muted)] mb-1">Total Members</span>
          <span className="text-2xl font-bold text-[var(--accent)]">{stats.total}</span>
        </div>
        <div className="rounded-xl bg-[var(--card-bg)] p-5 shadow border border-[var(--border-color)] flex flex-col items-center">
          <span className="text-sm text-[var(--muted)] mb-1">Generations</span>
          <span className="text-2xl font-bold text-[var(--accent)]">{stats.generations}</span>
        </div>
        <div className="rounded-xl bg-[var(--card-bg)] p-5 shadow border border-[var(--border-color)] flex flex-col items-center">
          <span className="text-sm text-[var(--muted)] mb-1">Living</span>
          <span className="text-2xl font-bold text-green-600">{stats.alive}</span>
        </div>
        <div className="rounded-xl bg-[var(--card-bg)] p-5 shadow border border-[var(--border-color)] flex flex-col items-center">
          <span className="text-sm text-[var(--muted)] mb-1">Deceased</span>
          <span className="text-2xl font-bold text-red-500">{stats.deceased}</span>
        </div>
      </div>
      {/* Recent Activity */}
      <section className="w-full max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-5">Recent Activity</h2>
        <ul className="space-y-3">
          {recent.length === 0 && <li className="text-[var(--muted)]">No recent updates yet.</li>}
          {recent.map(person => (
            <li key={person.id} className="rounded-lg bg-[var(--card-bg)] shadow-sm border border-[var(--border-color)] px-4 py-3 flex items-center gap-4">
              <img src={person.image || '/api/placeholder/100/100'} alt={person.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border-color)]" />
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-[var(--foreground)]">{person.name}</span>
                <span className="text-xs text-[var(--muted)]">Last updated: {person.updatedAt ? new Date(person.updatedAt).toLocaleDateString() : '—'}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
