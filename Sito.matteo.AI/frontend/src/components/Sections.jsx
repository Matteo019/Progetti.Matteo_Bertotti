import { useLanguage } from '../i18n/LanguageContext.jsx';
import SectionTitle from './SectionTitle.jsx';

const MARQUEE = ['AI & SOFTWARE DEVELOPER', 'MULTI-AGENT SYSTEMS', 'C# .NET & PYTHON', 'BACKEND & API', 'PROBLEM SOLVER'];

export function Marquee() {
    // Rendered twice for a seamless loop
    const content = (hidden) => (
        <div className="marquee-content" aria-hidden={hidden || undefined}>
            {MARQUEE.flatMap(word => [<span key={word}>{word}</span>, <span key={`${word}-sep`} className="separator">•</span>])}
        </div>
    );
    return <div className="marquee-container">{content(false)}{content(true)}</div>;
}

export function About() {
    const { t, html } = useLanguage();
    return (
        <section id="about" className="section">
            <div className="container">
                <SectionTitle>{t('about-title')}</SectionTitle>
                <div className="about-content">
                    <p dangerouslySetInnerHTML={html('about-text')} />
                </div>
            </div>
        </section>
    );
}

const descStyle = { color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' };

export function Experience() {
    const { t } = useLanguage();
    const stack = ['C# / .NET 10', 'SQL Server', t('exp-stack-framework'), 'SaaS', t('exp-stack-erp'),
        t('exp-stack-automation'), t('exp-stack-integration'), t('exp-stack-kpi')];
    return (
        <section id="experience" className="section">
            <div className="container">
                <SectionTitle>{t('experience-title')}</SectionTitle>
                <div className="education-card">
                    <div className="edu-header">
                        <a href="https://www.metline.it/" target="_blank" rel="noopener noreferrer" className="edu-logo-wrapper">
                            <img src="/images/metline_logo.png" alt="Metline Logo" className="edu-logo-img" />
                        </a>
                        <div className="edu-info">
                            <h3><a href="https://www.metline.it/" target="_blank" rel="noopener noreferrer" className="edu-link">{t('exp-job-title')}</a></h3>
                            <p className="edu-course">{t('exp-company')}</p>
                            <p className="edu-year">{t('exp-year')}</p>
                        </div>
                    </div>
                    <div className="edu-skills"><p style={descStyle}>{t('exp-desc')}</p></div>
                    <div className="edu-skills">
                        <h4>{t('exp-stack-title')}</h4>
                        <ul className="skill-tags">{stack.map(s => <li key={s}>{s}</li>)}</ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

const ITS_URL = 'https://itsdigitalacademy.com/corsi/artificial-intelligence-developer-and-data-analyst/';

export function Education() {
    const { t } = useLanguage();
    return (
        <section id="education" className="section">
            <div className="container">
                <SectionTitle>{t('education-title')}</SectionTitle>
                <div className="education-card">
                    <div className="edu-header">
                        <a href={ITS_URL} target="_blank" rel="noopener noreferrer" className="edu-logo-wrapper">
                            <img src="/images/its_logo.png" alt="ITS Digital Academy Logo" className="edu-logo-img" />
                        </a>
                        <div className="edu-info">
                            <h3><a href={ITS_URL} target="_blank" rel="noopener noreferrer" className="edu-link">{t('edu-course-name')}</a></h3>
                            <p className="edu-course">{t('edu-course-desc')}</p>
                            <p className="edu-year">{t('edu-year')}</p>
                        </div>
                    </div>
                    <div className="edu-skills"><p style={descStyle}>{t('edu-desc')}</p></div>
                    <div className="edu-skills">
                        <h4>{t('edu-skills-title')}</h4>
                        <ul className="skill-tags">
                            {['edu-s1', 'edu-s2', 'edu-s3', 'edu-s4', 'edu-s5'].map(k => <li key={k}>{t(k)}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Skills() {
    const { t } = useLanguage();
    const cards = [
        ['skill-title-1', 'Excel, Pandas, NumPy'],
        ['skill-title-2', 'SQL Server, MySQL, PostgreSQL, SQL'],
        ['skill-title-3', 'Scikit-learn, Custom MCP, Groq'],
        ['skill-title-4', 'Matplotlib, Seaborn'],
        ['skill-title-5', t('skill-desc-5')],
        ['skill-title-6', t('skill-desc-6')],
        ['skill-title-7', 'C#, Python, SQL, JavaScript, HTML/CSS'],
        ['skill-title-8', 'Docker, Git, GitHub Actions, Linux'],
        ['skill-title-9', t('skill-desc-9')],
    ];
    return (
        <section id="skills" className="section">
            <div className="container">
                <SectionTitle>{t('skills-title')}</SectionTitle>
                <div className="skills-grid">
                    {cards.map(([title, desc]) => (
                        <div className="skill-card" key={title}>
                            <h3>{t(title)}</h3>
                            <p>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function UkFlag() {
    return (
        <div className="cert-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="1em" height="0.5em" style={{ borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </svg>
        </div>
    );
}

export function Certifications() {
    const { t } = useLanguage();
    const certs = [
        { href: 'https://drive.google.com/file/d/13baesGKJVsgItFjrQHkbN5cpqRbEWIVy/view?usp=drive_link', icon: '📜', title: 'MySQL & SQL Server' },
        { href: 'https://www.freecodecamp.org/certification/matteobertotti/python-v9', icon: '🐍', title: t('cert-python') },
        { href: 'https://drive.google.com/file/d/1375i4mOVR4xKB-bPOvNDxXHlDB0153bw/view?usp=sharing', icon: '📊', title: t('cert-excel') },
        { href: 'https://www.freecodecamp.org/certification/matteoabertotti/b1-english-for-developers', icon: <UkFlag />, title: t('cert-english') },
    ];
    return (
        <section id="certifications" className="section">
            <div className="container">
                <SectionTitle split={false}>{t('certs-title')}</SectionTitle>
                <div className="cert-grid">
                    {certs.map(c => (
                        <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className="cert-card">
                            {typeof c.icon === 'string' ? <div className="cert-icon">{c.icon}</div> : c.icon}
                            <h3>{c.title}</h3>
                            <p>{t('cert-view')}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GithubIcon() {
    return (
        <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
    );
}

export function Contact() {
    const { t } = useLanguage();
    return (
        <section id="contact" className="section">
            <div className="container">
                <SectionTitle>{t('contact-title')}</SectionTitle>
                <div className="contact-cards">
                    <a href="mailto:matteobertotti@icloud.com?subject=Ciao%20Matteo!" className="contact-card">
                        <span className="icon">&#9993;</span>
                        <span>matteobertotti@icloud.com</span>
                    </a>
                    <a href="tel:+393921831641" className="contact-card">
                        <span className="icon">&#9742;</span>
                        <span>+39 392 183 1641</span>
                    </a>
                    <a href="https://www.linkedin.com/in/matteo-augustinho-bertotti/" target="_blank" rel="noopener noreferrer" className="contact-card">
                        <span className="icon">in</span>
                        <span>LinkedIn Profile</span>
                    </a>
                    <a href="https://github.com/Matteo019" target="_blank" rel="noopener noreferrer" className="contact-card">
                        <span className="icon"><GithubIcon /></span>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
