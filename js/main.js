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
  document
    .querySelectorAll(".section__head, .positioning__card, .service, .stack__item, .cta")
    .forEach((el) => observer.observe(el));
}

// 年份
document.getElementById("year").textContent = new Date().getFullYear();

initMenu();
initReveal();
