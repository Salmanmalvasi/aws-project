// ==============================================================================
// IPL Live Analytics - Interactive Simulation Engine
// Real IPL teams, authentic rosters, rigorous cricket rules, and dynamic shot tracking.
// Data Provenance: Simulated Presentation Engine (strictly NO BLUE / CYAN colors)
// ==============================================================================

const MATCH_DATA = {
  'csk_rcb': {
    id: 'csk_rcb',
    title: 'Chennai Super Kings vs Royal Challengers Bengaluru',
    venue: 'MA Chidambaram Stadium, Chepauk, Chennai',
    series: 'TATA IPL • Match 42 • Evening Chase',
    pitchCondition: 'Even bounce, evening dew setting in on outfield',
    batting: { code: 'CSK', name: 'Chennai Super Kings', color: '#eab308' }, // Gold/Yellow
    bowling: { code: 'RCB', name: 'Royal Challengers Bengaluru', color: '#ef4444' }, // Ruby Red
    target: 188,
    firstInnings: '187/6 (20.0 ov)',
    battersList: [
      'Ruturaj Gaikwad (c)',
      'Rachin Ravindra',
      'Ajinkya Rahane',
      'Shivam Dube',
      'Ravindra Jadeja',
      'MS Dhoni (wk)',
      'Moeen Ali',
      'Mitchell Santner',
      'Deepak Chahar',
      'Tushar Deshpande',
      'Matheesha Pathirana'
    ],
    bowlersList: [
      'Mohammed Siraj',
      'Yash Dayal',
      'Glenn Maxwell',
      'Cameron Green',
      'Karn Sharma',
      'Swapnil Singh'
    ],
    initialBatters: [
      { name: 'Ruturaj Gaikwad (c)', runs: 42, balls: 28, fours: 5, sixes: 1, out: true, in: true },
      { name: 'Rachin Ravindra', runs: 28, balls: 19, fours: 3, sixes: 1, out: true, in: true },
      { name: 'Ajinkya Rahane', runs: 18, balls: 14, fours: 2, sixes: 0, out: true, in: true },
      { name: 'Shivam Dube', runs: 46, balls: 24, fours: 3, sixes: 4, out: false, in: true },
      { name: 'Ravindra Jadeja', runs: 16, balls: 11, fours: 2, sixes: 0, out: false, in: true }
    ],
    initialOverRuns: [
      { over: 1, runs: 8, wicket: false },
      { over: 2, runs: 11, wicket: false },
      { over: 3, runs: 7, wicket: true },
      { over: 4, runs: 14, wicket: false },
      { over: 5, runs: 9, wicket: false },
      { over: 6, runs: 12, wicket: false },
      { over: 7, runs: 6, wicket: false },
      { over: 8, runs: 16, wicket: false },
      { over: 9, runs: 8, wicket: true },
      { over: 10, runs: 10, wicket: false },
      { over: 11, runs: 13, wicket: false },
      { over: 12, runs: 7, wicket: false },
      { over: 13, runs: 15, wicket: true },
      { over: 14, runs: 11, wicket: false },
      { over: 15, runs: 12, wicket: false }
    ],
    startBalls: 90, // 15.0 overs
    startRuns: 154,
    startWkts: 3,
    strikerIndex: 3, // Dube
    otherIndex: 4    // Jadeja
  },

  'kkr_srh': {
    id: 'kkr_srh',
    title: 'Kolkata Knight Riders vs Sunrisers Hyderabad',
    venue: 'Eden Gardens, Kolkata',
    series: 'TATA IPL • Match 43 • High-Scoring Thriller',
    pitchCondition: 'True bounce, fast outfield with heavy dew',
    batting: { code: 'KKR', name: 'Kolkata Knight Riders', color: '#a855f7' }, // Purple
    bowling: { code: 'SRH', name: 'Sunrisers Hyderabad', color: '#f97316' }, // Sunrise Orange
    target: 204,
    firstInnings: '203/5 (20.0 ov)',
    battersList: [
      'Sunil Narine',
      'Phil Salt (wk)',
      'Venkatesh Iyer',
      'Shreyas Iyer (c)',
      'Rinku Singh',
      'Andre Russell',
      'Ramandeep Singh',
      'Mitchell Starc',
      'Harshit Rana',
      'Varun Chakaravarthy',
      'Vaibhav Arora'
    ],
    bowlersList: [
      'Pat Cummins',
      'Bhuvneshwar Kumar',
      'T. Natarajan',
      'Mayank Markande',
      'Shahbaz Ahmed',
      'Nitish Reddy'
    ],
    initialBatters: [
      { name: 'Sunil Narine', runs: 56, balls: 24, fours: 6, sixes: 4, out: true, in: true },
      { name: 'Phil Salt (wk)', runs: 32, balls: 18, fours: 4, sixes: 1, out: true, in: true },
      { name: 'Venkatesh Iyer', runs: 24, balls: 16, fours: 3, sixes: 0, out: true, in: true },
      { name: 'Shreyas Iyer (c)', runs: 38, balls: 26, fours: 3, sixes: 1, out: false, in: true },
      { name: 'Rinku Singh', runs: 21, balls: 12, fours: 2, sixes: 1, out: false, in: true }
    ],
    initialOverRuns: [
      { over: 1, runs: 14, wicket: false },
      { over: 2, runs: 12, wicket: false },
      { over: 3, runs: 18, wicket: false },
      { over: 4, runs: 9, wicket: true },
      { over: 5, runs: 16, wicket: false },
      { over: 6, runs: 11, wicket: false },
      { over: 7, runs: 8, wicket: false },
      { over: 8, runs: 14, wicket: true },
      { over: 9, runs: 9, wicket: false },
      { over: 10, runs: 12, wicket: false },
      { over: 11, runs: 15, wicket: false },
      { over: 12, runs: 8, wicket: true },
      { over: 13, runs: 13, wicket: false },
      { over: 14, runs: 16, wicket: false }
    ],
    startBalls: 84, // 14.0 overs
    startRuns: 175,
    startWkts: 3,
    strikerIndex: 3,
    otherIndex: 4
  }
};

