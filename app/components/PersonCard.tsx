'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PersonCardProps as OriginalProps } from '../types/family';
import { getLifeStatus, getGenerationColor } from '../lib/family-utils';
import { cn } from '../utils/cn';
import { MapPin, Briefcase, Heart, HeartOff, Trash } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { useNotification } from '../contexts/NotificationContext';
import PlaceholderImage from '../PlaceholderImage';

interface PersonCardProps extends OriginalProps {
  size?: 'normal' | 'small';
}

const PersonCard: React.FC<PersonCardProps> = ({ person, relation, level, onClick, size = 'small' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const { deleteFamilyMember } = useFamily();
  const { addNotification } = useNotification();

  const colorClasses = getGenerationColor(level);
  const lifeStatus = getLifeStatus(person);
  const isAlive = typeof person.isAlive === 'boolean' ? person.isAlive : !person.deathYear;

  const dimension = size === 'normal' ? 36 : 20; 
  const fontSize = size === 'normal' ? 'text-base' : 'text-[0.55rem]';
  const smallIcon = size === 'normal' ? 4 : 2; 

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg',
        onClick && 'hover:z-10'
      )}
      onClick={(e) => onClick?.(person, e)}
    >
      {/* Trash Button - visible on hover */}
      <button
        type="button"
        className="hidden group-hover:flex absolute top-0 right-0 z-20 bg-white rounded-full shadow p-0.5 text-gray-500 hover:text-red-600 transition border border-gray-200"
        style={{ pointerEvents: 'auto' }}
        aria-label="Delete"
        tabIndex={-1}
        onClick={e => { e.stopPropagation(); setShowConfirm(true); }}
      >
        <Trash className="w-4 h-4" />
      </button>
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30" onClick={() => setShowConfirm(false)}>
          <div
            className="bg-white p-4 rounded shadow-xl flex flex-col items-center min-w-[16rem]"
            onClick={e => e.stopPropagation()}
          >
            <p className="mb-4 text-sm text-gray-800">Are you sure you want to delete <span className="font-bold">{person.name}</span>?</p>
            <div className="flex gap-2 w-full justify-center">
              <button
                className="px-3 py-1 rounded text-sm border bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded text-sm border bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  deleteFamilyMember(person.id);
                  addNotification({
                    type: 'success',
                    title: 'Deleted',
                    message: `${person.name} was removed from the tree`,
                  });
                  setShowConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={cn(
          `relative w-[${dimension}px] h-[${dimension}px] rounded-full overflow-hidden border-2 shadow-sm bg-white transition-all duration-300 group-hover:shadow-md`,
          colorClasses
        )}
      >
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-700" />
          </div>
        )}
        {!imageError ? (
          <Image
            src={person.image || '/api/placeholder/200/200'}
            alt={person.name || 'Family member'}
            width={dimension * 4}
            height={dimension * 4}
            className={cn(
              'object-cover w-full h-full transition-opacity duration-300',
              imageLoading ? 'opacity-0' : 'opacity-100'
            )}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoading(false)}
            priority={level === 0}
          />
        ) : (
          <PlaceholderImage name={person.name} size={dimension * 4} className="w-full h-full" />
        )}
        <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full shadow-sm border border-gray-200`}>
          {isAlive ? (
            <Heart className={`w-${smallIcon} h-${smallIcon} text-green-500`} />
          ) : (
            <HeartOff className={`w-${smallIcon} h-${smallIcon} text-red-500`} />
          )}
        </div>
        <div className="absolute -top-1 -left-1 px-1 py-0.5 bg-purple-700 text-white text-[0.45rem] font-medium rounded-sm shadow-sm">
          G{level + 1}
        </div>
      </div>

      <div className={`flex flex-col items-center text-center mt-1 gap-0.5 max-w-[5rem] px-1`}>
        <h3 className={`${fontSize} font-semibold text-black truncate`}>{person.name}</h3>
        <p className="text-[0.45rem] text-gray-700 truncate">{lifeStatus}</p>
        {relation && (
          <p className="text-[0.45rem] text-purple-700 font-medium px-1 py-0.5 bg-purple-100 rounded-full truncate">
            {relation}
          </p>
        )}

        <div className="flex flex-col gap-0.5 mt-1 w-full">
          {person.occupation && (
            <div className="flex items-center justify-center text-[0.45rem] text-gray-700 truncate">
              <Briefcase className="w-2 h-2 mr-1 flex-shrink-0" />
              <span className="truncate">{person.occupation}</span>
            </div>
          )}
          {person.location && (
            <div className="flex items-center justify-center text-[0.45rem] text-gray-700 truncate">
              <MapPin className="w-2 h-2 mr-1 flex-shrink-0" />
              <span className="truncate">{person.location}</span>
            </div>
          )}
          {person.fatherName && (
            <p className="text-[0.45rem] text-gray-800 truncate">Father: {person.fatherName}</p>
          )}
          {person.motherName && (
            <p className="text-[0.45rem] text-gray-800 truncate">Mother: {person.motherName}</p>
          )}
          {person.maritalStatus && (
            <p className="text-[0.45rem] text-gray-800 truncate">Marital Status: {person.maritalStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
