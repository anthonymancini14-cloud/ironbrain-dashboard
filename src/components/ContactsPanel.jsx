import { useState } from 'react'

const PROJECT_COLORS = {
  cmms:         { bg: 'bg-accent/10',       text: 'text-accent'       },
  bambam:       { bg: 'bg-purple-500/10',   text: 'text-purple-400'   },
  gumroad:      { bg: 'bg-green-500/10',    text: 'text-status-green' },
  vaultcapture: { bg: 'bg-red-500/10',      text: 'text-status-red'   },
  'ironbrain-os': { bg: 'bg-orange-500/10', text: 'text-orange-400'   },
}

const DEFAULT_PROJECT_COLOR = { bg: 'bg-steel-600/30', text: 'text-slate-400' }

export default function ContactsPanel({ contacts }) {
  const [expanded, setExpanded] = useState(null)

  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <p className="text-slate-500 text-sm">No contacts yet</p>
        <p className="text-slate-600 text-xs uppercase tracking-wider">Update dashboard.json to add people</p>
      </div>
    )
  }

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-600 text-xs uppercase tracking-widest mb-1">{contacts.length} contacts</p>

      {contacts.map(contact => {
        const isExpanded = expanded === contact.id
        return (
          <div
            key={contact.id}
            className="bg-steel-800 border border-steel-600 rounded-md p-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{contact.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-wide">{contact.role}</p>
              </div>
            </div>

            {/* Project tags */}
            {contact.projects?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {contact.projects.map(p => {
                  const pc = PROJECT_COLORS[p] || DEFAULT_PROJECT_COLOR
                  return (
                    <span key={p} className={`text-xs px-1.5 py-0.5 rounded font-mono font-medium ${pc.bg} ${pc.text}`}>
                      {p}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Skills */}
            {contact.skills && (
              <p className="text-slate-300 text-xs mt-2 leading-relaxed line-clamp-2">
                {contact.skills}
              </p>
            )}

            {/* Notes — tap to expand */}
            {contact.notes && (
              <div className="mt-2">
                <button
                  onClick={() => toggle(contact.id)}
                  className="text-slate-600 text-xs uppercase tracking-wider hover:text-slate-400 transition-colors"
                >
                  {isExpanded ? 'Hide notes' : 'Show notes'}
                </button>
                {isExpanded && (
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed border-l border-steel-600 pl-2">
                    {contact.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
