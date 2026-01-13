// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.skill-card, .project-card, .section-title, .about-content, .featured-repo');

// Add reveal class initially
revealElements.forEach(element => {
    element.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Typing Effect for Hero Subtitle
const typingText = document.getElementById('typing-text');
const phrases = ['AI Dev & Data Analyst', 'Python Enthusiast', 'Machine Learning Student', 'Data Driven Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 1500; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start typing effect
document.addEventListener('DOMContentLoaded', type);

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    // Navbar background update
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 18, 0.95)';
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.background = 'rgba(10, 10, 18, 0.8)';
        navbar.style.padding = '20px 0';
    }

    // Back to top visibility
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mouse following effect for background globes
document.addEventListener('mousemove', (e) => {
    const globes = document.querySelectorAll('.globe');
    const x = (e.clientX / window.innerWidth) * 30; // Max 30px movement
    const y = (e.clientY / window.innerHeight) * 30;

    globes.forEach((globe, index) => {
        const factor = (index + 1) * 0.5;
        globe.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});
