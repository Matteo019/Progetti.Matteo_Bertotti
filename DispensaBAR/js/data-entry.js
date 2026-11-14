// ============================================
// Data Entry — Search + IN/OUT + History
// ============================================
import { api, showToast, formatItalianFloat, parseItalianFloat, formatDateTime, setupNavToggle } from './api.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let debounceTimer = null;

// ---- Init ----
async function init() {
    try {
        const { profile } = await requireAuth();
        initNavbar(profile, 'data-entry');
        setupNavToggle();
        setupSearch();
        loadDashboard();
        loadRecentHistory();
    } catch {
        // requireAuth handles redirect
    }
}

// ---- Dashboard (shown while the search box is empty) ----
const LOW_STOCK = 0.5; // bottles: half a bottle or less

async function loadDashboard() {
    try {
        const [products, outs] = await Promise.all([
            api.get('/products'),
            api.get('/activity/discards?days=3650'), // all the "OUT" movements
        ]);

        const totalBottles = products.reduce((sum, p) => sum + Number(p.quantity), 0);
        const lowStock = products
            .filter(p => p.quantity <= LOW_STOCK)
            .sort((a, b) => a.quantity - b.quantity || a.name.localeCompare(b.name));

        document.getElementById('stat-products').textContent = products.length;
        document.getElementById('stat-bottles').textContent = formatItalianFloat(totalBottles);
        document.getElementById('stat-low').textContent = lowStock.length;
        document.getElementById('stat-empty').textContent = products.filter(p => Number(p.quantity) === 0).length;

        renderLowStock(lowStock.slice(0, 6));
        renderTopUsed(outs);
    } catch (err) {
        showToast('Errore caricamento riepilogo: ' + err.message, 'error');
    }
}

function renderLowStock(products) {
    const container = document.getElementById('low-stock-list');
    if (!products.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessun prodotto in esaurimento 🎉</p></div>`;
        return;
    }
    container.innerHTML = products.map(renderProductCard).join('');
    attachProductActions(container);
}

function renderTopUsed(outs) {
    const container = document.getElementById('top-used-list');

    // Total bottles taken out per product
    const totals = new Map();
    for (const log of outs) {
        const amount = Number(log.details?.amount ?? (log.previous_value - log.new_value)) || 0;
        totals.set(log.product_name, (totals.get(log.product_name) || 0) + amount);
    }
    const top = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    if (!top.length) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state__text">Nessuno scarico registrato</p></div>`;
        return;
    }

    const max = top[0][1];
    container.innerHTML = top.map(([name, total]) => `
    <div class="dash-bar">
      <span class="dash-bar__fill" style="width:${Math.round((total / max) * 100)}%"></span>
      <span class="dash-bar__name">${escapeHtml(name)}</span>
      <span class="dash-bar__value">${formatItalianFloat(total)} bott</span>
    </div>
  `).join('');
}

// ---- Search ----
function setupSearch() {
    const input = document.getElementById('product-search');
    input?.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchProducts(e.target.value.trim()), 300);
    });
}

async function searchProducts(query) {
    const container = document.getElementById('search-results');
    const dashboard = document.getElementById('dashboard');

    // Empty search: back to the dashboard
    if (!query) {
        container.innerHTML = '';
        dashboard.hidden = false;
        loadDashboard();
        return;
    }
    dashboard.hidden = true;

    try {
        const data = await api.get(`/products?q=${encodeURIComponent(query)}&limit=20`);

        if (!data.length) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p class="empty-state__text">Nessun prodotto trovato per "${escapeHtml(query)}"</p>
        </div>
      `;
            return;
        }

        container.innerHTML = data.map(product => renderProductCard(product)).join('');
        attachProductActions(container);
    } catch (err) {
        showToast('Errore nella ricerca: ' + err.message, 'error');
    }
}

function renderProductCard(product) {
    const categoryName = product.categories?.name || '—';
    const locationName = product.locations?.name || '—';

    return `
    <div class="de-product glass-card" data-id="${product.id}" data-qty="${product.quantity}">
      <div class="de-product__info">
        <div class="de-product__name">${escapeHtml(product.name)}</div>
        <div class="de-product__meta">
          📁 ${escapeHtml(categoryName)} · 📍 ${escapeHtml(locationName)}
        </div>
      </div>
      <div class="de-product__qty">
        <span class="de-product__qty-value" id="qty-${product.id}">${formatItalianFloat(product.quantity)}</span>
        <span class="de-product__qty-label">bott</span>
      </div>
      <div class="de-product__actions">
        <input
          type="text"
          class="de-product__amount-input"
          value="1"
          title="Quantità da aggiungere/rimuovere"
          data-id="${product.id}"
        />
        <button class="btn btn-in" data-id="${product.id}" data-action="in" title="Aggiungi">+</button>
        <button class="btn btn-out" data-id="${product.id}" data-action="out" title="Rimuovi">−</button>
      </div>
    </div>
  `;
}

// Only inside the given container: otherwise the dashboard cards would get the click handler twice
function attachProductActions(container) {
    container.querySelectorAll('.btn-in, .btn-out').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
}

async function handleQuantityChange(e) {
    const btn = e.currentTarget;
    const productId = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    const card = btn.closest('.de-product');
    const amountInput = card.querySelector('.de-product__amount-input');
    const amount = parseItalianFloat(amountInput.value) || 1;

    try {
        // The server computes the new quantity and writes the history
        const result = await api.post(`/products/${productId}/movement`, { action, amount });
        const newQty = result.new_value;
        const productName = result.product.name;

        // Update UI
        card.dataset.qty = newQty;
        const qtyEl = document.getElementById(`qty-${productId}`);
        if (qtyEl) qtyEl.textContent = formatItalianFloat(newQty);

        // Flash effect
        card.classList.remove('de-product--flash');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('de-product--flash');

        showToast(
            `${action === 'in' ? '+' : '−'}${formatItalianFloat(amount)} → ${productName}: ${formatItalianFloat(newQty)} bott`,
            'success'
        );
        loadRecentHistory();
        if (!document.getElementById('dashboard').hidden) loadDashboard();
    } catch (err) {
        showToast('Errore aggiornamento: ' + err.message, 'error');
    }
}

// ---- History ----
async function loadRecentHistory() {
    try {
        const data = await api.get('/activity?mine=true&limit=15');
        renderHistory(data);
    } catch (err) {
        console.error('History load error:', err);
    }
}

function renderHistory(items) {
    const container = document.getElementById('history-list');
    if (!items?.length) {
        container.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__text">Nessuna attività recente</p>
      </div>
    `;
        return;
    }

    container.innerHTML = items.map(item => {
        const isIn = item.action === 'IN';
        const amount = item.details?.amount ?? Math.abs((item.new_value || 0) - (item.previous_value || 0));
        return `
      <div class="de-history__item">
        <span class="de-history__action de-history__action--${isIn ? 'in' : 'out'}">
          ${isIn ? '+' : '−'}${formatItalianFloat(amount)}
        </span>
        <span class="de-history__detail">
          <strong>${escapeHtml(item.product_name || 'Prodotto')}</strong>
          → ${formatItalianFloat(item.previous_value)} ➜ ${formatItalianFloat(item.new_value)} bott
        </span>
        <span class="de-history__time">${formatDateTime(item.created_at)}</span>
      </div>
    `;
    }).join('');
}

// ---- Utils ----
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// ---- Start ----
init();
