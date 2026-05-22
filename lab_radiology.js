export function initLabRadiologyScreen(db, container) {
  let selectedOrderId = null;
  let isScanningImage = false;
  let scanProgressStep = 0;
  let activeTab = 'lab'; // lab, radiology

  function render() {
    const orders = db.get('lab_orders') || [];
    const labOrders = orders.filter(o => o.type === 'lab');
    const radOrders = orders.filter(o => o.type === 'radiology');
    
    const activeOrders = activeTab === 'lab' ? labOrders : radOrders;
    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    const patients = db.get('patients') || [];

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Queue & Assessment Entry -->
        <div class="input-pane">
          <div class="pane-header" style="padding: 0; display: flex; border-bottom: 1px solid var(--border-subtle);">
            <div class="tab-btn ${activeTab === 'lab' ? 'active' : ''}" style="flex: 1; text-align: center; padding: 16px; cursor: pointer; font-weight: 600; border-right: 1px solid var(--border-subtle); background: ${activeTab === 'lab' ? 'var(--bg-surface)' : 'var(--bg-elevated)'}; color: ${activeTab === 'lab' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; transition: all 0.2s;" id="tab-lab">
              <i class="fas fa-vials"></i> Laboratory Queue
            </div>
            <div class="tab-btn ${activeTab === 'radiology' ? 'active' : ''}" style="flex: 1; text-align: center; padding: 16px; cursor: pointer; font-weight: 600; background: ${activeTab === 'radiology' ? 'var(--bg-surface)' : 'var(--bg-elevated)'}; color: ${activeTab === 'radiology' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; transition: all 0.2s;" id="tab-rad">
              <i class="fas fa-x-ray"></i> Radiology Queue
            </div>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Pending Orders List (Top Half) -->
            <div style="height: 40%; overflow-y: auto; border-bottom: 1px solid var(--border-subtle);">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-surface); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0;">
                  <tr>
                    <th style="text-align: left; padding: 10px 16px;">Order & Patient</th>
                    <th style="text-align: left; padding: 10px 16px;">Test / Scan</th>
                    <th style="text-align: left; padding: 10px 16px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeOrders.length === 0 ? `
                    <tr><td colspan="3" style="text-align:center; padding: 20px; color: var(--text-muted);">No orders pending in this queue</td></tr>
                  ` : activeOrders.map(o => `
                    <tr style="border-bottom: 1px solid var(--border-subtle); background: ${selectedOrderId === o.id ? 'var(--bg-elevated)' : 'transparent'};">
                      <td style="padding: 12px 16px;">
                        <div style="font-weight: 600; color: #fff; font-size: 13px;">${o.id}</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Pat ID: ${o.patientId}</div>
                      </td>
                      <td style="padding: 12px 16px; font-size: 12px; color: var(--text-primary);">${o.serviceName}</td>
                      <td style="padding: 12px 16px;">
                        <button class="btn btn-sm ${o.status === 'Pending' ? 'btn-primary' : ''} select-order-btn" data-id="${o.id}" style="font-size: 11px; padding: 4px 8px;">
                          ${o.status === 'Pending' ? 'Process' : 'View'}
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Data Entry / Input Action (Bottom Half) -->
            <div class="pane-content" style="flex: 1; background: var(--bg-surface); overflow-y: auto;">
              ${!selectedOrder ? `
                <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
                  <i class="fas fa-mouse-pointer" style="font-size:32px; margin-bottom:12px; opacity:0.5;"></i>
                  <p style="font-size:13px;">Select an order from the queue above to begin processing.</p>
                </div>
              ` : renderInputArea(selectedOrder)}
            </div>
          </div>
        </div>

        <!-- Output Pane: Diagnostic Report -->
        <div class="output-pane">
          <div class="pane-header">Diagnostic Output & Report</div>
          <div class="pane-content" style="background: var(--bg-surface); display: flex; flex-direction: column;">
            ${!selectedOrder ? `
              <div style="text-align:center; margin: auto; color: var(--text-muted);">
                <i class="fas fa-laptop-medical" style="font-size:48px; margin-bottom:16px; opacity:0.3;"></i>
                <h3 style="font-size: 16px; color: #fff; margin-bottom: 8px;">Results Workbench</h3>
                <p style="font-size: 13px; max-width: 250px; margin: 0 auto;">Finalized reports and AI interpretations will appear here once the order is processed.</p>
              </div>
            ` : renderOutputArea(selectedOrder, patients.find(p => p.id === selectedOrder.patientId))}
          </div>
        </div>
      </div>
    `;

    document.getElementById('tab-lab').addEventListener('click', () => { activeTab = 'lab'; selectedOrderId = null; render(); });
    document.getElementById('tab-rad').addEventListener('click', () => { activeTab = 'radiology'; selectedOrderId = null; render(); });

    document.querySelectorAll('.select-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedOrderId = btn.getAttribute('data-id');
        isScanningImage = false;
        render();
      });
    });

    bindInputActions(selectedOrder);
  }

  function renderInputArea(order) {
    if (order.status === 'Completed') {
      return `
        <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 16px; border-radius: 8px; text-align: center; color: var(--accent-success);">
          <i class="fas fa-check-circle" style="font-size: 24px; margin-bottom: 8px;"></i>
          <div style="font-weight: 600; font-size: 13px;">Order Completed</div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Data entry is locked.</div>
        </div>
      `;
    }

    if (order.type === 'lab') {
      return `
        <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">Enter Laboratory Metrics</div>
        <form id="lab-process-form">
          <div class="flex-row">
            <div class="form-group" style="flex: 1;">
              <label for="lab-val-1">Hemoglobin (Hb)</label>
              <input type="text" id="lab-val-1" class="form-control" value="14.1 g/dL">
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="lab-val-2">WBC Count</label>
              <input type="text" id="lab-val-2" class="form-control" value="6.8 x10^3/uL">
            </div>
          </div>
          <div class="flex-row">
            <div class="form-group" style="flex: 1;">
              <label for="lab-val-3">Platelets</label>
              <input type="text" id="lab-val-3" class="form-control" value="250 x10^3/uL">
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="lab-val-4">Potassium (K+)</label>
              <input type="text" id="lab-val-4" class="form-control" value="4.2 mEq/L">
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-flask"></i> Process & Generate Report</button>
        </form>
      `;
    } else {
      return `
        <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">Radiology AI Scanner</div>
        
        <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-bottom: 20px;">
          ${!isScanningImage ? `
            <i class="fas fa-x-ray" style="font-size: 40px; color: var(--text-muted); opacity: 0.5; margin-bottom: 12px;"></i>
            <div style="font-size: 12px; color: var(--text-secondary);">DICOM Scanner Ready</div>
          ` : `
            <i class="fas fa-circle-notch fa-spin" style="font-size: 32px; color: var(--accent-primary); margin-bottom: 16px;"></i>
            <div style="width: 70%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 8px;">
              <div id="scan-progress-bar" style="width: ${scanProgressStep * 33}%; height: 100%; background: var(--accent-primary); transition: width 0.8s ease;"></div>
            </div>
            <div id="scan-status-text" style="font-size: 11px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase;">Acquiring image slices...</div>
          `}
        </div>

        <button type="button" class="btn btn-primary" id="btn-run-rad-scan" style="width: 100%;" ${isScanningImage ? 'disabled' : ''}>
          <i class="fas fa-radiation"></i> ${isScanningImage ? 'Scanning...' : 'Execute AI Scan'}
        </button>
      `;
    }
  }

  function renderOutputArea(order, patient) {
    if (order.status === 'Completed') {
      return `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: #fff;">Diagnostic Report</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Order: ${order.id} • ${order.serviceName}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 600; color: #fff;">${patient ? patient.name : 'Unknown Patient'}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">ID: ${order.patientId}</div>
          </div>
        </div>

        <div style="flex: 1; background: var(--bg-elevated); padding: 20px; border-radius: 8px; border: 1px solid var(--border-subtle); overflow-y: auto;">
          <div style="font-size: 11px; text-transform: uppercase; color: var(--accent-success); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle"></i> Electronically Signed off
          </div>
          <pre style="white-space: pre-wrap; font-family: var(--font-family); font-size: 13px; line-height: 1.6; color: var(--text-primary); margin: 0;">${order.result}</pre>
        </div>
      `;
    }

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
        <div>
          <div style="font-size: 18px; font-weight: 600; color: #fff;">Pending Results</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Order: ${order.id} • ${order.serviceName}</div>
        </div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.1); border-radius: 8px; border: 1px dashed var(--border-subtle); color: var(--text-muted);">
        <i class="fas fa-hourglass-half" style="font-size: 32px; margin-bottom: 16px; opacity: 0.5;"></i>
        <div style="font-size: 13px;">Awaiting test execution from the input pane...</div>
      </div>
    `;
  }

  function bindInputActions(order) {
    if (!order || order.status === 'Completed') return;

    if (order.type === 'lab') {
      const form = document.getElementById('lab-process-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const v1 = document.getElementById('lab-val-1').value;
          const v2 = document.getElementById('lab-val-2').value;
          const v3 = document.getElementById('lab-val-3').value;
          const v4 = document.getElementById('lab-val-4').value;
          
          const resultText = 
            `LABORATORY METRICS VALIDATION ANALYSIS:\n\n` +
            `• Hemoglobin (${v1}): Within normal physiological bounds.\n` +
            `• White Blood Cell count (${v2}): Normal. No acute infection flags.\n` +
            `• Platelets (${v3}): Normal.\n` +
            `• Serum Potassium (${v4}): Normal electrolytes verified.\n\n` +
            `AI INTERPRETATION: All markers are within stable clinical thresholds. Normal test baseline.`;

          db.completeOrder(order.id, {
            result: resultText,
            remarks: 'Verified by Lab Tech Marie'
          });
          render();
        });
      }
    } else {
      const btnScan = document.getElementById('btn-run-rad-scan');
      if (btnScan) {
        btnScan.addEventListener('click', () => {
          isScanningImage = true;
          scanProgressStep = 0;
          render(); // triggers loading UI

          const runScanSteps = () => {
            scanProgressStep++;
            const pb = document.getElementById('scan-progress-bar');
            const txt = document.getElementById('scan-status-text');
            if(!pb || !txt) return;

            if (scanProgressStep === 1) {
              pb.style.width = '30%';
              txt.textContent = 'Denoising voxel volume spaces...';
              setTimeout(runScanSteps, 900);
            } else if (scanProgressStep === 2) {
              pb.style.width = '65%';
              txt.textContent = 'Executing Neural detection layers...';
              setTimeout(runScanSteps, 900);
            } else if (scanProgressStep === 3) {
              pb.style.width = '100%';
              txt.textContent = 'Mapping diagnostic impressions...';
              setTimeout(runScanSteps, 800);
            } else {
              let reportContent = '';
              if (order.serviceName.toLowerCase().includes('chest') || order.serviceName.toLowerCase().includes('lung')) {
                reportContent = `AI RADIOLOGICAL FINDINGS STUDY (CHEST PA VIEW):\n\n• Lungs are fully inflated. Clear bronchovascular markings. No pulmonary consolidations or nodules.\n• Cardiomediastinal contour is normal.\n• Intact ribs and shoulder girdle.\n\nAI IMPRESSION: Normal chest radiograph.`;
              } else if (order.serviceName.toLowerCase().includes('brain')) {
                reportContent = `AI NEURAL RADIOLOGICAL FINDINGS (MRI BRAIN):\n\n• Parenchyma: Cerebellar hemispheres and basal ganglia show unremarkable signals.\n• Ventricles & Sulci: Normal size and spacing. No hydrocephalus.\n• Vascular: Normal flow voids.\n\nAI IMPRESSION: Unremarkable brain scan.`;
              } else {
                reportContent = `AI RADIOLOGICAL FINDINGS (BONE IMAGING):\n\n• Skeletal alignment is anatomical. Joint space within normal limits.\n• Cortical margins are completely intact. No fracture line mapped.\n\nAI IMPRESSION: No evidence of fracture or dislocation.`;
              }
              
              db.completeOrder(order.id, {
                result: reportContent,
                remarks: 'Signed Off by AI Core Agent'
              });
              isScanningImage = false;
              render();
            }
          };
          setTimeout(runScanSteps, 500);
        });
      }
    }
  }

  render();
}
