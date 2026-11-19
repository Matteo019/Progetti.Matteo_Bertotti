import { useEffect, useRef } from 'react';

import Hero from '../components/Hero.jsx';
import Navbar from '../components/Navbar.jsx';
import { BackToTop, CookieBanner, Footer, ScrollProgress } from '../components/PageChrome.jsx';
import Preloader from '../components/Preloader.jsx';
import Posts from '../components/posts/Posts.jsx';
import Projects from '../components/projects/Projects.jsx';
import { About, Certifications, Contact, Education, Experience, Marquee, Skills } from '../components/Sections.jsx';
import {
    initGridPaths, initMagneticButtons, initScrollReveal, initScrollScale, initStars, initTiltCards,
} from '../effects/pageEffects.js';
import { usePageMeta } from '../seo.js';

export default function Home() {
    usePageMeta({ title: 'Matteo Augustinho Bertotti | AI & Software Developer', path: '/' });
    const rootRef = useRef(null);
    const gridRef = useRef(null);
    const starsRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        const cleanups = [
            initStars(starsRef.current),
            initGridPaths(gridRef.current),
            initScrollReveal(root),
            initScrollScale(root),
            initMagneticButtons(root),
            initTiltCards(root),
        ];
        return () => cleanups.forEach(fn => fn());
    }, []);

    // Deep links like /#projects: scroll once the sections exist
    useEffect(() => {
        if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
    }, []);

    return (
        <div ref={rootRef}>
            <ScrollProgress />
            <canvas id="grid-canvas" ref={gridRef}></canvas>
            <Preloader />
            <canvas id="star-canvas" ref={starsRef}></canvas>
            <Navbar />
            <Hero />
            <Marquee />
            <About />
            <Experience />
            <Education />
            <Skills />
            <Projects />
            <Posts />
            <Certifications />
            <Contact />
            <BackToTop />
            <CookieBanner />
            <Footer />
        </div>
    );
}
