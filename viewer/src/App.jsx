import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  const [reports, setReports] = useState([]);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('reportsHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReports(parsed);
        if (parsed.length > 0) {
          setSelectedReportIndex(parsed.length - 1);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reportsHistory', JSON.stringify(reports));
  }, [reports]);

  const handleLoadReport = async () => {
    try {
      const result = await window.electronAPI.selectFile();
      if (result) {
        const newReports = [...reports, result];
        setReports(newReports);
        setSelectedReportIndex(newReports.length - 1);
      }
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };

  const handleDeleteReport = (index) => {
    const newReports = reports.filter((_, i) => i !== index);
    setReports(newReports);
    if (selectedReportIndex === index) {
      setSelectedReportIndex(newReports.length > 0 ? newReports.length - 1 : null);
    } else if (selectedReportIndex > index) {
      setSelectedReportIndex(selectedReportIndex - 1);
    }
  };

  const currentReport = selectedReportIndex !== null ? reports[selectedReportIndex] : null;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        reports={reports} 
        selectedIndex={selectedReportIndex}
        onSelect={setSelectedReportIndex}
        onDelete={handleDeleteReport}
        onLoadNew={handleLoadReport}
      />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {currentReport ? (
          <Dashboard data={currentReport.content} />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            color: '#6b7280' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2>No Report Selected</h2>
              <p>Select a report from the sidebar or load a new one.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;