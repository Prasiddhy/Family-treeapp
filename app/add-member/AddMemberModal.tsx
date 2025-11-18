'use client';

import { useState } from 'react';
import { Person } from '@/app/types/family';

interface AddMemberProps {
  onAdd: (member: Person) => void;
  onClose?: () => void;
}

export default function AddMember({ onAdd, onClose }: AddMemberProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    deathDate: '',
    isAlive: true,
    gender: 'male' as 'male' | 'female' | 'other',
    maritalStatus: 'unmarried' as 'married' | 'unmarried',
    occupation: '',
    location: '',
    biography: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMember: Person = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      middleName: formData.middleName || undefined,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
      fatherName: formData.fatherName || undefined,
      motherName: formData.motherName || undefined,
      birthDate: formData.birthDate || undefined,
      birthYear: formData.birthDate ? new Date(formData.birthDate).getFullYear() : undefined,
      deathDate: formData.deathDate || undefined,
      deathYear: formData.deathDate ? new Date(formData.deathDate).getFullYear() : undefined,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation || undefined,
      location: formData.location || undefined,
      biography: formData.biography || undefined,
      notes: formData.notes || undefined,
      isAlive: formData.isAlive,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(newMember);

    // Reset form
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      fatherName: '',
      motherName: '',
      birthDate: '',
      deathDate: '',
      isAlive: true,
      gender: 'male',
      maritalStatus: 'unmarried',
      occupation: '',
      location: '',
      biography: '',
      notes: '',
    });

    if (onClose) onClose();
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full text-white">
      <h2 className="text-xl font-bold mb-4">Add Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="form-input w-full mt-1 text-black"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="text-white">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
              placeholder="Middle Name"
            />
          </div>
          <div>
            <label className="text-white">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="form-input w-full mt-1 text-black"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Parents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white">Father&apos;s Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
              placeholder="Father&apos;s Name"
            />
          </div>
          <div>
            <label className="text-white">Mother&apos;s Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
              placeholder="Mother&apos;s Name"
            />
          </div>
        </div>

        {/* Gender & Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-white">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            >
              <option value="unmarried">Unmarried</option>
              <option value="married">Married</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            />
          </div>
          <div>
            <label className="text-white">Death Date</label>
            <input
              type="date"
              name="deathDate"
              value={formData.deathDate}
              onChange={handleChange}
              disabled={formData.isAlive}
              className="form-input w-full mt-1 text-black"
            />
            <label className="text-white mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                name="isAlive"
                checked={formData.isAlive}
                onChange={handleChange}
              />
              This person is alive
            </label>
          </div>
        </div>

        {/* Other Info */}
        <div className="space-y-4">
          <div>
            <label className="text-white">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            />
          </div>
          <div>
            <label className="text-white">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            />
          </div>
          <div>
            <label className="text-white">Biography</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            />
          </div>
          <div>
            <label className="text-white">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input w-full mt-1 text-black"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
}