let currentMatchKey = 'csk_rcb';
let currentScenario = 'climax'; // 'zero' or 'climax'
let S, timer, listeners = new Set(), tickMs = 2500, isPaused = false;

// Authenticated player profiles for deep telemetry analytics
const BATTER_PROFILES = {
  'Ruturaj Gaikwad (c)': { role: 'Captain & Opening Batter', style: 'Right-Hand Bat', phaseSR: { pp: 148, mid: 136, death: 182 }, vsPace: 154, vsSpin: 138, zones: { cover: 36, point: 22, midwicket: 20, straight: 14, fineleg: 8 } },
  'Rachin Ravindra': { role: 'Attacking All-Rounder', style: 'Left-Hand Bat', phaseSR: { pp: 162, mid: 128, death: 170 }, vsPace: 158, vsSpin: 142, zones: { cover: 28, point: 18, midwicket: 34, straight: 12, fineleg: 8 } },
  'Ajinkya Rahane': { role: 'Top-Order Anchor', style: 'Right-Hand Bat', phaseSR: { pp: 135, mid: 124, death: 160 }, vsPace: 138, vsSpin: 130, zones: { cover: 30, point: 24, midwicket: 22, straight: 16, fineleg: 8 } },
  'Shivam Dube': { role: 'Power Finisher & Spin Destroyer', style: 'Left-Hand Bat', phaseSR: { pp: 125, mid: 172, death: 218 }, vsPace: 148, vsSpin: 194, zones: { cover: 22, point: 12, midwicket: 42, straight: 18, fineleg: 6 } },
  'Ravindra Jadeja': { role: 'Finisher & All-Rounder', style: 'Left-Hand Bat', phaseSR: { pp: 118, mid: 126, death: 188 }, vsPace: 152, vsSpin: 134, zones: { cover: 24, point: 16, midwicket: 32, straight: 16, fineleg: 12 } },
  'MS Dhoni (wk)': { role: 'Wicketkeeper & Legendary Finisher', style: 'Right-Hand Bat', phaseSR: { pp: 110, mid: 130, death: 232 }, vsPace: 195, vsSpin: 140, zones: { cover: 18, point: 14, midwicket: 40, straight: 16, fineleg: 12 } },
  'Sunil Narine': { role: 'Pinch Hitter & Mystery Spinner', style: 'Left-Hand Bat', phaseSR: { pp: 184, mid: 142, death: 165 }, vsPace: 168, vsSpin: 172, zones: { cover: 32, point: 14, midwicket: 38, straight: 10, fineleg: 6 } },
  'Phil Salt (wk)': { role: 'Explosive Wicketkeeper Opener', style: 'Right-Hand Bat', phaseSR: { pp: 176, mid: 138, death: 180 }, vsPace: 172, vsSpin: 146, zones: { cover: 34, point: 26, midwicket: 22, straight: 12, fineleg: 6 } },
  'Shreyas Iyer (c)': { role: 'Captain & Middle-Order Anchor', style: 'Right-Hand Bat', phaseSR: { pp: 132, mid: 144, death: 178 }, vsPace: 146, vsSpin: 158, zones: { cover: 30, point: 18, midwicket: 32, straight: 14, fineleg: 6 } },
  'Rinku Singh': { role: 'Specialist Death Overs Finisher', style: 'Left-Hand Bat', phaseSR: { pp: 120, mid: 148, death: 224 }, vsPace: 182, vsSpin: 164, zones: { cover: 24, point: 14, midwicket: 44, straight: 12, fineleg: 6 } },
  'Andre Russell': { role: 'Global Power-Hitting All-Rounder', style: 'Right-Hand Bat', phaseSR: { pp: 130, mid: 185, death: 242 }, vsPace: 205, vsSpin: 178, zones: { cover: 26, point: 16, midwicket: 38, straight: 14, fineleg: 6 } }
};

