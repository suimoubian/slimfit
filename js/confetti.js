/* ====== Canvas Confetti / Particle Animation Engine ====== */
const Confetti = (() => {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrame = null;
  let running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  /* Particle types */
  const SHAPES = ['circle', 'star', 'ribbon', 'dot'];

  const COLORS = [
    '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
    '#ff922b', '#845ef7', '#f06595', '#20c997',
    '#ff6b9d', '#c9b1ff', '#5c7cfa', '#fcc419'
  ];

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function createParticle(x, y, shape) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 8;
    const size = 3 + Math.random() * 8;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size,
      shape: shape || SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: randomColor(),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: 0.008 + Math.random() * 0.02,
      gravity: 0.08 + Math.random() * 0.06,
      drag: 0.98 + Math.random() * 0.015
    };
  }

  function drawCircle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
  }

  function drawStar(p) {
    const spikes = 5;
    const outerR = p.size;
    const innerR = p.size * 0.4;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.restore();
  }

  function drawRibbon(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fillRect(-p.size * 0.3, -p.size, p.size * 0.6, p.size * 2);
    ctx.restore();
  }

  function drawDot(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
  }

  const DRAW_FN = {
    circle: drawCircle,
    star: drawStar,
    ribbon: drawRibbon,
    dot: drawDot
  };

  function animate() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);

    if (particles.length === 0) {
      running = false;
      cancelAnimationFrame(animFrame);
      animFrame = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    for (const p of particles) {
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life > 0) {
        const drawFn = DRAW_FN[p.shape] || drawCircle;
        drawFn(p);
      }
    }

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(animate);
  }

  function start() {
    if (animFrame) cancelAnimationFrame(animFrame);
    running = true;
    animate();
  }

  function burst(x, y, count, spread) {
    const cx = x || canvas.width / 2;
    const cy = y || canvas.height / 2;
    const n = count || 40;
    const s = spread || 1;

    for (let i = 0; i < n; i++) {
      const p = createParticle(cx, cy);
      p.vx *= s;
      p.vy *= s;
      particles.push(p);
    }

    if (!running) start();
  }

  function megaBurst(x, y) {
    const cx = x || canvas.width / 2;
    const cy = y || canvas.height / 2;

    // Multiple waves for more dramatic effect
    for (let i = 0; i < 120; i++) {
      const p = createParticle(cx, cy);
      p.vx *= 1.5;
      p.vy *= 1.5;
      p.decay = 0.005 + Math.random() * 0.01;
      p.size = 4 + Math.random() * 12;
      particles.push(p);
    }

    // Extra ribbons
    for (let i = 0; i < 20; i++) {
      const p = createParticle(cx, cy, 'ribbon');
      p.vx *= 2;
      p.vy *= 2;
      p.decay = 0.004 + Math.random() * 0.008;
      p.size = 6 + Math.random() * 10;
      particles.push(p);
    }

    if (!running) start();
  }

  function stop() {
    running = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { burst, megaBurst, stop, resize };
})();
