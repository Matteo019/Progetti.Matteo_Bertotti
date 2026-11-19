import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../i18n/LanguageContext.jsx';

// Informative notice only: the public site sets no cookies, so there is nothing to accept
export function CookieBanner() {
    const { t, html } = useLanguage();
    const [show, setShow] = useState(false);

    useEffect(() => {
        let dismissed = null;
        try { dismissed = localStorage.getItem('cookie-consent'); } catch { /* storage unavailable */ }
        if (dismissed) return undefined;
        const timer = setTimeout(() => setShow(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        try { localStorage.setItem('cookie-consent', 'dismissed'); } catch { /* storage unavailable */ }
        setShow(false);
    };

    return (
        <div id="cookie-banner" className={`cookie-banner${show ? ' show' : ''}`}>
            <div className="cookie-container">
                <div className="cookie-text"><p dangerouslySetInnerHTML={html('cookie-text')} /></div>
                <div className="cookie-actions">
                    <button id="cookie-accept" className="cookie-btn btn-accept" onClick={dismiss}>{t('cookie-accept')}</button>
                </div>
            </div>
        </div>
    );
}

export function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="site-footer">
            <div className="page mono">
                <span>{t('footer-rights')}</span>
                <Link to="/privacy">{t('footer-privacy')}</Link>
            </div>
        </footer>
    );
}
