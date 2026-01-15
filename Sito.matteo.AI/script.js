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
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
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

// Star Background Logic
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const starCount = 150;
let mouseX = -100;
let mouseY = -100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.width,
            size: Math.random() * 2,
            baseX: 0,
            baseY: 0,
            speed: Math.random() * 0.5 + 0.2
        });
        stars[i].baseX = stars[i].x;
        stars[i].baseY = stars[i].y;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffcc00';

    stars.forEach(star => {
        // Subtle drift
        star.y -= star.speed;
        star.baseY -= star.speed;
        
        if (star.y < 0) {
            star.y = canvas.height;
            star.baseY = canvas.height;
        }

        // Mouse interaction
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            star.x -= dx * force * 0.1;
            star.y -= dy * force * 0.1;
        } else {
            // Return to base position
            star.x += (star.baseX - star.x) * 0.05;
            star.y += (star.baseY - star.y) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

resizeCanvas();
animate();