const BOWLER_PROFILES = {
  'Mohammed Siraj': { style: 'Right-Arm Fast (142+ kph)', avgSpeed: 140.8, topSpeed: 147.4, lengths: { yorker: 22, full: 26, good: 40, short: 12 }, variations: ['Late Inswinger', 'Wobble-seam', 'Bouncer'] },
  'Yash Dayal': { style: 'Left-Arm Fast Medium', avgSpeed: 136.2, topSpeed: 141.6, lengths: { yorker: 25, full: 28, good: 35, short: 12 }, variations: ['Back-of-hand Slower ball', 'Wide Yorker', 'Angle Across'] },
  'Glenn Maxwell': { style: 'Right-Arm Off Break', avgSpeed: 94.5, topSpeed: 102.0, lengths: { yorker: 12, full: 38, good: 42, short: 8 }, variations: ['Flat Quicker ball', 'Top-spinner', 'Drift & Dip'] },
  'Cameron Green': { style: 'Right-Arm Fast Medium', avgSpeed: 138.4, topSpeed: 143.8, lengths: { yorker: 16, full: 24, good: 44, short: 16 }, variations: ['Heavy Ball Bouncer', 'Hard Length Cutter'] },
  'Pat Cummins': { style: 'Right-Arm Fast (Test & T20 Master)', avgSpeed: 141.5, topSpeed: 148.2, lengths: { yorker: 20, full: 24, good: 46, short: 10 }, variations: ['Cross-seam Hard Length', 'Off-cutter', 'Searing Bouncer'] },
  'Bhuvneshwar Kumar': { style: 'Right-Arm Swing Specialist', avgSpeed: 132.8, topSpeed: 138.0, lengths: { yorker: 24, full: 36, good: 34, short: 6 }, variations: ['Classic Inswinger', 'Knuckle Ball', 'Tail-in Yorker'] },
  'T. Natarajan': { style: 'Left-Arm Death-Over Yorker Specialist', avgSpeed: 135.6, topSpeed: 141.2, lengths: { yorker: 42, full: 26, good: 26, short: 6 }, variations: ['Blockhole Pinpoint Yorker', 'Off-cutter', 'Slower Bouncer'] }
};

// Initial shots for the wagon wheel baseline
const SEED_SHOTS = [
  { id: 1, angle: 310, dist: 0.95, runs: 4, label: '4', batter: 'Shivam Dube', zone: 'Cover Drive' },
  { id: 2, angle: 45, dist: 1.08, runs: 6, label: '6', batter: 'Shivam Dube', zone: 'Long-on' },
  { id: 3, angle: 80, dist: 1.05, runs: 6, label: '6', batter: 'Shivam Dube', zone: 'Mid-wicket' },
  { id: 4, angle: 0, dist: 0.96, runs: 4, label: '4', batter: 'Shivam Dube', zone: 'Straight Drive' },
  { id: 5, angle: 265, dist: 0.92, runs: 4, label: '4', batter: 'Shivam Dube', zone: 'Square Cut' },
  { id: 6, angle: 140, dist: 0.65, runs: 1, label: '1', batter: 'Shivam Dube', zone: 'Square Leg' },
  { id: 7, angle: 220, dist: 0.70, runs: 1, label: '1', batter: 'Shivam Dube', zone: 'Third Man' },
  { id: 8, angle: 20, dist: 1.10, runs: 6, label: '6', batter: 'Shivam Dube', zone: 'Long-off' },
  { id: 9, angle: 95, dist: 0.72, runs: 2, label: '2', batter: 'Shivam Dube', zone: 'Deep Mid-wicket' }
];

function buildMatchState(key, scenario = currentScenario) {
  const meta = MATCH_DATA[key];
  const isZero = scenario === 'zero';

  const bowlers = meta.bowlersList.map((name) => ({
    name,
    balls: 0,
    runs: 0,
    wkts: 0,
    dots: 0,
    maidens: 0
  }));

  if (!isZero) {
    meta.initialOverRuns.forEach((o, i) => {
      const b = bowlers[i % bowlers.length];
      b.balls += 6;
      b.runs += o.runs;
      b.dots += Math.max(0, 6 - Math.round(o.runs / 2.2));
      if (o.wicket) b.wkts++;
    });
  }

  const batters = meta.battersList.map((name) => ({
    name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: false,
    in: false
  }));

  if (!isZero) {
    meta.initialBatters.forEach((ib, idx) => {
      Object.assign(batters[idx], ib);
    });
  } else {
    // Both openers start at the crease (0 runs, 0 balls)
    batters[0].in = true;
    batters[1].in = true;
  }

  const state = {
    key,
    meta,
    scenario,
    id: meta.id,
    target: meta.target,
    runs: isZero ? 0 : meta.startRuns,
    wkts: isZero ? 0 : meta.startWkts,
    balls: isZero ? 0 : meta.startBalls,
    striker: isZero ? 0 : meta.strikerIndex,
    other: isZero ? 1 : meta.otherIndex,
    next: isZero ? 2 : Math.max(meta.strikerIndex, meta.otherIndex) + 1,
    batters,
    bowlers,
    overRuns: isZero ? [] : [...meta.initialOverRuns],
    curOver: [],
    shots: isZero ? [] : [...SEED_SHOTS],
    recent: isZero ? [] : [
      { over: '14.6', label: '1', runs: 1, wicket: false, isWide: false },
      { over: '14.5', label: '4', runs: 4, wicket: false, isWide: false },
      { over: '14.4', label: '•', runs: 0, wicket: false, isWide: false },
      { over: '14.3', label: '6', runs: 6, wicket: false, isWide: false },
      { over: '14.2', label: '1', runs: 1, wicket: false, isWide: false },
      { over: '14.1', label: '2', runs: 2, wicket: false, isWide: false }
    ],
    events: isZero ? [
      {
        id: 1,
        type: 'START',
        text: `Match Commenced: ${meta.batting.name} openers ${meta.battersList[0]} and ${meta.battersList[1]} walk out to bat. Target: ${meta.target} runs in 20.0 overs (0/0, 0.0 ov).`,
        over: '0.0',
        ts: new Date().toISOString()
      }
    ] : [
      { id: 1, type: 'FOUR', text: `${batters[meta.strikerIndex].name} drills it through extra cover for a cracking boundary!`, over: '14.5', ts: new Date().toISOString() },
      { id: 2, type: 'SIX', text: `${batters[meta.strikerIndex].name} launches into the night sky over long-on for a 94m MAXIMUM!`, over: '14.3', ts: new Date().toISOString() }
    ],
    evId: isZero ? 1 : 2,
    partnerships: isZero ? [] : [
      { wicket: 1, pair: `${batters[0].name} / ${batters[1].name}`, runs: 58, balls: 32 },
      { wicket: 2, pair: `${batters[0].name} / ${batters[2].name}`, runs: 34, balls: 22 },
      { wicket: 3, pair: `${batters[2].name} / ${batters[3].name}`, runs: 26, balls: 18 }
    ],
    pRuns: isZero ? 0 : 36,
    pBalls: isZero ? 0 : 18,
    wp: [],
    done: false,
    result: ''
  };

  return state;
}

