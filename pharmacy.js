export function initPharmacyScreen(db, container) {
  let activeStore = 'Main Pharmacy'; // Main Pharmacy, ICU Store, ER Store, General Ward Store
  let isDispatchingDrone = false;
  let droneStep = 0;
  let droneLogText = '';
  let activeFormTab = 'dispatch'; // dispatch, refill

  function render() {
    const inventory = db.get('inventory') || {};
    const patients = db.get('patients') || [];
    const activeInventory = inventory[activeStore] || [];
    const mainStoreInventory = inventory['Main Pharmacy'] || [];

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Dispatch & Refill Forms -->
        <div class="input-pane">
          <div class="pane-header" style="padding: 0; display: flex; border-bottom: 1px solid var(--border-subtle);">
            <div class="tab-btn ${activeFormTab === 'dispatch' ? 'active' : ''}" style="flex: 1; text-align: center; padding: 16px; cursor: pointer; font-weight: 600; border-right: 1px solid var(--border-subtle); background: ${activeFormTab === 'dispatch' ? 'var(--bg-surface)' : 'var(--bg-elevated)'}; color: ${activeFormTab === 'dispatch' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; transition: all 0.2s;" id="tab-dispatch">
              <i class="fas fa-prescription"></i> Patient Dispatch
            </div>
            <div class="tab-btn ${activeFormTab === 'refill' ? 'active' : ''}" style="flex: 1; text-align: center; padding: 16px; cursor: pointer; font-weight: 600; background: ${activeFormTab === 'refill' ? 'var(--bg-surface)' : 'var(--bg-elevated)'}; color: ${activeFormTab === 'refill' ? 'var(--accent-primary)' : 'var(--text-secondary)'}; transition: all 0.2s;" id="tab-refill">
              <i class="fas fa-boxes"></i> Substore Refill
            </div>
          </div>
          <div class="pane-content">
            
            ${activeFormTab === 'dispatch' ? `
              <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">AI Automated Prescription Dispatch</div>
              
              ${patients.length === 0 ? `
                <div style="text-align:center; padding: 40px 20px; color: var(--text-muted); background: var(--bg-elevated); border-radius: 8px; border: 1px dashed var(--border-subtle);">
                  <i class="fas fa-info-circle" style="font-size:32px; color:var(--accent-primary); margin-bottom:12px;"></i>
                  <p style="font-size:13px;">Admit a patient first to schedule medication dispatches.</p>
                </div>
              ` : `
                <form id="drug-dispatch-form">
                  <div class="form-group">
                    <label for="dispatch-patient">Recipient Patient</label>
                    <select id="dispatch-patient" class="form-control" required>
                      ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
                    </select>
                  </div>
                  <div class="flex-row">
                    <div class="form-group" style="flex: 1;">
                      <label for="dispatch-substore">Source Store</label>
                      <select id="dispatch-substore" class="form-control" required>
                        <option value="Main Pharmacy">Main Pharmacy</option>
                        <option value="ICU Store">ICU Store</option>
                        <option value="ER Store">ER Store</option>
                        <option value="General Ward Store">General Ward Store</option>
                      </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label for="dispatch-qty">Quantity</label>
                      <input type="number" id="dispatch-qty" class="form-control" min="1" max="10" value="2" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="dispatch-med">Select Medication</label>
                    <select id="dispatch-med" class="form-control" required>
                      <!-- populated dynamically -->
                    </select>
                  </div>

                  <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--text-secondary); margin: 16px 0;">
                    <strong style="color: var(--accent-primary);"><i class="fas fa-magic"></i> Autonomous Workflow:</strong> Dispatching will auto-decrement store stock, log ledger event, and add drug cost to patient's pending invoice.
                  </div>

                  <button type="submit" class="btn btn-primary" style="width: 100%;" ${isDispatchingDrone ? 'disabled' : ''}>
                    <i class="fas fa-paper-plane"></i> Launch Autonomous Dispatch
                  </button>
                </form>
              `}
            ` : `
              <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">Internal Substore Refill Portal</div>
              <form id="refill-substore-form">
                <div class="form-group">
                  <label for="refill-dest">Target Substore</label>
                  <select id="refill-dest" class="form-control" required>
                    <option value="ICU Store">ICU Store</option>
                    <option value="ER Store">ER Store</option>
                    <option value="General Ward Store">General Ward Store</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="refill-med">Medication from Main Pharmacy</label>
                  <select id="refill-med" class="form-control" required>
                    ${mainStoreInventory.filter(m => m.stock > 0).map(m => `
                      <option value="${m.id}" data-stock="${m.stock}">${m.name} (Stock: ${m.stock})</option>
                    `).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="refill-qty">Refill Quantity</label>
                  <input type="number" id="refill-qty" class="form-control" min="5" value="50" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
                  <i class="fas fa-dolly"></i> Execute Stock Transfer
                </button>
              </form>
            `}
          </div>
        </div>

        <!-- Output Pane: Inventory & Drones -->
        <div class="output-pane">
          <div class="pane-header" style="display: flex; justify-content: space-between; align-items: center;">
            <span>Substore Inventory Audit</span>
            <select id="pharmacy-store-select" class="form-control" style="width: auto; padding: 4px 28px 4px 8px; font-size: 11px; height: auto;">
              ${Object.keys(inventory).map(store => `
                <option value="${store}" ${activeStore === store ? 'selected' : ''}>${store}</option>
              `).join('')}
            </select>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            
            <!-- Drone Status Area -->
            <div id="drone-dispatch-container" style="display: ${isDispatchingDrone || droneLogText ? 'block' : 'none'}; padding: 16px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface);">
              <!-- Rendered via JS -->
            </div>

            <!-- Inventory Table -->
            <div style="flex: 1; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0; z-index: 5;">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Medication</th>
                    <th style="text-align: right; padding: 12px 16px;">Stock Level</th>
                    <th style="text-align: right; padding: 12px 16px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeInventory.map(med => {
                    let badgeClass = 'rgba(16, 185, 129, 0.1)';
                    let badgeColor = 'var(--accent-success)';
                    let status = 'In Stock';
                    if (med.stock === 0) {
                      badgeClass = 'rgba(239, 68, 68, 0.1)';
                      badgeColor = 'var(--accent-danger)';
                      status = 'Stockout';
                    } else if (med.stock < med.minStock) {
                      badgeClass = 'rgba(245, 158, 11, 0.1)';
                      badgeColor = 'var(--accent-warning)';
                      status = 'Low Stock';
                    }
                    return `
                      <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 12px 16px;">
                          <div style="font-weight: 600; color: #fff;">${med.name}</div>
                          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">ID: ${med.id.toUpperCase()} • ${med.unitPrice.toFixed(2)} AED/unit</div>
                        </td>
                        <td style="padding: 12px 16px; text-align: right;">
                          <div style="font-weight: 600; color: #fff;">${med.stock} <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">units</span></div>
                          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Min: ${med.minStock}</div>
                        </td>
                        <td style="padding: 12px 16px; text-align: right;">
                          <span style="background: ${badgeClass}; color: ${badgeColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${status}</span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('tab-dispatch').addEventListener('click', () => { activeFormTab = 'dispatch'; render(); });
    document.getElementById('tab-refill').addEventListener('click', () => { activeFormTab = 'refill'; render(); });
    document.getElementById('pharmacy-store-select').addEventListener('change', (e) => { activeStore = e.target.value; render(); });

    if (activeFormTab === 'dispatch') {
      const dispStoreSelect = document.getElementById('dispatch-substore');
      const dispMedSelect = document.getElementById('dispatch-med');

      const updateDispMeds = () => {
        if (!dispStoreSelect || !dispMedSelect) return;
        const storeName = dispStoreSelect.value;
        const meds = inventory[storeName] || [];
        dispMedSelect.innerHTML = meds.map(m => `
          <option value="${m.id}" data-stock="${m.stock}">${m.name} (Stock: ${m.stock})</option>
        `).join('');
      };

      if (dispStoreSelect) {
        dispStoreSelect.addEventListener('change', updateDispMeds);
        updateDispMeds(); 
      }

      const dispatchForm = document.getElementById('drug-dispatch-form');
      if (dispatchForm) {
        dispatchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const patientSelect = document.getElementById('dispatch-patient');
          const pId = patientSelect.value;
          const pName = patientSelect.options[patientSelect.selectedIndex].text.split(' (')[0];
          const storeName = dispStoreSelect.value;
          const medId = dispMedSelect.value;
          const medName = dispMedSelect.options[dispMedSelect.selectedIndex].text.split(' (')[0];
          const qty = parseInt(document.getElementById('dispatch-qty').value);

          startDroneDispatch(pId, pName, storeName, medId, medName, qty);
        });
      }
    } else {
      const refillForm = document.getElementById('refill-substore-form');
      if (refillForm) {
        refillForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const destStore = document.getElementById('refill-dest').value;
          const medSelect = document.getElementById('refill-med');
          const medId = medSelect.value;
          const qty = parseInt(document.getElementById('refill-qty').value);
          
          db.refillSubstore('Main Pharmacy', destStore, medId, qty);
          render(); 
        });
      }
    }

    if (isDispatchingDrone || droneLogText) {
      const dbx = document.getElementById('dispatch-substore') ? document.getElementById('dispatch-substore').value : 'Main Pharmacy';
      updateDroneBox(dbx.replace(' Store', '').replace(' Pharmacy', ''), !isDispatchingDrone && droneLogText !== '');
    }
  }

  function startDroneDispatch(pId, pName, storeName, medId, medName, qty) {
    isDispatchingDrone = true;
    droneStep = 0;
    droneLogText = 'Securing medical cargo payload...';
    render();

    const wardName = storeName.replace(' Store', '').replace(' Pharmacy', '');

    const runDroneSteps = () => {
      droneStep++;
      if (droneStep === 1) {
        droneLogText = 'Drone engines armed. Navigation vector mapped...';
        updateDroneBox(wardName);
        setTimeout(runDroneSteps, 1200);
      } else if (droneStep === 2) {
        droneLogText = 'Airborne. Crossing high-tether clean corridors...';
        updateDroneBox(wardName);
        setTimeout(runDroneSteps, 1200);
      } else if (droneStep === 3) {
        droneLogText = 'Arrived at ward receptor lock. Discharging medication capsule...';
        updateDroneBox(wardName);
        setTimeout(runDroneSteps, 1000);
      } else {
        isDispatchingDrone = false;
        const success = db.dispatchMedication(pId, storeName, medId, qty);
        if (success) {
          droneLogText = 'SUCCESS: Cargo dispensed and signed off by nurse station.';
        } else {
          droneLogText = 'CRITICAL ERROR: Cargo dispatch failed. Insufficient stock.';
        }
        updateDroneBox(wardName, true);
        render(); 
      }
    };
    setTimeout(runDroneSteps, 1000);
  }

  function updateDroneBox(wardName, finished = false) {
    const droneBox = document.getElementById('drone-dispatch-container');
    if (!droneBox) return;

    droneBox.innerHTML = `
      <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <span><i class="fas fa-satellite-dish"></i> Drone Telemetry</span>
        ${finished ? '<span style="color:var(--accent-success);">DELIVERED</span>' : '<span style="color:var(--accent-primary);">IN TRANSIT</span>'}
      </div>
      
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; margin-bottom: 12px; position: relative;">
        <div style="position: absolute; height: 2px; background: var(--border-subtle); left: 40px; right: 40px; top: 50%; transform: translateY(-50%); z-index: 1;"></div>
        
        <div style="z-index: 2; background: var(--bg-elevated); padding: 0 8px; color: var(--text-secondary); text-align: center;">
          <i class="fas fa-warehouse" style="font-size: 20px; margin-bottom: 4px;"></i><br><span style="font-size: 10px;">HQ</span>
        </div>
        
        <div style="z-index: 3; background: var(--bg-elevated); padding: 0 16px; color: var(--accent-primary); transform: translateX(${finished ? '120px' : (droneStep * 40 - 60)}px); transition: transform 1s linear;">
          <i class="fas fa-helicopter ${finished ? '' : 'fa-spin'}" style="font-size: 24px;"></i>
        </div>
        
        <div style="z-index: 2; background: var(--bg-elevated); padding: 0 8px; color: var(--text-secondary); text-align: center;">
          <i class="fas ${wardName.includes('Main') ? 'fa-hospital' : 'fa-procedures'}" style="font-size: 20px; margin-bottom: 4px;"></i><br><span style="font-size: 10px;">${wardName.substring(0,3)}</span>
        </div>
      </div>
      
      <div style="font-family: monospace; font-size: 11px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid var(--border-subtle); color: ${droneLogText.includes('CRITICAL') ? 'var(--accent-danger)' : (finished ? 'var(--accent-success)' : 'var(--text-secondary)')};">
        <i class="fas ${finished ? 'fa-check' : 'fa-cog fa-spin'}" style="margin-right: 6px;"></i> ${droneLogText}
      </div>

      ${finished ? `<button class="btn" id="btn-drone-clear" style="width:100%; margin-top:12px; font-size:11px; padding:6px; background:var(--bg-elevated);"><i class="fas fa-times"></i> Dismiss Telemetry</button>` : ''}
    `;

    if (finished) {
      document.getElementById('btn-drone-clear').addEventListener('click', () => {
        droneLogText = '';
        render(); 
      });
    }
  }

  render();
}
