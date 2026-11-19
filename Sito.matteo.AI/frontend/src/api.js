// Thin wrapper around fetch for the FastAPI backend (same origin, under /api)

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function request(path, { method = 'GET', body, form } = {}) {
    const options = { method, credentials: 'same-origin', headers: {} };
    if (form) {
        options.body = form;
    } else if (body !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`/api${path}`, options);
    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        // FastAPI errors: {detail: "..."} or {detail: [{msg: ...}]} for validation
        const detail = data?.detail;
        const message = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : detail;
        throw new ApiError(res.status, message || `Errore ${res.status}`);
    }
    return data;
}

export const imageUrl = (name) => `/api/uploads/${name}`;

export const api = {
    publishedPosts: (offset = 0, limit = 6) => request(`/posts?offset=${offset}&limit=${limit}`),

    me: () => request('/auth/me'),
    login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
    logout: () => request('/auth/logout', { method: 'POST' }),

    allPosts: () => request('/admin/posts?limit=100'),
    createPost: (post) => request('/admin/posts', { method: 'POST', body: post }),
    updatePost: (id, post) => request(`/admin/posts/${id}`, { method: 'PUT', body: post }),
    deletePost: (id) => request(`/admin/posts/${id}`, { method: 'DELETE' }),
    uploadImage: (file) => {
        const form = new FormData();
        form.append('file', file);
        return request('/admin/uploads', { method: 'POST', form });
    },
};
