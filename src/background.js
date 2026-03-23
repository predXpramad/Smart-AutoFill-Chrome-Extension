// Background Service Worker
console.log('Background service worker is running.');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed successfully.');
  
  // Initialize storage if needed
  chrome.storage.local.set({ isInitialized: true });
});

// Example of listening to messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GREETING') {
    sendResponse({ reply: 'Hello from the background script!' });
  }
  return true; // Keeps the messaging channel open for async response
});
