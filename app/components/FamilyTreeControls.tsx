'use client';
import React from 'react';
import { Person } from '@/app/types/family';

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  selectedRootId: string;
  onRootChange: (id: string) => void;
  familyMembers: Person[];
}

export default function FamilyTreeControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  selectedRootId,
  onRootChange,
  familyMembers,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <button onClick={onZoomOut} className="btn-secondary px-3 py-1 rounded">-</button>
        <span className="font-semibold">{zoom}%</span>
        <button onClick={onZoomIn} className="btn-secondary px-3 py-1 rounded">+</button>
        <button onClick={onResetZoom} className="btn-secondary px-3 py-1 rounded ml-2">Reset</button>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <label className="text-sm font-medium">Root:</label>
        <select
          value={selectedRootId}
          onChange={(e) => onRootChange(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={familyMembers.length === 0}
        >
          {familyMembers.length === 0 ? (
            <option value="">No members</option>
          ) : (
            familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
