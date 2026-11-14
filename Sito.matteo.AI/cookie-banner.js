
// Informative notice: the site uses no tracking cookies, so there is nothing to accept or reject.
// The dismissal is remembered in localStorage (when available).
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const okBtn = document.getElementById('cookie-accept');
    if (!banner || !okBtn) return;

    let dismissed = null;
    try {
        dismissed = localStorage.getItem('cookie-consent');
    } catch (e) { /* storage unavailable: show the notice */ }

    if (!dismissed) {
        setTimeout(() => banner.classList.add('show'), 1000);
    }

    okBtn.addEventListener('click', () => {
        try {
            localStorage.setItem('cookie-consent', 'dismissed');
        } catch (e) { /* storage unavailable */ }
        banner.classList.remove('show');
    });
});
