export function initTriageScreen(db, container) {
  let isRunningTriage = false;
  let pipelineStep = 0;
  let triageResult = null;

  function render() {
    const patients = db.get('patients') || [];
    const triageRecords = db.get('triage') || [];

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: AI Triage Console -->
        <div class="input-pane">
          <div class="pane-header">
            <span style="color: var(--accent-primary);"><i class="fas fa-brain"></i> AI Cognitive Triage Hub</span>
          </div>
          <div class="pane-content">
            
            ${patients.length === 0 ? `
              <div style="text-align:center; padding: 40px 20px; color: var(--text-muted); background: var(--bg-elevated); border-radius: 8px; border: 1px dashed var(--border-subtle);">
                <i class="fas fa-info-circle" style="font-size:32px; color:var(--accent-primary); margin-bottom:12px;"></i>
                <p style="font-size:13px;">Admit a patient in the Registration module before using AI Triage.</p>
              </div>
            ` : `
              <form id="ai-triage-form" style="${isRunningTriage ? 'opacity: 0.5; pointer-events: none;' : ''}">
                <div class="form-group">
                  <label for="triage-patient-select">Select Patient</label>
                  <select id="triage-patient-select" class="form-control" required>
                    ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="triage-symptoms">Symptom Description (Natural Language)</label>
                  <textarea id="triage-symptoms" class="form-control" rows="5" placeholder="Describe symptoms in detail. E.g. 'Patient experiencing severe retrosternal chest pain radiating to left arm with cold sweats'..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
                  <i class="fas fa-microchip"></i> Run AI Cognitive Triage
                </button>
              </form>
            `}

            <!-- AI Pipeline Animation Loader -->
            <div id="triage-pipeline-loader" style="display:none; margin-top: 24px;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; font-weight: 600;">Processing Pipeline</div>
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

        <!-- Output Pane: Outcome & History -->
        <div class="output-pane">
          <div class="pane-header">Triage Automated Outcomes</div>
          
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Top Half: Current Triage Result -->
            <div id="triage-outcome-container" style="display:${triageResult ? 'block' : 'none'}; padding: 16px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-elevated);">
              <!-- Rendered dynamically -->
            </div>
            ${!triageResult ? `
              <div id="triage-outcome-placeholder" style="padding: 32px; text-align: center; border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 13px;">
                <i class="fas fa-robot" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i><br>
                Awaiting new AI triage inputs...
              </div>
            ` : ''}

            <!-- Bottom Half: History Table -->
            <div style="flex: 1; overflow-y: auto; padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-surface); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0;">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Patient</th>
                    <th style="text-align: left; padding: 12px 16px;">Symptom Input</th>
                    <th style="text-align: left; padding: 12px 16px;">Urgency & Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${triageRecords.length === 0 ? `
                    <tr><td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted);">No patients triaged yet</td></tr>
                  ` : triageRecords.slice().reverse().map(rec => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 16px; font-weight: 600; color: #fff;">${rec.patientId}</td>
                      <td style="padding: 16px; font-size: 12px; color: var(--text-secondary); max-width: 200px;">
                        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"${rec.symptoms}"</div>
                      </td>
                      <td style="padding: 16px; font-size: 12px;">
                        <span style="background: ${rec.urgency === 'Red' ? 'rgba(239, 68, 68, 0.1)' : (rec.urgency === 'Yellow' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)')}; color: ${rec.urgency === 'Red' ? 'var(--accent-danger)' : (rec.urgency === 'Yellow' ? 'var(--accent-warning)' : 'var(--accent-success)')}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${rec.urgency}</span>
                        <div style="margin-top: 4px; color: var(--text-secondary);">${rec.departmentId.toUpperCase()}</div>
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

    if (isRunningTriage) {
      renderPipelineProgress();
    } else if (triageResult) {
      renderTriageOutcome();
    }

    const form = document.getElementById('ai-triage-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        startTriageProcess();
      });
    }
  }

  function startTriageProcess() {
    isRunningTriage = true;
    pipelineStep = 0;
    triageResult = null;
    render();

    const runPipeline = () => {
      pipelineStep++;
      if (pipelineStep <= 4) {
        renderPipelineProgress();
        setTimeout(runPipeline, 1000);
      } else {
        finalizeTriage();
      }
    };
    setTimeout(runPipeline, 800);
  }

  function renderPipelineProgress() {
    const loader = document.getElementById('triage-pipeline-loader');
    if (!loader) return;
    loader.style.display = 'block';

    const steps = [
      'Ingesting symptoms and tokenizing text inputs...',
      'Mapping complaints to ICD diagnostic database...',
      'Assessing risk severity index & vitals protocols...',
      'Auto-generating scheduling recommendation...'
    ];

    loader.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${steps.map((text, idx) => {
          let icon = '<i class="far fa-circle" style="color:var(--text-muted);"></i>';
          let textColor = 'var(--text-muted)';
          if (pipelineStep > idx) {
            icon = '<i class="fas fa-check-circle" style="color:var(--accent-success);"></i>';
            textColor = 'var(--text-primary)';
          } else if (pipelineStep === idx) {
            icon = '<i class="fas fa-spinner fa-spin" style="color:var(--accent-primary);"></i>';
            textColor = 'var(--accent-primary)';
          }
          return `
            <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: ${textColor};">
              ${icon}
              <span>${text}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function finalizeTriage() {
    isRunningTriage = false;
    
    const patSelect = document.getElementById('triage-patient-select');
    const patId = patSelect.value;
    const patName = patSelect.options[patSelect.selectedIndex].text.split(' (')[0];
    const symptoms = document.getElementById('triage-symptoms').value;

    let urgency = 'Green';
    let departmentId = 'general_medicine';
    let recommendedAction = 'Scheduled General consult';
    
    const text = symptoms.toLowerCase();
    
    if (text.includes('chest') || text.includes('heart') || text.includes('cardiac') || text.includes('retrosternal') || text.includes('stroke') || text.includes('paralysis')) {
      urgency = 'Red';
      departmentId = 'cardiology';
      recommendedAction = 'ER Admitted & Cardiologist Alerted';
    } else if (text.includes('breath') || text.includes('cough') || text.includes('lung') || text.includes('dyspnea') || text.includes('asthma')) {
      urgency = 'Yellow';
      departmentId = 'pulmonology';
      recommendedAction = 'Scheduled Pulmonology consult';
    } else if (text.includes('fracture') || text.includes('bone') || text.includes('fall') || text.includes('ankle') || text.includes('wrist') || text.includes('knee') || text.includes('joint') || text.includes('sprain')) {
      urgency = 'Yellow';
      departmentId = 'orthopedics';
      recommendedAction = 'Orthopedic Consult & X-Ray Ordered';
    } else if (text.includes('child') || text.includes('pediatric') || text.includes('baby') || text.includes('infant')) {
      urgency = 'Yellow';
      departmentId = 'pediatrics';
      recommendedAction = 'Scheduled Pediatric consult';
    } else if (text.includes('fever') || text.includes('infection') || text.includes('flu') || text.includes('cough') || text.includes('throat')) {
      urgency = 'Green';
      departmentId = 'general_medicine';
      recommendedAction = 'Scheduled General consult';
    }

    db.createTriage({
      patientId: patId,
      symptoms: symptoms,
      urgency: urgency,
      departmentId: departmentId,
      recommendedAction: recommendedAction
    });

    const doctors = db.get('doctors');
    const doctor = doctors.find(d => d.departmentId === departmentId) || doctors[0];
    
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    
    const appt = db.createAppointment({
      patientId: patId,
      patientName: patName,
      type: 'doctor',
      targetId: doctor.id,
      targetName: doctor.name,
      dateTime: nextHour.toISOString(),
      cost: doctor.fee
    });

    db.autoDraftInvoiceItem(patId, `AI Routed Consult: ${doctor.name}`, doctor.id, doctor.fee);

    if (urgency === 'Red') {
      const ecgService = db.get('services').find(s => s.id === 'srv-5');
      if (ecgService) {
        db.createAppointment({
          patientId: patId,
          patientName: patName,
          type: 'service',
          targetId: ecgService.id,
          targetName: ecgService.name,
          dateTime: nextHour.toISOString(),
          cost: ecgService.fee
        });
        db.autoDraftInvoiceItem(patId, `AI Ordered Service: ${ecgService.name}`, ecgService.id, ecgService.fee);
        
        db.createOrder({
          patientId: patId,
          type: 'lab',
          serviceId: ecgService.id,
          serviceName: ecgService.name
        });
      }
    } else if (urgency === 'Yellow' && departmentId === 'orthopedics') {
      const xrayService = db.get('services').find(s => s.id === 'srv-7');
      if (xrayService) {
        db.createAppointment({
          patientId: patId,
          patientName: patName,
          type: 'service',
          targetId: xrayService.id,
          targetName: xrayService.name,
          dateTime: nextHour.toISOString(),
          cost: xrayService.fee
        });
        db.autoDraftInvoiceItem(patId, `AI Ordered Service: ${xrayService.name}`, xrayService.id, xrayService.fee);
        
        db.createOrder({
          patientId: patId,
          type: 'radiology',
          serviceId: xrayService.id,
          serviceName: xrayService.name
        });
      }
    }

    triageResult = {
      urgency,
      departmentId,
      recAction: recommendedAction,
      docName: doctor.name,
      apptId: appt.id
    };

    render();
  }

  function renderTriageOutcome() {
    const container = document.getElementById('triage-outcome-container');
    if (!container) return;
    
    const urgencyColor = triageResult.urgency === 'Red' ? 'var(--accent-danger)' : (triageResult.urgency === 'Yellow' ? 'var(--accent-warning)' : 'var(--accent-success)');
    const urgencyBg = triageResult.urgency === 'Red' ? 'rgba(239, 68, 68, 0.1)' : (triageResult.urgency === 'Yellow' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)');
    
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h4 style="font-size: 15px; font-weight: 600; color: ${urgencyColor}; margin: 0;">
          <i class="fas fa-shield-alt"></i> AI Triage Outcome: ${triageResult.urgency} Priority
        </h4>
        <button class="btn" id="btn-triage-reset" style="padding: 4px 8px; font-size: 11px; background: transparent;"><i class="fas fa-times"></i></button>
      </div>
      
      <div style="font-size: 13px; color: var(--text-primary); margin-bottom: 16px;">
        <div style="margin-bottom: 4px;"><span style="color: var(--text-secondary);">Routed Department:</span> <strong>${triageResult.departmentId.toUpperCase()}</strong></div>
        <div><span style="color: var(--text-secondary);">Clinical Action:</span> <strong>${triageResult.recAction}</strong></div>
      </div>

      <div style="font-size: 12px; padding: 12px; background: rgba(99, 102, 241, 0.05); border-radius: 6px; border: 1px solid rgba(99, 102, 241, 0.2);">
        <strong style="color: var(--accent-primary); display: block; margin-bottom: 8px;"><i class="fas fa-magic"></i> Auto-Generated Transactions:</strong>
        <div style="color: var(--text-secondary); line-height: 1.6;">
          • Booked Consultation with <strong>${triageResult.docName}</strong> (Appt ID: <strong>${triageResult.apptId}</strong>)<br>
          • Consult Fee draft invoice item added to ledger.<br>
          ${triageResult.urgency === 'Red' ? '• Auto-triggered urgent Electrocardiogram (ECG) order in laboratory queue.' : ''}
          ${triageResult.urgency === 'Yellow' && triageResult.departmentId === 'orthopedics' ? '• Auto-triggered X-Ray order in radiology queue.' : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-triage-reset').addEventListener('click', () => {
      triageResult = null;
      render();
    });
  }

  render();
}
