/**
 * DISPENSA BAR — Theme Toggle System
 * Handles switching between light and dark modes
 */

export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
}

function updateToggleIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Add the toggle to the navbar if it exists
export function setupThemeToggle() {
    const nav = document.querySelector('.navbar__nav');
    if (nav && !document.getElementById('theme-toggle')) {
        const li = document.createElement('li');
        li.innerHTML = `
            <button id="theme-toggle" class="navbar__link btn-theme" title="Cambia Tema">
                <span id="theme-toggle-icon"></span>
            </button>
        `;
        nav.insertBefore(li, nav.firstChild);

        const btn = document.getElementById('theme-toggle');
        btn.addEventListener('click', toggleTheme);

        // Initial icon update
        updateToggleIcon(document.documentElement.getAttribute('data-theme'));
    }
}
