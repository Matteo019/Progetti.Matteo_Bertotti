// ============================================
// Admin Dashboard — User Mgmt, Activity, CRUD
// ============================================
import { supabase, showToast, formatItalianFloat, parseItalianFloat, formatDate, formatDateTime, setupNavToggle } from './supabase-config.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let currentProfile = null;
let allCategories = [];
let allLocations = [];

// ---- Init ----
async function init() {
    try {
        const { user, profile } = await requireAuth({ requireAdmin: true });
        currentProfile = profile;
        initNavbar(profile, 'admin');
        setupNavToggle();
        setupTabs();
        await loadMetadata();
        loadUsers();
        loadActivity();
        loadProducts();
        loadCategories();
        loadLocations();
        setupProductModal();
        setupCategoryAdd();
        setupLocationAdd();
    } catch {
        // requireAuth handles redirect
    }
}

// ---- Tabs ----
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('tab--active');
                t.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);

            tab.classList.add('tab--active');
            tab.setAttribute('aria-selected', 'true');
            const panel = document.getElementById(`tab-${tab.dataset.tab}`);
            if (panel) panel.hidden = false;
        });
    });
}

// ---- Load Categories/Locations metadata ----
async function loadMetadata() {
    const [catRes, locRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('locations').select('*').order('name'),
    ]);
    allCategories = catRes.data || [];
    allLocations = locRes.data || [];
}

// ============================================
// USERS MANAGEMENT
// ============================================
async function loadUsers() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const pending = data.filter(u => u.role === 'pending');
        const approved = data.filter(u => u.role !== 'pending');

        renderUserList('pending-users', pending, true);
        renderUserList('approved-users', approved, false);
    } catch (err) {
        showToast('Errore caricamento utenti: ' + err.message, 'error');
    }
}

function renderUserList(containerId, users, isPending) {
    const container = document.getElementById(containerId);
    if (!users.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">${isPending ? 'Nessuna richiesta in attesa' : 'Nessun utente approvato'}</p></div>`;
        return;
    }

    container.innerHTML = users.map(u => `
    <div class="user-card glass-card" data-id="${u.id}">
      <div class="user-card__info">
        <div class="user-card__name">${escapeHtml(u.display_name || 'Nome non impostato')}</div>
        <div class="user-card__email">${escapeHtml(u.email)}</div>
        <div class="user-card__date">Registrato: ${formatDate(u.created_at)}</div>
      </div>
      <span class="badge badge--${u.role === 'pending' ? 'pending' : u.role === 'admin' ? 'admin' : 'approved'}">
        ${u.role}
      </span>
      <div class="user-card__actions">
        ${isPending ? `
          <button class="btn btn--success btn--sm" onclick="window.approveUser('${u.id}')">✓ Approva</button>
          <button class="btn btn--danger btn--sm" onclick="window.denyUser('${u.id}')">✕ Nega</button>
        ` : `
          ${u.role !== 'admin' ? `
            <button class="btn btn--secondary btn--sm" onclick="window.toggleAdmin('${u.id}', true)">Rendi Admin</button>
          ` : `
            <button class="btn btn--secondary btn--sm" onclick="window.toggleAdmin('${u.id}', false)">Rimuovi Admin</button>
          `}
        `}
      </div>
    </div>
  `).join('');
}

window.approveUser = async function (userId) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role: 'user', approved_at: new Date().toISOString() })
            .eq('id', userId);
        if (error) throw error;
        showToast('Utente approvato!', 'success');
        loadUsers();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
};

window.denyUser = async function (userId) {
    if (!confirm('Sei sicuro di voler negare questa richiesta?')) return;
    try {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (error) throw error;
        showToast('Richiesta negata', 'success');
        loadUsers();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
};

window.toggleAdmin = async function (userId, makeAdmin) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role: makeAdmin ? 'admin' : 'user' })
            .eq('id', userId);
        if (error) throw error;
        showToast(makeAdmin ? 'Utente promosso ad Admin' : 'Rimosso ruolo Admin', 'success');
        loadUsers();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
};

