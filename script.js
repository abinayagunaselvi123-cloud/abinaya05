/**
 * Abinaya K - Portfolio Interactive Script
 * Features:
 * 1. Flying Bird Flock Canvas Physics & Wing Flapping
 * 2. Floating Blossom Petals & Fairy Sparkles Canvas
 * 3. Web Audio API Ambient Bird Chirp Synthesizer
 * 4. Typing Role Animation
 * 5. Interactive Project Filtering & Details Modals
 * 6. Certification Quick View
 * 7. Photo Upload & Local Storage Persistence
 * 8. Theme Palette Switcher (Blush, Lavender, Twilight)
 * 9. Smooth Scroll & Active Nav Highlights
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroScreen();
  initNavbar();
  initTypingEffect();
  initBirdsCanvas();
  initPetalsCanvas();
  initCursorEffect();
  initThemeToggle();
  initSoundSynthesizer();
  initProjectFiltering();
  initSkillObserver();
  initModals();
  initPhotoUpload();
  initScrollReveal();
  initTiltEffect();
  initClickSparkles();
  initHomeLoveEffects();
});

/* ==========================================================================
   0. 3-Second Feminine Animated Intro Screen
   ========================================================================== */
function initIntroScreen() {
  const intro = document.getElementById('intro-screen');
  const skipBtn = document.getElementById('intro-skip-btn');
  const replayBtn = document.getElementById('intro-replay-btn');
  if (!intro) return;

  let introTimeout = null;

  function startIntro() {
    intro.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    // Reset progress bar animation
    const progressBar = intro.querySelector('.intro-progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // trigger reflow
      progressBar.style.animation = 'intro-fill-bar 3s linear forwards';
    }

    clearTimeout(introTimeout);
    introTimeout = setTimeout(dismissIntro, 3000);
  }

  function dismissIntro() {
    clearTimeout(introTimeout);
    intro.classList.add('hide');
    document.body.style.overflow = '';
  }

  // Start on initial page load
  startIntro();

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', dismissIntro);
  }

  // Replay button click
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      startIntro();
      showToast('Replaying 3-second intro ✨');
    });
  }
}

/* ==========================================================================
   1. Navigation & Scroll Handling
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. Typing Effect for Hero Roles
   ========================================================================== */
function initTypingEffect() {
  const typedTarget = document.getElementById('typed-roles');
  if (!typedTarget) return;

  const roles = [
    'B.Sc Computer Science Student',
    'Web Application Developer',
    'JavaScript Enthusiast',
    'SQL & DBMS Practitioner',
    'Google & IBM Certified Learner',
    'Creative Designer with Canva'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1600;

  function type() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      typedTarget.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
    } else {
      typedTarget.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. Flying Birds Engine (Canvas Physics)
   ========================================================================== */
function initBirdsCanvas() {
  const canvas = document.getElementById('birds-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Bird Class
  class Bird {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -60;
      this.y = Math.random() * (height * 0.7) + 30;
      this.speed = Math.random() * 1.6 + 1.2;
      this.wingSpeed = Math.random() * 0.12 + 0.14;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.size = Math.random() * 6 + 10;
      this.color = Math.random() > 0.4 ? 'rgba(232, 99, 139, 0.75)' : 'rgba(154, 114, 214, 0.75)';
      this.verticalGlide = Math.random() * 0.4 - 0.2;
    }

    update() {
      this.x += this.speed;
      this.y += Math.sin(this.wingAngle * 0.5) * 0.6 + this.verticalGlide;
      this.wingAngle += this.wingSpeed;

      // Mouse gentle evasion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.y -= (120 - dist) * 0.03;
        this.x += (120 - dist) * 0.04;
      }

      if (this.x > width + 80 || this.y < -50 || this.y > height + 50) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Flapping wing calculation
      const wingY = Math.sin(this.wingAngle) * (this.size * 0.65);

      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw graceful bird silhouette
      ctx.beginPath();
      // Left wing tip -> center -> right wing tip
      ctx.moveTo(-this.size, wingY);
      ctx.quadraticCurveTo(-this.size * 0.3, -this.size * 0.2, 0, 0);
      ctx.quadraticCurveTo(this.size * 0.3, -this.size * 0.2, this.size, wingY);
      ctx.stroke();

      // Subtle bird body & tail
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.35, this.size * 0.15, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow around bird
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;

      ctx.restore();
    }
  }

  // Create flock
  const birdCount = Math.min(Math.floor(window.innerWidth / 120), 12);
  const flock = Array.from({ length: birdCount }, () => new Bird());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    flock.forEach(bird => {
      bird.update();
      bird.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. Floating Petals & Fairy Sparkles Canvas
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 7 + 5;
      this.speedY = Math.random() * 0.8 + 0.5;
      this.speedX = Math.random() * 0.7 - 0.1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.isSparkle = Math.random() > 0.65;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.5;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isSparkle) {
        // Draw 4-point sparkle star
        ctx.fillStyle = `rgba(245, 180, 200, ${this.opacity})`;
        ctx.shadowColor = 'rgba(232, 99, 139, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const s = this.size * 0.6;
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
      } else {
        // Draw delicate soft petal
        ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity * 0.65})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 50), 28);
  const petals = Array.from({ length: particleCount }, () => new Petal());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. Interactive Cursor Trail
   ========================================================================== */
