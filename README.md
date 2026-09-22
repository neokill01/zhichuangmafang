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

- **腾讯云服务器（正式站点）**：`.github/workflows/deploy.yml` 通过 rsync 同步 `index.html`、`favicon.svg`、`css/`、`js/`、`images/` 到服务器并 reload nginx

仅改动说明/配置类文件（`**.md`、`.gitignore`、`docs/**`、`.claude/**`、`.github/**`、`.deploy/**`）时不会触发部署，需要手动验证时在 Actions 页面用 `workflow_dispatch` 触发。

仓库只部署到腾讯云服务器，不使用 GitHub Pages。

开发流程见 [CLAUDE.md](CLAUDE.md)：新需求走分支 + PR；涉及站点文件或工作流的改动，合入前须通过代码审查。

## 联系方式

📮 neokill88@gmail.com