// ============================================
// ACTIVITY LOG
// ============================================
async function loadActivity() {
    try {
        const dateFilter = document.getElementById('activity-date-filter')?.value;
        const userFilter = document.getElementById('activity-user-filter')?.value?.trim()?.toLowerCase();

        let query = supabase
            .from('activity_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (dateFilter) {
            const start = new Date(dateFilter);
            const end = new Date(dateFilter);
            end.setDate(end.getDate() + 1);
            query = query.gte('created_at', start.toISOString()).lt('created_at', end.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;

        let filtered = data || [];
        if (userFilter) {
            filtered = filtered.filter(item =>
                (item.user_name || '').toLowerCase().includes(userFilter)
            );
        }

        renderActivityLog(filtered);
    } catch (err) {
        showToast('Errore caricamento attività: ' + err.message, 'error');
    }
}

function renderActivityLog(items) {
    const container = document.getElementById('activity-list');
    if (!items.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessuna attività trovata</p></div>`;
        return;
    }

    // Group by date
    const groups = {};
    items.forEach(item => {
        const date = formatDate(item.created_at);
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
    });

    let html = '';
    for (const [date, entries] of Object.entries(groups)) {
        html += `<div class="activity-card__date-header">${date}</div>`;
        html += entries.map(item => {
            const isIn = item.action === 'IN';
            const icon = isIn ? '📥' : (item.action === 'OUT' ? '📤' : '⚙️');
            const iconClass = isIn ? 'in' : (item.action === 'OUT' ? 'out' : 'admin');
            const amount = item.details?.amount ?? Math.abs((item.new_value || 0) - (item.previous_value || 0));

            return `
        <div class="activity-card">
          <div class="activity-card__icon activity-card__icon--${iconClass}">${icon}</div>
          <div class="activity-card__content">
            <div class="activity-card__text">
              <strong>${escapeHtml(item.user_name || 'Utente')}</strong>
              ${item.action} ${formatItalianFloat(amount)} bott di
              <strong>${escapeHtml(item.product_name || 'Prodotto')}</strong>
              (${formatItalianFloat(item.previous_value)} → ${formatItalianFloat(item.new_value)})
            </div>
            <div class="activity-card__meta">${formatDateTime(item.created_at)}</div>
          </div>
        </div>
      `;
        }).join('');
    }

    container.innerHTML = html;
}

// Setup activity filters
document.getElementById('activity-date-filter')?.addEventListener('change', loadActivity);
document.getElementById('activity-user-filter')?.addEventListener('input', debounce(loadActivity, 300));

// ============================================
// PRODUCTS CRUD
// ============================================
async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name), locations(name)')
            .order('name');

        if (error) throw error;

        const container = document.getElementById('products-list');
        if (!data.length) {
            container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessun prodotto</p></div>`;
            return;
        }

        container.innerHTML = data.map(p => `
      <div class="product-list-item glass-card" data-product='${JSON.stringify(p).replace(/'/g, "&#39;")}'>
        <span class="product-list-item__name">${escapeHtml(p.name)}</span>
        <span class="product-list-item__category">${escapeHtml(p.categories?.name || '—')}</span>
        <span class="product-list-item__qty">${formatItalianFloat(p.quantity)} bott</span>
      </div>
    `).join('');

        container.querySelectorAll('.product-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const product = JSON.parse(item.dataset.product);
                openProductModal(product);
            });
        });
    } catch (err) {
        showToast('Errore caricamento prodotti: ' + err.message, 'error');
    }
}

function setupProductModal() {
    const overlay = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-product-btn');
    const saveBtn = document.getElementById('save-product-btn');
    const deleteBtn = document.getElementById('delete-product-btn');
    const addBtn = document.getElementById('add-product-btn');

    const close = () => {
        overlay?.classList.remove('active');
        overlay?.setAttribute('aria-hidden', 'true');
    };

    closeBtn?.addEventListener('click', close);
    cancelBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    addBtn?.addEventListener('click', () => openProductModal(null));
    saveBtn?.addEventListener('click', saveProduct);
    deleteBtn?.addEventListener('click', deleteProduct);
}

