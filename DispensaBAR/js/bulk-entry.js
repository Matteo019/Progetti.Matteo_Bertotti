// ============================================
// Bulk Entry — Text Parser + Batch Upsert
// ============================================
import { api, showToast, formatItalianFloat, parseItalianFloat, setupNavToggle } from './api.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let parsedEntries = [];

// ---- Init ----
async function init() {
    try {
        const { profile } = await requireAuth({ requireAdmin: true });
        initNavbar(profile, 'bulk-entry');
        setupNavToggle();
        await loadSelects();
        setupHandlers();
    } catch {
        // requireAuth handles redirect
    }
}

// ---- Load location/category selects ----
async function loadSelects() {
    try {
        const [locations, categories] = await Promise.all([
            api.get('/locations'),
            api.get('/categories'),
        ]);

        const locSelect = document.getElementById('bulk-location');
        const catSelect = document.getElementById('bulk-category');

        locations.forEach(loc => {
            locSelect.innerHTML += `<option value="${loc.id}">${escapeHtml(loc.name)}</option>`;
        });

        categories.forEach(cat => {
            catSelect.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
        });
    } catch (err) {
        showToast('Errore caricamento dati: ' + err.message, 'error');
    }
}

// ---- Handlers ----
function setupHandlers() {
    document.getElementById('parse-btn')?.addEventListener('click', parseInput);
    document.getElementById('confirm-btn')?.addEventListener('click', confirmBulkEntry);
    document.getElementById('cancel-preview-btn')?.addEventListener('click', () => {
        document.getElementById('preview-section').hidden = true;
        parsedEntries = [];
    });
}

// ---- Parse Text Input ----
async function parseInput() {
    const text = document.getElementById('bulk-text')?.value.trim();
    const locationId = document.getElementById('bulk-location')?.value;

    if (!locationId) {
        showToast('Seleziona una posizione prima di procedere', 'error');
        return;
    }

    if (!text) {
        showToast('Inserisci almeno un prodotto', 'error');
        return;
    }

    const lines = text.split('\n').filter(l => l.trim());
    parsedEntries = [];

    // Products already in this location (to show "update" vs "new" in the preview)
    const existingProducts = await api.get(`/products?location_id=${parseInt(locationId)}`);

    const existingMap = new Map();
    (existingProducts || []).forEach(p => {
        existingMap.set(p.name.toLowerCase().trim(), p);
    });

    for (const line of lines) {
        const parts = line.split('|');
        if (parts.length < 2) {
            parsedEntries.push({
                name: line.trim(),
                quantity: 0,
                status: 'error',
                statusText: 'Formato non valido',
                action: '—',
            });
            continue;
        }

        const name = parts[0].trim();
        // Extract quantity: remove "bott" and parse Italian float
        const qtyStr = parts[1].trim().replace(/bott\.?/i, '').trim();
        const quantity = parseItalianFloat(qtyStr);

        const existing = existingMap.get(name.toLowerCase().trim());

        parsedEntries.push({
            name,
            quantity,
            existingId: existing?.id || null,
            existingQty: existing?.quantity || 0,
            status: existing ? 'update' : 'new',
            statusText: existing ? 'Aggiorna' : 'Nuovo',
            action: existing
                ? `${formatItalianFloat(existing.quantity)} → ${formatItalianFloat(quantity)}`
                : `${formatItalianFloat(quantity)} bott`,
        });
    }

    renderPreview();
}

function renderPreview() {
    const tbody = document.getElementById('preview-body');
    tbody.innerHTML = parsedEntries.map((entry, i) => `
    <tr>
      <td><span class="status-${entry.status}">${entry.statusText}</span></td>
      <td>${escapeHtml(entry.name)}</td>
      <td>${formatItalianFloat(entry.quantity)}</td>
      <td>${entry.action}</td>
    </tr>
  `).join('');

    document.getElementById('preview-section').hidden = false;
}

// ---- Confirm Bulk Entry ----
async function confirmBulkEntry() {
    const locationId = parseInt(document.getElementById('bulk-location')?.value);
    const categoryId = document.getElementById('bulk-category')?.value
        ? parseInt(document.getElementById('bulk-category').value)
        : null;

    const validEntries = parsedEntries.filter(e => e.status !== 'error');
    if (!validEntries.length) {
        showToast('Nessun dato valido da inserire', 'error');
        return;
    }

    const confirmBtn = document.getElementById('confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Inserimento in corso...';

    // One request: the server updates/creates the products and writes the history (all or nothing)
    let results;
    try {
        results = await api.post('/products/bulk', {
            location_id: locationId,
            category_id: categoryId,
            entries: validEntries.map(e => ({ name: e.name, quantity: e.quantity })),
        });
    } catch (err) {
        results = validEntries.map(e => ({ name: e.name, success: false, action: err.message }));
    }

    // Show results
    const resultsContainer = document.getElementById('results-list');
    resultsContainer.innerHTML = results.map(r => `
    <div class="result-item result-item--${r.success ? 'success' : 'error'}">
      ${r.success ? '✅' : '❌'} <strong>${escapeHtml(r.name)}</strong> — ${r.action}
    </div>
  `).join('');

    document.getElementById('preview-section').hidden = true;
    document.getElementById('results-section').hidden = false;

    const successCount = results.filter(r => r.success).length;
    showToast(`${successCount}/${results.length} prodotti elaborati con successo`, 'success');

    confirmBtn.disabled = false;
    confirmBtn.textContent = '✓ Conferma Inserimento';
    parsedEntries = [];
}

// ---- Utils ----
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// ---- Start ----
init();
