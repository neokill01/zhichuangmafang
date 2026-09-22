# 智创码坊官网

静态站点（HTML/CSS/JS），部署在腾讯云服务器（nginx）。

## 安全约束（必须遵守）

- **要保密的东西**：SSH 私钥、密码、API Key、证书私钥、各类 token / 凭据。不得出现在代码、提交信息、PR 描述、文档或对话输出中。服务器 IP 走 GitHub Secrets 的 `SERVER_HOST`、SSH 私钥走 `SERVER_SSH_KEY`，只引用 secret 名称，不写实际值。
- **服务器 IP 与线上域名不算机密**：域名在公开 DNS 与公共 CA 的 Certificate Transparency 日志里，解析它就能得到服务器 IP（本站直连服务器、无 CDN 前置）。这两个值保护不了，因此**不为此改写 git 历史**；但也没理由主动复述到仓库文档、提交信息或对话里。
  - **例外**：通配符证书下的具体子域（证书只记 `*.example.com`）、从未签过公共证书的内部/测试域名、只在内网解析的 IP —— 这些仍按机密对待。
- **运维配置不入库**：nginx 配置之类只留服务器或本地（`.deploy/`、`*.conf` 已在 `.gitignore`）。服务器的 `/etc/nginx/` 才是权威副本，本地只是备份；需要重建时以服务器为准，别照历史提交反推。
- **查「是否泄露」别只看工作树**：`git grep` 只查当前 HEAD。服务器 IP 曾入库、之后从 HEAD 移除，却一直留在历史提交里 —— 必须查历史（`git log -G<pattern>`），并逐个检查已发布出去的副本（网页产物、CI 产物、镜像与缓存），这类副本往往不止一处。

## Git 工作流约束（必须遵守）

1. **新需求必须新建分支**：从最新的 main 拉出功能分支开发，分支名用 `feat/xxx`、`fix/xxx`、`chore/xxx` 等前缀。
2. **一律通过 PR 合入 main**：不直推 main、不在 main 上直接 commit，也不绕过 PR 自行 merge/push。
3. **PR 创建后默认做代码审查**：对该分支相对 main 的 diff 跑 `/code-review`（必要时带上 PR 号；如需在 PR 上留下可追溯的记录，加 `--comment`），把发现的问题修复并推送；推送修复后需再确认一次审查结论，确认无问题再合入。审查结论（有无问题、修复了什么、所审查的 commit SHA）要在回复中说明，无问题也要明确说明已审查通过。涉及站点文件（`index.html`、`css/`、`js/`、`images/`、`favicon.svg`）或 `.github/**` 工作流时尤其不能省。
   - **豁免**：**整轮改动仅**为说明类文件（`**.md`）时，可跳过 `/code-review`，自己确认没有引入错误即可直接合入；只要 diff 里还混有其他类型的文件，就不算豁免。
     - 两个例外**不豁免**：`.gitignore` 与 `CLAUDE.md` 本身 —— 前者是「运维配置/凭据不入库」的唯一执行手段，删掉一行就可能把已忽略的敏感文件重新纳入跟踪；后者写着这些规则。
   - **兜底**：环境里没有 `/code-review`（换机器、新克隆、CI 等）时，退化为 `gh pr diff` + 人工审查，并在回复中说明是人工审查。
4. **部署随合入自动触发**：PR 合入 main 后，`.github/workflows/deploy.yml` 会自动 rsync 部署到服务器并 reload nginx，无需手动部署，结果以 Actions 运行状态为准；本仓库只部署腾讯云服务器，不使用 GitHub Pages。忽略规则见该工作流的 `paths-ignore`，命中时不会触发、也无需验证部署；需要手动验证时在 Actions 页面用 `workflow_dispatch` 触发。

> 注：以上约束同样对 Claude 生效。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；确需绕过保护（如紧急修复），要先去仓库 Settings → Branches 临时关闭，绕过后同样跳过第 3 条的审查要求。
