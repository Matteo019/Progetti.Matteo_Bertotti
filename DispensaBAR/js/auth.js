// ============================================
// Auth — Login / Signup / Recovery
// ============================================
import { supabase, showToast, getProfile } from './supabase-config.js';

// ---- Determine current page ----
const page = window.location.pathname;
const isLogin = page === '/' || page === '/index.html';
const isSignup = page === '/signup.html';
const isRecovery = page === '/recovery.html';

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

    // Check if already logged in
    supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
            try {
                const profile = await getProfile(user.id);
                if (profile.role === 'pending') {
                    showMessage('Il tuo account è in attesa di approvazione. Contatta l\'amministratore.', 'warning');
                    await supabase.auth.signOut();
                } else {
                    window.location.href = '/data-entry.html';
                }
            } catch {
                window.location.href = '/data-entry.html';
            }
        }
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();
        setLoading(btn, true);

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            // Check if user is approved
            const profile = await getProfile(data.user.id);
            if (profile.role === 'pending') {
                showMessage('Il tuo account è in attesa di approvazione dall\'amministratore.', 'warning');
                await supabase.auth.signOut();
                setLoading(btn, false);
                return;
            }

            window.location.href = '/data-entry.html';
        } catch (err) {
            showMessage(err.message === 'Invalid login credentials'
                ? 'Email o password non corretti.'
                : err.message);
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
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName }
                }
            });
            if (error) throw error;

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

// ---- Recovery ----
if (isRecovery) {
    const form = document.getElementById('recovery-form');
    const btn = document.getElementById('recovery-btn');
    if (btn) btn.dataset.originalText = btn.textContent;

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();
        setLoading(btn, true);

        const email = document.getElementById('email').value.trim();

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/',
            });
            if (error) throw error;

            showMessage(
                'Se l\'email è registrata, riceverai un link per reimpostare la password.',
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
