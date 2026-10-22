import TreeView from '../../components/TreeView.jsx'
import { StepDots, useLoop } from './loopHooks.jsx'

const BLUE = '#8aa8ea'
const YELLOW = '#ffe27a'
const GREEN = '#86d69f'
const RED = '#f2a5a5'
const GREY = '#e4e4e2'
const GROUPS = ['#bcd2f7', '#fbd0a5', '#e1c7f2', '#bfe8e0']

// A row of numbered cells. `marks` colours a cell, `dim` fades the ones listed.
function Cells({ label, values, marks = {}, dim = [], ariaLabel }) {
  return (
    <div className="cell-row" role="img" aria-label={ariaLabel ?? `${label ?? 'List'}: ${values.join(', ')}.`}>
      {label && <code className="cell-name">{label}</code>}
      {values.map((value, i) => (
        <span key={i} style={{ background: marks[i], opacity: dim.includes(i) ? 0.4 : 1 }}>
          {value}
          <i>{i}</i>
        </span>
      ))}
    </div>
  )
}

const Legend = ({ items }) => (
  <ul className="visual-legend">
    {items.map(([color, text]) => (
      <li key={text}>{color ? <span className="swatch" style={{ background: color }} /> : null} {text}</li>
    ))}
  </ul>
)

// The frame dots and caption that every loop ends with. Every caption is laid
// out in the same spot, invisibly, so the card is as tall as the longest one
// and the page does not move when the caption changes.
function Footer({ captions, tick, onPick }) {
  return (
    <>
      <div style={{ display: 'grid' }}>
        {captions.map((text, i) => (
          <p key={i} className="visual-caption" aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{text}</p>
        ))}
        <p className="visual-caption" aria-live="polite" style={{ gridArea: '1 / 1' }}>{captions[tick]}</p>
      </div>
      <StepDots count={captions.length} tick={tick} onPick={onPick} />
    </>
  )
}

// Several things that take turns in the same place. All of them are laid out
// on top of each other, so the space is as big as the biggest one.
function Swap({ index, children }) {
  return (
    <div style={{ display: 'grid' }}>
      {children.map((child, i) => (
        <div key={i} aria-hidden={i === index ? undefined : 'true'} style={{ gridArea: '1 / 1', alignSelf: 'center', visibility: i === index ? 'visible' : 'hidden' }}>
          {child}
        </div>
      ))}
    </div>
  )
}

const panelTitle = { margin: '10px 0 2px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)' }
const panelLine = { margin: '4px 0 0', textAlign: 'center', fontSize: 14, color: 'var(--text-h)' }

// ------------------------------------------------ two numbers that add up

const PAIR = [1, 3, 4, 6, 8, 11, 15]
const TARGET = 14

const BRUTE = (() => {
  const out = []
  for (let i = 0; i < PAIR.length; i++) for (let j = i + 1; j < PAIR.length; j++) out.push([i, j])
  return out
})()
const BRUTE_FOUND = BRUTE.findIndex(([i, j]) => PAIR[i] + PAIR[j] === TARGET) + 1 // 10

const POINTERS = (() => {
  const out = []
  let [left, right] = [0, PAIR.length - 1]
  while (left < right) {
    const sum = PAIR[left] + PAIR[right]
    out.push([left, right])
    if (sum === TARGET) break
    if (sum < TARGET) left++
    else right--
  }
  return out
})()

const PAIR_FRAMES = [
  { b: 0, t: 0, caption: `Find two numbers in this sorted list that add up to ${TARGET}. There are two ways to do it, and they are very different in cost.` },
  { b: 1, t: 1, caption: 'Check 1. Brute force starts with the first pair, 1 + 3. Two pointers start at the two ends: 1 + 15 = 16 is too big, and 15 is too big with anything, so drop 15.' },
  { b: 2, t: 2, caption: 'Check 2. Brute force: 1 + 4. Two pointers: 1 + 11 = 12 is too small, and 1 is too small with anything left, so drop 1.' },
  { b: 3, t: 3, caption: `Check 3. Two pointers: 3 + 11 = ${TARGET}. Found, after 3 checks. Brute force is still on 1 + 6.` },
  { b: BRUTE_FOUND, t: 3, caption: `Brute force needs ${BRUTE_FOUND} checks to find the same pair.` },
  { b: BRUTE_FOUND, t: 3, caption: 'Both are correct. With 7 numbers it is 3 checks against 10. With a million sorted numbers, brute force can need about 500 billion checks, and two pointers at most a million.' },
]

