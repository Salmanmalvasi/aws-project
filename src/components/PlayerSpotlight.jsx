import { useState } from 'react';

export default function PlayerSpotlight({ s }) {
  const [activeTab, setActiveTab] = useState('striker'); // 'striker' | 'other' | 'bowler' | custom player
  const [selectedPlayerName, setSelectedPlayerName] = useState(null);

  if (!s) return null;

  const striker = s.batters?.[0];
  const other = s.batters?.[1];
  const bowler = s.bowler;
  const spotlightData = s.playerSpotlight;

  // Determine which player is currently selected
  let currentRole = activeTab;
  let activePlayerData = null;

  if (activeTab === 'striker') {
    activePlayerData = spotlightData?.striker || striker;
  } else if (activeTab === 'other') {
    activePlayerData = spotlightData?.nonStriker || other;
  } else if (activeTab === 'bowler') {
    activePlayerData = spotlightData?.bowler || bowler;
  } else if (selectedPlayerName) {
    // If user chose a custom player from the squad
    const customBatter = (s.batting || []).find((b) => b.name === selectedPlayerName);
    const customBowler = (s.bowling || []).find((b) => b.name === selectedPlayerName);
    if (customBatter) {
      currentRole = 'customBatter';
      activePlayerData = {
        name: customBatter.name,
        role: 'Squad Batter',
        style: customBatter.name.includes('Jadeja') || customBatter.name.includes('Dube') || customBatter.name.includes('Narine') || customBatter.name.includes('Rinku') ? 'Left-Hand Bat' : 'Right-Hand Bat',
        runs: customBatter.runs,
        balls: customBatter.balls,
        fours: customBatter.fours,
        sixes: customBatter.sixes,
        sr: customBatter.sr,
        controlPct: customBatter.controlPct || 85,
        ballsPerBoundary: (customBatter.fours + customBatter.sixes) > 0 ? (customBatter.balls / (customBatter.fours + customBatter.sixes)).toFixed(1) : '0',
        dotPct: 28,
        offPct: 54,
        legPct: 46,
        zones: { cover: 32, point: 20, midwicket: 26, straight: 14, fineleg: 8 },
        phaseSR: { pp: 142, mid: 135, death: 185 },
        vsPace: 152,
        vsSpin: 138,
        h2h: { bowler: bowler.name, runs: Math.round(customBatter.runs * 0.4), balls: Math.max(1, Math.round(customBatter.balls * 0.35)), dismissals: 0 }
      };
    } else if (customBowler) {
      currentRole = 'bowler';
      activePlayerData = {
        name: customBowler.name,
        style: customBowler.name.includes('Maxwell') || customBowler.name.includes('Karn') ? 'Right-Arm Spin' : 'Right-Arm Fast Medium',
        overs: customBowler.overs,
        balls: customBowler.overs ? Math.round(parseFloat(customBowler.overs) * 6) : 6,
        runs: customBowler.runs,
        wickets: customBowler.wickets,
        econ: customBowler.econ,
        dots: Math.round(customBowler.runs * 0.4),
        dotPct: customBowler.dotPct || 35,
        speed: { current: '138.4', avg: 137.2, top: 142.5 },
        lengths: { yorker: 18, full: 28, good: 42, short: 12 },
        variations: ['Cutter', 'Inswinger', 'Yorker'],
        pressureRating: 'Standard Control'
      };
    }
  }

  const isBowler = currentRole === 'bowler';

  return (
    <section className="card player-spotlight-card" aria-label="Active Player Spotlight & Deep Telemetry">
      {/* Spotlight Header & Quick-Switch Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}>
            <span>⚡ In-Play Player Telemetry &amp; Advanced Biometrics</span>
            <span className="pill small" style={{ background: '#1c1c1c', border: '1px solid #333' }}>
              Deep Analytics
            </span>
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
            Real-time strike arcs, scoring zones, pitch length radars, and bowler release telemetry
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`btn small ${activeTab === 'striker' ? '' : 'ghost'}`}
            onClick={() => { setActiveTab('striker'); setSelectedPlayerName(null); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ color: 'var(--ok)', fontSize: '10px' }}>▶</span>
            Striker: {striker?.name?.split(' ')[0] || 'Striker'} ({striker?.runs || 0}*)
          </button>

          <button
            className={`btn small ${activeTab === 'other' ? '' : 'ghost'}`}
            onClick={() => { setActiveTab('other'); setSelectedPlayerName(null); }}
          >
            Non-Striker: {other?.name?.split(' ')[0] || 'Partner'} ({other?.runs || 0}*)
          </button>

          <button
            className={`btn small ${activeTab === 'bowler' ? '' : 'ghost'}`}
            onClick={() => { setActiveTab('bowler'); setSelectedPlayerName(null); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            🎯 Bowler: {bowler?.name?.split(' ')[0] || 'Bowler'}
          </button>

          {/* Squad Player Selector Dropdown */}
          <select
            value={selectedPlayerName || ''}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedPlayerName(e.target.value);
                setActiveTab('custom');
              }
            }}
            style={{ fontSize: '11px', padding: '4px 8px', background: '#121212', borderColor: '#333333', color: '#ffffff' }}
            aria-label="Inspect individual player telemetry"
          >
            <option value="">Inspect Other Players...</option>
            <optgroup label="Batting Lineup">
              {(s.batting || []).map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.runs}r, {b.balls}b)
                </option>
              ))}
            </optgroup>
            <optgroup label="Bowling Attack">
              {(s.bowling || []).map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.overs} ov, {b.wickets}w)
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* =================================================================== */}
      {/* HERO TILE: ACTIVE PLAYER HIGHLIGHT                                   */}
      {/* =================================================================== */}
      <div style={{ background: 'var(--panel2)', borderRadius: 10, border: '1px solid var(--line)', padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(280px, 2fr) minmax(180px, 1fr)', gap: 16, alignItems: 'center' }}>
          {/* Identity & Role */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="pill small" style={{ background: isBowler ? '#261214' : '#142318', color: isBowler ? 'var(--danger)' : 'var(--ok)', borderColor: isBowler ? '#45161b' : '#1a4325' }}>
                {isBowler ? 'CURRENT BOWLER' : (activeTab === 'striker' ? 'ON STRIKE' : 'NON-STRIKER')}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
                {activePlayerData?.style || (isBowler ? 'Right-Arm Fast' : 'Right-Hand Bat')}
              </span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              {activePlayerData?.name || 'Player Name'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>
              {activePlayerData?.role || (isBowler ? 'Spearhead Pacer' : 'Middle-Order Power Hitter')}
            </div>
          </div>

          {/* Core Score Figures */}
          {!isBowler ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', background: '#0a0a0a', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>RUNS</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff' }}>
                  {activePlayerData?.runs ?? 0}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>off {activePlayerData?.balls ?? 0}b</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>STRIKE RATE</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--ok)' }}>
                  {activePlayerData?.sr ?? 0}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>scoring pace</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>BOUNDARIES</span>
                <span style={{ fontSize: '20px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff' }}>
                  <span style={{ color: 'var(--four)' }}>{activePlayerData?.fours ?? 0}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '14px' }}> / </span>
                  <span style={{ color: 'var(--six)' }}>{activePlayerData?.sixes ?? 0}</span>
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>4s / 6s</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>CONTROL</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff' }}>
                  {activePlayerData?.controlPct ?? 88}%
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>middled shots</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', background: '#0a0a0a', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>OVERS</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff' }}>
                  {activePlayerData?.overs ?? '0.0'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>completed</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>WICKETS</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--danger)' }}>
                  {activePlayerData?.wickets ?? 0}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>for {activePlayerData?.runs ?? 0}r</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>ECONOMY</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff' }}>
                  {activePlayerData?.econ ?? '0.0'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>runs / over</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', display: 'block' }}>DOT BALLS</span>
                <span style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--ok)' }}>
                  {activePlayerData?.dots ?? 0}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{activePlayerData?.dotPct ?? 35}% dots</span>
              </div>
            </div>
          )}

          {/* Quick Efficiency Meter */}
          <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 16 }}>
            {!isBowler ? (
              <>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
                  BOUNDARY FREQUENCY
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: 4 }}>
                  1 every {activePlayerData?.ballsPerBoundary || '4.2'} balls
                </div>
                <div style={{ fontSize: '11px', color: 'var(--four)', marginTop: 4 }}>
                  Dot Ball Resistance: {100 - (activePlayerData?.dotPct || 25)}%
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
                  SPEED RADAR (KM/H)
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginTop: 4 }}>
                  {activePlayerData?.speed?.current || '142.4'} km/h <small style={{ color: 'var(--muted)', fontSize: '11px' }}>(Avg: {activePlayerData?.speed?.avg || '139.1'})</small>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: 4 }}>
                  Peak Delivery: {activePlayerData?.speed?.top || '147.5'} km/h
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* DEEP TELEMETRY THREE-COLUMN GRID                                    */}
      {/* =================================================================== */}
      {!isBowler ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* 1. Wagon Wheel Distribution Arc */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>WAGON WHEEL DISTRIBUTION</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>360° Ground Arc</span>
            </div>

            {/* Split Bar */}
            <div style={{ height: 10, borderRadius: 5, background: '#222', overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
              <div style={{ width: `${activePlayerData?.offPct || 55}%`, background: 'var(--four)' }} title={`Off-side: ${activePlayerData?.offPct || 55}%`}></div>
              <div style={{ width: `${activePlayerData?.legPct || 45}%`, background: 'var(--six)' }} title={`On-side: ${activePlayerData?.legPct || 45}%`}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono', marginBottom: 12 }}>
              <span style={{ color: 'var(--four)' }}>Off-Side: {activePlayerData?.offPct || 55}%</span>
              <span style={{ color: 'var(--six)' }}>On-Side: {activePlayerData?.legPct || 45}%</span>
            </div>

            {/* Sector Breakdown */}
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div>Cover Drive: <b>{activePlayerData?.zones?.cover || 30}%</b></div>
              <div>Mid-Wicket: <b>{activePlayerData?.zones?.midwicket || 32}%</b></div>
              <div>Square Cut/Point: <b>{activePlayerData?.zones?.point || 18}%</b></div>
              <div>Straight/Long-on: <b>{activePlayerData?.zones?.straight || 12}%</b></div>
            </div>
          </div>

          {/* 2. Match Phase Acceleration */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>PHASE STRIKE RATE PROFILE</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>T20 Tempo</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
              <div style={{ background: '#0a0a0a', padding: 8, borderRadius: 6, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>POWERPLAY</span>
                <b style={{ fontSize: '16px', color: '#ffffff', fontFamily: 'JetBrains Mono' }}>
                  {activePlayerData?.phaseSR?.pp || 145}
                </b>
                <span style={{ fontSize: '10px', color: 'var(--four)', display: 'block' }}>SR (1-6 ov)</span>
              </div>

              <div style={{ background: '#0a0a0a', padding: 8, borderRadius: 6, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>MIDDLE</span>
                <b style={{ fontSize: '16px', color: '#ffffff', fontFamily: 'JetBrains Mono' }}>
                  {activePlayerData?.phaseSR?.mid || 135}
                </b>
                <span style={{ fontSize: '10px', color: 'var(--ok)', display: 'block' }}>SR (7-15 ov)</span>
              </div>

              <div style={{ background: '#0a0a0a', padding: 8, borderRadius: 6, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>DEATH</span>
                <b style={{ fontSize: '16px', color: 'var(--six)', fontFamily: 'JetBrains Mono' }}>
                  {activePlayerData?.phaseSR?.death || 195}
                </b>
                <span style={{ fontSize: '10px', color: 'var(--six)', display: 'block' }}>SR (16-20 ov)</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 12, lineHeight: 1.4 }}>
              Acceleration Index: <b>+42% velocity boost</b> in death overs with high boundary conversion.
            </div>
          </div>

          {/* 3. Matchup Intelligence */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' , padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>BOWLING MATCHUP INTELLIGENCE</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Pace vs Spin</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Strike Rate vs Pace:</span>
              <b style={{ color: '#ffffff', fontFamily: 'JetBrains Mono' }}>{activePlayerData?.vsPace || 152} SR</b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Strike Rate vs Spin:</span>
              <b style={{ color: '#ffffff', fontFamily: 'JetBrains Mono' }}>{activePlayerData?.vsSpin || 140} SR</b>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Head-to-Head vs {bowler?.name?.split(' ')[0]}:</span>
              <b style={{ color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}>
                {activePlayerData?.h2h?.runs || 18} runs ({activePlayerData?.h2h?.balls || 11}b) &bull; 0 wkts
              </b>
            </div>
          </div>
        </div>
      ) : (
        /* Bowler 3-Column Telemetry */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* 1. Pitch Length Radar */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>PITCH LENGTH DISTRIBUTION</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Trajectory Zones</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', fontFamily: 'JetBrains Mono' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Yorker (Blockhole)</span>
                  <b style={{ color: 'var(--ok)' }}>{activePlayerData?.lengths?.yorker || 20}%</b>
                </div>
                <div style={{ height: 6, background: '#1c1c1c', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${activePlayerData?.lengths?.yorker || 20}%`, height: '100%', background: 'var(--ok)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Full Length (Driving Zone)</span>
                  <b style={{ color: '#ffffff' }}>{activePlayerData?.lengths?.full || 28}%</b>
                </div>
                <div style={{ height: 6, background: '#1c1c1c', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${activePlayerData?.lengths?.full || 28}%`, height: '100%', background: '#ffffff' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Good Length (Channel)</span>
                  <b style={{ color: '#ffffff' }}>{activePlayerData?.lengths?.good || 40}%</b>
                </div>
                <div style={{ height: 6, background: '#1c1c1c', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${activePlayerData?.lengths?.good || 40}%`, height: '100%', background: '#aaaaaa' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Short Pitch / Bouncer</span>
                  <b style={{ color: 'var(--danger)' }}>{activePlayerData?.lengths?.short || 12}%</b>
                </div>
                <div style={{ height: 6, background: '#1c1c1c', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${activePlayerData?.lengths?.short || 12}%`, height: '100%', background: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Visual 22-Yard Pitch Map Strip */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>22-YARD PITCH MAP</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Landing Spots</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 160 110" style={{ width: '100%', maxWidth: 200, height: 'auto' }} role="img" aria-label="Pitch Map">
                {/* 22 Yard Pitch Rect */}
                <rect x="25" y="5" width="110" height="96" rx="4" fill="#0d0d0d" stroke="#333333" strokeWidth="1.5" />
                
                {/* Bowling Crease (Top) & Batting Crease (Bottom) */}
                <line x1="25" y1="20" x2="135" y2="20" stroke="#444444" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="25" y1="84" x2="135" y2="84" stroke="#ffffff" strokeWidth="1.5" />

                {/* Stumps Markings */}
                <rect x="74" y="85" width="12" height="3" fill="#ffffff" />
                <rect x="74" y="16" width="12" height="3" fill="#666666" />

                {/* Pitch Length Zones Labels */}
                <line x1="25" y1="42" x2="135" y2="42" stroke="#222" strokeWidth="1" />
                <line x1="25" y1="62" x2="135" y2="62" stroke="#222" strokeWidth="1" />

                {/* Ball Landing Spots */}
                <circle cx="80" cy="82" r="3.5" fill="var(--ok)" title="Yorker" />
                <circle cx="75" cy="74" r="3" fill="#ffffff" title="Full" />
                <circle cx="86" cy="70" r="3" fill="#ffffff" title="Full outside off" />
                <circle cx="82" cy="54" r="3.5" fill="#aaaaaa" title="Good length" />
                <circle cx="70" cy="52" r="3.5" fill="#aaaaaa" title="Good length fourth stump" />
                <circle cx="92" cy="48" r="3" fill="#aaaaaa" title="Good length wide" />
                <circle cx="78" cy="32" r="4" fill="var(--danger)" title="Bouncer" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, fontSize: '10px', color: 'var(--muted)', marginTop: 4 }}>
              <span><i className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', marginRight: 3 }}></i>Yorker</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#ffffff', marginRight: 3 }}></i>Full</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#aaaaaa', marginRight: 3 }}></i>Good</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', marginRight: 3 }}></i>Short</span>
            </div>
          </div>

          {/* 3. Delivery Variations & Threat Index */}
          <div style={{ background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>THREAT &amp; VARIATIONS</span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Attack Matrix</span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: 6 }}>
              PRIMARY REPERTOIRE:
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {(activePlayerData?.variations || ['Inswinger', 'Yorker', 'Cutter']).map((v, i) => (
                <span key={i} className="pill small" style={{ background: '#141414', borderColor: '#333333', color: '#ffffff' }}>
                  {v}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--muted)' }}>Dot Ball Pressure:</span>
                <b style={{ color: 'var(--ok)' }}>{activePlayerData?.pressureRating || 'High Pressure'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: 4 }}>
                <span style={{ color: 'var(--muted)' }}>Wicket Threat Index:</span>
                <b style={{ color: 'var(--danger)', fontFamily: 'JetBrains Mono' }}>
                  {activePlayerData?.vsStriker?.threatIndex || 88} / 100
                </b>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
