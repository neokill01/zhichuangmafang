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
- **GitHub Pages**：`.github/workflows/pages.yml` 发布整仓内容

仅改动说明/配置类文件（`**.md`、`.gitignore`、`docs/**`、`.claude/**`、`.github/**`）时两个工作流都不会触发，需要手动验证部署时在 Actions 页面用 `workflow_dispatch` 触发。

开发流程见 [CLAUDE.md](CLAUDE.md)：新需求走分支 + PR，合入前须通过代码审查。

## 联系方式

📮 neokill88@gmail.com
