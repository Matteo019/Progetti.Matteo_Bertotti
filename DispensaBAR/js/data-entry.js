// ============================================
// Data Entry — Search + IN/OUT + History
// ============================================
import { supabase, showToast, formatItalianFloat, parseItalianFloat, formatDateTime, setupNavToggle } from './supabase-config.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let currentUser = null;
let currentProfile = null;
let debounceTimer = null;

// ---- Init ----
async function init() {
    try {
        const { user, profile } = await requireAuth();
        currentUser = user;
        currentProfile = profile;
        initNavbar(profile, 'data-entry');
        setupNavToggle();
        setupSearch();
        loadRecentHistory();
        subscribeToHistory();
    } catch {
        // requireAuth handles redirect
    }
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
    const emptyState = document.getElementById('empty-state');

    if (!query) {
        container.innerHTML = '';
        container.appendChild(emptyState);
        emptyState.style.display = '';
        return;
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name), locations(name)')
            .ilike('name', `%${query}%`)
            .order('name')
            .limit(20);

        if (error) throw error;

        if (!data.length) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p class="empty-state__text">Nessun prodotto trovato per "${query}"</p>
        </div>
      `;
            return;
        }

        container.innerHTML = data.map(product => renderProductCard(product)).join('');
        attachProductActions();
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

function attachProductActions() {
    document.querySelectorAll('.btn-in, .btn-out').forEach(btn => {
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

    const currentQty = parseFloat(card.dataset.qty) || 0;
    let newQty;

    if (action === 'in') {
        newQty = currentQty + amount;
    } else {
        newQty = Math.max(0, currentQty - amount);
    }

    // Round to 1 decimal
    newQty = Math.round(newQty * 10) / 10;

    try {
        // Update product
        const { error: updateError } = await supabase
            .from('products')
            .update({ quantity: newQty })
            .eq('id', productId);

        if (updateError) throw updateError;

        // Log activity
        const productName = card.querySelector('.de-product__name')?.textContent || '';
        const { error: logError } = await supabase
            .from('activity_log')
            .insert({
                user_id: currentUser.id,
                user_name: currentProfile.display_name || currentProfile.email,
                product_id: productId,
                product_name: productName,
                action: action === 'in' ? 'IN' : 'OUT',
                previous_value: currentQty,
                new_value: newQty,
                details: { amount }
            });

        if (logError) console.warn('Log error:', logError);

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
    } catch (err) {
        showToast('Errore aggiornamento: ' + err.message, 'error');
    }
}

// ---- History ----
async function loadRecentHistory() {
    try {
        const { data, error } = await supabase
            .from('activity_log')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(15);

        if (error) throw error;
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

function subscribeToHistory() {
    supabase
        .channel('activity-log-changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'activity_log',
            filter: `user_id=eq.${currentUser.id}`
        }, () => {
            loadRecentHistory();
        })
        .subscribe();
}

// ---- Utils ----
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// ---- Start ----
init();
