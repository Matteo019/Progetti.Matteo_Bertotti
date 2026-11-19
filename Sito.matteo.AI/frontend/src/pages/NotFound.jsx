import { Link } from 'react-router-dom';

import { usePageMeta } from '../seo.js';

// nginx already answers unknown paths with HTTP 404; this is what the visitor sees
export default function NotFound() {
    usePageMeta({ title: 'Pagina non trovata | Matteo Augustinho Bertotti', path: '/', noindex: true });
    return (
        <main className="not-found">
            <p className="not-found-code">404</p>
            <h1>Pagina non trovata</h1>
            <Link to="/" className="btn btn-primary">Torna alla Home</Link>
        </main>
    );
}
