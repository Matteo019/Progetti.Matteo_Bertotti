import { useEffect, useRef, useState } from 'react';

import { lockScroll, unlockScroll } from '../effects/scrollLock.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LINKS = [
    ['experience', 'nav-experience'],
    ['projects', 'nav-projects'],
    ['education', 'nav-education'],
    ['skills', 'nav-skills'],
    ['contact', 'nav-contact'],
    ['posts', 'nav-posts'],
];

export default function Navbar({ onOpenPosts }) {
    const { lang, setLang, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const headerRef = useRef(null);

    // Hairline under the header once the page scrolls
    useEffect(() => {
        const update = () => headerRef.current?.classList.toggle('scrolled', window.scrollY > 8);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    // The open mobile menu covers the page: keep the page still behind it
    useEffect(() => {
        if (!open) return undefined;
        lockScroll();
        return unlockScroll;
    }, [open]);

    const follow = (e, id) => {
        setOpen(false);
        // Posts are not a page section: the link opens their panel
        if (id === 'posts') {
            e.preventDefault();
            onOpenPosts?.();
        }
    };

    return (
        <header className="site-header" ref={headerRef}>
            <div className="page">
                <a href="#top" className="site-name" onClick={() => setOpen(false)}>Matteo Bertotti</a>

                <button
                    type="button"
                    className="menu-toggle"
                    aria-expanded={open}
                    aria-controls="site-nav"
                    onClick={() => setOpen(o => !o)}
                >
                    {open ? t('menu-close') : t('menu-open')}
                </button>

                <nav id="site-nav" className={`site-nav${open ? ' open' : ''}`}>
                    <ul className="nav-links">
                        {LINKS.map(([id, key]) => (
                            <li key={id}><a href={`#${id}`} onClick={(e) => follow(e, id)}>{t(key)}</a></li>
                        ))}
                    </ul>
                    <div className="lang-switcher">
                        <button className={`lang-btn${lang === 'it' ? ' active' : ''}`} onClick={() => setLang('it')}>IT</button>
                        <span className="lang-divider">/</span>
                        <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
