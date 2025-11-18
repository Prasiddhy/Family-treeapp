'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Person } from '@/app/types/family';

export default function AddMember({ onAdd }: { onAdd: (member: Person) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');

  const submit = () => {
    const id = Date.now().toString();
    onAdd({
      id,
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
      gender,
      isAlive: true,
    });
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add Member</h2>
      <div className="space-y-3">
        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder="First name"
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        />
        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder="Last name"
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
        <select
          className="w-full border rounded-md px-3 py-2"
          value={gender}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value as 'male' | 'female' | 'other')}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={submit} className="btn-primary">Add</button>
      </div>
    </div>
  );
}









