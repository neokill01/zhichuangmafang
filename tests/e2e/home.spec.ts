import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

const SECTIONS = [
  { id: 'positioning', label: '品牌定位' },
  { id: 'services', label: '合作范围' },
  { id: 'packages', label: 'AI 服务包' },
  { id: 'process', label: '工作流程' },
  { id: 'contact', label: '联系' },
];

test.describe('页面加载与基础结构', () => {
  test('页面正常打开，标题与 lang 正确', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/智创码坊/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  });

  test('本站资源全部加载成功，无 JS 运行时错误', async ({ page }) => {
    const home = new HomePage(page);
    const pageErrors = home.collectPageErrors();
    const resourceFailures = home.collectLocalResourceFailures();
    await home.goto();
    // 等待主要 JS 初始化完成
    await expect(home.terminalBody).not.toBeEmpty({ timeout: 15_000 });
    expect(resourceFailures, `资源加载失败: ${resourceFailures.join('; ')}`).toEqual([]);
    expect(pageErrors, `JS 错误: ${pageErrors.join('; ')}`).toEqual([]);
  });

  test('favicon 与 CSS/JS 带版本参数的资源可加载', async ({ page }) => {
    const failures: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
    });
    await page.goto('/');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon.svg');
    await expect(page.locator('script[src*="main.js"]')).toHaveAttribute('src', /v=/);
    expect(failures.filter((u) => !u.includes('baidu'))).toEqual([]);
  });
});

test.describe('Hero 区', () => {
  test('打字机效果持续输出文本', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const first = (await home.typingText.textContent()) ?? '';
    await expect(home.typingText).not.toHaveText('');
    // 打字机节奏：每字 110ms，整词完成后暂停 1600ms 再删除。
    // 固定 sleep 会落在暂停窗口里产生假失败，改为轮询「文本发生变化」（上限 10s）
    let changed = false;
    for (let i = 0; i < 40 && !changed; i++) {
      await page.waitForTimeout(250);
      changed = ((await home.typingText.textContent()) ?? '') !== first;
    }
    expect(changed, '打字机动画应持续推进（10s 内文本发生变化）').toBe(true);
  });

  test('终端模拟动画有内容输出', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.terminalBody).not.toBeEmpty({ timeout: 15_000 });
  });

  test('Hero CTA 与邮件链接存在', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page.getByRole('link', { name: '了解合作范围' })).toBeVisible();
    // Hero 与联系区各一处 mailto 入口
    const mailLinks = page.locator('a[href^="mailto:neokill88@gmail.com"]');
    await expect(mailLinks.first()).toBeVisible();
    expect(await mailLinks.count()).toBeGreaterThanOrEqual(2);
  });
});

test.describe('导航锚点跳转', () => {
  for (const { id, label } of SECTIONS) {
    test(`导航「${label}」点击后对应区块进入视口`, async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      await home.clickNavLink(label);
      // 服务包等区块高度远超视口，可见比例上限 ≈ 视口高/区块高（移动端约 0.23），
      // 阈值取 0.15 留出余量，同时仍能证明「跳转确实落到了目标区块」
      await expect(home.section(id)).toBeInViewport({ ratio: 0.15, timeout: 10_000 });
    });
  }
});

test.describe('内容区块渲染', () => {
  test('品牌定位区包含 3 张卡片', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.section('positioning').getByRole('heading', { name: 'AI 应用' })).toBeVisible();
    await expect(home.section('positioning').getByRole('heading', { name: '移动端产品' })).toBeVisible();
    await expect(home.section('positioning').getByRole('heading', { name: '研发效率工具' })).toBeVisible();
  });

  test('合作范围区包含 5 项服务', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const services = ['产品原型', '移动应用', 'Web 平台', 'AI Agent', '技术咨询'];
    for (const s of services) {
      await expect(home.section('services').getByRole('heading', { name: s })).toBeVisible();
    }
  });

  test('工作流程区包含 4 个步骤', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const steps = ['需求梳理', '原型设计', '开发实现', '上线交付'];
    for (const s of steps) {
      await expect(home.section('process').getByRole('heading', { name: s })).toBeVisible();
    }
  });

  test('「AI 应用服务包」区块包含 3 个服务包及其交付周期', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const pkgs = home.section('packages');
    await expect(pkgs.getByRole('heading', { name: 'AI 应用服务包' })).toBeVisible();
    for (const name of ['AI 客服中枢', '企业内部知识库问答', '业务流程自动化']) {
      await expect(pkgs.getByRole('heading', { name })).toBeVisible();
    }
    // 交付周期已含缓冲，三个档位分别为 5–8 / 10–15 / 15–25 个工作日
    for (const span of ['5–8 个工作日', '10–15 个工作日', '15–25 个工作日']) {
      await expect(pkgs.getByText(span, { exact: true })).toBeVisible();
    }
  });

  test('技术栈区块已移除（改为以客户可感知的能力表述为主）', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page.locator('#stack')).toHaveCount(0);
    await expect(home.navLinks.getByRole('link', { name: '技术栈' })).toHaveCount(0);
  });

  test('联系区 CTA 展示邮箱', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const contact = home.section('contact');
    await expect(contact.getByRole('heading', { name: '有想法？一起聊聊' })).toBeVisible();
    await expect(contact.getByRole('link', { name: 'neokill88@gmail.com' })).toBeVisible();
  });
});

test.describe('不可删除内容存在性', () => {
  test('百度统计脚本存在于 head', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('head script[src*="hm.baidu.com"]')).toHaveCount(1);
  });

  test('ICP 备案与公安备案链接正确', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const icp = page.locator('a.footer__icp');
    await expect(icp).toHaveText('京ICP备2026062957号');
    await expect(icp).toHaveAttribute('href', 'https://beian.miit.gov.cn/');
    const psb = page.locator('a.footer__psb');
    await expect(psb).toContainText('京公网安备11011302008385号');
    await expect(psb).toHaveAttribute('href', /beian\.mps\.gov\.cn/);
  });

  test('data-track 埋点属性完整', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    // 全量埋点守护：AGENTS.md 将 data-track 列为不可删除内容，漏一个就会静默丢数据
    for (const track of [
      'nav-contact',
      'hero-services',
      'hero-email',
      'services-to-packages',
      'package-cs',
      'package-kb',
      'package-flow',
      'packages-email',
      'contact-email',
    ]) {
      await expect(page.locator(`[data-track="${track}"]`)).toHaveCount(1);
    }
  });
});

test.describe('Footer', () => {
  test('版权年份为当前年份', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.footerYear).toHaveText(String(new Date().getFullYear()));
  });
});
