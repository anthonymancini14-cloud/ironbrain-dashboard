import { useState } from 'react'

const PRIORITY_CONFIG = {
  high:   { dot: 'bg-status-red',    label: 'High',   order: 0 },
  medium: { dot: 'bg-status-yellow', label: 'Med',    order: 1 },
  low:    { dot: 'bg-status-green',  label: 'Low',    order: 2 },
}

const OWNER_CONFIG = {
  anthony: { bg: 'bg-accent/20',       text: 'text-accent',         label: 'Anthony' },
  jarvis:  { bg: 'bg-purple-500/20',   text: 'text-purple-400',     label: 'Jarvis'  },
  ultron:  { bg: 'bg-orange-500/20',   text: 'text-orange-400',     label: 'Ultron'  },
}

export default function TaskView({ tasks }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filters = [
    { id: 'all',     label: 'All' },
    { id: 'anthony', label: 'Anthony' },
    { id: 'jarvis',  label: 'Jarvis' },
  ]

  const sorted = [...tasks.open]
    .filter(t => filter === 'all' || t.owner === filter)
    .sort((a, b) => (PRIORITY_CONFIG[a.priority]?.order ?? 99) - (PRIORITY_CONFIG[b.priority]?.order ?? 99))

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-accent text-white'
                : 'bg-steel-700 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-slate-500 text-xs self-center">{sorted.length} open</span>
      </div>

      {/* Open tasks */}
      <div className="flex flex-col gap-2">
        {sorted.map(task => {
          const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
          const oc = OWNER_CONFIG[task.owner] || OWNER_CONFIG.anthony
          const isExpanded = expanded === task.id
          return (
            <button
              key={task.id}
              onClick={() => toggle(task.id)}
              className="bg-steel-800 border border-steel-600 rounded-lg p-3 text-left w-full hover:border-steel-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${pc.dot}`} />
                <span className="text-white text-sm flex-1 leading-snug">{task.title}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-steel-600 text-slate-300 text-xs px-1.5 py-0.5 rounded font-mono">
                    {task.scope}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${oc.bg} ${oc.text}`}>
                    {oc.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-slate-600 text-xs">{task.project}</span>
                {isExpanded && (
                  <span className="text-slate-400 text-xs ml-1">{task.notes}</span>
                )}
              </div>
            </button>
          )
        })}

        {sorted.length === 0 && (
          <div className="text-slate-500 text-sm text-center py-8">No tasks for this filter.</div>
        )}
      </div>

      {/* Recently completed */}
      <div className="mt-2">
        <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
          Recently Completed
        </h3>
        <div className="flex flex-col gap-1.5">
          {tasks.recentlyCompleted.map(task => (
            <div key={task.id} className="flex items-center gap-2 px-3 py-2 bg-steel-800/50 rounded-lg border border-steel-700">
              <span className="text-status-green text-xs">✓</span>
              <span className="text-slate-400 text-xs flex-1">{task.title}</span>
              <span className="text-slate-600 text-xs shrink-0">{task.completedDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
