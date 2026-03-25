import { useState } from 'react'
import data from './data/dashboard.json'
import ProjectStatus from './components/ProjectStatus'
import TaskView from './components/TaskView'
import CalendarStrip from './components/CalendarStrip'

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
      <div className="bg-steel-800 p-8 rounded-2xl border border-steel-600 w-full max-w-xs shadow-2xl">
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="text-accent font-bold text-lg tracking-tighter">IB</span>
          </div>
        </div>
        <h1 className="text-white text-xl font-bold mb-1 text-center">IronBrain HQ</h1>
        <p className="text-slate-400 text-sm mb-6 text-center">Enter PIN to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-steel-700 text-white rounded-xl p-3 mb-3 border border-steel-500 focus:border-accent outline-none text-center text-2xl tracking-[0.5em] placeholder:tracking-normal"
            placeholder="••••"
            autoFocus
          />
          {error && (
            <p className="text-status-red text-sm mb-3 text-center animate-pulse">
              Incorrect PIN
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-500 text-white rounded-xl p-3 font-semibold transition-colors"
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
  { id: 'projects', label: 'Projects', icon: '⬡' },
  { id: 'tasks',    label: 'Tasks',    icon: '✓' },
  { id: 'calendar', label: 'Calendar', icon: '◈' },
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <div className="min-h-screen bg-steel-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-steel-800 border-b border-steel-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs">IB</span>
          <h1 className="font-bold text-accent text-base tracking-wide">IronBrain HQ</h1>
        </div>
        <span className="text-slate-500 text-xs">Updated {data.meta.lastUpdated}</span>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[52px] z-10 bg-steel-800 border-b border-steel-600 flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs opacity-70">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-8 max-w-2xl mx-auto w-full">
        {activeTab === 'projects' && <ProjectStatus projects={data.projects} />}
        {activeTab === 'tasks'    && <TaskView tasks={data.tasks} />}
        {activeTab === 'calendar' && <CalendarStrip calendar={data.calendar} />}
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
