const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to format seconds into readable uptime (Exported for Unit Testing)
function formatUptime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '0h 0m 0s';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

// Health Check API endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
    uptimeSeconds: process.uptime(),
    system: {
      platform: os.platform(),
      release: os.release(),
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`
    }
  });
});

// Home Page serving a high-fidelity DevOps Dashboard UI
app.get('/', (req, res) => {
  const serverUptime = formatUptime(process.uptime());
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevOps CI/CD Demo Application</title>
  <!-- Google Fonts for premium typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #090d16 0%, #111827 50%, #0c1020 100%);
      --accent-color: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.4);
      --success-color: #10b981;
      --success-glow: rgba(16, 185, 129, 0.2);
      --card-bg: rgba(255, 255, 255, 0.03);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
      overflow-x: hidden;
    }

    /* Abstract glowing background shapes */
    .glow-sphere {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent-glow) 0%, rgba(99, 102, 241, 0) 70%);
      top: -100px;
      left: -100px;
      z-index: -1;
      filter: blur(40px);
    }
    .glow-sphere-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%);
      bottom: -150px;
      right: -100px;
      z-index: -1;
      filter: blur(40px);
    }

    .container {
      max-width: 900px;
      width: 100%;
      z-index: 1;
    }

    /* Glassmorphic card styling */
    .dashboard-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }

    .dashboard-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-color), var(--success-color));
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 1.5rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, #ffffff, #c7d2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--success-glow);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--success-color);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background-color: var(--success-color);
      border-radius: 50%;
      display: inline-block;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 8px var(--success-color); }
      100% { transform: scale(0.9); opacity: 0.6; }
    }

    .grid-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-box:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.2);
      background: rgba(255, 255, 255, 0.04);
    }

    .stat-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Live pipeline visual representation */
    .pipeline-container {
      margin-top: 2rem;
      padding: 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      border: 1px solid var(--card-border);
    }

    .pipeline-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pipeline-steps {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      position: relative;
      gap: 1rem;
    }

    .pipeline-step {
      flex: 1;
      min-width: 100px;
      text-align: center;
      position: relative;
    }

    .step-dot {
      width: 28px;
      height: 28px;
      background: #1f2937;
      border: 2px solid #374151;
      border-radius: 50%;
      margin: 0 auto 0.75rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      transition: all 0.4s;
    }

    .pipeline-step.active .step-dot {
      background: var(--accent-color);
      border-color: var(--accent-color);
      color: #ffffff;
      box-shadow: 0 0 15px var(--accent-color);
    }

    .pipeline-step.success .step-dot {
      background: var(--success-color);
      border-color: var(--success-color);
      color: #ffffff;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }

    .step-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      transition: color 0.3s;
    }

    .pipeline-step.success .step-name, .pipeline-step.active .step-name {
      color: #ffffff;
    }

    .action-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .btn {
      background: var(--accent-color);
      color: #ffffff;
      border: none;
      padding: 0.85rem 1.75rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:hover {
      background: #4f46e5;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-main);
      box-shadow: none;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted);
      box-shadow: none;
    }

    /* Live terminal box */
    .terminal-box {
      margin-top: 2rem;
      background: #05070c;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      color: #a7f3d0;
      display: none;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
      position: relative;
    }

    .terminal-header {
      color: var(--text-muted);
      font-size: 0.75rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 0.5rem;
    }

    footer {
      text-align: center;
      margin-top: 2.5rem;
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="glow-sphere"></div>
  <div class="glow-sphere-2"></div>

  <div class="container">
    <div class="dashboard-card">
      <header>
        <div>
          <h1>CI/CD Target Server</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Node.js Express DevOps Environment</p>
        </div>
        <span class="badge">
          <span class="badge-dot"></span>
          Server Running
        </span>
      </header>

      <div class="grid-stats">
        <div class="stat-box">
          <div class="stat-label">Environment</div>
          <div class="stat-value" style="color: #6366f1;">Docker Container</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Current Uptime</div>
          <div id="uptime-display" class="stat-value">${serverUptime}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Port Binding</div>
          <div class="stat-value">:3000</div>
        </div>
      </div>

      <div class="pipeline-container">
        <div class="pipeline-title">
          <svg style="width: 18px; height: 18px; fill: var(--accent-color);" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
          </svg>
          DevOps Pipeline Status
        </div>
        <div class="pipeline-steps">
          <div class="pipeline-step success">
            <div class="step-dot">✓</div>
            <div class="step-name">Checkout</div>
          </div>
          <div class="pipeline-step success">
            <div class="step-dot">✓</div>
            <div class="step-name">Install</div>
          </div>
          <div class="pipeline-step success">
            <div class="step-dot">✓</div>
            <div class="step-name">Test</div>
          </div>
          <div class="pipeline-step success">
            <div class="step-dot">✓</div>
            <div class="step-name">Build</div>
          </div>
          <div class="pipeline-step success">
            <div class="step-dot">✓</div>
            <div class="step-name">Push</div>
          </div>
          <div class="pipeline-step active">
            <div class="step-dot">▶</div>
            <div class="step-name">Deploy</div>
          </div>
        </div>
      </div>

      <div id="terminal" class="terminal-box">
        <div class="terminal-header">
          <span>GET /health response response_info</span>
          <span id="response-time">0ms</span>
        </div>
        <pre id="terminal-content">Waiting for health check trigger...</pre>
      </div>

      <div class="action-section">
        <button class="btn btn-secondary" onclick="window.open('/health', '_blank')">View JSON API</button>
        <button class="btn" onclick="testHealthCheck()">
          <svg style="width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.6 20 4 16.4 4 12S7.6 4 12 4 20 7.6 20 12 16.4 20 12 20M13 7H11V13H17V11H13V7Z" />
          </svg>
          Test Live API
        </button>
      </div>
    </div>

    <footer>
      <p>DevOps Experiment Project &bull; Built with Node.js &amp; Express</p>
    </footer>
  </div>

  <script>
    async"use strict";
    async function testHealthCheck() {
      const start = performance.now();
      const terminal = document.getElementById('terminal');
      const content = document.getElementById('terminal-content');
      const timeDisplay = document.getElementById('response-time');
      
      terminal.style.display = 'block';
      content.textContent = 'Pinging health check endpoint...';
      
      try {
        const response = await fetch('/health');
        const data = await response.json();
        const end = performance.now();
        const duration = Math.round(end - start);
        
        timeDisplay.textContent = duration + 'ms';
        content.textContent = JSON.stringify(data, null, 2);
        
        // Update live uptime in card
        if (data.uptime) {
          document.getElementById('uptime-display').textContent = data.uptime;
        }
      } catch (error) {
        timeDisplay.textContent = 'ERROR';
        content.textContent = 'Error connecting to /health: ' + error.message;
      }
    }
  </script>
</body>
</html>
  `;
  res.send(htmlContent);
});

// Start listening if app is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, formatUptime };
