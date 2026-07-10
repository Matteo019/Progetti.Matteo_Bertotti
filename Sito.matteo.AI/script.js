
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
        "nav-experience": "Esperienza",
        "nav-education": "Formazione",
        "experience-title": "Esperienza Lavorativa",
        "exp-job-title": "Software Developer Apprendista",
        "exp-company": "Metline Software & Sistemi \u2014 Gruppo Maestrale",
        "exp-year": "2026 - Presente",
        "exp-desc": "Progetto e sviluppo soluzioni verticali, gestionali su misura, piattaforme SaaS e applicazioni on-premise. Gestisco l'intero ciclo dei processi aziendali (contabilità, logistica, CRM e flussi documentali) tramite l'ERP Panthera, implementando inoltre automazioni avanzate e integrazioni basate sull'Intelligenza Artificiale per ottimizzare l'efficienza operativa.",
        "exp-stack-title": "Stack Tecnologico:",
        "exp-stack-erp": "Gestionali",
        "exp-stack-vertical": "Soluzioni Verticali",
        "exp-stack-integration": "Integrazioni AI & MCP",
        "education-title": "Formazione",
        "edu-course-name": "Artificial Intelligence Developer and Data Analyst",
        "edu-course-desc": "Corso Biennale ITS per Tecnico Superiore Data Manager (EQF 5)",
        "edu-year": "2025 - Presente",
        "edu-desc": "Percorso di alta formazione specializzato nello sviluppo di soluzioni di Intelligenza Artificiale e Data Analytics. Il programma copre l'intero ciclo di vita del dato, dall'estrazione e analisi esplorativa fino alla creazione di modelli predittivi e di machine learning, applicando tecnologie all'avanguardia per risolvere complessi problemi aziendali e supportare decisioni data-driven.",
        "edu-skills-title": "Competenze Acquisite:",
        "edu-s1": "Python & Data Analysis",
        "edu-s2": "Machine & Deep Learning",
        "edu-s3": "AI Generativa",
        "edu-s4": "Big Data Management",
        "edu-s5": "Modelli Predittivi",
        "skills-title": "Competenze Tecniche",
        "skill-title-1": "Analisi Dati e Strumenti",
        "skill-title-2": "Gestione Database",
        "skill-title-3": "Machine Learning",
        "skill-title-4": "Visualizzazione Dati",
        "skill-title-5": "Tecnologie AI",
        "skill-desc-5": "N8N, Prompt Engineering, Sistemi Multi-Agente",
        "skill-title-6": "Backend e Framework",
        "skill-desc-6": "FastAPI, Flask, Python",
        "projects-title": "I Miei Progetti",
        "project-1-title": "AKID Chatbox",
        "project-1-desc": "Chatbot AI multi-agente per analisi dati e KPI, con integrazione MCP verso database SQL e modelli LLM via Nvidia NIM e Groq.",
        "project-2-title": "Gestione Magazzino Bar",
        "project-2-desc": "Applicazione web per la gestione completa del magazzino alcolico di un bar.",
        "project-3-title": "Mental Health & Work",
        "project-3-desc": "Pulizia e analisi guidata di un dataset CSV con Python, step by step.",
        "project-open": "Apri Progetto",
        "project-explore": "Esplora il Notebook",
        "modal-close": "Chiudi",
        "modal-loading": "Caricamento in corso...",
        "modal-error-title": "Progetto in fase di deploy",
        "modal-error-desc": "Questo progetto sarà disponibile a breve.",
        "notebook-run": "Esegui questo step",
        "notebook-prev": "Precedente",
        "notebook-next": "Successivo",
        "notebook-step-of": "Step {n} di {total}",
        "certs-title": "Certificazioni",
        "cert-view": "Visualizza Certificato",
        "cert-db": "freeCodeCamp Python",
        "cert-python": "freeCodeCamp Python",
        "cert-excel": "Excel Avanzato",
        "cert-english": "B1 English for Developers",
        "contact-title": "Contatti",
        "cookie-text": "Utilizziamo i cookie per personalizzare i contenuti e migliorare la vostra esperienza. Continuando a navigare, accettate il nostro uso dei cookie. Per saperne di più, consultate la nostra Informativa sulla Privacy.",
        "cookie-reject": "Rifiuta",
        "cookie-accept": "Accetta Tutti",
        "footer-rights": "© 2025 Matteo Augustinho Bertotti. Tutti i diritti riservati.",
        "notebook-small-title": "Schermo troppo piccolo",
        "notebook-small-desc": "Ingrandisci la finestra A Fullscreen e riapri la pagina",
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
        "nav-experience": "Experience",
        "nav-education": "Education",
        "experience-title": "Work Experience",
        "exp-job-title": "Apprentice Software Developer",
        "exp-company": "Metline Software & Systems \u2014 Maestrale Group",
        "exp-year": "2026 - Present",
        "exp-desc": "I design and develop vertical solutions, custom management systems, SaaS platforms, and on-premise applications. I manage integrated business processes (accounting, logistics, CRM, and document management) via Panthera ERP, while implementing advanced automations and AI-driven integrations to optimize operational efficiency.",
        "exp-stack-title": "Tech Stack:",
        "exp-stack-erp": "Management Systems",
        "exp-stack-vertical": "Vertical Solutions",
        "exp-stack-integration": "AI & MCP Integrations",
        "education-title": "Education",
        "edu-course-name": "Artificial Intelligence Developer and Data Analyst",
        "edu-course-desc": "Two-year ITS Course for Senior Data Manager Technician (EQF 5)",
        "edu-year": "2025 - Present",
        "edu-desc": "Advanced training program specialized in developing Artificial Intelligence and Data Analytics solutions. The curriculum covers the entire data lifecycle, from extraction and exploratory analysis to creating predictive and machine learning models, applying cutting-edge technologies to solve complex business problems and support data-driven decisions.",
        "edu-skills-title": "Acquired Competencies:",
        "edu-s1": "Python & Data Analysis",
        "edu-s2": "Machine & Deep Learning",
        "edu-s3": "Generative AI",
        "edu-s4": "Big Data Management",
        "edu-s5": "Predictive Models",
        "skills-title": "Technical Skills",
        "skill-title-1": "Data Analysis & Tools",
        "skill-title-2": "Database Management",
        "skill-title-3": "Machine Learning",
        "skill-title-4": "Data Visualization",
        "skill-title-5": "AI Technologies",
        "skill-desc-5": "N8N, Prompt Engineering, Multi-Agent Systems",
        "skill-title-6": "Backend & Frameworks",
        "skill-desc-6": "FastAPI, Flask, Python",
        "projects-title": "My Projects",
        "project-1-title": "Metline Chatbox",
        "project-1-desc": "AI Chatbot for analysis and KPIs with MCP sql Database, Nvidia NIM and GRoq integration.",
        "project-2-title": "Bar Inventory Management",
        "project-2-desc": "Web application for complete bar inventory management.",
        "project-3-title": "Mental Health & Work",
        "project-3-desc": "Guided CSV dataset cleaning and analysis with Python, step by step.",
        "project-open": "Open Project",
        "project-explore": "Explore Notebook",
        "modal-close": "Close",
        "modal-loading": "Loading...",
        "modal-error-title": "Project being deployed",
        "modal-error-desc": "This project will be available soon.",
        "notebook-run": "Run this step",
        "notebook-prev": "Previous",
        "notebook-next": "Next",
        "notebook-step-of": "Step {n} of {total}",
        "certs-title": "Certifications",
        "cert-view": "View Certificate",
        "cert-db": "freeCodeCamp Python",
        "cert-python": "freeCodeCamp Python",
        "cert-excel": "Advanced Excel",
        "cert-english": "B1 English for Developers",
        "contact-title": "Contact",
        "cookie-text": "We use cookies to personalize content and improve your experience. By continuing to browse, you agree to our use of cookies. To learn more, see our Privacy Policy.",
        "cookie-reject": "Reject",
        "cookie-accept": "Accept All",
        "footer-rights": "© 2025 Matteo Augustinho Bertotti. All rights reserved.",
        "notebook-small-title": "Screen too small",
        "notebook-small-desc": "Maximize the window to Fullscreen and reopen the page",
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
    initProjectModals();
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

