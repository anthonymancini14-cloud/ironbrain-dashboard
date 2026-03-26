// CalendarStrip.jsx — ◆ CALENR // FLIGHT PLAN
// Cockpit redesign: mission timeline, military date format, 24hr time, amber/phosphor rows

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

function formatMilDate(dateStr) {
  if (!dateStr) return 'UNKNOWN'
  const d = new Date(dateStr + 'T12:00:00')
  const day   = String(d.getDate()).padStart(2, '0')
  const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]
  const year  = String(d.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

function formatMilTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function CalendarStrip({ calendar }) {
  const events = calendar.events || []
  const timed  = events.filter(e => !e.allDay).sort((a, b) => new Date(a.start) - new Date(b.start))
  const allDay = events.filter(e => e.allDay)

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: mono }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ CALENR  //  FLIGHT PLAN</span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.5rem', color: '#00882a', letterSpacing: '0.1em' }}>
            {formatMilDate(calendar.date)}
          </span>
          <span className={`annunciator ${events.length > 0 ? 'annunciator-green' : 'annunciator-dim'}`} />
        </div>
      </div>

      {/* Date strip */}
      <div
        style={{
          background: '#001a07',
          borderBottom: '1px solid #0d3318',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span className="phosphor-text" style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          {formatMilDate(calendar.date)}
        </span>
        <span style={{ fontSize: '0.55rem', color: '#00882a', letterSpacing: '0.12em' }}>
          ─── TODAY ───
        </span>
        <span style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.1em', marginLeft: 'auto' }}>
          {events.length === 0 ? 'NO EVENTS' : `${events.length} EVENT${events.length !== 1 ? 'S' : ''}`}
        </span>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-auto">
        {events.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#2a4a2f', letterSpacing: '0.2em' }}>
              NO EVENTS LOGGED
            </div>
            <div style={{ fontSize: '0.5rem', color: '#1a3a1f', letterSpacing: '0.12em', marginTop: 6 }}>
              SYNCS EVERY 2 HRS VIA JARVIS
            </div>
          </div>
        ) : (
          <>
            {/* All-day events */}
            {allDay.map((event, i) => (
              <div
                key={`allday-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  padding: '8px 12px',
                  borderBottom: '1px solid #0d3318',
                }}
              >
                <span style={{ fontSize: '0.65rem', color: '#664400', letterSpacing: '0.05em', flexShrink: 0, width: 40 }}>
                  ALLDAY
                </span>
                <span className="phosphor-text" style={{ fontSize: '0.7rem', letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1 }}>
                  {event.title}
                </span>
                {event.calendar && (
                  <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.08em', flexShrink: 0 }}>
                    {event.calendar.toUpperCase().slice(0, 12)}
                  </span>
                )}
              </div>
            ))}

            {/* Timed events */}
            {timed.map((event, i) => (
              <div
                key={`timed-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  padding: '8px 12px',
                  borderBottom: '1px solid #0d3318',
                }}
              >
                <span className="amber-text" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0, width: 40 }}>
                  {formatMilTime(event.start)}
                </span>
                <span className="phosphor-text" style={{ fontSize: '0.7rem', letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1 }}>
                  {event.title}
                </span>
                {event.end && (
                  <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.05em', flexShrink: 0 }}>
                    →{formatMilTime(event.end)}
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '5px 12px', background: '#001a07', borderTop: '1px solid #0d3318', fontSize: '0.5rem', color: '#1a3a1f', letterSpacing: '0.1em' }}>
        GCAL SYNC PENDING — PHASE 2 LIVE CALENDAR
      </div>
    </div>
  )
}
