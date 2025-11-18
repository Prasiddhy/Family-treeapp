'use client';

import { useState, useEffect } from 'react';
import { FamilyData } from '../types/family';
import FamilyTree from '../components/family-tree/FamilyTree';


export default function FamilyPage() {
  const [familyData, setFamilyData] = useState<FamilyData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await fetch('/api/family');
        const data: FamilyData = await res.json();
        setFamilyData(data);
      } catch (err) {
        console.error('Failed to fetch family data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFamily();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return <FamilyTree familyData={familyData} />;
}
