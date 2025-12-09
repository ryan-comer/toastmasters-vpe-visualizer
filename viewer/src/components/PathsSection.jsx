import React from 'react';
import { Check } from 'lucide-react';

const PathsSection = ({ data }) => {
  if (!data || !data.paths) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No Paths Data Available</div>;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, color: '#111827' }}>Paths Progress</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Member</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Path</th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>L1</th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>L2</th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>L3</th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>L4</th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>L5</th>
            </tr>
          </thead>
          <tbody>
            {data.paths.map((path, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>{path.name}</td>
                <td style={{ padding: '16px 20px', color: '#374151' }}>{path.pathName}</td>
                {['level1', 'level2', 'level3', 'level4', 'level5'].map(level => {
                  const status = path[level];
                  let content;

                  if (status === 'Completed') {
                    content = (
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: '#def7ec', 
                        color: '#03543f',
                        margin: '0 auto'
                      }}>
                        <Check size={16} />
                      </div>
                    );
                  } else if (status && status !== 'N/A' && status !== '') {
                    // Check for "X of Y" pattern
                    const match = status.match(/(\d+)\s*of\s*(\d+)/i);
                    if (match) {
                      const current = parseInt(match[1], 10);
                      const total = parseInt(match[2], 10);
                      const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
                      
                      content = (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ 
                            width: '60px', 
                            height: '6px', 
                            backgroundColor: '#e5e7eb', 
                            borderRadius: '9999px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              backgroundColor: '#004165', // Toastmasters Blue
                              borderRadius: '9999px' 
                            }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '500' }}>
                            {status}
                          </span>
                        </div>
                      );
                    } else {
                      content = (
                        <span style={{ 
                          color: '#374151', 
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {status}
                        </span>
                      );
                    }
                  } else {
                    content = <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>-</span>;
                  }

                  return (
                    <td key={level} style={{ padding: '16px 20px', textAlign: 'center', verticalAlign: 'middle' }}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PathsSection;