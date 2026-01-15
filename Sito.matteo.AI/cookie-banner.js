
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');

    if (!cookieConsent) {
        // Show banner if no choice found
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
        setConsent('accepted');
    });

    rejectBtn.addEventListener('click', () => {
        setConsent('rejected');
    });

    function setConsent(status) {
        localStorage.setItem('cookie-consent', status);
        cookieBanner.classList.remove('show');

        // Trigger custom event for other scripts to listen to
        const event = new CustomEvent('cookieConsentChanged', { detail: status });
        window.dispatchEvent(event);

        if (status === 'accepted') {
            console.log('Cookies accepted. Loading tracking scripts...');
            // Here you would initialize Google Analytics, etc.
            // initTracking();
        } else {
            console.log('Cookies rejected.');
        }
    }
});
