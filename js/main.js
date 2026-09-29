// 移动端菜单
function initMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

// 滚动渐入动画（错峰）
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const delay = [...(el.parentElement.children)].indexOf(el) * 90;
          el.style.transitionDelay = delay + "ms";
          el.classList.add("reveal", "reveal-in");
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );
  document
    .querySelectorAll(".section__head, .positioning__card, .service, .cta, .reveal-item")
    .forEach((el) => observer.observe(el));
}

// 导航滚动进度条 + 工作流程时间轴（合并为一个 rAF 节流的滚动监听）
function initScrollEffects() {
  const bar = document.getElementById("scrollProgress");
  const line = document.getElementById("processLine");
  const wrap = document.querySelector(".process");
  let ticking = false;

  const update = () => {
    ticking = false;
    // 进度条
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
    // 时间轴
    if (line && wrap) {
      const r = wrap.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / r.height));
      line.style.height = progress * 100 + "%";
    }
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

// Hero 打字机轮播
function initTyping() {
  const el = document.getElementById("typingText");
  if (!el) return;
  const words = ["AI 应用开发", "移动端产品", "研发效率工具", "AI Agent 定制"];
  let wi = 0, ci = 0, deleting = false;
  (function tick() {
    const word = words[wi];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let wait = deleting ? 45 : 110;
    if (!deleting && ci === word.length) { wait = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; wait = 320; }
    setTimeout(tick, wait);
  })();
}

// 终端打字模拟（持久 caret + textContent 更新，避免逐帧 innerHTML 解析）
function initTerminal() {
  const codeEl = document.querySelector("#terminalBody code");
  if (!codeEl) return;
  const lines = [
    { cls: "t-cmd", text: "$ zhichuang create --idea \"你的好点子\"" },
    { cls: "t-dim", text: "▸ 解析需求中…" },
    { cls: "t-flag", text: "✓ 原型设计完成" },
    { cls: "t-flag", text: "✓ 开发实现完成" },
    { cls: "t-flag", text: "✓ 测试与部署完成" },
    { cls: "t-str", text: "🚀 产品已上线 · 让代码创造价值" },
    { cls: "t-dim", text: "$ " },
  ];
  let li = 0, chi = 0;
  let current = null, caret = null;

  function newLine(cls) {
    current = document.createElement("span");
    current.className = cls;
    caret = document.createElement("span");
    caret.className = "t-caret";
    codeEl.append(current, caret, "\n");
  }
  (function tick() {
    if (li >= lines.length) {
      // 全部打完，停留 3s 后重来
      setTimeout(() => {
        codeEl.textContent = "";
        li = 0; chi = 0; current = null; caret = null;
        tick();
      }, 3000);
      return;
    }
    const { cls, text } = lines[li];
    if (!current) newLine(cls);
    chi++;
    current.textContent = text.slice(0, chi);
    if (chi >= text.length) {
      // 该行完成：移除 caret，换下一行
      caret.remove();
      current = null; caret = null;
      li++; chi = 0;
      setTimeout(tick, li === lines.length ? 200 : 420);
    } else {
      setTimeout(tick, 30);
    }
  })();
}

// 卡片 3D 倾斜 + 光标聚光灯（rAF 调度；触屏设备禁用倾斜）
function initCardEffects() {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll(".tilt");
  cards.forEach((card) => {
    let raf = 0, px = 0, py = 0;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      card.style.setProperty("--mx", px + "px");
      card.style.setProperty("--my", py + "px");
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rx = ((py / r.height) - 0.5) * -8;
          const ry = ((px / r.width) - 0.5) * 8;
          card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
      }
    }, { passive: true });
    card.addEventListener("mouseleave", () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.style.transform = "";
    });
  });
}

// Hero 粒子网络背景（鼠标交互；平方距离判重 + 页面隐藏暂停 + 小屏降载）
function initParticles() {
  const canvas = document.getElementById("bgParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LINK_DIST = 130, LINK_DIST2 = LINK_DIST * LINK_DIST;
  const MOUSE_DIST = 190;
  let w, h, particles = [], rafId = 0, running = false;
  let mx = null, my = null, resizeTimer = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    // 大屏每 11000px² 一个粒子，小屏每 16000px²，上限 90
    const factor = w < 760 ? 16000 : 11000;
    const count = Math.min(90, Math.floor((w * h) / factor));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  const BUCKETS = 4; // 连线按透明度分 4 桶，批量 stroke，减少 draw call
  function draw() {
    rafId = 0;
    ctx.clearRect(0, 0, w, h);
    const n = particles.length;
    for (let i = 0; i < n; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // 鼠标吸引（平方距离粗筛）
      if (mx !== null) {
        const dx = mx - p.x, dy = my - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 0.001) {
          const d = Math.sqrt(d2);
          p.x += (dx / d) * 0.35;
          p.y += (dy / d) * 0.35;
        }
      }
    }
    // 连线：平方距离判重 + 分桶批量绘制
    const segs = Array.from({ length: BUCKETS }, () => []);
    for (let i = 0; i < n; i++) {
      const a = particles[i];
      for (let j = i + 1; j < n; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST2) {
          const t = 1 - Math.sqrt(d2) / LINK_DIST; // 0~1
          segs[Math.min(BUCKETS - 1, (t * BUCKETS) | 0)].push(a.x, a.y, b.x, b.y);
        }
      }
      // 画点
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 92, 255, 0.5)";
      ctx.fill();
    }
    ctx.lineWidth = 1;
    for (let k = 0; k < BUCKETS; k++) {
      const list = segs[k];
      if (!list.length) continue;
      ctx.strokeStyle = `rgba(62, 198, 255, ${((k + 1) / BUCKETS) * 0.18})`;
      ctx.beginPath();
      for (let s = 0; s < list.length; s += 4) {
        ctx.moveTo(list[s], list[s + 1]);
        ctx.lineTo(list[s + 2], list[s + 3]);
      }
      ctx.stroke();
    }
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!running) { running = true; rafId = requestAnimationFrame(draw); }
  }
  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    running = false;
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  window.addEventListener("mouseout", () => { mx = null; my = null; });
  // 页面不可见时暂停，省电省帧
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  resize();
  if (!reduced) start();
}

// 离屏暂停：Hero 装饰动画与 Marquee 滚出视口后自动停摆
function initOffscreenPause() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("offscreen", !e.isIntersecting);
      });
    },
    { rootMargin: "80px" }
  );
  document.querySelectorAll(".hero, .marquee").forEach((el) => io.observe(el));
}

// 年份
document.getElementById("year").textContent = new Date().getFullYear();

initMenu();
initReveal();
initScrollEffects();
initTyping();
initTerminal();
initCardEffects();
initParticles();
initOffscreenPause();
