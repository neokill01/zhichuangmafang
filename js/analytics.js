// 关键行为埋点（配合 index.html <head> 内的百度统计加载代码）
// 事件经 window._hmt 队列上报；统计脚本被拦截时队列仍在，不会报错
(function () {
  window._hmt = window._hmt || [];

  function track(category, action, label) {
    window._hmt.push(["_trackEvent", category, action, label]);
  }

  var page = location.pathname;

  // 点击埋点：HTML 上用 data-track="<位置标识>" 标注需要追踪的元素
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      track("click", el.dataset.track, page);
    });
  });

  // 转化埋点：滚动到联系区（潜在线索）
  var contact = document.getElementById("contact");
  if (contact && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            track("view", "contact-section", page);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(contact);
  }
})();
