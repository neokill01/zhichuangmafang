# 智创码坊 · 个人品牌网站

个人开发者品牌「智创码坊」的官方网站，用于应用宣传与推广。科技主题、深色 UI、响应式布局。

## 技术栈

- 纯静态 HTML / CSS / JavaScript（无构建依赖）
- 现代 CSS：Grid、Flex、CSS 变量、渐变、玻璃拟态
- 原生 IntersectionObserver 滚动动画

## 本地预览

```bash
python3 -m http.server 8090
# 访问 http://127.0.0.1:8090
```

## 部署

推送到 `main` 分支后由 GitHub Actions 自动部署，合入 main 的 PR 即触发：

- **腾讯云服务器（正式站点）**：`.github/workflows/deploy.yml` 通过 rsync 同步站点文件到服务器并 reload nginx

仅改动说明/配置类文件时不会触发部署，忽略规则以 `.github/workflows/deploy.yml` 的 `paths-ignore` 为准；需要手动验证时在 Actions 页面用 `workflow_dispatch` 触发。

仓库只部署到腾讯云服务器，不使用 GitHub Pages。

### 静态资源缓存

服务器对 `css/`、`js/`、`svg` 响应设了 7 天强缓存（`Cache-Control: max-age=604800`）。

- **带版本号**（`index.html` 中引用带 `?v=`）：`css/style.css`、`js/analytics.js`
  - 改这两个文件：**必须**把 `?v=` 改成新日期，否则老访客在缓存过期前仍看到旧内容（2026-09-21 踩过一次）
- **无版本号**（裸引用）：`js/main.js`、`favicon.svg`
  - 改它们时没有版本号可用，稳妥做法是顺手给引用加上 `?v=<日期>`

## 访问统计

百度统计（站点 `www.zcmfopc.com`）。

- **PV 统计**：官方加载代码内联在 `index.html` 的 `</head>` 前（按百度官方安装说明），站点 ID 即代码里 `hm.js?` 后的参数。这段代码不要挪进 `js/main.js`（该文件裸引用、无版本号，受 7 天强缓存影响，改动对老访客不生效）
- **事件埋点**：`js/analytics.js`（引用带 `?v=` 版本号，改它必须同步更新日期）
  - 点击埋点：HTML 元素上标 `data-track="<位置标识>"`，点击上报 `_trackEvent(click, <位置标识>, <页面路径>)`
  - 转化埋点：滚动到 `#contact` 上报 `_trackEvent(view, contact-section, <页面路径>)`，只报一次
- 查数据：百度统计后台 → 行为分析 → 事件分析
- 代码安装检测：百度统计后台 → 代码安装检查（安装正确约 20 分钟出数据）

开发流程见 [CLAUDE.md](CLAUDE.md)：新需求走分支 + PR；合入前默认要过代码审查（豁免范围很小且有两个例外，以 CLAUDE.md 第 3 条为准）。

## 联系方式

📮 neokill88@gmail.com