function winProb(s) {
  const left = 120 - s.balls, need = s.target - s.runs;
  if (need <= 0) return 1.0;
  if (s.wkts >= 10 || left <= 0) return 0.0;
  const wicketsFactor = Math.sqrt((10 - s.wkts) / 10);
  const exp = left * 1.55 * wicketsFactor;
  const z = (exp - need) / (Math.sqrt(left) * 1.8 + 1);
  return Math.min(0.99, Math.max(0.01, 1 / (1 + Math.exp(-1.6 * z))));
}

const ov = () => Math.floor(S.balls / 6) + '.' + (S.balls % 6);

function pushEvent(type, text) {
  S.events.unshift({ id: ++S.evId, type, text, over: ov(), ts: new Date().toISOString() });
  S.events = S.events.slice(0, 40);
}

function seedWp() {
  S.wp = [];
  if (!S.overRuns.length) {
    S.wp.push({ ball: 0, p: 0.50 });
    return;
  }
  let cum = 0;
  S.overRuns.forEach((o, i) => {
    cum += o.runs;
    S.wp.push({
      ball: (i + 1) * 6,
      p: winProb({ target: S.target, runs: cum, wkts: o.wicket ? 2 : 1, balls: (i + 1) * 6 })
    });
  });
}

const COMMENTARY = {
  six: [
    "smokes it high and handsome over deep mid-wicket for a massive 96m SIX! 🚀",
    "clears the front leg and dispatches it cleanly into the upper tier! Phenomenal SIX! ⚡",
    "anticipates the slower ball and lofts it effortlessly over extra cover for a MAXIMUM! 🚀",
    "clobbers the short ball way back over square leg into the stands! Tremendous hit! 💥"
  ],
  four: [
    "threads the needle between cover and backward point with surgical precision for FOUR! 🏏",
    "presents a high elbow and caresses a textbook straight drive to the fence for FOUR! 🏏",
    "uses the bowler's pace, opens the blade, and steers it past short third man for FOUR! 🏏",
    "rocks back on the short ball and pulls with authority to the deep mid-wicket fence for FOUR! 🏏"
  ],
  wicket: [
    "is CASTLED! A scorching 144kph yorker shatters the base of the off-stump! What a delivery!",
    "edges behind! Seaming delivery in the corridor of uncertainty, sharp catch with the gloves!",
    "holes out in the deep! Tries to clear long-off, doesn't get enough on it, taken cleanly on the rope!",
    "is trapped LBW! Beaten by sharp nip-backer and struck right in front of middle stump!"
  ],
  dot: [
    "beaten on the outside edge! Terrific delivery that kicks off a good length.",
    "slower bouncer outside off, swung hard and missed.",
    "pushed firmly to short extra cover, no run possible.",
    "defended solidly back to the bowler on the backfoot."
  ],
  single: [
    "tucked off the hip towards square leg for a quick single.",
    "punched off the backfoot through point, easy single taken.",
    "nudged towards long-on, sensible rotation of the strike.",
    "dropped into the vacant gap on the off-side for a sharp single."
  ],
  wide: [
    "fired down the leg side, signaled wide by the umpire. Extra run conceded.",
    "strayed well outside off-stump beyond the tramline, umpire calls wide."
  ]
};

function getRandomCommentary(list, batterName, bowlerName) {
  const item = list[Math.floor(Math.random() * list.length)];
  return `${batterName} ${item} (Bowler: ${bowlerName})`;
}

