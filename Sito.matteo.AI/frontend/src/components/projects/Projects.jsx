import { useState } from 'react';

import { useLanguage } from '../../i18n/LanguageContext.jsx';
import SectionTitle from '../SectionTitle.jsx';
import ProjectModal from './ProjectModal.jsx';
import projects from './projectsData.js';

export default function Projects() {
    const { t } = useLanguage();
    const [active, setActive] = useState(null);

    const openOnKey = (e, project) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActive(project);
        }
    };

    return (
        <section id="projects" className="section">
            <div className="container">
                <SectionTitle>{t('projects-title')}</SectionTitle>
                <div className="projects-grid">
                    {projects.map(p => (
                        <article
                            key={p.id}
                            className="project-card"
                            tabIndex={0}
                            role="button"
                            aria-label={p.title}
                            onClick={() => setActive(p)}
                            onKeyDown={(e) => openOnKey(e, p)}
                        >
                            <div className="project-card-image">
                                <img {...p.img} loading="lazy" />
                                <div className="project-card-overlay"><span>{t(p.overlayKey)}</span></div>
                            </div>
                            <div className="project-card-body">
                                <h3>{t(p.titleKey)}</h3>
                                <p>{t(p.descKey)}</p>
                                <div className="project-tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <ProjectModal project={active} onClosed={() => setActive(null)} />
        </section>
    );
}
