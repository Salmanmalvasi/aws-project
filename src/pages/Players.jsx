import { useState } from 'react';
import { Card, Table } from '../components/ui.jsx';
import { BowlingTable } from './Analytics.jsx';
import PlayerSpotlight from '../components/PlayerSpotlight.jsx';

export default function Players({ s }) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBatters = (s.batting || []).filter((b) => {
    if (roleFilter === 'bowlers') return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="players-page">
      {/* Active Player Spotlight & Biometrics */}
      <div style={{ marginBottom: 16 }}>
        <PlayerSpotlight s={s} />
      </div>

      {/* Top Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 16, padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>Role Filter:</span>
            <button
              className={`btn small ${roleFilter === 'all' ? '' : 'ghost'}`}
              onClick={() => setRoleFilter('all')}
            >
              All Squad
            </button>
            <button
              className={`btn small ${roleFilter === 'batters' ? '' : 'ghost'}`}
              onClick={() => setRoleFilter('batters')}
            >
              Batters Only
            </button>
            <button
              className={`btn small ${roleFilter === 'bowlers' ? '' : 'ghost'}`}
              onClick={() => setRoleFilter('bowlers')}
            >
              Bowlers Only
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="player-search" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
              Search:
            </label>
            <input
              id="player-search"
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 180, padding: '4px 8px', fontSize: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Batting Performance Table */}
      {roleFilter !== 'bowlers' && (
        <Card title="Batting Performance &amp; Strike Rate Analysis" style={{ marginBottom: 16 }}>
          <div className="scroll">
            <Table
              head={['Batter', 'Dismissal Status', 'Runs', 'Balls', '4s', '6s', 'SR', 'Control Index']}
              rows={filteredBatters.map((b) => [
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{b.name}</span>,
                <span
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: b.status === 'out' ? 'var(--danger)' : 'var(--ok)'
                  }}
                >
                  {b.status === 'out' ? 'OUT' : '★ NOT OUT'}
                </span>,
                <b style={{ color: '#ffffff', fontSize: '14px' }}>{b.runs}</b>,
                b.balls,
                <span style={{ color: 'var(--four)', fontWeight: 700 }}>{b.fours}</span>,
                <span style={{ color: 'var(--six)', fontWeight: 700 }}>{b.sixes}</span>,
                b.sr,
                `${b.controlPct}%`
              ])}
            />
            {!filteredBatters.length && (
              <p style={{ padding: 12, color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
                No batters match search query.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Bowling Figures Table */}
      {roleFilter !== 'batters' && (
        <Card title="Bowling Figures &amp; Pressure Metrics" style={{ marginBottom: 16 }}>
          <div className="scroll">
            <BowlingTable s={s} />
          </div>
        </Card>
      )}

      {/* Key Analytical Player Insights */}
      <div className="grid g3">
        <Card title="Match MVP Contender">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: '#1c1c1c', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                {s.batters[0]?.name || 'Top Batter'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}>
                Impact Rating: 94.6 &bull; +28.4% Win Shift
              </div>
            </div>
          </div>
        </Card>

        <Card title="Leading Bowler Spell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: '#1c1c1c', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                {s.bowler.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                Econ: {s.bowler.econ} &bull; Dots: {s.bowler.dots}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Boundary Contributions">
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', padding: '6px 0' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>FOURS (4s)</div>
              <div style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--four)', marginTop: 2 }}>
                {s.batting.reduce((sum, b) => sum + (b.fours || 0), 0)}
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--line)' }}></div>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>SIXES (6s)</div>
              <div style={{ fontSize: '24px', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--six)', marginTop: 2 }}>
                {s.batting.reduce((sum, b) => sum + (b.sixes || 0), 0)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