// Generate an authentic shot vector for the wagon wheel
function recordShot(runs, isWicket, isWide, batterName) {
  if (isWide) return; // Wides do not produce a bat trajectory
  let angle, dist, zone;
  if (runs === 6) {
    const angles = [35, 75, 85, 330, 20];
    angle = angles[Math.floor(Math.random() * angles.length)] + (Math.random() * 10 - 5);
    dist = 1.05 + Math.random() * 0.1;
    zone = angle < 90 ? 'Mid-wicket / Long-on' : 'Extra Cover';
  } else if (runs === 4) {
    const angles = [315, 270, 0, 85, 140];
    angle = angles[Math.floor(Math.random() * angles.length)] + (Math.random() * 8 - 4);
    dist = 0.94 + Math.random() * 0.04;
    zone = angle > 180 ? 'Off-side Drive/Cut' : 'Leg-side Boundary';
  } else if (runs > 0) {
    angle = Math.floor(Math.random() * 360);
    dist = 0.45 + Math.random() * 0.35;
    zone = 'Infield / Outfield Placement';
  } else {
    angle = Math.floor(Math.random() * 360);
    dist = 0.15 + Math.random() * 0.2;
    zone = isWicket ? 'Dismissal Point' : 'Crease Defense';
  }

  S.shots.push({
    id: Date.now() + Math.random(),
    angle: (angle + 360) % 360,
    dist,
    runs,
    isWicket,
    batter: batterName,
    zone
  });
  if (S.shots.length > 25) {
    S.shots.shift();
  }
}

function executeBall(forcedType = null) {
  if (S.done) return;
  const b = S.batters[S.striker];
  const bw = S.bowlers[Math.floor(S.balls / 6) % S.bowlers.length];
  const o = ov();
  let runs = 0, wicket = false, isWide = false, label = '';

  if (forcedType !== null) {
    if (forcedType === 'W') {
      wicket = true;
      runs = 0;
      label = 'W';
    } else if (forcedType === 'WD') {
      isWide = true;
      runs = 1;
      label = 'WD';
    } else {
      runs = Number(forcedType);
      label = runs === 0 ? '•' : String(runs);
    }
  } else {
    const r = Math.random();
    if (r < 0.05) { wicket = true; runs = 0; label = 'W'; }
    else if (r < 0.08) { isWide = true; runs = 1; label = 'WD'; }
    else if (r < 0.36) { runs = 0; label = '•'; }
    else if (r < 0.68) { runs = 1; label = '1'; }
    else if (r < 0.76) { runs = 2; label = '2'; }
    else if (r < 0.78) { runs = 3; label = '3'; }
    else if (r < 0.90) { runs = 4; label = '4'; }
    else { runs = 6; label = '6'; }
  }

  // --- Strict Cricket Scoring Rules ---
  if (!isWide) {
    // Legal delivery
    S.balls++;
    b.balls++;
    bw.balls++;
    S.pBalls++;
    b.runs += runs;
  }
  // Runs always add to team total & bowler figures
  S.runs += runs;
  bw.runs += runs;
  S.pRuns += runs;

  if (runs === 4 && !isWide) b.fours++;
  if (runs === 6 && !isWide) b.sixes++;
  if (runs === 0 && !wicket && !isWide) bw.dots++;

  // Record delivery in recent strip
  S.curOver.push(runs);
  S.recent.unshift({ over: o, label, runs, wicket, isWide });
  S.recent = S.recent.slice(0, 24);

  // Record dynamic shot for wagon wheel
  recordShot(runs, wicket, isWide, b.name);

  // Generate commentary events
  if (isWide) {
    pushEvent('EXTRA', `${bw.name} bowls a wide delivery (+1 run).`);
  } else if (runs === 6) {
    pushEvent('SIX', getRandomCommentary(COMMENTARY.six, b.name, bw.name));
  } else if (runs === 4) {
    pushEvent('FOUR', getRandomCommentary(COMMENTARY.four, b.name, bw.name));
  } else if (wicket) {
    b.out = true;
    S.wkts++;
    bw.wkts++;
    S.partnerships.push({
      wicket: S.wkts,
      pair: `${b.name} / ${S.batters[S.other].name}`,
      runs: S.pRuns,
      balls: S.pBalls
    });
    pushEvent('WICKET', `WICKET! ${b.name} b ${bw.name} ${b.runs} (${b.balls}) - ${getRandomCommentary(COMMENTARY.wicket, b.name, bw.name)}`);
    S.pRuns = 0;
    S.pBalls = 0;
    if (S.next < S.batters.length) {
      S.striker = S.next;
      S.batters[S.next].in = true;
      S.next++;
    }
  } else if (runs === 0) {
    if (Math.random() < 0.35) pushEvent('DOT', getRandomCommentary(COMMENTARY.dot, b.name, bw.name));
  } else {
    if (Math.random() < 0.25) pushEvent('SINGLE', getRandomCommentary(COMMENTARY.single, b.name, bw.name));
  }

  // Milestones
  if (runs > 0 && b.runs >= 50 && (b.runs - runs) < 50) {
    pushEvent('MILESTONE', `FIFTY! ${b.name} reaches 50 off ${b.balls} balls (SR: ${Math.round((b.runs / b.balls) * 100)})`);
  }
  if (S.pRuns >= 50 && (S.pRuns - runs) < 50) {
    pushEvent('MILESTONE', `50-run Partnership between ${S.batters[S.striker].name} & ${S.batters[S.other].name} (${S.pBalls} balls)`);
  }

  // Strike rotation on odd runs (only for legal runs)
  if (!wicket && !isWide && runs % 2 === 1) {
    [S.striker, S.other] = [S.other, S.striker];
  }

  // Over completion: strictly after 6 legal balls
  if (!isWide && S.balls > 0 && S.balls % 6 === 0) {
    const sum = S.curOver.reduce((a, c) => a + c, 0);
    S.overRuns.push({
      over: S.balls / 6,
      runs: sum,
      wicket: S.recent.slice(0, 6).some((x) => x.wicket)
    });
    if (sum === 0) bw.maidens++;
    S.curOver = [];
    // Rotate strike at end of over
    [S.striker, S.other] = [S.other, S.striker];
  }

  S.wp.push({ ball: S.balls, p: winProb(S) });

  // Match result evaluation
  if (S.runs >= S.target) {
    S.done = true;
    S.result = `${S.meta.batting.name} won by ${10 - S.wkts} wickets`;
  } else if (S.wkts >= 10 || S.balls >= 120) {
    S.done = true;
    const margin = S.target - S.runs - 1;
    S.result = margin > 0 ? `${S.meta.bowling.name} won by ${margin} runs` : 'Match tied';
  }

  if (S.done) {
    pushEvent('RESULT', `Match Concluded: ${S.result}`);
  }
}

