// Visual effects that act on the rendered DOM (canvases, scroll and pointer effects).
// Each init returns a cleanup function, so React can tear them down on unmount.

const isDesktop = () => window.innerWidth >= 768;

function onScrollFrame(callback) {
    let ticking = false;
    const handler = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            callback();
            ticking = false;
        });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
}

// ---------- Floating particles ----------
// The canvas is position: fixed, so it only needs to be as big as the window
// (a page-tall canvas was ~47 MB redrawn every frame and made scrolling stutter)
export function initStars(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], frame;

    const makeStar = () => {
        const s = {};
        s.reset = () => {
            s.x = Math.random() * width;
            s.y = Math.random() * height;
            s.size = Math.random() * 1.8 + 0.2;
            s.speed = Math.random() * 0.3 + 0.05;
            s.opacity = Math.random();
            s.fade = Math.random() * 0.015 + 0.003;
        };
        s.reset();
        return s;
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        stars = Array.from({ length: Math.floor((width * height) / 10000) }, makeStar);
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for (const s of stars) {
            s.y -= s.speed;
            if (s.y < 0) { s.reset(); s.y = height; }
            s.opacity += s.fade;
            if (s.opacity > 1 || s.opacity < 0) s.fade = -s.fade;
            ctx.fillStyle = `rgba(26, 92, 56, ${Math.abs(s.opacity) * 0.4})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
        frame = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
    };
}

// ---------- Beams travelling along a grid (fixed background) ----------
export function initGridPaths(canvas) {
    const ctx = canvas.getContext('2d');
    const gridSize = 60;
    let width, height, beams = [], frame;

    const makeBeam = () => {
        const b = { history: [] };
        b.reset = () => {
            b.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
            b.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
            b.dir = Math.floor(Math.random() * 4); // 0 right, 1 down, 2 left, 3 up
            b.speed = 1.5;
            b.len = Math.random() * 60 + 20;
            b.history = [];
            b.color = Math.random() > 0.5 ? 'rgba(27, 188, 94, 0.4)' : 'rgba(26, 92, 56, 0.3)';
        };
        b.reset();
        return b;
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        beams = Array.from({ length: Math.floor((width * height) / 45000) }, makeBeam);
    };

    const step = (b) => {
        if (b.dir === 0) b.x += b.speed;
        else if (b.dir === 1) b.y += b.speed;
        else if (b.dir === 2) b.x -= b.speed;
        else b.y -= b.speed;

        b.history.push({ x: b.x, y: b.y });
        if (b.history.length > b.len) b.history.shift();

        if (b.x < -100 || b.x > width + 100 || b.y < -100 || b.y > height + 100) b.reset();

        const atCrossing = Math.abs(b.x % gridSize) < b.speed && Math.abs(b.y % gridSize) < b.speed;
        if (atCrossing && Math.random() < 0.02) {
            b.dir = (b.dir + (Math.random() > 0.5 ? 1 : -1) + 4) % 4;
        }
    };

    const draw = (b) => {
        if (b.history.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(b.history[0].x, b.history[0].y);
        for (let i = 1; i < b.history.length; i++) ctx.lineTo(b.history[i].x, b.history[i].y);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.fillStyle = '#1bbc5e';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for (const b of beams) { step(b); draw(b); }
        frame = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
    };
}

// ---------- Reveal sections and cards when they enter the viewport ----------
export function initScrollReveal(root) {
    root.querySelectorAll('.section').forEach(section => {
        section.querySelector('.section-title')?.classList.add('reveal-up');
        section.querySelectorAll(
            '.skill-card, .cert-card, .contact-card, .project-card, .education-card, .about-content'
        ).forEach((card, i) => {
            card.classList.add('reveal-up');
            card.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            entry.target.closest('.section')?.classList.add('revealed');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    root.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
}

// ---------- Navbar background once the page scrolls ----------
export function initNavbarScroll(navbar) {
    const update = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    update();
    return onScrollFrame(update);
}

// ---------- Subtle zoom on project images while scrolling ----------
export function initScrollScale(root) {
    return onScrollFrame(() => {
        root.querySelectorAll('.project-image img').forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
            const dist = (rect.top + rect.height / 2) - window.innerHeight / 2;
            const scale = Math.max(0.95, Math.min(1.05, 1 + dist * 0.0002));
            img.style.transform = `scale(${scale})`;
        });
    });
}

// ---------- Buttons that follow the pointer ----------
export function initMagneticButtons(root) {
    if (!isDesktop()) return () => {};
    const cleanups = [...root.querySelectorAll('.magnetic-btn')].map(btn => {
        const move = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        };
        const leave = () => { btn.style.transform = 'translate(0, 0)'; };
        btn.addEventListener('mousemove', move);
        btn.addEventListener('mouseleave', leave);
        return () => {
            btn.removeEventListener('mousemove', move);
            btn.removeEventListener('mouseleave', leave);
        };
    });
    return () => cleanups.forEach(fn => fn());
}

// ---------- 3D tilt on cards ----------
export function initTiltCards(root) {
    if (!isDesktop()) return () => {};
    const selector = '.skill-card, .cert-card, .project-card, .education-card';
    const move = (e) => {
        const card = e.target.closest(selector);
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    };
    const out = (e) => {
        const card = e.target.closest(selector);
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        }
    };
    root.addEventListener('mousemove', move);
    root.addEventListener('mouseout', out);
    return () => {
        root.removeEventListener('mousemove', move);
        root.removeEventListener('mouseout', out);
    };
}

// ---------- Hero parallax (scroll + pointer) ----------
export function initParallaxHero(heroVisual) {
    const bigTop = heroVisual.querySelector('.hero-big-top');
    const bigBottom = heroVisual.querySelector('.hero-big-bottom');
    const heroImg = heroVisual.querySelector('.hero-image');
    const codeIcon = heroVisual.querySelector('.hero-code-icon');

    const stopScroll = onScrollFrame(() => {
        const heroHeight = heroVisual.offsetHeight;
        if (window.scrollY >= heroHeight * 1.5) return;
        const factor = window.scrollY / heroHeight;
        if (bigTop) bigTop.style.transform = `translateX(${-5 - factor * 15}%)`;
        if (bigBottom) bigBottom.style.transform = `translateX(${5 + factor * 15}%)`;
        if (heroImg) heroImg.style.transform = `translateY(${factor * -20}px)`;
        if (codeIcon) codeIcon.style.transform = `translateY(${-factor * 30}px) rotate(${factor * 10}deg)`;
    });

    if (!isDesktop()) return stopScroll;

    const move = (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (heroImg) heroImg.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        if (codeIcon) codeIcon.style.transform = `translate(${x * -20}px, ${y * -20}px) rotate(${x * 8}deg)`;
    };
    const leave = () => {
        if (heroImg) heroImg.style.transform = 'translate(0, 0)';
        if (codeIcon) codeIcon.style.transform = 'translate(0, 0)';
    };
    heroVisual.addEventListener('mousemove', move);
    heroVisual.addEventListener('mouseleave', leave);
    return () => {
        stopScroll();
        heroVisual.removeEventListener('mousemove', move);
        heroVisual.removeEventListener('mouseleave', leave);
    };
}
