// Browser adapter for the Medisync demo API. The UI uses these functions rather than
// talking to storage directly, so another API implementation can replace server/index.js.
const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload;
};
const json = value => JSON.stringify(value);
export const service = {
  bootstrap: () => request('/bootstrap'),
  getDashboard: () => request('/dashboard'),
  getMedicines: () => request('/medicines'), getMedicine: id => request(`/medicines/${encodeURIComponent(id)}`),
  getInventory: () => request('/inventory'), getBatches: () => request('/batches'), getBatch: id => request(`/batches/${encodeURIComponent(id)}`),
  getTrace: id => request(`/batches/${encodeURIComponent(id)}/trace`),
  getShipments: () => request('/shipments'), getShipment: id => request(`/shipments/${encodeURIComponent(id)}`),
  getRisks: () => request('/risks'), getRisk: id => request(`/risks/${encodeURIComponent(id)}`),
  getAlerts: () => request('/alerts'), updateAlert: (id,status) => request(`/alerts/${encodeURIComponent(id)}`,{method:'PATCH',body:json({status})}),
  updateAlertOwner: (id,owner) => request(`/alert-owners/${encodeURIComponent(id)}`,{method:'PATCH',body:json({owner})}),
  getSuppliers: () => request('/suppliers'), getSupplierFollowUps: () => request('/suppliers/follow-ups'), setSupplierFollowUp: (supplierId,medicineId,flagged) => request('/suppliers/follow-ups',{method:'PATCH',body:json({supplierId,medicineId,flagged})}), getSupplier: id => request(`/suppliers/${encodeURIComponent(id)}`),
  findAlternatives: (medicine,requirements) => request('/suppliers/find-alternatives',{method:'POST',body:json({medicine,requirements})}),
  getLocations: () => request('/locations'), getAnalytics: () => request('/analytics'),
  getSettings: () => request('/settings'), updateSettings: changes => request('/settings',{method:'PATCH',body:json(changes)}),
  getRefillPlans: () => request('/refill-plans'), createRefillPlan: plan => request('/refill-plans',{method:'POST',body:json(plan)}),
  prepareDispatch: id => request(`/refill-plans/${encodeURIComponent(id)}/prepare-dispatch`,{method:'POST',body:'{}'}),
  getNotificationPreferences: () => request('/notification-preferences'), updateNotificationPreferences: changes => request('/notification-preferences',{method:'PATCH',body:json(changes)}),
  resetDemo: () => request('/demo/reset',{method:'POST',body:'{}'})
};