function initCursorEffect() {
  const cursor = document.getElementById('cursor-glow');
  if (!cursor || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = `${curX}px`;
    cursor.style.top = `${curY}px`;
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   6. Theme Palette Switcher
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const themes = ['blush', 'lavender', 'twilight'];
  let currentThemeIdx = 0;

  // Check saved theme
  const saved = localStorage.getItem('abinaya_theme');
  if (saved && themes.includes(saved)) {
    document.documentElement.setAttribute('data-theme', saved);
    currentThemeIdx = themes.indexOf(saved);
  }

  themeBtn.addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const nextTheme = themes[currentThemeIdx];
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('abinaya_theme', nextTheme);
    showToast(`Switched theme to ${capitalize(nextTheme)} ✨`);
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ==========================================================================
   7. Web Audio API Ambient Nature & Bird Song Synthesizer
   ========================================================================== */
function initSoundSynthesizer() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (!soundBtn || !soundIcon) return;

  let audioCtx = null;
  let isPlaying = false;
  let chirpTimer = null;

  function playChirp() {
    if (!isPlaying || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Gentle pleasant bird frequency sweep (2.2kHz - 3.4kHz)
      const baseFreq = 2200 + Math.random() * 800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.16);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (err) {
      console.warn('Audio synthesis notice:', err);
    }

    // Schedule next random gentle chirp
    const nextDelay = Math.random() * 4000 + 2500;
    chirpTimer = setTimeout(playChirp, nextDelay);
  }

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      soundIcon.className = 'fa-solid fa-volume-high';
      showToast('Nature bird chimes enabled 🕊️');
      playChirp();
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      clearTimeout(chirpTimer);
      showToast('Nature sounds muted');
    }
  });
}

/* ==========================================================================
   8. Skill Progress Bars Observer
   ========================================================================== */
function initSkillObserver() {
  const skillSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (!skillSection || !progressBars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const target = bar.style.getPropertyValue('--target-width') || '80%';
          bar.style.width = target;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillSection);
}

