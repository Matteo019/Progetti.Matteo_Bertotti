
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
        "about-text": "Sono uno studente appassionato con un forte interesse per la gestione, analisi e valorizzazione dei dati. Mi occupo di automazione dei processi, sviluppo di soluzioni data-driven e applicazione di modelli di machine learning per supportare decisioni efficienti e scalabili. Sono orientato all’apprendimento continuo e alla risoluzione di problemi complessi.",
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
            // Keep strong or em tags if they exist by using innerHTML or careful replacement
            // For simple cases, textContent is safer, but some of our text has markup
            if (element.querySelector('strong, em, span')) {
                // If it has children, we need to be more careful. 
                // For this project, we'll replace the text but keep the tags if possible.
                // A better way is to define markup in translations or handle it specifically.
                // Let's use innerHTML for simplicity as we control the dictionary.
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

// Initialize Language on Load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initStars();
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

// --- Star Background Animation ---
function initStars() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createStars();
    };

    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speed = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random();
            this.fade = Math.random() * 0.02 + 0.005;
        }
        update() {
            this.y -= this.speed;
            if (this.y < 0) { this.reset(); this.y = height; }
            this.opacity += this.fade;
            if (this.opacity > 1 || this.opacity < 0) this.fade = -this.fade;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.opacity)})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createStars() {
        stars = [];
        const starCount = Math.floor((width * height) / 6000);
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


