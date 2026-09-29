import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

// 仅在 mobile project（iPhone 13 视口）下运行
test.use({ viewport: { width: 390, height: 844 } });

test.describe('移动端（H5 视口）', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', '仅 mobile project 执行');
  });

  test('无横向溢出', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.section('contact')).toBeInViewport({ timeout: 10_000 }).catch(() => {});
    expect(await home.hasHorizontalOverflow()).toBe(false);
  });

  test('桌面导航链接默认隐藏，汉堡菜单可开合', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const toggle = home.navToggle;
    await expect(toggle).toBeVisible();
    const links = home.navLinks;

    // 初始未展开
    await expect(links).not.toHaveClass(/open/);

    // 点击展开
    await toggle.click();
    await expect(links).toHaveClass(/open/);

    // 点击链接后自动收起并跳转
    await links.getByRole('link', { name: '联系' }).click();
    await expect(links).not.toHaveClass(/open/);
    await expect(home.section('contact')).toBeInViewport({ ratio: 0.2, timeout: 10_000 });
  });

  test('核心区块在移动端可见且可滚动到达', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    for (const id of ['positioning', 'services', 'packages', 'process', 'contact']) {
      await home.section(id).scrollIntoViewIfNeeded();
      await expect(home.section(id)).toBeInViewport({ ratio: 0.1, timeout: 10_000 });
    }
  });

  test('移动端备案信息与邮箱入口可见', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator('a.footer__icp')).toBeVisible();
    await expect(footer.locator('a.footer__psb')).toBeVisible();
    const mail = page.locator('a[href^="mailto:neokill88@gmail.com"]').first();
    await mail.scrollIntoViewIfNeeded();
    await expect(mail).toBeAttached();
  });
});
