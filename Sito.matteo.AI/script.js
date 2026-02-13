
// Translation Dictionary
const translations = {
    it: {
        "nav-about": "Chi Sono",
        "nav-skills": "Skills",
        "nav-projects": "Progetti",
        "nav-contact": "Contatti",
        "hero-subtitle": "ITS Mario Volpato | Studente di Intelligenza Artificiale e Data Analysis",
        "hero-cv": "Scarica il CV",
        "hero-projects": "Vedi Progetti",
        "about-title": "Chi Sono",
        "about-text": "Sono uno studente appassionato con un forte interesse per la gestione, analisi e valorizzazione dei dati. Mi occupo di automazione dei processi, sviluppo di soluzioni data-driven e applicazione di modelli di machine learning per supportare decisioni efficienti e scalabili. Sono orientato all'apprendimento continuo e alla risoluzione di problemi complessi.",
        "education-title": "Formazione",
        "edu-course-name": "Artificial Intelligence Developer and Data Analyst",
        "edu-course-desc": "Corso Biennale ITS per Tecnico Superiore Data Manager",
        "edu-year": "2025 - Presente",
        "edu-skills-title": "Competenze Acquisite:",
        "edu-s1": "Programmazione Python & Basi Dati",
        "edu-s2": "Statistical Learning & Data Science",
        "edu-s3": "Deep Learning & AI Generativa",
        "edu-s4": "Analisi Esplorativa (EDA) & Visualization",
        "edu-s5": "Big Data Computing",
        "edu-s6": "Data Driven Marketing",
        "edu-s7": "Modelli Supervised & Unsupervised",
        "skills-title": "Competenze Tecniche",
        "skill-title-1": "Analisi Dati & Tools",
        "skill-title-2": "Database Management",
        "skill-title-3": "Machine Learning Libs",
        "skill-title-4": "Data Visualization",
        "skill-title-5": "AI Technologies",
        "skill-desc-5": "Integrazione LLM, Prompt Engineering, Computer Vision",
        "skill-title-6": "Soft Skills",
        "skill-desc-6": "Problem Solving, Gestione Processi, Pensiero Strategico",
        "projects-title": "I Miei Progetti",
        "project-featured-title": "Repository Progetti (GitHub)",
        "project-featured-desc": "Esplora la raccolta completa dei miei progetti e collaborazioni direttamente sul mio profilo GitHub.",
        "project-featured-btn": "Vai al Repository",
        "certs-title": "Certificazioni",
        "cert-view": "Visualizza Certificato",
        "cert-db": "Fondamenta Database",
        "cert-excel": "Excel Avanzato",
        "contact-title": "Contatti",
        "cookie-text": "Utilizziamo i cookie per personalizzare i contenuti e migliorare la vostra esperienza. Continuando a navigare, accettate il nostro uso dei cookie. Per saperne di più, consultate la nostra Informativa sulla Privacy.",
        "cookie-reject": "Rifiuta",
        "cookie-accept": "Accetta Tutti",
        "footer-rights": "© 2025 Matteo Augustinho Bertotti. Tutti i diritti riservati.",
        "typing-phrases": ['AI Dev & Data Analyst', 'Appassionato di Python', 'Studente di Machine Learning', 'Risolutore di Problemi Data-Driven']
    },
    en: {
        "nav-about": "About Me",
        "nav-skills": "Skills",
        "nav-projects": "Projects",
        "nav-contact": "Contact",
        "hero-subtitle": "ITS Mario Volpato | AI Developer and Data Analysis Student",
        "hero-cv": "Download CV",
        "hero-projects": "View Projects",
        "about-title": "About Me",
        "about-text": "I am a passionate student with a strong interest in data management, analysis, and valorization. I work on process automation, data-driven solutions development, and machine learning models application to support efficient and scalable decisions. I am focused on continuous learning and solving complex problems.",
        "education-title": "Education",
        "edu-course-name": "Artificial Intelligence Developer and Data Analyst",
        "edu-course-desc": "Two-year ITS Course for Senior Data Manager Technician",
        "edu-year": "2025 - Present",
        "edu-skills-title": "Acquired Competencies:",
        "edu-s1": "Python Programming & Databases",
        "edu-s2": "Statistical Learning & Data Science",
        "edu-s3": "Deep Learning & Generative AI",
        "edu-s4": "Exploratory Data Analysis (EDA) & Visualization",
        "edu-s5": "Big Data Computing",
        "edu-s6": "Data Driven Marketing",
        "edu-s7": "Supervised & Unsupervised Models",
        "skills-title": "Technical Skills",
        "skill-title-1": "Data Analysis & Tools",
        "skill-title-2": "Database Management",
        "skill-title-3": "Machine Learning Libs",
        "skill-title-4": "Data Visualization",
        "skill-title-5": "AI Technologies",
        "skill-desc-5": "LLM Integration, Prompt Engineering, Computer Vision",
        "skill-title-6": "Soft Skills",
        "skill-desc-6": "Problem Solving, Process Management, Strategic Thinking",
        "projects-title": "My Projects",
        "project-featured-title": "Project Repository (GitHub)",
        "project-featured-desc": "Explore the complete collection of my projects and collaborations directly on my GitHub profile.",
        "project-featured-btn": "Go to Repository",
        "certs-title": "Certifications",
        "cert-view": "View Certificate",
        "cert-db": "Database Foundations",
        "cert-excel": "Advanced Excel",
        "contact-title": "Contact",
        "cookie-text": "We use cookies to personalize content and improve your experience. By continuing to browse, you agree to our use of cookies. To learn more, see our Privacy Policy.",
        "cookie-reject": "Reject",
        "cookie-accept": "Accept All",
        "footer-rights": "© 2025 Matteo Augustinho Bertotti. All rights reserved.",
        "typing-phrases": ['AI Dev & Data Analyst', 'Python Enthusiast', 'Machine Learning Student', 'Data Driven Problem Solver']
    }
};

