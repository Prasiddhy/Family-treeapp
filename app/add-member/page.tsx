'use client';

import { useState } from 'react';
import { Person } from '../types/family';
import { v4 as uuidv4 } from 'uuid';

export default function AddMemberPage() {
  const [formData, setFormData] = useState<Partial<Person>>({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    spouseId: '',
    birthYear: undefined,
    deathYear: undefined,
    gender: 'male',
    occupation: '',
    location: '',
    isAlive: true,
    image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: Person = {
      id: uuidv4(),
      name: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      maritalStatus: formData.maritalStatus,
      spouseId: formData.spouseId,
      children: [],
      birthYear: formData.birthYear,
      deathYear: formData.deathYear,
      gender: formData.gender,
      occupation: formData.occupation,
      location: formData.location,
      isAlive: formData.isAlive ?? true,
      image: formData.image,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const res = await fetch('/api/add-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPerson)
    });

    if (res.ok) {
      alert('Member added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        maritalStatus: '',
        spouseId: '',
        birthYear: undefined,
        deathYear: undefined,
        gender: 'male',
        occupation: '',
        location: '',
        isAlive: true,
        image: ''
      });
    } else {
      alert('Failed to add member');
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Add Family Member</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input className="p-2 bg-gray-700 text-white" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input className="p-2 bg-gray-700 text-white" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input className="p-2 bg-gray-700 text-white" name="fatherName" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} />
        <input className="p-2 bg-gray-700 text-white" name="motherName" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} />
        <select className="p-2 bg-gray-700 text-white" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="">Marital Status</option>
          <option value="married">Married</option>
          <option value="unmarried">Unmarried</option>
        </select>
        <input className="p-2 bg-gray-700 text-white" name="spouseId" placeholder="Spouse ID (if any)" value={formData.spouseId} onChange={handleChange} />
        <input className="p-2 bg-gray-700 text-white" name="birthYear" type="number" placeholder="Birth Year" value={formData.birthYear || ''} onChange={handleChange} />
        <input className="p-2 bg-gray-700 text-white" name="deathYear" type="number" placeholder="Death Year" value={formData.deathYear || ''} onChange={handleChange} />
        <select className="p-2 bg-gray-700 text-white" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input className="p-2 bg-gray-700 text-white" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} />
        <input className="p-2 bg-gray-700 text-white" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input className="p-2 bg-gray-700 text-white" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <button className="p-2 bg-blue-600 hover:bg-blue-700" type="submit">Add Member</button>
      </form>
    </div>
  );
}
