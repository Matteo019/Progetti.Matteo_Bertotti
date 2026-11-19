import { useLanguage } from '../i18n/LanguageContext.jsx';

export const CV_URL = '/images/CV_MatteoBertotti_AI-SoftwareDeveloper_Verona.pdf';

export default function Hero() {
    const { t, html } = useLanguage();

    return (
        <section className="hero" id="top">
            <div className="page hero-grid">
                <div>
                    <p className="mono hero-kicker fade-in">{t('hero-kicker')}</p>
                    <h1 className="hero-name fade-in delay-1">
                        Matteo<br /><em>Augustinho</em><br />Bertotti
                    </h1>
                    <p className="hero-lead fade-in delay-2" dangerouslySetInnerHTML={html('hero-lead')} />
                    <div className="hero-actions fade-in delay-3">
                        <a href={CV_URL} className="arrow-link" download>{t('hero-cv')} <span aria-hidden="true">↓</span></a>
                        <a href="#projects" className="arrow-link">{t('hero-work')} <span aria-hidden="true">→</span></a>
                    </div>
                </div>

                <figure className="hero-photo fade-in delay-2">
                    <img src="/images/profile.webp" alt="Matteo Augustinho Bertotti" width="864" height="980" fetchPriority="high" />
                    <figcaption className="mono">{t('hero-photo-caption')}</figcaption>
                </figure>
            </div>
        </section>
    );
}
