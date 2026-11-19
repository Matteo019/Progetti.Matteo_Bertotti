import { useLanguage } from '../i18n/LanguageContext.jsx';
import TypeText from './TypeText.jsx';

// The CV follows the page language
export const CV_URLS = {
    en: '/images/CV_MatteoBertotti_AI-SoftwareDeveloper_Verona.pdf',
    it: '/images/CV_MatteoBertotti_AI-SoftwareDeveloper_Verona_IT.pdf',
};

export default function Hero() {
    const { lang, t, html } = useLanguage();

    return (
        <section className="hero" id="top">
            <div className="page hero-grid">
                <div>
                    <p className="mono hero-kicker"><TypeText text={t('hero-kicker')} delay={500} /></p>
                    {/* Each line rises from behind a mask, one after the other */}
                    <h1 className="hero-name">
                        <span className="line"><span>Matteo</span></span>
                        <span className="line"><em>Augustinho</em></span>
                        <span className="line"><span>Bertotti</span></span>
                    </h1>
                    <p className="hero-lead fade-in delay-3" dangerouslySetInnerHTML={html('hero-lead')} />
                    <div className="hero-actions fade-in delay-4">
                        <a href={CV_URLS[lang] || CV_URLS.en} className="arrow-link" download>{t('hero-cv')} <span aria-hidden="true">↓</span></a>
                        <a href="#projects" className="arrow-link">{t('hero-work')} <span aria-hidden="true">→</span></a>
                    </div>
                </div>

                <figure className="hero-photo">
                    <img src="/images/profile.webp" alt="Matteo Augustinho Bertotti" width="864" height="980" fetchPriority="high" />
                    <figcaption className="mono">{t('hero-photo-caption')}</figcaption>
                </figure>
            </div>
        </section>
    );
}
