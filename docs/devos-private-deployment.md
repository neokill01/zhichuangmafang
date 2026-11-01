# DevOS 私有服务部署

管理端源码属于 neokill01/ai-native-sdlc，不移入官网工程。本仓库仅复用现有 SSH 部署连接，把固定、已验收的 DevOS 构建部署到同一服务器的独立目录。

`.github/workflows/devos-private-deploy.yml` 在自身合入 main 时部署，也支持手动运行。它在 CI 构建 React，打包零第三方依赖的 API；独立 Node 24 在服务器从 nodejs.org 下载，并按已核实的官方 SHA-256 校验；不替换服务器原有 Node、不运行前端依赖安装、不修改 nginx 或官网目录。

服务器私有服务：agentic-devos，代码 /opt/agentic-devos/current，数据 /var/lib/agentic-devos，loopback 端口 4317。专用无登录权限用户、384 MiB 内存上限、半核 CPU 配额。预检要求可用内存至少 512 MiB、空闲盘至少 1 GiB；端口被无关服务占用则停止。归档核验 SHA-256，启动后自动跑一项固定 Mock 样例，确认真实退出码 1→0 和报告保留；失败恢复原私有服务版本。

本阶段不是公网管理后台。拥有服务器 SSH 访问权限的操作者，可在自己的电脑上建立本地转发（服务器地址只在自己的终端填写，不写进仓库）：

```bash
ssh -N -L 4317:127.0.0.1:4317 ubuntu@YOUR_SERVER
```

随后在同一电脑浏览器打开 http://127.0.0.1:4317 。本地与服务器端口保持相同，以满足 Host 校验。这里没有放宽 Host/Origin、开放安全组或配置公网反向代理。

如需手机直接从公网打开，后续先增加登录认证和受保护 HTTPS 入口。原始 SSH 部署密钥和服务器地址始终通过现有 GitHub Secrets 引用，不打印、不复制到其他仓库。

传输优化：CI 仅上传应用代码与 React 构建，避免跨境 scp 传输大型 Node 二进制。官方 Node 24.22.2 运行时下载到独立缓存后复用，不替换系统 Node；部署仍验证真实样例与报告。并发部署只保留最新 run，远端服务切换阶段遇到 HUP/TERM/INT 会触发回滚。
