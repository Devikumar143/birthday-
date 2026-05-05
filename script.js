/**
 * Unique Discovery Experience - Script V4
 */

// 0. Robust Loading Screen Logic
document.addEventListener('DOMContentLoaded', () => {
    let progress = 0;
    const loaderBar = document.getElementById('loader-bar');
    const progressText = document.getElementById('progress-text');
    const loader = document.getElementById('loader');

    const progressInterval = setInterval(() => {
        progress += Math.random() * 8; // Slightly slower, smoother steps
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        }
        if (loaderBar) loaderBar.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `${Math.floor(progress)}%`;
    }, 100);

    // Safety Fallback: Force hide loader after 6 seconds
    setTimeout(() => {
        document.body.classList.add('loaded');
        clearInterval(progressInterval);
    }, 6000);
});

function startJourney() {
    document.getElementById('landing').style.display = 'none';
}

// 1. Particle Cursor Trail (Hearts + Star Dust)
const colors = ['#ff2d75', '#9d4eff', '#00f2ff', '#fff'];

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return; // Optimize performance
    
    const container = document.body;
    const dot = document.createElement('div');
    dot.className = Math.random() > 0.5 ? 'heart-trail' : 'star-dust';
    
    const size = Math.random() * 15 + 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${e.pageX}px`;
    dot.style.top = `${e.pageY}px`;
    dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random velocity
    const vx = (Math.random() - 0.5) * 40;
    const vy = (Math.random() - 0.5) * 40;
    dot.style.setProperty('--vx', `${vx}px`);
    dot.style.setProperty('--vy', `${vy}px`);
    
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 1000);
});

// 2. Reveal Animations on Scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-content').forEach(el => revealObserver.observe(el));

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];

    // Heart Trail for Mobile
    if (Math.random() > 0.8) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'trail-heart';
        heart.style.left = touch.clientX + 'px';
        heart.style.top = touch.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});



// 2. Starfield Logic
const starCanvas = document.getElementById('starfield');
const sCtx = starCanvas.getContext('2d');
let sw, sh, stars = [], petals = [];
let isMorphing = false;

class Petal {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * sw;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rot = Math.random() * 360;
        this.rotS = Math.random() * 2 - 1;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rot += this.rotS;
        if(this.y > sh) this.reset();
    }
    draw() {
        sCtx.save();
        sCtx.translate(this.x, this.y);
        sCtx.rotate(this.rot * Math.PI / 180);
        sCtx.fillStyle = 'rgba(255, 77, 109, 0.4)';
        sCtx.beginPath();
        sCtx.ellipse(0, 0, this.size, this.size/1.5, 0, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.restore();
    }
}

function initStars() {
    sw = starCanvas.width = window.innerWidth;
    sh = starCanvas.height = window.innerHeight;
    stars = [];
    petals = [];
    for(let i=0; i<300; i++) {
        stars.push({
            x: Math.random() * sw,
            y: Math.random() * sh,
            baseX: Math.random() * sw,
            baseY: Math.random() * sh,
            targetX: null,
            targetY: null,
            s: Math.random() * 2,
            o: Math.random()
        });
    }
    for(let i=0; i<25; i++) petals.push(new Petal());
}

function drawStars() {
    sCtx.clearRect(0,0,sw,sh);
    stars.forEach(s => {
        if(isMorphing && s.targetX !== null) {
            s.x += (s.targetX - s.x) * 0.05;
            s.y += (s.targetY - s.y) * 0.05;
            sCtx.fillStyle = `rgba(255, 0, 127, ${s.o})`;
            sCtx.shadowBlur = 10;
            sCtx.shadowColor = '#ff007f';
        } else {
            s.x = (s.x + 0.2) % sw;
            sCtx.fillStyle = `rgba(255,255,255,${s.o})`;
            sCtx.shadowBlur = 0;
        }
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.s, 0, Math.PI*2);
        sCtx.fill();
    });
    petals.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(drawStars);
}

initStars();
drawStars();



// 4. Experience Logic
function startJourney() {
    const music = document.getElementById('bg-music');
    if(music && music.paused) music.play().catch(() => {});
    const countdown = document.getElementById('countdown');
    if(countdown) countdown.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('click', () => {
    const music = document.getElementById('bg-music');
    if(music && music.paused) music.play().catch(() => {});
}, { once: true });

// 5. Countdown — Birthday: May 29, 2026
const bDay = new Date(2026, 4, 29, 0, 0, 0).getTime();
let birthdayTriggered = false;

function updateTimer() {
    const now = new Date().getTime();
    const d = bDay - now;

    if (d <= 0) {
        if (!birthdayTriggered) {
            birthdayTriggered = true;
            triggerBirthdayMode();
        }
        return;
    }

    const days    = Math.floor(d / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((d % (1000 * 60)) / 1000);
    const dEl = document.getElementById('days'), hEl = document.getElementById('hours'),
          mEl = document.getElementById('minutes'), sEl = document.getElementById('seconds');
    if(dEl) dEl.innerText = days.toString().padStart(2,'0');
    if(hEl) hEl.innerText = hours.toString().padStart(2,'0');
    if(mEl) mEl.innerText = minutes.toString().padStart(2,'0');
    if(sEl) sEl.innerText = seconds.toString().padStart(2,'0');
}

function triggerBirthdayMode() {
    const countdownDisplay = document.getElementById('countdown-display');
    const bdayMode = document.getElementById('birthday-mode');
    if (countdownDisplay) { countdownDisplay.style.transition = '1s'; countdownDisplay.style.opacity = '0'; setTimeout(() => countdownDisplay.style.display = 'none', 1000); }
    if (bdayMode) { setTimeout(() => { bdayMode.style.display = 'block'; }, 1200); }
    setTimeout(startConfetti, 1400);
}

function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#ff007f','#7a00ff','#00d4ff','#ffdb4d','#ff4d6d','#fff'];
    const emojis = ['🎉','💖','✨','🎂','🌟'];
    const pieces = Array.from({length: 130}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 14 + 6,
        h: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: Math.random() > 0.72 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
        rot: Math.random() * 360,
        rotSpeed: Math.random() * 4 - 2,
        speedY: Math.random() * 2.5 + 1.5,
        speedX: Math.random() * 2 - 1,
    }));
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY; p.x += p.speedX; p.rot += p.rotSpeed;
            if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            if (p.emoji) { ctx.font = '20px serif'; ctx.fillText(p.emoji, 0, 0); }
            else { ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); }
            ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

setInterval(updateTimer, 1000);
updateTimer();

// 6. Reveal Secret
function revealSecret() {
    const btn = document.getElementById('reveal-btn'), txt = document.getElementById('secret-text');
    if(btn) btn.style.display = 'none';
    if(txt) { txt.style.display = 'block'; txt.style.animation = 'fadeIn 2s'; }
}

// 7. Automatic Finale Reveal
function revealFinale() {
    const letter = document.getElementById('final-letter');
    for(let i=0; i<60; i++) { setTimeout(createParticle, i * 30); }
    const message = "Life is 100% better with you as my best friend... I hope you have the best year ever!";
    setTimeout(() => { typeWriter(message, letter); }, 1000);
}

function typeWriter(text, element, i = 0) {
    if (element && i < text.length) {
        element.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, element, i + 1), 60);
    }
}

function createParticle() {
    const p = document.createElement('div');
    p.innerHTML = '❤️';
    p.style.position = 'fixed';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '110vh';
    p.style.fontSize = Math.random() * 25 + 15 + 'px';
    p.style.transition = '4s cubic-bezier(0.1, 0.5, 0.1, 1)';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '1000';
    p.style.filter = 'drop-shadow(0 0 10px var(--accent-pink))';
    document.body.appendChild(p);
    setTimeout(() => {
        p.style.transform = `translateY(-130vh) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
    }, 50);
    setTimeout(() => p.remove(), 4000);
}

