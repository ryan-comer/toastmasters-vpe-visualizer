import React, { useMemo } from 'react';
import { AlertCircle, Star } from 'lucide-react';

const SpeakerCandidatesSection = ({ speakersData, pathsData }) => {
  const candidates = useMemo(() => {
    if (!speakersData?.speakers || !pathsData?.paths) return [];

    const today = new Date();
    const THRESHOLD_DAYS = 28; // 4 weeks

    // Create a map of paths for quick lookup
    const pathsMap = new Map();
    pathsData.paths.forEach(p => {
      // Some members might have multiple paths, we'll store an array or just the most active one
      // For simplicity, let's store all paths for a user
      if (!pathsMap.has(p.name)) {
        pathsMap.set(p.name, []);
      }
      pathsMap.get(p.name).push(p);
    });

    return speakersData.speakers.map(speaker => {
      // 1. Check Last Speech Date
      let daysSinceSpeech = Infinity;
      let lastSpeechDate = null;
      
      const cleanDateStr = String(speaker.lastSpeech || '').replace(/\u00A0/g, ' ').trim();
      
      if (!cleanDateStr || cleanDateStr === 'Never' || cleanDateStr === '') {
        daysSinceSpeech = Infinity;
      } else {
        const date = new Date(cleanDateStr);
        if (!isNaN(date.getTime())) {
          lastSpeechDate = date;
          const diffTime = Math.abs(today - date);
          daysSinceSpeech = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      }

      // 2. Check Path Progress
      const userPaths = pathsMap.get(speaker.name) || [];
      let bestOpportunity = null;

      userPaths.forEach(path => {
        ['level1', 'level2', 'level3', 'level4', 'level5'].forEach((levelKey, idx) => {
          const status = path[levelKey];
          if (status && status !== 'Completed' && status !== 'N/A' && status !== '') {
            // Check for "X of Y"
            const match = status.match(/(\d+)\s*of\s*(\d+)/i);
            if (match) {
              const current = parseInt(match[1], 10);
              const total = parseInt(match[2], 10);
              const remaining = total - current;
              
              // Only consider it an opportunity if they are 0 or 1 away
              if (remaining <= 1) {
                const percentage = total > 0 ? (current / total) * 100 : 0;
                
                // If we found a level in progress, this is an opportunity
                // We prioritize higher completion percentages
                if (!bestOpportunity || percentage > bestOpportunity.percentage) {
                  bestOpportunity = {
                    pathName: path.pathName,
                    level: `Level ${idx + 1}`,
                    status: status,
                    percentage: percentage
                  };
                }
              }
            }
          }
        });
      });

      return {
        ...speaker,
        daysSinceSpeech,
        lastSpeechDate,
        opportunity: bestOpportunity
      };
    })
    .filter(item => {
      // Filter: Hasn't spoken in a while OR has an opportunity
      // The user said: "lists those people who are good speaker candidates. This list should pick people who haven't spoken in a while"
      // And "flag that row if they are close to completing a level"
      // So the primary filter is "Haven't spoken in a while"
      
      return item.daysSinceSpeech > THRESHOLD_DAYS;
    })
    .sort((a, b) => {
      // Sort by:
      // 1. Has Opportunity (High priority)
      // 2. Days since speech (Longest time first)
      
      const aHasOpp = !!a.opportunity;
      const bHasOpp = !!b.opportunity;

      if (aHasOpp && !bHasOpp) return -1;
      if (!aHasOpp && bHasOpp) return 1;

      // If both have opportunities, maybe sort by percentage?
      if (aHasOpp && bHasOpp) {
        if (b.opportunity.percentage !== a.opportunity.percentage) {
          return b.opportunity.percentage - a.opportunity.percentage;
        }
      }

      // Secondary sort: Days since speech (descending - longer is higher priority)
      // Infinity (never spoken) should be at top
      if (a.daysSinceSpeech === Infinity && b.daysSinceSpeech === Infinity) return 0;
      if (a.daysSinceSpeech === Infinity) return -1;
      if (b.daysSinceSpeech === Infinity) return 1;
      
      return b.daysSinceSpeech - a.daysSinceSpeech;
    });

  }, [speakersData, pathsData]);

  if (!candidates.length) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No candidates found matching criteria.</div>;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, color: '#111827' }}>Speaker Candidates</h3>
        <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
          Members who haven't spoken in 28+ days, highlighted if they are close to completing a level.
        </p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Name</th>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Last Speech</th>
            <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>Opportunity</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: candidate.opportunity ? '#f0fdf4' : 'white' }}>
              <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '500' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {candidate.name}
                  {candidate.opportunity && <Star size={16} color="#16a34a" fill="#16a34a" />}
                </div>
              </td>
              <td style={{ padding: '16px 20px', color: '#374151' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{candidate.lastSpeech || 'Never'}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {candidate.daysSinceSpeech === Infinity ? 'No record' : `${candidate.daysSinceSpeech} days ago`}
                  </span>
                </div>
              </td>
              <td style={{ padding: '16px 20px' }}>
                {candidate.opportunity ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#166534', fontSize: '0.9rem' }}>
                      {candidate.opportunity.pathName}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#15803d' }}>
                      {candidate.opportunity.level}: {candidate.opportunity.status}
                    </span>
                    <div style={{ width: '100px', height: '6px', backgroundColor: '#bbf7d0', borderRadius: '9999px', marginTop: '4px' }}>
                      <div style={{ 
                        width: `${candidate.opportunity.percentage}%`, 
                        height: '100%', 
                        backgroundColor: '#16a34a', 
                        borderRadius: '9999px' 
                      }} />
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No active level progress</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpeakerCandidatesSection;