let currentLang = 'it'; // Always start in Italian
let phrases = translations[currentLang]["typing-phrases"];

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

    // Update text content for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.querySelector('strong, em, span')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update typing effect phrases
    phrases = translations[lang]["typing-phrases"];
    resetTyping();

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `lang-${lang}`);
    });
}

// Event Listeners for Language Buttons
document.getElementById('lang-it').addEventListener('click', () => setLanguage('it'));
document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    setLanguage(currentLang);
    initNameTyping();
    initStars();
    initCustomCursor(); // Replaces initCursorGlow
    initMarquee();
    initSplitText();
    initScrollScale();
    initGridPaths(); // NEW: Shadcn Grid Effect
    initSmoothScroll();
    initScrollReveal();
    initScrollProgress();
    initBackToTop();
    initNavbarScroll();
    initMagneticButtons();
    initTiltCards();
    initParallaxHero();
});

// --- Typing Effect Logic ---
const typingCurrentSpan = document.getElementById('typing-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;

function resetTyping() {
    if (typingTimeout) clearTimeout(typingTimeout);
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
    type();
}

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (!currentPhrase) {
        typingTimeout = setTimeout(type, 200);
        return;
    }

    if (isDeleting) {
        typingCurrentSpan.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingCurrentSpan.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = 100;
    if (isDeleting) speed /= 2;

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        speed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
    }

    typingTimeout = setTimeout(type, speed);
}
// --- Name Typing Effect ---
function initNameTyping() {
    const nameEl = document.getElementById('hero-name');
    if (!nameEl) return;

    const fullName = 'Matteo Augustinho Bertotti';
    let i = 0;
    nameEl.textContent = '';
    nameEl.style.borderRight = '3px solid var(--accent)';

    function typeName() {
        if (i < fullName.length) {
            nameEl.textContent += fullName.charAt(i);
            i++;
            setTimeout(typeName, 70);
        } else {
            // Blink cursor 3 times then remove
            let blinks = 0;
            const blinkInterval = setInterval(() => {
                nameEl.style.borderRight = blinks % 2 === 0 ? '3px solid transparent' : '3px solid var(--accent)';
                blinks++;
                if (blinks > 6) {
                    clearInterval(blinkInterval);
                    nameEl.style.borderRight = 'none';
                }
            }, 400);
        }
    }

    // Start after a short delay for the fade-in animation
    setTimeout(typeName, 600);
}

