import { DEPARTMENTS, ROLES_PERMISSIONS } from './data.js';

export function initMastersScreen(db, container) {
  let activeTab = 'doctors'; // doctors, services, departments, users
  
  function render() {
    container.innerHTML = `
      <div style="display: flex; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
        <button class="btn ${activeTab === 'doctors' ? 'btn-primary' : ''}" id="tab-doctors"><i class="fas fa-user-md"></i> Doctors</button>
        <button class="btn ${activeTab === 'services' ? 'btn-primary' : ''}" id="tab-services"><i class="fas fa-stethoscope"></i> Services</button>
        <button class="btn ${activeTab === 'departments' ? 'btn-primary' : ''}" id="tab-departments"><i class="fas fa-clinic-medical"></i> Departments</button>
        <button class="btn ${activeTab === 'users' ? 'btn-primary' : ''}" id="tab-users"><i class="fas fa-users-cog"></i> Access Roles</button>
      </div>

      <div id="master-tab-content" style="height: calc(100% - 60px);">
        <!-- Dynamic Tab Content -->
      </div>
    `;
    
    document.getElementById('tab-doctors').addEventListener('click', () => { activeTab = 'doctors'; render(); });
    document.getElementById('tab-services').addEventListener('click', () => { activeTab = 'services'; render(); });
    document.getElementById('tab-departments').addEventListener('click', () => { activeTab = 'departments'; render(); });
    document.getElementById('tab-users').addEventListener('click', () => { activeTab = 'users'; render(); });
    
    renderTabContent();
  }

  function renderTabContent() {
    const tabContentEl = document.getElementById('master-tab-content');
    
    if (activeTab === 'doctors') {
      const doctors = db.get('doctors');
      tabContentEl.innerHTML = `
        <div class="split-layout">
          <!-- Input Pane -->
          <div class="input-pane">
            <div class="pane-header">Register New Doctor</div>
            <div class="pane-content">
              <form id="add-doctor-form">
                <div class="form-group">
                  <label for="doc-name">Doctor Name</label>
                  <input type="text" id="doc-name" class="form-control" placeholder="Dr. John Doe" required>
                </div>
                <div class="flex-row">
                  <div class="form-group" style="flex: 1;">
                    <label for="doc-specialty">Specialty</label>
                    <input type="text" id="doc-specialty" class="form-control" placeholder="Cardiologist" required>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="doc-dept">Department</label>
                    <select id="doc-dept" class="form-control" required>
                      ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="doc-schedule">Weekly Schedule</label>
                  <input type="text" id="doc-schedule" class="form-control" placeholder="Mon-Wed-Fri, 09:00 - 17:00" required>
                </div>
                <div class="form-group">
                  <label for="doc-fee">Consultation Fee (AED)</label>
                  <input type="number" id="doc-fee" class="form-control" min="50" value="250" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-plus"></i> Add to Master</button>
              </form>
            </div>
          </div>
          
          <!-- Output Pane -->
          <div class="output-pane">
            <div class="pane-header">Active Doctor Registry</div>
            <div class="pane-content" style="padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Doctor Details</th>
                    <th style="text-align: left; padding: 12px 16px;">Schedule</th>
                    <th style="text-align: right; padding: 12px 16px;">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  ${doctors.map(doc => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 16px;">
                        <div style="font-weight: 600; color: #fff;">${doc.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">ID: ${doc.id} • ${doc.specialty} (${doc.departmentId.toUpperCase()})</div>
                      </td>
                      <td style="padding: 16px; font-size: 12px; color: var(--text-secondary);">${doc.schedule}</td>
                      <td style="padding: 16px; text-align: right; font-weight: 600; color: var(--text-success);">${doc.fee} AED</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      document.getElementById('add-doctor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        db.addDoctor({
          name: document.getElementById('doc-name').value,
          specialty: document.getElementById('doc-specialty').value,
          departmentId: document.getElementById('doc-dept').value,
          fee: parseFloat(document.getElementById('doc-fee').value),
          schedule: document.getElementById('doc-schedule').value
        });
        render(); 
      });

    } else if (activeTab === 'services') {
      const services = db.get('services');
      tabContentEl.innerHTML = `
        <div class="split-layout">
          <!-- Input Pane -->
          <div class="input-pane">
            <div class="pane-header">Configure Clinical Service</div>
            <div class="pane-content">
              <form id="add-service-form">
                <div class="form-group">
                  <label for="srv-name">Service Name</label>
                  <input type="text" id="srv-name" class="form-control" placeholder="E.g., Complete Blood Count" required>
                </div>
                <div class="flex-row">
                  <div class="form-group" style="flex: 1;">
                    <label for="srv-cpt">CPT Code (Billing)</label>
                    <input type="text" id="srv-cpt" class="form-control" placeholder="E.g., 85025" required>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="srv-fee">Base Fee (AED)</label>
                    <input type="number" id="srv-fee" class="form-control" min="10" value="100" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="srv-dept">Department Owner</label>
                  <select id="srv-dept" class="form-control" required>
                    ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-plus"></i> Add Service</button>
              </form>
            </div>
          </div>
          
          <!-- Output Pane -->
          <div class="output-pane">
            <div class="pane-header">Clinical Service Catalog</div>
            <div class="pane-content" style="padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">Service</th>
                    <th style="text-align: left; padding: 12px 16px;">Code / Dept</th>
                    <th style="text-align: right; padding: 12px 16px;">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  ${services.map(srv => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 16px;">
                        <div style="font-weight: 600; color: #fff;">${srv.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">ID: ${srv.id}</div>
                      </td>
                      <td style="padding: 16px; font-size: 12px; color: var(--text-secondary);">
                        CPT: <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${srv.cpt}</span><br>
                        ${srv.departmentId.toUpperCase()}
                      </td>
                      <td style="padding: 16px; text-align: right; font-weight: 600; color: var(--text-success);">${srv.fee} AED</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      document.getElementById('add-service-form').addEventListener('submit', (e) => {
        e.preventDefault();
        db.addService({
          name: document.getElementById('srv-name').value,
          cpt: document.getElementById('srv-cpt').value,
          fee: parseFloat(document.getElementById('srv-fee').value),
          departmentId: document.getElementById('srv-dept').value
        });
        render();
      });

    } else if (activeTab === 'departments') {
      tabContentEl.innerHTML = `
        <div class="output-pane" style="max-width: 800px; margin: 0 auto; height: 100%;">
          <div class="pane-header">Hospital Departments (System Locked)</div>
          <div class="pane-content" style="padding: 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                <tr>
                  <th style="text-align: left; padding: 12px 16px;">Dept ID</th>
                  <th style="text-align: left; padding: 12px 16px;">Department Name</th>
                  <th style="text-align: left; padding: 12px 16px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${DEPARTMENTS.map(d => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 16px; font-weight: 600; color: #fff;">${d.id.toUpperCase()}</td>
                    <td style="padding: 16px;"><i class="fas ${d.icon} text-muted" style="margin-right:8px;"></i> ${d.name}</td>
                    <td style="padding: 16px;"><span style="background: rgba(16, 185, 129, 0.1); color: var(--accent-success); padding: 4px 8px; border-radius: 100px; font-size: 11px; font-weight: 600;">Active Triage Node</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      
    } else if (activeTab === 'users') {
      const users = db.get('users');
      tabContentEl.innerHTML = `
        <div class="split-layout">
          <!-- Input Pane -->
          <div class="input-pane">
            <div class="pane-header">Provision Staff Access</div>
            <div class="pane-content">
              <form id="add-user-form">
                <div class="form-group">
                  <label for="usr-name">Staff Full Name</label>
                  <input type="text" id="usr-name" class="form-control" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                  <label for="usr-username">System Username</label>
                  <input type="text" id="usr-username" class="form-control" placeholder="johndoe" required>
                </div>
                <div class="flex-row">
                  <div class="form-group" style="flex: 1;">
                    <label for="usr-role">Access Role</label>
                    <select id="usr-role" class="form-control" required>
                      <option value="admin">Admin</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="nurse">Nurse</option>
                      <option value="doctor">Doctor</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="technician">Technician</option>
                      <option value="billing_clerk">Billing Clerk</option>
                    </select>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label for="usr-dept">Department Map</label>
                    <select id="usr-dept" class="form-control" required>
                      ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-plus"></i> Grant Access</button>
              </form>
              
              <div class="mt-4" style="background: var(--bg-elevated); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 11px; color: var(--text-secondary);">
                <div style="font-weight: 600; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Security Matrix Reference</div>
                ${Object.keys(ROLES_PERMISSIONS).map(role => `
                  <div style="margin-bottom: 6px;">
                    <strong style="color: var(--accent-primary);">${role.toUpperCase()}</strong>: ${ROLES_PERMISSIONS[role].join(', ')}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Output Pane -->
          <div class="output-pane">
            <div class="pane-header">Authorized Users</div>
            <div class="pane-content" style="padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                  <tr>
                    <th style="text-align: left; padding: 12px 16px;">User</th>
                    <th style="text-align: left; padding: 12px 16px;">Role / Dept</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(usr => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 16px;">
                        <div style="font-weight: 600; color: #fff;">${usr.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">@${usr.username}</div>
                      </td>
                      <td style="padding: 16px; font-size: 12px; color: var(--text-secondary);">
                        <span style="background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${usr.role.toUpperCase()}</span><br>
                        <div style="margin-top: 4px;">${usr.departmentId.toUpperCase()}</div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      document.getElementById('add-user-form').addEventListener('submit', (e) => {
        e.preventDefault();
        db.addUser({
          username: document.getElementById('usr-username').value.toLowerCase().trim(),
          name: document.getElementById('usr-name').value,
          role: document.getElementById('usr-role').value,
          departmentId: document.getElementById('usr-dept').value
        });
        render();
      });
    }
  }

  render();
}
