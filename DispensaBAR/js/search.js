// ============================================
// Dashboard & Search — Multi-view Logic
// ============================================
import { api, showToast, formatItalianFloat, setupNavToggle } from './api.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let allCategories = [];
let allLocations = [];
let activeCategory = null;
let activeLocation = null;
let activeView = 'overview'; // overview, stock, discards
let searchQuery = '';

// ---- Init ----
async function init() {
  try {
    const { profile } = await requireAuth();
    initNavbar(profile, 'search');
    setupNavToggle();

    await loadFilters();
    setupViewSwitch();
    setupSearch();
    setupDropdowns();
    setupModal();

    renderCurrentView();
  } catch (err) {
    console.error('Init error:', err);
  }
}

// ---- Setup UI Elements ----
function setupViewSwitch() {
  const buttons = document.querySelectorAll('.view-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeView = btn.dataset.view;
      renderCurrentView();
    });
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  input?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderCurrentView();
  });
}

function setupDropdowns() {
  const toggle = document.getElementById('filter-toggle');
  const dropdown = document.getElementById('filter-dropdown');

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown?.contains(e.target) && e.target !== toggle) {
      dropdown?.classList.add('hidden');
    }
  });
}

// ---- Data Loading ----
async function loadFilters() {
  try {
    [allCategories, allLocations] = await Promise.all([
      api.get('/categories'),
      api.get('/locations'),
    ]);

    renderChips('category-chips', allCategories, 'category');
    renderChips('location-chips', allLocations, 'location');
  } catch (err) {
    showToast('Errore filtri: ' + err.message, 'error');
  }
}

function renderChips(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const allBtn = document.createElement('button');
  allBtn.className = 'chip chip--active';
  allBtn.textContent = 'All';
  allBtn.onclick = () => handleFilterClick(allBtn, type, null);

  container.innerHTML = '';
  container.appendChild(allBtn);

  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = item.name;
    btn.onclick = () => handleFilterClick(btn, type, item.id);
    container.appendChild(btn);
  });
}

function handleFilterClick(btn, type, id) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
  btn.classList.add('chip--active');

  if (type === 'category') activeCategory = id;
  else activeLocation = id;

  renderCurrentView();
}

// ---- Main Rendering ----
async function renderCurrentView() {
  const container = document.getElementById('main-content');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

  if (activeView === 'discards') {
    renderDiscardsView(container);
    return;
  }

  try {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category_id', activeCategory);
    if (activeLocation) params.set('location_id', activeLocation);
    if (searchQuery) params.set('q', searchQuery);

    const data = await api.get(`/products?${params}`);

    if (activeView === 'overview') {
      renderOverview(container, data);
    } else {
      renderStockTable(container, data);
    }
  } catch (err) {
    showToast('Errore: ' + err.message, 'error');
  }
}

function renderOverview(container, products) {
  if (!products.length) {
    container.innerHTML = '<div class="empty-state">No products found</div>';
    return;
  }

  container.innerHTML = `
        <div class="product-grid-dash">
            ${products.map(p => `
                <div class="dash-card" data-id="${p.id}">
                    <div class="dash-card__content">
                        <h3>${escapeHtml(p.name)}</h3>
                        <div class="dash-card__stats">
                            <span>📁 ${escapeHtml(p.categories?.name || '—')}</span>
                            <span>📍 ${escapeHtml(p.locations?.name || '—')}</span>
                        </div>
                    </div>
                    <div class="dash-card__badge">
                        ${formatItalianFloat(p.quantity)} bott
                    </div>
                </div>
            `).join('')}
        </div>
    `;

  container.querySelectorAll('.dash-card').forEach(card => {
    card.addEventListener('click', () => {
      const p = products.find(x => x.id == card.dataset.id);
      openProductModal(p);
    });
  });
}

