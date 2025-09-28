import { test, expect } from '@playwright/test';

test.describe('필터링 및 정렬 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // 테스트용 Todo들 추가
    const todos = [
      { title: '높은 우선순위 할일', priority: 'high' },
      { title: '낮은 우선순위 할일', priority: 'low' },
      { title: '중간 우선순위 할일', priority: 'medium' },
      { title: '완료된 할일', priority: 'medium' },
    ];

    for (const todo of todos) {
      await page.fill('[placeholder="새 할일 추가"]', todo.title);
      await page.click('button:has-text("추가")');

      // 우선순위 설정 (완료된 할일 제외)
      if (todo.title !== '완료된 할일') {
        await page.click(`text=${todo.title}`).then(async () => {
          await page.click('button[aria-label="우선순위 변경"]');
          await page.click(
            `text=${todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '중간' : '낮음'}`
          );
        });
      }
    }

    // 마지막 할일을 완료 처리
    await page.click('input[type="checkbox"]:nth-last-child(1)');
  });

  test('우선순위별 필터링', async ({ page }) => {
    // 높은 우선순위 필터
    await page.click('text=우선순위');
    await page.click('text=높음');

    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).not.toBeVisible();

    // 중간 우선순위 필터
    await page.click('text=우선순위');
    await page.click('text=중간');

    await expect(page.locator('text=중간 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=높은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).not.toBeVisible();

    // 낮은 우선순위 필터
    await page.click('text=우선순위');
    await page.click('text=낮음');

    await expect(page.locator('text=낮은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=높은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).not.toBeVisible();
  });

  test('완료 상태별 필터링', async ({ page }) => {
    // 미완료 필터
    await page.click('text=상태');
    await page.click('text=미완료');

    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=완료된 할일')).not.toBeVisible();

    // 완료 필터
    await page.click('text=상태');
    await page.click('text=완료');

    await expect(page.locator('text=완료된 할일')).toBeVisible();
    await expect(page.locator('text=높은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).not.toBeVisible();

    // 전체 필터
    await page.click('text=상태');
    await page.click('text=전체');

    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=완료된 할일')).toBeVisible();
  });

  test('정렬 기능', async ({ page }) => {
    // 우선순위별 정렬
    await page.click('text=정렬');
    await page.click('text=우선순위');

    // 높은 우선순위가 먼저 나오는지 확인
    const todoItems = page.locator('[data-testid="todo-item"]');
    await expect(todoItems.first()).toContainText('높은 우선순위 할일');

    // 제목별 정렬
    await page.click('text=정렬');
    await page.click('text=제목');

    // 알파벳 순으로 정렬되는지 확인
    await expect(todoItems.first()).toContainText('낮은 우선순위 할일');

    // 생성일별 정렬
    await page.click('text=정렬');
    await page.click('text=생성일');

    // 최신 생성일이 먼저 나오는지 확인
    await expect(todoItems.first()).toContainText('완료된 할일');
  });

  test('검색 기능', async ({ page }) => {
    // 검색어 입력
    await page.fill('[placeholder="검색"]', '높은');

    // 검색 결과 확인
    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).not.toBeVisible();
    await expect(page.locator('text=완료된 할일')).not.toBeVisible();

    // 검색어 변경
    await page.fill('[placeholder="검색"]', '우선순위');

    // 여러 결과 확인
    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).toBeVisible();

    // 검색 초기화
    await page.fill('[placeholder="검색"]', '');

    // 모든 Todo가 다시 표시되는지 확인
    await expect(page.locator('text=높은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=낮은 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=중간 우선순위 할일')).toBeVisible();
    await expect(page.locator('text=완료된 할일')).toBeVisible();
  });
});
