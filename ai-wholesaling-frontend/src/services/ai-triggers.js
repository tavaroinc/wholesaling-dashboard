import api from './api';

export async function triggerAIWorkflow(type, data = {}) {
  switch (type) {
    case 'full_automation':
      return await api.post('/ai/workflow/full', data);
    case 'property_research':
      return await api.post('/ai/research/properties', data);
    case 'contract_generation':
      return await api.post('/ai/contracts/generate', data);
    case 'owner_outreach':
      return await api.post('/ai/outreach/send', data);
    case 'buyer_matching':
      return await api.post('/ai/matching/find-buyers', data);
    default:
      throw new Error(`Unknown workflow type: ${type}`);
  }
}