function openProductModal(product) {
    const overlay = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const deleteBtn = document.getElementById('delete-product-btn');

    // Populate category/location selects
    const catSelect = document.getElementById('product-category');
    const locSelect = document.getElementById('product-location');

    catSelect.innerHTML = '<option value="">— Seleziona —</option>' +
        allCategories.map(c => `<option value="${c.id}" ${product?.category_id === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');

    locSelect.innerHTML = '<option value="">— Seleziona —</option>' +
        allLocations.map(l => `<option value="${l.id}" ${product?.location_id === l.id ? 'selected' : ''}>${escapeHtml(l.name)}</option>`).join('');

    if (product) {
        title.textContent = 'Modifica Prodotto';
        deleteBtn.style.display = '';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-quantity').value = formatItalianFloat(product.quantity);
        document.getElementById('product-origin').value = product.origin || '';
        document.getElementById('product-aroma').value = product.aroma || '';
        document.getElementById('product-description').value = product.description || '';
    } else {
        title.textContent = 'Nuovo Prodotto';
        deleteBtn.style.display = 'none';
        document.getElementById('product-id').value = '';
        document.getElementById('product-form').reset();
    }

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
}

async function saveProduct() {
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        category_id: document.getElementById('product-category').value || null,
        location_id: document.getElementById('product-location').value || null,
        quantity: parseItalianFloat(document.getElementById('product-quantity').value),
        origin: document.getElementById('product-origin').value.trim() || null,
        aroma: document.getElementById('product-aroma').value.trim() || null,
        description: document.getElementById('product-description').value.trim() || null,
    };

    if (!productData.name) {
        showToast('Il nome è obbligatorio', 'error');
        return;
    }

    try {
        if (id) {
            const { error } = await supabase.from('products').update(productData).eq('id', id);
            if (error) throw error;
            showToast('Prodotto aggiornato!', 'success');
        } else {
            const { error } = await supabase.from('products').insert(productData);
            if (error) throw error;
            showToast('Prodotto creato!', 'success');
        }

        document.getElementById('product-modal').classList.remove('active');
        loadProducts();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
}

async function deleteProduct() {
    const id = document.getElementById('product-id').value;
    if (!id || !confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        showToast('Prodotto eliminato', 'success');
        document.getElementById('product-modal').classList.remove('active');
        loadProducts();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
}

// ============================================
// CATEGORIES / LOCATIONS CRUD
// ============================================
async function loadCategories() {
    await loadMetadata();
    const container = document.getElementById('categories-list');
    if (!allCategories.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessuna categoria</p></div>`;
        return;
    }
    container.innerHTML = allCategories.map(c => `
    <div class="simple-item">
      <span class="simple-item__name">${escapeHtml(c.name)}</span>
      <div class="simple-item__actions">
        <button class="btn btn--danger btn--sm" onclick="window.deleteCategory(${c.id})">✕</button>
      </div>
    </div>
  `).join('');
}

function setupCategoryAdd() {
    document.getElementById('add-category-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('new-category-input');
        const name = input?.value.trim();
        if (!name) return;
        try {
            const { error } = await supabase.from('categories').insert({ name });
            if (error) throw error;
            input.value = '';
            showToast('Categoria aggiunta!', 'success');
            loadCategories();
        } catch (err) {
            showToast('Errore: ' + err.message, 'error');
        }
    });
}

window.deleteCategory = async function (id) {
    if (!confirm('Eliminare questa categoria?')) return;
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        showToast('Categoria eliminata', 'success');
        loadCategories();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
};

async function loadLocations() {
    await loadMetadata();
    const container = document.getElementById('locations-list');
    if (!allLocations.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessuna posizione</p></div>`;
        return;
    }
    container.innerHTML = allLocations.map(l => `
    <div class="simple-item">
      <span class="simple-item__name">${escapeHtml(l.name)}</span>
      <div class="simple-item__actions">
        <button class="btn btn--danger btn--sm" onclick="window.deleteLocation(${l.id})">✕</button>
      </div>
    </div>
  `).join('');
}

function setupLocationAdd() {
    document.getElementById('add-location-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('new-location-input');
        const name = input?.value.trim();
        if (!name) return;
        try {
            const { error } = await supabase.from('locations').insert({ name });
            if (error) throw error;
            input.value = '';
            showToast('Posizione aggiunta!', 'success');
            loadLocations();
        } catch (err) {
            showToast('Errore: ' + err.message, 'error');
        }
    });
}

window.deleteLocation = async function (id) {
    if (!confirm('Eliminare questa posizione?')) return;
    try {
        const { error } = await supabase.from('locations').delete().eq('id', id);
        if (error) throw error;
        showToast('Posizione eliminata', 'success');
        loadLocations();
    } catch (err) {
        showToast('Errore: ' + err.message, 'error');
    }
};

// ---- Utils ----
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// ---- Start ----
init();
