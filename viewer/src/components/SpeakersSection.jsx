import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const SpeakersSection = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'lastSpeech', direction: 'descending' });

  if (!data || !data.speakers) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No Speaker Data Available</div>;

  const sortedSpeakers = useMemo(() => {
    let sortableItems = [...data.speakers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'lastSpeech') {
            // Treat 'Never' or empty as null for sorting purposes
            const isANull = !aValue || aValue === 'Never';
            const isBNull = !bValue || bValue === 'Never';

            if (isANull && isBNull) return 0;
            if (isANull) return 1; // Always put nulls at the bottom
            if (isBNull) return -1;

            // Clean string (remove non-breaking spaces) and parse
            const cleanA = String(aValue).replace(/\u00A0/g, ' ').trim();
            const cleanB = String(bValue).replace(/\u00A0/g, ' ').trim();

            const timeA = new Date(cleanA).getTime();
            const timeB = new Date(cleanB).getTime();
            
            // Handle invalid dates (treat as null/bottom)
            if (isNaN(timeA) && isNaN(timeB)) return 0;
            if (isNaN(timeA)) return 1;
            if (isNaN(timeB)) return -1;

            return sortConfig.direction === 'ascending' ? timeA - timeB : timeB - timeA;
        }

        // Default string sort
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data.speakers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
      if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} color="#9ca3af" style={{ marginLeft: '6px' }} />;
      if (sortConfig.direction === 'ascending') return <ArrowUp size={14} color="#004165" style={{ marginLeft: '6px' }} />;
      return <ArrowDown size={14} color="#004165" style={{ marginLeft: '6px' }} />;
  };

  const HeaderCell = ({ label, columnKey }) => (
    <th 
      onClick={() => requestSort(columnKey)}
      style={{ 
        padding: '12px 20px', 
        textAlign: 'left', 
        fontSize: '0.85rem', 
        color: sortConfig.key === columnKey ? '#004165' : '#6b7280', 
        fontWeight: '600',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {label}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, color: '#111827' }}>Member Speech History</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f9fafb' }}>
          <tr>
            <HeaderCell label="Name" columnKey="name" />
            <HeaderCell label="Credential" columnKey="credential" />
            <HeaderCell label="Highest Achievement" columnKey="highestAchievement" />
            <HeaderCell label="Last Speech Date" columnKey="lastSpeech" />
          </tr>
        </thead>
        <tbody>
          {sortedSpeakers.map((speaker, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>{speaker.name}</td>
              <td style={{ padding: '16px 20px', color: '#374151' }}>{speaker.credential || '-'}</td>
              <td style={{ padding: '16px 20px', color: '#374151' }}>{speaker.highestAchievement || '-'}</td>
              <td style={{ padding: '16px 20px', color: '#374151' }}>{speaker.lastSpeech || 'Never'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpeakersSection;