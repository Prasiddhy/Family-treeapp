'use client';

import React from 'react';
import { Person, FamilyData } from '../../types/family';

interface FamilyNodeProps {
  personId: string;
  familyData: FamilyData;
  generation?: number;
  isRoot?: boolean;
}

// Member card
const MemberCard = ({ person, generation }: { person: Person; generation: number }) => {
  const colors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50'];
  const bg = colors[generation % colors.length];

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg shadow-sm border ${bg} w-40`}>
      <p className="text-center font-semibold">{person.name}</p>
      {person.birthYear && <p className="text-xs text-gray-600">b. {person.birthYear}</p>}
      {person.location && <p className="text-xs text-gray-500">{person.location}</p>}
    </div>
  );
};

const FamilyNode = ({
  personId,
  familyData,
  generation = 0,
  isRoot = false,
}: FamilyNodeProps) => {
  const person = familyData[personId];
  if (!person) return null;

  const spouse = person.spouseId ? familyData[person.spouseId] : null;
  const hasChildren = Array.isArray(person.children) && person.children.length > 0;

  return (
    <div className="flex flex-col items-center w-full">
      {!isRoot && <div className="w-px h-6 bg-gray-400 mb-1" />}

      {/* Couple container */}
      <div className="flex items-center justify-center gap-4 flex-nowrap">
        <MemberCard person={person} generation={generation} />
        {spouse && <MemberCard person={spouse} generation={generation} />}
      </div>

      {/* Children */}
      {hasChildren && (
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-px h-6 bg-gray-400" />
          <div className="flex justify-center w-full mt-[-1px] mb-2">
            <div className="h-px bg-gray-400 w-full max-w-[90%]" />
          </div>

          <div
            className="grid gap-x-8 gap-y-8 w-full justify-items-center"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))` }}
          >
            {person.children!.map((childId) => (
              <FamilyNode
                key={childId}
                personId={childId}
                familyData={familyData}
                generation={generation + 1}
                isRoot={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyNode;
