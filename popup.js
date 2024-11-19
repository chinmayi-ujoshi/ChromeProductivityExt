// Fetch and display the current limit on popup load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("limit", (data) => {
    if (data.limit) {
      document.getElementById("limit").value = data.limit;
    }
  });
});

// Handle the save button click
document.getElementById("save").addEventListener("click", () => {
  const newLimit = parseInt(document.getElementById("limit").value, 10);

  // Validate the input
  if (isNaN(newLimit) || newLimit <= 0) {
    document.getElementById("status").textContent = "Please enter a valid number.";
    return;
  }

  // Send the new limit to background.js
  chrome.runtime.sendMessage(
    { action: "setLimit", limit: newLimit },
    (response) => {
      if (response && response.status === "success") {
        // Update storage and provide feedback to the user
        chrome.storage.local.set({ limit: newLimit }, () => {
          document.getElementById("status").textContent = "Tab limit updated successfully!";
        });
      } else {
        document.getElementById("status").textContent = "Failed to update tab limit.";
      }
    }
  );
});
