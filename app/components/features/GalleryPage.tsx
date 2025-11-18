'use client';

import React from 'react';
import Image from 'next/image';

const GalleryPage: React.FC = () => {
  const dummyPhotos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">Family Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {dummyPhotos.map((src, idx) => (
          <Image key={idx} src={src} alt={`Photo ${idx + 1}`} width={200} height={160} className="w-full h-40 object-cover rounded-lg shadow-md" />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
