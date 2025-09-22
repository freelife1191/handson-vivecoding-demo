// Pre-commit hook 디버깅 로그 테스트용 파일
export const debugTestFunction = () => {
  console.log('Testing pre-commit hook debugging logs');
  return 'debug-test';
};

// 의도적으로 포맷팅 문제를 만들어서 lint fix가 작동하는지 확인
const badlyFormatted = 'test formatting';
const unusedVariable = 'this will cause lint error';

// 타입 에러를 수정
const numberValue: number = 123;

// 사용하지 않는 변수들을 사용하도록 수정
console.log(badlyFormatted, unusedVariable, numberValue);
