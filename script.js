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
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 12000;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 0.4) - 0.2;
                this.directionY = (Math.random() * 0.4) - 0.2;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(197, 131, 43, 0.8)';
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

        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                        let opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(0, 91, 181, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });
        init();
        animate();
    }

    // --- 3. TECH HACKER SZÖVEG ---
    const decoders = document.querySelectorAll(".dekodolo-szoveg");
    decoders.forEach(el => {
        let iterations = 0;
        const finalWord = el.dataset.ertek || el.innerText;
        const interval = setInterval(() => {
            el.innerText = finalWord.split("").map((letter, index) => {
                if(index < iterations) return finalWord[index];
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
            }).join("");
            if(iterations >= finalWord.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    });

    // --- 4. SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animacio-lathato');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animacio-fel').forEach(el => observer.observe(el));

    // --- 5. MOBIL MENÜ (JAVÍTOTT VERZIÓ) ---
    const hamburger = document.querySelector('.hamburger');
    const mobilMenu = document.querySelector('.mobil-menu');
    const navLinkek = document.querySelectorAll('.mobil-menu .nav-link'); // A mobil menü linkjei

    if (hamburger && mobilMenu) {
        // Nyitás/Csukás a hamburgerre kattintva
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Megakadályozza, hogy a kattintás "átmenjen" a dokumentumra
            hamburger.classList.toggle('aktiv');
            mobilMenu.classList.toggle('nyitva');
        });

        // 1. Bezárás, ha rákattintasz egy linkre (oldalváltáskor)
        navLinkek.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('aktiv');
                mobilMenu.classList.remove('nyitva');
            });
        });

        // 2. Bezárás, ha a menün KÍVÜLRE kattintasz (például a háttérre)
        document.addEventListener('click', (e) => {
            if (mobilMenu.classList.contains('nyitva') && !mobilMenu.contains(e.target) && e.target !== hamburger) {
                hamburger.classList.remove('aktiv');
                mobilMenu.classList.remove('nyitva');
            }
        });
    }

    // --- 6. ŰRLAP KÜLDÉSE EMAILJS-SEL (AZ ÚJ RÉSZ) ---
    // IDE MÁSOLD BE A PUBLIC KEY-ED!
    emailjs.init("AuQik09ZXTeARRYns"); 

    const urlap = document.getElementById('zura-urlap');
    const urlapUzenet = document.getElementById('urlap-uzenet');
    const kuldesGombSzoveg = document.querySelector('#kuldes-gomb .gomb-szoveg');

    if (urlap) {
        urlap.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const eredetiSzoveg = kuldesGombSzoveg.innerText;
            kuldesGombSzoveg.innerText = "KÜLDÉS...";
            
            const templateParams = {
                name: urlap.querySelector('[name="name"]')?.value || "Név hiányzik",
                email: urlap.querySelector('[name="email"]')?.value || "Email hiányzik",
                subject: urlap.querySelector('[name="subject"]')?.value || "Nincs téma",
                message: urlap.querySelector('[name="message"]')?.value || "Üzenet hiányzik"
            };
            
            try {
                // IDE MÁSOLD BE A SERVICE ÉS TEMPLATE ID-KAT!
                const response = await emailjs.send(
                    'service_87ozc4b', 
                    'template_0zzjxnc', 
                    templateParams
                );

                if (response.status === 200) {
                    urlapUzenet.innerText = "Sikeres küldés! Hamarosan jelentkezünk.";
                    urlapUzenet.style.display = "block";
                    urlapUzenet.style.color = "#c5832b";
                    urlap.reset();
                }
            } catch (error) {
                console.error("Hiba:", error);
                urlapUzenet.innerText = "Hiba történt. Kérlek, próbáld újra!";
                urlapUzenet.style.display = "block";
                urlapUzenet.style.color = "red";
            } finally {
                kuldesGombSzoveg.innerText = eredetiSzoveg;
                setTimeout(() => { urlapUzenet.style.display = "none"; }, 5000);
            }
        });
    }

        window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        
        // Egy kis késleltetés (pl. 500ms), hogy ne csak elvillanjon, ha túl gyors a net
        setTimeout(() => {
            loader.classList.add('rejtett');
        }, 800);
    });
});