// MetricsPanel.jsx — ◆ METRCS // SYSTEMS STATUS
// Cockpit redesign: aircraft systems page, phosphor bars, recharts restyled

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

const KPI_CONFIG = [
  { key: 'tasksCompletedThisWeek',  label: 'TASKS / WEEK',        max: 10  },
  { key: 'tasksCompletedThisMonth', label: 'TASKS / MONTH',       max: 30  },
  { key: 'executionBriefsFiled',    label: 'EBs FILED',           max: 20  },
  { key: 'sessionsThisMonth',       label: 'SESSIONS / MONTH',    max: 20  },
]

function PhosphorBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100))
  return (
    <div className="phosphor-bar-track">
      <div
        className="phosphor-bar-fill"
        style={{
          width: `${pct}%`,
          background: pct < 30
            ? '#ff2020'
            : pct < 70
              ? 'linear-gradient(90deg, #00882a, #ffaa00)'
              : undefined,
        }}
      />
    </div>
  )
}

const CockpitTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#050f09',
      border: '1px solid #0d3318',
      padding: '6px 10px',
      fontFamily: mono,
      fontSize: '0.6rem',
    }}>
      <p style={{ color: '#00882a', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? '#00ff41', letterSpacing: '0.05em' }}>
          {(p.name ?? '').toUpperCase()}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function MetricsPanel({ metrics }) {
  const { weeklyHistory, executionBriefsFiled, executionBriefsCompleted } = metrics

  return (
    <div className="h-full flex flex-col overflow-auto" style={{ fontFamily: mono }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ METRCS  //  SYSTEMS STATUS</span>
        <span className="annunciator annunciator-green" />
      </div>

      <div className="flex flex-col gap-0">
        {/* KPI rows */}
        {KPI_CONFIG.map(({ key, label, max }) => (
          <div key={key} style={{ padding: '8px 12px', borderBottom: '1px solid #0d3318' }}>
            <div className="flex items-baseline justify-between mb-1">
              <span style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.15em' }}>
                {label}
              </span>
              <span className="phosphor-text" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {metrics[key] ?? 0}
              </span>
            </div>
            <PhosphorBar value={metrics[key] ?? 0} max={max} />
          </div>
        ))}

        {/* EB Filed vs Complete */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #0d3318' }}>
          <div style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.15em', marginBottom: 6 }}>
            EXECUTION BRIEFS
          </div>
          <div className="flex items-baseline gap-2">
            <span className="phosphor-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {executionBriefsFiled}
            </span>
            <span style={{ fontSize: '0.5rem', color: '#00882a', letterSpacing: '0.1em' }}>FILED</span>
            <span style={{ fontSize: '0.6rem', color: '#0d3318', margin: '0 4px' }}>/</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00cc34', textShadow: '0 0 4px rgba(0,204,52,0.5)' }}>
              {executionBriefsCompleted}
            </span>
            <span style={{ fontSize: '0.5rem', color: '#00882a', letterSpacing: '0.1em' }}>COMPLETE</span>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #0d3318' }}>
          <div style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.15em', marginBottom: 8 }}>
            WEEKLY OUTPUT
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyHistory} barSize={20} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#00882a', fontSize: 9, fontFamily: mono }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#00882a', fontSize: 9, fontFamily: mono }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CockpitTooltip />} cursor={{ fill: 'rgba(0,255,65,0.04)' }} />
              <Bar dataKey="completed" name="Completed" radius={[2, 2, 0, 0]}>
                {weeklyHistory.map((_, i) => (
                  <Cell key={i} fill="#00882a" fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completed vs rework chart */}
        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.15em', marginBottom: 4 }}>
            COMPLETED VS REWORK
          </div>
          <div style={{ fontSize: '0.5rem', color: '#1a3a1f', letterSpacing: '0.1em', marginBottom: 8 }}>
            REWORK BAR = FLAG
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyHistory} barSize={20} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#00882a', fontSize: 9, fontFamily: mono }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#00882a', fontSize: 9, fontFamily: mono }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CockpitTooltip />} cursor={{ fill: 'rgba(0,255,65,0.04)' }} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#00882a" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
              <Bar dataKey="rework"    name="Rework"    stackId="a" fill="#ffaa00" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
