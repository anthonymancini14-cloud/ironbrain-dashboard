// BriefViewer.jsx — ◆ BRIEFS // EXECUTION QUEUE
// Cockpit redesign: mission tasking list, pending briefs = missions to run

import { useState } from 'react'

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

function formatMilDate(dateStr) {
  if (!dateStr) return 'UNKNOWN'
  const d = new Date(dateStr + 'T12:00:00')
  const day   = String(d.getDate()).padStart(2, '0')
  const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]
  const year  = String(d.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

function BriefPane({ label, title, dateStr, content }) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Brief title row */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #0d3318', background: '#001a07' }}>
        <div style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.15em', marginBottom: 3 }}>
          {label}  //  {dateStr}
        </div>
        <div
          className="phosphor-text"
          style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          {(title ?? '').slice(0, 30)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ padding: '12px' }}>
        {content ? (
          <pre style={{
            color: '#00882a',
            fontSize: '0.6rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            fontFamily: mono,
            letterSpacing: '0.02em',
          }}>
            {content}
          </pre>
        ) : (
          <div style={{ paddingTop: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#2a4a2f', letterSpacing: '0.2em' }}>
              BRIEF NOT YET SYNCED
            </div>
            <div style={{ fontSize: '0.5rem', color: '#1a3a1f', letterSpacing: '0.12em', marginTop: 6 }}>
              ● JARVIS SYNC PENDING
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BriefViewer({ briefs }) {
  const [activePane, setActivePane] = useState('daily')

  const panes = [
    { id: 'daily',  label: 'DAILY'  },
    { id: 'weekly', label: 'WEEKLY' },
  ]

  const pendingCount = [briefs.daily, briefs.weekly].filter(b => b && !b.content).length

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: mono }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ BRIEFS  //  EXECUTION QUEUE</span>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="amber-text" style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>
              [{pendingCount} PENDING]
            </span>
          )}
          <span className={`annunciator ${pendingCount > 0 ? 'annunciator-amber pulse' : 'annunciator-dim'}`} />
        </div>
      </div>

      {/* Sub-tab selector */}
      <div
        className="flex"
        style={{ background: '#001a07', borderBottom: '1px solid #0d3318' }}
      >
        {panes.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePane(p.id)}
            style={{
              padding: '5px 16px',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: activePane === p.id ? '#00ff41' : '#00882a',
              textShadow: activePane === p.id ? '0 0 4px rgba(0,255,65,0.6)' : 'none',
              background: activePane === p.id ? '#071a0c' : 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderBottom: activePane === p.id ? '2px solid #00ff41' : '2px solid transparent',
              borderRight: '1px solid #0d3318',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Brief content */}
      <div className="flex-1 overflow-hidden">
        {activePane === 'daily' && (
          <BriefPane
            label="DAILY BRIEF"
            title={briefs.daily?.title ?? 'DAILY BRIEF'}
            dateStr={formatMilDate(briefs.daily?.date)}
            content={briefs.daily?.content}
          />
        )}
        {activePane === 'weekly' && (
          <BriefPane
            label="WEEKLY REVIEW"
            title={briefs.weekly?.title ?? 'WEEKLY REVIEW'}
            dateStr={`WK OF ${formatMilDate(briefs.weekly?.weekOf)}`}
            content={briefs.weekly?.content}
          />
        )}
      </div>
    </div>
  )
}
