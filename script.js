/* ═══════════════════════════════════════════════════════════
   Mindwave — script.js
   1) Particle collision system (behind the form)
   2) Form handling → POST /predict → animated right-panel result
   ═══════════════════════════════════════════════════════════ */

const API_BASE = "http://127.0.0.1:8000";

/* ──────────────────────────────────────────
   1.  PARTICLE COLLISION SYSTEM
   Particles drift, bounce off walls, and
   collide with each other elastically.
   ────────────────────────────────────────── */

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = 80;
const CONNECT_DIST = 120; // max distance for connection lines

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = Math.random() * 2.5 + 1.5;
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: r,
      mass: r * r,   // mass proportional to area
      hue: Math.random() * 40 + 30,         // gold-ish hue range 30-70
      alpha: Math.random() * 0.4 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }
}

/* Elastic collision between two circles */
function resolveCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.r + b.r;

  if (dist < minDist && dist > 0) {
    // Normal vector
    const nx = dx / dist;
    const ny = dy / dist;

    // Relative velocity
    const dvx = a.vx - b.vx;
    const dvy = a.vy - b.vy;
    const dvDotN = dvx * nx + dvy * ny;

    // Don't resolve if velocities separating
    if (dvDotN > 0) {
      const totalMass = a.mass + b.mass;
      const impulse = (2 * dvDotN) / totalMass;

      a.vx -= impulse * b.mass * nx;
      a.vy -= impulse * b.mass * ny;
      b.vx += impulse * a.mass * nx;
      b.vy += impulse * a.mass * ny;

      // Separate overlapping particles
      const overlap = (minDist - dist) / 2;
      a.x -= overlap * nx;
      a.y -= overlap * ny;
      b.x += overlap * nx;
      b.y += overlap * ny;

      // Brief flash on collision
      a.alpha = Math.min(1, a.alpha + 0.25);
      b.alpha = Math.min(1, b.alpha + 0.25);
    }
  }
}

