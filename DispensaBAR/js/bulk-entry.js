// ============================================
// Bulk Entry — Text Parser + Batch Upsert
// ============================================
import { supabase, showToast, formatItalianFloat, parseItalianFloat, setupNavToggle } from './supabase-config.js';
import { requireAuth, initNavbar } from './auth-guard.js';

let currentUser = null;
let currentProfile = null;
let parsedEntries = [];

// ---- Init ----
async function init() {
    try {
        const { user, profile } = await requireAuth({ requireAdmin: true });
        currentUser = user;
        currentProfile = profile;
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
        const [locRes, catRes] = await Promise.all([
            supabase.from('locations').select('*').order('name'),
            supabase.from('categories').select('*').order('name'),
        ]);

        const locSelect = document.getElementById('bulk-location');
        const catSelect = document.getElementById('bulk-category');

        (locRes.data || []).forEach(loc => {
            locSelect.innerHTML += `<option value="${loc.id}">${escapeHtml(loc.name)}</option>`;
        });

        (catRes.data || []).forEach(cat => {
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

    // Check existing products
    const { data: existingProducts } = await supabase
        .from('products')
        .select('id, name, quantity, location_id')
        .eq('location_id', parseInt(locationId));

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

    const results = [];

    for (const entry of validEntries) {
        try {
            if (entry.existingId) {
                // Update existing
                const { error } = await supabase
                    .from('products')
                    .update({ quantity: entry.quantity })
                    .eq('id', entry.existingId);

                if (error) throw error;

                // Log activity
                await supabase.from('activity_log').insert({
                    user_id: currentUser.id,
                    user_name: currentProfile.display_name || currentProfile.email,
                    product_id: entry.existingId,
                    product_name: entry.name,
                    action: 'BULK_UPDATE',
                    previous_value: entry.existingQty,
                    new_value: entry.quantity,
                    details: { bulk: true }
                });

                results.push({ name: entry.name, success: true, action: 'Aggiornato' });
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('products')
                    .insert({
                        name: entry.name,
                        quantity: entry.quantity,
                        location_id: locationId,
                        category_id: categoryId,
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Log activity
                await supabase.from('activity_log').insert({
                    user_id: currentUser.id,
                    user_name: currentProfile.display_name || currentProfile.email,
                    product_id: data.id,
                    product_name: entry.name,
                    action: 'BULK_INSERT',
                    previous_value: 0,
                    new_value: entry.quantity,
                    details: { bulk: true }
                });

                results.push({ name: entry.name, success: true, action: 'Creato' });
            }
        } catch (err) {
            results.push({ name: entry.name, success: false, action: err.message });
        }
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