function renderStockTable(container, products) {
  if (!products.length) {
    container.innerHTML = '<div class="empty-state">No products found</div>';
    return;
  }

  container.innerHTML = `
        <div class="stock-table-wrap">
            <table class="stock-table">
                <thead>
                    <tr>
                        <th>Prodotto</th>
                        <th>Categoria</th>
                        <th>Posizione</th>
                        <th>Quantità</th>
                        <th>Origine</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr class="clickable" data-id="${p.id}">
                            <td><strong>${escapeHtml(p.name)}</strong></td>
                            <td>${escapeHtml(p.categories?.name || '—')}</td>
                            <td>${escapeHtml(p.locations?.name || '—')}</td>
                            <td style="color:var(--accent-gold); font-weight:600;">${formatItalianFloat(p.quantity)}</td>
                            <td>${escapeHtml(p.origin || '—')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

  container.querySelectorAll('tr.clickable').forEach(row => {
    row.addEventListener('click', () => {
      const p = products.find(x => x.id == row.dataset.id);
      openProductModal(p);
    });
  });
}

async function renderDiscardsView(container) {
  try {
    // OUT movements of the last 30 days (only products that still exist)
    const categoryParam = activeCategory ? `&category_id=${activeCategory}` : '';
    const validLogs = await api.get(`/activity/discards?days=30${categoryParam}`);

    if (!validLogs.length) {
      container.innerHTML = '<div class="empty-state">Nessun flacone finito trovato</div>';
      return;
    }

    container.innerHTML = `
            <div class="discard-dashboard">
                <header class="discard-header">
                    <h2>📊 Registro Scarti (Ultimi 30 giorni)</h2>
                    <p>Quantità totale per data e categoria</p>
                </header>

                <div class="discard-stats-grid">
                    ${validLogs.slice(0, 20).map(log => `
                        <div class="discard-card-item">
                            <div class="discard-card-top">
                                <span class="discard-card-qty">${formatItalianFloat(log.details?.amount || 0)}</span>
                                <span class="discard-card-unit">bott</span>
                            </div>
                            <div class="discard-card-mid">
                                <span class="discard-card-name">${escapeHtml(log.product_name)}</span>
                                <span class="discard-card-cat">📁 ${escapeHtml(log.category_name)}</span>
                            </div>
                            <div class="discard-card-bottom">
                                <span class="discard-card-date">📅 ${new Date(log.created_at).toLocaleDateString('it-IT')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${validLogs.length > 20 ? `
                    <div style="text-align:center; padding: 20px; color: var(--text-muted);">
                        Mostrando gli ultimi 20 di ${validLogs.length} record.
                    </div>
                ` : ''}
            </div>
        `;
  } catch (err) {
    showToast('Errore registro scarti: ' + err.message, 'error');
  }
}

// ---- Modal ----
function setupModal() {
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('product-modal');
  closeBtn?.addEventListener('click', () => overlay.classList.remove('active'));
}

function openProductModal(p) {
  const overlay = document.getElementById('product-modal');
  const body = document.getElementById('modal-body');
  const title = document.getElementById('modal-title');

  title.textContent = p.name;
  body.innerHTML = `
        <div class="modal-detail__row"><span>📁 Categoria</span><span>${escapeHtml(p.categories?.name)}</span></div>
        <div class="modal-detail__row"><span>📍 Posizione</span><span>${escapeHtml(p.locations?.name)}</span></div>
        <div class="modal-detail__row"><span>📦 Quantità</span><span style="color:var(--accent-gold)">${formatItalianFloat(p.quantity)} bott</span></div>
        <div class="modal-detail__row"><span>🌎 Origine</span><span>${escapeHtml(p.origin || '—')}</span></div>
        <div class="modal-detail__row"><span>👃 Aroma</span><span>${escapeHtml(p.aroma || '—')}</span></div>
        <div class="modal-detail__row" style="flex-direction:column; align-items:flex-start;">
            <span>📝 Descrizione</span>
            <p style="margin-top:8px; opacity:0.8;">${escapeHtml(p.description || 'Nessuna descrizione disponibile.')}</p>
        </div>
    `;
  overlay.classList.add('active');
}

// ---- Utils ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

init();