function drawParticles(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw each particle
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off walls
    if (p.x - p.r < 0) { p.x = p.r; p.vx = Math.abs(p.vx); }
    if (p.x + p.r > canvas.width) { p.x = canvas.width - p.r; p.vx = -Math.abs(p.vx); }
    if (p.y - p.r < 0) { p.y = p.r; p.vy = Math.abs(p.vy); }
    if (p.y + p.r > canvas.height) { p.y = canvas.height - p.r; p.vy = -Math.abs(p.vy); }

    // Decay flash alpha back to base
    p.alpha = Math.max(0.3, p.alpha - 0.004);

    // Pulse size subtly
    const pulse = 1 + 0.15 * Math.sin(time * 0.002 + p.pulsePhase);
    const drawR = p.r * pulse;

    // Draw particle with glow
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawR * 3);
    grad.addColorStop(0, `hsla(${p.hue}, 60%, 70%, ${p.alpha})`);
    grad.addColorStop(0.4, `hsla(${p.hue}, 50%, 60%, ${p.alpha * 0.4})`);
    grad.addColorStop(1, `hsla(${p.hue}, 40%, 50%, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, drawR * 3, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 55%, 75%, ${p.alpha})`;
    ctx.fill();

    // Collision checks (only check pairs once)
    for (let j = i + 1; j < particles.length; j++) {
      resolveCollision(p, particles[j]);
    }
  }

  // Draw connection lines between nearby particles
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const opacity = (1 - dist / CONNECT_DIST) * 0.15;
        ctx.strokeStyle = `rgba(193, 168, 117, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(drawParticles);
}
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});


/* ──────────────────────────────────────────
   2.  FORM HANDLING
   ────────────────────────────────────────── */

const form = document.getElementById("predictForm");
const submitBtn = document.getElementById("submitBtn");
const formNotice = document.getElementById("formNotice");
const resultPlaceholder = document.getElementById("resultPlaceholder");
const resultCard = document.getElementById("resultCard");
const scoreValue = document.getElementById("scoreValue");
const resultTag = document.getElementById("resultTag");
const resultMessage = document.getElementById("resultMessage");
const ringFill = document.getElementById("ringFill");

/* cursor-follow glow on the form card */
form.addEventListener("mousemove", (e) => {
  const rect = form.getBoundingClientRect();
  form.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  form.style.setProperty("--my", `${e.clientY - rect.top}px`);
});

/* click ripple on the submit button */
submitBtn.addEventListener("click", (e) => {
  const rect = submitBtn.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  submitBtn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

const NUMERIC_FIELDS = [
  "age",
  "avg_daily_usage_hours",
  "daily_unlocks",
  "study_hours",
  "physical_activity_hours",
  "sleep_hours_per_night",
];

function clearErrors() {
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
  form.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  formNotice.hidden = true;
}

function showFieldError(fieldName, message) {
  const errEl = form.querySelector(`[data-error-for="${fieldName}"]`);
  const input = form.querySelector(`[name="${fieldName}"]`);
  if (input) input.closest(".field").classList.add("invalid");
  if (errEl) errEl.textContent = message;
}

function showNotice(message) {
  formNotice.textContent = message;
  formNotice.hidden = false;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
  submitBtn.querySelector(".btn-label").textContent = isLoading ? "Analyzing…" : "Get My Score";
}

function getPayload() {
  const data = new FormData(form);
  const payload = {};
  for (const [key, value] of data.entries()) {
    payload[key] = NUMERIC_FIELDS.includes(key) ? Number(value) : value;
  }
  return payload;
}

const RING_CIRCUMFERENCE = 2 * Math.PI * 78; // ~490.1

/* Animate stat bars based on form inputs */
function animateStatBars(payload) {
  const sleepPct = Math.min(100, (payload.sleep_hours_per_night / 9) * 100);
  const screenPct = Math.max(0, 100 - (payload.avg_daily_usage_hours / 12) * 100);
  const physPct = Math.min(100, (payload.physical_activity_hours / 3) * 100);

  const stressMap = { "Low": 85, "Medium": 60, "High": 35, "Very High": 10 };
  const stressPct = stressMap[payload.stress_level] || 50;

  setTimeout(() => {
    document.getElementById("statSleep").style.width = sleepPct + "%";
    document.getElementById("statScreen").style.width = screenPct + "%";
    document.getElementById("statPhysical").style.width = physPct + "%";
    document.getElementById("statStress").style.width = stressPct + "%";
  }, 400);
}

function showResult(score, payload) {
  const clamped = Math.max(0, Math.min(10, Number(score)));

  let color = "var(--accent-teal)";
  let tag = "Thriving ✦";
  let message = "Your habits look well balanced. Keep nurturing this rhythm — you're doing great.";
  if (clamped < 5) {
    color = "var(--accent-coral)";
    tag = "Under Strain ⚠";
    message = "This pattern suggests high stress. Consider prioritising sleep, reducing screen time, or talking to someone you trust.";
  } else if (clamped < 7.5) {
    color = "var(--accent-amber)";
    tag = "Holding Steady ◉";
    message = "You're managing okay, but small adjustments to sleep or screen habits could make a noticeable difference.";
  }

  // Hide placeholder, show result
  resultPlaceholder.style.display = "none";
  resultCard.hidden = false;

  resultCard.style.setProperty("--result-color", color);
  resultTag.textContent = tag;
  resultMessage.textContent = message;

  // Scroll result into view on mobile
  const resultPanel = document.getElementById("resultPanel");
  if (window.innerWidth <= 960) {
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Reset ring, then animate fill
  ringFill.style.transition = "none";
  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ringFill.style.transition = "";
      const offset = RING_CIRCUMFERENCE * (1 - clamped / 10);
      ringFill.style.strokeDashoffset = String(offset);
    });
  });

  // Count up animation
  const duration = 1000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    scoreValue.textContent = (clamped * eased).toFixed(1);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Animate stat bars
  if (payload) animateStatBars(payload);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const payload = getPayload();

  // Simple required-field check
  for (const [key, value] of Object.entries(payload)) {
    if (value === "" || value === null || Number.isNaN(value)) {
      showFieldError(key, "This field is required.");
    }
  }
  if (form.querySelector(".field.invalid")) {
    showNotice("Please fill in every field before submitting.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 422) {
      const data = await res.json();
      (data.detail || []).forEach((item) => {
        const field = item.loc?.[item.loc.length - 1];
        if (field) showFieldError(field, item.msg);
      });
      showNotice("Some fields need a second look.");
      return;
    }

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    showResult(data.predicted_mental_health_score, payload);
  } catch (err) {
    console.error(err);
    showNotice(
      `Couldn't reach the prediction service. Make sure the backend is running at ${API_BASE} and try again.`
    );
  } finally {
    setLoading(false);
  }
});
