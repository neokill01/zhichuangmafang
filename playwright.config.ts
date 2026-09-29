/**
 * playwright.config 模板 — e2e-tester 技能
 * 双 project：desktop（1280x720）+ mobile（iPhone 13 视口模拟）
 * 强制 headless（沙箱环境无 GUI）
 */
import { defineConfig, devices } from '@playwright/test';

// 被测地址：本地 dev server 或在线 URL，可通过环境变量覆盖
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  // 排除 pages 子目录（POM 不是用例）
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 4,
  // JSON reporter 供 render_report.py 消费；失败时追加 list 报告便于终端查看
  reporter: [
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    headless: true, // 沙箱强制 headless，勿改
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  outputDir: 'test-results/artifacts',

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      // H5 项目只用 mobile project 即可：--project=mobile
      // 注意：iPhone 设备预设默认 WebKit，本机仅装 Chromium，必须显式指定 browserName
      name: 'mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
  ],
});