// --- Star Background Animation ---
function initStars() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    const resize = () => {
        width = window.innerWidth;
        height = document.body.scrollHeight; // Full page height
        canvas.width = width;
        canvas.height = height;
        createStars();
    };

    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.8 + 0.2;
            this.speed = Math.random() * 0.3 + 0.05;
            this.opacity = Math.random();
            this.fade = Math.random() * 0.015 + 0.003;
        }
        update() {
            this.y -= this.speed;
            if (this.y < 0) { this.reset(); this.y = height; }
            this.opacity += this.fade;
            if (this.opacity > 1 || this.opacity < 0) this.fade = -this.fade;
        }
        draw() {
            // Green-tinted particles instead of white for the light theme
            ctx.fillStyle = `rgba(26, 92, 56, ${Math.abs(this.opacity) * 0.4})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createStars() {
        stars = [];
        const starCount = Math.floor((width * height) / 10000);
        for (let i = 0; i < starCount; i++) stars.push(new Star());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => { star.update(); star.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// ============================================================
//  SCROLL REVEAL — Intersection Observer
// ============================================================
function initScrollReveal() {
    // Add reveal classes to elements
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        // Section title
        const title = section.querySelector('.section-title');
        if (title) title.classList.add('reveal-up');

        // Cards and content blocks
        const cards = section.querySelectorAll(
            '.skill-card, .cert-card, .contact-card, .project-card, .education-card, .about-content'
        );
        cards.forEach((card, i) => {
            card.classList.add('reveal-up');
            card.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    // Create observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Also reveal the parent section for the title underline animation
                const parentSection = entry.target.closest('.section');
                if (parentSection) parentSection.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
}

// ============================================================
//  SCROLL PROGRESS BAR
// ============================================================
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.prepend(progressBar);

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        ) - window.innerHeight;
        if (docHeight <= 0) {
            progressBar.style.width = '100%';
            return;
        }
        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    // Initial call
    updateProgress();
}

// ============================================================
//  SHADCN GRID PATHS (Tracing Beams)
// ============================================================
function initGridPaths() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const gridSize = 60; // Size of the grid cells
    let beams = [];

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight; // Fixed background
        canvas.width = width;
        canvas.height = height;
        initBeams();
    };

    class Beam {
        constructor() {
            this.reset();
        }

        reset() {
            // Snap to grid
            this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
            this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
            // Random direction: 0=right, 1=down, 2=left, 3=up
            this.dir = Math.floor(Math.random() * 4);
            this.speed = 1.5;
            this.len = Math.random() * 60 + 20; // Reduced Trail length
            this.history = [];
            this.color = Math.random() > 0.5 ? 'rgba(27, 188, 94, 0.4)' : 'rgba(26, 92, 56, 0.3)';
        }

        update() {
            // Move
            if (this.dir === 0) this.x += this.speed;
            else if (this.dir === 1) this.y += this.speed;
            else if (this.dir === 2) this.x -= this.speed;
            else if (this.dir === 3) this.y -= this.speed;

            // Add position to history for trail
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.len) {
                this.history.shift();
            }

            // Check boundaries
            if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
                this.reset();
            }

            // Random turn at intersections
            // We are at an intersection if x and y are multiples of gridSize (approx)
            // Since speed is 1.5, we check proximity
            const nearGridX = Math.abs(this.x % gridSize) < this.speed;
            const nearGridY = Math.abs(this.y % gridSize) < this.speed;

            if (nearGridX && nearGridY && Math.random() < 0.02) {
                const turn = Math.random() > 0.5 ? 1 : -1;
                this.dir = (this.dir + turn + 4) % 4;
            }
        }

        draw() {
            if (this.history.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Removed shadowBlur for performance
            ctx.stroke();

            // Draw head
            ctx.fillStyle = '#1bbc5e';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initBeams() {
        beams = [];
        const count = Math.floor((width * height) / 45000); // Reduced Density
        for (let i = 0; i < count; i++) {
            beams.push(new Beam());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Optional: Draw faint grid lines (user said "dont take off gray intersections")
        // If they want grid lines visible, uncomment below:
        /*
        ctx.strokeStyle = 'rgba(26, 58, 42, 0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= width; x += gridSize) {
            ctx.moveTo(x, 0); ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
            ctx.moveTo(0, y); ctx.lineTo(width, y);
        }
        ctx.stroke();
        */

        beams.forEach(beam => {
            beam.update();
            beam.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// ============================================================
//  BACK TO TOP BUTTON
// ============================================================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
//  NAVBAR SCROLL EFFECT
// ============================================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ============================================================
//  CURSOR GLOW (desktop only)
// ============================================================
// ============================================================
//  PRELOADER
// ============================================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const counter = document.querySelector('.preloader-counter');
    const text = document.querySelector('.preloader-text');

    if (!preloader || !counter || !text) return;

    let count = 0;
    const interval = setInterval(() => {
        count++;
        counter.textContent = `${count}%`;

        if (count >= 100) {
            clearInterval(interval);
            preloader.classList.add('start-anim');
            setTimeout(() => {
                preloader.classList.add('loaded');
                preloader.style.pointerEvents = 'none'; // Ensure clicks pass through
            }, 600);
        }
    }, 15); // Adjust speed of counter
}

// ============================================================
//  CUSTOM CURSOR (Spring Physics)
// ============================================================
function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return; // Touch devices

    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant update for dot
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateCursor() {
        // Spring/Lerp for outline
        outlineX += (mouseX - outlineX) * 0.15; // Smooth factor
        outlineY += (mouseY - outlineY) * 0.15;

        outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for links/buttons
    const hoverables = document.querySelectorAll('a, button, .magnetic-btn, .project-card, .skill-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// ============================================================
//  MARQUEE TICKER
// ============================================================
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;

    // Clone content to ensure seamless loop
    const clone = marqueeContent.cloneNode(true);
    marqueeContent.parentNode.appendChild(clone);
}

// ============================================================
//  SPLIT TEXT REVEAL
// ============================================================
function initSplitText() {
    const targets = document.querySelectorAll('[data-split-text]');

    targets.forEach(target => {
        const text = target.textContent;
        target.textContent = '';

        // Split text into spans
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.03}s`; // Stagger delay
            target.appendChild(span);
        });
    });

    // Observer for split text
    const splitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                splitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    targets.forEach(el => splitObserver.observe(el));
}

