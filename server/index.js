import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as data from '../src/data.js';
import { assessments, alertsFor, supplierMatches } from '../src/risk.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storeDir = process.env.MEDISYNC_DATA_DIR ? path.resolve(process.env.MEDISYNC_DATA_DIR) : path.join(root, 'server', 'data');
const storeFile = path.join(storeDir, 'demo-state.json');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const defaults = () => ({
  weights: { ...data.factorsConfig.weights }, thresholds: { ...data.factorsConfig.thresholds },
  alertStatuses: {}, alertOwners: {}, supplierFollowUps: [], refillPlans: [{ ...data.patientPlan }],
  preferences: { inApp: true, smsConnected: false, whatsappConnected: false, caregiverOptIn: false },
  organization: { lowStockPercent: 25, expiryWarningDays: 30 }
});
let store;
async function persist() { await mkdir(storeDir, { recursive: true }); await writeFile(storeFile, JSON.stringify(store, null, 2)); }
try { store = { ...defaults(), ...JSON.parse(await readFile(storeFile, 'utf8')) }; }
catch { store = defaults(); await persist(); }
const config = () => ({ weights: store.weights, thresholds: store.thresholds });
const risks = () => assessments(config());
const alerts = () => alertsFor(config()).map(a => ({ ...a, status: store.alertStatuses[a.id] || a.status, owner: store.alertOwners[a.id] || null }));
const send = (res, status, body, type = 'application/json; charset=utf-8') => { res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }); res.end(type.startsWith('application/json') ? JSON.stringify(body) : body); };
async function body(req) { let raw=''; for await (const chunk of req) raw+=chunk; if(raw.length>1_000_000) throw Object.assign(new Error('Request too large'),{status:413}); return raw ? JSON.parse(raw) : {}; }
function notFound(res) { send(res,404,{error:'Not found'}); }
function validation(res,message) { send(res,400,{error:message}); }
const api = async (req,res,url) => {
  const p=url.pathname, id=p.split('/').filter(Boolean).at(-1);
  if(req.method==='GET'&&p==='/api/health') return send(res,200,{ok:true,app:'Medisync',mode:'demo',storage:'local JSON'});
  if(req.method==='GET'&&p==='/api/bootstrap') return send(res,200,{data:{medicines:data.medicines,batches:data.batches,inventory:data.inventory,suppliers:data.suppliers,shipments:data.shipments,locations:data.locations,traceEvents:data.traceEvents,medicineUses:data.medicineUses,demoBarcodes:data.demoBarcodes},state:store,risks:risks(),alerts:alerts()});
  if(req.method==='GET'&&p==='/api/dashboard') return send(res,200,{medicines:data.medicines,risks:risks(),shipments:data.shipments,alerts:alerts(),actions:alerts().filter(a=>a.status==='Open').slice(0,5)});
  if(req.method==='GET'&&p==='/api/medicines') return send(res,200,data.medicines);
  if(req.method==='GET'&&p.startsWith('/api/medicines/')) return send(res,200,data.medicines.find(x=>x.id===id)||null);
  if(req.method==='GET'&&p==='/api/inventory') return send(res,200,data.inventory);
  if(req.method==='GET'&&p==='/api/batches') return send(res,200,data.batches);
  if(req.method==='GET'&&p.startsWith('/api/batches/')&&p.endsWith('/trace')) return send(res,200,data.traceEvents.filter(e=>e.batchId===p.split('/')[3]));
  if(req.method==='GET'&&p.startsWith('/api/batches/')) return send(res,200,data.batches.find(x=>x.id===id)||null);
  if(req.method==='GET'&&p==='/api/shipments') return send(res,200,data.shipments);
  if(req.method==='GET'&&p.startsWith('/api/shipments/')) return send(res,200,data.shipments.find(x=>x.id===id)||null);
  if(req.method==='GET'&&p==='/api/risks') return send(res,200,risks());
  if(req.method==='GET'&&p.startsWith('/api/risks/')) return send(res,200,risks().find(x=>x.medicineId===id)||null);
  if(req.method==='GET'&&p==='/api/alerts') return send(res,200,alerts());
  if(req.method==='PATCH'&&p.startsWith('/api/alerts/')) { const b=await body(req); const a=alerts().find(x=>x.id===id); if(!a)return notFound(res); if(!['Open','Acknowledged','Resolved'].includes(b.status))return validation(res,'Status must be Open, Acknowledged, or Resolved.'); store.alertStatuses[id]=b.status; await persist(); return send(res,200,{...a,status:b.status}); }
  if(req.method==='PATCH'&&p.startsWith('/api/alert-owners/')) { const b=await body(req); if(!alerts().some(x=>x.id===id))return notFound(res); if(typeof b.owner!=='string'||b.owner.length>80)return validation(res,'Owner must be a short role name.'); store.alertOwners[id]=b.owner; await persist(); return send(res,200,{id,owner:b.owner}); }
  if(req.method==='GET'&&p==='/api/suppliers') return send(res,200,data.suppliers);
  if(req.method==='GET'&&p==='/api/suppliers/follow-ups') return send(res,200,store.supplierFollowUps);
  if(req.method==='PATCH'&&p==='/api/suppliers/follow-ups') { const b=await body(req);if(!data.suppliers.some(s=>s.id===b.supplierId))return validation(res,'Choose a registered demo supplier.');const key=`${b.supplierId}:${b.medicineId||'general'}`;store.supplierFollowUps=store.supplierFollowUps.filter(x=>x.key!==key);if(b.flagged)store.supplierFollowUps.push({key,supplierId:b.supplierId,medicineId:b.medicineId||null,flaggedAt:new Date().toISOString()});await persist();return send(res,200,store.supplierFollowUps); }
  if(req.method==='GET'&&p.startsWith('/api/suppliers/')) return send(res,200,data.suppliers.find(x=>x.id===id)||null);
  if(req.method==='POST'&&p==='/api/suppliers/find-alternatives') { const b=await body(req); if(!b.medicine||!b.requirements)return validation(res,'Medicine and supplier requirements are required.'); return send(res,200,supplierMatches(b.medicine,b.requirements)); }
  if(req.method==='GET'&&p==='/api/locations') return send(res,200,data.locations);
  if(req.method==='GET'&&p==='/api/analytics') return send(res,200,{risks:risks(),inventory:data.inventory,shipments:data.shipments,suppliers:data.suppliers,batches:data.batches});
  if(req.method==='GET'&&p==='/api/settings') return send(res,200,{weights:store.weights,thresholds:store.thresholds,organization:store.organization});
  if(req.method==='PATCH'&&p==='/api/settings') { const b=await body(req),w=b.weights,t=b.thresholds; if(w){const vals=Object.values(w);if(Object.keys(store.weights).some(k=>!Number.isFinite(+w[k])||+w[k]<0)||vals.reduce((a,n)=>a+Number(n),0)!==100)return validation(res,'Risk weights must be valid and total 100%.');store.weights=Object.fromEntries(Object.keys(store.weights).map(k=>[k,+w[k]]));} if(t){const next={...store.thresholds,...t};if(!(next.moderate>=1&&next.moderate<next.high&&next.high<next.critical&&next.critical<=100))return validation(res,'Risk thresholds must ascend from 1 to 100.');store.thresholds=next;}if(b.organization)store.organization={...store.organization,...b.organization}; await persist();return send(res,200,{weights:store.weights,thresholds:store.thresholds,risks:risks(),alerts:alerts()}); }
  if(req.method==='GET'&&p==='/api/refill-plans') return send(res,200,store.refillPlans);
  if(req.method==='POST'&&p==='/api/refill-plans') { const b=await body(req); if(!data.medicines.some(m=>m.id===b.medicineId))return validation(res,'Choose a medicine from the demo list.');if(!Number.isInteger(+b.quantity)||+b.quantity<1||+b.quantity>30)return validation(res,'Demo refill quantity must be between 1 and the authorized maximum of 30.');const plan={...b,id:`plan-${Date.now()}`,quantity:+b.quantity,status:b.approvalRequired?'Awaiting approval':'Scheduled',createdAt:new Date().toISOString(),demo:true};store.refillPlans=[plan,...store.refillPlans.filter(x=>x.id!==data.patientPlan.id)].slice(0,20);store.preferences.caregiverOptIn=!!plan.caregiverConsent;await persist();return send(res,201,plan); }
  if(req.method==='POST'&&p.match(/^\/api\/refill-plans\/[^/]+\/prepare-dispatch$/)) { const plan=store.refillPlans.find(x=>x.id===p.split('/')[3]);if(!plan)return notFound(res);plan.status='Awaiting approval';plan.approvalRequired=true;await persist();return send(res,200,plan); }
  if(req.method==='GET'&&p==='/api/notification-preferences') return send(res,200,store.preferences);
  if(req.method==='PATCH'&&p==='/api/notification-preferences') { const b=await body(req);store.preferences={...store.preferences,...b,smsConnected:false,whatsappConnected:false};await persist();return send(res,200,store.preferences); }
  if(req.method==='POST'&&p==='/api/demo/reset') { store=defaults();await persist();return send(res,200,{ok:true,state:store}); }
  notFound(res);
};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.png':'image/png','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname.startsWith('/api/'))return await api(req,res,url);let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';const file=path.resolve(root,`.${pathname}`);if(file!==root&&!file.startsWith(root+path.sep))return send(res,403,{error:'Forbidden'});const info=await stat(file);if(!info.isFile())return notFound(res);send(res,200,await readFile(file),mime[path.extname(file)]||'application/octet-stream');}catch(err){console.error(err);send(res,err.status||500,{error:err.status?err.message:'Medisync could not complete that request.'});}});
server.listen(port,host,()=>console.log(`Medisync demo is ready at http://${host}:${port}`));
