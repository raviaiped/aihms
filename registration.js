export function initRegistrationScreen(db, container) {
  let selectedPatient = null;

  function render() {
    const patients = db.get('patients') || [];

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Registration Form -->
        <div class="input-pane">
          <div class="pane-header">New Patient Admission</div>
          <div class="pane-content">
            <form id="patient-reg-form">
              <div class="form-group">
                <label for="pat-name">Full Name (As in Passport/ID)</label>
                <input type="text" id="pat-name" class="form-control" placeholder="E.g., Zayed Al-Nahyan" required>
              </div>
              <div class="flex-row">
                <div class="form-group" style="flex: 1;">
                  <label for="pat-dob">Date of Birth</label>
                  <input type="date" id="pat-dob" class="form-control" required>
                </div>
                <div class="form-group" style="flex: 1;">
                  <label for="pat-gender">Gender</label>
                  <select id="pat-gender" class="form-control" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="flex-row">
                <div class="form-group" style="flex: 1;">
                  <label for="pat-phone">Contact Number</label>
                  <input type="tel" id="pat-phone" class="form-control" placeholder="+971 50 123 4567" required>
                </div>
                <div class="form-group" style="flex: 1;">
                  <label for="pat-email">Email Address</label>
                  <input type="email" id="pat-email" class="form-control" placeholder="zayed@gmail.com" required>
                </div>
              </div>

              <!-- Insurance Mapping -->
              <div class="mt-4" style="background: var(--bg-elevated); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
                <div style="font-weight: 600; color: #fff; margin-bottom: 12px; font-size: 13px;">Insurance Policy Mapping (DHA/CHI)</div>
                
                <div class="form-group">
                  <label for="pat-ins-country">Compliance Market</label>
                  <select id="pat-ins-country" class="form-control">
                    <option value="UAE">UAE (DHA / MOHAP)</option>
                    <option value="KSA">Saudi Arabia (CHI)</option>
                    <option value="General">General / International</option>
                    <option value="None">Self-Pay (No Insurance)</option>
                  </select>
                </div>
                
                <div class="flex-row">
                  <div class="form-group" style="flex: 1;">
                    <label for="pat-ins-provider">Insurance Carrier</label>
                    <input type="text" id="pat-ins-provider" class="form-control" placeholder="E.g., Daman">
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="pat-ins-member">Member Policy ID</label>
                    <input type="text" id="pat-ins-member" class="form-control" placeholder="E.g., TAW-55421">
                  </div>
                </div>
                
                <div class="flex-row">
                  <div class="form-group" style="flex: 1;">
                    <label for="pat-ins-plan">Corporate Plan Code</label>
                    <input type="text" id="pat-ins-plan" class="form-control" placeholder="E.g., PLAT-01">
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="pat-ins-coins">Co-insurance %</label>
                    <input type="number" id="pat-ins-coins" class="form-control" min="0" max="100" value="10">
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="pat-ins-copay">Co-pay (AED/SAR)</label>
                    <input type="number" id="pat-ins-copay" class="form-control" min="0" value="20">
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-user-plus"></i> Submit Registration</button>
            </form>
          </div>
        </div>

        <!-- Output Pane: Registry and Timeline -->
        <div class="output-pane">
          <div class="pane-header" style="display: flex; justify-content: space-between; align-items: center;">
            <span>Admitted Patient Database</span>
            <input type="text" id="patient-search" class="form-control" placeholder="Search..." style="width: 150px; padding: 6px; font-size: 12px; height: 30px;">
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Top Half: Patient Table -->
            <div style="flex: 1; overflow-y: auto; border-bottom: 1px solid var(--border-subtle);">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); position: sticky; top: 0;">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Patient</th>
                    <th style="text-align: left; padding: 12px 16px;">Details</th>
                    <th style="text-align: left; padding: 12px 16px;">Action</th>
                  </tr>
                </thead>
                <tbody id="patient-table-body">
                  ${renderPatientRows(patients)}
                </tbody>
              </table>
            </div>
            
            <!-- Bottom Half: EHR Timeline -->
            <div id="patient-ehr-timeline" style="flex: 1; overflow-y: auto; background: var(--bg-elevated); padding: 16px;">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <i class="fas fa-address-card" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                <div style="font-size: 13px;">Select a patient to view their Electronic Health Record (EHR) timeline</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handle Form Submit
    document.getElementById('patient-reg-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const insCountry = document.getElementById('pat-ins-country').value;
      let insData = { provider: 'Self-Pay', memberId: '', country: 'General', planCode: '', coinsurance: 100, copay: 0 };
      
      if (insCountry !== 'None') {
        insData = {
          provider: document.getElementById('pat-ins-provider').value || 'General Plan',
          memberId: document.getElementById('pat-ins-member').value || 'MEMBER-TMP',
          country: insCountry,
          planCode: document.getElementById('pat-ins-plan').value || 'PLAN-DEFAULT',
          coinsurance: parseFloat(document.getElementById('pat-ins-coins').value) || 10,
          copay: parseFloat(document.getElementById('pat-ins-copay').value) || 0
        };
      }

      db.registerPatient({
        name: document.getElementById('pat-name').value,
        dob: document.getElementById('pat-dob').value,
        gender: document.getElementById('pat-gender').value,
        phone: document.getElementById('pat-phone').value,
        email: document.getElementById('pat-email').value,
        insurance: insData
      });
      render(); 
    });

    document.getElementById('patient-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = patients.filter(p => p.id.toLowerCase().includes(query) || p.name.toLowerCase().includes(query));
      document.getElementById('patient-table-body').innerHTML = renderPatientRows(filtered);
      bindPatientSelectEvents();
    });

    document.getElementById('pat-ins-country').addEventListener('change', (e) => {
      const isNone = e.target.value === 'None';
      ['pat-ins-provider', 'pat-ins-member', 'pat-ins-plan', 'pat-ins-coins', 'pat-ins-copay'].forEach(id => {
        document.getElementById(id).disabled = isNone;
      });
      if (isNone) {
        document.getElementById('pat-ins-coins').value = 100;
        document.getElementById('pat-ins-copay').value = 0;
      } else {
        document.getElementById('pat-ins-coins').value = 10;
        document.getElementById('pat-ins-copay').value = 20;
      }
    });

    bindPatientSelectEvents();
  }

  function renderPatientRows(patientsList) {
    if (patientsList.length === 0) {
      return `<tr><td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted);">No patients found</td></tr>`;
    }
    return patientsList.map(p => {
      const age = calculateAge(p.dob);
      return `
        <tr class="patient-row-btn" data-id="${p.id}" style="border-bottom: 1px solid var(--border-subtle); cursor: pointer; transition: background 0.2s;">
          <td style="padding: 12px 16px;">
            <div style="font-weight: 600; color: #fff;">${p.name}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">ID: ${p.id}</div>
          </td>
          <td style="padding: 12px 16px; font-size: 12px; color: var(--text-secondary);">
            ${age}y / ${p.gender.charAt(0)}<br>
            <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; background: ${p.insurance.provider === 'Self-Pay' ? 'var(--border-subtle)' : 'rgba(16, 185, 129, 0.1)'}; color: ${p.insurance.provider === 'Self-Pay' ? 'var(--text-secondary)' : 'var(--accent-success)'};">${p.insurance.provider}</span>
          </td>
          <td style="padding: 12px 16px;">
            <button class="btn view-ehr-btn" data-id="${p.id}" style="padding: 4px 8px; font-size: 11px;"><i class="fas fa-folder-open"></i> EHR</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function bindPatientSelectEvents() {
    const rows = document.querySelectorAll('.patient-row-btn');
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => row.style.backgroundColor = 'var(--bg-elevated)');
      row.addEventListener('mouseleave', () => row.style.backgroundColor = 'transparent');
      row.addEventListener('click', () => loadPatientEHR(row.getAttribute('data-id')));
    });

    document.querySelectorAll('.view-ehr-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadPatientEHR(btn.getAttribute('data-id'));
      });
    });
  }

  function loadPatientEHR(pId) {
    const patients = db.get('patients');
    const p = patients.find(pat => pat.id === pId);
    if (!p) return;

    selectedPatient = p;
    const age = calculateAge(p.dob);
    const timeline = p.timeline || [];

    const timelineHtml = timeline.slice().reverse().map(event => {
      let icon = 'fa-file-medical';
      let color = 'var(--accent-primary)';
      if (event.type.includes('Appointment')) { icon = 'fa-calendar-check'; color = '#3b82f6'; }
      if (event.type.includes('Triage')) { icon = 'fa-brain'; color = '#8b5cf6'; }
      if (event.type.includes('Nurse')) { icon = 'fa-user-nurse'; color = '#ec4899'; }
      if (event.type.includes('Lab') || event.type.includes('Radiology')) { icon = 'fa-vials'; color = '#f59e0b'; }
      if (event.type.includes('Pharmacy')) { icon = 'fa-capsules'; color = '#10b981'; }
      if (event.type.includes('Claim') || event.type.includes('Payment')) { icon = 'fa-file-invoice-dollar'; color = '#64748b'; }

      return `
        <div style="display: flex; gap: 16px; margin-bottom: 20px; position: relative;">
          <div style="width: 2px; background: var(--border-subtle); position: absolute; left: 15px; top: 30px; bottom: -20px; z-index: 1;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface); border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0;">
            <i class="fas ${icon}" style="color: ${color}; font-size: 12px;"></i>
          </div>
          <div style="flex: 1; background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
              <strong style="font-size: 13px; color: #fff;">${event.type}</strong>
              <small style="color: var(--text-muted); font-size: 11px;">${new Date(event.timestamp).toLocaleString()}</small>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0;">${event.details}</p>
          </div>
        </div>
      `;
    }).join('');

    const timelineContainer = document.getElementById('patient-ehr-timeline');
    timelineContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h4 style="font-size: 16px; color: #fff; margin: 0;">${p.name}</h4>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">EHR ID: ${p.id}</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: var(--text-secondary);">
          <div>${age} yrs • ${p.gender}</div>
          <div style="margin-top: 4px;"><i class="fas fa-shield-alt"></i> ${p.insurance.provider}</div>
        </div>
      </div>
      
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 16px; font-weight: 600;">Clinical History</div>
      <div style="position: relative;">
        ${timelineHtml || `<div style="text-align:center; color: var(--text-muted); padding: 20px;">No historical records found.</div>`}
      </div>
    `;
  }

  function calculateAge(dobString) {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  render();
}
