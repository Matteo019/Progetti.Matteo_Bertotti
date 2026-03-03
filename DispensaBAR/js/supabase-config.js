// ============================================
// Supabase Client Configuration
// ============================================
import { createClient } from '@supabase/supabase-js';

// 🔑 Configuration from environment variables (Vite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Helper: get current user ----
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ---- Helper: get profile with role ----
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
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
