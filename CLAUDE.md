# 智创码坊官网

静态站点（HTML/CSS/JS），部署在腾讯云服务器（nginx）。

## 安全约束（必须遵守）

- **机密的定义**：服务器 IP、SSH 私钥、密码、API Key、证书私钥、各类 token / 凭据。这些不得出现在代码、提交信息、PR 描述、文档或对话输出中。
- **已公开的域名不算机密**：已发布到公开 DNS 的域名本就可解析；用 Let's Encrypt 这类公共 CA 签发的证书，还会把证书覆盖的名字写入 Certificate Transparency 日志（crt.sh、Censys 可查）。本仓库的线上域名属此类，公开它不构成额外泄露，因此**不做历史重写**。
  - **例外**：通配符证书只记录 `*.example.com`，不枚举具体子域；从没签过公共证书的内部/测试域名（自签、内网 CA）根本不在 CT 里。这两类名字仍按机密对待。
- **运维配置不入库**：nginx 配置之类的备份文件虽不含机密，却把「活着的站点 + 技术栈 + 目录结构」打包成侦察素材，公开仓库会被批量爬取。这类文件只留服务器或本地，不入库（`.deploy/` 已加入 `.gitignore`）。
  - 注意：从 git 移除只挡后续提交；**历史提交和已发布出去的副本**是另一件事，需单独确认，别默认「已处理」。
- 服务器 IP 通过 GitHub Secrets 的 `SERVER_HOST` 在工作流中使用；SSH 私钥通过 `SERVER_SSH_KEY`。需要用到时引用 secret 名称，不写实际值。

## Git 工作流约束（必须遵守）

1. **禁止直接推送 main 分支**：不要对 main 执行 `git push`，也不要在 main 上直接 commit 后推送。
2. **新需求必须新建分支**：从最新的 main 拉出功能分支开发，分支名用 `feat/xxx`、`fix/xxx`、`chore/xxx` 等前缀。
3. **通过 PR 合入 main**：分支开发完成后，用 `gh` 创建 PR；**创建 PR 与合入是两步**，合入 main 之前必须先完成第 4 条要求的审查（第 4 条豁免的改动除外），不要绕过 PR 直接 merge/push 到 main。
4. **涉及站点文件或工作流时必须做代码审查**：diff 里包含 `index.html`、`css/`、`js/`、`images/` 等站点文件，或 `.github/**` 下的工作流改动时，PR 创建后对该分支相对 main 的 diff 跑 `/code-review`（用内置 skill，必要时带上 PR 号；如需在 PR 上留下可追溯的记录，加 `--comment`），把发现的问题修复并推送；推送修复后需再确认一次审查结论，确认无问题再合入。审查结论（有无问题、修复了什么）要在回复中说明，无问题也要明确说明已审查通过，并给出所审查的 commit SHA。
   - **豁免**：整轮改动仅为文档/说明类文件（`**.md`、`.gitignore`、`docs/**`）时，**不跑 `/code-review`**，自己确认没有引入错误即可直接合入。
   - **兜底**：若当前环境没有 `/code-review`（换机器、新克隆、CI 等），退化为 `gh pr diff` + 人工审查，并在回复中说明是人工审查。
5. **部署随合入自动触发**：PR 合入 main 后，`.github/workflows/deploy.yml` 会自动 rsync 部署到服务器并 reload nginx，无需手动部署；部署结果以 Actions 运行状态为准。仓库只部署到腾讯云服务器，不使用 GitHub Pages。
   - **例外**：若改动仅涉及项目说明/配置类文件（`**.md`、`.gitignore`、`docs/**`、`.claude/**`、`.github/**`、`.deploy/**`），deploy.yml 不会触发，此时无需验证部署；需要手动验证时，在 Actions 页面用 `workflow_dispatch` 手动触发。

> 注：以上工作流约束（第 1–5 条）同时对 Claude 生效。GitHub 侧已对 main 开启分支保护（要求 PR、禁止直推、禁止 force push / 删除），对仓库管理员（包括你自己）同样生效；如需绕过保护（如紧急修复），需先在仓库 Settings → Branches 中临时关闭（注意：绕过后同样跳过第 4 条的审查要求）。