const fmt = (n) => Math.round(n * 10) / 10;

function snapshot() {
  const left = Math.max(0, 120 - S.balls);
  const need = Math.max(0, S.target - S.runs);
  const overs = S.balls / 6;
  const wp = S.wp.length ? S.wp[S.wp.length - 1].p : 0.5;
  const prevWp = S.wp.length > 1 ? S.wp[S.wp.length - 2].p : wp;
  const wpDelta = Math.round((wp - prevWp) * 1000) / 10;
  const bi = Math.floor(Math.max(S.balls - 1, 0) / 6) % S.bowlers.length;
  const bw = S.bowlers[S.done ? bi : Math.floor(S.balls / 6) % S.bowlers.length];
  const bat = (x) => ({
    name: x.name,
    runs: x.runs,
    balls: x.balls,
    fours: x.fours,
    sixes: x.sixes,
    sr: x.balls ? fmt((x.runs / x.balls) * 100) : 0,
    controlPct: x.balls ? Math.round(Math.min(95, Math.max(62, 85 - (x.sixes * 2) + ((x.runs % 7) * 1.5)))) : 0
  });

  // Calculate phase stats
  const powerplayRuns = S.overRuns.slice(0, 6).reduce((a, c) => a + c.runs, 0);
  const middleRuns = S.overRuns.slice(6, 15).reduce((a, c) => a + c.runs, 0);
  const deathRuns = S.overRuns.slice(15).reduce((a, c) => a + c.runs, 0);

  return {
    source: 'simulation',
    mode: 'simulation',
    dataDisclaimer: 'Simulated Demo Dataset for Presentation Review',
    updatedAt: new Date().toISOString(),
    match: {
      id: S.id,
      key: S.key,
      title: S.meta.title,
      venue: S.meta.venue,
      series: S.meta.series,
      pitchCondition: S.meta.pitchCondition,
      status: S.done ? 'COMPLETED' : 'LIVE',
      innings: 2,
      result: S.result,
      firstInnings: S.meta.firstInnings
    },
    teams: { batting: S.meta.batting, bowling: S.meta.bowling },
    score: {
      runs: S.runs,
      wickets: S.wkts,
      overs: Math.floor(S.balls / 6) + '.' + (S.balls % 6),
      balls: S.balls,
      target: S.target,
      needed: need,
      ballsLeft: left
    },
    batters: [S.striker, S.other].map((i) => ({ ...bat(S.batters[i]), onStrike: i === S.striker })),
    bowler: {
      name: bw.name,
      overs: Math.floor(bw.balls / 6) + '.' + (bw.balls % 6),
      runs: bw.runs,
      wickets: bw.wkts,
      econ: bw.balls ? fmt((bw.runs / bw.balls) * 6) : 0,
      dots: bw.dots
    },
    recentBalls: S.recent,
    shots: S.shots,
    winProbability: {
      batting: wp,
      bowling: 1 - wp,
      delta: wpDelta,
      timeline: S.wp,
      drivers: [
        { name: 'Required Run Rate Pressure', impact: need / (left || 1) > 1.8 ? '-14%' : '+18%' },
        { name: 'Wickets in Hand (Chepauk Dew Factor)', impact: (10 - S.wkts) >= 6 ? '+22%' : '-15%' },
        { name: 'Set Batters Strike Rate (Dube/Jadeja)', impact: '+12%' },
        { name: 'Bowler Death Over Economy (Siraj/Dayal)', impact: '-8%' }
      ]
    },
    runRate: {
      current: overs ? fmt(S.runs / overs) : 0,
      required: left ? fmt((need / left) * 6) : 0,
      projectedTotal: overs ? Math.round((S.runs / overs) * 20) : 0
    },
    phaseStats: {
      powerplay: { overs: '1-6', runs: powerplayRuns, rpo: fmt(powerplayRuns / 6) },
      middle: { overs: '7-15', runs: middleRuns, rpo: fmt(middleRuns / 9) },
      death: { overs: '16-20', runs: deathRuns, rpo: overs > 15 ? fmt(deathRuns / (overs - 15)) : 0 }
    },
    partnership: {
      runs: S.pRuns,
      balls: S.pBalls,
      batters: [S.batters[S.striker].name, S.batters[S.other].name]
    },
    partnerships: S.partnerships,
    overRuns: S.overRuns,
    bowling: S.bowlers.map((x) => ({
      name: x.name,
      overs: Math.floor(x.balls / 6) + '.' + (x.balls % 6),
      maidens: x.maidens,
      runs: x.runs,
      wickets: x.wkts,
      econ: x.balls ? fmt((x.runs / x.balls) * 6) : 0,
      dotPct: x.balls ? Math.round((x.dots / x.balls) * 100) : 0
    })),
    batting: S.batters.filter((x) => x.in).map((x) => ({
      ...bat(x),
      status: x.out ? 'out' : 'not out'
    })),
    events: S.events,
    startScenario: currentScenario,
    playerSpotlight: {
      striker: (() => {
        const batObj = S.batters[S.striker];
        const p = BATTER_PROFILES[batObj?.name] || {
          role: 'Top-Order Batter',
          style: 'Right-Hand Bat',
          phaseSR: { pp: 140, mid: 130, death: 175 },
          vsPace: 145,
          vsSpin: 135,
          zones: { cover: 30, point: 20, midwicket: 30, straight: 12, fineleg: 8 }
        };
        const bShots = S.shots.filter((sh) => sh.batter === batObj?.name);
        const offShots = bShots.filter((sh) => sh.angle > 180).length;
        const legShots = bShots.filter((sh) => sh.angle <= 180).length;
        const totalBShots = bShots.length || 1;
        const offPct = Math.round((offShots / totalBShots) * 100);
        const legPct = 100 - offPct;
        const bBoundaryBalls = (batObj.fours + batObj.sixes) > 0
          ? (batObj.balls / (batObj.fours + batObj.sixes)).toFixed(1)
          : '0';
        const dotPct = batObj.balls > 0
          ? Math.max(12, Math.round(100 - ((batObj.runs * 100) / (batObj.balls * 2.2))))
          : 0;

        return {
          name: batObj.name,
          role: p.role,
          style: p.style,
          runs: batObj.runs,
          balls: batObj.balls,
          fours: batObj.fours,
          sixes: batObj.sixes,
          sr: batObj.balls ? fmt((batObj.runs / batObj.balls) * 100) : 0,
          controlPct: batObj.balls ? Math.round(Math.min(96, Math.max(65, 88 - (batObj.sixes * 2) + ((batObj.runs % 7) * 1.5)))) : 100,
          ballsPerBoundary: bBoundaryBalls,
          dotPct: Math.min(85, Math.max(10, dotPct)),
          offPct: bShots.length ? offPct : 55,
          legPct: bShots.length ? legPct : 45,
          zones: p.zones,
          phaseSR: p.phaseSR,
          vsPace: p.vsPace,
          vsSpin: p.vsSpin,
          h2h: {
            bowler: bw.name,
            runs: Math.min(batObj.runs, Math.round(batObj.runs * 0.45 + (batObj.fours * 2))),
            balls: Math.max(1, Math.round(batObj.balls * 0.4)),
            dismissals: 0
          }
        };
      })(),
      nonStriker: (() => {
        const batObj = S.batters[S.other];
        const p = BATTER_PROFILES[batObj?.name] || {
          role: 'Middle-Order Anchor',
          style: 'Right-Hand Bat',
          phaseSR: { pp: 130, mid: 135, death: 180 },
          vsPace: 140,
          vsSpin: 130,
          zones: { cover: 28, point: 18, midwicket: 32, straight: 14, fineleg: 8 }
        };
        const bShots = S.shots.filter((sh) => sh.batter === batObj?.name);
        const bBoundaryBalls = (batObj.fours + batObj.sixes) > 0
          ? (batObj.balls / (batObj.fours + batObj.sixes)).toFixed(1)
          : '0';
        return {
          name: batObj.name,
          role: p.role,
          style: p.style,
          runs: batObj.runs,
          balls: batObj.balls,
          fours: batObj.fours,
          sixes: batObj.sixes,
          sr: batObj.balls ? fmt((batObj.runs / batObj.balls) * 100) : 0,
          controlPct: batObj.balls ? Math.round(Math.min(96, Math.max(65, 86 - (batObj.sixes * 2) + ((batObj.runs % 7) * 1.5)))) : 100,
          ballsPerBoundary: bBoundaryBalls,
          dotPct: 25,
          offPct: 52,
          legPct: 48,
          zones: p.zones,
          phaseSR: p.phaseSR,
          vsPace: p.vsPace,
          vsSpin: p.vsSpin,
          h2h: { bowler: bw.name, runs: Math.round(batObj.runs * 0.35), balls: Math.max(1, Math.round(batObj.balls * 0.3)), dismissals: 0 }
        };
      })(),
      bowler: (() => {
        const p = BOWLER_PROFILES[bw.name] || {
          style: 'Right-Arm Fast Medium',
          avgSpeed: 137.5,
          topSpeed: 143.0,
          lengths: { yorker: 20, full: 28, good: 40, short: 12 },
          variations: ['Cutter', 'Bouncer', 'Yorker']
        };
        return {
          name: bw.name,
          style: p.style,
          overs: Math.floor(bw.balls / 6) + '.' + (bw.balls % 6),
          balls: bw.balls,
          runs: bw.runs,
          wickets: bw.wkts,
          econ: bw.balls ? fmt((bw.runs / bw.balls) * 6) : 0,
          dots: bw.dots,
          dotPct: bw.balls ? Math.round((bw.dots / bw.balls) * 100) : 0,
          speed: {
            current: (p.avgSpeed + (Math.random() * 4 - 2)).toFixed(1),
            avg: p.avgSpeed,
            top: p.topSpeed
          },
          lengths: p.lengths,
          variations: p.variations,
          pressureRating: bw.balls && (bw.dots / bw.balls) > 0.40 ? 'High Pressure' : 'Balanced Attack',
          vsStriker: {
            striker: S.batters[S.striker].name,
            threatIndex: 82 + (bw.wkts * 5)
          }
        };
      })()
    },
    simulationControl: {
      isPaused,
      speedMs: tickMs,
      isCompleted: S.done,
      startScenario: currentScenario
    }
  };
}

