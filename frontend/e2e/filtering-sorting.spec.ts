import { test, expect } from '@playwright/test';

test.describe('필터링 및 정렬 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('기본 Todo 표시', async ({ page }) => {
    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '테스트 할일');
    await page.click('button:has-text("추가")');

    // Todo가 표시되는지 확인
    await expect(page.locator('text=테스트 할일')).toBeVisible();
  });

  test('완료 상태 토글', async ({ page }) => {
    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '완료 테스트 할일');
    await page.click('button:has-text("추가")');

    // Todo 완료 처리
    await page.click('input[type="checkbox"]');

    // 통계 업데이트 확인
    await expect(page.locator('text=완료: 1')).toBeVisible();
    await expect(page.locator('text=미완료: 0')).toBeVisible();
  });

  test('Todo 순서 확인', async ({ page }) => {
    // 여러 Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '첫 번째 할일');
    await page.click('button:has-text("추가")');
    await page.fill('[placeholder="새 할일 추가"]', '두 번째 할일');
    await page.click('button:has-text("추가")');

    // Todo들이 추가된 순서대로 표시되는지 확인
    const todoItems = page.locator('p:has-text("할일")');
    await expect(todoItems.nth(0)).toContainText('첫 번째 할일');
    await expect(todoItems.nth(1)).toContainText('두 번째 할일');
  });

  test('Todo 추가 및 메뉴 접근', async ({ page }) => {
    // 새 Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '메뉴 테스트 할일');
    await page.click('button:has-text("추가")');

    // 추가된 Todo 확인
    await expect(page.locator('text=메뉴 테스트 할일')).toBeVisible();

    // 더보기 메뉴 클릭
    await page.click('button[aria-label="더보기 메뉴"]');

    // 메뉴가 열렸는지 확인
    await expect(page.locator('text=편집')).toBeVisible();
    await expect(page.locator('text=삭제')).toBeVisible();
  });
});
