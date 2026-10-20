import TreeView from '../../components/TreeView.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'
import { forestSnapshot, groupStates, groupsOf, heightOf, listText, makeSets, nodeId, rootOf, union } from './ufData.js'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const GREY = '#e4e4e2'

// The parent list as a row of numbered cells; `hot` cells are coloured.
function ParentRow({ parent, hot = [] }) {
  return (
    <div className="cell-row" role="img" aria-label={`The parent list: ${parent.map((p, k) => `${k} points at ${p}`).join(', ')}.`}>
      <code className="cell-name">parent</code>
      {parent.map((p, k) => (
        <span key={k} style={hot.includes(k) ? { background: GREEN } : undefined}>
          {p}
          <i>{k}</i>
        </span>
      ))}
    </div>
  )
}

const climb = (parent, x) => {
  const path = [x]
  while (parent[x] !== x) {
    x = parent[x]
    path.push(x)
  }
  return path
}

// ------------------------------------------------ groups merging

const GROUPS_N = 8

const GROUP_FRAMES = (() => {
  const sets = makeSets(GROUPS_N)
  const frames = []
  const snap = (extra) => frames.push({ parent: sets.parent.slice(), hot: [], states: {}, ...extra })

  snap({ caption: 'Eight things, each in a group of its own. Every circle points at itself, which makes it the root of its own group.' })

  const join = (a, b, tail = '') => {
    const ra = rootOf(sets.parent, a)
    const rb = rootOf(sets.parent, b)
    const tie = sets.size[ra] === sets.size[rb]
    union(sets, a, b)
    const loser = sets.parent[ra] === ra ? rb : ra
    const winner = loser === ra ? rb : ra
    const members = groupsOf(sets.parent).find((g) => g.includes(winner))
    snap({
      hot: [loser],
      states: { [nodeId(a)]: 'active', [nodeId(b)]: 'active' },
      caption: `union(${a}, ${b}): their roots are ${ra} and ${rb}. Point root ${loser} at root ${winner}${tie ? ' (the groups are the same size, so either way works)' : ' (it is the smaller group)'}. ${listText(members)} are now one group.${tail}`,
    })
  }

  const ask = (a, b) => {
    const pa = climb(sets.parent, a)
    const pb = climb(sets.parent, b)
    const ra = pa[pa.length - 1]
    const rb = pb[pb.length - 1]
    const same = ra === rb
    snap({
      states: { [nodeId(a)]: 'active', [nodeId(b)]: 'active', [nodeId(ra)]: same ? 'found' : 'bad', [nodeId(rb)]: same ? 'found' : 'bad' },
      caption: `Are ${a} and ${b} in the same group? Climb from each: ${pa.join(' → ')} and ${pb.join(' → ')}. ${same ? `Both end at root ${ra}, so yes.` : `They end at roots ${ra} and ${rb}, which are different, so no.`}`,
    })
  }

  join(0, 1)
  join(2, 3)
  join(4, 5)
  join(0, 2)
  ask(1, 3)
  ask(1, 5)
  join(1, 5, ' Things 6 and 7 are still alone.')
  return frames
})()

