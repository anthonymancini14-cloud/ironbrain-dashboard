import { useState } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function BriefPane({ title, dateLabel, content }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-4">
        <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">{dateLabel}</p>
        <h2 className="text-white font-semibold text-base">{title}</h2>
      </div>

      {/* Content */}
      {content ? (
        <div className="bg-steel-800 border border-steel-600 rounded-md p-4">
          <pre className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </pre>
        </div>
      ) : (
        <div className="bg-steel-800 border border-steel-600 rounded-md p-6 flex flex-col items-center justify-center gap-2">
          <p className="text-slate-500 text-sm">Brief not yet synced</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">Jarvis sync pending</p>
        </div>
      )}
    </div>
  )
}

export default function BriefViewer({ briefs }) {
  const [activePane, setActivePane] = useState('daily')

  const panes = [
    { id: 'daily',  label: 'Daily'  },
    { id: 'weekly', label: 'Weekly' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tab selector */}
      <div className="flex gap-2">
        {panes.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePane(p.id)}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
              activePane === p.id
                ? 'bg-accent text-white'
                : 'bg-steel-700 text-slate-500 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {activePane === 'daily' && (
        <BriefPane
          title={briefs.daily.title}
          dateLabel={formatDate(briefs.daily.date)}
          content={briefs.daily.content}
        />
      )}
      {activePane === 'weekly' && (
        <BriefPane
          title={briefs.weekly.title}
          dateLabel={`Week of ${formatDate(briefs.weekly.weekOf)}`}
          content={briefs.weekly.content}
        />
      )}
    </div>
  )
}
