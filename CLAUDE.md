# 智创码坊官网

静态站点（HTML/CSS/JS），部署在腾讯云服务器（nginx）。

## 安全约束（必须遵守）

- 不要在任何代码、提交信息、PR 描述、文档或对话输出中暴露敏感信息：服务器 IP/域名、SSH 私钥、密码、API Key 等。
- 服务器 IP 通过 GitHub Secrets 的 `SERVER_HOST` 在工作流中使用；SSH 私钥通过 `SERVER_SSH_KEY`。需要用到时引用 secret 名称，不写实际值。

## Git 工作流约束（必须遵守）

1. **禁止直接推送 main 分支**：不要对 main 执行 `git push`，也不要在 main 上直接 commit 后推送。
2. **新需求必须新建分支**：从最新的 main 拉出功能分支开发，分支名用 `feat/xxx`、`fix/xxx`、`chore/xxx` 等前缀。
3. **通过 PR 合入 main**：分支开发完成后，用 `gh` 创建 PR；**创建 PR 与合入是两步**，合入 main 之前必须先完成第 4 条的代码审查，不要绕过 PR 直接 merge/push 到 main。
4. **创建 PR 后必须做代码审查**：PR 创建后，对该分支相对 main 的 diff 跑 `/code-review`（用内置 skill，必要时带上 PR 号；如需在 PR 上留下可追溯的记录，加 `--comment`），把发现的问题修复并推送；推送修复后需再确认一次审查结论，确认无问题再合入。审查结论（有无问题、修复了什么）要在回复中说明，无问题也要明确说明已审查通过，并给出所审查的 commit SHA。
   - **例外**：整轮改动仅为文档/说明类文件（`**.md`、`.gitignore`、`docs/**`）时，审查一轮即可，纯文字修订无需反复重跑；一旦涉及 `index.html`、`css/`、`js/`、`images/` 等站点文件，修复后的版本必须重新审查。
   - **兜底**：若当前环境没有 `/code-review`（换机器、新克隆、CI 等），退化为 `gh pr diff` + 人工审查，并在回复中说明是人工审查。
5. **部署随合入自动触发**：PR 合入 main 后，`.github/workflows/deploy.yml` 会自动 rsync 部署到服务器并 reload nginx，无需手动部署；部署结果以 Actions 运行状态为准。
   - **例外**：若改动仅涉及项目说明/配置类文件（`**.md`、`.gitignore`、`docs/**`、`.claude/**`、`.github/**`），两个部署工作流（deploy.yml / pages.yml）都不会触发。需要手动验证部署时，在 Actions 页面用 `workflow_dispatch` 手动触发。

> 注：以上工作流约束（第 1–5 条）同时对 Claude 生效。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；如需绕过保护（如紧急修复），需先在仓库 Settings → Branches 中临时关闭（注意：绕过后同样跳过第 4 条的审查要求）。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；如需绕过保护（如紧急修复），需先在仓库 Settings → Branches 中临时关闭。