// 8. Constellation Connector Logic (FULL CANVAS REWRITE)
const cCanvas = document.getElementById('constellation-canvas');
const cCtx = cCanvas ? cCanvas.getContext('2d') : null;

// Heart-shaped star positions inside the 320x320 canvas
const starPoints = [
    {x: 160, y: 80},   // Top center
    {x: 90,  y: 50},   // Top left
    {x: 40,  y: 110},  // Left
    {x: 60,  y: 190},  // Bottom left
    {x: 160, y: 270},  // Bottom center (tip)
    {x: 260, y: 190},  // Bottom right
    {x: 280, y: 110},  // Right
    {x: 230, y: 50},   // Top right
];

let clickedStars = [];   // Indices in click order
let constellationDone = false;

function drawConstellation() {
    if (!cCtx) return;
    cCtx.clearRect(0, 0, 320, 320);

    // Draw connecting lines first (below stars)
    if (clickedStars.length > 1) {
        cCtx.beginPath();
        cCtx.strokeStyle = 'rgba(255, 0, 127, 0.9)';
        cCtx.lineWidth = 3;
        cCtx.shadowBlur = 18;
        cCtx.shadowColor = '#ff007f';
        cCtx.lineCap = 'round';
        clickedStars.forEach((idx, i) => {
            const p = starPoints[idx];
            if (i === 0) cCtx.moveTo(p.x, p.y);
            else cCtx.lineTo(p.x, p.y);
        });
        if (constellationDone) {
            // Close the heart
            const first = starPoints[clickedStars[0]];
            cCtx.lineTo(first.x, first.y);
        }
        cCtx.stroke();
        cCtx.shadowBlur = 0;
    }

    // Draw all stars
    starPoints.forEach((p, i) => {
        const isClicked = clickedStars.includes(i);
        cCtx.beginPath();
        cCtx.arc(p.x, p.y, isClicked ? 10 : 7, 0, Math.PI * 2);

        // Glow
        cCtx.shadowBlur = isClicked ? 30 : 15;
        cCtx.shadowColor = isClicked ? '#ff007f' : '#fff';

        cCtx.fillStyle = isClicked ? '#ff007f' : '#ffffff';
        cCtx.fill();

        // Outer ring for unclicked stars
        if (!isClicked) {
            cCtx.beginPath();
            cCtx.arc(p.x, p.y, 14, 0, Math.PI * 2);
            cCtx.strokeStyle = 'rgba(255,255,255,0.15)';
            cCtx.lineWidth = 1;
            cCtx.stroke();
        }

        cCtx.shadowBlur = 0;
    });
}

