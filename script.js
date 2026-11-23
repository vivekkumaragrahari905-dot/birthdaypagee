/* ===================================================
   Happy Birthday Prem Ghosh - Celebration JavaScript
   =================================================== */

// --- 1. Background Sparkling Canvas & Particles ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let confettiParticles = [];
let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class AmbientStar {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.color = ['#fbc02d', '#ec4899', '#8b5cf6', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 5)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.015;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Populate ambient stars
for (let i = 0; i < 65; i++) {
    particles.push(new AmbientStar());
}

// Confetti Particle Class (Works completely offline!)
class ConfettiPiece {
    constructor(x, y) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * -height * 0.3;
        this.size = Math.random() * 9 + 6;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = Math.random() * 4 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 12;
        this.color = ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#38bdf8', '#fb7185', '#ffd700'][Math.floor(Math.random() * 7)];
        this.opacity = 1;
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedX *= 0.98;
        this.speedY += 0.06; // gravity
        if (this.y > height + 20) {
            this.opacity -= 0.05;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        if (this.shape === 'rect') {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function launchConfetti(count = 70, startX = width / 2, startY = height / 3) {
    for (let i = 0; i < count; i++) {
        confettiParticles.push(new ConfettiPiece(startX, startY));
    }
}

// Canvas Render Loop
function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw ambient particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw confetti particles
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const c = confettiParticles[i];
        c.update();
        c.draw();
        if (c.opacity <= 0 || c.y > height + 50) {
            confettiParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Initial welcome confetti shower
window.addEventListener('load', () => {
    launchConfetti(80, width / 2, height / 4);
    setTimeout(() => launchConfetti(50, width * 0.25, height / 3), 500);
    setTimeout(() => launchConfetti(50, width * 0.75, height / 3), 900);
});

// --- 2. Floating Balloons System ---
const balloonContainer = document.getElementById('balloon-container');
const balloonColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

function spawnBalloon() {
    if (!balloonContainer) return;
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.backgroundColor = color;
    balloon.style.color = color;
    balloon.style.left = Math.random() * 92 + 4 + '%';
    const duration = Math.random() * 8 + 8; // 8 - 16s
    balloon.style.animationDuration = duration + 's';
    
    // Click balloon to pop it!
    balloon.addEventListener('click', (e) => {
        launchConfetti(25, e.clientX, e.clientY);
        playPopSound();
        balloon.remove();
    });

    balloonContainer.appendChild(balloon);

    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, duration * 1000);
}

// Continuously spawn balloons periodically
setInterval(spawnBalloon, 2200);
for (let i = 0; i < 4; i++) {
    setTimeout(spawnBalloon, i * 700);
}

// --- 3. Web Audio API (Birthday Melody & Chimes) ---
let audioCtx = null;
let isMelodyPlaying = false;
let melodyTimeoutId = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Note frequencies (Hz)
const NOTES = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'F5': 698.46
};

// "Happy Birthday to you" sheet
const birthdayTune = [
    { note: 'C4', duration: 0.35, pause: 0.05 },
    { note: 'C4', duration: 0.25, pause: 0.05 },
    { note: 'D4', duration: 0.6, pause: 0.05 },
    { note: 'C4', duration: 0.6, pause: 0.05 },
    { note: 'F4', duration: 0.6, pause: 0.05 },
    { note: 'E4', duration: 1.1, pause: 0.2 },

    { note: 'C4', duration: 0.35, pause: 0.05 },
    { note: 'C4', duration: 0.25, pause: 0.05 },
    { note: 'D4', duration: 0.6, pause: 0.05 },
    { note: 'C4', duration: 0.6, pause: 0.05 },
    { note: 'G4', duration: 0.6, pause: 0.05 },
    { note: 'F4', duration: 1.1, pause: 0.2 },

    { note: 'C4', duration: 0.35, pause: 0.05 },
    { note: 'C4', duration: 0.25, pause: 0.05 },
    { note: 'C5', duration: 0.6, pause: 0.05 },
    { note: 'A4', duration: 0.6, pause: 0.05 },
    { note: 'F4', duration: 0.6, pause: 0.05 },
    { note: 'E4', duration: 0.6, pause: 0.05 },
    { note: 'D4', duration: 1.0, pause: 0.2 },

    { note: 'B4', duration: 0.35, pause: 0.05 },
    { note: 'B4', duration: 0.25, pause: 0.05 },
    { note: 'A4', duration: 0.6, pause: 0.05 },
    { note: 'F4', duration: 0.6, pause: 0.05 },
    { note: 'G4', duration: 0.6, pause: 0.05 },
    { note: 'F4', duration: 1.3, pause: 0.3 }
];

function playNote(freq, duration) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle'; // Smooth mellow bell chime
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
}

function playPopSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
        // Audio policy or silent
    }
}

function playCelebrationFanfare() {
    const ctx = getAudioContext();
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
        setTimeout(() => {
            playNote(freq, 0.45);
        }, idx * 110);
    });
}

