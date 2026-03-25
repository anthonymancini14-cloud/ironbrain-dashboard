import { useState } from 'react'
import data from './data/dashboard.json'
import ProjectStatus  from './components/ProjectStatus'
import TaskView       from './components/TaskView'
import CalendarStrip  from './components/CalendarStrip'
import MetricsPanel   from './components/MetricsPanel'
import ContactsPanel  from './components/ContactsPanel'
import BriefViewer    from './components/BriefViewer'
import HangarPanel    from './components/HangarPanel'
import MindMapPanel   from './components/MindMapPanel'

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
    <div className="min-h-screen bg-steel-900 flex items-center justify-center px-4">
      <div className="bg-steel-800 p-8 rounded-md border border-steel-600 w-full max-w-xs">
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-base tracking-widest font-mono">IB</span>
          </div>
        </div>
        <h1 className="text-white text-lg font-bold mb-1 text-center tracking-wide">IronBrain HQ</h1>
        <p className="text-slate-500 text-xs mb-6 text-center uppercase tracking-wider">Enter PIN to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-steel-700 text-white rounded p-3 mb-3 border border-steel-500 focus:border-accent outline-none text-center text-2xl tracking-widest placeholder:tracking-normal"
            placeholder="••••"
            autoFocus
          />
          {error && (
            <p className="text-status-red text-xs mb-3 text-center uppercase tracking-wider">
              Incorrect PIN
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-500 text-white rounded p-3 font-semibold transition-colors text-sm tracking-wide"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'tasks',    label: 'Tasks'    },
  { id: 'calendar', label: 'Calendar' },
  { id: 'metrics',  label: 'Metrics'  },
  { id: 'contacts', label: 'Contacts' },
  { id: 'briefs',   label: 'Briefs'   },
  { id: 'hangar',   label: 'Hangar'   },
  { id: 'maps',     label: 'Maps'     },
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <div className="min-h-screen bg-steel-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-steel-800 border-b border-steel-600 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="text-accent font-bold text-sm font-mono tracking-widest">IB</span>
          <span className="text-steel-600">|</span>
          <h1 className="font-semibold text-slate-200 text-sm tracking-wide">IronBrain HQ</h1>
        </div>
        <span className="text-slate-600 text-xs font-mono">{data.meta.lastUpdated}</span>
      </div>

      {/* Tab bar — horizontal scroll for 8 tabs on mobile */}
      <div className="sticky top-[45px] z-10 bg-steel-800 border-b border-steel-600 overflow-x-auto">
        <div className="inline-flex min-w-full">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-semibold transition-colors uppercase tracking-wider whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-8 max-w-2xl mx-auto w-full">
        {activeTab === 'projects' && <ProjectStatus projects={data.projects} />}
        {activeTab === 'tasks'    && <TaskView tasks={data.tasks} />}
        {activeTab === 'calendar' && <CalendarStrip calendar={data.calendar} />}
        {activeTab === 'metrics'  && <MetricsPanel metrics={data.metrics} />}
        {activeTab === 'contacts' && <ContactsPanel contacts={data.contacts} />}
        {activeTab === 'briefs'   && <BriefViewer briefs={data.briefs} />}
        {activeTab === 'hangar'   && <HangarPanel systemStatus={data.systemStatus} />}
        {activeTab === 'maps'     && <MindMapPanel />}
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
