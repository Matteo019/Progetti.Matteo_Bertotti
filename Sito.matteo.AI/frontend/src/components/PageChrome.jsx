import { useEffect, useRef, useState } from 'react';

import { useLanguage } from '../i18n/LanguageContext.jsx';

export function ScrollProgress() {
    const ref = useRef(null);
    useEffect(() => {
        const update = () => {
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            const progress = docHeight <= 0 ? 100 : Math.min((window.scrollY / docHeight) * 100, 100);
            if (ref.current) ref.current.style.width = `${progress}%`;
        };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);
    return <div className="scroll-progress" ref={ref} />;
}

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
        <footer>
            <div className="container"><p>{t('footer-rights')}</p></div>
        </footer>
    );
}
