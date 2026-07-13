// ============================================
// Hero role-word crossfade
// ============================================
(function initRoleCycle() {
  const words = document.querySelectorAll('.role-cycle__word');
  if (!words.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || words.length < 2) return;

  let idx = 0;
  setInterval(() => {
    words[idx].classList.remove('is-active');
    idx = (idx + 1) % words.length;
    words[idx].classList.add('is-active');
  }, 2600);
})();

// ============================================
// Nav: scroll shadow + mobile toggle
// ============================================
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
})();

// ============================================
// Scroll-triggered section reveals
// ============================================
(function initReveals() {
  const targets = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => io.observe(t));
})();

// ============================================
// Count-up animation for stat numbers
// ============================================
(function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

    if (prefersReducedMotion) {
      el.textContent = decimals ? target.toFixed(decimals) : target;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
})();

// ============================================
// Scroll progress bar
// ============================================
(function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

// ============================================
// Custom cursor dot (desktop only, css hides on touch)
// ============================================
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;
  let active = false;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    if (!active) { dot.classList.add('is-active'); active = true; }
  });
  document.querySelectorAll('a, button, .tags span, .project-card, .fact').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-hover'));
  });
})();

// ============================================
// Hero editor: typewriter effect building the "about.py" snippet
// ============================================
(function initEditorTyping() {
  const codeEl = document.getElementById('editorCode');
  const gutterEl = document.getElementById('editorGutter');
  const statusEl = document.getElementById('statusMsg');
  if (!codeEl || !gutterEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each line: array of {t: token class or null, s: text}
  const lines = [
    [{ t: 'com', s: '# Who am I..?' }],
    [{ t: 'key', s: 'class ' }, { t: 'fn', s: 'DruvaKumarV' }, { s: ':' }],
    [{ s: '    ' }, { t: 'key', s: 'def ' }, { t: 'fn', s: '__init__' }, { s: '(self):' }],
    [{ s: '        self.role = ' }, { t: 'str', s: '"AI/ML Engineer"' }],
    [{ s: '        self.based_in = ' }, { t: 'str', s: '"Kollegal,Karnataka"' }],
    [{ s: '        self.cgpa = ' }, { t: 'num', s: '7.95' }],
    [{ s: '        self.stack = [' }],
    [{ s: '            ' }, { t: 'str', s: '"Python"' }, { s: ', ' }, { t: 'str', s: '"DSA"' }, { s: ', ' }, { t: 'str', s: '"Django"' }, { s: ',' }],
    [{ s: '            ' }, { t: 'str', s: '"GenAI"' }, { s: ', ' }, { t: 'str', s: '"RAG"' }, { s: ', ' }, { t: 'str', s: '"LLMs"' }, { s: ','}],
    [{ s: '            ' },{ t: 'str', s: '"Machine Learning"' }, { s: ', ' }, { t: 'str', s: '"SQL"' }],
    [{ s: '        ]' }],
    [{ s: '' }],
    [{ s: '    ' }, { t: 'key', s: 'def ' }, { t: 'fn', s: 'ship' }, { s: '(self, idea):' }],
    [{ s: '        ' }, { t: 'key', s: 'return ' }, { t: 'fn', s: 'build' }, { s: '(idea).' }, { t: 'fn', s: 'deploy' }, { s: '()' }],
  ];

  if (prefersReducedMotion) {
    codeEl.innerHTML = lines.map(renderLine).join('\n');
    gutterEl.innerHTML = lines.map((_, i) => (i + 1)).join('<br>');
    if (statusEl) statusEl.textContent = 'UTF-8 · Python · Ready';
    return;
  }

  function renderLine(line) {
    return line.map(part => {
      const text = escapeHtml(part.s);
      return part.t ? `<span class="tok-${part.t}">${text}</span>` : text;
    }).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  let lineIdx = 0;
  let charIdx = 0;
  let flatChars = [];

  function flattenLine(line) {
    const out = [];
    line.forEach(part => {
      for (const ch of part.s) out.push({ ch, t: part.t });
    });
    return out;
  }

  function typeNextLine() {
    if (lineIdx >= lines.length) {
      codeEl.querySelector('.tok-cursor')?.remove();
      codeEl.insertAdjacentHTML('beforeend', '<span class="tok-cursor"></span>');
      if (statusEl) statusEl.textContent = 'UTF-8 · Python · Ready';
      return;
    }
    flatChars = flattenLine(lines[lineIdx]);
    charIdx = 0;
    gutterEl.innerHTML += (lineIdx + 1) + '<br>';
    codeEl.insertAdjacentHTML('beforeend', `<span class="line-${lineIdx}"></span>`);
    typeChar();
  }

  function typeChar() {
    const lineSpan = codeEl.querySelector(`.line-${lineIdx}`);
    if (charIdx < flatChars.length) {
      const built = flatChars.slice(0, charIdx + 1);
      // group consecutive same-token chars for rendering
      let html = '';
      let curT = built[0].t;
      let buf = '';
      built.forEach((c, i) => {
        if (c.t !== curT) {
          html += curT ? `<span class="tok-${curT}">${escapeHtmlChar(buf)}</span>` : escapeHtmlChar(buf);
          buf = ''; curT = c.t;
        }
        buf += c.ch;
      });
      html += curT ? `<span class="tok-${curT}">${escapeHtmlChar(buf)}</span>` : escapeHtmlChar(buf);
      lineSpan.innerHTML = html;
      charIdx++;
      setTimeout(typeChar, 12 + Math.random() * 18);
    } else {
      codeEl.insertAdjacentHTML('beforeend', '\n');
      lineIdx++;
      setTimeout(typeNextLine, 90);
    }
  }

  function escapeHtmlChar(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  setTimeout(typeNextLine, 500);
})();

// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();
