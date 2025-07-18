// Futuristic Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initCustomCursor();
  initHeroBlob();
  initTypingAnimation();
  initSmoothScrolling();
  initMagneticEffects();
  initNavbarEffects();
  initThemeToggle();
  initFloatingElements();
  initScrollAnimations();
  initFormEffects();
  initSkillsOrbit();
  initMatrixRain();
  initColorPlayground(); // Add this line
});

// ===== CUSTOM CURSOR SYSTEM =====
function initCustomCursor() {
  const cursorCore = document.getElementById('custom-cursor-core');
  const cursorRing = document.getElementById('custom-cursor-ring');
  const cursorTrail = document.getElementById('custom-cursor-trail');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;
  let trailX = 0, trailY = 0;
  
  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Hide cursor on inputs
  const inputs = document.querySelectorAll('input, textarea, button, a');
  inputs.forEach(input => {
    input.addEventListener('mouseenter', () => {
      cursorCore.style.opacity = '0';
      cursorRing.style.opacity = '0';
      cursorTrail.style.opacity = '0';
    });
    
    input.addEventListener('mouseleave', () => {
      cursorCore.style.opacity = '1';
      cursorRing.style.opacity = '1';
      cursorTrail.style.opacity = '1';
    });
  });
  
  // Cursor animation loop
  function animateCursor() {
    // Smooth cursor core
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    // Slower ring
    ringX += (mouseX - ringX) * 0.05;
    ringY += (mouseY - ringY) * 0.05;
    
    // Trailing effect
    trailX += (mouseX - trailX) * 0.02;
    trailY += (mouseY - trailY) * 0.02;
    
    // Apply transforms
    cursorCore.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
    cursorTrail.style.transform = `translate(${trailX - 2}px, ${trailY - 2}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Hover effects
  document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('magnetic') || 
        e.target.classList.contains('btn') || 
        e.target.classList.contains('nav-link')) {
      cursorRing.style.transform += ' scale(1.5)';
      cursorCore.style.transform += ' scale(1.2)';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('magnetic') || 
        e.target.classList.contains('btn') || 
        e.target.classList.contains('nav-link')) {
      cursorRing.style.transform = cursorRing.style.transform.replace(' scale(1.5)', '');
      cursorCore.style.transform = cursorCore.style.transform.replace(' scale(1.2)', '');
    }
  });
}

// ===== ENHANCED INTERACTIVE PARTICLE NETWORK =====
function initHeroBlob() {
  const canvas = document.getElementById('hero-blob-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Enhanced particle system
  let particles = [];
  let mouseX = width / 2;
  let mouseY = height / 2;
  let isMouseNear = false;
  let mouseVelocity = { x: 0, y: 0 };
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let explosionParticles = [];
  let trails = [];
  
  // Enhanced Particle class
  class Particle {
    constructor(x, y, isExplosion = false) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * (isExplosion ? 8 : 2);
      this.vy = (Math.random() - 0.5) * (isExplosion ? 8 : 2);
      this.baseSize = Math.random() * 4 + 2;
      this.size = this.baseSize;
      this.colorSeed = Math.random(); // For smooth color animation
      this.connections = [];
      this.attraction = Math.random() * 0.5 + 0.5;
      this.trail = [];
      this.maxTrailLength = 25; // Longer trails
      this.isExplosion = isExplosion;
      this.life = isExplosion ? 180 : Infinity;
      this.gravity = isExplosion ? 0.03 : 0;
      this.friction = isExplosion ? 0.995 : 1;
      this.depth = Math.random() * 0.5 + 0.75; // Parallax/depth factor (0.75-1.25)
      this.opacity = 1;
    }

    update(mouseX, mouseY, mouseVel, time) {
      // Parallax effect: slower/faster movement based on depth
      this.x += this.vx * this.depth;
      this.y += this.vy * this.depth;

      // Apply gravity and friction for explosion particles
      if (this.isExplosion) {
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life--;
        if (this.life <= 0) {
          this.isExplosion = false;
          this.gravity = 0;
          this.friction = 1;
          this.life = Infinity;
          this.maxTrailLength = 25;
          this.baseSize = Math.random() * 4 + 2;
        }
      }

      // Store trail position
      this.trail.push({ x: this.x, y: this.y, size: this.size, colorSeed: this.colorSeed, time });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction and clustering
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150 && isMouseNear) {
        const force = (150 - distance) / 150;
        this.vx += dx * 0.001 * force;
        this.vy += dy * 0.001 * force;
        // Fade in when close to mouse
        this.opacity = Math.min(1, 0.5 + (1 - distance / 150));
      } else {
        this.opacity = 0.5;
      }

      // Animate size (pulsing/breathing)
      this.size = this.baseSize * (1 + 0.2 * Math.sin(time / 500 + this.colorSeed * Math.PI * 2));

      // Limit velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 3) {
        this.vx = (this.vx / speed) * 3;
        this.vy = (this.vy / speed) * 3;
      }
    }

    getColor(time) {
      // Animate color smoothly over time (blue, purple, violet)
      const t = (time / 2000 + this.colorSeed) % 1;
      // Interpolate between blue (240), purple (280), violet (320)
      let hue;
      if (t < 0.5) {
        hue = 240 + (280 - 240) * (t / 0.5); // blue to purple
      } else {
        hue = 280 + (320 - 280) * ((t - 0.5) / 0.5); // purple to violet
      }
      return `hsla(${hue}, 100%, 60%, ${this.opacity})`;
    }

    draw(ctx, time) {
      // Draw colorful trail (rainbow effect)
      if (this.trail.length > 1) {
        for (let i = 1; i < this.trail.length; i++) {
          const prev = this.trail[i - 1];
          const curr = this.trail[i];
          const alpha = i / this.trail.length * this.opacity;
                // Rainbow color for trail
      const t = (curr.time / 2000 + curr.colorSeed) % 1;
      let hue;
      if (t < 0.5) {
        hue = 240 + (280 - 240) * (t / 0.5); // Blue to purple
      } else {
        hue = 280 + (320 - 280) * ((t - 0.5) / 0.5); // Purple to violet
      }
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha * 0.7})`;
          ctx.lineWidth = curr.size * alpha * 1.5;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }

      // Draw soft radial gradient particle
      const color = this.getColor(time);
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 2.5
      );
      gradient.addColorStop(0, color.replace(/, [\d.]+\)$/, ', 1)'));
      gradient.addColorStop(0.5, color.replace(/, [\d.]+\)$/, ', 0.5)'));
      gradient.addColorStop(1, color.replace(/, [\d.]+\)$/, ', 0)'));
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.shadowColor = color;
      ctx.shadowBlur = this.size * 4; // Stronger, softer glow
      ctx.fill();
      ctx.restore();
      // Extra glow for explosion particles
      if (this.isExplosion) {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = this.size * 8;
        ctx.fill();
        ctx.restore();
      }
    }
  }
  
  // Initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push(new Particle(
        Math.random() * width,
        Math.random() * height
      ));
    }
    console.log('Particles initialized:', particles.length);
  }
  
  // Enhanced mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const newMouseX = e.clientX - rect.left;
    const newMouseY = e.clientY - rect.top;
    
    // Calculate mouse velocity
    mouseVelocity.x = newMouseX - lastMouseX;
    mouseVelocity.y = newMouseY - lastMouseY;
    
    mouseX = newMouseX;
    mouseY = newMouseY;
    lastMouseX = newMouseX;
    lastMouseY = newMouseY;
    isMouseNear = true;
  });
  
  canvas.addEventListener('mouseleave', () => {
    isMouseNear = false;
    mouseVelocity.x = 0;
    mouseVelocity.y = 0;
  });
  
  // Draw connections between particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (120 - distance) / 120;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.6})`;
          ctx.lineWidth = opacity * 2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse if near
      if (isMouseNear) {
        const dx = particles[i].x - mouseX;
        const dy = particles[i].y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = (100 - distance) / 100;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`;
          ctx.lineWidth = opacity * 3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }
    }
  }
  
  // Draw mouse cursor effect
  function drawMouseEffect() {
    if (isMouseNear) {
      // Mouse glow
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 80
      );
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Mouse pulse
      const pulseSize = Math.sin(Date.now() * 0.01) * 20 + 40;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Enhanced animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw regular particles
    particles.forEach((particle) => {
      particle.update(mouseX, mouseY, mouseVelocity, Date.now());
      particle.draw(ctx, Date.now());
    });
    
    // Draw connections
    drawConnections();
    
    // Draw mouse effects
    drawMouseEffect();
    
    // Debug: Log particle count every 60 frames
    if (Math.random() < 0.01) {
      console.log('Active particles:', particles.length);
    }
    
    requestAnimationFrame(animate);
  }
  
  // Initialize and start animation
  initParticles();
  console.log('Enhanced particle system initialized with', particles.length, 'particles');
  animate();
  
  // Enhanced click explosion effect
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Create enhanced explosion effect
    console.log('Creating explosion at', clickX, clickY, 'Current particles:', particles.length);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      const particle = new Particle(clickX, clickY, true);
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.size = Math.random() * 6 + 4;
      particle.color = `hsl(${Math.random() * 80 + 240}, 90%, 70%)`; // Blue to purple range
      particle.maxTrailLength = 15;
      particles.push(particle);
    }
    console.log('After explosion, particles:', particles.length);
    
    // Limit particle count
    if (particles.length > 50) {
      particles.splice(0, 10);
    }
  });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;
  
  const texts = [
    'Frontend Developer',
    'Interactive Web Developer',
    'UI/UX Designer',
    'React Developer'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true;
      }, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(typeText, typingSpeed);
  }
  
  typeText();
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== MAGNETIC EFFECTS - ENHANCED =====
function initMagneticEffects() {
  // Select all interactive elements that should have magnetic effects
  const magneticElements = document.querySelectorAll(`
    .magnetic, 
    .btn, 
    .nav-link, 
    .about-card, 
    .project-card, 
    .social-link, 
    .contact-item, 
    .form-input,
    .theme-toggle
  `);
  
  magneticElements.forEach(element => {
    let isHovered = false;
    let currentTransform = { x: 0, y: 0, scale: 1 };
    
    element.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    
    element.addEventListener('mouseleave', () => {
      isHovered = false;
      // Smooth reset to original position
      gsap(currentTransform, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          element.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale})`;
        }
      });
    });
    
    element.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      const distance = Math.sqrt(x * x + y * y);
      
      // Calculate magnetic force based on element type
      let maxDistance, forceMultiplier, scaleMultiplier;
      
      if (element.classList.contains('btn')) {
        maxDistance = Math.min(rect.width, rect.height) / 1.5;
        forceMultiplier = 0.4;
        scaleMultiplier = 1.05;
      } else if (element.classList.contains('about-card') || element.classList.contains('project-card')) {
        maxDistance = Math.min(rect.width, rect.height) / 2;
        forceMultiplier = 0.3;
        scaleMultiplier = 1.02;
      } else if (element.classList.contains('social-link')) {
        maxDistance = Math.min(rect.width, rect.height) / 1.2;
        forceMultiplier = 0.5;
        scaleMultiplier = 1.1;
      } else if (element.classList.contains('contact-item')) {
        maxDistance = Math.min(rect.width, rect.height) / 2;
        forceMultiplier = 0.25;
        scaleMultiplier = 1.02;
      } else {
        maxDistance = Math.min(rect.width, rect.height) / 2;
        forceMultiplier = 0.3;
        scaleMultiplier = 1.05;
      }
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const translateX = x * force * forceMultiplier;
        const translateY = y * force * forceMultiplier;
        
        // Smooth animation using GSAP-like easing
        gsap(currentTransform, {
          x: translateX,
          y: translateY,
          scale: scaleMultiplier,
          duration: 0.2,
          ease: "power2.out",
          onUpdate: () => {
            element.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale})`;
          }
        });
      }
    });
  });
  
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });
  
  // Enhanced hover effects for cards
  const cards = document.querySelectorAll('.about-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const glow = card.querySelector('.card-glow');
      if (glow) {
        gsap(glow, {
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.card-glow');
      if (glow) {
        gsap(glow, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
  
  // Enhanced form input effects
  const formInputs = document.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      gsap(input, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      });
    });
    
    input.addEventListener('blur', () => {
      gsap(input, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
  });
}

// Simple GSAP-like animation function for smooth transitions
function gsap(target, properties) {
  const duration = properties.duration || 0.3;
  const ease = properties.ease || "power2.out";
  const onUpdate = properties.onUpdate;
  
  const startValues = {};
  const endValues = {};
  
  // Get start values
  Object.keys(properties).forEach(key => {
    if (key !== 'duration' && key !== 'ease' && key !== 'onUpdate') {
      startValues[key] = target[key] || 0;
      endValues[key] = properties[key];
    }
  });
  
  const startTime = Date.now();
  
  function animate() {
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    let easedProgress;
    if (ease === "power2.out") {
      easedProgress = 1 - Math.pow(1 - progress, 2);
    } else {
      easedProgress = progress;
    }
    
    // Update values
    Object.keys(endValues).forEach(key => {
      const start = startValues[key];
      const end = endValues[key];
      target[key] = start + (end - start) * easedProgress;
    });
    
    if (onUpdate) onUpdate();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}

// ===== NAVBAR EFFECTS =====
function initNavbarEffects() {
  const navbar = document.getElementById('navbar');
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarLinks = document.getElementById('navbar-links');
  
  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  if (navbarToggle && navbarLinks) {
    navbarToggle.addEventListener('click', () => {
      navbarLinks.classList.toggle('open');
      navbarToggle.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navbarLinks?.classList.remove('open');
      navbarToggle?.classList.remove('active');
    }
  });
}

// ===== THEME TOGGLE - FIXED =====
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (!themeToggle || !themeIcon) return;
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const isLight = savedTheme === 'light';
  
  // Apply saved theme
  if (isLight) {
    document.body.classList.add('light');
    updateThemeIcon(true);
  } else {
    document.body.classList.remove('light');
    updateThemeIcon(false);
  }
  
  // Theme toggle click handler
  themeToggle.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light');
    
    if (isCurrentlyLight) {
      // Switch to dark mode
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon(false);
    } else {
      // Switch to light mode
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
      updateThemeIcon(true);
    }
    
    // Add click animation
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });
  
  function updateThemeIcon(isLight) {
    if (isLight) {
      themeIcon.innerHTML = '☀️';
      themeIcon.style.transform = 'rotate(180deg)';
    } else {
      themeIcon.innerHTML = '🌙';
      themeIcon.style.transform = 'rotate(0deg)';
    }
  }
  
  // Add hover effect to theme toggle
  themeToggle.addEventListener('mouseenter', () => {
    themeToggle.style.transform = 'scale(1.1)';
  });
  
  themeToggle.addEventListener('mouseleave', () => {
    themeToggle.style.transform = 'scale(1)';
  });
}

// ===== FLOATING ELEMENTS =====
function initFloatingElements() {
  const floatingCards = document.querySelectorAll('.floating-card');
  
  floatingCards.forEach((card, index) => {
    const speed = parseFloat(card.dataset.speed) || 0.5;
    let time = index * 1000;
    
    function animateCard() {
      const y = Math.sin(time * 0.001) * 20;
      const rotation = Math.sin(time * 0.0005) * 10;
      const scale = 1 + Math.sin(time * 0.002) * 0.1;
      
      card.style.transform = `translateY(${y}px) rotate(${rotation}deg) scale(${scale})`;
      
      time += 16 * speed;
      requestAnimationFrame(animateCard);
    }
    
    animateCard();
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  const fadeElements = document.querySelectorAll('[data-aos]');
  fadeElements.forEach(el => observer.observe(el));

  // Parallax effect for floating elements
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    parallaxElements.forEach((element, index) => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform += ` translateY(${yPos}px)`;
    });
  });

  // ===== GSAP SCROLLTRIGGER ANIMATIONS =====
  if (window.gsap && window.ScrollTrigger && typeof gsap.registerPlugin === 'function') {
    gsap.registerPlugin(ScrollTrigger);

    // Animate stack cards with bidirectional effects
    gsap.utils.toArray('.stack-card').forEach((card, index) => {
      gsap.fromTo(card, 
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    // Animate stack items with stagger effect
    gsap.utils.toArray('.stack-item').forEach((item) => {
      gsap.fromTo(item,
        {
          opacity: 0,
          x: -20,
          scale: 0.8
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    // Animate the "MY STACK" title
    gsap.fromTo('.stack-title',
      {
        opacity: 0,
        y: -30,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.stack-title',
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // HERO SECTION ANIMATIONS
    gsap.fromTo('.hero-title',
      {
        opacity: 0,
        y: -50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.hero-title',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    gsap.fromTo('.hero-subtitle',
      {
        opacity: 0,
        y: -30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.hero-subtitle',
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    gsap.fromTo('.hero-description',
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.hero-description',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    gsap.fromTo('.hero-cta',
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.hero-cta',
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // ABOUT/PROJECTS/CONTACT SECTION HEADERS
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.fromTo(header,
        {
          opacity: 0,
          y: -40,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    // ABOUT CARDS
    gsap.utils.toArray('.about-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
          rotationY: -15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    gsap.fromTo('.about-profile',
      {
        opacity: 0,
        x: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.about-profile',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // PROJECTS SECTION ANIMATIONS
    gsap.utils.toArray('.project-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          scale: 0.85,
          rotationY: -10
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: index * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    // CONTACT SECTION ANIMATIONS
    gsap.fromTo('.contact-form-container',
      {
        opacity: 0,
        x: -50,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.contact-form-container',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    gsap.fromTo('.contact-info',
      {
        opacity: 0,
        x: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.contact-info',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    gsap.utils.toArray('.contact-item').forEach((item, index) => {
      gsap.fromTo(item,
        {
          opacity: 0,
          y: 30,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });

    gsap.utils.toArray('.social-link').forEach((link, index) => {
      gsap.fromTo(link,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
          rotation: -10
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: link,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            markers: false
          }
        }
      );
    });
  } else {
    console.log('GSAP or ScrollTrigger not available, skipping advanced animations');
  }
}

// ===== FORM EFFECTS =====
function initFormEffects() {
  const formInputs = document.querySelectorAll('.form-input');
  
  formInputs.forEach(input => {
    // Focus effects
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    
    // Ripple effect on button click
    if (input.type === 'submit' || input.tagName === 'BUTTON') {
      input.addEventListener('click', createRipple);
    }
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Add success animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span><div class="btn-glow"></div>';
      submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00ff88)';
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><div class="btn-glow"></div>';
        submitBtn.style.background = '';
      }, 3000);
    });
  }
}

// ===== UTILITY FUNCTIONS =====
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
  // Scroll-based animations here
}, 16));

// ===== ACCESSIBILITY =====
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu
    const navbarLinks = document.getElementById('navbar-links');
    const navbarToggle = document.getElementById('navbar-toggle');
    if (navbarLinks && navbarLinks.classList.contains('open')) {
      navbarLinks.classList.remove('open');
      navbarToggle?.classList.remove('active');
    }
  }
});

// Focus management for mobile menu
function manageFocus() {
  const navbarLinks = document.getElementById('navbar-links');
  const navbarToggle = document.getElementById('navbar-toggle');
  
  if (navbarLinks && navbarToggle) {
    const focusableElements = navbarLinks.querySelectorAll('a, button');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Trap focus in mobile menu
    navbarToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navbarToggle.click();
      }
    });
  }
}

manageFocus();

// ===== MATRIX RAIN EFFECT =====
function initMatrixRain() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) {
    console.log('Matrix rain canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.log('Could not get canvas context');
    return;
  }
  
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  // Set canvas size
  canvas.width = width;
  canvas.height = height;
  
  // Matrix characters (mix of katakana, Sanskrit, Telugu, numbers, and symbols)
  const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789@#$%&*()_+-=[]{}|;:,.<>?अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञड़ढ़అఆఇఈఉఊఋఎఏఐఒఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహక్షత్రజ్ఞ';
  
  // Rain drops
  let drops = [];
  const fontSize = 16;
  const columns = Math.floor(width / fontSize);
  
  // Initialize drops
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -20; // Start some drops above screen
  }
  
  // Resize handler
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Recalculate columns
    const newColumns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < newColumns; i++) {
      drops[i] = Math.random() * -20;
    }
  }
  
  // Initialize canvas size
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Test canvas
  console.log('Canvas size:', width, 'x', height);
  console.log('Canvas element:', canvas);
  
  // Animation loop
  function drawMatrix() {
    // Semi-transparent background to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Get current accent color from CSS variables
    const currentAccentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim();
    
    // Set text properties
    ctx.fillStyle = currentAccentColor;
    ctx.font = `bold ${fontSize}px monospace`;
    
    // Draw the characters
    for (let i = 0; i < drops.length; i++) {
      // Random character
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      
      // Add glow effect
      ctx.shadowColor = currentAccentColor;
      ctx.shadowBlur = 8;
      
      // Draw character
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Move drop down
      drops[i]++;
      
      // Reset drop if it goes off screen
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
    
    requestAnimationFrame(drawMatrix);
  }
  
  // Start animation
  console.log('Starting matrix rain animation');
  drawMatrix();
}

// ===== SKILLS ORBIT ANIMATION =====
function initSkillsOrbit() {
  const orbit = document.getElementById('skills-orbit');
  if (!orbit) return;
  const icons = Array.from(orbit.querySelectorAll('.orbit-icon'));
  const orbitContainer = orbit.parentElement;

  let centerX = 0, centerY = 0;
  let mouseX = 0, mouseY = 0;
  let targetCenterX = 0, targetCenterY = 0;
  let width = 360, height = 360;
  let isMouseOver = false;

  function updateDimensions() {
    width = orbit.offsetWidth;
    height = orbit.offsetHeight;
    const rect = orbit.getBoundingClientRect();
    centerX = rect.left + width / 2;
    centerY = rect.top + height / 2;
    targetCenterX = width / 2;
    targetCenterY = height / 2;
  }

  updateDimensions();
  window.addEventListener('resize', updateDimensions);

  // Mouse tracking within section
  orbitContainer.addEventListener('mousemove', (e) => {
    const rect = orbit.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isMouseOver = true;
  });
  orbitContainer.addEventListener('mouseleave', () => {
    isMouseOver = false;
  });

  // Animation loop
  function animateOrbit() {
    // Smoothly move the orbit center toward the mouse
    if (isMouseOver) {
      targetCenterX += (mouseX - targetCenterX) * 0.08;
      targetCenterY += (mouseY - targetCenterY) * 0.08;
    } else {
      targetCenterX += (width / 2 - targetCenterX) * 0.08;
      targetCenterY += (height / 2 - targetCenterY) * 0.08;
    }

    // Animate icons in a circle
    const iconCount = icons.length;
    const time = Date.now() * 0.001;
    const radius = Math.min(width, height) / 2 - 48;
    for (let i = 0; i < iconCount; i++) {
      const angle = (i / iconCount) * Math.PI * 2 + time * 0.35;
      const x = targetCenterX + Math.cos(angle) * radius;
      const y = targetCenterY + Math.sin(angle) * radius;
      icons[i].style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
    requestAnimationFrame(animateOrbit);
  }
  animateOrbit();
}

// ===== LIVE COLOR PLAYGROUND =====
function initColorPlayground() {
  const colorPickers = {
    primary: document.getElementById('primary-color'),
    secondary: document.getElementById('secondary-color'),
    accent: document.getElementById('accent-color'),
    background: document.getElementById('background-color')
  };
  
  const colorValues = document.querySelectorAll('.color-value');
  const randomizeBtn = document.getElementById('randomize-btn');
  const resetBtn = document.getElementById('reset-btn');
  const exportBtn = document.getElementById('export-btn');
  const exportModal = document.getElementById('export-modal');
  const closeExport = document.getElementById('close-export');
  const exportCode = document.getElementById('export-code');
  const copyCode = document.getElementById('copy-code');
  const themeToggle = document.getElementById('theme-mode-toggle');
  
  // Original website colors (blue & purple theme)
  const originalColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6', 
    accent: '#a855f7',
    background: '#0a0a0a'
  };
  
  // Dynamic color generation functions
  function generateRandomHue() {
    return Math.floor(Math.random() * 360);
  }
  
  function generateHarmoniousColors() {
    const baseHue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 30) + 50; // 50-80%
    
    // Generate 3 harmonious colors using color theory
    const primary = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(baseHue + 30) % 360}, ${saturation}%, ${lightness}%)`;
    const accent = `hsl(${(baseHue + 60) % 360}, ${saturation}%, ${lightness}%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  function generateAnalogousColors() {
    const baseHue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 25) + 55;
    
    const primary = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(baseHue + 20) % 360}, ${saturation}%, ${lightness}%)`;
    const accent = `hsl(${(baseHue + 40) % 360}, ${saturation}%, ${lightness}%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  function generateTriadicColors() {
    const baseHue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 35) + 65;
    const lightness = Math.floor(Math.random() * 30) + 50;
    
    const primary = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(baseHue + 120) % 360}, ${saturation}%, ${lightness}%)`;
    const accent = `hsl(${(baseHue + 240) % 360}, ${saturation}%, ${lightness}%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  function generateComplementaryColors() {
    const baseHue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 40) + 60;
    const lightness = Math.floor(Math.random() * 30) + 50;
    
    const primary = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`;
    const accent = `hsl(${(baseHue + 90) % 360}, ${saturation}%, ${lightness}%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  function generateMonochromaticColors() {
    const hue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 40) + 60;
    
    const primary = `hsl(${hue}, ${saturation}%, 60%)`;
    const secondary = `hsl(${hue}, ${saturation}%, 50%)`;
    const accent = `hsl(${hue}, ${saturation}%, 70%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  function generateSplitComplementaryColors() {
    const baseHue = generateRandomHue();
    const saturation = Math.floor(Math.random() * 35) + 65;
    const lightness = Math.floor(Math.random() * 30) + 50;
    
    const primary = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(baseHue + 150) % 360}, ${saturation}%, ${lightness}%)`;
    const accent = `hsl(${(baseHue + 210) % 360}, ${saturation}%, ${lightness}%)`;
    
    return { primary, secondary, accent, background: '#0a0a0a' };
  }
  
  // Color generation strategies
  const colorStrategies = [
    generateHarmoniousColors,
    generateAnalogousColors,
    generateTriadicColors,
    generateComplementaryColors,
    generateMonochromaticColors,
    generateSplitComplementaryColors
  ];
  
  // Convert HSL to hex for color picker compatibility
  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  function parseHsl(hslString) {
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      return hslToHex(h, s, l);
    }
    return hslString;
  }
  
  // Update CSS variables
  function updateColors() {
    const primary = colorPickers.primary.value;
    const secondary = colorPickers.secondary.value;
    const accent = colorPickers.accent.value;
    const background = colorPickers.background.value;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--color-accent', primary);
    document.documentElement.style.setProperty('--color-accent-secondary', secondary);
    document.documentElement.style.setProperty('--color-glow', `${primary}30`);
    document.documentElement.style.setProperty('--color-bg', background);
    
    // Update color value displays
    colorValues[0].textContent = primary;
    colorValues[1].textContent = secondary;
    colorValues[2].textContent = accent;
    colorValues[3].textContent = background;
  }
  
  // Initialize colors
  updateColors();
  
  // Color picker event listeners
  Object.values(colorPickers).forEach(picker => {
    picker.addEventListener('input', updateColors);
  });
  
  // Randomize palette
  randomizeBtn.addEventListener('click', () => {
    const randomStrategy = colorStrategies[Math.floor(Math.random() * colorStrategies.length)];
    const randomPalette = randomStrategy();
    
    // Convert HSL to hex for color pickers
    const primaryHex = parseHsl(randomPalette.primary);
    const secondaryHex = parseHsl(randomPalette.secondary);
    const accentHex = parseHsl(randomPalette.accent);
    
    colorPickers.primary.value = primaryHex;
    colorPickers.secondary.value = secondaryHex;
    colorPickers.accent.value = accentHex;
    colorPickers.background.value = randomPalette.background;
    
    updateColors();
    
    // Add animation effect
    randomizeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      randomizeBtn.style.transform = 'scale(1)';
    }, 150);
    
    console.log('Generated new color palette using:', randomStrategy.name);
  });
  
  // Reset to original colors
  resetBtn.addEventListener('click', () => {
    colorPickers.primary.value = originalColors.primary;
    colorPickers.secondary.value = originalColors.secondary;
    colorPickers.accent.value = originalColors.accent;
    colorPickers.background.value = originalColors.background;
    updateColors();
    console.log('Colors reset to original website theme.');
  });
  
  // Export theme
  exportBtn.addEventListener('click', () => {
    const primary = colorPickers.primary.value;
    const secondary = colorPickers.secondary.value;
    const accent = colorPickers.accent.value;
    const background = colorPickers.background.value;
    
    const cssCode = `/* Generated Color Theme */
:root {
  --color-accent: ${primary};
  --color-accent-secondary: ${secondary};
  --color-glow: ${primary}30;
  --color-bg: ${background};
}

/* For light mode */
body.light {
  --color-accent: ${primary};
  --color-accent-secondary: ${secondary};
  --color-glow: ${primary}30;
  --color-bg: #ffffff;
}`;
    
    exportCode.textContent = cssCode;
    exportModal.classList.add('show');
  });
  
  // Close export modal
  closeExport.addEventListener('click', () => {
    exportModal.classList.remove('show');
  });
  
  // Close modal on outside click
  exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
      exportModal.classList.remove('show');
    }
  });
  
  // Copy code
  copyCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(exportCode.textContent);
      copyCode.querySelector('.btn-text').textContent = 'Copied!';
      setTimeout(() => {
        copyCode.querySelector('.btn-text').textContent = 'Copy Code';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });
  
  // Theme toggle
  themeToggle.addEventListener('change', () => {
    const isLight = themeToggle.checked;
    const toggleText = themeToggle.parentElement.querySelector('.toggle-text');
    
    if (isLight) {
      document.body.classList.add('light');
      toggleText.textContent = 'Dark Mode';
    } else {
      document.body.classList.remove('light');
      toggleText.textContent = 'Light Mode';
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exportModal.classList.contains('show')) {
      exportModal.classList.remove('show');
    }
  });
}
