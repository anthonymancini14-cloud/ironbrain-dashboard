// HangarPanel.jsx — ◆ HANGAR // AIRCRAFT READY
// Cockpit redesign: dark flight line, HUD overlays, desaturated F-15, system status annunciators

const mono = 'JetBrains Mono, IBM Plex Mono, monospace'

function formatMilTime(isoString) {
  if (!isoString) return '--'
  const d = new Date(isoString)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]
  const hrs   = String(d.getHours()).padStart(2, '0')
  const mins  = String(d.getMinutes()).padStart(2, '0')
  return `${day}${month} ${hrs}${mins}Z`
}

const SYSTEM_LABELS = {
  vaultGuard:   'VAULT GUARD',
  morningBrief: 'MORNING BRIEF',
  weeklyReview: 'WEEKLY REVIEW',
}

export default function HangarPanel({ systemStatus }) {
  const systems = Object.entries(systemStatus ?? {}).map(([key, val]) => ({
    key,
    label: SYSTEM_LABELS[key] || key.toUpperCase(),
    ...val,
  }))

  const now = new Date()
  const day   = String(now.getDate()).padStart(2, '0')
  const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][now.getMonth()]
  const year  = String(now.getFullYear()).slice(-2)
  const hrs   = String(now.getHours()).padStart(2, '0')
  const mins  = String(now.getMinutes()).padStart(2, '0')
  const dateTimeStr = `${day}${month}${year} ${hrs}${mins}Z`

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: mono, background: '#000d05' }}>
      {/* Panel header */}
      <div className="mfd-header">
        <span>◆ HANGAR  //  AIRCRAFT READY</span>
        <div className="flex items-center gap-2">
          <span className="phosphor-text pulse" style={{ fontSize: '0.5rem', letterSpacing: '0.12em' }}>● ARMED</span>
          <span className="annunciator annunciator-green pulse" />
        </div>
      </div>

      {/* F-15 image with HUD overlays */}
      <div style={{ position: 'relative', background: '#000d05', borderBottom: '1px solid #0d3318', flexShrink: 0 }}>
        <img
          src="/hangar.svg"
          alt="F-15 Maintenance Hangar"
          style={{
            width: '100%',
            display: 'block',
            aspectRatio: '400/240',
            filter: 'brightness(0.65) contrast(1.2) saturate(0.25)',
          }}
        />

        {/* Dark overlay for cold steel look */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,13,5,0.45)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }} />

        {/* HUD overlay — top left */}
        <div style={{
          position: 'absolute', top: 8, left: 10,
          fontFamily: mono, fontSize: '0.55rem', letterSpacing: '0.12em',
          color: '#00ff41',
          textShadow: '0 0 4px rgba(0,255,65,0.7)',
          lineHeight: 1.6,
          pointerEvents: 'none',
        }}>
          <div>ACFT: F-15C EAGLE</div>
          <div style={{ color: '#00882a' }}>131ST FS / MA ANG</div>
        </div>

        {/* HUD overlay — top right */}
        <div style={{
          position: 'absolute', top: 8, right: 10,
          fontFamily: mono, fontSize: '0.55rem', letterSpacing: '0.1em',
          textAlign: 'right',
          lineHeight: 1.6,
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <span className="annunciator annunciator-green pulse" style={{ width: 6, height: 6 }} />
            <span style={{ color: '#00ff41', textShadow: '0 0 4px rgba(0,255,65,0.7)' }}>STATUS: ARMED</span>
          </div>
        </div>

        {/* HUD overlay — bottom right */}
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontFamily: mono, fontSize: '0.5rem', letterSpacing: '0.08em',
          color: '#00882a',
          textShadow: '0 0 3px rgba(0,255,65,0.3)',
          lineHeight: 1.5,
          textAlign: 'right',
          pointerEvents: 'none',
        }}>
          <div>{dateTimeStr}</div>
        </div>

        {/* Corner brackets — cockpit HUD style */}
        {[
          { top: 0, left: 0, bt: '2px solid rgba(0,255,65,0.4)', bl: '2px solid rgba(0,255,65,0.4)', br: 'none', bb: 'none' },
          { top: 0, right: 0, bt: '2px solid rgba(0,255,65,0.4)', br: '2px solid rgba(0,255,65,0.4)', bl: 'none', bb: 'none' },
          { bottom: 0, left: 0, bb: '2px solid rgba(0,255,65,0.4)', bl: '2px solid rgba(0,255,65,0.4)', bt: 'none', br: 'none' },
          { bottom: 0, right: 0, bb: '2px solid rgba(0,255,65,0.4)', br: '2px solid rgba(0,255,65,0.4)', bt: 'none', bl: 'none' },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 12, height: 12,
            pointerEvents: 'none',
            borderTop: pos.bt,
            borderLeft: pos.bl,
            borderRight: pos.br,
            borderBottom: pos.bb,
            ...pos,
          }} />
        ))}
      </div>

      {/* System status rows */}
      <div className="flex-1 overflow-auto">
        <div style={{ padding: '6px 12px', background: '#001a07', borderBottom: '1px solid #0d3318', fontSize: '0.5rem', color: '#2a4a2f', letterSpacing: '0.15em' }}>
          AUTOMATED SYSTEMS STATUS
        </div>

        {systems.map(sys => (
          <div
            key={sys.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #0d3318',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`annunciator ${
                sys.status === 'ok'   ? 'annunciator-green' :
                sys.status === 'warn' ? 'annunciator-amber' :
                'annunciator-red'
              }`} />
              <span style={{ fontSize: '0.65rem', color: '#00882a', letterSpacing: '0.08em' }}>
                {sys.label}
              </span>
            </div>
            <span style={{ fontSize: '0.55rem', color: '#2a4a2f', letterSpacing: '0.05em', fontFamily: mono }}>
              {formatMilTime(sys.lastRun)}
            </span>
          </div>
        ))}

        <div style={{
          padding: '8px 12px',
          fontSize: '0.5rem',
          color: '#1a3a1f',
          letterSpacing: '0.12em',
          textAlign: 'center',
          marginTop: 4,
        }}>
          PH2 — CREW ANIMATES WHEN TASKS RUN
        </div>
      </div>
    </div>
  )
}
