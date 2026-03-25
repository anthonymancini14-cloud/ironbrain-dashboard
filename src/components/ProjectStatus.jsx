export default function ProjectStatus({ projects }) {
  const statusColors = {
    green: { dot: 'bg-status-green', text: 'text-status-green', label: 'On Track' },
    yellow: { dot: 'bg-status-yellow', text: 'text-status-yellow', label: 'In Progress' },
    red: { dot: 'bg-status-red', text: 'text-status-red', label: 'Blocked' },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {projects.map(project => {
        const sc = statusColors[project.status] || statusColors.yellow
        return (
          <div
            key={project.id}
            className="bg-steel-800 border border-steel-600 rounded-xl p-4 flex flex-col gap-2"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">{project.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{project.phase}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-steel-700 ${sc.text} shrink-0`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>

            {/* Status note */}
            <p className="text-slate-300 text-xs italic leading-relaxed">{project.statusNote}</p>

            {/* Current step */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-500 text-xs shrink-0">↳</span>
              <p className="text-slate-400 text-xs truncate" title={project.currentStep}>
                {project.currentStep}
              </p>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-steel-600">
              <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-0.5 rounded-full">
                {project.stepsRemaining} steps left
              </span>
              <span className="text-slate-500 text-xs">{project.lastUpdated}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
