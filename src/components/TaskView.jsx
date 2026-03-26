// TaskView.jsx — ◆ TASKS // TASK QUEUE
// Cockpit redesign: avionics checklist, ◆/◇ markers, terse monospace rows

import { useState } from 'react'

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const OWNER_LABELS = {
  anthony: 'ANTH',
  jarvis:  'JRVS',
  ultron:  'ULTR',
}

const PRIORITY_STYLE = {
  high:   { color: '#ffaa00', label: '▲ HIGH' },
  medium: { color: '#00882a', label: '● MED'  },
  low:    { color: '#2a4a2f', label: '▼ LOW'  },
  critical: { color: '#ff2020', label: '⚠ CRIT' },
}

export default function TaskView({ tasks }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filters = [
    { id: 'all',     label: 'ALL'   },
    { id: 'anthony', label: 'ANTH'  },
    { id: 'jarvis',  label: 'JRVS'  },
  ]

  const sorted = [...(tasks.open || [])]
    .filter(t => filter === 'all' || t.owner === filter)
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99))

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)
  const openCount = sorted.length

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: mono }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ TASKS  //  TASK QUEUE</span>
        <div className="flex items-center gap-2">
          <span style={{
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            color: openCount > 5 ? '#ffaa00' : '#00882a',
            textShadow: openCount > 5 ? '0 0 4px rgba(255,170,0,0.5)' : 'none',
          }}>
            {openCount > 5 ? `⚠ ${openCount} OPEN` : `${openCount} OPEN`}
          </span>
          <span className={`annunciator ${openCount > 5 ? 'annunciator-amber' : 'annunciator-green'}`} />
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="flex gap-0 border-b"
        style={{ borderColor: '#0d3318', background: '#001a07' }}
      >
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '5px 14px',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: filter === f.id ? '#00ff41' : '#00882a',
              textShadow: filter === f.id ? '0 0 4px rgba(0,255,65,0.6)' : 'none',
              background: filter === f.id ? '#071a0c' : 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderBottom: filter === f.id ? '2px solid #00ff41' : '2px solid transparent',
              borderRight: '1px solid #0d3318',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Open tasks */}
      <div className="flex-1 overflow-auto">
        {sorted.length === 0 && (
          <div style={{ color: '#2a4a2f', fontSize: '0.6rem', letterSpacing: '0.15em', textAlign: 'center', padding: '24px 0' }}>
            NO TASKS FOR THIS FILTER
          </div>
        )}

        {sorted.map(task => {
          const ps = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.medium
          const isExpanded = expanded === task.id
          return (
            <button
              key={task.id}
              onClick={() => toggle(task.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: '1px solid #0d3318',
                background: isExpanded ? '#001a07' : 'transparent',
                cursor: 'pointer',
                outline: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: '1px solid #0d3318',
                display: 'block',
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: '#00882a', fontSize: '0.65rem', flexShrink: 0 }}>◇</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.7rem',
                    letterSpacing: '0.02em',
                    color: '#d4f0d4',
                    textTransform: 'uppercase',
                  }}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.1em' }}>
                    [{task.scope}]
                  </span>
                  <span style={{ fontSize: '0.5rem', color: '#00882a', letterSpacing: '0.1em' }}>
                    {OWNER_LABELS[task.owner] || task.owner?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', color: ps.color }}>
                  {ps.label}
                </span>
                <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.08em' }}>
                  {task.project?.toUpperCase()}
                </span>
              </div>

              {isExpanded && task.notes && (
                <div
                  style={{
                    marginTop: 6,
                    padding: '6px 8px',
                    background: '#001a07',
                    border: '1px solid #0d3318',
                    fontSize: '0.6rem',
                    color: '#00882a',
                    letterSpacing: '0.03em',
                    lineHeight: 1.5,
                  }}
                >
                  {task.notes}
                </div>
              )}
            </button>
          )
        })}

        {/* Recently completed section */}
        {(tasks.recentlyCompleted?.length ?? 0) > 0 && (
          <>
            <div
              style={{
                padding: '6px 12px',
                background: '#001a07',
                borderBottom: '1px solid #0d3318',
                fontSize: '0.5rem',
                letterSpacing: '0.18em',
                color: '#2a4a2f',
              }}
            >
              ─── RECENTLY COMPLETED ───
            </div>
            {tasks.recentlyCompleted.map(task => (
              <div
                key={task.id}
                style={{
                  padding: '6px 12px',
                  borderBottom: '1px solid #0d3318',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: '#00882a', fontSize: '0.65rem' }}>◆</span>
                <span style={{ flex: 1, fontSize: '0.6rem', color: '#2a4a2f', textDecoration: 'line-through', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {task.title}
                </span>
                <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.05em', flexShrink: 0 }}>
                  {task.completedDate}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