function playBirthdayMelody() {
    if (isMelodyPlaying) {
        stopBirthdayMelody();
        return;
    }

    isMelodyPlaying = true;
    const btn = document.getElementById('musicToggleBtn');
    if (btn) btn.innerHTML = `<span class="icon">⏸️</span> <span class="btn-text">Pause Music</span>`;

    let currentStep = 0;

    function playNext() {
        if (!isMelodyPlaying || currentStep >= birthdayTune.length) {
            if (isMelodyPlaying) {
                // Loop melody smoothly
                currentStep = 0;
                melodyTimeoutId = setTimeout(playNext, 1000);
            }
            return;
        }

        const step = birthdayTune[currentStep];
        const freq = NOTES[step.note];
        if (freq) {
            playNote(freq, step.duration);
        }

        currentStep++;
        const totalDuration = (step.duration + step.pause) * 1000;
        melodyTimeoutId = setTimeout(playNext, totalDuration);
    }

    playNext();
}

function stopBirthdayMelody() {
    isMelodyPlaying = false;
    clearTimeout(melodyTimeoutId);
    const btn = document.getElementById('musicToggleBtn');
    if (btn) btn.innerHTML = `<span class="icon">🎵</span> <span class="btn-text">Play Birthday Music</span>`;
}

// Connect floating music button
document.getElementById('musicToggleBtn')?.addEventListener('click', () => {
    playBirthdayMelody();
});

document.getElementById('confettiShowerBtn')?.addEventListener('click', (e) => {
    launchConfetti(90, e.clientX || width / 2, e.clientY || height / 3);
    playCelebrationFanfare();
});

// --- 4. Interactive Cake & Candles ---
let candlesBlown = false;

function blowCandles() {
    const flames = document.querySelectorAll('.flame');
    const statusText = document.getElementById('candleStatusText');
    const blowBtn = document.getElementById('blowCandleBtn');

    if (!candlesBlown) {
        flames.forEach(flame => flame.classList.add('blown'));
        candlesBlown = true;
        
        if (statusText) {
            statusText.textContent = "🎉 Wish Made! Happy Birthday Prem Ghosh! 🥳";
            statusText.style.color = "#ec4899";
        }
        if (blowBtn) {
            blowBtn.textContent = "🕯️ Re-light Candles";
        }

        // Trigger big celebratory moments
        launchConfetti(120, width / 2, height * 0.4);
        playCelebrationFanfare();
    } else {
        // Relight candles
        flames.forEach(flame => flame.classList.remove('blown'));
        candlesBlown = false;
        if (statusText) {
            statusText.textContent = "Candles are glowing bright! ✨";
            statusText.style.color = "#fde047";
        }
        if (blowBtn) {
            blowBtn.textContent = "💨 Blow Out The Candles!";
        }
    }
}

// --- 5. Video Player Handlers ---
const birthdayVideo = document.getElementById('birthdayVideo');
const videoOverlay = document.getElementById('videoOverlay');
const playPauseIcon = document.getElementById('playPauseIcon');
const playPauseText = document.getElementById('playPauseText');
const muteIcon = document.getElementById('muteIcon');
const customVideoInput = document.getElementById('customVideoInput');

function startVideoPlayback() {
    if (videoOverlay) videoOverlay.classList.add('hidden');
    if (birthdayVideo) {
        birthdayVideo.play().then(() => {
            if (playPauseIcon) playPauseIcon.textContent = '⏸️';
            if (playPauseText) playPauseText.textContent = 'Pause Video';
        }).catch(err => {
            console.log("Autoplay check:", err);
            birthdayVideo.controls = true;
        });
    }
    launchConfetti(40, width / 2, height / 2);
}

function toggleVideoPlay() {
    if (!birthdayVideo) return;
    if (birthdayVideo.paused) {
        birthdayVideo.play();
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (playPauseIcon) playPauseIcon.textContent = '⏸️';
        if (playPauseText) playPauseText.textContent = 'Pause Video';
    } else {
        birthdayVideo.pause();
        if (playPauseIcon) playPauseIcon.textContent = '▶️';
        if (playPauseText) playPauseText.textContent = 'Play Video';
    }
}

function toggleVideoMute() {
    if (!birthdayVideo) return;
    birthdayVideo.muted = !birthdayVideo.muted;
    if (muteIcon) {
        muteIcon.textContent = birthdayVideo.muted ? '🔇' : '🔊';
    }
}

function restartVideo() {
    if (!birthdayVideo) return;
    birthdayVideo.currentTime = 0;
    birthdayVideo.play();
    if (videoOverlay) videoOverlay.classList.add('hidden');
    if (playPauseIcon) playPauseIcon.textContent = '⏸️';
    if (playPauseText) playPauseText.textContent = 'Pause Video';
}

// Support choosing any video file from user's device
if (customVideoInput) {
    customVideoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && birthdayVideo) {
            const fileURL = URL.createObjectURL(file);
            birthdayVideo.src = fileURL;
            birthdayVideo.load();
            startVideoPlayback();
            alert(`✅ Video "${file.name}" loaded successfully!`);
        }
    });
}

