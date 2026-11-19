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

export default function Navbar({ onOpenPosts, postsOpen = false }) {
    const { lang, setLang, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const headerRef = useRef(null);
    const [active, setActive] = useState(null);
    const [showName, setShowName] = useState(false);

    // On scroll: hairline under the header, which section is being read,
    // and whether the big name in the hero has left the screen
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const header = headerRef.current;
            const navBottom = header ? header.getBoundingClientRect().bottom : 64;
            header?.classList.toggle('scrolled', window.scrollY > 8);

            const heroName = document.querySelector('.hero-name');
            setShowName(!heroName || heroName.getBoundingClientRect().bottom < navBottom);

            // The current section is the last one whose top has passed a line at 35% of the screen
            const line = window.innerHeight * 0.35;
            let current = null;
            for (const [id] of LINKS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            // Certifications sit between Skills and Contact but have no link: keep Skills lit
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            setActive(atBottom ? 'contact' : current);
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
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
                {/* Hidden while the big name is on screen, fades in once it has scrolled away */}
                <a
                    href="#top"
                    className={`site-name${showName || open ? ' is-full' : ''}`}
                    aria-label="Matteo Bertotti"
                    onClick={() => setOpen(false)}
                >
                    <span className="site-name-full" aria-hidden="true">Matteo Bertotti</span>
                </a>

                <button
                    type="button"
                    className={`menu-toggle${open ? ' is-open' : ''}`}
                    aria-expanded={open}
                    aria-controls="site-nav"
                    onClick={() => setOpen(o => !o)}
                >
                    <span className="menu-label">{open ? t('menu-close') : t('menu-open')}</span>
                    {/* Two thin lines that cross into an X when the menu is open */}
                    <span className="menu-icon" aria-hidden="true"><span /><span /></span>
                </button>

                <nav id="site-nav" className={`site-nav${open ? ' open' : ''}`}>
                    <ul className="nav-links">
                        {LINKS.map(([id, key]) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    className={(postsOpen ? id === 'posts' : active === id) ? 'active' : undefined}
                                    aria-current={(postsOpen ? id === 'posts' : active === id) ? 'true' : undefined}
                                    onClick={(e) => follow(e, id)}
                                >{t(key)}</a>
                            </li>
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
