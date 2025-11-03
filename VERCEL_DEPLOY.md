# Vercel 배포 가이드

## 🚀 Vercel에 배포하기

### 1단계: GitHub에 코드 업로드
```bash
git add .
git commit -m "Vercel deployment setup"
git push origin main
```

### 2단계: Vercel 배포
1. [Vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택
5. "Deploy" 클릭

### 3단계: 환경 변수 설정 (Vercel 대시보드에서)
```
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_production_2024
FRONTEND_URL=https://your-app-name.vercel.app
```

## ⚠️ 중요 사항

### 데이터 지속성
- Vercel은 서버리스 환경이므로 **데이터가 영구 저장되지 않습니다**
- 서버 재시작시 모든 데이터가 초기화됩니다
- 실제 운영환경에서는 외부 데이터베이스 사용을 권장합니다

### 권장 데이터베이스 옵션
1. **MongoDB Atlas** (무료 티어 제공)
2. **PlanetScale** (MySQL 호환)
3. **Supabase** (PostgreSQL 기반)
4. **Firebase Firestore**

## 🔧 배포 후 확인사항

### 접속 테스트
- 메인 페이지: `https://your-app-name.vercel.app`
- API 헬스체크: `https://your-app-name.vercel.app/api/health`
- 로그인: `aldis / aldis1201!`

### 기능 테스트
- [ ] 로그인/로그아웃
- [ ] 국가 목록 로드
- [ ] 서버 추가/삭제
- [ ] 즐겨찾기 기능

## 🛠️ 문제 해결

### 배포 실패시
1. Vercel 대시보드에서 빌드 로그 확인
2. `vercel.json` 설정 확인
3. 환경 변수 설정 확인

### API 호출 실패시
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. CORS 설정 확인
3. API 경로 확인 (`/api/...`)

## 📝 추가 개선사항

### 실제 운영시 권장사항
1. **데이터베이스 연결**: MongoDB Atlas 등 사용
2. **인증 강화**: 더 복잡한 비밀번호, 2FA 등
3. **로깅**: 외부 로깅 서비스 연동
4. **모니터링**: Vercel Analytics 활용
5. **도메인**: 커스텀 도메인 연결

### 성능 최적화
1. **이미지 최적화**: Vercel Image Optimization 사용
2. **캐싱**: API 응답 캐싱 설정
3. **번들 최적화**: 불필요한 라이브러리 제거