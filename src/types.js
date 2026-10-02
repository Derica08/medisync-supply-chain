/**
 * Shared backend-facing record shapes for Medisync demo services.
 * Kept as JSDoc so the no-build preview can run directly in the browser.
 * @typedef {{id:string,name:string,generic:string,category:string,unit:string,daily:number,threshold:number,rx:boolean}} Medicine
 * @typedef {{id:string,medicineId:string,manufacturer:string,mfg:string,expiry:string,quantity:number,locationId:string,supplierId:string,status:string}} Batch
 * @typedef {{id:string,batchId:string,medicineId:string,quantity:number,locationId:string,supplierId:string,unusual:string|null}} InventoryRecord
 * @typedef {{id:string,name:string,short:string,distance:number,units:number,delivery:number,reliability:number,status:string,medicines:string[],location:string,delayed:number}} Supplier
 * @typedef {{id:string,medicineId:string,batchId:string,supplierId:string,quantity:number,origin:string,destination:string,eta:string,delay:number,status:string,carrier:string}} Shipment
 * @typedef {{id:string,batchId:string,time:string,location:string,organization:string,quantity:number,status:string,ref:string}} TraceabilityEvent
 * @typedef {{key:string,label:string,raw:number,contribution:number,detail:string}} RiskFactor
 * @typedef {{medicineId:string,medicine:Medicine,score:number,level:string,total:number,pct:number,avg:number,stockout:number,daysToExpiry:number,expiryQty:number,delay:number,reliability:number,scores:Object,contributions:Object,factors:RiskFactor[],action:string,batches:Batch[]}} RiskAssessment
 * @typedef {{id:string,title:string,severity:string,medicineId:string,batchId:string|null,reason:string,action:string,time:string,status:string}} Alert
 * @typedef {{id:string,name:string,type:string,city:string}} HealthcareFacility
 * @typedef {{id:string,name:string,type:string,city:string}} Warehouse
 * @typedef {{supplierId:string,classification:string,eligible:boolean,passes:string[],reasons:string[]}} SupplierRecommendation
 * @typedef {{patientId:string,medicineId:string,authorizedQuantity:number,expectedDailyUse:number}} PatientMedicationSchedule
 * @typedef {{id:string,medicineId:string,quantity:number,day:string,delivery:string,reminder:boolean,caregiverConsent:boolean,status:string}} RefillPlan
 * @typedef {{id:string,planId:string,quantity:number,source:string,eta:string,approval:string,status:string}} RefillDispatch
 * @typedef {{inApp:boolean,smsConnected:boolean,whatsappConnected:boolean,caregiverOptIn:boolean}} NotificationPreference
 */
export {};
