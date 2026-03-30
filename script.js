/**
 * ZURA LAB - V1.0 Official Script
 * Tartalmazza: Loader, Kurzor, Neuron-háló, Navigáció, EmailJS
 */

// --- 1. LOADER KEZELÉS (AZONNALI FUTÁS) ---
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
            loader.style.display = 'none';
            // Aktiváljuk a belépő animációkat, ha vannak
            document.querySelectorAll('.animacio-fel').forEach(el => {
                el.classList.add('animacio-lathato');
            });
        }, 800);
    }
}

// Ha betöltött minden, vagy ha eltelt 2.5 másodperc (hatásszünet)
window.addEventListener('load', () => {
    setTimeout(hideLoader, 2000); 
});

// Ultimátum: 4 mp után mindenképp tűnjön el
setTimeout(hideLoader, 4000);


// --- 2. EGYEDI KURZOR LOGIKA ---
const kurzorPont = document.querySelector('.kurzor-pont');
const kurzorKor = document.querySelector('.kurzor-kor');
let mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Azonnali pont követés
    if(kurzorPont) {
        kurzorPont.style.left = e.clientX + 'px';
        kurzorPont.style.top = e.clientY + 'px';
    }
    
    // Késleltetett kör követés (smooth effect)
    if(kurzorKor) {
        setTimeout(() => {
            kurzorKor.style.left = e.clientX + 'px';
            kurzorKor.style.top = e.clientY + 'px';
        }, 50);
    }
});

// Hover effektus linkekre
document.querySelectorAll('a, button, .hamburger, .urlap-input, .hover-bento').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        kurzorKor.classList.add('hover-aktiv');
    });
    elem.addEventListener('mouseleave', () => {
        kurzorKor.classList.remove('hover-aktiv');
    });
});


// --- 3. NEURON CANVAS HÁTTÉR ---
const canvas = document.getElementById('neuron-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Interakció az egérrel
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(197, 131, 43, 0.5)';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 100; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            // Vonalak rajzolása a közeli pontok között
            for (let j = index + 1; j < particles.length; j++) {
                let dx = p.x - particles[j].x;
                let dy = p.y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(197, 131, 43, ${0.2 - dist/500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    init();
    animate();
}


// --- 4. NAVIGÁCIÓ ÉS MOBIL MENÜ ---
const hamburger = document.querySelector('.hamburger');
const mobilMenu = document.querySelector('.mobil-menu');
const navLinkek = document.querySelectorAll('.mobil-link');
const navbar = document.querySelector('.navbar');

if (hamburger && mobilMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('aktiv');
        mobilMenu.classList.toggle('nyitva');
        // Ha nyitva a menü, a navbar kapjon pointer-eventet, hogy az X elérhető legyen
        navbar.style.pointerEvents = 'auto';
    });

    navLinkek.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('aktiv');
            mobilMenu.classList.remove('nyitva');
        });
    });

    document.addEventListener('click', (e) => {
        if (mobilMenu.classList.contains('nyitva') && !mobilMenu.contains(e.target) && e.target !== hamburger) {
            hamburger.classList.remove('aktiv');
            mobilMenu.classList.remove('nyitva');
        }
    });
}

// Görgetéskor változó navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('glass');
    } else {
        navbar.classList.remove('glass');
    }
});


// --- 5. EMAILJS INTEGRÁCIÓ ---
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // EmailJS inicializálása (Biztonsági ellenőrzés)
        if (typeof emailjs !== 'undefined') {
            const submitBtn = contactForm.querySelector('button');
            submitBtn.innerText = "KÜLDÉS...";
            submitBtn.disabled = true;

            emailjs.sendForm('service_id_itt', 'template_id_itt', this)
                .then(() => {
                    successMsg.innerText = "ÜZENET SIKERESEN ELKÜLDVE!";
                    successMsg.classList.add('uzenet-siker');
                    contactForm.reset();
                }, (error) => {
                    console.log('HIBA:', error);
                    alert("Hiba történt a küldés során.");
                })
                .finally(() => {
                    submitBtn.innerText = "ÜZENET KÜLDÉSE";
                    submitBtn.disabled = false;
                });
        } else {
            console.error("Az EmailJS könyvtár nincs betöltve!");
        }
    });
}