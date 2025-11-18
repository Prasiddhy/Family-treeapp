'use client';

import { useRef, useState } from 'react';
import { useFamily } from '@/app/contexts/FamilyContext';

export default function DocumentsPage() {
  const { documents, addDocument, deleteDocument, familyMembers } = useFamily();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [personId, setPersonId] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (!file || !title) return;
    const url = URL.createObjectURL(file);
    addDocument({
      id: Date.now().toString(),
      title,
      fileUrl: url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      description: '',
      type: 'document',
      personIds: personId ? [personId] : [],
      isPublic: true,
      uploadedBy: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setTitle('');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Attach To (optional)</label>
            <select value={personId} onChange={e => setPersonId(e.target.value)} className="px-3 py-2 border rounded-md text-sm min-w-48">
              <option value="">None</option>
              {Object.values(familyMembers).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">File</label>
            <input ref={inputRef} type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
          <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Upload</button>
        </div>
      </div>

      <ul className="space-y-3">
        {documents.map(doc => (
          <li key={doc.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{doc.title}</div>
              <div className="text-xs text-gray-600">{doc.fileName} · {(doc.fileSize / 1024).toFixed(1)} KB</div>
              {doc.personIds?.length ? (
                <div className="text-xs text-gray-600 mt-1">Linked to: {doc.personIds.map(id => familyMembers[id]?.name || id).join(', ')}</div>
              ) : null}
            </div>
            <div className="flex gap-2">
              <a href={doc.fileUrl} target="_blank" className="px-3 py-1 border rounded-md text-sm">View</a>
              <button onClick={() => deleteDocument(doc.id)} className="px-3 py-1 border rounded-md text-sm">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}






