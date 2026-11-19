import { useLanguage } from '../../i18n/LanguageContext.jsx';

// Compact "project sheet": title, status, details, tags, actions
export default function ProjectSheet({ project, onClose }) {
    const { t } = useLanguage();
    const status = project.type === 'deploying' ? 'soon' : (project.status || 'desktop');
    const prefix = project.sheet;

    return (
        <div className="project-sheet">
            <div className="sheet-body">
                <div className="sheet-head">
                    <h3 id="sheet-title">{t(project.titleKey)}</h3>
                    <span className={`sheet-status is-${status}`}>{t(`sheet-status-${status}`)}</span>
                </div>

                {prefix ? (
                    <>
                        <p className="sheet-lead">{t(`${prefix}-lead`)}</p>
                        <h4 className="sheet-subtitle">{t(`${prefix}-features-title`)}</h4>
                        <ul className="sheet-features">
                            {[1, 2, 3, 4, 5].map(n => <li key={n}>{t(`${prefix}-f${n}`)}</li>)}
                        </ul>
                        {project.figure && (
                            <figure className="sheet-figure">
                                <img {...project.figure} loading="lazy" />
                                <figcaption>{t(`${prefix}-figure`)}</figcaption>
                            </figure>
                        )}
                        <p className="sheet-note">{t(`${prefix}-note`)}</p>
                    </>
                ) : (
                    <>
                        <p className="sheet-lead">{t(project.descKey)}</p>
                        {project.type === 'deploying' && <p className="sheet-note">{t('sheet-soon-note')}</p>}
                    </>
                )}

                <div className="project-tags sheet-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>

                <div className="sheet-actions">
                    {project.type === 'info' && project.url && (
                        <a className="btn btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">{t('sheet-github')}</a>
                    )}
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{t('modal-close')}</button>
                </div>
            </div>
        </div>
    );
}
