import { useState } from 'react'
import data from './data/dashboard.json'
import MissionControl from './components/MissionControl'
import ProjectStatus  from './components/ProjectStatus'
import TaskView       from './components/TaskView'
import CalendarStrip  from './components/CalendarStrip'
import MetricsPanel   from './components/MetricsPanel'
import BriefViewer    from './components/BriefViewer'
import HangarPanel    from './components/HangarPanel'
// ContactsPanel and MindMapPanel kept as files — removed from active tabs

// ─── PIN Gate ────────────────────────────────────────────────────────────────

const STORED_PIN_KEY = 'ironbrain_pin_verified'

function PinGate({ children }) {
  const [verified, setVerified] = useState(
    localStorage.getItem(STORED_PIN_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const correctPin = import.meta.env.VITE_DASHBOARD_PIN

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === correctPin) {
      localStorage.setItem(STORED_PIN_KEY, 'true')
      setVerified(true)
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  if (verified) return children

  return (
    <div
      className="cockpit-root min-h-screen flex items-center justify-center px-4"
      style={{ background: '#030d07', fontFamily: 'JetBrains Mono, monospace' }}
    >
      <div
        className="mfd-panel p-8 w-full max-w-xs"
        style={{ border: '1px solid #0d3318' }}
      >
        {/* Corner notch */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: 8, height: 8,
          borderTop: '2px solid rgba(0,255,65,0.5)',
          borderLeft: '2px solid rgba(0,255,65,0.5)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div
            style={{
              width: 48, height: 48,
              border: '1px solid #0d3318',
              background: '#001a07',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <span className="phosphor-text" style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.2em' }}>IB</span>
          </div>
        </div>

        <div className="mfd-header mb-6 justify-center" style={{ background: 'transparent', borderBottom: '1px solid #0d3318', paddingBottom: 8 }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>◈ IRONBRAIN HQ // AUTH REQUIRED</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              width: '100%',
              background: '#001a07',
              border: `1px solid ${error ? '#ff2020' : '#0d3318'}`,
              color: '#00ff41',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.5rem',
              letterSpacing: '0.4em',
              textAlign: 'center',
              padding: '12px',
              outline: 'none',
              borderRadius: 2,
              marginBottom: 8,
              textShadow: '0 0 8px rgba(0,255,65,0.6)',
            }}
            placeholder="••••"
            autoFocus
          />
          {error && (
            <p className="alert-text" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textAlign: 'center', marginBottom: 8 }}>
              ⚠ AUTH FAILED — RETRY
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#071a0c',
              border: '1px solid #00ff41',
              color: '#00ff41',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              padding: '10px',
              cursor: 'pointer',
              borderRadius: 2,
              textShadow: '0 0 4px rgba(0,255,65,0.5)',
              textTransform: 'uppercase',
            }}
          >
            ◈ AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'msnctl',   label: 'MSNCTL',  component: (d) => <MissionControl data={d} /> },
  { id: 'projects', label: 'PRJCTS',  component: (d) => <ProjectStatus projects={d.projects} /> },
  { id: 'tasks',    label: 'TASKS',   component: (d) => <TaskView tasks={d.tasks} /> },
  { id: 'calendar', label: 'CALENR',  component: (d) => <CalendarStrip calendar={d.calendar} /> },
  { id: 'metrics',  label: 'METRCS',  component: (d) => <MetricsPanel metrics={d.metrics} /> },
  { id: 'briefs',   label: 'BRIEFS',  component: (d) => <BriefViewer briefs={d.briefs} /> },
  { id: 'hangar',   label: 'HANGAR',  component: (d) => <HangarPanel systemStatus={d.systemStatus} /> },
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('msnctl')

  const active = TABS.find(t => t.id === activeTab)

  return (
    <div
      className="cockpit-root min-h-screen flex flex-col"
      style={{
        background: '#030d07',
        fontFamily: 'JetBrains Mono, IBM Plex Mono, monospace',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 flex justify-between items-center px-4 py-2"
        style={{ background: '#030d07', borderBottom: '1px solid #0d3318' }}
      >
        <div className="flex items-center gap-2" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
          <span className="phosphor-text" style={{ fontWeight: 700 }}>◈ IB</span>
          <span style={{ color: '#0d3318' }}>|</span>
          <span style={{ color: '#00882a' }}>IRONBRAIN HQ</span>
        </div>
        <span style={{ color: '#2a4a2f', fontSize: '0.5rem', letterSpacing: '0.1em' }}>
          {data.meta.lastUpdated}
        </span>
      </div>

      {/* Cockpit Tab Bar */}
      <div
        className="overflow-x-auto scrollbar-hide sticky z-10"
        style={{ top: 33, borderBottom: '1px solid #0d3318', background: '#030d07' }}
      >
        <div className="flex min-w-max">
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-0.5 transition-all"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  color: isActive ? '#00ff41' : '#00882a',
                  textShadow: isActive ? '0 0 6px rgba(0,255,65,0.7)' : 'none',
                  background: isActive ? '#071a0c' : 'transparent',
                  borderBottom: isActive ? '2px solid #00ff41' : '2px solid transparent',
                  borderRight: '1px solid #0d3318',
                  minWidth: 60,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <span style={{ fontSize: '0.5rem', color: isActive ? '#00ff41' : '#003010' }}>
                  {i === 0 ? '◈' : '◆'}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 pb-8 max-w-2xl mx-auto w-full" style={{ minHeight: 0 }}>
        <div className="mfd-panel mfd-panel-hot h-full flex flex-col overflow-hidden" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {active && active.component(data)}
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <PinGate>
      <Dashboard />
    </PinGate>
  )
}
