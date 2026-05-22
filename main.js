// HMS'ai Hospital Main Application Controller & Router
import { HMSDatabase, ROLES_PERMISSIONS, USERS } from './data.js';

// Screen Module Imports
import { initMastersScreen } from './masters.js';
import { initRegistrationScreen } from './registration.js';
import { initAppointmentsScreen } from './appointments.js';
import { initTriageScreen } from './triage.js';
import { initNurseAssessmentScreen } from './nurse.js';
import { initLabRadiologyScreen } from './lab_radiology.js';
import { initPharmacyScreen } from './pharmacy.js';
import { initBillingScreen } from './billing.js';

// Instantiate Core Database
const db = new HMSDatabase();

// Current State
let currentUser = USERS[0]; // Admin by default
let activeView = 'dashboard';
let ecgAnimationId = null;

// DOM Elements
const systemTimeEl = document.getElementById('system-time');
const userSelectEl = document.getElementById('current-user-select');
const workspaceEl = document.getElementById('workspace-container');
const activeScreenTitleEl = document.getElementById('active-screen-title');
const logoSectionEl = document.querySelector('.logo-section');
const menuItems = document.querySelectorAll('.menu-item');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupClock();
  setupRoleSwitcher();
  setupSidebarNavigation();
  
  // Default to Dashboard
  loadView('dashboard');
  
  // Listen for real-time ledger updates
  window.addEventListener('hms-ledger-update', (e) => {
    appendLedgerLog(e.detail);
  });
});

// Setup dynamic system date-time clock
function setupClock() {
  const updateTime = () => {
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    };
    systemTimeEl.textContent = now.toLocaleString('en-US', options).replace(/,/g, '');
  };
  updateTime();
  setInterval(updateTime, 1000);
}

// Setup User Role Switcher & permissions
function setupRoleSwitcher() {
  // Populate role select
  userSelectEl.innerHTML = USERS.map(u => `<option value="${u.id}">${u.name} (${u.role.toUpperCase()})</option>`).join('');
  
  userSelectEl.addEventListener('change', (e) => {
    const selectedUserId = e.target.value;
    currentUser = USERS.find(u => u.id === selectedUserId);
    db.logTransaction('Security', `Session switch: ${currentUser.name} signed in as ${currentUser.role.toUpperCase()}`, 'SUCCESS');
    applyPermissions();
    // Refresh current view with new permissions
    loadView(activeView);
  });
  
  applyPermissions();
}

function applyPermissions() {
  const allowedModules = ROLES_PERMISSIONS[currentUser.role] || [];
  
  menuItems.forEach(item => {
    const viewName = item.getAttribute('data-view');
    // Admin always has access. For others, check permission list.
    if (currentUser.role === 'admin' || allowedModules.includes(viewName)) {
      item.classList.remove('locked');
    } else {
      item.classList.add('locked');
    }
  });
}

// Setup Sidebar Click Listeners
function setupSidebarNavigation() {
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.getAttribute('data-view');
      const allowedModules = ROLES_PERMISSIONS[currentUser.role] || [];
      
      if (currentUser.role !== 'admin' && !allowedModules.includes(viewName)) {
        // Show restricted access screen
        loadView(viewName, true); // locked = true
      } else {
        loadView(viewName);
      }
    });
  });
  
  // Clicking logo goes to Dashboard
  logoSectionEl.style.cursor = 'pointer';
  logoSectionEl.addEventListener('click', () => {
    loadView('dashboard');
  });
}

