import { useEffect, useState } from 'react';
import { API } from '../api/api.js';
import { Card } from '../components/ui.jsx';
import { CompareRows } from '../components/charts.jsx';

const LOWER_BETTER = ['Bowling Economy'];

export default function Compare({ mode }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setErr(false);
    API.compare('CSK', 'RCB').then(setD).catch(() => setErr(true));
  }, [mode]);

  return (
    <div className="compare-page">
      <Card title="Team Comparative Strength &amp; Phase Index" style={{ marginBottom: 16 }}>
        {err && <p className="muted">Comparison dataset unavailable.</p>}
        {d && (
          <>
            <div className="cmp-head">
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="swatch" style={{ background: '#ffffff', width: 12, height: 12, borderRadius: '50%' }} />
                <b>{d.a.name}</b> ({d.a.code})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <b>{d.b.name}</b> ({d.b.code})
                <span className="swatch" style={{ background: '#737373', width: 12, height: 12, borderRadius: '50%' }} />
              </span>
            </div>

            <CompareRows a={d.a} b={d.b} lowerBetter={LOWER_BETTER} />

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
              NOTE: Comparative metric bars are normalized on a 100% proportional basis. Lower values represent statistical superiority for: {LOWER_BETTER.join(', ')}.
            </div>
          </>
        )}
      </Card>

      {/* Head to Head Historical Record Summary */}
      <div className="grid g3">
        <Card title="Total Encounters">
          <div style={{ fontSize: '32px', fontFamily: 'JetBrains Mono', fontWeight: 900, color: '#ffffff' }}>
            34 Matches
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            All seasons (2008 &ndash; 2026)
          </div>
        </Card>

        <Card title="CSK Head-to-Head Wins">
          <div style={{ fontSize: '32px', fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--ok)' }}>
            21 Wins (62%)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            Highest score: 226/6
          </div>
        </Card>

        <Card title="RCB Head-to-Head Wins">
          <div style={{ fontSize: '32px', fontFamily: 'JetBrains Mono', fontWeight: 900, color: '#ffffff' }}>
            11 Wins (35%)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            Highest score: 218/5 (2 No-results)
          </div>
        </Card>
      </div>
    </div>
  );
}
