import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object：智创码坊官网首页（单页站点）
 * 选择器优先使用稳定 id / role，不依赖易变 CSS 类名
 */
export class HomePage {
  readonly page: Page;
  readonly nav: Locator;
  readonly navToggle: Locator;
  readonly navLinks: Locator;
  readonly typingText: Locator;
  readonly terminalBody: Locator;
  readonly footerYear: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('#nav');
    this.navToggle = page.locator('#navToggle');
    this.navLinks = page.locator('#navLinks');
    this.typingText = page.locator('#typingText');
    this.terminalBody = page.locator('#terminalBody code');
    this.footerYear = page.locator('#year');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.nav).toBeVisible();
  }

  /** 收集页面未捕获 JS 异常（pageerror = 真实脚本错误，资源加载失败不计入） */
  collectPageErrors(): string[] {
    const errors: string[] = [];
    this.page.on('pageerror', (err) => errors.push(err.message));
    return errors;
  }

  /** 收集本站（同源）资源加载失败，外链（统计脚本等）不在此列 */
  collectLocalResourceFailures(): string[] {
    const failures: string[] = [];
    this.page.on('response', (res) => {
      const url = new URL(res.url());
      if (url.origin === new URL(this.page.url()).origin && res.status() >= 400) {
        failures.push(`${res.status()} ${url.pathname}`);
      }
    });
    return failures;
  }

  section(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  async clickNavLink(label: string) {
    const link = this.navLinks.getByRole('link', { name: label });
    // 移动端视口：导航链接藏在汉堡菜单内，需先展开
    if (await this.navToggle.isVisible()) {
      await this.navToggle.click();
      await expect(this.navLinks).toHaveClass(/open/);
    }
    await link.click();
  }

  /** 移动端横向溢出检测（允许 1px 误差） */
  async hasHorizontalOverflow(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth > 1
    );
  }
}
