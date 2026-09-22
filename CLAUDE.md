# 智创码坊官网

静态站点（HTML/CSS/JS），部署在腾讯云服务器（nginx）。

## 安全约束（必须遵守）

- **真正要保密的东西**：SSH 私钥、密码、API Key、证书私钥（`privkey.pem`）、各类 token / 凭据。这些不得出现在代码、提交信息、PR 描述、文档或对话输出中。
- **服务器 IP 与线上域名算「已公开」，不算机密**：域名发布在公开 DNS 上、并由公共 CA（Let's Encrypt）写进 Certificate Transparency 日志（crt.sh、Censys 可查）；解析该域名就能得到服务器 IP（本仓库即如此，站点直连服务器、无 CDN 前置）。这两个值保护不了，因此**不为此改写 git 历史**。
  - **例外**：通配符证书只记录 `*.example.com`，不枚举具体子域；从未签过公共证书的内部/测试域名不在 CT 里；只在内网解析的 IP 也不在公开 DNS 里。这些仍按机密对待。
- **运维配置不入库**：nginx 配置之类的备份文件虽不含机密，却把「活着的站点 + 技术栈 + 目录结构」打包成侦察素材，公开仓库会被批量爬取。这类文件只留服务器或本地（`.deploy/`、`*.conf` 已在 `.gitignore`）。
- **判断「是否泄露」时别只看工作树**：`git grep` 只查当前 HEAD。本仓库的服务器 IP 曾入库、之后虽从 HEAD 移除，却一直留在历史提交里 —— 要确认必须查历史（`git log -G<pattern>`），以及已经发布出去的副本（例如当时的 GitHub Pages 产物）。
- 服务器 IP 通过 GitHub Secrets 的 `SERVER_HOST` 在工作流中使用；SSH 私钥通过 `SERVER_SSH_KEY`。需要用到时引用 secret 名称，不写实际值。

## Git 工作流约束（必须遵守）

1. **禁止直接推送 main 分支**：不要对 main 执行 `git push`，也不要在 main 上直接 commit 后推送。
2. **新需求必须新建分支**：从最新的 main 拉出功能分支开发，分支名用 `feat/xxx`、`fix/xxx`、`chore/xxx` 等前缀。
3. **通过 PR 合入 main**：分支开发完成后，用 `gh` 创建 PR；**创建 PR 与合入是两步**，合入 main 之前必须先完成第 4 条要求的审查（第 4 条豁免的改动除外），不要绕过 PR 直接 merge/push 到 main。
4. **PR 创建后默认要做代码审查**：对该分支相对 main 的 diff 跑 `/code-review`（用内置 skill，必要时带上 PR 号；如需在 PR 上留下可追溯的记录，加 `--comment`），把发现的问题修复并推送；推送修复后需再确认一次审查结论，确认无问题再合入。审查结论（有无问题、修复了什么）要在回复中说明，无问题也要明确说明已审查通过，并给出所审查的 commit SHA。涉及站点文件（`index.html`、`css/`、`js/`、`images/`、`favicon.svg`）或 `.github/**` 工作流时尤其不能省。
   - **豁免**：**整轮改动仅**为文档/说明类文件（`**.md`，`docs/**` 下的说明文档也算）时，跳过 `/code-review`，自己确认没有引入错误即可直接合入。只要 diff 里还混有其他类型的文件，就不算豁免。
     - `.gitignore` **不在豁免内**：它是「运维配置/凭据不入库」这条策略的唯一执行手段，删掉其中一行就可能把已忽略的敏感文件重新纳入跟踪，因此改它必须审查。
   - **兜底**：若当前环境没有 `/code-review`（换机器、新克隆、CI 等），退化为 `gh pr diff` + 人工审查，并在回复中说明是人工审查。
5. **部署随合入自动触发**：PR 合入 main 后，`.github/workflows/deploy.yml` 会自动 rsync 部署到服务器并 reload nginx，无需手动部署；部署结果以 Actions 运行状态为准。仓库只部署到腾讯云服务器，不使用 GitHub Pages。
   - **例外**：改动仅涉及说明/配置类文件时不触发部署（忽略规则以 `.github/workflows/deploy.yml` 的 `paths-ignore` 为准，只有全部改动都命中才跳过），此时无需验证部署；需要手动验证时，在 Actions 页面用 `workflow_dispatch` 手动触发。

> 注：以上工作流约束（第 1–5 条）同时对 Claude 生效。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；如需绕过保护（如紧急修复），需先在仓库 Settings → Branches 中临时关闭（注意：绕过后同样跳过第 4 条的审查要求）。