// Eight things being joined into groups, one union at a time.
function GroupsVisual() {
  const [tick, setTick] = useLoop(GROUP_FRAMES.length, 5000)
  const frame = GROUP_FRAMES[tick]
  const states = { ...groupStates(frame.parent), ...frame.states }

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={forestSnapshot(frame.parent, { rows: 3 })}
        states={states}
        ariaLabel={`Eight things in groups. Each group is a tree, and the root of the tree names the group. Groups now: ${groupsOf(frame.parent).map((g) => `{${g.join(', ')}}`).join(' ')}.`}
      />
      <ParentRow parent={frame.parent} hot={frame.hot} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: '#bcd2f7' }} /> <span className="swatch" style={{ background: '#fbd0a5' }} /> same colour: same group</li>
        <li><span className="swatch" style={{ background: BLUE }} /> the two things asked about</li>
        <li><span className="swatch" style={{ background: GREEN }} /> same root</li>
        <li><span className="swatch" style={{ background: RED }} /> different roots</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={GROUP_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ a find, climbing

const CHAIN = [0, 0, 1, 2, 3]

const FIND_FRAMES = (() => {
  const frames = [
    {
      x: null,
      caption: 'These five things are in one group, but they were joined in an unlucky order, so the tree is a chain. Every circle points at its parent. Only 0, the root, points at itself.',
    },
  ]
  let x = 4
  for (let hops = 0; ; hops++) {
    const root = CHAIN[x] === x
    frames.push({
      x,
      root,
      path: climb(CHAIN, 4).slice(0, hops),
      caption: root
        ? `At ${x}: it points at itself, so ${x} is the root. find(4) took ${hops} hops. In a chain of a million, it would take a million.`
        : `${hops === 0 ? 'find(4) starts at 4.' : `Now at ${x}.`} It points at ${CHAIN[x]}, not at itself, so it is not the root. Climb to ${CHAIN[x]}.`,
    })
    if (root) break
    x = CHAIN[x]
  }
  return frames
})()

// find walking up a chain, one pointer at a time.
function FindVisual() {
  const [tick, setTick] = useLoop(FIND_FRAMES.length, 4200)
  const frame = FIND_FRAMES[tick]
  const states = {}
  frame.path?.forEach((x) => {
    states[nodeId(x)] = 'checked'
  })
  if (frame.x !== null) states[nodeId(frame.x)] = frame.root ? 'found' : 'active'

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={forestSnapshot(CHAIN, { rows: 5 })}
        states={states}
        ariaLabel="A group of five things shaped like a chain: 4 points at 3, 3 at 2, 2 at 1, 1 at 0, and 0 is the root. Finding the root of 4 takes four hops."
      />
      <ParentRow parent={CHAIN} hot={frame.x === null ? [] : [frame.x]} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> where we are</li>
        <li><span className="swatch" style={{ background: GREY }} /> already passed</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the root</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={FIND_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ the same chain, flattened

const FLAT_FRAMES = (() => {
  const parent = CHAIN.slice()
  const frames = []
  const snap = (extra) => frames.push({ parent: parent.slice(), hot: [], states: {}, ...extra })
  snap({ caption: 'The same chain. This time find tidies up as it climbs: every thing it passes is pointed at its grandparent, skipping its parent.' })

  const run = (start) => {
    let x = start
    let first = true
    while (parent[x] !== x) {
      const p = parent[x]
      const g = parent[p]
      parent[x] = g
      snap({
        hot: [x],
        states: { [nodeId(x)]: 'active', [nodeId(g)]: 'queued' },
        caption: `${first ? `find(${start}): ` : ''}at ${x}, whose parent is ${p} and whose grandparent is ${g}. ${g === p ? `${p} is the root, so nothing changes.` : `Point ${x} straight at ${g}.`}`,
      })
      first = false
      x = parent[x]
      snap({
        states: { [nodeId(x)]: parent[x] === x ? 'found' : 'active' },
        caption: parent[x] === x ? `Move up to ${x}. It is the root, so find stops.` : `Move up to ${x}.`,
      })
    }
  }
  run(4)
  const h1 = heightOf(parent)
  frames[frames.length - 1].caption += ` The chain is already shorter: ${h1} hops tall instead of 4.`
  frames.push({ ...frames[0], parent: parent.slice(), hot: [], states: {}, caption: 'Ask for find(4) a second time, and the same tidying happens again.' })
  run(4)
  snap({ caption: `No thing is more than ${heightOf(parent)} hops from the root now, and 4 points straight at it. The more finds you do, the flatter the trees get, so later finds are almost free.` })
  return frames
})()

// The same chain after find has tidied it up twice.
function FlattenVisual() {
  const [tick, setTick] = useLoop(FLAT_FRAMES.length, 4200)
  const frame = FLAT_FRAMES[tick]

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={forestSnapshot(frame.parent, { rows: 5 })}
        states={frame.states}
        ariaLabel={`The chain of five things as find tidies it up. The parent list is now ${frame.parent.join(', ')}.`}
      />
      <ParentRow parent={frame.parent} hot={frame.hot} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: BLUE }} /> where we are</li>
        <li><span className="swatch" style={{ background: YELLOW }} /> the grandparent it now points at</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the root</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={FLAT_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ which root goes under which

const SIZE_FRAMES = [
  {
    parent: [0, 0, 1, 3],
    size: [3, 1, 1, 1],
    states: {},
    caption: 'Join a group of three (a small chain) with a thing that is alone. One root has to go under the other. Does it matter which?',
  },
  {
    parent: [3, 0, 1, 3],
    size: [1, 1, 1, 4],
    states: { n0: 'bad' },
    caption: 'Big group under the lone one: all three things of the big group are now one hop further from the root. The tree is 3 hops tall.',
  },
  {
    parent: [0, 0, 1, 0],
    size: [4, 1, 1, 1],
    states: { n3: 'found' },
    caption: 'Lone one under the big group: only that one thing is a hop further. The tree is still 2 hops tall. So the smaller group always goes under the bigger one.',
  },
]

// The same two groups joined both ways.
function SizeVisual() {
  const [tick, setTick] = useLoop(SIZE_FRAMES.length, 5200)
  const frame = SIZE_FRAMES[tick]

  return (
    <div className="visual-card">
      <TreeView
        className="trie-view"
        tree={forestSnapshot(frame.parent, { size: frame.size, rows: 4 })}
        states={frame.states}
        ariaLabel={`Two groups joined. The parent list is ${frame.parent.join(', ')} and the tallest path to a root is ${heightOf(frame.parent)} hops.`}
      />
      <ParentRow parent={frame.parent} />
      <ul className="visual-legend">
        <li><span className="swatch" style={{ background: RED }} /> a root that was put underneath</li>
        <li><span className="swatch" style={{ background: GREEN }} /> the small group, put underneath</li>
        <li>the small label under a root is the size of its group</li>
      </ul>
      <p className="visual-caption" aria-live="polite">{frame.caption}</p>
      <StepDots count={SIZE_FRAMES.length} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const COUNT = 1000000

// Hops for one find in a million things. The bars are on a log scale, because
// the answers are a million apart.
function WorkVisual() {
  const rows = [
    { label: 'No tricks, worst case (a long chain): up to 1,000,000 hops', value: COUNT, color: YELLOW, stroke: '#b8912a' },
    { label: 'Smaller group goes under the bigger: at most about 20 hops', value: 20, color: GREEN, stroke: '#237a35' },
    { label: 'And find shortens the path: about 1 to 4 hops', value: 4, color: GREEN, stroke: '#237a35' },
  ]
  const x0 = 6
  const span = 320
  const at = (v) => x0 + (Math.log10(v) / 6) * span
  const ticks = [1, 100, 10000, 1000000]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 190"
        role="img"
        aria-label="For a million things, one find can take up to a million hops with no tricks, about 20 with the smaller group under the bigger, and only a few more than one once find also shortens the path. The bars are on a log scale."
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={at(t)} x2={at(t)} y1="4" y2="150" stroke="var(--border)" strokeWidth="1" />
            <text x={at(t)} y="166" fontSize="10" textAnchor={t === 1 ? 'start' : t === COUNT ? 'end' : 'middle'} fill="var(--text)">{t.toLocaleString('en-US')}</text>
          </g>
        ))}
        {rows.map(({ label, value, color, stroke }, i) => {
          const y = 6 + i * 48
          return (
            <g key={label}>
              <text x={x0} y={y + 12} fontSize="10.5" fill="var(--text-h)">{label}</text>
              <rect x={x0} y={y + 18} width={Math.max(at(value) - x0, 4)} height="16" rx="3" fill={color} stroke={stroke} strokeWidth="0.8" />
            </g>
          )
        })}
      </svg>
      <ul className="visual-legend">
        <li>each step to the right is ×100: the bars are on a <em>log scale</em>, so the short bars are really tiny.</li>
      </ul>
    </div>
  )
}

export { GroupsVisual, FindVisual, FlattenVisual, SizeVisual, WorkVisual }
