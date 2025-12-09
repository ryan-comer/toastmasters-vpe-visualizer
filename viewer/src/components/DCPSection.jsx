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
              const goalsReq = parseInt(level.goals, 10) || 0;
              const currentGoals = parseInt(goalsAchieved, 10) || 0;
              const isGoalsMet = currentGoals >= goalsReq;
              const progress = goalsReq > 0 ? Math.min(100, (currentGoals / goalsReq) * 100) : 0;
              
              return (
                <div key={idx} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderTop: `4px solid ${isGoalsMet ? '#047857' : '#9ca3af'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 15px 0', color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{level.level}</h4>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <span style={{ color: '#6b7280' }}>Goals Progress</span>
                        <span style={{ fontWeight: '600', color: isGoalsMet ? '#047857' : '#111827' }}>
                          {currentGoals} / {goalsReq}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          backgroundColor: isGoalsMet ? '#047857' : '#004165', 
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease-in-out'
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membership Requirement</span>
                    <span style={{ color: '#374151', fontWeight: '500', lineHeight: '1.4' }}>{level.membership}</span>
                  </div>
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