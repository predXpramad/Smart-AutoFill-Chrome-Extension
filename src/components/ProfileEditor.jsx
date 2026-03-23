import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

export default function ProfileEditor({ profileId, profiles, onSave, onBack }) {
  const profile = profiles.find(p => p.id === profileId) || { name: '', fields: [] };
  const [name, setName] = useState(profile.name);
  const [fields, setFields] = useState(profile.fields);

  const addField = () => {
    setFields([...fields, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const updateField = (id, key, val) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: val } : f));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSave = () => {
    const updatedProfiles = profiles.map(p => 
      p.id === profileId ? { ...p, name, fields: fields.filter(f => f.key.trim() !== '') } : p
    );
    onSave(updatedProfiles);
    onBack();
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-1 text-gray-500 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1">PROFILE NAME</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="e.g. Job Application"
        />
      </div>

      <div className="flex justify-between items-center mb-2 mt-4">
        <label className="block text-xs font-semibold text-gray-600">FIELDS (KEY - VALUE)</label>
        <button onClick={addField} className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
          <Plus size={14} /> Add Field
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-md p-2 space-y-2 mb-4">
        {fields.length === 0 ? (
          <div className="text-center text-gray-400 py-4 text-xs italic">No fields specified.</div>
        ) : (
          fields.map(f => (
            <div key={f.id} className="flex gap-2 items-start relative group">
              <input 
                value={f.key} 
                onChange={(e) => updateField(f.id, 'key', e.target.value)} 
                className="w-[35%] border-b border-gray-300 focus:border-blue-500 text-sm p-1 focus:outline-none bg-gray-50 font-mono text-xs rounded-t" 
                placeholder="Key/ID/Name" 
              />
              <input 
                value={f.value} 
                onChange={(e) => updateField(f.id, 'value', e.target.value)} 
                className="w-[60%] border-b border-gray-300 focus:border-blue-500 text-sm p-1 focus:outline-none" 
                placeholder="Value to inject" 
              />
              <button onClick={() => removeField(f.id)} className="absolute -right-2 top-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none">
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={handleSave}
        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  );
}