/* ==========================================================================
   9. Project Filtering
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   10. Modals & Data Showcase
   ========================================================================== */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const quickResumeBtn = document.getElementById('quick-resume-btn');
  const projectTriggers = document.querySelectorAll('.project-modal-trigger');
  const certTriggers = document.querySelectorAll('.cert-preview-btn');

  function openModal(html) {
    if (!overlay || !content) return;
    content.innerHTML = html;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }

  // Resume Modal
  if (quickResumeBtn) {
    quickResumeBtn.addEventListener('click', () => {
      openModal(`
        <div class="resume-modal-body">
          <div style="text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent-rose); padding-bottom: 1rem;">
            <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2.2rem; color: var(--text-primary); margin-bottom: 0.25rem;">ABINAYA K</h2>
            <h4 style="color: var(--accent-rose); font-size: 1.1rem; letter-spacing: 1px;">B.SC COMPUTER SCIENCE STUDENT</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.4rem;">
              Morapur, Dharmapuri &bull; +91 6383101972 &bull; abinaya.dev.contact@gmail.com
            </p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--accent-rose); border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem; margin-bottom: 0.5rem; font-size: 1.1rem;">PROFESSIONAL SUMMARY</h4>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
              B.Sc Computer Science student with hands-on internship experience in web application development using JavaScript. Familiar with front-end development, database concepts, SQL, and DBMS. Skilled in Microsoft Excel and Canva, with a strong interest in learning new technologies and developing practical software solutions.
            </p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--accent-rose); border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem; margin-bottom: 0.5rem; font-size: 1.1rem;">INTERNSHIP EXPERIENCE</h4>
            <strong style="color: var(--text-primary);">Web Application Development Intern &ndash; NandGate IT Services Private Limited</strong>
            <span style="float: right; color: var(--text-muted); font-size: 0.88rem;">May 2026 – June 2026</span>
            <ul style="margin-top: 0.5rem; padding-left: 1.2rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              <li>Worked on web application development using JavaScript.</li>
              <li>Gained exposure to front-end and back-end concepts, database integration, and software development practices.</li>
              <li>Completed assigned tasks with professionalism and eagerness to learn.</li>
            </ul>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--accent-rose); border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem; margin-bottom: 0.5rem; font-size: 1.1rem;">PROJECTS</h4>
            <div style="margin-bottom: 0.6rem;">
              <strong>Web Application Development</strong> | <em style="color: var(--accent-rose);">JavaScript</em>
              <p style="font-size: 0.92rem; color: var(--text-secondary);">Developed and worked on web application features using JavaScript.</p>
            </div>
            <div>
              <strong>SQL Database Practice</strong> | <em style="color: var(--accent-rose);">SQL &bull; DBMS</em>
              <p style="font-size: 0.92rem; color: var(--text-secondary);">Worked with SQL queries, relational schemas, and database concepts.</p>
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--accent-rose); border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem; margin-bottom: 0.5rem; font-size: 1.1rem;">EDUCATION</h4>
            <strong>B.Sc Computer Science</strong> | Kongunadu Arts and Science College, Coimbatore
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Final Year Student</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--accent-rose); border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem; margin-bottom: 0.5rem; font-size: 1.1rem;">GLOBAL CERTIFICATIONS</h4>
            <ul style="padding-left: 1.2rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">
              <li>Generative AI for Data Scientist &ndash; IBM</li>
              <li>Artificial Intelligence Fundamentals &ndash; IBM</li>
              <li>Introduction to SQL</li>
              <li>Foundation of Data Science &ndash; Google</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 2rem;">
            <button onclick="window.print()" class="btn btn-primary">
              <i class="fa-solid fa-print"></i> Print / Save as PDF
            </button>
          </div>
        </div>
      `);
    });
  }

  // Project Modals
  projectTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-project');
      if (type === 'web-app') {
        openModal(`
          <div class="project-modal-detail">
            <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Web Application Development</h3>
            <span class="project-tag" style="margin-bottom: 1rem; display: inline-block;">JavaScript &bull; Frontend &bull; DOM Manipulation</span>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">
              This project encapsulates hands-on practical web development using JavaScript. It demonstrates structured UI architectures, asynchronous event processing, dynamic DOM rendering, and seamless user interaction workflows built during academic studies and internship.
            </p>
            <h4 style="color: var(--accent-rose); margin-bottom: 0.5rem;">Core Features:</h4>
            <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
              <li>Responsive single-page and multi-view design principles.</li>
              <li>Asynchronous JavaScript (Fetch/Promises) for smooth data handling.</li>
              <li>Client-side form validation, local state preservation, and dynamic UI feedback.</li>
            </ul>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
              <strong>Key Tech Stack:</strong> JavaScript (ES6+), HTML5, CSS3 Glassmorphism, Git.
            </div>
          </div>
        `);
      } else if (type === 'sql-db') {
        openModal(`
          <div class="project-modal-detail">
            <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">SQL Database Practice &amp; Management</h3>
            <span class="project-tag" style="margin-bottom: 1rem; display: inline-block;">SQL &bull; Relational DBMS &bull; Data Architecture</span>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">
              Comprehensive database design and query implementation project. Focuses on relational table structures, data normalization (1NF through 3NF), complex joins, subqueries, and transaction management.
            </p>
            <h4 style="color: var(--accent-rose); margin-bottom: 0.5rem;">Key Competencies:</h4>
            <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
              <li>Complex multi-table queries (INNER, LEFT, RIGHT, FULL OUTER JOIN).</li>
              <li>Aggregation queries with GROUP BY, HAVING, and window functions.</li>
              <li>Database constraints, primary/foreign key indexing, and ACID transaction rules.</li>
            </ul>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
              <strong>Key Tech Stack:</strong> SQL, Relational Database Management Systems (DBMS), MySQL/PostgreSQL schema models.
            </div>
          </div>
        `);
      } else if (type === 'ai-data') {
        openModal(`
          <div class="project-modal-detail">
            <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Generative AI &amp; Data Science Explorations</h3>
            <span class="project-tag" style="margin-bottom: 1rem; display: inline-block;">IBM &amp; Google Specializations &bull; AI Workflows</span>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">
              Applying theoretical and practical learnings from IBM Generative AI for Data Scientists and Google Foundation of Data Science certifications. Explores how generative models and structured data analysis intersect to automate problem-solving.
            </p>
            <h4 style="color: var(--accent-rose); margin-bottom: 0.5rem;">Key Learnings:</h4>
            <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
              <li>Prompt Engineering fundamentals &amp; Large Language Model integration patterns.</li>
              <li>Exploratory data analysis (EDA) techniques and statistical interpretations.</li>
              <li>Data-driven decision making and ethical AI governance principles.</li>
            </ul>
          </div>
        `);
      } else {
        openModal(`
          <div class="project-modal-detail">
            <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Visual Design &amp; Excel Analytics</h3>
            <span class="project-tag" style="margin-bottom: 1rem; display: inline-block;">Canva UI/UX &bull; Microsoft Excel &bull; Productivity</span>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">
              Bridging visual storytelling with structured data analysis. Combines high-impact visual design in Canva with advanced data organization and formula modeling in Microsoft Excel.
            </p>
            <h4 style="color: var(--accent-rose); margin-bottom: 0.5rem;">Highlights:</h4>
            <ul style="padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
              <li>Designed UI prototypes, infographic layouts, and presentation decks in Canva.</li>
              <li>Developed spreadsheet models with VLOOKUP, INDEX/MATCH, nested IF, and conditional formatting.</li>
              <li>Summarized complex data sets with automated Pivot Tables and visual chart dashboards.</li>
            </ul>
          </div>
        `);
      }
    });
  });

  // Cert Preview Modals
  certTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const cert = btn.getAttribute('data-cert');
      let title = '', issuer = '', desc = '';
      if (cert === 'ibm-genai') {
        title = 'Generative AI for Data Scientist';
        issuer = 'IBM';
        desc = 'Certified proficiency in generative AI architectures, prompt design, LLM fine-tuning concepts, and operationalizing generative models in computational data science workflows.';
      } else if (cert === 'ibm-ai') {
        title = 'Artificial Intelligence Fundamentals';
        issuer = 'IBM';
        desc = 'Certified understanding of machine learning algorithms, deep learning neural networks, computer vision, natural language understanding, and ethical considerations in AI deployment.';
      } else if (cert === 'sql-cert') {
        title = 'Introduction to SQL';
        issuer = 'Database Specialization';
        desc = 'Verified capability in constructing SQL queries, table modeling, transactional queries, database normalization, and query performance considerations.';
      } else {
        title = 'Foundation of Data Science';
        issuer = 'Google';
        desc = 'Comprehensive grounding in the data ecosystem, data preparation, statistical analysis, data visualization with charts, and translating analytical findings into business value.';
      }

      openModal(`
        <div style="text-align: center; padding: 1rem 0;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--gradient-rose); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 1rem; box-shadow: var(--shadow-md);">
            <i class="fa-solid fa-award"></i>
          </div>
          <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; color: var(--text-primary); margin-bottom: 0.4rem;">${title}</h3>
          <p style="color: var(--accent-rose); font-weight: 700; font-size: 1.1rem; margin-bottom: 1.25rem;">Issued by ${issuer}</p>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 1.5rem;">
            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Verification Summary:</h4>
            <p style="color: var(--text-secondary); line-height: 1.65; font-size: 0.95rem;">${desc}</p>
          </div>
          <button class="btn btn-primary" onclick="document.getElementById('modal-close-btn').click()">
            <i class="fa-solid fa-circle-check"></i> Close
          </button>
        </div>
      `);
    });
  });
}

