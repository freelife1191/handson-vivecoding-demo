import { test, expect } from '@playwright/test';

test.describe('Todo CRUD 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // localStorage 초기화
    await page.evaluate(() => localStorage.clear());
  });

  test('새 Todo 추가', async ({ page }) => {
    // 새 Todo 입력
    await page.fill('[placeholder="새 할일 추가"]', 'Playwright 테스트 할일');
    await page.click('button:has-text("추가")');

    // Todo가 추가되었는지 확인
    await expect(page.locator('text=Playwright 테스트 할일')).toBeVisible();

    // 통계 업데이트 확인
    await expect(page.locator('text=전체: 1')).toBeVisible();
    await expect(page.locator('text=미완료: 1')).toBeVisible();
  });

  test('Todo 완료 토글', async ({ page }) => {
    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '완료 테스트 할일');
    await page.click('button:has-text("추가")');

    // 체크박스 클릭하여 완료 처리
    await page.click('input[type="checkbox"]');

    // 완료 상태 확인
    await expect(page.locator('text=완료: 1')).toBeVisible();
    await expect(page.locator('text=미완료: 0')).toBeVisible();
  });

  test('Todo 메뉴 접근', async ({ page }) => {
    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '메뉴 테스트 할일');
    await page.click('button:has-text("추가")');

    // 더보기 메뉴 클릭
    await page.click('button[aria-label="더보기 메뉴"]');

    // 메뉴가 열렸는지 확인
    await expect(page.locator('text=편집')).toBeVisible();
    await expect(page.locator('text=삭제')).toBeVisible();
  });

  test('Todo 삭제 메뉴 접근', async ({ page }) => {
    // Todo 추가
    await page.fill('[placeholder="새 할일 추가"]', '삭제 메뉴 테스트 할일');
    await page.click('button:has-text("추가")');

    // 더보기 메뉴 클릭
    await page.click('button[aria-label="더보기 메뉴"]');

    // 삭제 메뉴가 표시되는지 확인 (메뉴 항목만 선택)
    await expect(
      page.locator('[role="menuitem"]:has-text("삭제")')
    ).toBeVisible();
  });

  test('여러 Todo 관리', async ({ page }) => {
    // 여러 Todo 추가
    const todos = ['첫 번째 할일', '두 번째 할일', '세 번째 할일'];

    for (const todo of todos) {
      await page.fill('[placeholder="새 할일 추가"]', todo);
      await page.click('button:has-text("추가")');
    }

    // 모든 Todo가 표시되는지 확인
    for (const todo of todos) {
      await expect(page.locator(`text=${todo}`)).toBeVisible();
    }

    // 통계 확인
    await expect(page.locator('text=전체: 3')).toBeVisible();
    await expect(page.locator('text=미완료: 3')).toBeVisible();

    // 일부 Todo 완료 처리
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();

    // 통계 업데이트 확인
    await expect(page.locator('text=완료: 2')).toBeVisible();
    await expect(page.locator('text=미완료: 1')).toBeVisible();
  });
});
