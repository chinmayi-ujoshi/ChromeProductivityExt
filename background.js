// Initialize tab limit from storage on startup
chrome.storage.local.get(['limit'], (result) => {
  if (result.limit) {
    maxTabs = result.limit;
  }
});

// Function to set a new tab limit
function setNewLimit(newLimit) {
  maxTabs = newLimit;
  chrome.storage.local.set({ limit: newLimit });
  notifyUser(`Tab limit set to ${newLimit}.`);
}

// Function to enforce tab limit when a new tab is opened
function enforceTabLimit(newTab) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length > maxTabs) {
      chrome.tabs.remove(newTab.id);
      notifyUser("Tab limit reached! Closing the latest tab.");
    }
  });
}

// Notify user using Chrome notifications
function notifyUser(message) {
  chrome.notifications.create({
    type: 'basic',
    title: 'Tab Limiter',
    message: message,
  });
}

// Listen for any new tab being opened
chrome.tabs.onCreated.addListener(enforceTabLimit);

// Listen for messages from popup.js to update the limit
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setLimit") {
    setNewLimit(message.limit);
    sendResponse({ status: "success" });
  }
});

// Set default limit on extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ limit: 10 });
});
