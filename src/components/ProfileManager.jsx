import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Copy } from 'lucide-react';

export default function ProfileManager({ profiles, onProfilesChange, activeProfileId, onSelectActive, onEdit }) {
  const handleAddNew = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: `New Profile ${profiles.length + 1}`,
      fields: []
    };
    onProfilesChange([...profiles, newProfile]);
    onEdit(newProfile.id);
  };

  const handleCopy = (profile, e) => {
    e.stopPropagation();
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`
    };
    onProfilesChange([...profiles, newProfile]);
    onSelectActive(newProfile.id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if(confirm('Delete this profile?')) {
      onProfilesChange(profiles.filter(p => p.id !== id));
      if(activeProfileId === id) {
        const remaining = profiles.filter(p => p.id !== id);
        onSelectActive(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Your Profiles</h2>
        <button onClick={handleAddNew} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
          <Plus size={16} /> Add
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-dashed border-gray-300">
          No profiles found. Create one to get started!
        </div>
      ) : (
        profiles.map(p => (
          <div 
            key={p.id} 
            onClick={() => onSelectActive(p.id)}
            className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all ${activeProfileId === p.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
              {activeProfileId === p.id ? <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" /> : <div className="w-[18px] flex-shrink-0" />}
              <span className="font-medium text-gray-800 truncate" title={p.name}>{p.name}</span>
            </div>
            
            <div className="flex gap-1 flex-shrink-0">
              <button title="Duplicate Profile" onClick={(e) => handleCopy(p, e)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Copy size={16} />
              </button>
              <button title="Edit Profile" onClick={(e) => { e.stopPropagation(); onEdit(p.id); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Edit2 size={16} />
              </button>
              <button title="Delete Profile" onClick={(e) => handleDelete(p.id, e)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