function emit() {
  const snap = snapshot();
  listeners.forEach((f) => f(snap));
}

function start() {
  if (!timer && !isPaused) {
    timer = setInterval(() => {
      executeBall();
      emit();
    }, tickMs);
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

S = buildMatchState(currentMatchKey, currentScenario);
seedWp();

export const mock = {
  listMatches: async () => [
    { id: 'csk_rcb', title: 'CSK vs RCB • Chepauk (Live Chase)', status: 'LIVE', venue: 'MA Chidambaram Stadium, Chennai' },
    { id: 'kkr_srh', title: 'KKR vs SRH • Eden Gardens (Live Chase)', status: 'LIVE', venue: 'Eden Gardens, Kolkata' }
  ],
  getState: async () => snapshot(),
  compare: async (teamA, teamB) => {
    return {
      a: {
        code: S.meta.batting.code,
        name: S.meta.batting.name,
        metrics: {
          'Avg Powerplay Score': 54.2,
          'Avg Death-Over Run Rate': 12.6,
          'Boundary %': 62.4,
          'Bowling Economy': 8.15,
          'Dot Ball %': 42.8,
          'Win % (Last 10 Matches)': 70.0
        }
      },
      b: {
        code: S.meta.bowling.code,
        name: S.meta.bowling.name,
        metrics: {
          'Avg Powerplay Score': 51.8,
          'Avg Death-Over Run Rate': 11.4,
          'Boundary %': 58.1,
          'Bowling Economy': 8.75,
          'Dot Ball %': 38.6,
          'Win % (Last 10 Matches)': 50.0
        }
      }
    };
  },
  history: async () => [
    { season: '2025', date: '2025-05-18', teams: 'CSK vs RCB', result: 'CSK won by 6 wkts', venue: 'M. Chinnaswamy Stadium, Bengaluru', topScorer: 'Ruturaj Gaikwad 74 (42)' },
    { season: '2025', date: '2025-04-14', teams: 'RCB vs CSK', result: 'RCB won by 18 runs', venue: 'MA Chidambaram Stadium, Chennai', topScorer: 'Virat Kohli 83 (51)' },
    { season: '2024', date: '2024-05-04', teams: 'CSK vs RCB', result: 'CSK won by 8 wkts', venue: 'MA Chidambaram Stadium, Chennai', topScorer: 'Shivam Dube 66* (27)' },
    { season: '2024', date: '2024-03-22', teams: 'RCB vs CSK', result: 'CSK won by 6 wkts', venue: 'M. Chinnaswamy Stadium, Bengaluru', topScorer: 'Rachin Ravindra 48 (21)' },
    { season: '2023', date: '2023-04-17', teams: 'RCB vs CSK', result: 'CSK won by 8 runs', venue: 'M. Chinnaswamy Stadium, Bengaluru', topScorer: 'Glenn Maxwell 76 (36)' },
    { season: '2022', date: '2022-05-04', teams: 'RCB vs CSK', result: 'RCB won by 13 runs', venue: 'MCA Stadium, Pune', topScorer: 'Mahipal Lomror 42 (27)' }
  ],
  login: async (u) => ({ user: { name: u || 'Demo Presenter' }, token: 'demo-token' }),
  subscribeNotifications: async () => ({ ok: true }),
  health: async () => ({ status: 'healthy', engine: 'simulated_deterministic_stream', build: 'v2.7-presentation' }),

  // Simulation controls for interactive demonstration
  onSnapshot(fn) {
    listeners.add(fn);
    start();
    fn(snapshot());
    return () => {
      listeners.delete(fn);
      if (!listeners.size) stop();
    };
  },
  setSpeed(ms) {
    tickMs = ms;
    if (timer) {
      stop();
      start();
    }
    emit();
  },
  togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      stop();
    } else {
      start();
    }
    emit();
  },
  triggerManualBall(type) {
    executeBall(type);
    emit();
  },
  stepBall() {
    executeBall();
    emit();
  },
  switchMatch(key) {
    if (MATCH_DATA[key]) {
      currentMatchKey = key;
      S = buildMatchState(key, currentScenario);
      seedWp();
      emit();
    }
  },
  resetToZero() {
    currentScenario = 'zero';
    S = buildMatchState(currentMatchKey, 'zero');
    seedWp();
    emit();
  },
  resetToClimax() {
    currentScenario = 'climax';
    S = buildMatchState(currentMatchKey, 'climax');
    seedWp();
    emit();
  },
  restart() {
    S = buildMatchState(currentMatchKey, currentScenario);
    seedWp();
    emit();
  }
};
