import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import translations from './translations.js';

const LanguageContext = createContext(null);

function savedLanguage() {
    try {
        const saved = localStorage.getItem('preferredLanguage');
        return translations[saved] ? saved : 'it';
    } catch {
        return 'it';
    }
}

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(savedLanguage);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next) => {
        setLangState(next);
        try { localStorage.setItem('preferredLanguage', next); } catch { /* storage unavailable */ }
    }, []);

    const value = useMemo(() => {
        const dict = translations[lang];
        const t = (key) => {
            const v = dict[key];
            return typeof v === 'string' ? v.replace('{year}', new Date().getFullYear()) : v ?? key;
        };
        // For the few static strings that contain markup (trusted, written by me)
        const html = (key) => ({ __html: t(key) });
        return { lang, setLang, t, html };
    }, [lang, setLang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
