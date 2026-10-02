// Connected demo records. A production API can replace this module behind services.js.
export const locations = [
  {id:'loc-hosp',name:'Riverside General Hospital',type:'Hospital',city:'Pune'},
  {id:'loc-pharm',name:'Meadow Pharmacy',type:'Pharmacy',city:'Pune'},
  {id:'loc-dc',name:'West Pune Distribution Center',type:'Distribution center',city:'Pune'},
  {id:'loc-east',name:'Eastside Community Clinic',type:'Clinic',city:'Pune'},
  {id:'loc-mfg',name:'Asterion Pharma Works',type:'Manufacturer',city:'Hyderabad'}
];
export const suppliers = [
  {id:'sup-a',name:'Crescent Medical Supply',short:'Supplier A',distance:12,units:1200,delivery:1,reliability:96,status:'Active',medicines:['Amoxicillin','Paracetamol','ORS','Azithromycin'],location:'West Pune Distribution Center',delayed:0},
  {id:'sup-b',name:'Northstar Pharma Logistics',short:'Supplier B',distance:38,units:4000,delivery:3,reliability:72,status:'Active',medicines:['Amoxicillin','Insulin','Cefixime','Paracetamol'],location:'Pimpri Distribution Hub',delayed:1},
  {id:'sup-c',name:'Harborview Health Wholesale',short:'Supplier C',distance:18,units:800,delivery:2,reliability:89,status:'Active',medicines:['Amoxicillin','Insulin','Azithromycin'],location:'Meadow Pharmacy',delayed:0},
  {id:'sup-d',name:'Summit Care Distributors',short:'Summit Care',distance:22,units:2400,delivery:2,reliability:73,status:'Review',medicines:['Cefixime','ORS','Paracetamol'],location:'West Pune Distribution Center',delayed:2},
  {id:'sup-e',name:'Asterion Direct',short:'Asterion Direct',distance:41,units:5000,delivery:4,reliability:98,status:'Active',medicines:['Insulin','Amoxicillin','Cefixime'],location:'Asterion Pharma Works',delayed:0}
];
export const medicines = [
  {id:'med-para',name:'Paracetamol 500 mg',generic:'Acetaminophen',category:'Pain relief',unit:'tablets',daily:84,threshold:25,rx:false},
  {id:'med-amox',name:'Amoxicillin 250 mg',generic:'Amoxicillin',category:'Antibiotic',unit:'capsules',daily:62,threshold:25,rx:true},
  {id:'med-ins',name:'Insulin glargine',generic:'Insulin glargine',category:'Diabetes care',unit:'pens',daily:20,threshold:20,rx:true},
  {id:'med-azith',name:'Azithromycin 250 mg',generic:'Azithromycin',category:'Antibiotic',unit:'tablets',daily:34,threshold:22,rx:true},
  {id:'med-cef',name:'Cefixime 200 mg',generic:'Cefixime',category:'Antibiotic',unit:'tablets',daily:26,threshold:22,rx:true},
  {id:'med-ors',name:'ORS sachets',generic:'Oral rehydration salts',category:'Rehydration',unit:'sachets',daily:45,threshold:25,rx:false}
];
export const demoBarcodes = {
  '8901000005001':'med-para', '8901000002502':'med-amox', '8901000001003':'med-ins',
  '8901000002504':'med-azith', '8901000002005':'med-cef', '8901000000006':'med-ors'
};
export const medicineUses = {
  'med-para':'Commonly used for pain or fever relief. Follow the instructions from your healthcare professional.',
  'med-amox':'An antibiotic used for some bacterial infections when prescribed. It does not treat viral illnesses.',
  'med-ins':'Used to manage blood sugar when prescribed. Follow the patient’s care plan and storage instructions.',
  'med-azith':'An antibiotic used for some bacterial infections when prescribed. It does not treat viral illnesses.',
  'med-cef':'An antibiotic used for some bacterial infections when prescribed. It does not treat viral illnesses.',
  'med-ors':'Helps replace fluids and salts during dehydration. Follow the packet and professional instructions.'
};
export const batches = [
  {id:'AMX-24018',medicineId:'med-amox',manufacturer:'Asterion Pharma Works',mfg:'2026-07-03',expiry:'2026-10-18',quantity:270,locationId:'loc-hosp',supplierId:'sup-a',status:'Available'},
  {id:'AMX-24022',medicineId:'med-amox',manufacturer:'Asterion Pharma Works',mfg:'2026-03-04',expiry:'2027-02-15',quantity:42,locationId:'loc-dc',supplierId:'sup-b',status:'Available'},
  {id:'PAR-11802',medicineId:'med-para',manufacturer:'Nivara Therapeutics',mfg:'2026-02-01',expiry:'2027-04-01',quantity:2640,locationId:'loc-hosp',supplierId:'sup-a',status:'Available'},
  {id:'PAR-11809',medicineId:'med-para',manufacturer:'Nivara Therapeutics',mfg:'2026-03-15',expiry:'2026-10-25',quantity:180,locationId:'loc-pharm',supplierId:'sup-b',status:'Available'},
  {id:'INS-08911',medicineId:'med-ins',manufacturer:'Asterion Pharma Works',mfg:'2026-05-02',expiry:'2026-11-20',quantity:270,locationId:'loc-hosp',supplierId:'sup-e',status:'Cold storage'},
  {id:'INS-08914',medicineId:'med-ins',manufacturer:'Asterion Pharma Works',mfg:'2026-05-22',expiry:'2026-11-30',quantity:190,locationId:'loc-dc',supplierId:'sup-c',status:'Cold storage'},
  {id:'AZI-37102',medicineId:'med-azith',manufacturer:'Kaveri Health Labs',mfg:'2026-04-01',expiry:'2027-03-02',quantity:1020,locationId:'loc-pharm',supplierId:'sup-a',status:'Available'},
  {id:'AZI-37109',medicineId:'med-azith',manufacturer:'Kaveri Health Labs',mfg:'2026-03-01',expiry:'2026-10-20',quantity:180,locationId:'loc-east',supplierId:'sup-c',status:'Available'},
  {id:'CEF-55004',medicineId:'med-cef',manufacturer:'Nivara Therapeutics',mfg:'2026-04-14',expiry:'2027-04-14',quantity:850,locationId:'loc-hosp',supplierId:'sup-b',status:'Available'},
  {id:'CEF-55012',medicineId:'med-cef',manufacturer:'Nivara Therapeutics',mfg:'2026-01-12',expiry:'2026-10-22',quantity:140,locationId:'loc-east',supplierId:'sup-d',status:'Available'},
  {id:'ORS-71280',medicineId:'med-ors',manufacturer:'Sanjeevani Consumer Health',mfg:'2026-06-05',expiry:'2027-06-05',quantity:1500,locationId:'loc-pharm',supplierId:'sup-a',status:'Available'},
  {id:'ORS-71287',medicineId:'med-ors',manufacturer:'Sanjeevani Consumer Health',mfg:'2026-02-12',expiry:'2026-10-16',quantity:120,locationId:'loc-east',supplierId:'sup-d',status:'Available'}
];
export const inventory = batches.map((b,i)=>({id:`inv-${i+1}`,batchId:b.id,medicineId:b.medicineId,quantity:b.quantity,locationId:b.locationId,supplierId:b.supplierId,unusual:i===0?'unexpected transfer':i===1?'quantity mismatch':i===9?'unexpected transfer':null}));
export const shipments = [
  {id:'SHP-4021',medicineId:'med-amox',batchId:'AMX-24022',supplierId:'sup-b',quantity:1200,origin:'Pimpri Distribution Hub',destination:'Riverside General Hospital',eta:'2026-10-09',delay:2,status:'Delayed',carrier:'Northstar Pharma Logistics'},
  {id:'SHP-4028',medicineId:'med-ins',batchId:'INS-08914',supplierId:'sup-c',quantity:300,origin:'Meadow Pharmacy',destination:'Riverside General Hospital',eta:'2026-10-03',delay:0,status:'In transit',carrier:'Harborview Health Wholesale'},
  {id:'SHP-3994',medicineId:'med-para',batchId:'PAR-11802',supplierId:'sup-a',quantity:900,origin:'West Pune Distribution Center',destination:'Meadow Pharmacy',eta:'2026-10-01',delay:0,status:'Delivered',carrier:'Crescent Medical Supply'},
  {id:'SHP-4033',medicineId:'med-cef',batchId:'CEF-55004',supplierId:'sup-d',quantity:500,origin:'West Pune Distribution Center',destination:'Eastside Community Clinic',eta:'2026-10-06',delay:2,status:'At risk',carrier:'Summit Care Distributors'},
  {id:'SHP-4042',medicineId:'med-azith',batchId:'AZI-37102',supplierId:'sup-a',quantity:600,origin:'West Pune Distribution Center',destination:'Riverside General Hospital',eta:'2026-10-03',delay:0,status:'In transit',carrier:'Crescent Medical Supply'}
];
export const traceEvents = [
  {id:'tr1',batchId:'AMX-24018',time:'2026-07-03 09:20',location:'Asterion Pharma Works · Hyderabad',organization:'Asterion Pharma Works',quantity:1800,status:'Manufactured',ref:'MFG-88214'},
  {id:'tr2',batchId:'AMX-24018',time:'2026-07-04 14:35',location:'Asterion Pharma Works · Hyderabad',organization:'Asterion Pharma Works',quantity:1800,status:'Quality release',ref:'QA-88214'},
  {id:'tr3',batchId:'AMX-24018',time:'2026-07-06 07:50',location:'West Pune Distribution Center',organization:'Crescent Medical Supply',quantity:1800,status:'Received at distributor',ref:'SHP-3860'},
  {id:'tr4',batchId:'AMX-24018',time:'2026-07-08 11:10',location:'Riverside General Hospital · Pune',organization:'Riverside General Hospital',quantity:1110,status:'Received at hospital',ref:'SHP-3892'}
];
export const initialAlerts = [];
export const patientPlan = {id:'plan-1',medicineId:'med-ins',quantity:30,day:'Monday',delivery:'Home delivery',reminder:true,caregiverConsent:false,caregiverName:'Anita (caregiver)',status:'Scheduled'};
export const factorsConfig = {weights:{stockout:30,shipment:20,supplier:15,expiry:15,movement:20},thresholds:{moderate:30,high:55,critical:75}};