// Main View Loader
export function loadView(viewName, isLocked = false) {
  activeView = viewName;
  
  // Clean up any active intervals/animations (like ECG)
  if (ecgAnimationId) {
    cancelAnimationFrame(ecgAnimationId);
    ecgAnimationId = null;
  }
  
  // Highlight active sidebar menu item
  menuItems.forEach(item => {
    if (item.getAttribute('data-view') === viewName && !isLocked) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  if (isLocked) {
    activeScreenTitleEl.textContent = 'Access Restricted';
    renderAccessDenied();
    return;
  }
  
  // Update Title
  activeScreenTitleEl.textContent = getScreenTitle(viewName);
  
  // Route to subcomponents
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'masters':
      initMastersScreen(db, workspaceEl);
      break;
    case 'registration':
      initRegistrationScreen(db, workspaceEl);
      break;
    case 'appointments':
      initAppointmentsScreen(db, workspaceEl);
      break;
    case 'triage':
      initTriageScreen(db, workspaceEl);
      break;
    case 'nurse_assessment':
      initNurseAssessmentScreen(db, workspaceEl);
      break;
    case 'lab_radiology':
      initLabRadiologyScreen(db, workspaceEl);
      break;
    case 'pharmacy':
      initPharmacyScreen(db, workspaceEl);
      break;
    case 'insurance_billing':
      initBillingScreen(db, workspaceEl);
      break;
    case 'ledger':
      renderLedgerScreen();
      break;
    default:
      renderDashboard();
  }
}

function getScreenTitle(view) {
  const map = {
    dashboard: 'Hospital Telemetry Control',
    masters: 'Hospital Masters Registry',
    registration: 'Patient Admission & Registration',
    appointments: 'Appointments Management Hub',
    triage: 'AI Clinical Triage Assistant',
    nurse_assessment: 'Nurse Care & Assessment',
    lab_radiology: 'AI Laboratory & Radiology Hub',
    pharmacy: 'Smart Pharmacy Logistics',
    insurance_billing: 'AI Billing & e-Claims Portal',
    ledger: 'Automated Transactions Ledger'
  };
  return map[view] || 'HMS\'ai Hospital';
}

// Render Access Denied View
function renderAccessDenied() {
  workspaceEl.innerHTML = `
    <div class="access-denied-screen card glow-secondary" style="max-width: 600px; margin: 80px auto;">
      <i class="fas fa-user-shield"></i>
      <h2>Access Restructured</h2>
      <p>Your current user role <strong>[${currentUser.role.toUpperCase()}]</strong> does not have permission to execute transactions in this module.</p>
      <p style="margin-top: 10px; font-size: 13px; color: var(--color-text-muted);">Please use the active role selector in the top bar to switch to a role with administrative or specific clinical clearance (e.g., Administrator, Doctor, Nurse).</p>
    </div>
  `;
}

// Render Dashboard (Default Home Panel)
function renderDashboard() {
  // Read stats from DB
  const patientsCount = db.get('patients').length;
  const apptsCount = db.get('appointments').filter(a => a.status === 'Scheduled').length;
  const labPending = db.get('lab_orders').filter(o => o.status === 'Pending').length;
  const inventory = db.get('inventory');
  
  // Calculate total stock levels
  let totalMeds = 0;
  Object.keys(inventory).forEach(store => {
    totalMeds += inventory[store].reduce((sum, med) => sum + med.stock, 0);
  });

  workspaceEl.innerHTML = `
    <!-- Top Row Statistics Cards -->
    <div class="grid-container">
      <div class="card col-3 stat-box" style="grid-column: span 3; background: var(--bg-surface);">
        <div class="stat-info">
          <h3 style="color: var(--text-primary);">${patientsCount}</h3>
          <p style="color: var(--text-secondary);">Total Patients</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-primary);"><i class="fas fa-users"></i></div>
      </div>
      
      <div class="card col-3 stat-box" style="grid-column: span 3; background: var(--bg-surface);">
        <div class="stat-info">
          <h3 style="color: var(--text-primary);">${apptsCount}</h3>
          <p style="color: var(--text-secondary);">Active Appointments</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-primary);"><i class="fas fa-calendar-check"></i></div>
      </div>
      
      <div class="card col-3 stat-box" style="grid-column: span 3; background: var(--bg-surface); border-top: 2px solid var(--accent-warning);">
        <div class="stat-info">
          <h3 style="color: var(--text-primary);">${labPending}</h3>
          <p style="color: var(--text-secondary);">Pending Diagnostic Tests</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-warning);"><i class="fas fa-vials"></i></div>
      </div>
      
      <div class="card col-3 stat-box" style="grid-column: span 3; background: var(--bg-surface); border-top: 2px solid var(--accent-success);">
        <div class="stat-info">
          <h3 style="color: var(--text-primary);">${totalMeds}</h3>
          <p style="color: var(--text-secondary);">Total Stock Items</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-success);"><i class="fas fa-warehouse"></i></div>
      </div>
    </div>

    <!-- Revenue & Collection Chart Row -->
    <div class="grid-container" style="margin-bottom: 24px;">
      <div class="card" style="grid-column: span 12; background: var(--bg-surface);">
        <div class="card-title">
          <span>Daily Revenue & Collection Trends</span>
          <i class="fas fa-chart-line" style="color: var(--accent-success);"></i>
        </div>
        <div style="padding: 16px; height: 320px; width: 100%;">
          <canvas id="revenue-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Middle Row: Vital Signs Simulator & AI Telemetry -->
    <div class="grid-container">
      
      <!-- Vital Signs Simulator -->
      <div class="card" style="grid-column: span 6; background: var(--bg-surface);">
        <div class="card-title">
          <span>Live ICU Patient Telemetry (Bed 104)</span>
          <i class="fas fa-heartbeat" style="color: #ff2a6d; animation: pulse-glow 1s infinite;"></i>
        </div>
        <div class="vital-display-card">
          <div class="canvas-container">
            <canvas id="ecg-canvas"></canvas>
          </div>
          <div class="vital-reading-metrics">
            <div class="metric-item">
              <div class="val pulse" id="ecg-pulse">78</div>
              <div class="lbl">BPM (Heart Rate)</div>
            </div>
            <div class="metric-item">
              <div class="val" style="color: var(--color-info);">120/80</div>
              <div class="lbl">BP (mmHg)</div>
            </div>
            <div class="metric-item">
              <div class="val" style="color: var(--color-success);">98%</div>
              <div class="lbl">SpO2 (Oxygen)</div>
            </div>
            <div class="metric-item">
              <div class="val" style="color: var(--color-warning);">36.8°C</div>
              <div class="lbl">Temp (Celcius)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Hospital Telemetry Status -->
      <div class="card" style="grid-column: span 6; background: var(--bg-surface);">
        <div class="card-title">
          <span>AI Cognitive Agents Overview</span>
          <i class="fas fa-microchip" style="color: var(--accent-primary);"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
            <span style="color: var(--text-secondary);"><i class="fas fa-brain" style="width:20px; color:var(--text-muted);"></i> AI Triage Classifier:</span>
            <span class="badge badge-success">Online & Learning</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
            <span style="color: var(--text-secondary);"><i class="fas fa-keyboard" style="width:20px; color:var(--text-muted);"></i> Audio Consultation Scribe:</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-success);">Online (Transcribing)</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
            <span style="color: var(--text-secondary);"><i class="fas fa-file-signature" style="width:20px; color:var(--text-muted);"></i> DHA / KSA e-Claims Assessor:</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-success);">Online (API Auto-Approving)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 6px;">
            <span style="color: var(--text-secondary);"><i class="fas fa-truck-loading" style="width:20px; color:var(--text-muted);"></i> Ward Stock Automated Dispatcher:</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-success);">Online (Drone Ready)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Scrolling AI Ledger Ticker -->
    <div class="card" style="background: var(--bg-surface);">
      <div class="card-title">
        <span>System-Wide AI Automated Transaction Ledger (Live Stream)</span>
        <i class="fas fa-terminal"></i>
      </div>
      <div class="ledger-view" id="live-ledger-ticker">
        <!-- populated dynamically -->
      </div>
    </div>
  `;

  // Start Animations and Charts
  initECGAnimation();
  initRevenueChart();
  
  // Populate Initial Ledger Logs
  const tickerEl = document.getElementById('live-ledger-ticker');
  const ledger = db.get('ledger') || [];
  // Show last 10 logs
  tickerEl.innerHTML = ledger.slice(-10).map(log => renderLedgerRow(log)).join('');
  tickerEl.scrollTop = tickerEl.scrollHeight;
}

// Initialize Daily Revenue Chart using Chart.js
function initRevenueChart() {
  const ctx = document.getElementById('revenue-chart');
  if (!ctx) return;
  
  // Simulated last 7 days data
  const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today'];
  const consultationRev = [12000, 15000, 14500, 18000, 16500, 11000, 19500];
  const diagnosticRev = [8500, 9200, 11000, 10500, 13000, 7500, 12800];
  const pharmacyRev = [4200, 5100, 4800, 6200, 5900, 3800, 7100];
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Consultations (AED)',
          data: consultationRev,
          backgroundColor: 'rgba(99, 102, 241, 0.8)', // Primary
          borderRadius: 4
        },
        {
          label: 'Diagnostics (AED)',
          data: diagnosticRev,
          backgroundColor: 'rgba(245, 158, 11, 0.8)', // Warning
          borderRadius: 4
        },
        {
          label: 'Pharmacy (AED)',
          data: pharmacyRev,
          backgroundColor: 'rgba(16, 185, 129, 0.8)', // Success
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e2e8f0' }
        },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { 
          stacked: true, 
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: { 
          stacked: true, 
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}

// Sinus-Wave ECG Simulator Drawing Logic
function initECGAnimation() {
  const canvas = document.getElementById('ecg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Resize canvas to element size
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  
  let x = 0;
  const speed = 2.5;
  const points = [];
  const height = canvas.height;
  const midY = height / 2;
  const width = canvas.width;
  
  // Buffer points
  for (let i = 0; i < width; i++) {
    points.push(midY);
  }

  // Live Pulse update helper
  const pulseEl = document.getElementById('ecg-pulse');

  function draw() {
    if (!document.getElementById('ecg-canvas')) return; // Stop if navigate away
    
    ctx.clearRect(0, 0, width, height);
    
    // Shift points left
    points.shift();
    
    // Generate next point based on a sinus heartbeat wave
    let nextY = midY;
    const cycle = Math.floor(x) % 120; // period of heartbeat
    
    if (cycle > 10 && cycle < 20) {
      // P wave
      nextY = midY - 6 * Math.sin((cycle - 10) * Math.PI / 10);
    } else if (cycle >= 20 && cycle < 22) {
      // Q dip
      nextY = midY + 4 * (cycle - 20);
    } else if (cycle >= 22 && cycle < 25) {
      // R Peak
      nextY = midY - 32 * Math.sin((cycle - 22) * Math.PI / 6) + 4;
    } else if (cycle >= 25 && cycle < 28) {
      // S dip
      nextY = midY + 12 * Math.sin((cycle - 25) * Math.PI / 6);
    } else if (cycle >= 35 && cycle < 50) {
      // T wave
      nextY = midY - 8 * Math.sin((cycle - 35) * Math.PI / 15);
    }
    
    // Add small random noise to look realistic
    nextY += (Math.random() - 0.5) * 1.5;
    
    points.push(nextY);
    x += speed;
    
    // Draw the ECG line
    ctx.strokeStyle = '#ff2a6d';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff2a6d';
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      if (i === 0) {
        ctx.moveTo(i, points[i]);
      } else {
        ctx.lineTo(i, points[i]);
      }
    }
    ctx.stroke();
    
    // Periodically fluctuate BPM slightly
    if (Math.random() < 0.005 && pulseEl) {
      const currentBpm = parseInt(pulseEl.textContent);
      const delta = Math.random() > 0.5 ? 1 : -1;
      const nextBpm = Math.min(90, Math.max(65, currentBpm + delta));
      pulseEl.textContent = nextBpm;
    }
    
    ecgAnimationId = requestAnimationFrame(draw);
  }
  
  ecgAnimationId = requestAnimationFrame(draw);
}

// Render ledger row string
function renderLedgerRow(log) {
  const time = new Date(log.timestamp).toLocaleTimeString();
  return `
    <div class="ledger-row">
      <span class="ledger-time">[${time}]</span>
      <span class="ledger-action">${log.module.toUpperCase()} &gt; ${log.action}</span>
      <span class="ledger-status ${log.status}">${log.status}</span>
    </div>
  `;
}

// Append live ticker logs
function appendLedgerLog(log) {
  const tickerEl = document.getElementById('live-ledger-ticker');
  if (tickerEl) {
    tickerEl.innerHTML += renderLedgerRow(log);
    // Keep at most 20 elements in DOM
    while (tickerEl.childElementCount > 20) {
      tickerEl.removeChild(tickerEl.firstElementChild);
    }
    tickerEl.scrollTop = tickerEl.scrollHeight;
  }
}

// Direct ledger view screen render
function renderLedgerScreen() {
  const ledger = db.get('ledger') || [];
  workspaceEl.innerHTML = `
    <div class="card" style="background: var(--bg-surface); height: 100%; display: flex; flex-direction: column;">
      <div class="card-title" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border-subtle); margin: -20px -20px 20px -20px; background: var(--bg-elevated); border-radius: 8px 8px 0 0;">
        <span style="font-size: 16px; font-weight: 600; color: #fff;">System Automated Transaction Audit Ledger</span>
        <button class="btn btn-primary btn-sm" id="clear-ledger-btn"><i class="fas fa-trash"></i> Clear Logs</button>
      </div>
      <div style="flex: 1; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0; z-index: 5;">
            <tr>
              <th style="text-align: left; padding: 12px 16px;">Timestamp</th>
              <th style="text-align: left; padding: 12px 16px;">Module</th>
              <th style="text-align: left; padding: 12px 16px;">Action Description</th>
              <th style="text-align: left; padding: 12px 16px;">Status</th>
            </tr>
          </thead>
          <tbody id="audit-ledger-table-body">
            ${ledger.slice().reverse().map(log => {
              let badgeClass = 'rgba(255, 255, 255, 0.1)';
              let badgeColor = 'var(--text-secondary)';
              if (log.status === 'SUCCESS') { badgeClass = 'rgba(16, 185, 129, 0.1)'; badgeColor = 'var(--accent-success)'; }
              else if (log.status === 'WARNING') { badgeClass = 'rgba(245, 158, 11, 0.1)'; badgeColor = 'var(--accent-warning)'; }
              else if (log.status === 'CRITICAL') { badgeClass = 'rgba(239, 68, 68, 0.1)'; badgeColor = 'var(--accent-danger)'; }
              
              return `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 12px 16px; font-size: 12px; color: var(--text-secondary);">${new Date(log.timestamp).toLocaleString()}</td>
                <td style="padding: 12px 16px; font-size: 12px;"><span style="background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); padding: 4px 8px; border-radius: 4px; font-weight: 600;">${log.module}</span></td>
                <td style="padding: 12px 16px; font-family: monospace; font-size: 12px; color: var(--text-primary);">${log.action}</td>
                <td style="padding: 12px 16px;">
                  <span style="background: ${badgeClass}; color: ${badgeColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${log.status}</span>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  document.getElementById('clear-ledger-btn').addEventListener('click', () => {
    db.save('ledger', [{ id: 'LOG-INIT', timestamp: new Date().toISOString(), module: 'System', action: 'Ledger cleared by Admin', status: 'SUCCESS' }]);
    renderLedgerScreen();
  });
}
