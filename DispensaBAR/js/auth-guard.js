// ============================================
// Auth Guard — Page Access Control
// ============================================
import { supabase, getProfile, showToast } from './supabase-config.js';
import { initTheme, setupThemeToggle } from './theme-toggle.js';

/**
 * Protects a page. Redirects to login if not authenticated or not approved.
 * @param {Object} options
 * @param {boolean} options.requireAdmin - If true, only admins can access
 * @returns {Promise<{user: object, profile: object}>}
 */
export async function requireAuth({ requireAdmin = false } = {}) {
  initTheme();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/';
      throw new Error('Non autenticato');
    }

    const profile = await getProfile(user.id);

    if (profile.role === 'pending') {
      await supabase.auth.signOut();
      window.location.href = '/';
      throw new Error('Account in attesa');
    }

    if (requireAdmin && profile.role !== 'admin') {
      window.location.href = '/data-entry.html';
      throw new Error('Accesso negato');
    }

    // Show the page content (hidden by default to prevent flash)
    document.body.classList.add('authenticated');

    return { user, profile };
  } catch (err) {
    // Keep throwing to prevent page scripts from continuing
    throw err;
  }
}

/**
 * Logout handler
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

/**
 * Generate navbar HTML based on user role
 */
export function renderNavbar(profile, activePage = '') {
  const isAdmin = profile.role === 'admin';

  return `
    <nav class="navbar" role="navigation" aria-label="Navigazione principale">
      <a href="/data-entry.html" class="navbar__brand">🥃 Dispensa Bar</a>
      <button class="navbar__toggle" aria-label="Menu" aria-expanded="false">☰</button>
      <ul class="navbar__nav" role="menubar">
        <li role="none">
          <a href="/data-entry.html" role="menuitem"
             class="navbar__link ${activePage === 'data-entry' ? 'navbar__link--active' : ''}">
            📦 Inventario
          </a>
        </li>
        <li role="none">
          <a href="/search.html" role="menuitem"
             class="navbar__link ${activePage === 'search' ? 'navbar__link--active' : ''}">
            🔍 Cerca
          </a>
        </li>
        ${isAdmin ? `
        <li role="none">
          <a href="/admin.html" role="menuitem"
             class="navbar__link ${activePage === 'admin' ? 'navbar__link--active' : ''}">
            ⚙️ Admin
          </a>
        </li>
        <li role="none">
          <a href="/bulk-entry.html" role="menuitem"
             class="navbar__link ${activePage === 'bulk-entry' ? 'navbar__link--active' : ''}">
            📋 Inserimento Massivo
          </a>
        </li>
        ` : ''}
        <li role="none" class="navbar__logout">
          <button id="logout-btn" class="navbar__link" role="menuitem" style="background:none;border:none;cursor:pointer;">
            🚪 Esci
          </button>
        </li>
      </ul>
    </nav>
  `;
}

/**
 * Initialize navbar on page
 */
export function initNavbar(profile, activePage) {
  // Insert navbar at start of body
  document.body.insertAdjacentHTML('afterbegin', renderNavbar(profile, activePage));

  // Setup theme toggle
  setupThemeToggle();

  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', logout);
}