// ============================================================
//  PROJECT MODALS & NOTEBOOK LOGIC
// ============================================================
function initProjectModals() {
    const cards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    if (!modal || cards.length === 0) return;

    const closeBtn = document.getElementById('modal-close');
    const titleEl = document.getElementById('modal-title');
    const addressBar = document.getElementById('modal-address-bar');
    const bodyEl = document.getElementById('modal-body');

    const modalBodyTemplate = `
        <div class="modal-loading" id="modal-loading">
            <div class="modal-spinner"></div>
            <p data-i18n="modal-loading">Caricamento in corso...</p>
        </div>
        <div class="modal-error" id="modal-error" hidden>
            <div class="modal-error-icon">🚀</div>
            <h4 data-i18n="modal-error-title">Progetto in fase di deploy</h4>
            <p data-i18n="modal-error-desc">Questo progetto sarà disponibile a breve.</p>
        </div>
    `;

    let loadingEl;
    let errorEl;

    let iframeTimeout;

    // Focus trap variables
    let focusableElements;
    let firstFocusableElement;
    let lastFocusableElement;

    function openModal(card) {
        const type = card.getAttribute('data-modal-type');
        const url = card.getAttribute('data-modal-url');
        const title = card.getAttribute('data-modal-title');

        if (type === 'notebook' && window.innerWidth < 960) {
            const smallTitle = translations[currentLang]["notebook-small-title"];
            const smallDesc = translations[currentLang]["notebook-small-desc"];
            
            titleEl.textContent = smallTitle;
            addressBar.textContent = 'local://error';
            bodyEl.innerHTML = `
                <div class="modal-error" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:2rem;">
                    <div style="font-size:3rem; margin-bottom:1rem;">🖥️</div>
                    <h4 style="color:var(--text); margin:0;" data-i18n="notebook-small-title">${smallTitle}</h4>
                    <p style="margin-top:0.5rem; color:var(--text-muted); line-height:1.5;" data-i18n="notebook-small-desc">${smallDesc}</p>
                </div>
            `;
            
            modal.removeAttribute('hidden');
            void modal.offsetWidth;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
            return;
        }

        titleEl.textContent = title;
        addressBar.textContent = url || 'local://notebook';
        
        // Reset state from template to avoid detached DOM node issues
        bodyEl.innerHTML = modalBodyTemplate;
        loadingEl = document.getElementById('modal-loading');
        errorEl = document.getElementById('modal-error');
        
        loadingEl.classList.remove('hidden');
        errorEl.setAttribute('hidden', '');

        if (type === 'iframe') {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.title = title;
            
            iframeTimeout = setTimeout(() => {
                loadingEl.classList.add('hidden');
                errorEl.querySelector('h4').textContent = "TIMEOUT 20s";
                errorEl.removeAttribute('hidden');
                iframe.style.display = 'none';
            }, 20000); // 20s timeout (ultima rete di salvataggio)

            iframe.onload = () => {
                clearTimeout(iframeTimeout);
                loadingEl.classList.add('hidden');
                errorEl.setAttribute('hidden', '');
                iframe.style.display = 'block';
            };

            iframe.onerror = (e) => {
                clearTimeout(iframeTimeout);
                loadingEl.classList.add('hidden');
                errorEl.querySelector('h4').textContent = "ONERROR FIRED";
                errorEl.removeAttribute('hidden');
                iframe.style.display = 'none';
            };
            
            bodyEl.appendChild(iframe);
        } else if (type === 'deploying') {
            loadingEl.classList.add('hidden');
            errorEl.removeAttribute('hidden');
        } else if (type === 'notebook') {
            loadNotebook();
        }

        modal.removeAttribute('hidden');
        // Force reflow
        void modal.offsetWidth;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');

        // Set up focus trap
        focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            firstFocusableElement = focusableElements[0];
            lastFocusableElement = focusableElements[focusableElements.length - 1];
            firstFocusableElement.focus();
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            bodyEl.innerHTML = '';
            document.body.style.overflow = '';
            clearTimeout(iframeTimeout);
        }, 350);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    cards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });



    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Focus trap logic
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

        if (e.shiftKey) { // shift + tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });

    // Image Zoom Logic
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.notebook-output-content')) {
            e.target.classList.toggle('zoomed');
        }
    });

    // Notebook Logic
    async function loadNotebook() {
        const fallbackData = {
          "title_it": "Analisi Mental Health & Lavoro",
          "title_en": "Mental Health & Work Analysis",
          "steps": [
            {
              "id": 1,
              "title_it": "Import Librerie",
              "title_en": "Import Libraries",
              "description_it": "Importiamo le librerie necessarie: Pandas per la manipolazione, Matplotlib e Seaborn per la visualizzazione statistica.",
              "description_en": "We import the necessary libraries: Pandas for manipulation, Matplotlib and Seaborn for statistical visualization.",
              "code": "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom scipy import stats\n\nsns.set_theme(style='whitegrid', palette='muted')\nplt.rcParams['figure.figsize'] = (9, 5)\nprint('Librerie importate con successo ✓')",
              "outputType": "text",
              "outputContent": "Librerie importate con successo ✓"
            },
            {
              "id": 2,
              "title_it": "Caricamento Dataset",
              "title_en": "Load Dataset",
              "description_it": "Carichiamo il dataset fittizio sui 1500 lavoratori e visualizziamo le prime 5 righe per capire la struttura.",
              "description_en": "We load the mock dataset of 1500 workers and display the first 5 rows to understand the structure.",
              "code": "df = pd.read_csv('mental_health_productivity_2026.csv')\n\nprint(f'Dimensioni del dataset: {df.shape[0]} osservazioni x {df.shape[1]} variabili')\ndf.head()",
              "outputType": "table",
              "outputContent": "<table><thead><tr><th></th><th>Employee_ID</th><th>Age</th><th>Gender</th><th>Industry</th><th>Work_Mode</th><th>Work_Hours</th><th>Stress_Level</th><th>Burnout_Risk</th></tr></thead><tbody><tr><td>0</td><td>EMP_0001</td><td>50</td><td>Male</td><td>Manufacturing</td><td>Remote</td><td>40</td><td>9</td><td>High</td></tr><tr><td>1</td><td>EMP_0002</td><td>36</td><td>Male</td><td>Finance</td><td>Remote</td><td>35</td><td>1</td><td>Low</td></tr><tr><td>2</td><td>EMP_0003</td><td>29</td><td>Male</td><td>Finance</td><td>Remote</td><td>52</td><td>4</td><td>Low</td></tr><tr><td>3</td><td>EMP_0004</td><td>42</td><td>Female</td><td>Manufacturing</td><td>Remote</td><td>56</td><td>10</td><td>High</td></tr><tr><td>4</td><td>EMP_0005</td><td>40</td><td>Male</td><td>Tech</td><td>On-site</td><td>35</td><td>2</td><td>Low</td></tr></tbody></table><p class='nb-shape'>Dimensioni del dataset: 1500 osservazioni x 13 variabili</p>"
            },
            {
              "id": 3,
              "title_it": "Analisi Valori Mancanti",
              "title_en": "Missing Values Analysis",
              "description_it": "Verifichiamo quanti valori mancanti (NaN) ci sono e identifichiamo i tipi di variabili (continue vs categoriali).",
              "description_en": "We check how many missing values (NaN) exist and identify variable types (continuous vs categorical).",
              "code": "var_quant = ['Age', 'Work_Hours_Per_Week', 'Stress_Level',\n             'Sleep_Hours', 'Productivity_Score', 'Physical_Activity_Hours']\nvar_cat   = ['Gender', 'Country', 'Industry', 'Work_Mode',\n             'Mental_Health_Support_Access', 'Burnout_Risk']\n\nprint('\\nValori mancanti per variabile')\nmissing = df.isnull().sum()\nprint(missing[missing > 0] if missing.sum() > 0 else 'Nessun valore mancante rilevato.')",
              "outputType": "text",
              "outputContent": "Valori mancanti per variabile\nNessun valore mancante rilevato."
            },
            {
              "id": 4,
              "title_it": "Statistica Descrittiva",
              "title_en": "Descriptive Statistics",
              "description_it": "Calcoliamo le misure di posizione e dispersione (media, mediana, quartili, asimmetria) per le variabili quantitative.",
              "description_en": "We calculate measures of central tendency and dispersion (mean, median, quartiles, skewness) for quantitative variables.",
              "code": "desc = df[var_quant].describe().T\ndesc['median'] = df[var_quant].median()\ndesc['skewness'] = df[var_quant].skew()\ndesc = desc[['count','mean','median','std','min','25%','75%','max','skewness']]\ndesc.columns = ['N','Media','Mediana','Dev.Std','Min','Q1','Q3','Max','Asimmetria']\npd.options.display.float_format = '{:.3f}'.format\ndesc",
              "outputType": "table",
              "outputContent": "<table><thead><tr><th></th><th>N</th><th>Media</th><th>Mediana</th><th>Dev.Std</th><th>Min</th><th>Q1</th><th>Q3</th><th>Max</th><th>Asimmetria</th></tr></thead><tbody><tr><td>Age</td><td>1500.000</td><td>41.003</td><td>42.000</td><td>11.063</td><td>22.000</td><td>31.000</td><td>50.000</td><td>59.000</td><td>-0.085</td></tr><tr><td>Work_Hours_Per_Week</td><td>1500.000</td><td>46.980</td><td>47.000</td><td>10.042</td><td>30.000</td><td>38.000</td><td>55.250</td><td>64.000</td><td>-0.003</td></tr><tr><td>Stress_Level</td><td>1500.000</td><td>6.245</td><td>7.000</td><td>2.988</td><td>1.000</td><td>4.000</td><td>9.000</td><td>10.000</td><td>-0.284</td></tr><tr><td>Sleep_Hours</td><td>1500.000</td><td>6.973</td><td>6.982</td><td>1.216</td><td>4.000</td><td>6.138</td><td>7.818</td><td>10.000</td><td>-0.013</td></tr><tr><td>Productivity_Score</td><td>1500.000</td><td>69.837</td><td>70.000</td><td>17.397</td><td>40.000</td><td>55.000</td><td>84.000</td><td>100.000</td><td>0.020</td></tr><tr><td>Physical_Activity_Hours</td><td>1500.000</td><td>5.005</td><td>5.023</td><td>2.899</td><td>0.011</td><td>2.526</td><td>7.526</td><td>9.996</td><td>-0.016</td></tr></tbody></table>"
            },
            {
              "id": 5,
              "title_it": "Distribuzione Rischio Burnout",
              "title_en": "Burnout Risk Distribution",
              "description_it": "Visualizziamo quanti dipendenti rientrano in categorie di rischio Alto, Medio o Basso.",
              "description_en": "Let's visualize how many employees fall into High, Medium, or Low burnout risk categories.",
              "code": "risk_counts = df['Burnout_Risk'].value_counts()\n\nfig, ax = plt.subplots()\nsns.barplot(x=risk_counts.index, y=risk_counts.values,\n            palette=['#ff5f57', '#ffbd2e', '#28c840'], ax=ax)\nax.set_xlabel('Rischio Burnout')\nax.set_ylabel('Numero di Dipendenti')\nax.set_title('Distribuzione Rischio Burnout nel Campione')\nplt.tight_layout()\nplt.show()",
              "outputType": "chart",
              "chartConfig": {
                "type": "bar",
                "labels": ["Medium", "High", "Low"],
                "datasets": [{
                  "label": "Numero Dipendenti",
                  "data": [620, 450, 430],
                  "backgroundColor": ["#ffbd2e", "#ff5f57", "#28c840"]
                }]
              }
            }
          ]
        };

        try {
            const response = await fetch('notebook-steps.json?v=1.0.8');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderNotebook(data);
        } catch (err) {
            console.error('Failed to fetch notebook, using fallback:', err);
            renderNotebook(fallbackData);
    }

    function renderNotebook(data) {
        let currentStep = 0;
        const steps = data.steps;

        const layout = document.createElement('div');
        layout.className = 'notebook-layout';

        // Header
        const header = document.createElement('div');
        header.className = 'notebook-header';
        
        const stepInfo = document.createElement('div');
        stepInfo.className = 'notebook-step-info';
        
        const stepCounter = document.createElement('span');
        stepCounter.className = 'notebook-step-counter';
        
        const stepTitle = document.createElement('span');
        stepTitle.className = 'notebook-step-title';
        
        stepInfo.appendChild(stepCounter);
        stepInfo.appendChild(stepTitle);
        header.appendChild(stepInfo);

        // Progress
        const progress = document.createElement('div');
        progress.className = 'notebook-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'notebook-progress-bar';
        progress.appendChild(progressBar);

        // Description
        const desc = document.createElement('div');
        desc.className = 'notebook-step-desc';

        // Content (Code & Output)
        const content = document.createElement('div');
        content.className = 'notebook-content';
        
        const codePanel = document.createElement('div');
        codePanel.className = 'notebook-code-panel';
        const codePre = document.createElement('pre');
        codePre.className = 'language-python';
        codePanel.appendChild(codePre);

        const outputPanel = document.createElement('div');
        outputPanel.className = 'notebook-output-panel';

        content.appendChild(desc);
        content.appendChild(codePanel);
        content.appendChild(outputPanel);

        // Controls
        const controls = document.createElement('div');
        controls.className = 'notebook-controls';
        
        const dots = document.createElement('div');
        dots.className = 'notebook-dots';
        steps.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'step-dot';
            dots.appendChild(dot);
        });

        const navBtns = document.createElement('div');
        navBtns.className = 'notebook-nav-btns';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nb-btn nb-btn-secondary';
        prevBtn.innerHTML = translations[currentLang]['notebook-prev'];
        
        const runBtn = document.createElement('button');
        runBtn.className = 'nb-btn nb-btn-primary';
        
        navBtns.appendChild(prevBtn);
        navBtns.appendChild(runBtn);
        controls.appendChild(dots);
        controls.appendChild(navBtns);

        layout.appendChild(header);
        layout.appendChild(progress);
        layout.appendChild(content);
        layout.appendChild(controls);

        loadingEl.classList.add('hidden');
        bodyEl.appendChild(layout);

        // Syntax Highlighting simple implementation
        function highlightPython(code) {
            const keywords = ['import', 'from', 'as', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None'];
            const builtins = ['print', 'len', 'range', 'list', 'dict', 'set', 'str', 'int', 'float'];
            
            let highlighted = code
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // escape HTML
                .replace(/('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|#.*)/g, function(m) {
                    if (m.startsWith('#')) return '<span class="nb-comment">' + m + '</span>';
                    return '<span class="nb-string">' + m + '</span>';
                })
                .replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="nb-number">$1</span>'); // numbers
            const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b(?![^<]*>)`, 'g');
            highlighted = highlighted.replace(kwRegex, '<span class="nb-keyword">$1</span>');

            const biRegex = new RegExp(`\\b(${builtins.join('|')})\\b(?=\\()(?![^<]*>)`, 'g');
            highlighted = highlighted.replace(biRegex, '<span class="nb-builtin">$1</span>');
            
            return highlighted;
        }

        // Add Chart.js if not present for chart rendering
        if (!document.getElementById('chartjs-script')) {
            const script = document.createElement('script');
            script.id = 'chartjs-script';
            script.src = 'vendor/chart.js';
            document.head.appendChild(script);
        }

        let stepOutputRevealed = false;
        let activeChart = null;

        function updateStep() {
            const step = steps[currentStep];
            stepOutputRevealed = false;
            
            const stepStr = translations[currentLang]['notebook-step-of']
                .replace('{n}', currentStep + 1).replace('{total}', steps.length);
            stepCounter.textContent = stepStr;
            
            const isIt = currentLang === 'it';
            stepTitle.textContent = isIt ? step.title_it : step.title_en;
            desc.textContent = isIt ? step.description_it : step.description_en;
            
            progressBar.style.width = `${((currentStep) / steps.length) * 100}%`;
            
            codePre.innerHTML = highlightPython(step.code);

            // Set placeholder output
            outputPanel.innerHTML = `
                <div class="notebook-output-placeholder">
                    <div class="placeholder-icon">⚙️</div>
                    <p>${translations[currentLang]['notebook-run']}</p>
                </div>
            `;

            prevBtn.disabled = currentStep === 0;
            runBtn.textContent = translations[currentLang]['notebook-run'];
            
            Array.from(dots.children).forEach((dot, i) => {
                dot.className = 'step-dot';
                if (i < currentStep) dot.classList.add('completed');
                if (i === currentStep) dot.classList.add('active');
            });
        }

        function revealOutput() {
            const step = steps[currentStep];
            stepOutputRevealed = true;
            
            progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            runBtn.textContent = currentStep === steps.length - 1 ? '✓' : translations[currentLang]['notebook-next'];

            // Reveal
            const outDiv = document.createElement('div');
            outDiv.className = `notebook-output-content ${step.outputType}-output`;
            
            if (step.outputType === 'text') {
                outDiv.textContent = step.outputContent;
            } else if (step.outputType === 'html' || step.outputType === 'table') {
                outDiv.innerHTML = step.outputContent;
            } else if (step.outputType === 'chart' && step.chartConfig) {
                outDiv.innerHTML = '<div class="notebook-chart-container"><canvas id="nb-chart"></canvas></div>';
            }

            outputPanel.innerHTML = '';
            outputPanel.appendChild(outDiv);
            
            // Trigger animation
            setTimeout(() => outDiv.classList.add('visible'), 50);

            // Render chart if needed
            if (step.outputType === 'chart' && typeof Chart !== 'undefined') {
                setTimeout(() => {
                    if (activeChart) activeChart.destroy();
                    const ctx = document.getElementById('nb-chart').getContext('2d');
                    activeChart = new Chart(ctx, {
                        ...step.chartConfig,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } }
                        }
                    });
                }, 100);
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
                revealOutput();
            }
        });

        runBtn.addEventListener('click', () => {
            if (!stepOutputRevealed) {
                revealOutput();
            } else {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStep();
                } else {
                    closeModal();
                }
            }
        });

        // Initialize first step
        updateStep();
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
}
