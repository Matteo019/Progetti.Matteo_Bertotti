import { useState } from 'react';

import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Section } from '../Sections.jsx';
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
        <>
            <Section id="projects" num="02" label={t('nav-projects')} title={t('sec-work-title')} tone="sage">
                <div className="work-list">
                    {projects.map((p, i) => (
                        <article
                            key={p.id}
                            className="work-item"
                            tabIndex={0}
                            role="button"
                            aria-label={p.title}
                            onClick={() => setActive(p)}
                            onKeyDown={(e) => openOnKey(e, p)}
                        >
                            <span className="work-num mono">{String(i + 1).padStart(2, '0')}</span>
                            <div className="work-main">
                                <h3 className="work-title">{t(p.titleKey)} <span className="arrow" aria-hidden="true">↗</span></h3>
                                <p className="work-desc">{t(p.descKey)}</p>
                            </div>
                            <span className="work-tags mono">{p.tags.slice(0, 3).join(' · ')}</span>
                        </article>
                    ))}
                </div>
            </Section>
            <ProjectModal project={active} onClosed={() => setActive(null)} />
        </>
    );
}
