import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { imageUrl } from '../../api.js';

// Markdown is rendered without raw HTML; links open in a new tab.
// Images belong in the post's own image field, so inline ones are not rendered.
const components = {
    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

export function PostBody({ body }) {
    return (
        <div className="post-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} disallowedElements={['img']} unwrapDisallowed>
                {body}
            </ReactMarkdown>
        </div>
    );
}

export function formatDate(iso, lang) {
    return new Date(iso).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function PostCard({ post, lang }) {
    return (
        <article className="post-card">
            <header className="post-header">
                <img className="post-avatar" src="/images/profile.webp" alt="" width="40" height="40" />
                <div>
                    <p className="post-author">Matteo Augustinho Bertotti</p>
                    <time className="post-date" dateTime={post.created_at}>{formatDate(post.created_at, lang)}</time>
                </div>
            </header>
            <PostBody body={post.body} />
            {post.image && (
                <img className="post-image" src={imageUrl(post.image)} alt="" loading="lazy" />
            )}
        </article>
    );
}
