export function initNurseAssessmentScreen(db, container) {
  function render() {
    const patients = db.get('patients') || [];
    const assessments = db.get('assessments') || [];
    const latestAsm = assessments.length > 0 ? assessments[assessments.length - 1] : null;

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Assessment Form -->
        <div class="input-pane">
          <div class="pane-header">Log Patient Vitals & Assessment</div>
          <div class="pane-content">
            ${patients.length === 0 ? `
              <div style="text-align:center; padding: 40px 20px; color: var(--text-muted); background: var(--bg-elevated); border-radius: 8px; border: 1px dashed var(--border-subtle);">
                <i class="fas fa-info-circle" style="font-size:32px; color:var(--accent-primary); margin-bottom:12px;"></i>
                <p style="font-size:13px;">Admit a patient in the Registration module before logging assessments.</p>
              </div>
            ` : `
              <form id="nurse-assessment-form">
                <div class="form-group">
                  <label for="nurse-patient-select">Patient</label>
                  <select id="nurse-patient-select" class="form-control" required>
                    ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
                  </select>
                </div>

                <!-- Vitals Entry -->
                <div style="background: var(--bg-elevated); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 16px;">
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-heartbeat" style="color: var(--accent-danger);"></i> Clinical Vitals
                  </div>
                  
                  <div class="flex-row">
                    <div class="form-group" style="flex: 1;">
                      <label for="vital-bp">Blood Pressure</label>
                      <input type="text" id="vital-bp" class="form-control" placeholder="120/80" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label for="vital-pulse">Pulse (bpm)</label>
                      <input type="number" id="vital-pulse" class="form-control" placeholder="72" min="30" max="200" required>
                    </div>
                  </div>
                  
                  <div class="flex-row">
                    <div class="form-group" style="flex: 1;">
                      <label for="vital-temp">Temp (°C)</label>
                      <input type="number" id="vital-temp" class="form-control" placeholder="36.8" step="0.1" min="30" max="45" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label for="vital-o2">SpO2 (%)</label>
                      <input type="number" id="vital-o2" class="form-control" placeholder="98" min="50" max="100" required>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="nurse-allergies">Drug / Food Allergies</label>
                  <input type="text" id="nurse-allergies" class="form-control" placeholder="Penicillin / None" required value="None">
                </div>

                <div class="form-group">
                  <label for="nurse-complaints">Chief Complaints & Notes</label>
                  <textarea id="nurse-complaints" class="form-control" rows="3" placeholder="Enter patient current pain points and symptoms..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;"><i class="fas fa-file-signature"></i> Log Assessment</button>
              </form>
            `}
          </div>
        </div>

        <!-- Output Pane: Vitals Dashboard & History -->
        <div class="output-pane">
          <div class="pane-header">Vitals Dashboard & History</div>
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            
            <!-- Real-time AI Alerts and latest Vitals -->
            <div style="padding: 20px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface);">
              ${!latestAsm ? `
                <div style="text-align: center; color: var(--text-muted); font-size: 13px;">
                  <i class="fas fa-chart-line" style="font-size: 32px; opacity: 0.5; margin-bottom: 12px;"></i><br>
                  Vitals telemetry will appear here once logged.
                </div>
              ` : `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="font-size: 14px; font-weight: 600; color: #fff;">Latest Vitals: ${latestAsm.patientId}</span>
                  <span style="font-size: 11px; color: var(--text-muted);">Nurse Clara • Just now</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px;">
                  <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase;">BP</div>
                    <div style="font-size: 16px; font-weight: 600; color: #fff; margin-top: 4px;">${latestAsm.vitals.bp}</div>
                  </div>
                  <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 11px; color: var(--text-secondary); text-transform: uppercase;">Pulse</div>
                    <div style="font-size: 16px; font-weight: 600; color: #fff; margin-top: 4px;">${latestAsm.vitals.pulse} <span style="font-size: 10px; font-weight: normal; color: var(--text-muted);">bpm</span></div>
                  </div>
                  <div style="background: ${latestAsm.vitals.temp > 38.5 ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-elevated)'}; border: 1px solid ${latestAsm.vitals.temp > 38.5 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'}; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 11px; color: ${latestAsm.vitals.temp > 38.5 ? 'var(--accent-warning)' : 'var(--text-secondary)'}; text-transform: uppercase;">Temp</div>
                    <div style="font-size: 16px; font-weight: 600; color: ${latestAsm.vitals.temp > 38.5 ? 'var(--accent-warning)' : '#fff'}; margin-top: 4px;">${latestAsm.vitals.temp} <span style="font-size: 10px; font-weight: normal;">°C</span></div>
                  </div>
                  <div style="background: ${latestAsm.vitals.o2 < 92 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-elevated)'}; border: 1px solid ${latestAsm.vitals.o2 < 92 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 11px; color: ${latestAsm.vitals.o2 < 92 ? 'var(--accent-danger)' : 'var(--text-secondary)'}; text-transform: uppercase;">SpO2</div>
                    <div style="font-size: 16px; font-weight: 600; color: ${latestAsm.vitals.o2 < 92 ? 'var(--accent-danger)' : '#fff'}; margin-top: 4px;">${latestAsm.vitals.o2}%</div>
                  </div>
                </div>

                ${latestAsm.vitals.o2 < 92 || latestAsm.vitals.temp > 38.5 ? `
                  <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px; padding: 12px; font-size: 12px; color: var(--accent-danger);">
                    <strong style="display: block; margin-bottom: 4px;"><i class="fas fa-exclamation-triangle"></i> AI Clinical Alerts Detected:</strong>
                    ${latestAsm.vitals.o2 < 92 ? '• <strong>HYPOXIA WARNING:</strong> Critical SpO2 level detected. Alert sent to ICU.<br>' : ''}
                    ${latestAsm.vitals.temp > 38.5 ? '• <strong>FEVER ALERT:</strong> Elevated core temperature detected. Suggesting antipyretics.' : ''}
                  </div>
                ` : `
                  <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 6px; padding: 10px 12px; font-size: 12px; color: var(--accent-success); display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-check-circle"></i> AI Analysis: Vitals are within normal clinical thresholds.
                  </div>
                `}
              `}
            </div>

            <!-- History Table -->
            <div style="flex: 1; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0;">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Patient</th>
                    <th style="text-align: left; padding: 12px 16px;">Details</th>
                    <th style="text-align: left; padding: 12px 16px;">Allergies</th>
                  </tr>
                </thead>
                <tbody>
                  ${assessments.length === 0 ? `
                    <tr><td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted);">No historical records found</td></tr>
                  ` : assessments.slice().reverse().map(asm => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 16px; font-weight: 600; color: #fff;">${asm.patientId}</td>
                      <td style="padding: 16px; font-size: 12px; color: var(--text-secondary); max-width: 250px;">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">"${asm.complaints}"</div>
                        <div style="font-size: 11px; color: var(--text-muted);">BP: ${asm.vitals.bp} | HR: ${asm.vitals.pulse} | Temp: ${asm.vitals.temp} | O2: ${asm.vitals.o2}%</div>
                      </td>
                      <td style="padding: 16px; font-size: 12px;">
                        <span style="background: ${asm.allergies.toLowerCase() === 'none' || !asm.allergies ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${asm.allergies.toLowerCase() === 'none' || !asm.allergies ? 'var(--accent-success)' : 'var(--accent-danger)'}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                          ${asm.allergies || 'None'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('nurse-assessment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const bp = document.getElementById('vital-bp').value;
        const pulse = parseInt(document.getElementById('vital-pulse').value);
        const temp = parseFloat(document.getElementById('vital-temp').value);
        const o2 = parseInt(document.getElementById('vital-o2').value);
        const allergies = document.getElementById('nurse-allergies').value;
        const complaints = document.getElementById('nurse-complaints').value;
        const patId = document.getElementById('nurse-patient-select').value;

        db.createAssessment({
          patientId: patId,
          vitals: { bp, pulse, temp, o2 },
          allergies,
          complaints
        });

        if (o2 < 92) {
          db.logTransaction('Clinical Alert', `HYPOXIA WARNING: Patient ${patId} has critical SpO2 of ${o2}%. Check oxygen supply.`, 'CRITICAL');
        }
        if (temp > 38.5) {
          db.logTransaction('Clinical Alert', `FEVER ALERT: Patient ${patId} has high temp of ${temp}°C.`, 'WARNING');
        }

        render();
      });
    }
  }

  render();
}
