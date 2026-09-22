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

服务器对 `css/`、`js/`、`svg` 响应设了 7 天强缓存。**改 `css/style.css` 或 `js/*.js` 时，必须同时把 `index.html` 里引用处的 `?v=` 改成新日期**（当前为 `?v=20260921`），否则老访客在缓存过期前仍看到旧文件 —— 这个坑 2026-09-21 踩过一次。

开发流程见 [CLAUDE.md](CLAUDE.md)：新需求走分支 + PR；合入前**默认**要过代码审查，只有整轮改动都是纯文档才免审（口径以 CLAUDE.md 第 4 条为准）。

## 联系方式

📮 neokill88@gmail.com
