document.addEventListener('DOMContentLoaded', () => {
  // Navigation Buttons
  setupNavButton('nav-dcp', 'https://dashboards.toastmasters.org/ClubReport.aspx?id=55');
  setupNavButton('nav-paths', 'https://app.basecamp.toastmasters.org/dashboard/bcm-dashboard/paths-progress');
  setupNavButton('nav-speakers', 'https://app.basecamp.toastmasters.org/dashboard/bcm-dashboard/member-overview');

  // Save Buttons
  setupSaveButton('save-dcp', 'saveDCP');
  setupSaveButton('save-paths', 'savePaths');
  setupSaveButton('save-speakers', 'saveSpeakers');

  // Export & Clear
  document.getElementById('btn-export-final').addEventListener('click', exportFinalReport);
  document.getElementById('btn-clear-data').addEventListener('click', clearData);

  // Check initial status
  checkSavedStatus();
});

function checkSavedStatus() {
  const keys = {
    'dcpData': 'status-dcp',
    'pathsData': 'status-paths',
    'speakersData': 'status-speakers'
  };

  chrome.storage.local.get(Object.keys(keys), (items) => {
    for (const [key, elementId] of Object.entries(keys)) {
      const element = document.getElementById(elementId);
      if (element) {
        if (items[key]) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      }
    }
  });
}

function setupNavButton(elementId, url) {
  const btn = document.getElementById(elementId);
  if (btn) {
    btn.addEventListener('click', () => {
      chrome.tabs.create({ url: url });
    });
  }
}

function setupSaveButton(elementId, action) {
  const btn = document.getElementById(elementId);
  if (btn) {
    btn.addEventListener('click', () => {
      sendMessageToContentScript({ action }, () => {
        // Refresh status after save
        checkSavedStatus();
      });
    });
  }
}

function sendMessageToContentScript(message, callback) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Processing...';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else {
          statusDiv.textContent = response && response.status ? response.status : 'Done';
          if (callback) callback();
        }
      });
    } else {
      statusDiv.textContent = 'No active tab found.';
    }
  });
}

function exportFinalReport() {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Generating report...';

  chrome.storage.local.get(null, (items) => {
    if (chrome.runtime.lastError) {
      statusDiv.textContent = 'Error reading storage.';
      return;
    }

    const reportData = JSON.stringify(items, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toastmasters_vpe_report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    statusDiv.textContent = 'Report downloaded.';
  });
}

function clearData() {
  chrome.storage.local.clear(() => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'All saved data cleared.';
    checkSavedStatus();
  });
}