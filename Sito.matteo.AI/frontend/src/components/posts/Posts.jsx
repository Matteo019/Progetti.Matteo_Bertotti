import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { api } from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import PostCard from './PostCard.jsx';

const PAGE = 6;
const ANIM_MS = 600;

// Feed loaded the first time the panel opens
function usePostsFeed(enabled) {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('idle'); // idle | loading | ready | error

    const load = useCallback(async (offset) => {
        setStatus('loading');
        try {
            const page = await api.publishedPosts(offset, PAGE);
            setPosts(prev => (offset === 0 ? page.items : [...prev, ...page.items]));
            setTotal(page.total);
            setStatus('ready');
        } catch {
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        if (enabled && status === 'idle') load(0);
    }, [enabled, status, load]);

    return { posts, total, status, loadMore: () => load(posts.length) };
}

/**
 * "Post" bubble fixed in the corner. Clicking it grows a full-screen panel out of the bubble;
 * the feed scrolls inside the panel. #posts in the URL opens it directly.
 */
export default function Posts({ open, onOpenChange }) {
    const { lang, t } = useLanguage();
    const bubbleRef = useRef(null);
    const closeRef = useRef(null);
    const [mounted, setMounted] = useState(false); // panel in the DOM
    const [expanded, setExpanded] = useState(false); // circle fully grown
    const [origin, setOrigin] = useState({ x: 48, y: 48 });
    const feed = usePostsFeed(mounted);

    // The panel grows from the centre of the bubble
    useEffect(() => {
        if (!open) return undefined;
        const rect = bubbleRef.current?.getBoundingClientRect();
        if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setMounted(true);
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        const frame = requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
        const focus = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), ANIM_MS);
        return () => { cancelAnimationFrame(frame); clearTimeout(focus); };
    }, [open]);

    useEffect(() => {
        if (open || !mounted) return undefined;
        setExpanded(false);
        const timer = setTimeout(() => {
            setMounted(false);
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
            bubbleRef.current?.focus({ preventScroll: true });
        }, ANIM_MS);
        return () => clearTimeout(timer);
    }, [open, mounted]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onOpenChange(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onOpenChange]);

    const panelStyle = {
        clipPath: `circle(${expanded ? '150%' : '0px'} at ${origin.x}px ${origin.y}px)`,
    };

    return (
        <>
            <button
                ref={bubbleRef}
                type="button"
                className={`posts-bubble${open ? ' is-open' : ''}`}
                onClick={() => onOpenChange(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                {t('posts-title')}
            </button>

            {mounted && createPortal(
                <div className="posts-panel" style={panelStyle} role="dialog" aria-modal="true" aria-labelledby="posts-panel-title">
                    <header className="posts-panel-header">
                        <h2 id="posts-panel-title">{t('posts-title')}</h2>
                        <button ref={closeRef} type="button" className="posts-panel-close" aria-label={t('modal-close')}
                            onClick={() => onOpenChange(false)}>&times;</button>
                    </header>

                    <div className="posts-panel-scroll">
                        <div className="posts-panel-inner">
                            {feed.posts.length > 0 && (
                                <div className="posts-feed">
                                    {feed.posts.map(post => <PostCard key={post.id} post={post} lang={lang} />)}
                                </div>
                            )}
                            {feed.status === 'ready' && feed.posts.length === 0 && <p className="posts-message">{t('posts-empty')}</p>}
                            {feed.status === 'error' && <p className="posts-message">{t('posts-error')}</p>}
                            {feed.status === 'loading' && <p className="posts-message">{t('posts-loading')}</p>}
                            {feed.status === 'ready' && feed.posts.length < feed.total && (
                                <div className="posts-more">
                                    <button className="btn btn-secondary" onClick={feed.loadMore}>{t('posts-more')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
