import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useLanguage } from '../../i18n/LanguageContext.jsx';
import ProjectSheet from './ProjectSheet.jsx';

// Chart.js only loads when someone opens the notebook
const Notebook = lazy(() => import('./Notebook.jsx'));

const CLOSE_MS = 350;
const IFRAME_TIMEOUT_MS = 20000;
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function LiveFrame({ project }) {
    const { t } = useLanguage();
    const [state, setState] = useState('loading'); // loading | ready | error

    useEffect(() => {
        const timer = setTimeout(() => setState(s => (s === 'loading' ? 'error' : s)), IFRAME_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className={`modal-loading${state !== 'loading' ? ' hidden' : ''}`}>
                <div className="modal-spinner"></div>
                <p>{t('modal-loading')}</p>
            </div>
            <div className="modal-error" hidden={state !== 'error'}>
                <div className="modal-error-icon">🚀</div>
                <h4>{t('modal-timeout-title')}</h4>
                <p>{t('modal-timeout-desc')}</p>
            </div>
            <iframe
                src={project.url}
                title={project.title}
                style={{ display: state === 'error' ? 'none' : 'block' }}
                onLoad={() => setState('ready')}
                onError={() => setState('error')}
            />
        </>
    );
}

export default function ProjectModal({ project, onClosed }) {
    const [visible, setVisible] = useState(false);
    const overlayRef = useRef(null);
    const closeRef = useRef(null);

    const isSheet = project && (project.type === 'info' || project.type === 'deploying');

    const close = useCallback(() => {
        setVisible(false);
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            document.body.style.overflow = '';
            onClosed();
        }, CLOSE_MS);
    }, [onClosed]);

    // Open: show the overlay, then add .active on the next frame so the CSS transition runs
    useEffect(() => {
        if (!project) return undefined;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        const frame = requestAnimationFrame(() => setVisible(true));
        const focus = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
        return () => { cancelAnimationFrame(frame); clearTimeout(focus); };
    }, [project]);

    // Escape closes, Tab stays inside the dialog
    useEffect(() => {
        if (!visible) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') { close(); return; }
            if (e.key !== 'Tab') return;
            const items = [...overlayRef.current.querySelectorAll(FOCUSABLE)]
                .filter(el => !el.hasAttribute('hidden') && el.getClientRects().length > 0);
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [visible, close]);

    if (!project) return null;

    // Portal to <body>: a transformed ancestor would break position: fixed
    return createPortal(
        <div
            className={`modal-overlay${visible ? ' active' : ''}`}
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={isSheet ? 'sheet-title' : 'modal-title'}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
            <div className={`modal-container${isSheet ? ' modal--sheet' : ''}`}>
                <div className="modal-header">
                    <div className="modal-address-bar">{project.url || 'local://notebook'}</div>
                    <h3 className="modal-title" id="modal-title">{project.title}</h3>
                    {project.type === 'iframe' && (
                        <a className="modal-external-btn" href={project.url} target="_blank" rel="noopener noreferrer"
                            aria-label="Apri in una nuova scheda" title="Apri in una nuova scheda">&#8599;</a>
                    )}
                    <button className="modal-close-btn" ref={closeRef} aria-label="Chiudi" onClick={close}>&times;</button>
                </div>
                <div className="modal-body">
                    {project.type === 'iframe' && <LiveFrame project={project} />}
                    {project.type === 'notebook' && <Suspense fallback={null}><Notebook onFinish={close} /></Suspense>}
                    {isSheet && <ProjectSheet project={project} onClose={close} />}
                </div>
            </div>
        </div>,
        document.body
    );
}
