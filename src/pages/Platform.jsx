import { Fragment, useState } from 'react';
import { API } from '../api/api.js';
import { Card } from '../components/ui.jsx';

export default function Platform() {
  const C = window.IPL_CONFIG || {};
  const [healthStatus, setHealthStatus] = useState('');

  const deployedConfig = [
    ['Hosting Method', 'Amazon S3 Static Website Hosting'],
    ['AWS Region', 'eu-north-1 (Stockholm)'],
    ['Storage Bucket', 'ipl-live-analytics-748009208411-eu-north-1-production'],
    ['Endpoint Protocol', 'HTTP (S3 Native Website Endpoint)'],
    ['Active Mode', `${API.mode.toUpperCase()} (Client-Side State Engine)`],
    ['Runtime Config', 'public/config.js (Loaded dynamically without rebuilding)'],
    ['API Base URL', C.API_BASE_URL || '/api'],
    ['Poll Interval', `${C.POLL_INTERVAL_MS || 3000} ms`],
    ['Auth Service Status', C.AUTH?.ENABLED ? 'Enabled' : 'Disabled (Presentation Mode)']
  ];

  const checkHealth = () => {
    setHealthStatus('Querying simulation engine status...');
    API.health()
      .then((res) => {
        setHealthStatus(`SYSTEM HEALTHY: ${JSON.stringify(res)}`);
      })
      .catch((err) => {
        setHealthStatus(`Health Check Error: ${err.message}`);
      });
  };

  return (
    <div className="platform-page">
      {/* Implemented vs Planned Architecture Diagram */}
      <Card title="System Architecture &amp; Delivery Topology" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--ok)', fontWeight: 700 }}>
            ● ACTIVE IMPLEMENTATION (CURRENT DEPLOYMENT)
          </span>
        </div>

        <div className="arch">
          <div className="node strong">
            End User Browser<br />
            <small>Desktop &amp; Mobile Responsive</small>
          </div>
          <i>&rarr;</i>
          <div className="node strong">
            Amazon S3 Static Hosting<br />
            <small>eu-north-1 Bucket &bull; Port 80 HTTP</small>
          </div>
          <i>&rarr;</i>
          <div className="node strong">
            React 18 + Vite SPA<br />
            <small>SVG Charts &bull; Zero Heavy Dependencies</small>
          </div>
          <i>&rarr;</i>
          <div className="node strong">
            Client Simulation Engine<br />
            <small>Strict Cricket Rules &bull; In-Memory State</small>
          </div>
        </div>

        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', fontWeight: 700 }}>
            ○ TARGET CLOUD INTEGRATION ARCHITECTURE (PLANNED BACKEND ROADMAP)
          </span>
        </div>

        <div className="arch sub">
          <div className="node" style={{ borderColor: '#333' }}>
            Live Feed Provider<br />
            <small>Ball-by-Ball Match Feed</small>
          </div>
          <i>&rarr;</i>
          <div className="node" style={{ borderColor: '#333' }}>
            API Gateway / ALB<br />
            <small>TLS Termination &amp; Routing</small>
          </div>
          <i>&rarr;</i>
          <div className="node" style={{ borderColor: '#333' }}>
            ECS / EC2 Microservices<br />
            <small>Python XGBoost In-Play Win Prob</small>
          </div>
          <i>&rarr;</i>
          <div className="node" style={{ borderColor: '#333' }}>
            Amazon ElastiCache Redis<br />
            <small>Sub-millisecond Active State</small>
          </div>
        </div>
      </Card>

      {/* Cloud Configuration & Diagnostics Grid */}
      <div className="grid g2">
        <Card title="Current Cloud Deployment Parameters">
          <dl className="kv">
            {deployedConfig.map(([label, val]) => (
              <Fragment key={label}>
                <dt>{label}</dt>
                <dd>{val}</dd>
              </Fragment>
            ))}
          </dl>

          <button className="btn" onClick={checkHealth}>
            Execute Engine Diagnostics
          </button>

          {healthStatus && (
            <p style={{ marginTop: 12, fontFamily: 'JetBrains Mono', fontSize: '11px', color: healthStatus.includes('HEALTHY') ? 'var(--ok)' : 'var(--danger)' }}>
              {healthStatus}
            </p>
          )}
        </Card>

        {/* UN SDGs Alignment */}
        <Card title="UN Sustainable Development Goals (SDG Alignment)">
          <ul className="sdg">
            <li>
              <b>SDG 9: Industry, Innovation and Infrastructure</b>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 2 }}>
                Reproducible AWS infrastructure deployment with least-privilege IAM policies and automated delivery scripts.
              </div>
            </li>
            <li>
              <b>SDG 8: Decent Work and Economic Growth</b>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 2 }}>
                High-efficiency real-time telemetry and transparent computational decision-making tools for analysts.
              </div>
            </li>
            <li>
              <b>SDG 4: Quality Education &amp; Computational Literacy</b>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 2 }}>
                Accessible open-source sports data models, SHAP feature importance breakdowns, and probability analysis.
              </div>
            </li>
            <li>
              <b>SDG 17: Partnerships for the Goals</b>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 2 }}>
                Standardized JSON data contracts facilitating interoperability across external leagues, scoring engines, and platforms.
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
