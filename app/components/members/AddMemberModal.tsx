'use client';
import { useState } from 'react';

interface AddMemberModalProps {
  onClose: () => void;
  parentId?: string;
}

export default function AddMemberModal({ onClose, parentId }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);

  const handleAdd = () => {
    console.log('Adding member:', { name, birthYear, parentId });
    // Here you can call your addMember function in FamilyContext
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Add Member</h2>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-2 py-1 rounded mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Birth Year</label>
        <input
          type="number"
          value={birthYear ?? ''}
          onChange={(e) => setBirthYear(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded mb-4"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary px-3 py-1 rounded">
            Cancel
          </button>
          <button onClick={handleAdd} className="btn-primary px-3 py-1 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
