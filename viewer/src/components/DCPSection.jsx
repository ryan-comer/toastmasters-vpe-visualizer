import React from 'react';
import { CheckCircle, AlertCircle, Users, Target } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }}>
    <div style={{ 
      backgroundColor: `${color}20`, 
      padding: '12px', 
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={24} color={color} />
    </div>
    <div>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
      <p style={{ margin: '5px 0 0 0', color: '#111827', fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
    </div>
  </div>
);

const DCPSection = ({ data }) => {
  if (!data) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No DCP Data Available</div>;

  const goalsAchieved = data.summary?.goals || 0;
  const membershipBase = data.summary?.membership?.base || 'N/A';
  const membershipToDate = data.summary?.membership?.toDate || 'N/A';

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Goals Achieved" value={goalsAchieved} icon={Target} color="#004165" />
        <StatCard title="Membership Base" value={membershipBase} icon={Users} color="#772432" />
        <StatCard title="Members To Date" value={membershipToDate} icon={Users} color="#f2df74" />
      </div>

      {/* Club Status Progress */}
      {data.summary?.status && data.summary.status.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#111827', fontSize: '1.1rem' }}>Club Status Requirements</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {data.summary.status.map((level, idx) => {
              const isGoalsMet = level.goals.toLowerCase().includes('met');
              const isMembershipMet = level.membership.toLowerCase().includes('met');
              const isPlanMet = level.clubSuccessPlan ? level.clubSuccessPlan.toLowerCase().includes('met') : true; 
              
              const isFullyMet = isGoalsMet && isMembershipMet && isPlanMet;

              const StatusRow = ({ label, value }) => {
                 if (!value) return null;
                 const isMet = value.toString().toLowerCase().includes('met');
                 const color = isMet ? '#047857' : '#b45309';
                 return (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '12px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                            {isMet ? <CheckCircle size={16} color={color} /> : <AlertCircle size={16} color={color} />}
                        </div>
                        <div>
                            <span style={{ display: 'block', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                            <span style={{ color: color, fontWeight: '500', fontSize: '0.9rem' }}>{value}</span>
                        </div>
                    </div>
                 );
              };

              return (
                <div key={idx} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderTop: `4px solid ${isFullyMet ? '#047857' : '#e5e7eb'}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '1.1rem', fontWeight: '700' }}>{level.level}</h4>
                  <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '10px 0' }} />
                  
                  <StatusRow label="Goals Requirement" value={level.goals} />
                  <StatusRow label="Membership Requirement" value={level.membership} />
                  <StatusRow label="Club Success Plan" value={level.clubSuccessPlan} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Goals Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#111827' }}>DCP Goals Detail</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>#</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Description</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Target</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Actual</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.goals?.reduce((acc, goal) => {
              const category = goal.category || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(goal);
              return acc;
            }, {}) || {}).map(([category, goals]) => (
              <React.Fragment key={category}>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <td colSpan="5" style={{ padding: '10px 20px', fontWeight: '700', color: '#1f2937', fontSize: '0.9rem', borderBottom: '1px solid #e5e7eb' }}>
                    {category}
                  </td>
                </tr>
                {goals.map((goal, idx) => (
                  <tr key={`${category}-${idx}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 20px', color: '#374151' }}>{goal.goalNumber}</td>
                    <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>{goal.description}</td>
                    <td style={{ padding: '16px 20px', color: '#6b7280' }}>{goal.target}</td>
                    <td style={{ padding: '16px 20px', color: '#6b7280' }}>{goal.actual}</td>
                    <td style={{ padding: '16px 20px' }}>
                      {goal.status === 'Achieved' ? (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 10px', 
                          borderRadius: '9999px', 
                          backgroundColor: '#def7ec', 
                          color: '#03543f', 
                          fontSize: '0.85rem', 
                          fontWeight: '500' 
                        }}>
                          <CheckCircle size={14} /> Achieved
                        </span>
                      ) : (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '4px 10px', 
                          borderRadius: '9999px', 
                          backgroundColor: '#fef3c7', 
                          color: '#92400e', 
                          fontSize: '0.85rem', 
                          fontWeight: '500' 
                        }}>
                          <AlertCircle size={14} /> {goal.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DCPSection;