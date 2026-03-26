// ProjectStatus.jsx — ◆ PRJCTS // PROJECTS
// Cockpit redesign: flight status board aesthetic, flat rows, annunciator dots

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

// project.status is "green" | "yellow" | "red"
const STATUS_MAP = {
  green:  { indicator: 'annunciator-green', label: 'NOMINAL',     borderColor: '#00882a' },
  yellow: { indicator: 'annunciator-amber', label: 'IN-PROGRESS', borderColor: '#ffaa00', pulse: true },
  red:    { indicator: 'annunciator-red',   label: 'BLOCKED',     borderColor: '#ff2020' },
}

export default function ProjectStatus({ projects }) {
  const activeCount = projects.filter(p => p.status !== 'red').length

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: mono }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ PRJCTS  //  PROJECTS</span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.5rem', color: '#00882a', letterSpacing: '0.1em' }}>
            {activeCount}/{projects.length} ACTIVE
          </span>
          <span className="annunciator annunciator-green" />
        </div>
      </div>

      {/* Project rows */}
      <div className="flex-1 overflow-auto">
        {projects.map((project, i) => {
          const sm = STATUS_MAP[project.status] || STATUS_MAP.yellow
          const maxSteps = 15
          const pct = Math.max(0, Math.min(100, 100 - (project.stepsRemaining / maxSteps) * 100))

          return (
            <div
              key={project.id}
              style={{
                borderBottom: '1px solid #0d3318',
                borderLeft: `2px solid ${sm.borderColor}`,
                padding: '10px 12px',
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,26,7,0.3)',
              }}
            >
              {/* Row header */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="phosphor-text"
                  style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {project.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.1em',
                      color: project.status === 'green' ? '#00ff41' : project.status === 'yellow' ? '#ffaa00' : '#ff2020',
                      textShadow: project.status === 'green'
                        ? '0 0 4px rgba(0,255,65,0.5)'
                        : project.status === 'yellow'
                          ? '0 0 4px rgba(255,170,0,0.5)'
                          : '0 0 4px rgba(255,32,32,0.5)',
                    }}
                  >
                    {sm.label}
                  </span>
                  <span className={`annunciator ${sm.indicator} ${sm.pulse ? 'pulse' : ''}`} />
                </div>
              </div>

              {/* Phase label */}
              <div style={{ fontSize: '0.55rem', color: '#00882a', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                {project.phase}
              </div>

              {/* Progress bar */}
              <div className="phosphor-bar-track mb-2" style={{
                background: pct > 70
                  ? undefined
                  : pct > 30
                    ? undefined
                    : '#0d0005',
              }}>
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

              {/* Next step */}
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.15em', flexShrink: 0 }}>NEXT</span>
                <span style={{ fontSize: '0.6rem', color: '#00882a', letterSpacing: '0.03em' }} title={project.currentStep}>
                  {project.currentStep}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-1">
                <span style={{ fontSize: '0.5rem', color: '#ffaa00', letterSpacing: '0.1em' }}>
                  {project.stepsRemaining} STEPS REMAINING
                </span>
                <span style={{ fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.08em' }}>
                  {project.lastUpdated}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
