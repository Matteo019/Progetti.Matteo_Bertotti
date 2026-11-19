import { useCallback, useEffect, useRef, useState } from 'react';

import Hero from '../components/Hero.jsx';
import Navbar from '../components/Navbar.jsx';
import { CookieBanner, Footer } from '../components/PageChrome.jsx';
import Posts from '../components/posts/Posts.jsx';
import Projects from '../components/projects/Projects.jsx';
import { Certifications, Contact, Education, Experience, Skills } from '../components/Sections.jsx';
import { initScrollReveal } from '../effects/pageEffects.js';
import { usePageMeta } from '../seo.js';

export default function Home() {
    usePageMeta({ title: 'Matteo Augustinho Bertotti | AI & Software Developer', path: '/' });
    const rootRef = useRef(null);
    const [postsOpen, setPostsOpen] = useState(() => window.location.hash === '#posts');

    // #posts in the address bar mirrors the open panel, so the link can be shared
    const setPosts = useCallback((open) => {
        setPostsOpen(open);
        const url = open ? '#posts' : window.location.pathname + window.location.search;
        window.history.replaceState(null, '', url);
    }, []);

    useEffect(() => initScrollReveal(rootRef.current), []);

    // Deep links like /#projects: scroll once the sections exist
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash !== '#posts') document.querySelector(hash)?.scrollIntoView();
    }, []);

    return (
        <div ref={rootRef}>
            <Navbar onOpenPosts={() => setPosts(true)} postsOpen={postsOpen} />
            <main>
                <Hero />
                <Experience />
                <Projects />
                <Education />
                <Skills />
                <Certifications />
                <Contact />
            </main>
            <Posts open={postsOpen} onOpenChange={setPosts} />
            <CookieBanner />
            <Footer />
        </div>
    );
}
