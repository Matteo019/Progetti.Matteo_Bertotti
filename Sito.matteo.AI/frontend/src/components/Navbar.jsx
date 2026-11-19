import { useEffect, useRef, useState } from 'react';

import { initNavbarScroll } from '../effects/pageEffects.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LINKS = [
    ['about', 'nav-about'],
    ['experience', 'nav-experience'],
    ['education', 'nav-education'],
    ['skills', 'nav-skills'],
    ['projects', 'nav-projects'],
    ['posts', 'nav-posts'],
    ['contact', 'nav-contact'],
];

export default function Navbar({ onOpenPosts }) {
    const { lang, setLang, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => initNavbarScroll(navRef.current), []);

    return (
        <nav className="navbar" ref={navRef}>
            <div className="container">
                <a href="#" className="logo">MB.</a>
                <ul className={`nav-links${open ? ' active' : ''}`}>
                    {LINKS.map(([id, key]) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => {
                                    setOpen(false);
                                    // Posts are not a page section: the link opens their panel
                                    if (id === 'posts') { e.preventDefault(); onOpenPosts?.(); }
                                }}
                            >{t(key)}</a>
                        </li>
                    ))}
                </ul>
                <div className="lang-switcher">
                    <button className={`lang-btn${lang === 'it' ? ' active' : ''}`} onClick={() => setLang('it')}>IT</button>
                    <span className="lang-divider">|</span>
                    <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
                </div>
                <div className={`hamburger${open ? ' toggle' : ''}`} onClick={() => setOpen(o => !o)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}
