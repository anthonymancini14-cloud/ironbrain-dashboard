import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

const KPI_CARD_CONFIG = [
  { key: 'tasksCompletedThisWeek',  label: 'Tasks\nThis Week',       color: 'text-accent'       },
  { key: 'tasksCompletedThisMonth', label: 'Tasks\nThis Month',      color: 'text-status-green'  },
  { key: 'executionBriefsFiled',    label: 'EBs\nFiled',             color: 'text-white'         },
  { key: 'briefsRequiringRework',   label: 'EBs\nRework',            color: 'text-status-yellow' },
]

function KpiCard({ label, value, color }) {
  return (
    <div className="bg-steel-800 border border-steel-600 rounded-md p-3 flex flex-col gap-1">
      <span className={`text-3xl font-bold font-mono ${color}`}>{value}</span>
      <span className="text-slate-500 text-xs uppercase tracking-wider leading-tight whitespace-pre-line">
        {label}
      </span>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-steel-700 border border-steel-500 rounded-md px-3 py-2 text-xs">
      <p className="text-slate-300 font-mono mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }} className="font-mono">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function MetricsPanel({ metrics }) {
  const { weeklyHistory, executionBriefsFiled, executionBriefsCompleted } = metrics

  return (
    <div className="flex flex-col gap-4">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2">
        {KPI_CARD_CONFIG.map(({ key, label, color }) => (
          <KpiCard key={key} label={label} value={metrics[key]} color={color} />
        ))}
      </div>

      {/* EB filed vs completed */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-3">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Execution Briefs</p>
        <div className="flex items-baseline gap-2">
          <span className="text-white font-mono text-xl font-semibold">{executionBriefsFiled}</span>
          <span className="text-slate-500 text-xs">filed</span>
          <span className="text-steel-500 text-xs">/</span>
          <span className="text-status-green font-mono text-xl font-semibold">{executionBriefsCompleted}</span>
          <span className="text-slate-500 text-xs">complete</span>
        </div>
      </div>

      {/* Weekly tasks completed bar chart */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-3">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">Weekly Tasks Completed</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyHistory} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,158,255,0.06)' }} />
            <Bar dataKey="completed" name="Completed" radius={[2, 2, 0, 0]}>
              {weeklyHistory.map((_, i) => (
                <Cell key={i} fill="#4a9eff" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked completed vs rework chart */}
      <div className="bg-steel-800 border border-steel-600 rounded-md p-3">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Completed vs Rework</p>
        <p className="text-slate-600 text-xs mb-3">A rework bar is a flag</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyHistory} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,158,255,0.06)' }} />
            <Bar dataKey="completed" name="Completed" stackId="a" fill="#22c55e" fillOpacity={0.7} radius={[0, 0, 0, 0]} />
            <Bar dataKey="rework"    name="Rework"    stackId="a" fill="#f59e0b" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
