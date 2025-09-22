# Infrastructure

클라우드 인프라 및 배포 관련 코드입니다.

## 포함 내용
- **AWS CDK**: Infrastructure as Code
- **Docker**: 컨테이너 설정
- **환경 설정**: 개발/스테이징/프로덕션 환경
- **모니터링**: 로깅 및 메트릭 설정

## 주요 리소스
- S3 (정적 웹사이트 호스팅)
- CloudFront (CDN)
- Lambda (API 서버)
- DynamoDB (데이터베이스)
- CloudWatch (모니터링)

## 배포 명령어
```bash
# 개발 환경 배포
npm run deploy:dev

# 프로덕션 환경 배포
npm run deploy:prod
```

## 환경 변수
- `NODE_ENV`: 환경 (development/staging/production)
- `AWS_REGION`: AWS 리전
- `DOMAIN_NAME`: 도메인 이름