function handleConstellationClick(e) {
    if (constellationDone || !cCanvas) return;
    const rect = cCanvas.getBoundingClientRect();
    const scaleX = 320 / rect.width;
    const scaleY = 320 / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // Check if tap is within 28px of any star
    for (let i = 0; i < starPoints.length; i++) {
        const p = starPoints[i];
        const dist = Math.hypot(cx - p.x, cy - p.y);
        if (dist < 28 && !clickedStars.includes(i)) {
            clickedStars.push(i);
            drawConstellation();

            if (clickedStars.length === starPoints.length) {
                constellationDone = true;
                drawConstellation();
                // Update hint
                const hint = document.getElementById('constellation-hint');
                if (hint) hint.innerText = 'Our bond is eternal... ✨';
                setTimeout(completeHeart, 1500);
            }
            return;
        }
    }
}

if (cCanvas) {
    cCanvas.addEventListener('click', handleConstellationClick);
    cCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleConstellationClick(e.touches[0]);
    }, { passive: false });
    drawConstellation(); // Initial draw
}

function completeHeart() {
    const hintText = document.getElementById('constellation-hint');
    if(hintText) hintText.innerText = "Our bond is eternal... ✨";
    if(cCanvas) {
        cCanvas.style.transition = '2s';
        cCanvas.style.filter = 'drop-shadow(0 0 50px #ff007f)';
    }
    setTimeout(() => {
        const sect = document.getElementById('constellation-section');
        if(sect) {
            sect.style.transition = '2s';
            sect.style.opacity = '0';
            setTimeout(() => {
                sect.style.display = 'none';
                const finale = document.getElementById('finale');
                if(finale) {
                    finale.style.display = 'flex';
                    finale.style.opacity = '0';
                    setTimeout(() => {
                        finale.style.transition = '2s';
                        finale.style.opacity = '1';
                        revealFinale();
                    }, 100);
                }
            }, 2000);
        }
    }, 1500);
}

// initConstellation removed — canvas handles its own init via drawConstellation()

// 9. Premium 3D Orbiting Wheel Logic
const wheel = document.getElementById('gallery-wheel');
const wheelScene = document.querySelector('.gallery-scene');
let currentRotateY = 0;
let targetRotateY = 0;
let isDraggingWheel = false;
let startXWheel = 0;
let velocityWheel = 0;

