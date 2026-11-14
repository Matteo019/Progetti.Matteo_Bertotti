// ============================================
// Auth — Login / Signup
// ============================================
import { api, getMe } from './api.js';

// ---- Determine current page ----
const page = window.location.pathname;
const isLogin = page === '/' || page === '/index.html';
const isSignup = page === '/signup.html';

// ---- DOM refs ----
const messageEl = document.getElementById('auth-message');

function showMessage(text, type = 'error') {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `auth-message auth-message--${type} visible`;
}

function hideMessage() {
    if (!messageEl) return;
    messageEl.className = 'auth-message';
}

function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Caricamento...' : btn.dataset.originalText;
}

// ---- Login ----
if (isLogin) {
    const form = document.getElementById('login-form');
    const btn = document.getElementById('login-btn');
    if (btn) btn.dataset.originalText = btn.textContent;

    // Already logged in? Go straight to the inventory
    getMe().then(profile => {
        if (profile) window.location.href = '/data-entry.html';
    }).catch(() => { /* server unreachable: stay on the login page */ });

    // Demo account hint (only if enabled on the server)
    api.get('/auth/demo').then(demo => {
        document.getElementById('demo-credentials').textContent = `${demo.username} / ${demo.password}`;
        document.getElementById('demo-hint').classList.add('visible');
        document.getElementById('demo-fill').addEventListener('click', () => {
            document.getElementById('email').value = demo.username;
            document.getElementById('password').value = demo.password;
        });
    }).catch(() => { /* demo disabled */ });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();
        setLoading(btn, true);

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            await api.post('/auth/login', { email, password });
            window.location.href = '/data-entry.html';
        } catch (err) {
            // 403 = account still waiting for approval
            showMessage(err.message, err.status === 403 ? 'warning' : 'error');
            setLoading(btn, false);
        }
    });
}

// ---- Signup ----
if (isSignup) {
    const form = document.getElementById('signup-form');
    const btn = document.getElementById('signup-btn');
    if (btn) btn.dataset.originalText = btn.textContent;

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();
        setLoading(btn, true);

        const displayName = document.getElementById('display-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            await api.post('/auth/register', { email, password, display_name: displayName });
            showMessage(
                'Registrazione completata! Il tuo account è in attesa di approvazione dall\'amministratore. Riceverai accesso a breve.',
                'success'
            );
            form.reset();
        } catch (err) {
            showMessage(err.message);
        } finally {
            setLoading(btn, false);
        }
    });
}
