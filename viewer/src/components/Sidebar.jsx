import React from 'react';
import { FileText, Trash2, PlusCircle, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ reports, selectedIndex, onSelect, onDelete, onLoadNew }) => {
  return (
    <div style={{
      width: '280px',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #374151'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          margin: 0
        }}>
          <LayoutDashboard size={24} color="#f2df74" />
          VPE Viewer
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        <button
          onClick={onLoadNew}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#004165',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005a8c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#004165'}
        >
          <PlusCircle size={18} />
          Load Report
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        <h3 style={{ 
          padding: '0 10px', 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          color: '#9ca3af',
          letterSpacing: '0.05em'
        }}>
          History
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {reports.map((report, index) => {
            const date = new Date(report.content.dcpData?.timestamp || Date.now()).toLocaleDateString();
            const isSelected = index === selectedIndex;
            
            return (
              <li 
                key={index}
                onClick={() => onSelect(index)}
                style={{
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#374151' : 'transparent',
                  color: isSelected ? 'white' : '#d1d5db',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#2d3748';
                }}
                onMouseOut={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color={isSelected ? '#f2df74' : '#9ca3af'} />
                  <span style={{ fontSize: '0.9rem' }}>{date}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    opacity: isSelected ? 1 : 0.5
                  }}
                  title="Delete Report"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div style={{ padding: '15px', borderTop: '1px solid #374151', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;