import React, { useState, useMemo, useEffect } from 'react';
import DCPSection from './DCPSection';
import PathsSection from './PathsSection';
import SpeakersSection from './SpeakersSection';
import SpeakerCandidatesSection from './SpeakerCandidatesSection';
import NameMatcherSection from './NameMatcherSection';
import { mergeSpeakerData } from '../utils/dataProcessing';

const Dashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('dcp');
  const [nameMappings, setNameMappings] = useState({});

  // Load mappings from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tm_name_mappings');
      if (saved) {
        setNameMappings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load name mappings", e);
    }
  }, []);

  // Save mappings to local storage whenever they change
  const saveMapping = (normalizedKey, officialName) => {
    const newMappings = { ...nameMappings, [normalizedKey]: officialName };
    setNameMappings(newMappings);
    localStorage.setItem('tm_name_mappings', JSON.stringify(newMappings));
  };

  const deleteMapping = (normalizedKey) => {
    const newMappings = { ...nameMappings };
    delete newMappings[normalizedKey];
    setNameMappings(newMappings);
    localStorage.setItem('tm_name_mappings', JSON.stringify(newMappings));
  };

  const { mergedSpeakers, unmatchedNames } = useMemo(() => {
    // If we don't have speakers data yet, return empty defaults
    if (!data.speakersData) return { merged: [], unmatched: [] };

    const result = mergeSpeakerData(data.speakersData, data.agendaData, nameMappings);
    return { 
      mergedSpeakers: result.merged, 
      unmatchedNames: result.unmatched 
    };
  }, [data.speakersData, data.agendaData, nameMappings]);

  const enhancedSpeakersData = useMemo(() => {
    return { ...data.speakersData, speakers: mergedSpeakers };
  }, [data.speakersData, mergedSpeakers]);

  const tabs = [
    { id: 'dcp', label: 'DCP Points' },
    { id: 'paths', label: 'Paths in Progress' },
    { id: 'speakers', label: 'Speaker Dates' },
    { id: 'candidates', label: 'Speaker Candidates' }
  ];

  if (unmatchedNames && unmatchedNames.length > 0) {
    tabs.push({ 
      id: 'matching', 
      label: `Name Matching (${unmatchedNames.length})`,
      style: { color: '#ef4444', fontWeight: '600' } // Highlight this tab
    });
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        padding: '20px 30px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem' }}>Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
            Report generated on {new Date(data.dcpData?.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ 
        padding: '0 30px', 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '20px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 5px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #004165' : '2px solid transparent',
              color: activeTab === tab.id ? '#004165' : '#6b7280',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              ...(tab.style || {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'dcp' && <DCPSection data={data.dcpData} />}
          {activeTab === 'paths' && <PathsSection data={data.pathsData} />}
          {activeTab === 'speakers' && <SpeakersSection data={enhancedSpeakersData} />}
          {activeTab === 'candidates' && <SpeakerCandidatesSection speakersData={enhancedSpeakersData} pathsData={data.pathsData} />}
          {activeTab === 'matching' && (
            <NameMatcherSection 
              unmatchedNames={unmatchedNames}
              allOfficialSpeakers={data.speakersData?.speakers || []} 
              nameMappings={nameMappings}
              onSaveMapping={saveMapping}
              onDeleteMapping={deleteMapping}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;