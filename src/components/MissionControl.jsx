// MissionControl.jsx
// Tab 0 — System Status Overview
// Reads from dashboard.json via props (same pattern as all other panels)
// Does NOT write anything.

export default function MissionControl({ data }) {
  const now = new Date();
  const day   = String(now.getDate()).padStart(2, '0');
  const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][now.getMonth()];
  const year  = String(now.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Projects — status is "green" | "yellow" | "red"
  const totalProjects  = data?.projects?.length ?? 0;
  const activeProjects = data?.projects?.filter(p => p.status !== 'red').length ?? 0;
  const blockedProjects = data?.projects?.filter(p => p.status === 'red').length ?? 0;

  // Tasks — data.tasks.open is the array
  const openTasks = data?.tasks?.open?.length ?? 0;

  // Calendar
  const nextEvent = data?.calendar?.events?.find(e => new Date(e.start) >= now);
  const nextEventLabel = nextEvent
    ? `${new Date(nextEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} ${(nextEvent.title ?? '').toUpperCase().slice(0, 16)}`
    : 'NO EVENTS TODAY';

  // Briefs — data.briefs is { daily: {content}, weekly: {content} }
  const briefCount = [data?.briefs?.daily, data?.briefs?.weekly].filter(Boolean).length;
  const pendingBriefs = [data?.briefs?.daily, data?.briefs?.weekly].filter(b => b && !b.content).length;

  // Metrics
  const completedThisWeek = data?.metrics?.tasksCompletedThisWeek ?? 0;

  const panels = [
    {
      id: 'PRJCTS',
      label: 'PROJECTS',
      value: `${activeProjects} ACTIVE`,
      sub: blockedProjects > 0 ? `${blockedProjects} BLOCKED` : `${totalProjects} TOTAL`,
      indicator: blockedProjects > 0 ? 'red' : 'green',
    },
    {
      id: 'TASKS',
      label: 'TASK QUEUE',
      value: `${openTasks} OPEN`,
      sub: openTasks > 5 ? 'HIGH LOAD' : 'NOMINAL',
      indicator: openTasks > 5 ? 'amber' : 'green',
    },
    {
      id: 'CALENR',
      label: 'CALENDAR',
      value: nextEventLabel,
      sub: 'NEXT EVENT',
      indicator: nextEvent ? 'green' : 'dim',
    },
    {
      id: 'BRIEFS',
      label: 'BRIEFS',
      value: `${briefCount} QUEUED`,
      sub: pendingBriefs > 0 ? `${pendingBriefs} PENDING` : 'REVIEWED',
      indicator: pendingBriefs > 0 ? 'amber' : 'dim',
    },
    {
      id: 'METRCS',
      label: 'METRICS',
      value: `${completedThisWeek} THIS WK`,
      sub: 'TASKS DONE',
      indicator: 'green',
    },
    {
      id: 'HANGAR',
      label: 'HANGAR',
      value: 'ARMED',
      sub: 'F-15 READY',
      indicator: 'green',
    },
  ];

  // System status indicators
  const systems = [
    { label: 'VAULT', key: 'vaultGuard' },
    { label: 'BRIEF', key: 'morningBrief' },
    { label: 'SCHED', key: 'weeklyReview' },
  ];

  return (
    <div
      className="relative w-full h-full flex flex-col gap-0 overflow-hidden"
      style={{ fontFamily: 'JetBrains Mono, IBM Plex Mono, monospace' }}
    >
      {/* Header bar */}
      <div className="mfd-header flex items-center justify-between px-4 py-2" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
        <span className="phosphor-text">◈ IRONBRAIN HQ  //  MISSION CONTROL</span>
        <span style={{ color: '#00882a' }}>{dateStr}  {timeStr}Z</span>
      </div>

      {/* System ID strip */}
      <div
        className="px-4 py-1 flex gap-4 items-center flex-wrap"
        style={{ background: '#001a07', borderBottom: '1px solid #0d3318', fontSize: '0.55rem', letterSpacing: '0.12em', color: '#00882a' }}
      >
        <span>PILOT: MANCINI-A</span>
        <span>|</span>
        <span>ACFT: IRONBRAIN-1</span>
        <span>|</span>
        <span className="pulse" style={{ color: '#00ff41' }}>● SYSTEMS NOMINAL</span>
      </div>

      {/* Status grid — 2 columns, 3 rows */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-3 overflow-auto">
        {panels.map((p) => (
          <div key={p.id} className="mfd-panel flex flex-col p-0 overflow-hidden">
            {/* Corner notch via JSX (overflow-hidden safe) */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: 8, height: 8,
              borderTop: '2px solid rgba(0,255,65,0.5)',
              borderLeft: '2px solid rgba(0,255,65,0.5)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
            <div className="mfd-header" style={{ fontSize: '0.55rem' }}>
              <span>◆ {p.label}</span>
              <span className={`annunciator annunciator-${p.indicator}`} />
            </div>
            <div className="flex-1 flex flex-col justify-center px-3 py-2">
              <div className="phosphor-text" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1.2 }}>
                {p.value}
              </div>
              <div style={{ fontSize: '0.55rem', color: '#00882a', letterSpacing: '0.1em', marginTop: 2 }}>
                {p.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom annunciator strip */}
      <div
        className="px-4 py-1.5 flex gap-3 items-center flex-wrap"
        style={{ background: '#001a07', borderTop: '1px solid #0d3318', fontSize: '0.5rem', letterSpacing: '0.12em' }}
      >
        <span style={{ color: '#00882a' }}>SYS:</span>
        {systems.map(sys => {
          const entry = data?.systemStatus?.[sys.key];
          const ok = !entry || entry.status === 'ok';
          return (
            <span key={sys.label} className="flex items-center gap-1">
              <span className={`annunciator ${ok ? 'annunciator-green' : 'annunciator-amber'}`} style={{ width: 5, height: 5 }} />
              <span style={{ color: ok ? '#00882a' : '#ffaa00' }}>{sys.label}</span>
            </span>
          );
        })}
        {['GMAIL', 'GCAL'].map(sys => (
          <span key={sys} className="flex items-center gap-1">
            <span className="annunciator annunciator-green" style={{ width: 5, height: 5 }} />
            <span style={{ color: '#00882a' }}>{sys}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
