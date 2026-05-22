// HMS'ai Hospital Mock Database & State Management

const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', icon: 'fa-heartbeat' },
  { id: 'pulmonology', name: 'Pulmonology', icon: 'fa-lungs' },
  { id: 'orthopedics', name: 'Orthopedics', icon: 'fa-bone' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'fa-baby' },
  { id: 'general_medicine', name: 'General Medicine', icon: 'fa-stethoscope' },
  { id: 'emergency', name: 'Emergency Room (ER)', icon: 'fa-ambulance' },
  { id: 'laboratory', name: 'Laboratory', icon: 'fa-vials' },
  { id: 'radiology', name: 'Radiology', icon: 'fa-x-ray' }
];

const DOCTORS = [
  { id: 'doc-1', name: 'Dr. Sarah Al-Mansoori', specialty: 'Senior Cardiologist', departmentId: 'cardiology', schedule: 'Mon-Wed-Fri, 09:00 - 17:00', fee: 350 },
  { id: 'doc-2', name: 'Dr. Tariq Al-Harbi', specialty: 'Pulmonologist Specialist', departmentId: 'pulmonology', schedule: 'Tue-Thu, 10:00 - 18:00', fee: 300 },
  { id: 'doc-3', name: 'Dr. Emily Watson', specialty: 'Pediatric Specialist', departmentId: 'pediatrics', schedule: 'Mon-Tue-Wed, 08:30 - 15:30', fee: 280 },
  { id: 'doc-4', name: 'Dr. Khalid bin Waleed', specialty: 'Orthopedic Surgeon', departmentId: 'orthopedics', schedule: 'Mon-Thu, 09:00 - 16:00', fee: 400 },
  { id: 'doc-5', name: 'Dr. Amina Yusuf', specialty: 'General Practitioner', departmentId: 'general_medicine', schedule: 'Daily, 08:00 - 14:00', fee: 200 },
  { id: 'doc-6', name: 'Dr. Faisal Al-Otaibi', specialty: 'ER Chief Physician', departmentId: 'emergency', schedule: 'Roster Rotational', fee: 300 }
];

const SERVICES = [
  { id: 'srv-1', name: 'Complete Blood Count (CBC)', cpt: '85025', fee: 120, departmentId: 'laboratory' },
  { id: 'srv-2', name: 'Basic Metabolic Panel (BMP)', cpt: '80048', fee: 150, departmentId: 'laboratory' },
  { id: 'srv-3', name: 'Chest X-Ray (2 Views)', cpt: '71046', fee: 220, departmentId: 'radiology' },
  { id: 'srv-4', name: 'MRI Brain (Without Contrast)', cpt: '70551', fee: 1200, departmentId: 'radiology' },
  { id: 'srv-5', name: 'Electrocardiogram (ECG/EKG)', cpt: '93000', fee: 180, departmentId: 'cardiology' },
  { id: 'srv-6', name: 'Spirometry Lung Function', cpt: '94010', fee: 250, departmentId: 'pulmonology' },
  { id: 'srv-7', name: 'Joint X-Ray (Knee/Shoulder)', cpt: '73560', fee: 210, departmentId: 'radiology' },
  { id: 'srv-8', name: 'Pediatric Vaccine Dose', cpt: '90471', fee: 90, departmentId: 'pediatrics' }
];

const ROLES_PERMISSIONS = {
  admin: ['masters', 'registration', 'appointments', 'triage', 'nurse_assessment', 'lab_radiology', 'pharmacy', 'insurance_billing', 'ledger'],
  receptionist: ['registration', 'appointments', 'ledger'],
  nurse: ['triage', 'nurse_assessment', 'ledger'],
  doctor: ['appointments', 'nurse_assessment', 'lab_radiology', 'pharmacy', 'ledger'],
  pharmacist: ['pharmacy', 'ledger'],
  technician: ['lab_radiology', 'ledger'],
  billing_clerk: ['insurance_billing', 'ledger']
};

