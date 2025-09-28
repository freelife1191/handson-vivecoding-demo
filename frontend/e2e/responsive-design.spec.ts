import { test, expect } from '@playwright/test';

test.describe('반응형 디자인 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('데스크톱 화면 (1024x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    // Tab Bar가 보이지 않는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).not.toBeVisible();

    // 메인 콘텐츠가 기본 패딩을 가지는지 확인
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveCSS('padding-bottom', '16px');
  });

  test('태블릿 화면 (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Tab Bar가 보이지 않는지 확인 (768px 이상에서는 숨김)
    await expect(page.locator('[data-testid="tab-bar"]')).not.toBeVisible();

    // 메인 콘텐츠가 기본 패딩을 가지는지 확인
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveCSS('padding-bottom', '16px');
  });

  test('모바일 화면 (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Tab Bar가 보이는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();

    // 메인 콘텐츠가 Tab Bar 공간을 위한 패딩을 가지는지 확인
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveCSS('padding-bottom', '80px');

    // Tab Bar 버튼들이 올바르게 표시되는지 확인
    await expect(page.locator('button[aria-label="홈"]')).toBeVisible();
    await expect(page.locator('button[aria-label="프로필"]')).toBeVisible();
    await expect(page.locator('button[aria-label="설정"]')).toBeVisible();
  });

  test('작은 모바일 화면 (320x568)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    // Tab Bar가 보이는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();

    // Tab Bar가 하단에 고정되어 있는지 확인
    const tabBar = page.locator('[data-testid="tab-bar"]');
    await expect(tabBar).toHaveCSS('position', 'fixed');
    await expect(tabBar).toHaveCSS('bottom', '0px');
  });

  test('Tab Bar 스크롤 시 고정', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 여러 Todo 추가하여 스크롤 가능하게 만들기
    for (let i = 1; i <= 10; i++) {
      await page.fill(
        '[placeholder="새 할일 추가"]',
        `스크롤 테스트 할일 ${i}`
      );
      await page.click('button:has-text("추가")');
    }

    // 페이지 하단으로 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Tab Bar가 여전히 보이는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();

    // Tab Bar가 화면 하단에 고정되어 있는지 확인
    const tabBar = page.locator('[data-testid="tab-bar"]');
    const boundingBox = await tabBar.boundingBox();
    expect(boundingBox?.y).toBeGreaterThan(500); // 화면 하단 근처에 위치
  });

  test('화면 크기 변경 시 Tab Bar 동작', async ({ page }) => {
    // 모바일 크기에서 시작
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();

    // 데스크톱 크기로 변경
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('[data-testid="tab-bar"]')).not.toBeVisible();
  });

  test('모바일에서 Todo 추가 및 관리', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '모바일 테스트 할일');
    await page.click('button:has-text("추가")');

    // Todo가 추가되었는지 확인
    await expect(page.locator('text=모바일 테스트 할일')).toBeVisible();

    // Tab Bar가 여전히 보이는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();

    // Todo 완료 처리
    await page.click('input[type="checkbox"]');

    // 통계 업데이트 확인
    await expect(page.locator('text=완료: 1')).toBeVisible();
  });

  test('모바일에서 필터링 기능', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '모바일 필터 테스트');
    await page.click('button:has-text("추가")');

    // Todo가 표시되는지 확인
    await expect(page.locator('text=모바일 필터 테스트')).toBeVisible();

    // Tab Bar가 여전히 보이는지 확인
    await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible();
  });
});
