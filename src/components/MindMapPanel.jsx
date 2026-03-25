import { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import mindmapsData from '../data/mindmaps.json'

// Status color map
const STATUS_COLOR = {
  completed: '#22c55e',
  active:    '#4a9eff',
  pending:   '#94a3b8',
  future:    '#334155',
}
const STATUS_STROKE = {
  completed: '#16a34a',
  active:    '#2563eb',
  pending:   '#64748b',
  future:    '#1e293b',
}

// Node radius by type
const NODE_R = { root: 18, phase: 13, task: 8 }

// Build D3-compatible hierarchy from flat nodes array
function buildHierarchy(nodes) {
  const nodeMap = {}
  nodes.forEach(n => { nodeMap[n.id] = { ...n, children: [] } })
  let root = null
  nodes.forEach(n => {
    if (n.type === 'root') { root = nodeMap[n.id]; return }
    // attach to parent that has this id in their children array
  })
  nodes.forEach(n => {
    n.children?.forEach(childId => {
      if (nodeMap[childId] && nodeMap[n.id]) {
        nodeMap[n.id].children.push(nodeMap[childId])
      }
    })
  })
  return root
}

function wrapText(text, maxWidth) {
  return text.split('\n')
}

export default function MindMapPanel() {
  const maps = mindmapsData.maps
  const [activeMapId, setActiveMapId] = useState(maps[0].id)
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  const activeMap = maps.find(m => m.id === activeMapId)

  const renderMap = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return
    const container = containerRef.current
    const { width } = container.getBoundingClientRect()
    const height = Math.min(width * 0.85, 380)

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Zoom behavior
    const g = svg.append('g')
    svg.call(
      d3.zoom()
        .scaleExtent([0.4, 2.5])
        .on('zoom', (event) => { g.attr('transform', event.transform) })
    )

    // Build hierarchy
    const rootData = buildHierarchy(activeMap.nodes)
    if (!rootData) return

    const hierarchy = d3.hierarchy(rootData)
    const treeLayout = d3.tree()
      .size([2 * Math.PI, Math.min(width, height) / 2 - 50])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2) / a.depth)

    const tree = treeLayout(hierarchy)

    // Center group
    g.attr('transform', `translate(${width / 2},${height / 2})`)

    // Links
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#1e3a5f')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(tree.links())
      .join('path')
      .attr('d', d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y)
      )

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(tree.descendants())
      .join('g')
      .attr('transform', d => {
        const angle = d.x - Math.PI / 2
        return `translate(${d.y * Math.cos(angle)},${d.y * Math.sin(angle)})`
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        setTooltip({ label: d.data.label.replace('\n', ' '), status: d.data.status, type: d.data.type })
      })

    // Circles
    node.append('circle')
      .attr('r', d => NODE_R[d.data.type] || 8)
      .attr('fill', d => STATUS_COLOR[d.data.status] || '#334155')
      .attr('stroke', d => STATUS_STROKE[d.data.status] || '#1e293b')
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', d => d.data.type === 'future' ? 0.4 : 0.85)

    // Labels
    node.each(function(d) {
      const lines = d.data.label.split('\n')
      const el = d3.select(this)
      const r = NODE_R[d.data.type] || 8
      const fontSize = d.data.type === 'root' ? 11 : d.data.type === 'phase' ? 10 : 9

      const text = el.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', d.data.type === 'future' ? '#475569' : '#e2e8f0')
        .attr('font-size', fontSize)
        .attr('font-family', 'ui-monospace, monospace')
        .attr('pointer-events', 'none')

      const totalHeight = lines.length * (fontSize + 2)
      lines.forEach((line, i) => {
        text.append('tspan')
          .attr('x', 0)
          .attr('dy', i === 0 ? `${-totalHeight / 2 + fontSize}px` : `${fontSize + 2}px`)
          .text(line)
      })
    })

    // Dismiss tooltip on svg click
    svg.on('click', () => setTooltip(null))
  }, [activeMap])

  useEffect(() => {
    renderMap()
    const handleResize = debounce(renderMap, 200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [renderMap])

  return (
    <div className="flex flex-col gap-4">
      {/* Map selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {maps.map(m => (
          <button
            key={m.id}
            onClick={() => { setActiveMapId(m.id); setTooltip(null) }}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${
              activeMapId === m.id
                ? 'bg-accent text-white'
                : 'bg-steel-700 text-slate-500 hover:text-slate-200'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {/* Map description */}
      <p className="text-slate-600 text-xs uppercase tracking-wider">{activeMap.description}</p>

      {/* SVG canvas */}
      <div
        ref={containerRef}
        className="bg-steel-800 border border-steel-600 rounded-md overflow-hidden"
      >
        <svg ref={svgRef} className="block w-full touch-none" />
      </div>

      {/* Node tooltip */}
      {tooltip && (
        <div className="bg-steel-700 border border-steel-500 rounded-md px-4 py-3">
          <p className="text-white text-sm font-semibold">{tooltip.label}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full`} style={{ background: STATUS_COLOR[tooltip.status] }} />
            <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">{tooltip.status}</span>
            <span className="text-slate-600 text-xs font-mono">{tooltip.type}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries({ completed: 'Completed', active: 'Active', pending: 'Pending', future: 'Future' }).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[status], opacity: status === 'future' ? 0.4 : 0.85 }} />
            <span className="text-slate-500 text-xs uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
