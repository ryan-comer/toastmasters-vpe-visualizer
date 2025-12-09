chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received request:', request);

  switch (request.action) {
    case 'saveDCP':
      handleSaveDCP(sendResponse);
      break;
    case 'savePaths':
      handleSavePaths(sendResponse);
      break;
    case 'saveSpeakers':
      handleSaveSpeakers(sendResponse);
      break;
    default:
      sendResponse({ status: 'Unknown action' });
  }
  return true; // Indicates async response
});

function saveData(key, data, sendResponse) {
  chrome.storage.local.set({ [key]: data }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving data:', chrome.runtime.lastError);
      sendResponse({ status: 'Error saving data' });
    } else {
      console.log(`Data saved for ${key}`);
      sendResponse({ status: `Data saved for ${key}` });
    }
  });
}

function handleSaveDCP(sendResponse) {
  console.log('Scraping DCP Points...');
  
  // --- Scrape Summary Table ---
  const summaryData = {
    membership: {},
    goals: 0,
    status: []
  };

  const summaryTable = document.querySelector('table.csp-table');
  if (summaryTable) {
    // Membership Stats
    const memHeader = summaryTable.querySelector('th:nth-child(3) .sub-table-header');
    if (memHeader) {
        const items = memHeader.querySelectorAll('.sub-table-header-item');
        items.forEach(item => {
            const text = item.innerText.replace(/\n/g, ' ').trim(); // "Base 21"
            if (text.includes('Base')) summaryData.membership.base = text.replace('Base', '').trim();
            if (text.includes('To Date')) summaryData.membership.toDate = text.replace('To Date', '').trim();
            if (text.includes('Net Growth')) summaryData.membership.netGrowth = text.replace('Net Growth', '').trim();
        });
    }

    // Goals Count
    const goalsHeader = summaryTable.querySelector('th:nth-child(4) .para');
    if (goalsHeader) {
        summaryData.goals = goalsHeader.innerText.trim();
    }

    // Status Rows
    const statusRows = summaryTable.querySelectorAll('tbody tr');
    statusRows.forEach(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 4) {
            summaryData.status.push({
                level: cols[0].innerText.trim(),
                clubSuccessPlan: cols[1].innerText.trim(),
                membership: cols[2].innerText.trim(),
                goals: cols[3].innerText.trim()
            });
        }
    });
  }

  // --- Scrape Goals Table ---
  const goalsData = [];
  // Find the table that contains "Goals to Achieve"
  const allTables = Array.from(document.querySelectorAll('table'));
  const goalsTable = allTables.find(t => t.innerText.includes('Goals to Achieve'));

  if (goalsTable) {
      const rows = goalsTable.querySelectorAll('tr');
      let currentCategory = 'Education'; // Default
      let lastGoalNumber = '';
      let lastStatus = '';

      rows.forEach(row => {
          // Check for category header
          if (row.querySelector('.categorySeparator') && row.innerText.trim().length > 0) {
             const catText = row.innerText.trim();
             if (catText) currentCategory = catText;
             return; // Skip this row
          }

          if (row.classList.contains('Grid_Top_Row')) {
            let goalNumber = '';
            // Check if the first cell is the goal number (class blueNoBorder)
            if (row.cells[0] && row.cells[0].classList.contains('blueNoBorder')) {
                goalNumber = row.cells[0].innerText.trim();
                lastGoalNumber = goalNumber;
                
                const statusCell = row.querySelector('.statusImage');
                if (statusCell) {
                    if (statusCell.querySelector('img')) {
                        lastStatus = 'Achieved';
                    } else {
                        lastStatus = statusCell.innerText.trim();
                    }
                }
            } else {
                goalNumber = lastGoalNumber;
            }

            const descCell = row.querySelector('.goalDescription');
            const description = descCell ? descCell.innerText.trim() : '';

            const targetCell = row.querySelector('.clubReportGoalText');
            const target = targetCell ? targetCell.innerText.trim() : '';

            const actualCell = row.querySelector('.clubReportGoal, .clubReportGoalAchieved');
            const actual = actualCell ? actualCell.innerText.trim() : '';

            goalsData.push({
                category: currentCategory,
                goalNumber,
                description,
                target,
                actual,
                status: lastStatus
            });
          }
      });
  }

  const finalData = {
      summary: summaryData,
      goals: goalsData,
      timestamp: new Date().toISOString()
  };

  saveData('dcpData', finalData, sendResponse);
}

function handleSavePaths(sendResponse) {
  console.log('Scraping Paths in Progress...');
  
  const rows = document.querySelectorAll('.MuiDataGrid-row');
  const pathsData = [];

  rows.forEach(row => {
    const nameCell = row.querySelector('[data-field="name"]');
    const pathNameCell = row.querySelector('[data-field="pathName"]');
    const level1Cell = row.querySelector('[data-field="level"]');
    const level2Cell = row.querySelector('[data-field="level2"]');
    const level3Cell = row.querySelector('[data-field="level3"]');
    const level4Cell = row.querySelector('[data-field="level4"]');
    const level5Cell = row.querySelector('[data-field="level5"]');
    const pathCompletionCell = row.querySelector('[data-field="pathCompletion"]');

    const getStatus = (cell) => {
      if (!cell) return 'N/A';
      if (cell.querySelector('svg')) return 'Completed';
      return cell.textContent.trim();
    };

    if (nameCell && pathNameCell) {
      pathsData.push({
        name: nameCell.textContent.trim(),
        pathName: pathNameCell.textContent.trim(),
        level1: getStatus(level1Cell),
        level2: getStatus(level2Cell),
        level3: getStatus(level3Cell),
        level4: getStatus(level4Cell),
        level5: getStatus(level5Cell),
        pathCompletion: getStatus(pathCompletionCell)
      });
    }
  });

  if (pathsData.length > 0) {
    const data = {
      timestamp: new Date().toISOString(),
      paths: pathsData
    };
    saveData('pathsData', data, sendResponse);
  } else {
    console.warn('No paths data found. Check selectors.');
    sendResponse({ status: 'No data found (check page)' });
  }
}

function handleSaveSpeakers(sendResponse) {
  console.log('Scraping Speakers...');
  const rows = document.querySelectorAll('.MuiDataGrid-row');
  const data = [];

  rows.forEach(row => {
    const nameEl = row.querySelector('[data-field="user"] p');
    const name = nameEl ? nameEl.innerText.trim() : '';

    const credentialEl = row.querySelector('[data-field="currentCredential"]');
    const credential = credentialEl ? credentialEl.innerText.trim() : '';

    const achievementEl = row.querySelector('[data-field="highestAchievement"]');
    const achievement = achievementEl ? achievementEl.innerText.trim() : '';

    const lastSpeechEl = row.querySelector('[data-field="lastSpeech"]');
    const lastSpeech = lastSpeechEl ? lastSpeechEl.innerText.trim() : '';

    if (name) {
        data.push({
            name,
            credential,
            highestAchievement: achievement,
            lastSpeech
        });
    }
  });

  const finalData = {
      timestamp: new Date().toISOString(),
      speakers: data
  };

  saveData('speakersData', finalData, sendResponse);
}