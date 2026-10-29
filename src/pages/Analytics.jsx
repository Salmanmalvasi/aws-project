import { Card, Table } from '../components/ui.jsx';
import { OverBars, Worm } from '../components/charts.jsx';
import PlayerSpotlight from '../components/PlayerSpotlight.jsx';

export function BowlingTable({ s }) {
  return (
    <Table
      head={['Bowler', 'Overs', 'Mdn', 'Runs', 'Wkts', 'Econ', 'Dot %']}
      rows={s.bowling.map((b) => [
        <span style={{ fontWeight: 600, color: '#ffffff' }}>{b.name}</span>,
        b.overs,
        b.maidens,
        b.runs,
        <b style={{ color: b.wickets > 0 ? 'var(--danger)' : 'inherit', fontSize: '14px' }}>
          {b.wickets}
        </b>,
        b.econ,
        `${b.dotPct}%`
      ])}
    />
  );
}

export default function Analytics({ s }) {
  const rr = s.runRate;
  const ps = s.phaseStats || {
    powerplay: { overs: '1-6', runs: 0, rpo: 0 },
    middle: { overs: '7-15', runs: 0, rpo: 0 },
    death: { overs: '16-20', runs: 0, rpo: 0 }
  };

  const tiles = [
    ['Current Run Rate', rr.current, 'Actual scoring velocity'],
    ['Required Run Rate', rr.required, 'Required to achieve target'],
    ['AI Projected Total', rr.projectedTotal, 'Simulation-derived estimate'],
    ['Batting Win Prob', `${Math.round(s.winProbability.batting * 100)}%`, 'In-play probability model']
  ];

  return (
    <div className="analytics-page">
      {/* Top Analytical KPI Tiles */}
      <div className="grid g4" style={{ marginBottom: 16 }}>
        {tiles.map(([l, v, sub]) => (
          <div className="card tile" key={l}>
            <small>{l}</small>
            <b>{v}</b>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4, display: 'block' }}>
              {sub}
            </span>
          </div>
        ))}
      </div>

      {/* Dedicated Current Player Spotlight & Telemetry Analysis */}
      <div style={{ marginBottom: 16 }}>
        <PlayerSpotlight s={s} />
      </div>

      {/* Main Charts: Over Progression & Worm Comparison */}
      <div className="grid g2">
        <Card title="Runs Per Over (Acceleration & Pressure Phases)">
          <div className="chart">
            <OverBars data={s.overRuns} color="#ffffff" wicketColor="var(--danger)" />
          </div>
          <p className="legend">
            <span><i className="dot a" style={{ background: '#ffffff' }} />Standard Over</span>
            <span><i className="dot w" style={{ background: 'var(--danger)' }} />Wicket Over (Red)</span>
          </p>
        </Card>

        <Card title="Worm Chart: Run Progression vs Target">
          <div className="chart">
            <Worm overRuns={s.overRuns} target={s.score.target} color="#ffffff" reqColor="#737373" />
          </div>
          <p className="legend">
            <span><i className="dot a" style={{ background: '#ffffff' }} />Actual Chase Progression</span>
            <span><i className="dot r" style={{ background: '#737373' }} />Required Par Trajectory ({s.score.target} runs)</span>
          </p>
        </Card>
      </div>

      {/* Match Phase Diagnostics */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>
          <span>Phase-Wise Run Rate &amp; Momentum Breakdown</span>
          <small>Derived from Live Match Deliveries</small>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ padding: 14, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>POWERPLAY</span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>Overs {ps.powerplay.overs}</span>
            </div>
            <div style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff', marginTop: 6 }}>
              {ps.powerplay.runs} runs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--four)', marginTop: 2, fontFamily: 'JetBrains Mono' }}>
              {ps.powerplay.rpo} RPO &bull; Field restrictions leveraged
            </div>
          </div>

          <div style={{ padding: 14, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>MIDDLE OVERS</span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>Overs {ps.middle.overs}</span>
            </div>
            <div style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff', marginTop: 6 }}>
              {ps.middle.runs} runs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ok)', marginTop: 2, fontFamily: 'JetBrains Mono' }}>
              {ps.middle.rpo} RPO &bull; Spin consolidation
            </div>
          </div>

          <div style={{ padding: 14, background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>DEATH OVERS</span>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>Overs {ps.death.overs}</span>
            </div>
            <div style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#ffffff', marginTop: 6 }}>
              {ps.death.runs} runs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--six)', marginTop: 2, fontFamily: 'JetBrains Mono' }}>
              {ps.death.rpo} RPO &bull; Boundary hitting phase
            </div>
          </div>
        </div>
      </div>

      {/* Partnerships & Bowling Efficiency */}
      <div className="grid g2">
        <Card title="Wicket Partnership Progression">
          <Table
            head={['Wkt', 'Batting Pair', 'Runs', 'Balls', 'RPO']}
            rows={s.partnerships.map((p) => [
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>#{p.wicket}</span>,
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.pair}</span>,
              <b style={{ color: p.runs >= 50 ? 'var(--ok)' : '#ffffff' }}>{p.runs}</b>,
              p.balls,
              p.balls ? Math.round((p.runs / p.balls) * 60) / 10 : 0
            ])}
          />
        </Card>

        <Card title="Bowling Threat &amp; Efficiency Matrix">
          <BowlingTable s={s} />
        </Card>
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
        DATA INTEGRITY NOTICE: All charts, trajectories, and tables are computed dynamically from the active match event stream.
      </div>
    </div>
  );
}
