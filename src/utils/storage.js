export const getProfiles = async () => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    const data = localStorage.getItem('profiles');
    return data ? JSON.parse(data) : [];
  }
  return new Promise((resolve) => {
    chrome.storage.local.get(['profiles'], (result) => {
      resolve(result.profiles || []);
    });
  });
};

export const saveProfiles = async (profiles) => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    return true;
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ profiles }, () => {
      resolve(true);
    });
  });
};
