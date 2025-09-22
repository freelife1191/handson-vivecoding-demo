// Pre-commit hook 테스트용 파일
export const testPreCommitHook = () => {
  console.log('Testing pre-commit hook functionality');
  return 'pre-commit-test';
};

// 의도적으로 포맷팅 문제를 만들어서 lint fix가 작동하는지 확인
const   badlyFormatted   =   "test"   ;
