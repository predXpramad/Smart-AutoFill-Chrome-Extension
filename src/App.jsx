import React, { useState, useEffect } from 'react';
import ProfileManager from './components/ProfileManager';
import ProfileEditor from './components/ProfileEditor';
import { getProfiles, saveProfiles } from './utils/storage';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProfiles();
      setProfiles(data);
      if (data.length > 0) setActiveProfileId(data[0].id);
      setIsReady(true);
    };
    loadData();
  }, []);

  const handleSaveProfiles = async (newProfiles) => {
    setProfiles(newProfiles);
    await saveProfiles(newProfiles);
  };

  const handleAutofill = () => {
    const activeProfile = profiles.find(p => p.id === activeProfileId);
    if (!activeProfile) return;
    
    // Check if chrome object is available (it might not be during Vite dev mode)
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'FILL_FORM',
            profile: activeProfile
          });
        }
      });
    } else {
      console.log('Sending FILL_FORM message for profile:', activeProfile);
      alert('Extension environment not detected! Open in Chrome Extension popup.');
    }
  };

  if (!isReady) return <div className="p-4 flex h-full justify-center items-center text-gray-500">Loading Smart Autofill...</div>;

  return (
    <div className="flex flex-col min-h-[400px] h-screen bg-gray-50 relative overflow-hidden">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center shadow-sm">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
             </svg>
           </div>
           <h1 className="text-base font-bold text-gray-800 tracking-tight">Smart Autofill</h1>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto w-full relative">
        <ProfileManager 
          profiles={profiles}
          onProfilesChange={handleSaveProfiles}
          activeProfileId={activeProfileId}
          onSelectActive={setActiveProfileId}
          onEdit={setEditingProfileId}
        />

        {/* Render editor strictly overlaid if editingProfileId is present */}
        {editingProfileId !== null && (
          <div className="absolute inset-0 z-20">
             <ProfileEditor 
              profileId={editingProfileId} 
              profiles={profiles}
              onSave={handleSaveProfiles}
              onBack={() => setEditingProfileId(null)}
            />
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t mt-auto z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <button 
          onClick={handleAutofill}
          disabled={profiles.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Autofill Current Page
        </button>
      </footer>
    </div>
  );
}

export default App;