// ============================================================
//  SMOOTH INERTIA SCROLL (Lightweight)
// ============================================================
function initSmoothScroll() {
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    let currentY = 0;
    let targetY = 0;
    const ease = 0.07; // Smoothness factor

    document.addEventListener('scroll', () => {
        targetY = window.scrollY;
    }, { passive: true });

    // Note: A full custom scroll implementation (like Lenis) intercepts wheel events.
    // Here we're just accepting the native scroll but we can add effects linked to it.
    // For true "smooth scroll" affecting the whole body, we'd need to set body height
    // and translate a fixed container. Given the complexity/risk, let's stick to
    // native scroll logic but use the interpolated value for effects.
}

// ============================================================
//  SCALE ON SCROLL (Optimized)
// ============================================================
function initScrollScale() {
    const images = document.querySelectorAll('.project-image img, .hero-image img');
    let ticking = false;

    // Use a single scroll listener for all images
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                images.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    // Only animate if in viewport
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const center = window.innerHeight / 2;
                        const dist = (rect.top + rect.height / 2) - center;
                        const scale = 1 + (dist * 0.0002);
                        const clampedScale = Math.max(0.95, Math.min(1.05, scale));

                        if (!img.closest('.hero-image')) {
                            img.style.transform = `scale(${clampedScale})`;
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================================
//  MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================================
//  TILT EFFECT ON CARDS
// ============================================================
function initTiltCards() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.skill-card, .cert-card, .project-card, .education-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================================
//  PARALLAX ON HERO ELEMENTS
// ============================================================
function initParallaxHero() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    const bigTop = heroVisual.querySelector('.hero-big-top');
    const bigBottom = heroVisual.querySelector('.hero-big-bottom');
    const heroImg = heroVisual.querySelector('.hero-image');
    const codeIcon = heroVisual.querySelector('.hero-code-icon');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = heroVisual.offsetHeight;

                if (scrollY < heroHeight * 1.5) {
                    const factor = scrollY / heroHeight;
                    if (bigTop) bigTop.style.transform = `translateX(${-5 - factor * 15}%)`;
                    if (bigBottom) bigBottom.style.transform = `translateX(${5 + factor * 15}%)`;
                    if (heroImg) heroImg.style.transform = `translateY(${factor * -20}px)`;
                    if (codeIcon) codeIcon.style.transform = `translateY(${-factor * 30}px) rotate(${factor * 10}deg)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mouse parallax on hero visual
    if (window.innerWidth >= 768) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            if (heroImg) {
                heroImg.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
            }
            if (codeIcon) {
                codeIcon.style.transform = `translate(${x * -20}px, ${y * -20}px) rotate(${x * 8}deg)`;
            }
        });

        heroVisual.addEventListener('mouseleave', () => {
            if (heroImg) heroImg.style.transform = 'translate(0, 0)';
            if (codeIcon) codeIcon.style.transform = 'translate(0, 0)';
        });
    }
}

// Mobile Menu Logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });
}

// Close menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});