function PairPanel({ title, pair, sum, found, checks, dim = [] }) {
  const marks = {}
  if (pair) pair.forEach((i) => { marks[i] = found ? GREEN : BLUE })
  return (
    <>
      <p style={panelTitle}>{title}</p>
      <Cells values={PAIR} marks={marks} dim={dim} ariaLabel={`The list ${PAIR.join(', ')}${pair ? `, comparing ${PAIR[pair[0]]} and ${PAIR[pair[1]]}` : ''}.`} />
      <p style={panelLine}>{pair ? `${PAIR[pair[0]]} + ${PAIR[pair[1]]} = ${sum}${found ? ' ✓' : ''}` : ' '} · checks so far: <strong>{checks}</strong></p>
    </>
  )
}

// The same question answered by brute force and by two pointers.
function PairVisual() {
  const [tick, setTick] = useLoop(PAIR_FRAMES.length, 5200)
  const { b, t } = PAIR_FRAMES[tick]
  const bp = b > 0 ? BRUTE[b - 1] : null
  const tp = t > 0 ? POINTERS[t - 1] : null
  const lastOne = tp && t === POINTERS.length
  const dimTwo = tp ? PAIR.map((_, i) => i).filter((i) => i < tp[0] || i > tp[1]) : []

  return (
    <div className="visual-card">
      <PairPanel title="Brute force: try every pair" pair={bp} sum={bp ? PAIR[bp[0]] + PAIR[bp[1]] : 0} found={b === BRUTE_FOUND} checks={b} />
      <PairPanel title="Two pointers: one at each end" pair={tp} sum={tp ? PAIR[tp[0]] + PAIR[tp[1]] : 0} found={lastOne} checks={t} dim={lastOne ? [] : dimTwo} />
      <Legend items={[[BLUE, 'the two numbers being added'], [GREEN, 'the pair that works'], [null, 'faded: ruled out for good']]} />
      <Footer captions={PAIR_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ sliding window

const WINDOW = [2, 1, 5, 1, 3, 2, 9, 1, 4]
const K = 3

const WINDOW_FRAMES = (() => {
  const frames = [{ start: null, caption: `The biggest sum of ${K} numbers in a row. The slow way adds ${K} numbers for every start. A sliding window keeps the sum and adjusts it.` }]
  let sum = WINDOW.slice(0, K).reduce((a, b) => a + b, 0)
  let best = sum
  let bestStart = 0
  frames.push({ start: 0, sum, best, bestStart, caption: `Add the first ${K}: ${WINDOW.slice(0, K).join(' + ')} = ${sum}. That is the best so far.` })
  for (let right = K; right < WINDOW.length; right++) {
    const before = sum
    sum += WINDOW[right] - WINDOW[right - K]
    const improved = sum > best
    if (improved) [best, bestStart] = [sum, right - K + 1]
    frames.push({
      start: right - K + 1,
      sum,
      best,
      bestStart,
      improved,
      caption: `Slide right: add the new number, ${WINDOW[right]}, and drop the one that left, ${WINDOW[right - K]}. ${before} + ${WINDOW[right]} − ${WINDOW[right - K]} = ${sum}.${improved ? ' A new best!' : ''}`,
    })
  }
  frames.push({ start: bestStart, sum: best, best, bestStart, final: true, caption: `Done: the best sum is ${best}, from positions ${bestStart} to ${bestStart + K - 1}. Each slide cost one addition and one subtraction, however big ${K} is.` })
  return frames
})()

// A window of 3 sliding along a list, keeping its sum.
function WindowVisual() {
  const [tick, setTick] = useLoop(WINDOW_FRAMES.length, 3800)
  const frame = WINDOW_FRAMES[tick]
  const marks = {}
  if (frame.start !== null) {
    for (let i = frame.start; i < frame.start + K; i++) marks[i] = frame.final || frame.improved ? GREEN : BLUE
  }

  return (
    <div className="visual-card">
      <Cells label="nums" values={WINDOW} marks={marks} />
      <p style={panelLine}>
        {frame.start === null ? ' ' : <>window sum: <strong>{frame.sum}</strong> · best so far: <strong>{frame.best}</strong></>}
      </p>
      <Legend items={[[BLUE, 'the window'], [GREEN, 'a new best window']]} />
      <Footer captions={WINDOW_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ fast and slow pointers

const LIST = ['A', 'B', 'C', 'D', 'E', 'F']
const LOOP_TO = 2 // F points back at C
const nextOf = (i) => (i === LIST.length - 1 ? LOOP_TO : i + 1)

const CHASE = (() => {
  const steps = [[0, 0]]
  let [slow, fast] = [0, 0]
  for (;;) {
    slow = nextOf(slow)
    fast = nextOf(nextOf(fast))
    steps.push([slow, fast])
    if (slow === fast) break
  }
  return steps
})()

const CHASE_FRAMES = [
  { at: null, caption: 'A linked list whose last node, F, points back to C: a loop. A plain walk along it would never end. How can code tell, without remembering every node it has seen?' },
  { at: 0, caption: 'Send two pointers from the head. The slow one moves 1 step at a time. The fast one moves 2.' },
  ...CHASE.slice(1).map(([slow, fast], k) => ({
    at: k + 1,
    caption: slow === fast
      ? `Slow is on ${LIST[slow]}, and so is fast. They met, so there is a loop. The fast pointer went round the loop and caught up with the slow one from behind.`
      : `Step ${k + 1}: slow moves to ${LIST[slow]}, fast moves to ${LIST[fast]}.${k === 1 ? ' Both are inside the loop now, and fast gains one node on slow with every step.' : ''}`,
  })),
  { at: CHASE.length - 1, final: true, caption: 'If the list had no loop, the fast pointer would reach the end (None) first. Meeting means a loop, and the whole check needs only two pointers: O(n) time, O(1) memory.' },
]

// Two pointers at different speeds chasing round a loop.
function ChaseVisual() {
  const [tick, setTick] = useLoop(CHASE_FRAMES.length, 4200)
  const frame = CHASE_FRAMES[tick]
  const [slow, fast] = frame.at === null ? [null, null] : CHASE[frame.at]
  const x = (i) => 34 + i * 54
  const y = 52
  const met = slow !== null && slow === fast

  return (
    <div className="visual-card">
      <svg viewBox="0 0 350 135" style={{ maxWidth: 440, margin: '0 auto' }} role="img" aria-label={`A linked list A to F where F points back to C.${slow !== null ? ` The slow pointer is on ${LIST[slow]} and the fast pointer is on ${LIST[fast]}.` : ''}`}>
        {LIST.slice(0, -1).map((_, i) => (
          <g key={i}>
            <line x1={x(i) + 16} y1={y} x2={x(i + 1) - 17} y2={y} stroke="#9a9a97" strokeWidth="1.6" />
            <polygon points={`${x(i + 1) - 16},${y} ${x(i + 1) - 23},${y - 4} ${x(i + 1) - 23},${y + 4}`} fill="#9a9a97" />
          </g>
        ))}
        <path d={`M${x(5)},${y + 17} C${x(5)},${y + 70} ${x(LOOP_TO)},${y + 70} ${x(LOOP_TO)},${y + 21}`} fill="none" stroke="#9a9a97" strokeWidth="1.6" />
        <polygon points={`${x(LOOP_TO)},${y + 17} ${x(LOOP_TO) - 4},${y + 25} ${x(LOOP_TO) + 4},${y + 25}`} fill="#9a9a97" />
        {LIST.map((name, i) => (
          <g key={name}>
            <circle cx={x(i)} cy={y} r="16" fill={met && i === slow ? GREEN : 'var(--bg)'} stroke="#9a9a97" strokeWidth="1.5" />
            <text x={x(i)} y={y + 5} fontSize="14" fontWeight="700" textAnchor="middle" fill="var(--text-h)">{name}</text>
          </g>
        ))}
        {slow !== null && slow === fast && (
          <text x={x(slow)} y={y - 24} fontSize="12" fontWeight="700" textAnchor="middle" fill="#237a35">slow + fast</text>
        )}
        {slow !== null && slow !== fast && (
          <>
            <text x={x(slow)} y={y - 24} fontSize="12" fontWeight="700" textAnchor="middle" fill="#2d4f9e">slow</text>
            <text x={x(fast)} y={y - 24} fontSize="12" fontWeight="700" textAnchor="middle" fill="#b8620a">fast</text>
          </>
        )}
      </svg>
      <Legend items={[[null, 'slow: 1 step at a time · fast: 2 steps'], [GREEN, 'where they met']]} />
      <Footer captions={CHASE_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ greedy

const COINS = [1, 3, 4]
const AMOUNT = 6
const GREEDY = [4, 1, 1]
const BEST = [3, 3]
const UNIT = 44

const COIN_FRAMES = [
  { greedy: 0, caption: `Make ${AMOUNT} with as few coins as possible. The coins are ${COINS.join(', ')}. The greedy rule: always take the biggest coin that still fits.` },
  { greedy: 1, caption: 'Biggest coin that fits in 6: 4. Take it. 2 is left.' },
  { greedy: 2, caption: 'Biggest coin that fits in 2: 1. Take it. 1 is left.' },
  { greedy: 3, caption: 'Take another 1. Nothing is left: 3 coins, 4 + 1 + 1.' },
  { greedy: 3, best: true, caption: 'But 3 + 3 does it with 2 coins. The greedy choice, grabbing the 4 first, felt best at the time and left a worse problem behind. It never looked back to fix it.' },
  { greedy: 3, best: true, caption: 'Greedy is very fast, but it is only right when you can argue why. For the coins 25, 10, 5 and 1 it always works. For 1, 3 and 4 it does not. Test it on small cases before you trust it.' },
]

function CoinBar({ coins, label, color }) {
  const starts = coins.map((_, k) => coins.slice(0, k).reduce((a, b) => a + b, 0))
  return (
    <>
      <p style={panelTitle}>{label}</p>
      <svg viewBox={`0 0 ${AMOUNT * UNIT + 12} 56`} style={{ maxWidth: AMOUNT * UNIT + 12, margin: '0 auto' }} role="img" aria-label={`${label}: ${coins.length ? coins.join(' + ') : 'no coins yet'}.`}>
        <rect x="4" y="8" width={AMOUNT * UNIT} height="40" rx="6" fill="none" stroke="var(--border)" strokeDasharray="4 3" />
        {coins.map((coin, k) => {
          const x = 4 + starts[k] * UNIT
          return (
            <g key={k}>
              <rect x={x + 1} y="9" width={coin * UNIT - 2} height="38" rx="5" fill={color} stroke="#1f2023" strokeWidth="0.6" strokeOpacity="0.4" />
              <text x={x + (coin * UNIT) / 2} y="34" fontSize="16" fontWeight="700" textAnchor="middle" fill="#1f2023">{coin}</text>
            </g>
          )
        })}
      </svg>
    </>
  )
}

// Greedy coin change on coins that make it go wrong.
function CoinsVisual() {
  const [tick, setTick] = useLoop(COIN_FRAMES.length, 5200)
  const frame = COIN_FRAMES[tick]

  return (
    <div className="visual-card">
      <CoinBar label={`Greedy: biggest coin first${frame.greedy === 3 ? ` (${GREEDY.length} coins)` : ''}`} coins={GREEDY.slice(0, frame.greedy)} color={YELLOW} />
      <Swap index={frame.best ? 1 : 0}>
        {[<CoinBar key="none" label={' '} coins={[]} color={GREEN} />, <CoinBar key="best" label={`The best answer (${BEST.length} coins)`} coins={BEST} color={GREEN} />]}
      </Swap>
      <Footer captions={COIN_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ backtracking

const N = 4
const attacked = (queens) => {
  const set = new Set()
  queens.forEach(([qr, qc]) => {
    for (let r = qr + 1; r < N; r++) {
      const d = r - qr
      ;[qc, qc - d, qc + d].forEach((c) => {
        if (c >= 0 && c < N) set.add(`${r},${c}`)
      })
    }
  })
  return set
}

const QUEEN_FRAMES = [
  { queens: [], caption: 'Put 4 queens on a 4 by 4 board so that no two attack each other: no two in a column or on a diagonal, one in each row. Try a queen in each row in turn, and when a row has no safe square, undo the last choice.' },
  { queens: [[0, 0]], caption: 'Row 0: try the first column. The shaded squares are now attacked.' },
  { queens: [[0, 0], [1, 2]], caption: 'Row 1: columns 0 and 1 are attacked. Column 2 is the first safe square, so try it.' },
  { queens: [[0, 0], [1, 2]], dead: true, caption: 'Row 2: every square is attacked. Dead end! There is no point going on from here.' },
  { queens: [[0, 0]], undo: true, caption: 'Backtrack: take the queen in row 1 back, and try the next column for it.' },
  { queens: [[0, 0], [1, 3], [2, 1]], caption: 'Row 1, column 3 works. Row 2: column 1 is the first safe square.' },
  { queens: [[0, 0], [1, 3], [2, 1]], dead: true, caption: 'Row 3: every square is attacked. Dead end again, and row 2 has nothing else to try. Back up past row 1: it has no columns left either, so the very first queen was a bad start.' },
  { queens: [[0, 1]], undo: true, caption: 'Back at row 0: move the first queen to column 1, and start again.' },
  { queens: [[0, 1], [1, 3], [2, 0], [3, 2]], solved: true, caption: 'Every row now has a queen, and none attack each other: [1, 3, 0, 2].' },
  { queens: [[0, 1], [1, 3], [2, 0], [3, 2]], solved: true, caption: 'Only 8 queens were ever placed. Brute force would check all 4 × 4 × 4 × 4 = 256 boards. Dead ends are abandoned early, and that is the whole saving.' },
]

// Four queens, with dead ends and undoing.
function QueensVisual() {
  const [tick, setTick] = useLoop(QUEEN_FRAMES.length, 4600)
  const frame = QUEEN_FRAMES[tick]
  const shade = attacked(frame.queens)
  const cell = 52
  const nextRow = frame.queens.length
  const has = (r, c) => frame.queens.some(([qr, qc]) => qr === r && qc === c)

  return (
    <div className="visual-card">
      <svg viewBox={`0 0 ${N * cell + 8} ${N * cell + 8}`} style={{ maxWidth: 260, margin: '0 auto' }} role="img" aria-label={`A ${N} by ${N} board with queens at ${frame.queens.map(([r, c]) => `row ${r} column ${c}`).join(', ') || 'none yet'}.${frame.dead ? ` Row ${nextRow} has no safe square.` : ''}`}>
        {Array.from({ length: N * N }, (_, k) => {
          const [r, c] = [Math.floor(k / N), k % N]
          const light = (r + c) % 2 === 0
          const deadRow = frame.dead && r === nextRow
          return (
            <g key={k}>
              <rect x={4 + c * cell} y={4 + r * cell} width={cell} height={cell} fill={deadRow ? RED : shade.has(`${r},${c}`) ? '#c9c9c6' : light ? 'var(--bg)' : '#ececea'} stroke="var(--border)" />
              {has(r, c) && <text x={4 + c * cell + cell / 2} y={4 + r * cell + cell / 2 + 12} fontSize="34" textAnchor="middle" fill={frame.solved ? '#237a35' : '#1f2023'}>♛︎</text>}
            </g>
          )
        })}
      </svg>
      <Legend items={[['#c9c9c6', 'attacked by a queen above'], [RED, 'a row with no safe square']]} />
      <Footer captions={QUEEN_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ dynamic programming

// A call tree of fib(n): each node is one call. With `memo`, a call whose
// answer is already known is a leaf and does no more work.
function callTree(n, memo = false) {
  let counter = 0
  const known = new Set()
  const build = (value) => {
    const node = { id: `c${counter++}`, value, kids: [], hit: false }
    if (memo && known.has(value)) {
      node.hit = true
      return node
    }
    known.add(value)
    if (value >= 2) node.kids = [build(value - 1), build(value - 2)]
    return node
  }
  return build(n)
}

const nodesOf = (node) => [node, ...node.kids.flatMap(nodesOf)]

function layoutCalls(root, { width = 360, top = 22, gap = 44, margin = 20 } = {}) {
  const slot = {}
  const depth = {}
  let leaves = 0
  let deepest = 0
  const place = (node, d) => {
    deepest = Math.max(deepest, d)
    depth[node.id] = d
    if (node.kids.length === 0) slot[node.id] = leaves++
    else {
      node.kids.forEach((k) => place(k, d + 1))
      slot[node.id] = (slot[node.kids[0].id] + slot[node.kids[node.kids.length - 1].id]) / 2
    }
  }
  place(root, 0)
  const step = leaves > 1 ? (width - 2 * margin) / (leaves - 1) : 0
  const nodes = []
  const edges = []
  const walk = (node) => {
    nodes.push({ id: node.id, label: String(node.value), x: margin + slot[node.id] * step, y: top + depth[node.id] * gap })
    node.kids.forEach((k) => {
      edges.push([node.id, k.id])
      walk(k)
    })
  }
  walk(root)
  return { width, height: top + 4 * gap + 26, nodes, edges }
}

const FIB_N = 5
const FIB_NAIVE = callTree(FIB_N)
const FIB_MEMO = callTree(FIB_N, true)
const NAIVE_NODES = nodesOf(FIB_NAIVE)
const MEMO_NODES = nodesOf(FIB_MEMO)
const NAIVE_VIEW = layoutCalls(FIB_NAIVE)
const MEMO_VIEW = layoutCalls(FIB_MEMO)
const DISTINCT = new Set(NAIVE_NODES.map((node) => node.value)).size // 6
const TABLE = [0, 1, 1, 2, 3, 5]

const repeatStates = (() => {
  const seen = new Set()
  const states = {}
  NAIVE_NODES.forEach((node) => {
    states[node.id] = seen.has(node.value) ? 'bad' : 'found'
    seen.add(node.value)
  })
  return states
})()

const FIB_FRAMES = [
  { view: NAIVE_VIEW, caption: `Every circle is a call to fib(n). fib(${FIB_N}) = fib(4) + fib(3), and each of those calls two more. ${NAIVE_NODES.length} calls for a small ${FIB_N}.` },
  { view: NAIVE_VIEW, states: repeatStates, caption: `Only ${DISTINCT} different questions are ever asked (fib 0 to ${FIB_N}), but ${NAIVE_NODES.length} calls are made: the ${NAIVE_NODES.length - DISTINCT} red ones repeat work that was already done. For fib(40) that is 331 million calls.` },
  { view: MEMO_VIEW, states: Object.fromEntries(MEMO_NODES.filter((node) => node.hit).map((node) => [node.id, 'checked'])), caption: `Write each answer down the first time (memoisation). A grey call finds its answer already written and stops at once: ${MEMO_NODES.length} calls instead of ${NAIVE_NODES.length}, and for fib(40) only about 80.` },
  { table: true, caption: 'Or go bottom up: fill a list from the left, each cell from the two before it. No recursion, no repeats, and just n steps.' },
]

// The call tree of fib(5), its repeats, and the cure.
function FibVisual() {
  const [tick, setTick] = useLoop(FIB_FRAMES.length, 5600)
  const frame = FIB_FRAMES[tick]

  return (
    <div className="visual-card">
      <Swap index={frame.table ? 1 : 0}>
        {[
          <TreeView key="tree" className="trie-view" tree={frame.view ?? MEMO_VIEW} states={frame.states} r={12} ariaLabel={`The calls made by fib(${FIB_N}).`} />,
          <Cells key="table" label="fib" values={TABLE} marks={Object.fromEntries(TABLE.map((_, i) => [i, GREEN]))} />,
        ]}
      </Swap>
      <Swap index={frame.table ? 2 : frame.states ? 1 : 0}>
        {[
          <Legend key="a" items={[[null, 'each circle is one call, with its n inside']]} />,
          <Legend key="b" items={[[GREEN, 'first time this question is asked'], [RED, 'asked before: repeated work'], [GREY, 'answer already known: stop']]} />,
          <Legend key="c" items={[[null, 'each cell is worked out from the two before it']]} />,
        ]}
      </Swap>
      <Footer captions={FIB_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ merging intervals

const INTERVALS = [[1, 3], [2, 6], [8, 10], [15, 18], [17, 20]]

const MERGE_FRAMES = [
  { read: -1, done: [], current: null, caption: 'Five meetings, sorted by their start time. Overlapping meetings should be merged into one.' },
  { read: 0, done: [], current: [1, 3], caption: 'Start with the first meeting as the current one: [1, 3].' },
  { read: 1, done: [], current: [1, 6], caption: '[2, 6] starts at 2, which is before the current one ends (3): they overlap. Stretch the current one to end at max(3, 6) = 6.' },
  { read: 2, done: [[1, 6]], current: [8, 10], caption: '[8, 10] starts at 8, after the current one ended (6): no overlap. [1, 6] is finished, and [8, 10] becomes the current one.' },
  { read: 3, done: [[1, 6], [8, 10]], current: [15, 18], caption: '[15, 18] starts after 10, so it starts a new one.' },
  { read: 4, done: [[1, 6], [8, 10]], current: [15, 20], caption: '[17, 20] starts at 17, before 18: overlap, so stretch to 20.' },
  { read: -1, done: [[1, 6], [8, 10], [15, 20]], current: null, caption: 'One pass after sorting: [1, 6], [8, 10], [15, 20].' },
]

// Meetings on a timeline, merged one by one.
function MergeVisual() {
  const [tick, setTick] = useLoop(MERGE_FRAMES.length, 4600)
  const frame = MERGE_FRAMES[tick]
  const x = (v) => 24 + v * 15
  const rowH = 20
  const top = 16
  const resultY = top + INTERVALS.length * rowH + 22
  const bar = (from, to, y, fill, stroke = '#1f2023') => (
    <rect key={`${from}-${to}-${y}`} x={x(from)} y={y} width={x(to) - x(from)} height="14" rx="3" fill={fill} stroke={stroke} strokeWidth="0.6" strokeOpacity="0.5" />
  )

  return (
    <div className="visual-card">
      <svg viewBox="0 0 350 200" style={{ maxWidth: 470, margin: '0 auto' }} role="img" aria-label={`Meetings ${INTERVALS.map(([a, b]) => `${a} to ${b}`).join(', ')}, merged so far into ${[...frame.done, ...(frame.current ? [frame.current] : [])].map(([a, b]) => `${a} to ${b}`).join(', ') || 'nothing'}.`}>
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={top - 6} y2={resultY + 24} stroke="var(--border)" strokeWidth="1" />
            <text x={x(v)} y={resultY + 38} fontSize="10" textAnchor="middle" fill="var(--text)">{v}</text>
          </g>
        ))}
        {INTERVALS.map(([a, b], k) => bar(a, b, top + k * rowH, k === frame.read ? BLUE : k < frame.read ? GREY : 'var(--bg)', k === frame.read ? '#2d4f9e' : '#1f2023'))}
        <text x="4" y={resultY - 4} fontSize="10" fontWeight="700" fill="var(--text)">MERGED</text>
        {frame.done.map(([a, b]) => bar(a, b, resultY, GREEN))}
        {frame.current && bar(frame.current[0], frame.current[1], resultY, YELLOW)}
      </svg>
      <Legend items={[[BLUE, 'the meeting being read'], [YELLOW, 'the merged meeting still growing'], [GREEN, 'a finished merged meeting']]} />
      <Footer captions={MERGE_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ islands in a grid

const GRID = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0],
]

// Flood fill, in the order the scan meets the islands.
const ISLANDS = (() => {
  const seen = new Set()
  const out = []
  GRID.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell !== 1 || seen.has(`${r},${c}`)) return
      const cells = []
      const queue = [[r, c]]
      seen.add(`${r},${c}`)
      while (queue.length) {
        const [x, y] = queue.shift()
        cells.push([x, y])
        ;[[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([nx, ny]) => {
          if (GRID[nx]?.[ny] === 1 && !seen.has(`${nx},${ny}`)) {
            seen.add(`${nx},${ny}`)
            queue.push([nx, ny])
          }
        })
      }
      out.push({ start: [r, c], cells })
    }),
  )
  return out
})()

const ISLAND_FRAMES = [
  { found: 0, caption: 'Count the islands: groups of land (1) joined up, down, left or right. Scan the grid cell by cell.' },
  ...ISLANDS.flatMap((island, k) => [
    { found: k, look: island.start, caption: `Next land cell not yet seen: row ${island.start[0]}, column ${island.start[1]}. A new island! Count it, then flood fill from here.` },
    { found: k + 1, caption: `Flood fill (BFS) visits every land cell joined to it: ${island.cells.length} ${island.cells.length === 1 ? 'cell' : 'cells'}. They are marked, so none will be counted again. Islands so far: ${k + 1}.` },
  ]),
  { found: ISLANDS.length, caption: `${ISLANDS.length} islands. Every cell is looked at a few times at most, so the whole job is O(rows × columns).` },
]

// Counting islands with a scan and a flood fill.
function IslandsVisual() {
  const [tick, setTick] = useLoop(ISLAND_FRAMES.length, 4600)
  const frame = ISLAND_FRAMES[tick]
  const colour = {}
  ISLANDS.slice(0, frame.found).forEach((island, k) => island.cells.forEach(([r, c]) => { colour[`${r},${c}`] = GROUPS[k % GROUPS.length] }))

  return (
    <div className="visual-card">
      <div role="img" aria-label={`A grid of land and water with ${frame.found} of its ${ISLANDS.length} islands found so far.`} style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID[0].length}, 44px)`, gap: 3, justifyContent: 'center' }}>
        {GRID.flatMap((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`
            const looking = frame.look && frame.look[0] === r && frame.look[1] === c
            return (
              <span
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 38,
                  borderRadius: 5,
                  border: `1.5px solid ${looking ? '#2d4f9e' : 'var(--border)'}`,
                  background: looking ? BLUE : cell === 0 ? 'var(--bg)' : colour[key] ?? YELLOW,
                  color: cell === 0 ? 'var(--text)' : '#1f2023',
                  fontWeight: 700,
                  fontSize: 14,
                  transition: 'background 0.3s ease',
                }}
              >
                {cell === 0 ? '·' : '1'}
              </span>
            )
          }),
        )}
      </div>
      <Legend items={[[YELLOW, 'land not yet seen'], [BLUE, 'the cell the scan has just reached'], [GROUPS[0], 'a counted island (each island gets its own colour)']]} />
      <Footer captions={ISLAND_FRAMES.map((f) => f.caption)} tick={tick} onPick={setTick} />
    </div>
  )
}

// ------------------------------------------------ cost

const pairs = (n) => (n * (n - 1)) / 2
const ROWS = [
  { label: 'Pair sum, 100,000 numbers: try every pair', value: pairs(100000), slow: true },
  { label: 'Two pointers', value: 100000 },
  { label: 'fib(40), plain recursion: calls', value: 331160281, slow: true },
  { label: 'fib(40), remembering answers', value: 79 },
  { label: 'Best 1,000 in a row, 1,000,000 numbers: add each window', value: 1000 * (1000000 - 999), slow: true },
  { label: 'Sliding window', value: 1000000 },
]

// Steps with and without the technique. The bars are on a log scale, because
// the answers are far apart.
function WorkVisual() {
  const x0 = 6
  const span = 320
  const at = (v) => x0 + (Math.log10(v) / 10) * span
  const ticks = [1, 100, 10000, 1000000, 100000000, 10000000000]

  return (
    <div className="visual-card">
      <svg
        viewBox="0 0 340 330"
        role="img"
        aria-label="Steps taken without and with a technique. Pair sum over 100,000 numbers: about 5 billion for every pair, 100,000 with two pointers. fib(40): 331 million calls, against about 80 when answers are remembered. Best window sum over a million numbers: about a billion additions against a million. The bars are on a log scale."
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={at(t)} x2={at(t)} y1="4" y2="284" stroke="var(--border)" strokeWidth="1" />
            <text x={at(t)} y="300" fontSize="9.5" textAnchor={t === 1 ? 'start' : t === 10000000000 ? 'end' : 'middle'} fill="var(--text)">{({ 1: '1', 100: '100', 10000: '10 K', 1000000: '1 M', 100000000: '100 M', 10000000000: '10 B' })[t]}</text>
          </g>
        ))}
        {ROWS.map(({ label, value, slow }, i) => {
          const y = 4 + i * 47
          return (
            <g key={label}>
              <text x={x0} y={y + 11} fontSize="10.5" fill="var(--text-h)">{label}</text>
              <rect x={x0} y={y + 16} width={Math.max(at(value) - x0, 4)} height="15" rx="3" fill={slow ? YELLOW : GREEN} stroke={slow ? '#b8912a' : '#237a35'} strokeWidth="0.8" />
              <text x={x0 + 6} y={y + 27.5} fontSize="10" fontWeight="700" fill="#1f2023">{value.toLocaleString('en-US')}</text>
            </g>
          )
        })}
      </svg>
      <Legend items={[[YELLOW, 'the plain way'], [GREEN, 'with the technique']]} />
      <ul className="visual-legend">
        <li>each step to the right is ×100: the bars are on a <em>log scale</em>, so the short bars are really tiny.</li>
      </ul>
    </div>
  )
}

export { PairVisual, WindowVisual, ChaseVisual, CoinsVisual, QueensVisual, FibVisual, MergeVisual, IslandsVisual, WorkVisual }