const USERS = [
  { id: 'usr-admin', username: 'admin', name: 'System Administrator', role: 'admin', departmentId: 'general_medicine' },
  { id: 'usr-recep', username: 'receptionist', name: 'Sarah Connor', role: 'receptionist', departmentId: 'general_medicine' },
  { id: 'usr-nurse', username: 'nurse', name: 'Nurse Clara Barton', role: 'nurse', departmentId: 'emergency' },
  { id: 'usr-doc', username: 'doctor', name: 'Dr. Sarah Al-Mansoori', role: 'doctor', departmentId: 'cardiology' },
  { id: 'usr-pharm', username: 'pharmacist', name: 'John Pemberton', role: 'pharmacist', departmentId: 'laboratory' },
  { id: 'usr-tech', username: 'technician', name: 'Marie Curie', role: 'technician', departmentId: 'radiology' },
  { id: 'usr-billing', username: 'billing', name: 'Warren Buffett', role: 'billing_clerk', departmentId: 'general_medicine' }
];

// Initial mock state if localStorage is empty
const INITIAL_PATIENTS = [
  { id: 'PAT-1001', name: 'Zayed Al-Nahyan', dob: '1985-04-12', gender: 'Male', phone: '+971 50 123 4567', email: 'zayed@gmail.com', insurance: { provider: 'Daman Health (UAE)', memberId: 'DAM-99283-A', country: 'UAE', planCode: 'DAM-GOLD-01', coinsurance: 10, copay: 20 }, timeline: [] },
  { id: 'PAT-1002', name: 'Fahad bin Abdulaziz', dob: '1990-09-22', gender: 'Male', phone: '+966 55 987 6543', email: 'fahad@outlook.sa', insurance: { provider: 'Tawuniya (KSA)', memberId: 'TAW-55421-B', country: 'KSA', planCode: 'TAW-PLAT-00', coinsurance: 15, copay: 50 }, timeline: [] },
  { id: 'PAT-1003', name: 'Jessica Miller', dob: '1998-11-05', gender: 'Female', phone: '+1 415 555 2671', email: 'jess.miller@yahoo.com', insurance: { provider: 'Self-Pay', memberId: '', country: 'General', planCode: '', coinsurance: 100, copay: 0 }, timeline: [] }
];

const INITIAL_INVENTORY = {
  'Main Pharmacy': [
    { id: 'med-1', name: 'Paracetamol 500mg', stock: 1200, minStock: 200, unitPrice: 2.50 },
    { id: 'med-2', name: 'Amoxicillin 250mg', stock: 800, minStock: 150, unitPrice: 8.00 },
    { id: 'med-3', name: 'Metformin 850mg', stock: 1500, minStock: 300, unitPrice: 4.20 },
    { id: 'med-4', name: 'Atorvastatin 20mg', stock: 950, minStock: 100, unitPrice: 12.50 },
    { id: 'med-5', name: 'Ibuprofen 400mg', stock: 2000, minStock: 400, unitPrice: 3.10 },
    { id: 'med-6', name: 'Salbutamol Inhaler', stock: 350, minStock: 50, unitPrice: 22.00 }
  ],
  'ICU Store': [
    { id: 'med-1', name: 'Paracetamol 500mg', stock: 150, minStock: 50, unitPrice: 2.50 },
    { id: 'med-2', name: 'Amoxicillin 250mg', stock: 50, minStock: 20, unitPrice: 8.00 },
    { id: 'med-7', name: 'Epinephrine IV', stock: 120, minStock: 30, unitPrice: 45.00 },
    { id: 'med-8', name: 'Propofol Injectable', stock: 90, minStock: 15, unitPrice: 85.00 }
  ],
  'ER Store': [
    { id: 'med-1', name: 'Paracetamol 500mg', stock: 300, minStock: 80, unitPrice: 2.50 },
    { id: 'med-5', name: 'Ibuprofen 400mg', stock: 250, minStock: 60, unitPrice: 3.10 },
    { id: 'med-7', name: 'Epinephrine IV', stock: 60, minStock: 20, unitPrice: 45.00 },
    { id: 'med-9', name: 'Morphine IV', stock: 40, minStock: 10, unitPrice: 65.00 }
  ],
  'General Ward Store': [
    { id: 'med-1', name: 'Paracetamol 500mg', stock: 400, minStock: 100, unitPrice: 2.50 },
    { id: 'med-3', name: 'Metformin 850mg', stock: 200, minStock: 50, unitPrice: 4.20 },
    { id: 'med-5', name: 'Ibuprofen 400mg', stock: 300, minStock: 80, unitPrice: 3.10 }
  ]
};

