import { useCallback, useEffect, useState } from 'react';

import { api } from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import SectionTitle from '../SectionTitle.jsx';
import PostCard from './PostCard.jsx';

const PAGE = 6;

export default function Posts() {
    const { lang, t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('loading'); // loading | ready | error

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

    useEffect(() => { load(0); }, [load]);

    return (
        <section id="posts" className="section">
            <div className="container">
                <SectionTitle>{t('posts-title')}</SectionTitle>

                {posts.length > 0 && (
                    <div className="posts-feed">
                        {posts.map(post => <PostCard key={post.id} post={post} lang={lang} />)}
                    </div>
                )}

                {status === 'ready' && posts.length === 0 && <p className="posts-message">{t('posts-empty')}</p>}
                {status === 'error' && <p className="posts-message">{t('posts-error')}</p>}
                {status === 'loading' && <p className="posts-message">{t('posts-loading')}</p>}

                {status === 'ready' && posts.length < total && (
                    <div className="posts-more">
                        <button className="btn btn-secondary" onClick={() => load(posts.length)}>{t('posts-more')}</button>
                    </div>
                )}
            </div>
        </section>
    );
}
