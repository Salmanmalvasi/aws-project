import { useState } from 'react';
import { Card, Kpi, Table } from '../components/ui.jsx';
import { WinProbChart } from '../components/charts.jsx';
import PlayerSpotlight from '../components/PlayerSpotlight.jsx';
import { API } from '../api/api.js';

const pct = (p) => Math.round(p * 100);

export default function Live({ s }) {
  const { score: sc, winProbability: wp, runRate: rr, teams: t, match: m } = s;
  const [eventFilter, setEventFilter] = useState('all');

  const filteredEvents = s.events.filter((e) => {
    if (eventFilter === 'boundary') return e.type === 'FOUR' || e.type === 'SIX';
    if (eventFilter === 'wicket') return e.type === 'WICKET';
    return true;
  });

  const getBallClass = (b) => {
    if (b.wicket) return 'ball wicket';
    if (b.runs === 4) return 'ball four';
    if (b.runs === 6) return 'ball six';
    if (b.isWide) return 'ball wide';
    if (b.runs === 0) return 'ball dot';
    return 'ball';
  };

  const delta = wp.delta || 0;
  const deltaColor = delta >= 0 ? 'var(--ok)' : 'var(--danger)';
  const deltaPrefix = delta > 0 ? '+' : '';

  // Calculate off-side vs leg-side shots
  const offSideShots = (s.shots || []).filter((sh) => sh.angle > 180).length;
  const legSideShots = (s.shots || []).filter((sh) => sh.angle <= 180).length;
  const totalShots = (s.shots || []).length || 1;
  const offPct = Math.round((offSideShots / totalShots) * 100);
  const legPct = 100 - offPct;

  return (
    <div className="live-page-container">
      {/* =================================================================== */}
      {/* 1. MATCH HEADER & SCORE HERO                                        */}
      {/* =================================================================== */}
      <section className="card hero" aria-label="Live Match Header">
        {/* Top Match Meta */}
        <div className="sb-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{m.series}</span>
            <span style={{ color: 'var(--muted)' }}>&bull;</span>
            <span style={{ color: 'var(--text-secondary)' }}>{m.venue}</span>
            <span style={{ color: 'var(--muted)' }}>&bull;</span>
            <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{m.pitchCondition}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Quick Demo Match Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="match-switch" style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
                Fixture:
              </label>
              <select
                id="match-switch"
                value={m.key || 'csk_rcb'}
                onChange={(e) => API.sim.switchMatch && API.sim.switchMatch(e.target.value)}
                style={{ fontSize: '11px', padding: '3px 8px', background: '#121212', borderColor: '#333333' }}
              >
                <option value="csk_rcb">CSK vs RCB (Chepauk)</option>
                <option value="kkr_srh">KKR vs SRH (Eden Gardens)</option>
              </select>
            </div>

            {/* Quick 0/0 Start / Climax Toggle Button */}
            <button
              className="btn small ghost"
              onClick={() => sc.overs === '0.0' ? API.sim.resetToClimax() : API.sim.resetToZero()}
              title="Toggle between starting match at 0/0 and 15th over chase climax"
              style={{ fontSize: '11px', padding: '3px 8px', borderColor: sc.overs === '0.0' ? 'var(--ok)' : 'var(--line)' }}
            >
              {sc.overs === '0.0' ? '⚡ 0/0 Mode (Click for Climax)' : '⚡ Reset to 0/0 (Fresh Match)'}
            </button>

            <span className={'pill ' + (m.status === 'LIVE' ? 'live' : '')}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)' }}></span>
              {m.status}
            </span>
          </div>
        </div>

        {/* Score Display Grid */}
        <div className="sb-main">
          {/* Batting Team (Chasing) */}
          <div className="team">
            <div className="team-badge" style={{ borderColor: '#404040' }}>
              {t.batting.code}
            </div>
            <div>
              <div className="team-name">
                {t.batting.name}
                <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)' }} title="Currently Batting"></span>
              </div>
              <span className="team-sub">2nd Innings (Target: {sc.target} runs)</span>
            </div>
          </div>

          {/* Central Prominent Score - Readably Sized */}
          <div className="score-center-display">
            <div className="big">
              {sc.runs}<span>/{sc.wickets}</span>
              <small>{sc.overs} / 20.0 OVERS</small>
            </div>
          </div>

          {/* Bowling Team (Defending) */}
          <div className="team r">
            <div>
              <div className="team-name" style={{ justifyContent: 'flex-end' }}>
                {t.bowling.name}
              </div>
              <span className="team-sub">1st Innings: {m.firstInnings || `${sc.target - 1}/6`}</span>
            </div>
            <div className="team-badge" style={{ borderColor: '#404040' }}>
              {t.bowling.code}
            </div>
          </div>
        </div>

        {/* Dynamic Chase Equation Bar */}
        <div className="chase-bar" role="status">
          {m.result ? (
            <span style={{ color: 'var(--ok)', fontSize: '15px', fontWeight: 700 }}>
              🏆 {m.result}
            </span>
          ) : (
            <>
              ⚡ <b>{t.batting.name}</b> need <span className="highlight">{sc.needed} runs</span> off{' '}
              <span className="highlight">{sc.ballsLeft} balls</span> (Required: {rr.required} RPO, Current: {rr.current} RPO) with{' '}
              <span className="highlight">{10 - sc.wickets} wickets</span> in hand
            </>
          )}
        </div>

        {/* Win Probability Bar & Estimator */}
        <div style={{ marginTop: 14 }}>
          <div className="wpbar" title="Simulation-derived Win Probability">
            <i style={{ width: pct(wp.batting) + '%', background: '#ffffff' }} />
            <i style={{ width: pct(wp.bowling) + '%', background: '#383838' }} />
          </div>
          <div className="wplbl">
            <span>
              <b>{t.batting.code}</b> {pct(wp.batting)}% Win Expectation
            </span>
            <span style={{ color: deltaColor, fontWeight: 700, fontSize: '11px' }}>
              {deltaPrefix}{delta}% Last Delivery Shift
            </span>
            <span>
              <b>{t.bowling.code}</b> {pct(wp.bowling)}% Win Expectation
            </span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. MATCH SITUATION & WIN PROBABILITY TIMELINE                      */}
      {/* =================================================================== */}
      <div className="grid g3">
        {/* Win Probability Chart */}
        <Card title="Win Probability Model Trajectory" note="XGBoost In-Play Estimator" className="span2">
          <div className="chart">
            <WinProbChart timeline={wp.timeline} color="#ffffff" />
          </div>
          <p className="legend">
            <span><i className="dot a" style={{ background: '#ffffff' }} />{t.batting.code} Win Probability Curve</span>
            <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>Dotted Line: 50% Even Contest Par</span>
          </p>
        </Card>

        {/* Key Rate Metrics */}
        <Card title="Match Situation Metrics">
          <div className="kpis">
            <Kpi label="Current Run Rate" value={rr.current} />
            <Kpi label="Required Run Rate" value={rr.required} />
            <Kpi label="Projected Score" value={rr.projectedTotal} />
            <Kpi label="Current Stand" value={`${s.partnership.runs} (${s.partnership.balls}b)`} />
          </div>

          <div style={{ marginTop: 14, padding: 12, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginBottom: 6 }}>
              MATCHUP PRESSURE FACTORS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {(wp.drivers || []).map((dr, idx) => (
                <li key={idx}>
                  {dr.name}: <b style={{ color: dr.impact.startsWith('+') ? 'var(--ok)' : 'var(--danger)' }}>{dr.impact}</b>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* =================================================================== */}
      {/* 3. AT THE CREASE, RECENT DELIVERIES & COMMENTARY                    */}
      {/* =================================================================== */}
      <div className="grid g3">
        {/* Batter & Bowler Cards */}
        <Card title="At The Crease (Active Matchup)">
          <Table
            head={['Batter', 'R', 'B', '4s', '6s', 'SR', 'Control']}
            rows={s.batters.map((b) => [
              <span style={{ fontWeight: b.onStrike ? 700 : 400, color: b.onStrike ? '#ffffff' : 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {b.onStrike && <span style={{ color: 'var(--ok)', fontSize: '11px' }}>▶</span>}
                {b.name}
              </span>,
              <b style={{ color: '#ffffff' }}>{b.runs}</b>,
              b.balls,
              <span style={{ color: 'var(--four)', fontWeight: 700 }}>{b.fours}</span>,
              <span style={{ color: 'var(--six)', fontWeight: 700 }}>{b.sixes}</span>,
              b.sr,
              `${b.controlPct}%`
            ])}
          />

          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--muted)' }}>Current Bowler:</span>
              <b style={{ color: '#ffffff' }}>{s.bowler.name}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginTop: 4 }}>
              <span>Spell: {s.bowler.overs} ov &bull; {s.bowler.runs} runs &bull; {s.bowler.wickets} w</span>
              <span>Econ: {s.bowler.econ} &bull; Dots: {s.bowler.dots}</span>
            </div>
          </div>
        </Card>

        {/* Recent Deliveries Strip */}
        <Card title="Recent Deliveries (Last 4 Overs)">
          <div className="balls-container">
            <div className="balls">
              {s.recentBalls.map((b, i) => (
                <span
                  key={i}
                  className={getBallClass(b)}
                  title={`Over ${b.over}: ${b.runs} run(s)${b.wicket ? ' - WICKET' : ''}${b.isWide ? ' - WIDE' : ''}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
              <span><i className="dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--four)', marginRight: 4 }}></i> 4s Boundary</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--six)', marginRight: 4 }}></i> 6s Maximum</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', marginRight: 4 }}></i> Wicket</span>
              <span><i className="dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#555555', marginRight: 4 }}></i> Dot Ball</span>
            </div>
          </div>
        </Card>

        {/* Live Event Commentary Feed */}
        <Card title="Live Ball-by-Ball Feed">
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button
              className={`btn small ${eventFilter === 'all' ? '' : 'ghost'}`}
              onClick={() => setEventFilter('all')}
            >
              All Events
            </button>
            <button
              className={`btn small ${eventFilter === 'boundary' ? '' : 'ghost'}`}
              onClick={() => setEventFilter('boundary')}
            >
              4s &amp; 6s
            </button>
            <button
              className={`btn small ${eventFilter === 'wicket' ? '' : 'ghost'}`}
              onClick={() => setEventFilter('wicket')}
            >
              Wickets
            </button>
          </div>

          <ul className="events" style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filteredEvents.slice(0, 12).map((e) => (
              <li key={e.id} className={'ev ' + e.type}>
                <b>{e.type}</b>
                <span>{e.text}</span>
                <small>ov {e.over}</small>
              </li>
            ))}
            {!filteredEvents.length && (
              <li style={{ color: 'var(--muted)', fontSize: '12px', padding: 8 }}>
                No events match selected filter.
              </li>
            )}
          </ul>
        </Card>
      </div>

      {/* =================================================================== */}
      {/* 4. ACTIVE PLAYER SPOTLIGHT & DEEP BIOMETRIC TELEMETRY               */}
      {/* =================================================================== */}
      <div style={{ marginTop: 16 }}>
        <PlayerSpotlight s={s} />
      </div>

      {/* =================================================================== */}
      {/* 5. DYNAMIC 360° WAGON WHEEL VISUALIZATION                          */}
      {/* =================================================================== */}
      <section className="card" style={{ marginTop: 16 }} aria-label="Dynamic Wagon Wheel">
        <h3>
          <span>360° Wagon Wheel &amp; Shot Trajectory Engine</span>
          <small>Dynamic In-Play Visualizer</small>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: 24, alignItems: 'center' }}>
          {/* Interactive SVG Wagon Wheel Oval */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 260 260" style={{ width: '100%', maxWidth: 280, height: 'auto' }} role="img" aria-label="Cricket Ground Wagon Wheel">
              {/* Cricket Oval Boundary */}
              <circle cx="130" cy="130" r="118" fill="#000000" stroke="#2a2a2a" strokeWidth="2" />
              {/* 30-Yard Infield Circle */}
              <circle cx="130" cy="130" r="64" fill="none" stroke="#222222" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Ground Sector Guidelines */}
              <line x1="130" y1="12" x2="130" y2="248" stroke="#181818" strokeWidth="1" />
              <line x1="12" y1="130" x2="248" y2="130" stroke="#181818" strokeWidth="1" />
              <line x1="46" y1="46" x2="214" y2="214" stroke="#181818" strokeWidth="1" />
              <line x1="214" y1="46" x2="46" y2="214" stroke="#181818" strokeWidth="1" />

              {/* Pitch Rectangle (Center) */}
              <rect x="124" y="104" width="12" height="52" rx="2" fill="#141414" stroke="#333333" strokeWidth="1" />
              
              {/* Guidance text if 0 shots */}
              {(!s.shots || !s.shots.length) && (
                <text x="130" y="80" fill="var(--muted)" fontSize="8.5" textAnchor="middle" fontFamily="JetBrains Mono">
                  Match at 0.0 ov &bull; Bowl ball 0.1 to plot
                </text>
              )}
              
              {/* Dynamic Shot Trajectories from State */}
              {(s.shots || []).map((sh) => {
                // Convert angle (degrees, 0 = straight down) to SVG Cartesian coordinates from crease (130, 140)
                const rad = (sh.angle - 90) * (Math.PI / 180);
                const r = sh.dist * 110;
                const tx = 130 + r * Math.cos(rad);
                const ty = 140 + r * Math.sin(rad);

                let strokeColor = '#ffffff';
                let strokeWidth = 1.5;
                let strokeOpacity = 0.5;
                let pointRadius = 2.5;

                if (sh.runs === 4) {
                  strokeColor = 'var(--four)';
                  strokeWidth = 2.2;
                  strokeOpacity = 0.9;
                  pointRadius = 3.5;
                } else if (sh.runs === 6) {
                  strokeColor = 'var(--six)';
                  strokeWidth = 3;
                  strokeOpacity = 1;
                  pointRadius = 4.5;
                } else if (sh.isWicket) {
                  strokeColor = 'var(--danger)';
                  strokeWidth = 2;
                  strokeOpacity = 1;
                  pointRadius = 4;
                }

                return (
                  <g key={sh.id}>
                    <line
                      x1="130"
                      y1="140"
                      x2={tx.toFixed(1)}
                      y2={ty.toFixed(1)}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={tx.toFixed(1)}
                      cy={ty.toFixed(1)}
                      r={pointRadius}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}

              {/* Batter Crease Spot */}
              <circle cx="130" cy="140" r="4" fill="#ffffff" />
            </svg>
          </div>

          {/* Scoring Zones & Wagon Wheel Diagnostics */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 12, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>OFF-SIDE SCORING</div>
                <div style={{ fontSize: '20px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                  {offPct}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--four)', marginTop: 2 }}>Covers &bull; Point &bull; Third Man</div>
              </div>

              <div style={{ padding: 12, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>ON-SIDE SCORING</div>
                <div style={{ fontSize: '20px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                  {legPct}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--six)', marginTop: 2 }}>Mid-wicket &bull; Long-on &bull; Fine Leg</div>
              </div>

              <div style={{ padding: 12, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>RECORDED TRAJECTORIES</div>
                <div style={{ fontSize: '20px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--ok)', marginTop: 4 }}>
                  {(s.shots || []).length} Shots
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>Synced in real time</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <b>Analytical Commentary:</b> The wagon wheel dynamically plots each delivery based on bat trajectory angles and boundary distances. Trigger deliveries via the top simulation toolbar to observe live updates across boundaries, singles, and dismissals.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}               