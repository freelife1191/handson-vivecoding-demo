// Pre-commit hook 최종 테스트용 파일
export const testPreCommitHookFinal = () => {
  console.log('Final test for pre-commit hook functionality');
  return 'pre-commit-final-test';
};

// 의도적으로 포맷팅 문제를 만들어서 lint fix가 작동하는지 확인
const badlyFormattedVariable = 'test formatting';
console.log(badlyFormattedVariable);
