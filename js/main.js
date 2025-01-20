// Inicijalizacija AOS biblioteke za animacije
AOS.init({
    duration: 1000,
    once: true
});

// Smooth scroll za navigaciju
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger menu za mobilni prikaz
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Parallax efekat za hero sekciju
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Animacija brojeva
function animateNumbers() {
    const yearsBadge = document.querySelector('.years');
    const percentageBadge = document.querySelector('.percentage');
    
    let yearsCount = 0;
    let percentageCount = 0;
    
    const yearsInterval = setInterval(() => {
        yearsCount++;
        yearsBadge.textContent = yearsCount + '+';
        if (yearsCount >= 50) clearInterval(yearsInterval);
    }, 40);
    
    const percentageInterval = setInterval(() => {
        percentageCount++;
        percentageBadge.textContent = percentageCount + '%';
        if (percentageCount >= 100) clearInterval(percentageInterval);
    }, 20);
}

// Animacija fade-in za proizvode kada dođu u viewport
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-badges')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .hero-badges').forEach(element => {
    observer.observe(element);
});

// Lightbox funkcionalnost za galeriju
const createLightbox = () => {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', e => {
            lightbox.classList.add('active');
            const img = document.createElement('img');
            img.src = e.currentTarget.querySelector('img').src;
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(img);
        });
    });

    lightbox.addEventListener('click', e => {
        if (e.target !== e.currentTarget) return;
        lightbox.classList.remove('active');
    });
};

// Inicijalizacija funkcija nakon učitavanja DOM-a
document.addEventListener('DOMContentLoaded', () => {
    createLightbox();
    observer.observe(document.querySelector('.hero-badges'));
});
