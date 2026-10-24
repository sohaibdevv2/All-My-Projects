'use strict';

// ===== PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? 'rgba(139,92,246,0.5)' : 'rgba(59,130,246,0.4)',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animation: `float ${6 + Math.random() * 6}s ease-in-out infinite`,
      animationDelay: Math.random() * 6 + 's'
    });
    container.appendChild(p);
  }
})();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ['home', 'features', 'dashboard', 'tracker', 'analytics', 'contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}
setTimeout(animateCounters, 500);

// ===== LIVE FEED =====
const feedNames = [
  'Arjun S.', 'Priya M.', 'Rahul K.', 'Deepa R.', 'Vikram N.',
  'Sneha T.', 'Kiran P.', 'Anjali B.', 'Suresh L.', 'Meena V.',
  'Ravi C.', 'Nisha D.', 'Arun J.', 'Kavita S.', 'Mohan R.'
];
const statusOptions = [
  { label: 'Present', color: '#10b981', bg: 'rgba(16,185,129,0.2)' },
  { label: 'Present', color: '#10b981', bg: 'rgba(16,185,129,0.2)' },
  { label: 'Present', color: '#10b981', bg: 'rgba(16,185,129,0.2)' },
  { label: 'Late', color: '#f59e0b', bg: 'rgba(245,158,11,0.2)' },
  { label: 'Absent', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' }
];
const avatarColors = ['linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)','linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)','linear-gradient(135deg,#fa709a,#fee140)'];

function generateFeed() {
  const feed = document.getElementById('liveFeed');
  feed.innerHTML = '';
  const count = 5;
  for (let i = 0; i < count; i++) {
    const name = feedNames[Math.floor(Math.random() * feedNames.length)];
    const st = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const color = avatarColors[i % avatarColors.length];
    const initials = name.split(' ').map(w => w[0]).join('');
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="feed-avatar" style="background:${color}">${initials}</div>
      <span>${name}</span>
      <span class="feed-status" style="color:${st.color}">${st.label}</span>`;
    feed.appendChild(item);
  }
}

function refreshFeed() {
  generateFeed();
  const rate = 75 + Math.floor(Math.random() * 20);
  document.getElementById('todayRate').textContent = rate + '%';
  showToast('Feed refreshed!', 'success');
}
generateFeed();
setInterval(generateFeed, 4000);

// ===== DASHBOARD STATS =====
function initDashboard() {
  const present = 312, absent = 48, late = 22, total = 382;
  const rate = Math.round((present / total) * 100);

  animateTo('presentCount', present);
  animateTo('absentCount', absent);
  animateTo('lateCount', late);
  document.getElementById('rateText').textContent = rate + '%';
  setTimeout(() => { document.getElementById('progressFill').style.width = rate + '%'; }, 300);

  const depts = [
    { name: 'Computer Sc.', pct: 92, color: '#8b5cf6' },
    { name: 'Electronics', pct: 85, color: '#3b82f6' },
    { name: 'Mechanical', pct: 78, color: '#10b981' },
    { name: 'Civil', pct: 81, color: '#f59e0b' },
    { name: 'Mathematics', pct: 88, color: '#ec4899' }
  ];
  const deptList = document.getElementById('deptList');
  depts.forEach(d => {
    const el = document.createElement('div');
    el.className = 'dept-item';
    el.innerHTML = `
      <span class="dept-name">${d.name}</span>
      <div class="dept-bar-track"><div class="dept-bar-fill" style="background:${d.color};width:0"></div></div>
      <span class="dept-pct" style="color:${d.color}">${d.pct}%</span>`;
    deptList.appendChild(el);
    setTimeout(() => { el.querySelector('.dept-bar-fill').style.width = d.pct + '%'; }, 400);
  });

  const alerts = [
    { type: 'warning', icon: 'fa-exclamation-triangle', text: '<strong>15 students</strong> have attendance below 75% — risk of eligibility issues.' },
    { type: 'success', icon: 'fa-check-circle', text: '<strong>Computer Science dept</strong> achieved 92% this week — highest ever recorded.' },
    { type: 'info', icon: 'fa-robot', text: 'AI predicts <strong>above-average attendance</strong> tomorrow based on historical patterns.' },
    { type: 'warning', icon: 'fa-clock', text: '<strong>8 students</strong> marked late today — mostly in morning slots.' }
  ];
  const alertsList = document.getElementById('alertsList');
  alerts.forEach(a => {
    const el = document.createElement('div');
    el.className = `alert-item ${a.type}`;
    const iconColor = a.type === 'warning' ? '#f59e0b' : a.type === 'success' ? '#10b981' : '#3b82f6';
    el.innerHTML = `<i class="fas ${a.icon}" style="color:${iconColor}"></i><span>${a.text}</span>`;
    alertsList.appendChild(el);
  });
}

function animateTo(id, target) {
  const el = document.getElementById(id);
  let n = 0; const step = target / 40;
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n);
    if (n >= target) clearInterval(t);
  }, 20);
}

initDashboard();

// ===== WEEKLY CHART (Canvas) =====
function drawChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 600;
  canvas.height = 220;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const present = [88, 82, 91, 78, 85, 72];
  const absent = [12, 18, 9, 22, 15, 28];

  const W = canvas.width, H = canvas.height;
  const padL = 40, padR = 20, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = chartW / days.length;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padT + (chartH / 5) * i;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.moveTo(padL, y); ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.fillText((100 - i * 20) + '%', padL - 6, y + 4);
  }

  days.forEach((day, i) => {
    const x = padL + i * barW + barW * 0.15;
    const bw = barW * 0.35;

    // Present bar
    const ph = (present[i] / 100) * chartH;
    const grad1 = ctx.createLinearGradient(0, padT + chartH - ph, 0, padT + chartH);
    grad1.addColorStop(0, '#8b5cf6');
    grad1.addColorStop(1, 'rgba(139,92,246,0.3)');
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.roundRect(x, padT + chartH - ph, bw, ph, [4, 4, 0, 0]);
    ctx.fill();

    // Absent bar
    const ah = (absent[i] / 100) * chartH;
    const grad2 = ctx.createLinearGradient(0, padT + chartH - ah, 0, padT + chartH);
    grad2.addColorStop(0, '#ef4444');
    grad2.addColorStop(1, 'rgba(239,68,68,0.3)');
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.roundRect(x + bw + 4, padT + chartH - ah, bw, ah, [4, 4, 0, 0]);
    ctx.fill();

    // Day label
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(day, padL + i * barW + barW / 2, H - 8);
  });

  // Legend
  const lx = W - 150;
  ctx.fillStyle = '#8b5cf6'; ctx.fillRect(lx, padT, 12, 12);
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter'; ctx.textAlign = 'left';
  ctx.fillText('Present', lx + 16, padT + 10);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(lx + 80, padT, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Absent', lx + 96, padT + 10);
}
window.addEventListener('load', drawChart);
window.addEventListener('resize', drawChart);

// ===== STUDENT TRACKER =====
const students = [
  { id: 1, name: 'Arjun Sharma', roll: 'CS2024001', dept: 'Computer Science', status: 'present' },
  { id: 2, name: 'Priya Meena', roll: 'CS2024002', dept: 'Computer Science', status: 'absent' },
  { id: 3, name: 'Rahul Kumar', roll: 'EC2024001', dept: 'Electronics', status: 'present' },
  { id: 4, name: 'Deepa Rao', roll: 'ME2024001', dept: 'Mechanical', status: 'late' },
  { id: 5, name: 'Vikram Nair', roll: 'CS2024003', dept: 'Computer Science', status: 'present' },
  { id: 6, name: 'Sneha Thomas', roll: 'CV2024001', dept: 'Civil', status: 'absent' },
  { id: 7, name: 'Kiran Patel', roll: 'MA2024001', dept: 'Mathematics', status: 'present' },
  { id: 8, name: 'Anjali Bhat', roll: 'EC2024002', dept: 'Electronics', status: 'present' },
  { id: 9, name: 'Suresh Lal', roll: 'ME2024002', dept: 'Mechanical', status: 'late' },
  { id: 10, name: 'Meena Verma', roll: 'CS2024004', dept: 'Computer Science', status: 'present' },
];

let currentFilter = 'all';
let searchQuery = '';

function getInitials(name) { return name.split(' ').map(w => w[0]).join('').toUpperCase(); }

function renderStudents() {
  const list = document.getElementById('studentList');
  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery) || s.roll.toLowerCase().includes(searchQuery);
    const matchFilter = currentFilter === 'all' || s.status === currentFilter;
    return matchSearch && matchFilter;
  });

  list.innerHTML = filtered.length === 0 ? '<p style="text-align:center;color:#64748b;padding:2rem;font-size:0.875rem">No students found</p>' : '';

  filtered.forEach(s => {
    const item = document.createElement('div');
    item.className = 'student-item';
    const bgColors = { 'Computer Science': 'linear-gradient(135deg,#667eea,#764ba2)', 'Electronics': 'linear-gradient(135deg,#4facfe,#00f2fe)', 'Mechanical': 'linear-gradient(135deg,#43e97b,#38f9d7)', 'Civil': 'linear-gradient(135deg,#f093fb,#f5576c)', 'Mathematics': 'linear-gradient(135deg,#fa709a,#fee140)' };
    item.innerHTML = `
      <div class="student-avatar" style="background:${bgColors[s.dept] || '#8b5cf6'}">${getInitials(s.name)}</div>
      <div class="student-info">
        <div class="student-name">${s.name}</div>
        <div class="student-roll">${s.roll} · ${s.dept}</div>
      </div>
      <div class="status-buttons">
        <button class="status-btn p ${s.status === 'present' ? 'active' : ''}" onclick="setStatus(${s.id},'present')" title="Present">P</button>
        <button class="status-btn a ${s.status === 'absent' ? 'active' : ''}" onclick="setStatus(${s.id},'absent')" title="Absent">A</button>
        <button class="status-btn l ${s.status === 'late' ? 'active' : ''}" onclick="setStatus(${s.id},'late')" title="Late">L</button>
      </div>`;
    list.appendChild(item);
  });
  updateSessionStats();
}

function setStatus(id, status) {
  const s = students.find(x => x.id === id);
  if (s) { s.status = status; renderStudents(); }
}

function filterStudents() {
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  renderStudents();
}

function filterByStatus(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderStudents();
}

function markAllPresent() {
  students.forEach(s => s.status = 'present');
  renderStudents();
  showToast('All students marked present!', 'success');
}

function updateSessionStats() {
  const p = students.filter(s => s.status === 'present').length;
  const a = students.filter(s => s.status === 'absent').length;
  const l = students.filter(s => s.status === 'late').length;
  const rate = Math.round((p / students.length) * 100);
  document.getElementById('ss-present').textContent = p;
  document.getElementById('ss-absent').textContent = a;
  document.getElementById('ss-late').textContent = l;
  document.getElementById('ss-rate').textContent = rate + '%';
  updateAIInsight(p, a, l, rate);
}

function updateAIInsight(p, a, l, rate) {
  const el = document.getElementById('aiInsight');
  if (rate >= 90) el.textContent = 'Excellent attendance! Class is highly engaged today.';
  else if (rate >= 75) el.textContent = `Good session. ${a} absent — consider follow-up with parents.`;
  else if (rate >= 60) el.textContent = `Attendance below target. ${a} absent — recommend intervention.`;
  else el.textContent = `Critical: only ${rate}% present. Immediate action recommended.`;
}

// Init date & render
document.getElementById('dateInput').valueAsDate = new Date();
renderStudents();

function addStudent(e) {
  e.preventDefault();
  const first = document.getElementById('newFirstName').value.trim();
  const last = document.getElementById('newLastName').value.trim();
  const roll = document.getElementById('newRoll').value.trim();
  const dept = document.getElementById('newDept').value;
  const newId = students.length + 1;
  students.push({ id: newId, name: first + ' ' + last, roll, dept, status: 'present' });
  closeModal('addStudentModal');
  renderStudents();
  e.target.reset();
  showToast(`${first} ${last} added successfully!`, 'success');
}

function exportReport() {
  const subject = document.getElementById('subjectInput').value || 'Session';
  const date = document.getElementById('dateInput').value || new Date().toLocaleDateString();
  const rows = students.map(s => `${s.roll}\t${s.name}\t${s.dept}\t${s.status.toUpperCase()}`).join('\n');
  const content = `ATTENDANCE REPORT\n================\nSubject: ${subject}\nDate: ${date}\nGenerated: ${new Date().toLocaleString()}\n\nROLL NO\t\tNAME\t\t\tDEPT\t\tSTATUS\n${rows}\n\nSummary:\nPresent: ${students.filter(s=>s.status==='present').length}\nAbsent: ${students.filter(s=>s.status==='absent').length}\nLate: ${students.filter(s=>s.status==='late').length}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `attendance_${date.replace(/\//g,'_')}.txt`;
  a.click();
  showToast('Report exported!', 'success');
}

function saveSession() {
  const subject = document.getElementById('subjectInput').value;
  if (!subject) { showToast('Please enter a subject name', 'error'); return; }
  showToast('Session saved successfully!', 'success');
}

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function switchModal(from, to) { closeModal(from); openModal(to); }

document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
});

function handleLogin(e) {
  e.preventDefault();
  closeModal('loginModal');
  showToast('Welcome back! Logged in successfully.', 'success');
}
function handleSignup(e) {
  e.preventDefault();
  closeModal('signupModal');
  showToast('Account created! Welcome to Attendence-AI.', 'success');
}

// ===== CONTACT FORM =====
function submitContact(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll reply within 24 hours.', 'success');
  e.target.reset();
}

// ===== TOAST =====
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.feature-card').forEach(c => observer.observe(c));

// ===== SPARKLINE (analytics) =====
(function drawSparklines() {
  const spark = document.getElementById('spark1');
  if (!spark) return;
  const canvas = document.createElement('canvas');
  canvas.width = spark.offsetWidth || 260;
  canvas.height = 40;
  spark.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const data = [72, 68, 75, 81, 78, 85, 88, 82, 91, 87];
  const max = Math.max(...data), min = Math.min(...data);
  const w = canvas.width, h = canvas.height;
  const step = w / (data.length - 1);
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#3b82f6');
  ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / (max - min)) * (h - 8) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
})();
