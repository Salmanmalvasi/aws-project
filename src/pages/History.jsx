import { useEffect, useState } from 'react';
import { API } from '../api/api.js';
import { Card, Table } from '../components/ui.jsx';

export default function History({ mode }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setErr(false);
    API.history().then(setRows).catch(() => setErr(true));
  }, [mode]);

  const filteredRows = (rows || []).filter((r) => {
    if (filter === 'csk') return r.result.includes('CSK');
    if (filter === 'rcb') return r.result.includes('RCB');
    return true;
  });

  return (
    <div className="history-page">
      <Card title="Curated IPL Match Archive (Sample Demo Dataset)" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`btn small ${filter === 'all' ? '' : 'ghost'}`}
              onClick={() => setFilter('all')}
            >
              All Matches
            </button>
            <button
              className={`btn small ${filter === 'csk' ? '' : 'ghost'}`}
              onClick={() => setFilter('csk')}
            >
              CSK Wins
            </button>
            <button
              className={`btn small ${filter === 'rcb' ? '' : 'ghost'}`}
              onClick={() => setFilter('rcb')}
            >
              RCB Wins
            </button>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
            Dataset: Verified Classic Encounters (2022&ndash;2025)
          </span>
        </div>

        {err && <p className="muted">Historical archive query unavailable.</p>}
        {filteredRows && (
          <div className="scroll">
            <Table
              head={['Season', 'Date', 'Match Fixture', 'Venue', 'Result Outcome', 'Top Performer']}
              rows={filteredRows.map((r) => [
                <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>{r.season}</span>,
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>{r.date}</span>,
                <b style={{ color: '#ffffff' }}>{r.teams}</b>,
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.venue}</span>,
                <span
                  style={{
                    color: r.result.includes('CSK') ? 'var(--ok)' : '#ffffff',
                    fontWeight: 600
                  }}
                >
                  {r.result}
                </span>,
                <span style={{ color: 'var(--text-secondary)' }}>{r.topScorer}</span>
              ])}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