class HMSDatabase {
  constructor() {
    this.keyPrefix = 'hms_ai_';
    this.init();
  }

  init() {
    this.getOrSet('doctors', DOCTORS);
    this.getOrSet('services', SERVICES);
    this.getOrSet('users', USERS);
    this.getOrSet('patients', INITIAL_PATIENTS);
    this.getOrSet('appointments', []);
    this.getOrSet('triage', []);
    this.getOrSet('assessments', []);
    this.getOrSet('lab_orders', []);
    this.getOrSet('inventory', INITIAL_INVENTORY);
    this.getOrSet('invoices', []);
    this.getOrSet('ledger', [
      { id: 'LOG-0001', timestamp: new Date().toISOString(), module: 'System', action: 'HMS\'ai Hospital Management Core Initialized', status: 'SUCCESS' }
    ]);
  }

  getOrSet(key, defaultValue) {
    const fullKey = this.keyPrefix + key;
    const stored = localStorage.getItem(fullKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing localStorage key ${fullKey}`, e);
      }
    }
    localStorage.setItem(fullKey, JSON.stringify(defaultValue));
    return defaultValue;
  }

  save(key, data) {
    localStorage.setItem(this.keyPrefix + key, JSON.stringify(data));
  }

  get(key) {
    return JSON.parse(localStorage.getItem(this.keyPrefix + key));
  }

  // --- Transactions ---

  // Patients
  registerPatient(patientData) {
    const patients = this.get('patients');
    const newId = `PAT-${1000 + patients.length + 1}`;
    const newPatient = {
      id: newId,
      ...patientData,
      timeline: [{ timestamp: new Date().toISOString(), type: 'Registration', details: 'Registered at Front Desk' }]
    };
    patients.push(newPatient);
    this.save('patients', patients);
    this.logTransaction('Registration', `Registered Patient: ${newPatient.name} (${newId})`, 'SUCCESS');
    return newPatient;
  }

  addPatientTimeline(patientId, event) {
    const patients = this.get('patients');
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx !== -1) {
      patients[idx].timeline.push({
        timestamp: new Date().toISOString(),
        ...event
      });
      this.save('patients', patients);
    }
  }

  // Appointments
  createAppointment(apptData) {
    const appts = this.get('appointments');
    const newId = `APT-${2000 + appts.length + 1}`;
    const newAppt = {
      id: newId,
      ...apptData,
      status: 'Scheduled',
      timestamp: new Date().toISOString()
    };
    appts.push(newAppt);
    this.save('appointments', appts);
    this.logTransaction('Appointments', `Scheduled ${newAppt.type} appointment ${newId} for ${newAppt.patientName}`, 'SUCCESS');
    
    this.addPatientTimeline(newAppt.patientId, {
      type: 'Appointment',
      details: `${newAppt.type === 'doctor' ? 'Consultation with ' : 'Service: '}${newAppt.targetName} scheduled for ${newAppt.dateTime}`
    });
    
    return newAppt;
  }

  // Triage
  createTriage(triageData) {
    const triage = this.get('triage');
    const newId = `TRG-${3000 + triage.length + 1}`;
    const newRecord = {
      id: newId,
      ...triageData,
      timestamp: new Date().toISOString()
    };
    triage.push(newRecord);
    this.save('triage', triage);
    
    // Automatically flag high-risk triage in the ledger
    const status = newRecord.urgency === 'Red' ? 'CRITICAL' : (newRecord.urgency === 'Yellow' ? 'WARNING' : 'SUCCESS');
    this.logTransaction('Triage', `AI Symptom Triage (${newRecord.urgency}) completed for Patient ${newRecord.patientId}. Recommending Department: ${newRecord.departmentId}`, status);
    
    this.addPatientTimeline(newRecord.patientId, {
      type: 'Triage',
      details: `AI Triage: Classified Urgency as [${newRecord.urgency}] based on: "${newRecord.symptoms}". Routed to ${newRecord.departmentId}.`
    });

    return newRecord;
  }

  // Nurse Assessment
  createAssessment(assessmentData) {
    const assessments = this.get('assessments');
    const newId = `ASM-${4000 + assessments.length + 1}`;
    const newRecord = {
      id: newId,
      ...assessmentData,
      timestamp: new Date().toISOString()
    };
    assessments.push(newRecord);
    this.save('assessments', assessments);

    this.logTransaction('Nurse Assessment', `Nurse logged vitals for Patient ${newRecord.patientId}. BP: ${newRecord.vitals.bp}, HR: ${newRecord.vitals.pulse}`, 'SUCCESS');
    
    this.addPatientTimeline(newRecord.patientId, {
      type: 'Nurse Assessment',
      details: `Vitals recorded: BP: ${newRecord.vitals.bp}, Pulse: ${newRecord.vitals.pulse}, Temp: ${newRecord.vitals.temp}°C, O2: ${newRecord.vitals.o2}%. Chief Complaint: "${newRecord.complaints}".`
    });

    return newRecord;
  }

  // Lab & Radiology Orders
  createOrder(orderData) {
    const orders = this.get('lab_orders');
    const newId = `${orderData.type === 'lab' ? 'LAB' : 'RAD'}-${5000 + orders.length + 1}`;
    const newOrder = {
      id: newId,
      ...orderData,
      status: 'Pending',
      result: null,
      remarks: null,
      timestamp: new Date().toISOString()
    };
    orders.push(newOrder);
    this.save('lab_orders', orders);

    this.logTransaction(orderData.type === 'lab' ? 'Laboratory' : 'Radiology', `New ${orderData.type.toUpperCase()} order ${newId} created for Patient ${newOrder.patientId}`, 'SUCCESS');
    return newOrder;
  }

  completeOrder(orderId, resultData) {
    const orders = this.get('lab_orders');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = 'Completed';
      orders[idx].result = resultData.result;
      orders[idx].remarks = resultData.remarks;
      orders[idx].completedAt = new Date().toISOString();
      this.save('lab_orders', orders);

      const order = orders[idx];
      this.logTransaction(order.type === 'lab' ? 'Laboratory' : 'Radiology', `AI processing completed for ${order.id}. Diagnostic report generated.`, 'SUCCESS');
      
      this.addPatientTimeline(order.patientId, {
        type: order.type === 'lab' ? 'Laboratory Results' : 'Radiology Report',
        details: `${order.serviceName} completed. AI Analysis: "${resultData.result}".`
      });

      // Auto-trigger invoice drafting if diagnostic complete
      this.autoDraftInvoiceItem(order.patientId, order.serviceName, order.serviceId);
    }
  }

  // Pharmacy Inventory & Dispatch
  dispatchMedication(patientId, pharmacyName, medicineId, quantity) {
    const inventory = this.get('inventory');
    const store = inventory[pharmacyName];
    const medIdx = store.findIndex(m => m.id === medicineId);
    
    if (medIdx !== -1) {
      const med = store[medIdx];
      if (med.stock >= quantity) {
        med.stock -= quantity;
        this.save('inventory', inventory);
        
        this.logTransaction('Pharmacy', `Automated Dispatch: Dispensed ${quantity}x ${med.name} from ${pharmacyName} for Patient ${patientId}`, 'SUCCESS');
        
        this.addPatientTimeline(patientId, {
          type: 'Pharmacy Dispatch',
          details: `Medication Dispensed: ${quantity}x ${med.name} from ${pharmacyName}.`
        });

        // Trigger Auto-Reorder if stock falls below minStock
        if (med.stock < med.minStock) {
          this.triggerAutoReorder(pharmacyName, med.id, med.name);
        }

        // Auto-add medicine charge to patient invoice
        this.autoDraftInvoiceItem(patientId, `Medication: ${med.name} (x${quantity})`, med.id, med.unitPrice * quantity);
        return true;
      } else {
        this.logTransaction('Pharmacy', `STOCKOUT ALERT: Insufficient stock of ${med.name} in ${pharmacyName}`, 'CRITICAL');
        return false;
      }
    }
    return false;
  }

  triggerAutoReorder(pharmacyName, medicineId, medicineName) {
    this.logTransaction('Pharmacy', `AI Reorder Triggered: Out of stock/Low stock on ${medicineName} in ${pharmacyName}. Dispatching supplier PO.`, 'WARNING');
    setTimeout(() => {
      const inventory = this.get('inventory');
      const store = inventory[pharmacyName];
      const idx = store.findIndex(m => m.id === medicineId);
      if (idx !== -1) {
        store[idx].stock += 500; // Auto-restock amount
        this.save('inventory', inventory);
        this.logTransaction('Pharmacy', `Inventory Replenished: Supplier delivered 500x ${medicineName} to ${pharmacyName}`, 'SUCCESS');
      }
    }, 10000);
  }

  refillSubstore(sourceStore, destStore, medicineId, quantity) {
    const inventory = this.get('inventory');
    const src = inventory[sourceStore];
    const dest = inventory[destStore];
    
    const srcMed = src.find(m => m.id === medicineId);
    let destMed = dest.find(m => m.id === medicineId);
    
    if (srcMed && srcMed.stock >= quantity) {
      srcMed.stock -= quantity;
      if (destMed) {
        destMed.stock += quantity;
      } else {
        dest.push({
          id: srcMed.id,
          name: srcMed.name,
          stock: quantity,
          minStock: 20,
          unitPrice: srcMed.unitPrice
        });
      }
      this.save('inventory', inventory);
      this.logTransaction('Pharmacy', `Transferred ${quantity}x ${srcMed.name} from ${sourceStore} to ${destStore}`, 'SUCCESS');
      return true;
    }
    return false;
  }

  // Billing & Advanced Insurance Claim
  autoDraftInvoiceItem(patientId, desc, itemCode, customCharge = null) {
    const invoices = this.get('invoices');
    const patients = this.get('patients');
    const services = this.get('services');
    const doctors = this.get('doctors');
    
    // Find price
    let charge = customCharge;
    if (charge === null) {
      const srv = services.find(s => s.id === itemCode);
      if (srv) {
        charge = srv.fee;
      } else {
        const doc = doctors.find(d => d.id === itemCode);
        if (doc) {
          charge = doc.fee;
        } else {
          charge = 150; // default
        }
      }
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Check if an open/draft invoice exists
    let invoice = invoices.find(inv => inv.patientId === patientId && inv.paymentStatus === 'Pending');
    if (!invoice) {
      const newId = `INV-${6000 + invoices.length + 1}`;
      invoice = {
        id: newId,
        patientId: patientId,
        patientName: patient.name,
        items: [],
        total: 0,
        insuranceCovered: 0,
        patientOwed: 0,
        insuranceStatus: patient.insurance.provider === 'Self-Pay' ? 'N/A' : 'Draft',
        paymentStatus: 'Pending',
        timestamp: new Date().toISOString()
      };
      invoices.push(invoice);
    }

    invoice.items.push({
      desc,
      code: itemCode,
      charge: charge
    });

    invoice.total = invoice.items.reduce((sum, item) => sum + item.charge, 0);
    
    // Re-calculate co-pay details
    if (patient.insurance.provider !== 'Self-Pay') {
      const coinsPercentage = patient.insurance.coinsurance || 10;
      const copayFixed = patient.insurance.copay || 0;
      
      invoice.patientOwed = Math.min(invoice.total, (invoice.total * (coinsPercentage / 100)) + copayFixed);
      invoice.insuranceCovered = invoice.total - invoice.patientOwed;
    } else {
      invoice.patientOwed = invoice.total;
      invoice.insuranceCovered = 0;
    }

    this.save('invoices', invoices);
    this.logTransaction('Billing', `Updated Invoice ${invoice.id} for ${patient.name}. New total: ${invoice.total} AED`, 'SUCCESS');
  }

  submitInsuranceClaim(invoiceId, complianceCountry) {
    const invoices = this.get('invoices');
    const idx = invoices.findIndex(i => i.id === invoiceId);
    if (idx !== -1) {
      invoices[idx].insuranceStatus = 'Processing';
      this.save('invoices', invoices);
      
      this.logTransaction('Insurance', `Submitted e-claim for invoice ${invoiceId} under ${complianceCountry.toUpperCase()} regulation guidelines`, 'SUCCESS');
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const innerInvoices = this.get('invoices');
          const innerIdx = innerInvoices.findIndex(i => i.id === invoiceId);
          if (innerIdx !== -1) {
            innerInvoices[innerIdx].insuranceStatus = 'Approved';
            this.save('invoices', innerInvoices);
            this.logTransaction('Insurance', `AI Claims Approval: e-claim approved for Invoice ${invoiceId} by ${complianceCountry === 'uae' ? 'DHA / Daman' : 'CHI / Tawuniya'} integration server`, 'SUCCESS');
            
            const patient = this.get('patients').find(p => p.id === innerInvoices[innerIdx].patientId);
            if (patient) {
              this.addPatientTimeline(patient.id, {
                type: 'Insurance Claim',
                details: `Claim approved for ${innerInvoices[innerIdx].id}. Insurer covers: ${innerInvoices[innerIdx].insuranceCovered} AED. Patient pays: ${innerInvoices[innerIdx].patientOwed} AED.`
              });
            }
            resolve(innerInvoices[innerIdx]);
          } else {
            resolve(null);
          }
        }, 3000);
      });
    }
    return Promise.resolve(null);
  }

  processPayment(invoiceId) {
    const invoices = this.get('invoices');
    const idx = invoices.findIndex(i => i.id === invoiceId);
    if (idx !== -1) {
      invoices[idx].paymentStatus = 'Paid';
      this.save('invoices', invoices);
      this.logTransaction('Billing', `Transaction Securely Settled: Payment of ${invoices[idx].patientOwed} AED received for Invoice ${invoiceId}`, 'SUCCESS');
      
      this.addPatientTimeline(invoices[idx].patientId, {
        type: 'Payment Success',
        details: `Settled outstanding invoice ${invoiceId}. Amount: ${invoices[idx].patientOwed} AED.`
      });
      return invoices[idx];
    }
  }

  // Masters additions
  addDoctor(docData) {
    const docs = this.get('doctors');
    const newId = `doc-${docs.length + 1}`;
    const newDoc = { id: newId, ...docData };
    docs.push(newDoc);
    this.save('doctors', docs);
    this.logTransaction('Masters', `Added Doctor: ${newDoc.name} in department ${newDoc.departmentId}`, 'SUCCESS');
    return newDoc;
  }

  addService(srvData) {
    const srvs = this.get('services');
    const newId = `srv-${srvs.length + 1}`;
    const newSrv = { id: newId, ...srvData };
    srvs.push(newSrv);
    this.save('services', srvs);
    this.logTransaction('Masters', `Added Service: ${newSrv.name} with fee ${newSrv.fee} AED`, 'SUCCESS');
    return newSrv;
  }

  addUser(userData) {
    const users = this.get('users');
    const newId = `usr-${userData.username}`;
    const newUser = { id: newId, ...userData };
    users.push(newUser);
    this.save('users', users);
    this.logTransaction('Masters', `Created User: ${newUser.name} as role ${newUser.role}`, 'SUCCESS');
    return newUser;
  }

  // Log central transactions
  logTransaction(module, action, status) {
    const ledger = this.get('ledger');
    const newId = `LOG-${1000 + ledger.length + 1}`;
    const logEntry = {
      id: newId,
      timestamp: new Date().toISOString(),
      module,
      action,
      status // SUCCESS, WARNING, CRITICAL
    };
    ledger.push(logEntry);
    this.save('ledger', ledger);
    
    // Dispatch a global custom event for the UI live ticker
    const event = new CustomEvent('hms-ledger-update', { detail: logEntry });
    window.dispatchEvent(event);
  }
}


function initMastersScreen(db, container) {
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
function initRegistrationScreen(db, container) {
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
function initAppointmentsScreen(db, container) {
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
function initTriageScreen(db, container) {
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
function initNurseAssessmentScreen(db, container) {
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
function initLabRadiologyScreen(db, container) {
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
function initPharmacyScreen(db, container) {
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
function initBillingScreen(db, container) {
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
// HMS'ai Hospital Main Application Controller & Router


// Screen Module Imports









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
function loadView(viewName, isLocked = false) {
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
