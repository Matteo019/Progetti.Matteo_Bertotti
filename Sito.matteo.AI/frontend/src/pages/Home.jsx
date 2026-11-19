import { useCallback, useEffect, useRef, useState } from 'react';

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
    const [postsOpen, setPostsOpen] = useState(() => window.location.hash === '#posts');

    // #posts in the address bar mirrors the open panel, so the link can be shared
    const setPosts = useCallback((open) => {
        setPostsOpen(open);
        const url = open ? '#posts' : window.location.pathname + window.location.search;
        window.history.replaceState(null, '', url);
    }, []);

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
        const hash = window.location.hash;
        if (hash && hash !== '#posts') document.querySelector(hash)?.scrollIntoView();
    }, []);

    return (
        <div ref={rootRef}>
            <ScrollProgress />
            <canvas id="grid-canvas" ref={gridRef}></canvas>
            <Preloader />
            <canvas id="star-canvas" ref={starsRef}></canvas>
            <Navbar onOpenPosts={() => setPosts(true)} />
            <Hero />
            <Marquee />
            <About />
            <Experience />
            <Education />
            <Skills />
            <Projects />
            <Certifications />
            <Contact />
            <Posts open={postsOpen} onOpenChange={setPosts} />
            <BackToTop />
            <CookieBanner />
            <Footer />
        </div>
    );
}
