'use client';

import React from 'react';
import { FamilyData } from '../../types/family';
import FamilyNode from './FamilyNode';

interface FamilyTreeProps {
  familyData: FamilyData;
}

const FamilyTree = ({ familyData }: FamilyTreeProps) => {
  const roots = Object.values(familyData).filter(
    (person) => !Object.values(familyData).some((other) => other.children?.includes(person.id))
  );

  if (!roots.length) {
    return (
      <section className="min-h-screen w-full bg-white text-black flex items-center justify-center">
        <p className="text-lg tracking-wide">No family members found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white text-black py-12">
      <div className="w-full overflow-x-auto">
        <div className="inline-flex flex-col gap-16 px-6 pb-10">
          {roots.map((root) => (
            <div key={root.id} className="flex flex-col gap-8">
              <FamilyNode personId={root.id} familyData={familyData} generation={0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FamilyTree;
