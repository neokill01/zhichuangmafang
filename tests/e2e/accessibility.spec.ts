import { test, expect } from '@playwright/test';

// These checks cover behavior; they do not claim full accessibility compliance.
test('键盘可跳过导航并聚焦主要内容', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: '跳到主要内容' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('移动菜单状态、Esc 关闭、外部点击及断点切换保持一致', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('#navToggle');
  const links = page.locator('#navLinks');
  await expect(toggle).toHaveAttribute('aria-controls', 'navLinks');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await links.getByRole('link', { name: '联系', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(links).toBeHidden();
  await toggle.click();
  await page.locator('.hero__actions').click({ position: { x: 4, y: 4 } });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(links).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(links).toBeHidden();
  const bounds = await toggle.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
});

test('减少动画时静态显示打字内容且禁用平滑滚动', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const typing = page.locator('#typingText');
  const terminal = page.locator('#terminalBody code');
  await expect(typing).toHaveText('AI 应用开发');
  await expect(terminal).toContainText('产品已上线');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  const content = await terminal.textContent();
  await page.waitForTimeout(350);
  await expect(typing).toHaveText('AI 应用开发');
  await expect(terminal).toHaveText(content!);
});

test.describe('无 JavaScript 降级', () => {
  test.use({ javaScriptEnabled: false });
  test('服务卡片与联系入口仍可见', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.reveal-item');
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) await expect(card).toHaveCSS('opacity', '1');
    await expect(page.locator('a[href="mailto:neokill88@gmail.com"]').first()).toBeAttached();
  });
});
