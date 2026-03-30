document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELYMES EGYEDI KURZOR ÉS MÁGNESES GOMB ---
    const kurzorPont = document.querySelector('.kurzor-pont');
    const kurzorKor = document.querySelector('.kurzor-kor');
    const interaktivElemek = document.querySelectorAll('.hover-link, .hover-bento, .magnetic-gomb');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    if (kurzorPont && kurzorKor) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            kurzorPont.style.left = `${mouseX}px`;
            kurzorPont.style.top = `${mouseY}px`;

            kurzorKor.animate({
                left: `${mouseX}px`,
                top: `${mouseY}px`
            }, { duration: 400, fill: "forwards" });
        });

        interaktivElemek.forEach(elem => {
            elem.addEventListener('mouseenter', () => kurzorKor.classList.add('hover-aktiv'));
            elem.addEventListener('mouseleave', () => kurzorKor.classList.remove('hover-aktiv'));
        });
    }

    const magneticGombok = document.querySelectorAll('.magnetic-gomb');
    magneticGombok.forEach(gomb => {
        gomb.addEventListener('mousemove', (e) => {
            const rect = gomb.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gomb.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        gomb.addEventListener('mouseleave', () => {
            gomb.style.transform = 'translate(0px, 0px)';
        });
    });


    // --- 2. INTERAKTÍV NEURON CANVAS ---
    const canvas = document.getElementById('neuron-canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas méretezése az ablakhoz
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    // Mennyi neuron legyen a képernyőn (mérettől függően)
    const numberOfParticles = (canvas.width * canvas.height) / 12000;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Véletlenszerű irány és sebesség
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = Math.random() * 2 + 1; // 1-3px méret
        }

        update() {
            // Visszapattanás a szélekről
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(197, 131, 43, 0.8)'; // Bronz pöttyök
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // Neuronok összekapcsolása
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                // Távolság a két pont között
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // Ha elég közel vannak, vonalat húzunk
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(0, 91, 181, ${opacityValue})`; // Kék vonalak
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Interakció az egérrel: A hálózat rátapad az egérre
            let mouseDistance = ((particlesArray[a].x - mouseX) * (particlesArray[a].x - mouseX)) + 
                                ((particlesArray[a].y - mouseY) * (particlesArray[a].y - mouseY));
            if (mouseDistance < 25000) {
                opacityValue = 1 - (mouseDistance / 25000);
                // Erősebb bronz vonal az egérhez
                ctx.strokeStyle = `rgba(197, 131, 43, ${opacityValue})`; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }
    }

    // Ablak átméretezésének kezelése
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();


    // --- 3. TECH HACKER SZÖVEG DEKÓDOLÓ ANIMÁCIÓ ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const decoders = document.querySelectorAll(".dekodolo-szoveg");

    decoders.forEach(el => {
        let iterations = 0;
        const finalWord = el.dataset.ertek;
        const interval = setInterval(() => {
            el.innerText = finalWord.split("").map((letter, index) => {
                if(index < iterations) {
                    return finalWord[index];
                }
                return letters[Math.floor(Math.random() * 42)]
            }).join("");

            if(iterations >= finalWord.length){ 
                clearInterval(interval);
            }
            iterations += 1 / 3; // Sebesség beállítása
        }, 30);
    });

    // --- 4. GÖRDÍTÉS ANIMÁCIÓK (SCROLL REVEAL) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animacio-lathato');
                if(entry.target.classList.contains('idozitett-animacio-kontener')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animacio-lathato');
                        }, index * 150);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // --- 5. MOBIL MENÜ LOGIKA ---
    const hamburger = document.querySelector('.hamburger');
    const mobilMenu = document.querySelector('.mobil-menu');
    const mobilLinkek = document.querySelectorAll('.mobil-link');

    if (hamburger && mobilMenu) {
        // Kattintás a hamburgerre
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('aktiv');
            mobilMenu.classList.toggle('nyitva');
            // Megakadályozzuk a háttér görgetését, amíg nyitva a menü
            if (mobilMenu.classList.contains('nyitva')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Kattintás egy linkre a menüben (bezárja a menüt)
        mobilLinkek.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('aktiv');
                mobilMenu.classList.remove('nyitva');
                document.body.style.overflow = 'auto';
            });
        });
    }

    document.querySelectorAll('.animacio-fel').forEach(el => observer.observe(el));
    document.querySelectorAll('.idozitett-animacio-kontener').forEach(el => observer.observe(el));
});