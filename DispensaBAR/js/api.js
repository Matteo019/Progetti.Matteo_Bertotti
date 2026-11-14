// ============================================
// API client — talks to the .NET backend on /api
// ============================================

// Every request sends the session cookie and the X-Requested-With header (the server rejects
// changes without it: CSRF protection). Errors come back as { error: "message" }.
async function request(method, url, body) {
    const options = {
        method,
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'dispensa' },
    };
    if (body !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const res = await fetch('/api' + url, options);
    const data = res.status === 204 ? null : await res.json().catch(() => null);

    if (!res.ok) {
        const err = new Error(data?.error || `Errore ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return data;
}

export const api = {
    get: (url) => request('GET', url),
    post: (url, body = {}) => request('POST', url, body),
    put: (url, body = {}) => request('PUT', url, body),
    del: (url) => request('DELETE', url),
};

// ---- Helper: logged-in user's profile, or null ----
export async function getMe() {
    try {
        return await api.get('/auth/me');
    } catch (err) {
        if (err.status === 401 || err.status === 403) return null;
        throw err;
    }
}

// ---- Helper: show toast ----
export function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ---- Helper: Italian float parser (1,5 → 1.5) ----
export function parseItalianFloat(str) {
    if (!str) return 0;
    const cleaned = String(str).trim().replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
}

// ---- Helper: Format float Italian style (1.5 → 1,5) ----
export function formatItalianFloat(num) {
    if (num == null || isNaN(num)) return '0,0';
    return num.toFixed(1).replace('.', ',');
}

// ---- Helper: format date Italian style ----
export function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatDateTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---- Helper: Setup mobile nav toggle ----
export function setupNavToggle() {
    const toggle = document.querySelector('.navbar__toggle');
    const nav = document.querySelector('.navbar__nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        // Close on link click
        nav.querySelectorAll('.navbar__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.textContent = '☰';
            });
        });
    }
}
