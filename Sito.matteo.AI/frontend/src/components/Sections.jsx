import { useLanguage } from '../i18n/LanguageContext.jsx';

// Numbered editorial section: small mono label on the left, content on the right
export function Section({ id, num, label, title, children }) {
    return (
        <section id={id} className="page">
            <div className="section reveal">
                <div className="section-label mono">
                    <span className="num">{num}</span>
                    <span>{label}</span>
                </div>
                <div>
                    {title && <h2 className="section-title">{title}</h2>}
                    {children}
                </div>
            </div>
        </section>
    );
}

function InlineList({ items }) {
    return <ul className="inline-list">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

export function Experience() {
    const { t } = useLanguage();
    const stack = ['C# / .NET 10', 'SQL Server', t('exp-stack-framework'), 'SaaS', t('exp-stack-erp'),
        t('exp-stack-automation'), t('exp-stack-integration'), t('exp-stack-kpi')];
    return (
        <Section id="experience" num="01" label={t('nav-experience')} title={t('sec-exp-title')}>
            <article className="entry">
                <div className="entry-head">
                    <h3 className="entry-title">{t('exp-job-title')}</h3>
                    <span className="mono">{t('exp-year')}</span>
                </div>
                <p className="entry-org">
                    <a href="https://www.metline.it/" target="_blank" rel="noopener noreferrer">{t('exp-company')}</a>
                </p>
                <p className="entry-body">{t('exp-desc')}</p>
                <InlineList items={stack} />
            </article>
        </Section>
    );
}

const ITS_URL = 'https://itsdigitalacademy.com/corsi/artificial-intelligence-developer-and-data-analyst/';

export function Education() {
    const { t } = useLanguage();
    return (
        <Section id="education" num="03" label={t('nav-education')} title={t('sec-edu-title')}>
            <article className="entry">
                <div className="entry-head">
                    <h3 className="entry-title">{t('edu-course-name')}</h3>
                    <span className="mono">{t('edu-year')}</span>
                </div>
                <p className="entry-org">
                    <a href={ITS_URL} target="_blank" rel="noopener noreferrer">ITS Digital Academy "Mario Volpato"</a>
                    {' · '}{t('edu-course-desc')}
                </p>
                <p className="entry-body">{t('edu-desc')}</p>
                <InlineList items={['edu-s1', 'edu-s2', 'edu-s3', 'edu-s4', 'edu-s5'].map(k => t(k))} />
            </article>
        </Section>
    );
}

export function Skills() {
    const { t } = useLanguage();
    const rows = [
        ['skill-title-7', 'C#, Python, SQL, JavaScript, HTML/CSS'],
        ['skill-title-6', t('skill-desc-6')],
        ['skill-title-5', t('skill-desc-5')],
        ['skill-title-2', 'SQL Server, MySQL, PostgreSQL'],
        ['skill-title-3', 'Scikit-learn, Custom MCP, Groq'],
        ['skill-title-1', 'Excel, Pandas, NumPy, Matplotlib, Seaborn'],
        ['skill-title-8', 'Docker, Git, GitHub Actions, Linux'],
        ['skill-title-9', t('skill-desc-9')],
    ];
    return (
        <Section id="skills" num="04" label={t('nav-skills')} title={t('sec-skills-title')}>
            <dl className="rows">
                {rows.map(([title, desc]) => (
                    <div className="row" key={title}>
                        <dt>{t(title)}</dt>
                        <dd>{desc}</dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}

export function Certifications() {
    const { t } = useLanguage();
    const certs = [
        { href: 'https://www.freecodecamp.org/certification/matteobertotti/python-v9', title: t('cert-python'), by: 'freeCodeCamp' },
        { href: 'https://www.freecodecamp.org/certification/matteoabertotti/b1-english-for-developers', title: t('cert-english'), by: 'freeCodeCamp' },
        { href: 'https://drive.google.com/file/d/13baesGKJVsgItFjrQHkbN5cpqRbEWIVy/view?usp=drive_link', title: 'MySQL & SQL Server', by: 'Accademia Domani' },
        { href: 'https://drive.google.com/file/d/1375i4mOVR4xKB-bPOvNDxXHlDB0153bw/view?usp=sharing', title: t('cert-excel'), by: 'Accademia Domani' },
    ];
    return (
        <Section id="certifications" num="05" label={t('certs-title')}>
            <ul className="link-rows">
                {certs.map(c => (
                    <li key={c.href}>
                        <a href={c.href} target="_blank" rel="noopener noreferrer">
                            <span>{c.title} <span className="mono">· {c.by}</span></span>
                            <span className="arrow" aria-hidden="true">↗</span>
                        </a>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

export function Contact() {
    const { t } = useLanguage();
    return (
        <Section id="contact" num="06" label={t('contact-title')}>
            <p className="contact-lead">{t('contact-lead')}</p>
            <a className="contact-email" href="mailto:matteobertotti@icloud.com?subject=Ciao%20Matteo!">matteobertotti@icloud.com</a>
            <div className="contact-links">
                <a className="arrow-link" href="https://www.linkedin.com/in/matteo-augustinho-bertotti/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
                <a className="arrow-link" href="https://github.com/Matteo019" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                <a className="arrow-link" href="tel:+393921831641">+39 392 183 1641</a>
            </div>
        </Section>
    );
}
