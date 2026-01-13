import React, { useState } from 'react';
import { Link, ArrowRight, Trash2 } from 'lucide-react';

const NameMatcherSection = ({ unmatchedNames, allOfficialSpeakers, nameMappings, onSaveMapping, onDeleteMapping }) => {
  // Local state to hold temporary selections before saving
  const [selections, setSelections] = useState({});
  const [activeTab, setActiveTab] = useState('unmatched');

  const handleSelectChange = (normalizedUnmatched, selectedOfficialName) => {
    setSelections(prev => ({
      ...prev,
      [normalizedUnmatched]: selectedOfficialName
    }));
  };

  const handleSave = (normalizedUnmatched) => {
    const target = selections[normalizedUnmatched];
    if (target) {
      onSaveMapping(normalizedUnmatched, target);
      // Clear selection after save
      const newSelections = { ...selections };
      delete newSelections[normalizedUnmatched];
      setSelections(newSelections);
    }
  };

  // Sort official speakers alphabetically for dropdown
  const sortedSpeakers = [...allOfficialSpeakers].sort((a, b) => a.name.localeCompare(b.name));

  const hasUnmatched = unmatchedNames && unmatchedNames.length > 0;
  const hasMappings = nameMappings && Object.keys(nameMappings).length > 0;

  // Render nothing if no data at all
  if (!hasUnmatched && !hasMappings) {
     return <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>All names matched automatically. No manual intervention needed.</div>;
  }

  // Ensure we show the correct tab if one is empty
  const currentTab = (!hasUnmatched && hasMappings && activeTab === 'unmatched') ? 'saved' : activeTab;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      
      {/* Header with Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px 20px 10px 20px' }}>
          <h3 style={{ margin: 0, color: '#111827' }}>Name Matching</h3>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
             reconciles names between the Agenda CSV and Official Member List.
          </p>
        </div>
        
        <div style={{ display: 'flex', padding: '0 20px', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('unmatched')}
            style={{
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: currentTab === 'unmatched' ? '2px solid #ef4444' : '2px solid transparent',
              color: currentTab === 'unmatched' ? '#ef4444' : '#6b7280',
              fontWeight: currentTab === 'unmatched' ? '600' : '400',
              cursor: 'pointer',
              opacity: hasUnmatched ? 1 : 0.5,
              pointerEvents: hasUnmatched ? 'auto' : 'none'
            }}
          >
            Unmatched Names ({unmatchedNames?.length || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: currentTab === 'saved' ? '2px solid #004165' : '2px solid transparent',
              color: currentTab === 'saved' ? '#004165' : '#6b7280',
              fontWeight: currentTab === 'saved' ? '600' : '400',
              cursor: 'pointer',
              opacity: hasMappings ? 1 : 0.5,
              pointerEvents: hasMappings ? 'auto' : 'none'
            }}
          >
            Saved Matches ({Object.keys(nameMappings || {}).length})
          </button>
        </div>
      </div>

      {/* Unmatched Table */}
      {currentTab === 'unmatched' && hasUnmatched && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Agenda Name</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Last Seen</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }} width="40%">Match To Member</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {unmatchedNames.map((item) => (
              <tr key={item.normalized} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>
                  {item.originalName}
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {item.normalized}</div>
                </td>
                <td style={{ padding: '16px 20px', color: '#374151' }}>
                  {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown'}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #d1d5db',
                      color: '#374151'
                    }}
                    value={selections[item.normalized] || ''}
                    onChange={(e) => handleSelectChange(item.normalized, e.target.value)}
                  >
                    <option value="">Select a member...</option>
                    {sortedSpeakers.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <button
                    onClick={() => handleSave(item.normalized)}
                    disabled={!selections[item.normalized]}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: selections[item.normalized] ? '#004165' : '#e5e7eb',
                      color: selections[item.normalized] ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: selections[item.normalized] ? 'pointer' : 'not-allowed',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Link size={14} /> Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Saved Matches Table */}
      {currentTab === 'saved' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Normalized ID</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Applies To</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Matched Member</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(nameMappings).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px', color: '#111827', fontFamily: 'monospace', fontSize: '0.9em' }}>
                  {key}
                </td>
                <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '0.9em' }}>
                  <i>Any input normalizing to '{key}'</i>
                </td>
                <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>
                  {value}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <button
                    onClick={() => onDeleteMapping(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {Object.keys(nameMappings).length === 0 && (
                <tr>
                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                        No saved matches found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NameMatcherSection;
