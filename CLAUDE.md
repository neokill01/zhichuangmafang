# 智创麦坊官网

静态站点（HTML/CSS/JS），部署在腾讯云服务器（82.156.112.159，nginx）。

## Git 工作流约束（必须遵守）

1. **禁止直接推送 main 分支**：不要对 main 执行 `git push`，也不要在 main 上直接 commit 后推送。
2. **新需求必须新建分支**：从最新的 main 拉出功能分支开发，分支名用 `feat/xxx`、`fix/xxx`、`chore/xxx` 等前缀。
3. **通过 PR 合入 main**：分支开发完成、提交后，用 `gh` 创建 PR 并合入 main；不要绕过 PR 直接 merge/push 到 main。
4. **部署随合入自动触发**：PR 合入 main 后，`.github/workflows/deploy.yml` 会自动 rsync 部署到服务器并 reload nginx，无需手动部署；部署结果以 Actions 运行状态为准。
   - **例外**：若改动仅涉及项目说明/配置类文件（`**.md`、`.gitignore`、`docs/**`、`.claude/**`、`.github/**`），两个部署工作流（deploy.yml / pages.yml）都不会触发。需要手动验证部署时，在 Actions 页面用 `workflow_dispatch` 手动触发。

> 注：以上第 1 条同时对 Claude 生效（工作流约束）。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；如需绕过保护（如紧急修复），需先在仓库 Settings → Branches 中临时关闭。