function initWheel() {
    if (!wheel || !wheelScene) return;
    
    const animate = () => {
        if (!isDraggingWheel) {
            targetRotateY -= 0.15; // Natural drift
            velocityWheel *= 0.95; 
            targetRotateY += velocityWheel;
        }
        
        currentRotateY += (targetRotateY - currentRotateY) * 0.08;
        wheel.style.transform = `rotateX(-5deg) rotateY(${currentRotateY}deg)`;
        requestAnimationFrame(animate);
    };
    
    const handleStart = (e) => {
        isDraggingWheel = true;
        startXWheel = (e.pageX || e.touches[0].pageX);
        velocityWheel = 0;
    };
    
    const handleMove = (e) => {
        if (!isDraggingWheel) return;
        const x = (e.pageX || e.touches[0].pageX);
        const walk = (x - startXWheel) * 0.25;
        targetRotateY += walk;
        velocityWheel = walk;
        startXWheel = x;
    };
    
    const handleEnd = () => { isDraggingWheel = false; };
    
    // Attach to the SCENE instead of just the wheel for a better touch area
    wheelScene.addEventListener('mousedown', handleStart);
    wheelScene.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    
    animate();
}

initWheel();

// 10. Memory Match Game Logic
const gameImages = [
    'image.png', 'image copy.png', 'image copy 4.png', 
    'image copy 5.png', 'image copy 2.png', 'image copy 3.png'
];
const grid = document.getElementById('memory-grid');
const flipDisplay = document.getElementById('flip-count');
const winMsg = document.getElementById('game-win-message');

let cards = [];
let flippedCards = [];
let flips = 0;
let matchedCount = 0;

function initGame() {
    if (!grid) return;
    grid.innerHTML = '';
    cards = [...gameImages, ...gameImages];
    cards.sort(() => Math.random() - 0.5);
    flips = 0;
    matchedCount = 0;
    flipDisplay.innerText = flips;
    winMsg.style.display = 'none';

    cards.forEach((img, i) => {
        const card = document.createElement('div');
        card.classList.add('memory-card-game');
        card.dataset.img = img;
        card.innerHTML = `
            <div class="card-face card-front">✦</div>
            <div class="card-face card-back"><img src="${img}" alt="memory"></div>
        `;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            flips++;
            flipDisplay.innerText = flips;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.img === c2.dataset.img) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        flippedCards = [];
        matchedCount += 2;
        if (matchedCount === cards.length) {
            winMsg.style.display = 'block';
        }
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    initGame();
}

initGame();

// 11. Star Catcher Game Logic
const catcherGame = document.getElementById('catcher-game');
const catcherBasket = document.getElementById('catcher-basket');
const catcherVal = document.getElementById('catcher-val');
const catcherWin = document.getElementById('catcher-win-message');
const catcherStart = document.getElementById('catcher-start-msg');

let catcherScore = 0;
let gameActive = false;
let stars = [];

function startCatcher() {
    if (gameActive) return;
    gameActive = true;
    catcherScore = 0;
    catcherVal.innerText = 0;
    catcherStart.style.display = 'none';
    catcherWin.style.display = 'none';
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;

    // Spawn Stars
    if (Math.random() < 0.05) {
        spawnStar();
    }

    // Move Stars
    stars.forEach((star, index) => {
        let top = parseFloat(star.style.top) || 0;
        top += 3 + (catcherScore * 0.1); // Accelerate
        star.style.top = top + 'px';

        // Collision Check
        const sRect = star.getBoundingClientRect();
        const bRect = catcherBasket.getBoundingClientRect();

        if (sRect.bottom >= bRect.top && sRect.right >= bRect.left && sRect.left <= bRect.right) {
            catcherScore++;
            catcherVal.innerText = catcherScore;
            star.remove();
            stars.splice(index, 1);
            if (catcherScore >= 20) winCatcher();
        } else if (top > 400) {
            star.remove();
            stars.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

function spawnStar() {
    const star = document.createElement('div');
    star.className = 'falling-star';
    star.innerText = Math.random() > 0.3 ? '✦' : '✨';
    star.style.left = Math.random() * 90 + '%';
    star.style.top = '-20px';
    catcherGame.appendChild(star);
    stars.push(star);
}

function winCatcher() {
    gameActive = false;
    catcherWin.style.display = 'block';
    // Clean up
    stars.forEach(s => s.remove());
    stars = [];
}

function moveBasket(e) {
    if (!gameActive) return;
    const rect = catcherGame.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const pos = Math.max(20, Math.min(x, rect.width - 20));
    catcherBasket.style.left = pos + 'px';
}

catcherGame.addEventListener('mousemove', moveBasket);
catcherGame.addEventListener('touchmove', moveBasket, { passive: true });
catcherGame.addEventListener('click', startCatcher);
