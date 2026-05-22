// HMS'ai Hospital Mock Database & State Management

export const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', icon: 'fa-heartbeat' },
  { id: 'pulmonology', name: 'Pulmonology', icon: 'fa-lungs' },
  { id: 'orthopedics', name: 'Orthopedics', icon: 'fa-bone' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'fa-baby' },
  { id: 'general_medicine', name: 'General Medicine', icon: 'fa-stethoscope' },
  { id: 'emergency', name: 'Emergency Room (ER)', icon: 'fa-ambulance' },
  { id: 'laboratory', name: 'Laboratory', icon: 'fa-vials' },
  { id: 'radiology', name: 'Radiology', icon: 'fa-x-ray' }
];

export const DOCTORS = [
  { id: 'doc-1', name: 'Dr. Sarah Al-Mansoori', specialty: 'Senior Cardiologist', departmentId: 'cardiology', schedule: 'Mon-Wed-Fri, 09:00 - 17:00', fee: 350 },
  { id: 'doc-2', name: 'Dr. Tariq Al-Harbi', specialty: 'Pulmonologist Specialist', departmentId: 'pulmonology', schedule: 'Tue-Thu, 10:00 - 18:00', fee: 300 },
  { id: 'doc-3', name: 'Dr. Emily Watson', specialty: 'Pediatric Specialist', departmentId: 'pediatrics', schedule: 'Mon-Tue-Wed, 08:30 - 15:30', fee: 280 },
  { id: 'doc-4', name: 'Dr. Khalid bin Waleed', specialty: 'Orthopedic Surgeon', departmentId: 'orthopedics', schedule: 'Mon-Thu, 09:00 - 16:00', fee: 400 },
  { id: 'doc-5', name: 'Dr. Amina Yusuf', specialty: 'General Practitioner', departmentId: 'general_medicine', schedule: 'Daily, 08:00 - 14:00', fee: 200 },
  { id: 'doc-6', name: 'Dr. Faisal Al-Otaibi', specialty: 'ER Chief Physician', departmentId: 'emergency', schedule: 'Roster Rotational', fee: 300 }
];

export const SERVICES = [
  { id: 'srv-1', name: 'Complete Blood Count (CBC)', cpt: '85025', fee: 120, departmentId: 'laboratory' },
  { id: 'srv-2', name: 'Basic Metabolic Panel (BMP)', cpt: '80048', fee: 150, departmentId: 'laboratory' },
  { id: 'srv-3', name: 'Chest X-Ray (2 Views)', cpt: '71046', fee: 220, departmentId: 'radiology' },
  { id: 'srv-4', name: 'MRI Brain (Without Contrast)', cpt: '70551', fee: 1200, departmentId: 'radiology' },
  { id: 'srv-5', name: 'Electrocardiogram (ECG/EKG)', cpt: '93000', fee: 180, departmentId: 'cardiology' },
  { id: 'srv-6', name: 'Spirometry Lung Function', cpt: '94010', fee: 250, departmentId: 'pulmonology' },
  { id: 'srv-7', name: 'Joint X-Ray (Knee/Shoulder)', cpt: '73560', fee: 210, departmentId: 'radiology' },
  { id: 'srv-8', name: 'Pediatric Vaccine Dose', cpt: '90471', fee: 90, departmentId: 'pediatrics' }
];

export const ROLES_PERMISSIONS = {
  admin: ['masters', 'registration', 'appointments', 'triage', 'nurse_assessment', 'lab_radiology', 'pharmacy', 'insurance_billing', 'ledger'],
  receptionist: ['registration', 'appointments', 'ledger'],
  nurse: ['triage', 'nurse_assessment', 'ledger'],
  doctor: ['appointments', 'nurse_assessment', 'lab_radiology', 'pharmacy', 'ledger'],
  pharmacist: ['pharmacy', 'ledger'],
  technician: ['lab_radiology', 'ledger'],
  billing_clerk: ['insurance_billing', 'ledger']
};

export const USERS = [
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

export class HMSDatabase {
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
