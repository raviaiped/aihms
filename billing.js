export function initBillingScreen(db, container) {
  let selectedInvoiceId = null;
  let isProcessingClaim = false;
  let claimStep = 0;
  let claimStepText = '';
  let claimApprovedData = null;

  function render() {
    const invoices = db.get('invoices') || [];
    const patients = db.get('patients') || [];
    const selectedInv = invoices.find(i => i.id === selectedInvoiceId);
    const selectedPatient = selectedInv ? patients.find(p => p.id === selectedInv.patientId) : null;

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Invoices Registry -->
        <div class="input-pane">
          <div class="pane-header">Billing & Invoice Registry</div>
          <div style="flex: 1; overflow-y: auto; background: var(--bg-surface);">
            <table style="width: 100%; border-collapse: collapse;">
              <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0; z-index: 5;">
                <tr>
                  <th style="text-align: left; padding: 12px 16px;">Invoice & Patient</th>
                  <th style="text-align: right; padding: 12px 16px;">Total</th>
                  <th style="text-align: center; padding: 12px 16px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.length === 0 ? `
                  <tr><td colspan="3" style="text-align:center; padding: 40px; color:var(--text-muted);">No invoices generated yet.</td></tr>
                ` : invoices.slice().reverse().map(inv => {
                  let insBadgeClass = 'rgba(255, 255, 255, 0.1)';
                  let insBadgeColor = 'var(--text-secondary)';
                  if (inv.insuranceStatus === 'Approved') { insBadgeClass = 'rgba(16, 185, 129, 0.1)'; insBadgeColor = 'var(--accent-success)'; }
                  if (inv.insuranceStatus === 'Processing') { insBadgeClass = 'rgba(245, 158, 11, 0.1)'; insBadgeColor = 'var(--accent-warning)'; }
                  
                  let payBadgeClass = inv.paymentStatus === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                  let payBadgeColor = inv.paymentStatus === 'Paid' ? 'var(--accent-success)' : 'var(--accent-danger)';

                  const isSelected = selectedInvoiceId === inv.id;

                  return `
                    <tr style="border-bottom: 1px solid var(--border-subtle); background: ${isSelected ? 'var(--bg-elevated)' : 'transparent'}; cursor: pointer; transition: background 0.2s;" class="invoice-row" data-id="${inv.id}">
                      <td style="padding: 12px 16px;">
                        <div style="font-weight: 600; color: #fff; font-size: 13px;">${inv.id}</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${inv.patientName}</div>
                      </td>
                      <td style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 13px; color: var(--text-primary);">
                        ${inv.total.toFixed(2)} <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">AED</span>
                      </td>
                      <td style="padding: 12px 16px; text-align: center;">
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                          <span style="background: ${insBadgeClass}; color: ${insBadgeColor}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; white-space: nowrap;">Ins: ${inv.insuranceStatus}</span>
                          <span style="background: ${payBadgeClass}; color: ${payBadgeColor}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; white-space: nowrap;">Pay: ${inv.paymentStatus}</span>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Output Pane: Financial Workbench -->
        <div class="output-pane">
          <div class="pane-header">Financial Settlement Workbench</div>
          <div class="pane-content" style="background: var(--bg-surface); display: flex; flex-direction: column; overflow-y: auto;">
            ${!selectedInv ? `
              <div style="text-align:center; margin: auto; color: var(--text-muted);">
                <i class="fas fa-file-invoice-dollar" style="font-size:48px; margin-bottom:16px; opacity:0.3;"></i>
                <h3 style="font-size: 16px; color: #fff; margin-bottom: 8px;">Billing Workbench</h3>
                <p style="font-size: 13px; max-width: 280px; margin: 0 auto;">Select an invoice from the registry to process claims and collect payments.</p>
              </div>
            ` : renderWorkbench(selectedInv, selectedPatient)}
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.invoice-row').forEach(row => {
      row.addEventListener('click', () => {
        if (isProcessingClaim) return; // Block switching while processing
        selectedInvoiceId = row.getAttribute('data-id');
        isProcessingClaim = false;
        claimStep = 0;
        render();
      });
    });

    bindWorkbenchActions(selectedInv, selectedPatient);
  }

  function renderWorkbench(inv, patient) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
        <div>
          <div style="font-size: 18px; font-weight: 600; color: #fff;">Invoice ${inv.id}</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Issued: ${new Date(inv.timestamp || Date.now()).toLocaleDateString()}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: 600; color: #fff;">${inv.patientName}</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">ID: ${inv.patientId}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--bg-elevated); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 12px;">
          <div style="color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; font-size: 10px; font-weight: 600;">Insurance Profile</div>
          <div style="color: #fff; font-weight: 600;">${patient ? patient.insurance.provider : 'Self-Pay'}</div>
          <div style="color: var(--text-secondary); margin-top: 2px;">${patient ? patient.insurance.country.toUpperCase() : 'General'} Market</div>
        </div>
        <div style="background: var(--bg-elevated); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 12px;">
          <div style="color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; font-size: 10px; font-weight: 600;">Patient Coverage Terms</div>
          <div style="color: #fff; font-weight: 600;">${patient ? `${patient.insurance.coinsurance}% Co-Insurance` : 'N/A'}</div>
          <div style="color: var(--text-secondary); margin-top: 2px;">${patient ? `${patient.insurance.copay} AED Fixed Co-Pay` : 'N/A'}</div>
        </div>
      </div>

      <div style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 12px;">Itemized Charges</div>
      <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead style="background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary);">
            <tr>
              <th style="text-align: left; padding: 10px 12px;">Description</th>
              <th style="text-align: left; padding: 10px 12px;">Code</th>
              <th style="text-align: right; padding: 10px 12px;">Charge</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(item => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px 12px; color: var(--text-primary);">${item.desc}</td>
                <td style="padding: 10px 12px; color: var(--text-muted); font-family: monospace;">${item.code}</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: 600;">${item.charge.toFixed(2)} AED</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="padding: 12px; background: rgba(0,0,0,0.2);">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size: 12px; color: var(--text-secondary);">
            <span>Gross Total Charge:</span>
            <span>${inv.total.toFixed(2)} AED</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size: 12px; color: var(--accent-success);">
            <span>Insurance Auto-Covered:</span>
            <span>-${inv.insuranceCovered.toFixed(2)} AED</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-subtle); padding-top:8px; font-size:14px; font-weight:700; color: #fff;">
            <span>Patient Net Liability:</span>
            <span style="color:var(--accent-primary);">${inv.patientOwed.toFixed(2)} AED</span>
          </div>
        </div>
      </div>

      <div id="interactive-panel">
        ${renderInteractivePanelState(inv, patient)}
      </div>
    `;
  }

  function renderInteractivePanelState(inv, patient) {
    if (patient.insurance.provider === 'Self-Pay') {
      return `
        <div style="padding: 16px; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-info-circle" style="color: var(--accent-primary); font-size: 16px;"></i>
          <span>Patient is registered as Self-Pay. No insurance e-claim filing is required.</span>
        </div>
        
        ${inv.paymentStatus === 'Paid' ? `
          <div style="text-align: center; padding: 12px; background: rgba(16, 185, 129, 0.1); color: var(--accent-success); border-radius: 8px; font-weight: 600; font-size: 13px;">
            <i class="fas fa-check-circle" style="margin-right: 6px;"></i> Account Fully Settled
          </div>
        ` : `
          <button class="btn btn-primary" id="btn-process-payment" style="width: 100%;">
            <i class="fas fa-credit-card"></i> Process Payment of ${inv.patientOwed.toFixed(2)} AED
          </button>
        `}
      `;
    } else {
      if (inv.insuranceStatus === 'Draft') {
        return `
          <div style="padding: 16px; background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-shield-alt" style="color: var(--accent-warning); font-size: 16px;"></i>
            <span><strong>Compliance Check:</strong> Requires submission via ${patient.insurance.country === 'UAE' ? 'DHA/MOHAP e-Claims' : 'Saudi CHI Standard'} network.</span>
          </div>
          <button class="btn btn-secondary" id="btn-submit-insurance-claim" style="width: 100%;">
            <i class="fas fa-share-square"></i> Submit & AI Approve e-Claim
          </button>
        `;
      } else if (inv.insuranceStatus === 'Processing') {
        const steps = [
          { label: 'CPT/ICD Checks' },
          { label: 'Prior Auth Verification' },
          { label: 'EDI Transmission' },
          { label: 'Payer Approval' }
        ];

        return `
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px; position: relative; padding: 0 10px;">
            <div style="position: absolute; top: 12px; left: 20px; right: 20px; height: 2px; background: var(--border-subtle); z-index: 1;"></div>
            ${steps.map((st, idx) => {
              let icon = '<i class="fas fa-circle" style="font-size: 8px;"></i>';
              let color = 'var(--text-muted)';
              let bg = 'var(--bg-elevated)';
              let border = 'var(--border-subtle)';
              
              if (claimStep > idx) {
                icon = '<i class="fas fa-check" style="font-size: 10px;"></i>';
                color = 'var(--accent-success)';
                bg = 'rgba(16, 185, 129, 0.1)';
                border = 'var(--accent-success)';
              } else if (claimStep === idx) {
                icon = '<i class="fas fa-sync fa-spin" style="font-size: 10px;"></i>';
                color = 'var(--accent-primary)';
                bg = 'rgba(99, 102, 241, 0.1)';
                border = 'var(--accent-primary)';
              }
              
              return `
                <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; width: 60px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: ${bg}; border: 1px solid ${border}; display: flex; align-items: center; justify-content: center; color: ${color}; margin-bottom: 6px;">
                    ${icon}
                  </div>
                  <div style="font-size: 9px; text-align: center; color: ${color}; line-height: 1.2;">${st.label}</div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="font-family: monospace; font-size: 11px; text-align: center; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid var(--border-subtle); color: var(--accent-primary);">
            ${claimStepText || 'Initializing compliance engine...'}
          </div>
        `;
      } else if (inv.insuranceStatus === 'Approved') {
        return `
          <div style="padding: 16px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: var(--text-primary);">
            <div style="color: var(--accent-success); font-weight: 600; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-check-double"></i> e-Claim Approved Successfully
            </div>
            Coinsurance limits verified. Insurer covered ${inv.insuranceCovered.toFixed(2)} AED.
          </div>
          
          ${inv.paymentStatus === 'Paid' ? `
            <div style="text-align: center; padding: 12px; background: rgba(16, 185, 129, 0.1); color: var(--accent-success); border-radius: 8px; font-weight: 600; font-size: 13px;">
              <i class="fas fa-check-circle" style="margin-right: 6px;"></i> Invoice Fully Settled
            </div>
          ` : `
            <button class="btn btn-primary" id="btn-process-payment" style="width: 100%;">
              <i class="fas fa-wallet"></i> Pay Patient Co-pay Balance (${inv.patientOwed.toFixed(2)} AED)
            </button>
          `}
        `;
      }
    }
  }

  function bindWorkbenchActions(inv, patient) {
    if (!inv) return;

    const btnSubmit = document.getElementById('btn-submit-insurance-claim');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        isProcessingClaim = true;
        claimStep = 0;
        inv.insuranceStatus = 'Processing';
        db.save('invoices', db.get('invoices')); // save status change
        render(); // Re-render to show processing state

        const runPipeline = () => {
          claimStep++;
          if (claimStep === 1) {
            claimStepText = `Validating CPT/ICD codes against ${patient.insurance.country.toUpperCase()} MOH clinical registries...`;
            updateInteractivePanelState(inv, patient);
            setTimeout(runPipeline, 1000);
          } else if (claimStep === 2) {
            claimStepText = 'Verifying active pre-authorization tokens on DHA / CHI servers...';
            updateInteractivePanelState(inv, patient);
            setTimeout(runPipeline, 1000);
          } else if (claimStep === 3) {
            claimStepText = `Sending EDI encrypted e-Claim payload to insurer gateway...`;
            updateInteractivePanelState(inv, patient);
            setTimeout(runPipeline, 1200);
          } else {
            db.submitInsuranceClaim(inv.id, patient.insurance.country).then(() => {
              isProcessingClaim = false;
              render(); 
            });
          }
        };
        setTimeout(runPipeline, 500);
      });
    }

    const btnPay = document.getElementById('btn-process-payment');
    if (btnPay) {
      btnPay.addEventListener('click', () => {
        db.processPayment(inv.id);
        render();
      });
    }
  }

  function updateInteractivePanelState(inv, patient) {
    const panel = document.getElementById('interactive-panel');
    if (panel) {
      panel.innerHTML = renderInteractivePanelState(inv, patient);
    }
  }

  // Initial Draw
  render();
}
