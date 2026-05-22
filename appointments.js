export function initAppointmentsScreen(db, container) {
  let activeBookingType = 'doctor'; // doctor, service

  function render() {
    const patients = db.get('patients') || [];
    const doctors = db.get('doctors') || [];
    const services = db.get('services') || [];
    const appointments = db.get('appointments') || [];

    container.innerHTML = `
      <div class="split-layout">
        <!-- Input Pane: Forms -->
        <div class="input-pane">
          <div class="pane-header">Schedule Appointment</div>
          <div class="pane-content">
            
            <!-- Type Toggle -->
            <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--bg-elevated); padding: 4px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <button class="btn ${activeBookingType === 'doctor' ? 'btn-primary' : ''}" id="btn-set-doctor-appt" style="flex:1; border:none; ${activeBookingType === 'doctor' ? '' : 'background:transparent; color:var(--text-secondary)'}">
                <i class="fas fa-user-md"></i> Doctor Consultation
              </button>
              <button class="btn ${activeBookingType === 'service' ? 'btn-primary' : ''}" id="btn-set-service-appt" style="flex:1; border:none; ${activeBookingType === 'service' ? '' : 'background:transparent; color:var(--text-secondary)'}">
                <i class="fas fa-stethoscope"></i> Clinical Service
              </button>
            </div>

            <div id="booking-form-container">
              <!-- Dynamic Form -->
            </div>

          </div>
        </div>

        <!-- Output Pane: Schedule Board -->
        <div class="output-pane">
          <div class="pane-header">Active Booking Schedule</div>
          <div class="pane-content" style="padding: 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead style="background-color: var(--bg-elevated); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                <tr>
                  <th style="text-align: left; padding: 12px 16px;">Patient & Time</th>
                  <th style="text-align: left; padding: 12px 16px;">Target</th>
                  <th style="text-align: right; padding: 12px 16px;">Cost</th>
                </tr>
              </thead>
              <tbody>
                ${appointments.length === 0 ? `
                  <tr><td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted);">No appointments booked for today</td></tr>
                ` : appointments.slice().reverse().map(apt => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 16px;">
                      <div style="font-weight: 600; color: #fff;">${apt.patientName}</div>
                      <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
                        <i class="far fa-clock"></i> ${new Date(apt.dateTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td style="padding: 16px; font-size: 12px; color: var(--text-secondary);">
                      <span style="background: ${apt.type === 'doctor' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${apt.type === 'doctor' ? 'var(--accent-primary)' : 'var(--accent-success)'}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${apt.type.toUpperCase()}</span><br>
                      <div style="margin-top: 4px; font-weight: 500; color: #fff;">${apt.targetName}</div>
                    </td>
                    <td style="padding: 16px; text-align: right; font-weight: 600; color: var(--text-primary);">${apt.cost} AED</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-set-doctor-appt').addEventListener('click', () => { activeBookingType = 'doctor'; render(); });
    document.getElementById('btn-set-service-appt').addEventListener('click', () => { activeBookingType = 'service'; render(); });

    renderBookingForm(patients, doctors, services);
  }

  function renderBookingForm(patients, doctors, services) {
    const formContainer = document.getElementById('booking-form-container');
    
    if (patients.length === 0) {
      formContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; color: var(--text-muted); background: var(--bg-elevated); border-radius: 8px; border: 1px dashed var(--border-subtle);">
          <i class="fas fa-user-plus" style="font-size: 32px; color: var(--text-secondary); margin-bottom: 12px;"></i>
          <p style="font-size: 13px;">No patients found. Please admit a patient in the Registration module first.</p>
        </div>
      `;
      return;
    }

    if (activeBookingType === 'doctor') {
      formContainer.innerHTML = `
        <form id="book-doctor-appt-form">
          <div class="form-group">
            <label for="appt-patient-select">Patient</label>
            <select id="appt-patient-select" class="form-control" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="appt-doc-select">Mapped Doctor</label>
            <select id="appt-doc-select" class="form-control" required>
              ${doctors.map(d => `<option value="${d.id}" data-fee="${d.fee}">${d.name} - ${d.specialty}</option>`).join('')}
            </select>
          </div>

          <div class="flex-row">
            <div class="form-group" style="flex: 1;">
              <label for="appt-date">Date & Time</label>
              <input type="datetime-local" id="appt-date" class="form-control" required>
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="appt-fee-preview">Consult Fee (AED)</label>
              <input type="text" id="appt-fee-preview" class="form-control" readonly style="background: var(--bg-elevated); font-weight: 600; color: var(--accent-success);">
            </div>
          </div>

          <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--text-secondary); margin: 16px 0;">
            <strong style="color: var(--accent-primary);">Automated Workflow:</strong> Booking this consultation will automatically generate a draft invoice item in the Billing module.
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fas fa-calendar-check"></i> Confirm Appointment</button>
        </form>
      `;

      const docSelect = document.getElementById('appt-doc-select');
      const feePreview = document.getElementById('appt-fee-preview');
      const updateFeePreview = () => {
        if(docSelect.options.length > 0) {
          const fee = docSelect.options[docSelect.selectedIndex].getAttribute('data-fee');
          feePreview.value = fee;
        }
      };
      docSelect.addEventListener('change', updateFeePreview);
      updateFeePreview(); 

      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(9, 0, 0, 0);
      const tzOffset = nextDay.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(nextDay.getTime() - tzOffset)).toISOString().slice(0, 16);
      document.getElementById('appt-date').value = localISOTime;

      document.getElementById('book-doctor-appt-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const patSelect = document.getElementById('appt-patient-select');
        const patId = patSelect.value;
        const patName = patSelect.options[patSelect.selectedIndex].text.split(' (')[0];
        
        const docId = docSelect.value;
        const docName = docSelect.options[docSelect.selectedIndex].text.split(' - ')[0];
        const fee = parseFloat(docSelect.options[docSelect.selectedIndex].getAttribute('data-fee'));
        const dateTime = document.getElementById('appt-date').value;

        db.createAppointment({
          patientId: patId,
          patientName: patName,
          type: 'doctor',
          targetId: docId,
          targetName: docName,
          dateTime: dateTime,
          cost: fee
        });

        db.autoDraftInvoiceItem(patId, `Consultation: ${docName}`, docId, fee);
        render(); 
      });

    } else if (activeBookingType === 'service') {
      formContainer.innerHTML = `
        <form id="book-service-appt-form">
          <div class="form-group">
            <label for="appt-patient-select">Patient</label>
            <select id="appt-patient-select" class="form-control" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="appt-srv-select">Clinical Service</label>
            <select id="appt-srv-select" class="form-control" required>
              ${services.map(s => `<option value="${s.id}" data-fee="${s.fee}" data-dept="${s.departmentId}">${s.name} [CPT: ${s.cpt}]</option>`).join('')}
            </select>
          </div>

          <div class="flex-row">
            <div class="form-group" style="flex: 1;">
              <label for="appt-date">Schedule Date & Time</label>
              <input type="datetime-local" id="appt-date" class="form-control" required>
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="appt-fee-preview">Cost (AED)</label>
              <input type="text" id="appt-fee-preview" class="form-control" readonly style="background: var(--bg-elevated); font-weight: 600; color: var(--accent-success);">
            </div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--text-secondary); margin: 16px 0;">
            <strong style="color: var(--accent-success);">Automated Workflow:</strong> Booking this service will auto-draft a charge in Billing AND auto-route a pending order to the Lab/Radiology queue.
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fas fa-calendar-check"></i> Confirm Service Appointment</button>
        </form>
      `;

      const srvSelect = document.getElementById('appt-srv-select');
      const feePreview = document.getElementById('appt-fee-preview');
      const updateFeePreview = () => {
        if(srvSelect.options.length > 0) {
          const fee = srvSelect.options[srvSelect.selectedIndex].getAttribute('data-fee');
          feePreview.value = fee;
        }
      };
      srvSelect.addEventListener('change', updateFeePreview);
      updateFeePreview(); 

      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(10, 0, 0, 0);
      const tzOffset = nextDay.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(nextDay.getTime() - tzOffset)).toISOString().slice(0, 16);
      document.getElementById('appt-date').value = localISOTime;

      document.getElementById('book-service-appt-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const patSelect = document.getElementById('appt-patient-select');
        const patId = patSelect.value;
        const patName = patSelect.options[patSelect.selectedIndex].text.split(' (')[0];
        
        const srvId = srvSelect.value;
        const selectedOption = srvSelect.options[srvSelect.selectedIndex];
        const srvName = selectedOption.text.split(' [CPT:')[0];
        const fee = parseFloat(selectedOption.getAttribute('data-fee'));
        const dept = selectedOption.getAttribute('data-dept');
        const dateTime = document.getElementById('appt-date').value;

        db.createAppointment({
          patientId: patId,
          patientName: patName,
          type: 'service',
          targetId: srvId,
          targetName: srvName,
          dateTime: dateTime,
          cost: fee
        });

        db.autoDraftInvoiceItem(patId, `Service: ${srvName}`, srvId, fee);

        if (dept === 'laboratory' || dept === 'radiology') {
          db.createOrder({
            patientId: patId,
            type: dept === 'laboratory' ? 'lab' : 'radiology',
            serviceId: srvId,
            serviceName: srvName
          });
        }

        render(); 
      });
    }
  }

  render();
}
