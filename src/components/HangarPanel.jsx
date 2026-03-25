function formatRunTime(isoString) {
  if (!isoString) return '--'
  const d = new Date(isoString)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    hour12: true,
  })
}

const SYSTEM_LABELS = {
  vaultGuard:   'Vault Guard',
  morningBrief: 'Morning Brief',
  weeklyReview: 'Weekly Review',
}

export default function HangarPanel({ systemStatus }) {
  const systems = Object.entries(systemStatus).map(([key, val]) => ({
    key,
    label: SYSTEM_LABELS[key] || key,
    ...val,
  }))

  return (
    <div className="flex flex-col gap-4">
      {/* F-15 hangar illustration */}
      <div className="bg-steel-800 border border-steel-600 rounded-md overflow-hidden">
        <img
          src="/hangar.svg"
          alt="F-15 Maintenance Hangar"
          className="w-full block"
          style={{ aspectRatio: '400/240' }}
        />
      </div>

      {/* System status row */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-4">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">System Status</p>
        <div className="flex flex-col gap-2">
          {systems.map(sys => (
            <div key={sys.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  sys.status === 'ok'   ? 'bg-status-green' :
                  sys.status === 'warn' ? 'bg-status-yellow' :
                  'bg-status-red'
                }`} />
                <span className="text-slate-300 text-xs font-medium">{sys.label}</span>
              </div>
              <span className="text-slate-600 text-xs font-mono">{formatRunTime(sys.lastRun)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 2 caption */}
      <p className="text-slate-600 text-xs text-center uppercase tracking-wider">
        Phase 2 — crew animates when tasks run
      </p>
    </div>
  )
}