/* ==========================================================================
   11. Profile Photo Upload / Local Storage Persistence
   ========================================================================== */
function initPhotoUpload() {
  const photoInput = document.getElementById('photo-upload-input');
  const mainImg = document.getElementById('main-profile-img');
  const aboutThumb = document.querySelector('.about-thumb-img');

  // Load saved photo if exists
  const savedPhoto = localStorage.getItem('abinaya_profile_photo');
  if (savedPhoto) {
    if (mainImg) mainImg.src = savedPhoto;
    if (aboutThumb) aboutThumb.src = savedPhoto;
  }

  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          const result = ev.target.result;
          if (mainImg) mainImg.src = result;
          if (aboutThumb) aboutThumb.src = result;
          try {
            localStorage.setItem('abinaya_profile_photo', result);
          } catch (err) {
            console.warn('Storage quota exceeded, photo will display for current session.');
          }
          showToast('Profile photo updated beautifully! 🌸');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

/* ==========================================================================
   12. Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   13. Scroll Reveal Stagger Animations
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.glass-panel, .timeline-item, .project-card, .cert-card, .highlight-card, .education-card');
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   14. Card 3D Tilt Micro-Interaction
   ========================================================================== */
function initTiltEffect() {
  if (window.innerWidth < 992) return;
  const cards = document.querySelectorAll('.project-card, .cert-card, .profile-card, .highlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   15. Interactive Click Sparkle Burst Effect
   ========================================================================== */
function initClickSparkles() {
  const symbols = ['✦', '🌸', '✨', '•', '✧'];

  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) return;

    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'click-sparkle';
      sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      
      const angle = (Math.PI * 2 * i) / 6 + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 45 + 25;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance}px`;

      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      sparkle.style.setProperty('--dx', dx);
      sparkle.style.setProperty('--dy', dy);
      sparkle.style.color = Math.random() > 0.5 ? 'var(--accent-rose)' : 'var(--accent-lavender)';

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 750);
    }
  });
}

/* ==========================================================================
   16. Home Page Floating Love Hearts & Interactive Reaction
   ========================================================================== */
function initHomeLoveEffects() {
  const container = document.getElementById('hero-love-particles');
  const loveBtn = document.getElementById('hero-love-btn');
  const loveCount = document.getElementById('love-count');
  const heartEmojis = ['💖', '💕', '💗', '🤍', '🌸', '✨'];

  // Load saved love count
  let count = parseInt(localStorage.getItem('abinaya_love_count')) || 128;
  if (loveCount) loveCount.textContent = count;

  // Ambient floating heart generator on home page
  if (container) {
    function spawnAmbientHeart() {
      if (document.hidden) return;
      const heart = document.createElement('span');
      heart.className = 'floating-love-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const startLeft = Math.random() * 95 + 2.5;
      const size = Math.random() * 14 + 18;
      const duration = Math.random() * 3 + 5;
      const wobble = `${(Math.random() - 0.5) * 80}px`;
      const rot = `${(Math.random() - 0.5) * 45}deg`;

      heart.style.left = `${startLeft}%`;
      heart.style.setProperty('--heart-size', `${size}px`);
      heart.style.setProperty('--heart-duration', `${duration}s`);
      heart.style.setProperty('--heart-wobble', wobble);
      heart.style.setProperty('--heart-rot', rot);

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }

    // Spawn ambient hearts every 1.6 seconds
    setInterval(spawnAmbientHeart, 1600);
    // Initial batch
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnAmbientHeart, i * 400);
    }
  }

  // Interactive "Send Love" Button Fountain Burst
  if (loveBtn) {
    loveBtn.addEventListener('click', e => {
      count++;
      if (loveCount) loveCount.textContent = count;
      localStorage.setItem('abinaya_love_count', count);

      // Button micro-bounce
      loveBtn.style.transform = 'scale(1.2)';
      setTimeout(() => { loveBtn.style.transform = ''; }, 220);

      // Fountain burst of hearts
      const rect = loveBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top;

      for (let i = 0; i < 14; i++) {
        const heart = document.createElement('span');
        heart.className = 'click-sparkle';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const angle = Math.PI * (Math.random() * 1.1 + 0.95); // upwards arc
        const distance = Math.random() * 90 + 50;
        const dx = `${Math.cos(angle) * distance}px`;
        const dy = `${Math.sin(angle) * distance - 40}px`;

        heart.style.left = `${originX}px`;
        heart.style.top = `${originY}px`;
        heart.style.fontSize = `${Math.random() * 10 + 20}px`;
        heart.style.setProperty('--dx', dx);
        heart.style.setProperty('--dy', dy);

        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 800);
      }

      showToast('Thank you for sending love! 💖🌸');
    });
  }
}
