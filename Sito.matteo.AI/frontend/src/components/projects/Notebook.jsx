import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

import { useLanguage } from '../../i18n/LanguageContext.jsx';

// Minimal Python highlighter: escapes HTML first, then wraps tokens in spans
function highlightPython(code) {
    const keywords = ['import', 'from', 'as', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None'];
    const builtins = ['print', 'len', 'range', 'list', 'dict', 'set', 'str', 'int', 'float'];
    let out = code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|#.*)/g, m =>
            m.startsWith('#') ? `<span class="nb-comment">${m}</span>` : `<span class="nb-string">${m}</span>`)
        .replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="nb-number">$1</span>');
    out = out.replace(new RegExp(`\\b(${keywords.join('|')})\\b(?![^<]*>)`, 'g'), '<span class="nb-keyword">$1</span>');
    out = out.replace(new RegExp(`\\b(${builtins.join('|')})\\b(?=\\()(?![^<]*>)`, 'g'), '<span class="nb-builtin">$1</span>');
    return out;
}

function ChartOutput({ config }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const chart = new Chart(canvasRef.current, {
            ...config,
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
        });
        return () => chart.destroy();
    }, [config]);
    return <div className="notebook-chart-container"><canvas ref={canvasRef} /></div>;
}

function StepOutput({ step }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShown(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Click on a chart image zooms it
    const toggleZoom = (e) => {
        if (e.target.tagName === 'IMG') e.target.classList.toggle('zoomed');
    };

    const className = `notebook-output-content ${step.outputType}-output${shown ? ' visible' : ''}`;
    if (step.outputType === 'text') return <div className={className}>{step.outputContent}</div>;
    if (step.outputType === 'chart' && step.chartConfig) {
        return <div className={className}><ChartOutput config={step.chartConfig} /></div>;
    }
    // Table/HTML output comes from my own static notebook-steps.json
    return <div className={className} onClick={toggleZoom} dangerouslySetInnerHTML={{ __html: step.outputContent }} />;
}

export default function Notebook({ onFinish }) {
    const { lang, t } = useLanguage();
    const [data, setData] = useState(null);
    const [failed, setFailed] = useState(false);
    const [current, setCurrent] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const contentRef = useRef(null);
    const outputRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/notebook-steps.json')
            .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
            .then(json => { if (!cancelled) setData(json); })
            .catch(() => { if (!cancelled) setFailed(true); });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
    }, [current]);

    useEffect(() => {
        if (revealed && window.matchMedia('(max-width: 768px)').matches) {
            outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [revealed, current]);

    if (failed) {
        return (
            <div className="modal-error">
                <div className="modal-error-icon">🚀</div>
                <h4>{t('modal-timeout-title')}</h4>
                <p>{t('modal-timeout-desc')}</p>
            </div>
        );
    }
    if (!data) {
        return (
            <div className="modal-loading">
                <div className="modal-spinner"></div>
                <p>{t('modal-loading')}</p>
            </div>
        );
    }

    const steps = data.steps;
    const step = steps[current];
    const isIt = lang === 'it';
    const isLast = current === steps.length - 1;
    const progress = ((current + (revealed ? 1 : 0)) / steps.length) * 100;

    const run = () => {
        if (!revealed) setRevealed(true);
        else if (!isLast) { setCurrent(c => c + 1); setRevealed(false); }
        else onFinish();
    };
    const prev = () => {
        if (current === 0) return;
        setCurrent(c => c - 1);
        setRevealed(true);
    };

    return (
        <div className="notebook-layout">
            <div className="notebook-header">
                <div className="notebook-step-info">
                    <span className="notebook-step-counter">
                        {t('notebook-step-of').replace('{n}', current + 1).replace('{total}', steps.length)}
                    </span>
                    <span className="notebook-step-title">{isIt ? step.title_it : step.title_en}</span>
                </div>
            </div>
            <div className="notebook-progress">
                <div className="notebook-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="notebook-content" ref={contentRef}>
                <div className="notebook-step-desc">{isIt ? step.description_it : step.description_en}</div>
                <div className="notebook-code-panel">
                    <pre className="language-python" dangerouslySetInnerHTML={{ __html: highlightPython(step.code) }} />
                </div>
                <div className="notebook-output-panel" ref={outputRef}>
                    {revealed ? (
                        <StepOutput key={current} step={step} />
                    ) : (
                        <div className="notebook-output-placeholder">
                            <div className="placeholder-icon">⚙️</div>
                            <p>{t('notebook-run')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="notebook-controls">
                <div className="notebook-dots">
                    {steps.map((_, i) => (
                        <span key={i} className={`step-dot${i < current ? ' completed' : ''}${i === current ? ' active' : ''}`} />
                    ))}
                </div>
                <div className="notebook-nav-btns">
                    <button className="nb-btn nb-btn-secondary" disabled={current === 0} onClick={prev}>{t('notebook-prev')}</button>
                    <button className="nb-btn nb-btn-primary" onClick={run}>
                        {!revealed ? t('notebook-run') : isLast ? '✓' : t('notebook-next')}
                    </button>
                </div>
            </div>
        </div>
    );
}
