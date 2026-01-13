export const normalizeName = (name) => {
  if (!name) return '';
  // Remove content in parenthesis e.g., "Ryan Comer (Ghoulish)" -> "Ryan Comer "
  // Remove semicolons e.g., "Ryan Comer; Sandy" (assuming single speaker per field usually, or just take first)
  let clean = name.split('(')[0].split(';')[0].trim();
  
  // Format: "Last, First" vs "First Last"
  if (clean.includes(',')) {
    const parts = clean.split(',');
    if (parts.length === 2) {
      return `${parts[1].trim().toLowerCase()} ${parts[0].trim().toLowerCase()}`;
    }
  }
  return clean.toLowerCase();
};

export const parseDate = (dateStr) => {
  if (!dateStr || dateStr === 'Never') return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export const mergeSpeakerData = (speakersData, agendaData, nameMappings = {}) => {
  if (!speakersData || !speakersData.speakers) return { merged: [], unmatched: [] };
  
  // Deep copy to avoid mutating original
  const speakers = JSON.parse(JSON.stringify(speakersData.speakers));
  
  if (!agendaData || !Array.isArray(agendaData)) return { merged: speakers, unmatched: [] };

  const agendaMap = new Map(); // NormalizedName -> { dates: Date[], originalName: string }

  agendaData.forEach(row => {
    const rawDate = row['Date'];
    if (!rawDate) return;
    
    // Convert agenda date (MM/DD/YYYY) to Date object
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return;

    // Check Speaker 1, 2, 3
    ['Speaker 1', 'Speaker 2', 'Speaker 3'].forEach(key => {
      const name = row[key];
      if (name && name !== 'N/A') {
        const normalized = normalizeName(name);
        
        // Check if there is a mapping (keys in mapping are normalized)
        const targetName = nameMappings[normalized] ? normalizeName(nameMappings[normalized]) : normalized;

        if (targetName) {
            if (!agendaMap.has(targetName)) {
                agendaMap.set(targetName, { dates: [], originalName: name });
            }
            agendaMap.get(targetName).dates.push(date);
        }
      }
    });
  });

  const matchedAgendaNames = new Set();
  const today = new Date();
  today.setHours(0,0,0,0);

  // Update speakers
  speakers.forEach(speaker => {
    const normalized = normalizeName(speaker.name);
    const agendaEntry = agendaMap.get(normalized);
    
    if (agendaEntry) {
      matchedAgendaNames.add(normalized);
      
      // Sort dates
      const sortedDates = agendaEntry.dates.sort((a, b) => b - a);
      const latestPast = sortedDates.find(d => d <= today);
      // For future dates, we want the closest one (smallest greater than today)
      const nextFuture = sortedDates.filter(d => d > today).sort((a, b) => a - b)[0];

      const currentLastSpeech = parseDate(speaker.lastSpeech);
      
      // Update Last Speech (only if we have a newer past date)
      if (latestPast) {
        if (!currentLastSpeech || latestPast > currentLastSpeech) {
            speaker.lastSpeech = latestPast.toLocaleDateString(); 
            speaker.source = 'Agenda'; 
        }
      }

      // Set Next Speech
      if (nextFuture) {
          speaker.nextSpeech = nextFuture.toLocaleDateString();
          speaker.nextSpeechSource = 'Agenda';
      }
    }
  });

  // Identify unmatched agenda items
  const unmatched = [];
  agendaMap.forEach((value, key) => {
    if (!matchedAgendaNames.has(key)) {
      // Use latest date for display
      const latestDate = value.dates.sort((a,b) => b-a)[0];
      unmatched.push({
        normalized: key,
        originalName: value.originalName,
        date: latestDate
      });
    }
  });

  return { merged: speakers, unmatched };
};
