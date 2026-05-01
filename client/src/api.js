// Tiny REST client. All paths go through Vite's /api proxy to the Express server.

async function request(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: (resource, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/${resource}${q ? '?' + q : ''}`);
  },
  get: (resource, id) => request(`/api/${resource}/${id}`),
  create: (resource, body) => request(`/api/${resource}`, { method: 'POST', body }),
  update: (resource, id, body) => request(`/api/${resource}/${id}`, { method: 'PATCH', body }),
  remove: (resource, id) => request(`/api/${resource}/${id}`, { method: 'DELETE' }),
  audit: (entry) => request('/api/audit', { method: 'POST', body: entry }),
  health: () => request('/api/health'),
};
