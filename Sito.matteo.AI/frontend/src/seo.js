import { useEffect } from 'react';

// Public address of the site: canonical URLs always point here (https, no www, no index.html)
export const SITE_URL = 'https://matteobertotti.tech';

function setMeta(selector, create, value) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', value);
}

// Sets title, canonical link and robots directives for the current page
export function usePageMeta({ title, path, noindex = false }) {
    useEffect(() => {
        if (title) document.title = title;
        setMeta('link[rel="canonical"]', () => {
            const l = document.createElement('link');
            l.rel = 'canonical';
            return l;
        }, `${SITE_URL}${path}`);
        setMeta('meta[name="robots"]', () => {
            const m = document.createElement('meta');
            m.name = 'robots';
            return m;
        }, noindex ? 'noindex, nofollow' : 'index, follow');
    }, [title, path, noindex]);
}