// Sync video controls with buttons
if (birthdayVideo) {
    birthdayVideo.addEventListener('play', () => {
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (playPauseIcon) playPauseIcon.textContent = '⏸️';
        if (playPauseText) playPauseText.textContent = 'Pause Video';
    });
    birthdayVideo.addEventListener('pause', () => {
        if (playPauseIcon) playPauseIcon.textContent = '▶️';
        if (playPauseText) playPauseText.textContent = 'Play Video';
    });
}

// --- 6. Smooth Scroll Helper ---
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// --- 7. Interactive Wish Wall (localStorage) ---
const defaultWishes = [
    {
        sender: "Rahul Sharma",
        emoji: "🔥",
        message: "Happy Birthday Prem! May this year take your career and happiness to new heights! Party hard bro! 🍻",
        time: "Just now"
    },
    {
        sender: "Ananya & Group",
        emoji: "👑",
        message: "Wishing the coolest person Prem Ghosh a fabulous birthday! Keep shining and spreading smiles always! 🌟",
        time: "1 hour ago"
    },
    {
        sender: "Vikas & Family",
        emoji: "❤️",
        message: "जन्मदिन मुबारक प्रेम भाई! भगवान आपको हमेशा स्वस्थ और खुश रखे। बहुत सारा प्यार!",
        time: "Today"
    }
];

function getStoredWishes() {
    try {
        const saved = localStorage.getItem('prem_birthday_wishes');
        return saved ? JSON.parse(saved) : defaultWishes;
    } catch (e) {
        return defaultWishes;
    }
}

function saveWishes(wishes) {
    try {
        localStorage.setItem('prem_birthday_wishes', JSON.stringify(wishes));
    } catch (e) {
        console.warn("Could not save to localStorage", e);
    }
}

function renderWishWall() {
    const wallGrid = document.getElementById('wishesWallGrid');
    if (!wallGrid) return;
    const wishes = getStoredWishes();
    wallGrid.innerHTML = '';

    wishes.forEach(w => {
        const card = document.createElement('div');
        card.className = 'wish-note-card';
        card.innerHTML = `
            <div class="wish-note-header">
                <span class="wish-sender-name">${escapeHTML(w.sender)}</span>
                <span class="wish-note-emoji">${w.emoji || '🎉'}</span>
            </div>
            <p class="wish-note-body">${escapeHTML(w.message)}</p>
            <div class="wish-note-time">${escapeHTML(w.time || 'Recently')}</div>
        `;
        wallGrid.appendChild(card);
    });
}

function handleWishSubmit(e) {
    e.preventDefault();
    const senderInput = document.getElementById('wishSender');
    const msgInput = document.getElementById('wishMessage');
    const emojiInput = document.getElementById('wishEmojiSelect');

    const sender = senderInput.value.trim();
    const message = msgInput.value.trim();
    const emoji = emojiInput.value;

    if (!sender || !message) return;

    const newWish = {
        sender,
        message,
        emoji,
        time: "Just now"
    };

    const wishes = getStoredWishes();
    wishes.unshift(newWish);
    saveWishes(wishes);
    renderWishWall();

    // Reset inputs
    senderInput.value = '';
    msgInput.value = '';

    // Confetti reaction
    launchConfetti(80, width / 2, height * 0.7);
    playCelebrationFanfare();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Initial Wish Wall Render
renderWishWall();

// --- 8. Lightbox Gallery Handlers ---
const galleryPhotos = [
    { src: 'photo1.jpeg', title: '🌟 Handsome Smile - Prem Ghosh' },
    { src: 'photo2.jpeg', title: '🔥 Rockstar Vibes' },
    { src: 'photo3.jpeg', title: '👑 King Style - Timeless Elegance' },
    { src: 'photo4.jpeg', title: '🎉 Sweet Smile & Pure Joy' },
    { src: 'photo5.jpeg', title: '💫 Unstoppable Energy' },
    { src: 'photo6.jpeg', title: '🌈 Good Vibes Only' },
    { src: 'photo7.jpeg', title: '🥳 Celebration & Memories' },
    { src: 'photo8.jpeg', title: '📸 Candid Moment' },
    { src: 'photo9.jpeg', title: '💎 Rare Charm' },
    { src: 'photo10.jpeg', title: '🏆 Life of the Party' }
];

let currentPhotoIndex = 0;
const lightboxModal = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(index) {
    if (index < 0 || index >= galleryPhotos.length) return;
    currentPhotoIndex = index;
    updateLightboxContent();
    if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent bg scrolling
    }
}

function updateLightboxContent() {
    const photo = galleryPhotos[currentPhotoIndex];
    if (lightboxImg && photo) {
        lightboxImg.src = photo.src;
    }
    if (lightboxCaption && photo) {
        lightboxCaption.textContent = photo.title;
    }
}

function closeLightbox(event) {
    if (event && event.target && (event.target.classList.contains('lightbox-nav') || event.target.id === 'lightboxImg')) {
        return;
    }
    if (lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(dir, event) {
    if (event) event.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex + dir + galleryPhotos.length) % galleryPhotos.length;
    updateLightboxContent();
}

// Keyboard shortcuts for Lightbox
window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});
