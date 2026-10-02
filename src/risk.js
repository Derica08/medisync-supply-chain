import {medicines,batches,inventory,shipments,suppliers,locations,factorsConfig} from './data.js';
export const today = new Date('2026-10-01T00:00:00');
const days=(d)=>Math.ceil((new Date(`${d}T00:00:00`)-today)/86400000);
const clamp=n=>Math.max(0,Math.min(100,n));
export function assessments(config=factorsConfig){
 return medicines.map(m=>{
  const bs=batches.filter(b=>b.medicineId===m.id), total=bs.reduce((a,b)=>a+b.quantity,0), avg=m.daily;
  // Only count an incoming delivery when its ETA precedes the projected stockout.
  const inbound=shipments.filter(s=>s.medicineId===m.id&&['In transit','Delayed','At risk'].includes(s.status));
  const inboundBefore=inbound.filter(s=>days(s.eta)<=Math.max(0,total/avg));
  const usable=total+inboundBefore.reduce((a,s)=>a+s.quantity,0); const stockout=Math.floor(usable/avg);
  const pct=Math.round(Math.min(100,total/Math.max(1,avg*30)*100));
  const expiryBatches=bs.map(b=>({b,d:days(b.expiry)})).filter(x=>x.d>=0&&x.d<=30);
  const expiryQty=expiryBatches.reduce((a,x)=>a+Math.max(0,x.b.quantity-avg*x.d),0);
  const expScore=total?clamp(expiryQty/total*100):0;
  const delay=inbound.length?Math.max(...inbound.map(s=>s.delay)):0;
  const supplierList=suppliers.filter(s=>m.name.toLowerCase().includes('amoxicillin')?s.medicines.includes('Amoxicillin'):s.medicines.some(x=>x.toLowerCase()===m.generic.toLowerCase()||m.name.toLowerCase().includes(x.toLowerCase())));
  const reliability=supplierList.length?Math.min(...supplierList.map(s=>s.reliability)):85;
  const movement=inventory.filter(i=>i.medicineId===m.id&&i.unusual).length;
  const scores={stockout:clamp((10-stockout)*10),shipment:clamp(delay*25),supplier:clamp((100-reliability)*2.5),expiry:expScore,movement:movement?Math.min(100,50+movement*25):0};
  const weights=config.weights;
  const contributions=Object.fromEntries(Object.keys(scores).map(k=>[k,Math.round(scores[k]*weights[k]/100)]));
  const score=Math.round(Object.values(contributions).reduce((a,n)=>a+n,0));
  const level=score>=config.thresholds.critical?'Critical':score>=config.thresholds.high?'High':score>=config.thresholds.moderate?'Moderate':'Low';
  const factors=[{key:'stockout',label:'Stockout risk',raw:scores.stockout,contribution:contributions.stockout,detail:`${stockout} days of stock at current use`},{key:'shipment',label:'Shipment delay',raw:scores.shipment,contribution:contributions.shipment,detail:delay?`Incoming shipment delayed ${delay} days`:'No delayed inbound shipment'},{key:'supplier',label:'Supplier reliability',raw:scores.supplier,contribution:contributions.supplier,detail:`Lowest matching supplier reliability ${reliability}%`},{key:'expiry',label:'Expiry exposure',raw:scores.expiry,contribution:contributions.expiry,detail:expiryQty?`${expiryQty} units may expire before use`:'No material near-term expiry exposure'},{key:'movement',label:'Unusual movement',raw:scores.movement,contribution:contributions.movement,detail:movement?`${movement} inventory record(s) need review`:'No movement anomaly recorded'}];
  let action=level==='Critical'||level==='High'?(delay?'Prioritize the delayed shipment or compare backup suppliers':'Review replenishment options and confirm available stock'):expiryQty?'Review near-expiry batches and rotate stock':'Continue routine monitoring';
  return {medicineId:m.id,medicine:m,score,level,total,pct,avg,stockout,daysToExpiry:Math.min(...bs.map(b=>days(b.expiry))),expiryQty,delay,reliability,stockoutDate:new Date(today.getTime()+stockout*86400000).toISOString().slice(0,10),inbound:inboundBefore,scores,contributions,factors,action,batches:bs};
 });
}
export function alertsFor(config=factorsConfig){
 const risks=assessments(config), alerts=[];
 risks.forEach(r=>{
  if(r.pct<=r.medicine.threshold) alerts.push({id:`low-${r.medicineId}`,title:'Low-Stock Alert',severity:r.pct<=15?'High':'Moderate',medicineId:r.medicineId,batchId:r.batches[0]?.id,reason:`${r.pct}% stock cover remains; about ${r.stockout} days at current use.`,action:'Review stock and replenishment options',time:'Today · Demo',status:'Open'});
  if(r.level==='High'||r.level==='Critical') alerts.push({id:`risk-${r.medicineId}`,title:'Supply Chain Bottleneck Alert (Risk Radar)',severity:r.level,medicineId:r.medicineId,batchId:r.batches[0]?.id,reason:`Risk score ${r.score}: ${r.factors.filter(f=>f.contribution>0).map(f=>f.label.toLowerCase()).join(', ')}.`,action:r.action,time:'Today · Demo',status:'Open'});
  const soon=r.batches.filter(b=>days(b.expiry)>=0&&days(b.expiry)<=21);
  if(soon.length) alerts.push({id:`expiry-${soon[0].id}`,title:'Near-Expiry Alert',severity:days(soon[0].expiry)<=7?'High':'Moderate',medicineId:r.medicineId,batchId:soon[0].id,reason:`Batch ${soon[0].id} expires in ${days(soon[0].expiry)} days.`,action:'Review batch quantity and rotate stock',time:'Today · Demo',status:'Open'});
 });
 suppliers.filter(s=>s.reliability<75).forEach(s=>{
  const affected=s.medicines.map(name=>medicines.find(m=>m.name.toLowerCase().includes(name.toLowerCase())||m.generic.toLowerCase().includes(name.toLowerCase()))).filter(Boolean);
  if(affected.length) alerts.push({id:`supplier-${s.id}`,title:'Supplier reliability issue',severity:s.reliability<65?'High':'Moderate',medicineId:affected[0].id,batchId:null,reason:`${s.name} has ${s.reliability}% demo reliability; affects ${affected.map(m=>m.name).join(', ')}.`,action:'Review supplier performance and compare an active backup',time:'Today · Demo',status:'Open'});
 });
 shipments.filter(s=>s.delay>0).forEach(s=>alerts.push({id:`ship-${s.id}`,title:'Shipment delay',severity:s.delay>=2?'High':'Moderate',medicineId:s.medicineId,batchId:s.batchId,reason:`${s.id} is delayed ${s.delay} days; new ETA ${s.eta}.`,action:'Check delivery plan and local stock',time:'Today · Demo',status:'Open'}));
 inventory.filter(i=>i.unusual).forEach(i=>alerts.push({id:`trace-${i.id}`,title:'Traceability anomaly — review required',severity:'High',medicineId:i.medicineId,batchId:i.batchId,reason:`Recorded inventory event: ${i.unusual}.`,action:'Investigate the recorded batch movement',time:'Today · Demo',status:'Open'}));
 return alerts;
}
export function supplierMatches(medName,req){
 return suppliers.filter(s=>s.medicines.some(m=>medName.toLowerCase().includes(m.toLowerCase())||m.toLowerCase().includes(medName.toLowerCase().split(' ')[0]))).map(s=>{
  const reasons=[],passes=[];
  const check=(ok,yes,no)=>{(ok?passes:reasons).push(ok?yes:no);};
  check(s.units>=req.quantity,`Quantity available: ${s.units.toLocaleString()} units`,`Only ${s.units.toLocaleString()} units available; ${req.quantity.toLocaleString()} needed`);
  check(s.delivery<=req.days,`Delivery in ${s.delivery} day${s.delivery===1?'':'s'}`,`Delivery takes ${s.delivery} days; limit is ${req.days}`);
  check(s.distance<=req.distance,`${s.distance} km away`,`Distance is ${s.distance} km; limit is ${req.distance} km`);
  check(s.reliability>=req.reliability,`Reliability ${s.reliability}%`,`Reliability ${s.reliability}%; minimum is ${req.reliability}%`);
  check(s.status==='Active','Supplier is active',`Supplier status is ${s.status.toLowerCase()}`);
  const eligible=reasons.length===0,partial=!eligible&&passes.length>=2;
  return {...s,passes,reasons,eligible,classification:eligible?'Meets requirements':partial?'Partially meets requirements':'Does not meet requirements'};
 }).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.passes.length-a.passes.length||a.delivery-b.delivery);
}
