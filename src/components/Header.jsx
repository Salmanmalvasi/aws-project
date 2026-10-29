import { useState } from 'react';
import { API } from '../api/api.js';

const LINKS = [
  ['live', 'Live Match'],
  ['analytics', 'Analytics'],
  ['players', 'Players'],
  ['compare', 'Compare'],
  ['history', 'History'],
  ['platform', 'Platform & Cloud']
];

export default function Header({ route, status, sim, onSim, alerts, onAlerts, theme, onTheme, user, onLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Telemetry Ribbon - Honest Data Provenance */}
      <div className="telemetry-ribbon" role="region" aria-label="System Telemetry">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span className="status-live">
            <span className="dot pulse-dot"></span>
            SIMULATION MODE &bull; CLIENT-SIDE STREAM
          </span>
          <div className="telemetry-metrics">
            <span>Hosting: <b>AWS S3 (eu-north-1)</b></span>
            <span>Protocol: <b>HTTP S3-Website</b></span>
            <span>Engine: <b>Deterministic Event Loop</b></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
            Data Status: <b style={{ color: '#ffffff' }}>Illustrative Demo Fixtures</b>
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="top" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a className="brand" href="#live" aria-label="IPL Live Analytics Home">
            <span className="logo" aria-hidden="true">IPL</span>
            <span>IPL Live Analytics</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={'#' + id}
                className={route === id ? 'on' : ''}
                aria-current={route === id ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tools and Controls */}
        <div className="tools">
          <span className="pill sim" title="Application is currently running on simulated match stream">
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)' }}></span>
            SIMULATION
          </span>

          <label className="switch" title="Toggle between local simulation and backend ingestion">
            <input type="checkbox" role="switch" checked={sim} onChange={(e) => onSim(e.target.checked)} />
            <span className="track" />
            <span className="lbl">{sim ? 'Simulation' : 'Live API'}</span>
          </label>

          <button
            className={`btn ghost small ${alerts ? 'active-pill' : ''}`}
            onClick={onAlerts}
            title="Toggle broadcast alerts for boundaries and wickets"
          >
            Alerts: {alerts ? 'ON' : 'OFF'}
          </button>

          <button className="btn ghost small" onClick={onTheme} aria-label="Toggle visual theme">
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>

          <button className="btn small" onClick={onLogin}>
            {user || 'Sign in'}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn ghost small mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={'#' + id}
              className={route === id ? 'on' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export function SimBanner() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState('2500');
  const [scenario, setScenario] = useState('climax');

  const handlePause = () => {
    API.sim.togglePause();
    setPaused(!paused);
  };

  const handleSpeed = (val) => {
    setSpeed(val);
    API.sim.setSpeed(+val);
  };

  const handleZeroStart = () => {
    setScenario('zero');
    API.sim.resetToZero();
  };

  const handleClimax = () => {
    setScenario('climax');
    API.sim.resetToClimax();
  };

  const handleStep = () => {
    API.sim.stepBall();
  };

  return (
    <aside className="sim-controls-bar" aria-label="Simulation Controls">
      <div className="sim-controls-left">
        <span className="sim-tag">
          <span
            className="pulse-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: paused ? 'var(--muted)' : 'var(--ok)'
            }}
          ></span>
          {paused ? 'STREAM PAUSED' : 'STREAM ACTIVE'}
        </span>

        {/* Scenario Switcher: 0/0 vs 15.0 ov */}
        <div style={{ display: 'inline-flex', background: '#0a0a0a', padding: '2px', borderRadius: '6px', border: '1px solid var(--line)', gap: '2px' }}>
          <button
            className={`btn small ${scenario === 'zero' ? '' : 'ghost'}`}
            onClick={handleZeroStart}
            title="Start match from 0 runs, 0 wickets (0.0 overs) for both sides"
            style={{ fontSize: '11px', padding: '3px 8px' }}
          >
            ⚡ Start 0/0 (0.0 ov)
          </button>
          <button
            className={`btn small ${scenario === 'climax' ? '' : 'ghost'}`}
            onClick={handleClimax}
            title="Jump straight to death overs thriller (15.0 ov)"
            style={{ fontSize: '11px', padding: '3px 8px' }}
          >
            🔥 15.0 ov Climax
          </button>
        </div>

        <button
          className="btn ghost small"
          onClick={handlePause}
          title="Pause or resume the automated match delivery loop"
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* Step 1 Ball button */}
        <button
          className="btn ghost small"
          onClick={handleStep}
          title="Bowls exactly one delivery manually on demand"
          style={{ borderColor: 'var(--four)', color: 'var(--four)', fontWeight: 600 }}
        >
          ▶| Step 1 Ball
        </button>

        <div className="sim-speed-control">
          <span>Speed:</span>
          <select
            value={speed}
            onChange={(e) => handleSpeed(e.target.value)}
            aria-label="Simulation delivery speed"
          >
            <option value="2500">1x (2.5s)</option>
            <option value="1200">2x (1.2s)</option>
            <option value="600">5x (0.6s)</option>
            <option value="4500">0.5x (4.5s)</option>
          </select>
        </div>
      </div>

      <div className="sim-controls-right">
        <span className="sim-label">Trigger Ball:</span>
        <button className="sim-ball-btn" onClick={() => API.sim.triggerManualBall('0')} title="Simulate Dot Ball (0 runs)">
          0 Dot
        </button>
        <button className="sim-ball-btn" onClick={() => API.sim.triggerManualBall('1')} title="Simulate Single (+1 run)">
          +1
        </button>
        <button className="sim-ball-btn" onClick={() => API.sim.triggerManualBall('2')} title="Simulate Double (+2 runs)">
          +2
        </button>
        <button className="sim-ball-btn four" onClick={() => API.sim.triggerManualBall('4')} title="Simulate Boundary Four (+4 runs)">
          +4 FOUR
        </button>
        <button className="sim-ball-btn six" onClick={() => API.sim.triggerManualBall('6')} title="Simulate Maximum Six (+6 runs)">
          +6 SIX
        </button>
        <button className="sim-ball-btn wkt" onClick={() => API.sim.triggerManualBall('W')} title="Simulate Dismissal (Wicket)">
          WICKET!
        </button>
        <button className="sim-ball-btn" onClick={() => API.sim.triggerManualBall('WD')} title="Simulate Wide Extra (+1 extra run)">
          Wide
        </button>
      </div>
    </aside>
  );
}
