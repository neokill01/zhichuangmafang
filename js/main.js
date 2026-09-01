// 产品数据
const products = [
  {
    emoji: "📝",
    title: "灵感笔记",
    desc: "极简 Markdown 笔记应用，支持标签、全文搜索与多端同步，让记录成为习惯。",
    tags: ["iOS", "Android"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
  {
    emoji: "⏱️",
    title: "番茄专注",
    desc: "基于番茄工作法的专注计时器，配合白噪音与统计报表，高效管理精力。",
    tags: ["iOS", "效率工具"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
  {
    emoji: "📊",
    title: "记账小管家",
    desc: "轻量记账与预算管理工具，图表可视化收支，自动生成月度报告。",
    tags: ["Android", "Web"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
  {
    emoji: "🌐",
    title: "智能书签",
    desc: "AI 驱动的书签整理器，自动分类、去重并提炼摘要，收藏不再吃灰。",
    tags: ["Web", "AI"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
  {
    emoji: "🔐",
    title: "密码保险箱",
    desc: "本地加密的密码管理器，支持生物识别解锁与跨设备安全备份。",
    tags: ["iOS", "Android"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
  {
    emoji: "🎨",
    title: "像素画板",
    desc: "轻松创作像素艺术与表情包，内置调色板与一键导出 GIF。",
    tags: ["iOS", "创作"],
    links: [{ label: "了解更多", href: "#contact" }],
  },
];

// 渲染产品卡片
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product glass reveal">
        <div class="product__cover">${p.emoji}</div>
        <div class="product__body">
          <h3 class="product__title">${p.title}</h3>
          <p class="product__desc">${p.desc}</p>
          <div class="product__meta">
            ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div class="product__links">
            ${p.links.map((l) => `<a href="${l.href}">${l.label} →</a>`).join("")}
          </div>
        </div>
      </article>`
    )
    .join("");
}

// 移动端菜单
function initMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

// 滚动渐入动画
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".section__head, .about__card, .stack__item, .cta").forEach((el) =>
    observer.observe(el)
  );
}

// 年份
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
initMenu();
initReveal();
