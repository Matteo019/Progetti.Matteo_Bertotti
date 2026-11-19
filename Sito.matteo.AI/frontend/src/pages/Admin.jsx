import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, imageUrl } from '../api.js';
import { formatDate, PostBody } from '../components/posts/PostCard.jsx';
import { usePageMeta } from '../seo.js';

const EMPTY = { id: null, body: '', image: null, published: false, date: '' };

// <input type="date"> works with YYYY-MM-DD in local time; posts get noon of that day
const toDateInput = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fromDateInput = (value) => (value ? new Date(`${value}T12:00:00`).toISOString() : null);
const BODY_MAX = 5000;

function Login({ onLogged }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            await api.login(username, password);
            onLogged();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <form className="admin-card admin-login" onSubmit={submit}>
            <h1>Area riservata</h1>
            <label>Utente
                <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />
            </label>
            <label>Password
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            </label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Accesso...' : 'Accedi'}</button>
        </form>
    );
}

function Editor({ draft, setDraft, onSaved, onCancel }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const upload = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setBusy(true);
        setError('');
        try {
            const { image } = await api.uploadImage(file);
            setDraft(d => ({ ...d, image }));
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const save = async (published) => {
        setBusy(true);
        setError('');
        const payload = { body: draft.body, image: draft.image, published, created_at: fromDateInput(draft.date) };
        try {
            if (draft.id) await api.updatePost(draft.id, payload);
            else await api.createPost(payload);
            onSaved();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="admin-card">
            <h2>{draft.id ? 'Modifica post' : 'Nuovo post'}</h2>
            <div className="admin-editor">
                <label className="admin-field">Testo (Markdown)
                    <textarea
                        value={draft.body}
                        maxLength={BODY_MAX}
                        rows={12}
                        placeholder={'Scrivi il post...\n\n**grassetto**, *corsivo*, [link](https://...), elenchi con -'}
                        onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                    />
                    <span className="admin-counter">{draft.body.length} / {BODY_MAX}</span>
                </label>
                <div className="admin-preview">
                    <span className="admin-label">Anteprima</span>
                    <article className="post-card">
                        {draft.body.trim() ? <PostBody body={draft.body} /> : <p className="posts-message">Niente da mostrare</p>}
                        {draft.image && <img className="post-image" src={imageUrl(draft.image)} alt="" />}
                    </article>
                </div>
            </div>

            <label className="admin-field admin-date">Data (vuota = oggi)
                <input type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
            </label>

            <div className="admin-image-row">
                <label className="btn btn-secondary admin-upload">
                    {draft.image ? 'Cambia immagine' : 'Aggiungi immagine'}
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} hidden />
                </label>
                {draft.image && (
                    <button type="button" className="admin-link" onClick={() => setDraft(d => ({ ...d, image: null }))}>Rimuovi immagine</button>
                )}
            </div>

            {error && <p className="admin-error" role="alert">{error}</p>}

            <div className="admin-actions">
                <button className="btn btn-primary" disabled={busy || !draft.body.trim()} onClick={() => save(true)}>Pubblica</button>
                <button className="btn btn-secondary" disabled={busy || !draft.body.trim()} onClick={() => save(false)}>Salva bozza</button>
                <button type="button" className="admin-link" onClick={onCancel}>Annulla</button>
            </div>
        </div>
    );
}

function PostList({ posts, onEdit, onDelete }) {
    if (!posts.length) return <p className="posts-message">Nessun post: scrivi il primo.</p>;
    return (
        <ul className="admin-list">
            {posts.map(p => (
                <li key={p.id} className="admin-card admin-row">
                    <div className="admin-row-text">
                        <span className={`admin-badge${p.published ? ' is-live' : ''}`}>{p.published ? 'Pubblicato' : 'Bozza'}</span>
                        <time>{formatDate(p.created_at, 'it')}</time>
                        <p>{p.body.length > 140 ? `${p.body.slice(0, 140)}…` : p.body}</p>
                    </div>
                    <div className="admin-row-actions">
                        <button className="admin-link" onClick={() => onEdit(p)}>Modifica</button>
                        <button className="admin-link is-danger" onClick={() => onDelete(p)}>Elimina</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function Inbox({ messages, onToggle, onDelete }) {
    if (!messages.length) return <p className="posts-message">Nessun messaggio.</p>;
    return (
        <ul className="admin-list">
            {messages.map(m => (
                <li key={m.id} className={`admin-card admin-message${m.read ? '' : ' is-unread'}`}>
                    <div className="admin-message-head">
                        <div>
                            <p className="admin-message-from">{m.name}</p>
                            <a className="admin-link" href={`mailto:${m.email}`}>{m.email}</a>
                        </div>
                        <time>{formatDate(m.created_at, 'it')}</time>
                    </div>
                    <p className="admin-message-text">{m.message}</p>
                    <div className="admin-row-actions">
                        <a className="admin-link" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: il tuo messaggio')}`}>Rispondi</a>
                        <button className="admin-link" onClick={() => onToggle(m)}>{m.read ? 'Segna come non letto' : 'Segna come letto'}</button>
                        <button className="admin-link is-danger" onClick={() => onDelete(m)}>Elimina</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function Admin() {
    usePageMeta({ title: 'Admin | Matteo Augustinho Bertotti', path: '/admin', noindex: true });

    const [auth, setAuth] = useState('checking'); // checking | out | in
    const [posts, setPosts] = useState([]);
    const [draft, setDraft] = useState(null);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('posts'); // posts | messages
    const [inbox, setInbox] = useState({ items: [], unread: 0 });

    const loadPosts = useCallback(async () => {
        try {
            setPosts((await api.allPosts()).items);
        } catch (err) {
            if (err.status === 401) setAuth('out');
            else setError(err.message);
        }
    }, []);

    useEffect(() => {
        api.me().then(() => setAuth('in')).catch(() => setAuth('out'));
    }, []);

    const loadInbox = useCallback(async () => {
        try {
            setInbox(await api.messages());
        } catch (err) {
            if (err.status === 401) setAuth('out');
            else setError(err.message);
        }
    }, []);

    useEffect(() => {
        if (auth === 'in') { loadPosts(); loadInbox(); }
    }, [auth, loadPosts, loadInbox]);

    const toggleRead = async (m) => {
        try { await api.markMessage(m.id, !m.read); loadInbox(); } catch (err) { setError(err.message); }
    };

    const removeMessage = async (m) => {
        if (!window.confirm(`Eliminare il messaggio di ${m.name}? Non si può annullare.`)) return;
        try { await api.deleteMessage(m.id); loadInbox(); } catch (err) { setError(err.message); }
    };

    const remove = async (post) => {
        if (!window.confirm('Eliminare questo post? Non si può annullare.')) return;
        try {
            await api.deletePost(post.id);
            loadPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    const logout = async () => {
        await api.logout().catch(() => {});
        setAuth('out');
        setPosts([]);
        setDraft(null);
    };

    return (
        <main className="admin-page">
            <header className="admin-top">
                <Link to="/" className="site-name is-full">Matteo Bertotti</Link>
                {auth === 'in' && <button className="admin-link" onClick={logout}>Esci</button>}
            </header>

            {auth === 'checking' && <p className="posts-message">Caricamento...</p>}
            {auth === 'out' && <Login onLogged={() => setAuth('in')} />}

            {auth === 'in' && (
                <>
                    {error && <p className="admin-error" role="alert">{error}</p>}
                    {!draft && (
                        <nav className="admin-tabs">
                            <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Post</button>
                            <button className={tab === 'messages' ? 'active' : ''} onClick={() => { setTab('messages'); loadInbox(); }}>
                                Messaggi{inbox.unread > 0 && <span className="admin-count">{inbox.unread}</span>}
                            </button>
                        </nav>
                    )}
                    {tab === 'messages' && !draft ? (
                        <>
                            <div className="admin-heading"><h1>Messaggi</h1></div>
                            <Inbox messages={inbox.items} onToggle={toggleRead} onDelete={removeMessage} />
                        </>
                    ) : draft ? (
                        <Editor
                            draft={draft}
                            setDraft={setDraft}
                            onSaved={() => { setDraft(null); loadPosts(); }}
                            onCancel={() => setDraft(null)}
                        />
                    ) : (
                        <>
                            <div className="admin-heading">
                                <h1>I miei post</h1>
                                <button className="btn btn-primary" onClick={() => setDraft(EMPTY)}>Nuovo post</button>
                            </div>
                            <PostList posts={posts} onEdit={(p) => setDraft({ ...p, date: toDateInput(p.created_at) })} onDelete={remove} />
                        </>
                    )}
                </>
            )}
        </main>
    );
}
