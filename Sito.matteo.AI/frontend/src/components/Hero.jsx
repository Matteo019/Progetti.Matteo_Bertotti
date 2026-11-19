import { useEffect, useRef, useState } from 'react';

import { initParallaxHero } from '../effects/pageEffects.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const FULL_NAME = 'Matteo Augustinho Bertotti';
export const CV_URL = '/images/CV_MatteoBertotti_AI-SoftwareDeveloper_Verona.pdf';

// Types the name once, then blinks the caret three times
function useNameTyping() {
    const [text, setText] = useState('');
    const [caret, setCaret] = useState(true);

    useEffect(() => {
        let i = 0, typeTimer, blinkTimer;
        const typeName = () => {
            if (i < FULL_NAME.length) {
                i++;
                setText(FULL_NAME.slice(0, i));
                typeTimer = setTimeout(typeName, 70);
                return;
            }
            let blinks = 0;
            blinkTimer = setInterval(() => {
                blinks++;
                setCaret(blinks % 2 === 0);
                if (blinks > 6) {
                    clearInterval(blinkTimer);
                    setCaret(false);
                }
            }, 400);
        };
        typeTimer = setTimeout(typeName, 600);
        return () => { clearTimeout(typeTimer); clearInterval(blinkTimer); };
    }, []);

    return { text, caret };
}

// Types and deletes the role phrases in a loop
function useTypingPhrases(phrases) {
    const [text, setText] = useState('');

    useEffect(() => {
        let phrase = 0, chars = 0, deleting = false, timer;
        const tick = () => {
            const current = phrases[phrase];
            chars += deleting ? -1 : 1;
            setText(current.substring(0, chars));

            let speed = deleting ? 50 : 100;
            if (!deleting && chars === current.length) {
                deleting = true;
                speed = 2000;
            } else if (deleting && chars === 0) {
                deleting = false;
                phrase = (phrase + 1) % phrases.length;
                speed = 500;
            }
            timer = setTimeout(tick, speed);
        };
        tick();
        return () => clearTimeout(timer);
    }, [phrases]);

    return text;
}

export default function Hero() {
    const { t } = useLanguage();
    const visualRef = useRef(null);
    const name = useNameTyping();
    const role = useTypingPhrases(t('typing-phrases'));

    useEffect(() => initParallaxHero(visualRef.current), []);

    return (
        <header className="hero">
            <div className="container hero-content">
                <div className="hero-visual" ref={visualRef}>
                    <span className="hero-big-text hero-big-top" aria-hidden="true">AI &amp;</span>
                    <div className="hero-image fade-in delay-2">
                        <img src="/images/profile.webp" alt="Matteo Augustinho Bertotti" width="864" height="980" fetchPriority="high" />
                    </div>
                    <span className="hero-big-text hero-big-bottom" aria-hidden="true">SOFTWARE DEV</span>
                    <span className="hero-code-icon" aria-hidden="true">&lt;/&gt;</span>
                </div>
                <div className="hero-text">
                    <h1 className="fade-in" style={{ borderRight: name.caret ? '3px solid var(--accent)' : 'none' }}>
                        {name.text}
                    </h1>
                    <h2 className="fade-in delay-1">{role}</h2>
                    <p className="fade-in delay-2">{t('hero-subtitle')}</p>
                    <div className="cta-buttons fade-in delay-3">
                        <a href={CV_URL} className="btn btn-primary magnetic-btn" download>{t('hero-cv')}</a>
                        <a href="#projects" className="btn btn-secondary magnetic-btn">{t('hero-projects')}</a>
                    </div>
                </div>
            </div>
        </header>
    );
}
