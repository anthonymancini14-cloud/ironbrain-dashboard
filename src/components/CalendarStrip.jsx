const CALENDAR_COLORS = [
  'bg-accent',
  'bg-purple-400',
  'bg-status-green',
  'bg-status-yellow',
  'bg-pink-400',
]

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function CalendarStrip({ calendar }) {
  const allDay = calendar.events?.filter(e => e.allDay) || []
  const timed  = calendar.events?.filter(e => !e.allDay).sort((a, b) => new Date(a.start) - new Date(b.start)) || []
  const calendarNames = [...new Set(calendar.events?.map(e => e.calendar) || [])]
  const calendarColorMap = Object.fromEntries(calendarNames.map((name, i) => [name, CALENDAR_COLORS[i % CALENDAR_COLORS.length]]))

  return (
    <div className="flex flex-col gap-4">
      {/* Date header */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-accent text-xs font-semibold uppercase tracking-wider">Today</span>
        </div>
        <h2 className="text-white font-bold text-lg">{formatDate(calendar.date)}</h2>
        <p className="text-slate-500 text-xs mt-1">
          {calendar.events?.length === 0
            ? 'No events scheduled'
            : `${calendar.events?.length} event${calendar.events?.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {calendar.events?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-slate-500 text-sm">No events scheduled today</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">Syncs every 2 hrs via Jarvis</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* All-day events */}
          {allDay.map((event, i) => (
            <div key={i} className="bg-steel-800 border border-steel-600 rounded-md p-3 flex items-center gap-3">
              <div className="flex flex-col items-center gap-1 w-12 shrink-0">
                <span className="text-slate-500 text-xs">All day</span>
              </div>
              <div className={`w-0.5 self-stretch ${calendarColorMap[event.calendar] || 'bg-accent'}`} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{event.title}</p>
                {event.calendar && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${calendarColorMap[event.calendar] || 'bg-accent'}`} />
                    <span className="text-slate-500 text-xs">{event.calendar}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Timed events */}
          {timed.map((event, i) => (
            <div key={i} className="bg-steel-800 border border-steel-600 rounded-md p-3 flex items-center gap-3">
              <div className="flex flex-col items-center gap-0.5 w-14 shrink-0 text-right">
                <span className="text-slate-300 text-xs font-medium">{formatTime(event.start)}</span>
                {event.end && <span className="text-slate-600 text-xs">{formatTime(event.end)}</span>}
              </div>
              <div className={`w-0.5 self-stretch ${calendarColorMap[event.calendar] || 'bg-accent'}`} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{event.title}</p>
                {event.location && (
                  <p className="text-slate-500 text-xs mt-0.5 font-mono">{event.location}</p>
                )}
                {event.calendar && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${calendarColorMap[event.calendar] || 'bg-accent'}`} />
                    <span className="text-slate-500 text-xs">{event.calendar}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
