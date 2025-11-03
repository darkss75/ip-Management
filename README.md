# IP Management System

Proton VPN 스타일의 IP 관리 시스템입니다. 국가별 차단된 IP를 관리하고 모니터링할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **대시보드**: 전체 차단 IP 수, 위험도별 통계, 최근 차단된 IP 목록
- **국가별 관리**: 국가별 차단된 IP 목록 조회 및 관리
- **IP 차단 등록**: 새로운 IP 차단 등록 및 관리
- **인증 시스템**: JWT 기반 관리자 인증
- **실시간 통계**: 차단된 IP 통계 및 모니터링

## 기술 스택

### 프론트엔드
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome 아이콘
- 반응형 디자인

### 백엔드
- Node.js + Express.js
- MongoDB + Mongoose
- JWT 인증
- bcryptjs 암호화

### 인프라
- Docker & Docker Compose
- Nginx 리버스 프록시
- MongoDB 데이터베이스

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ip-management-system
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 설정을 변경하세요
```

### 3. Docker로 실행
```bash
# 전체 시스템 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 4. 개발 환경 실행
```bash
# 의존성 설치
npm install

# MongoDB 실행 (별도 설치 필요)
mongod

# 개발 서버 실행
npm run dev
```

## 접속 정보

- **웹 애플리케이션**: http://localhost:3000
- **기본 관리자 계정**:
  - 사용자명: `admin`
  - 비밀번호: `password`

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `GET /api/auth/validate` - 토큰 검증

### 국가 관리
- `GET /api/countries` - 국가 목록 조회
- `GET /api/countries/:code` - 특정 국가 조회
- `POST /api/countries/initialize` - 기본 국가 데이터 초기화

### IP 관리
- `GET /api/ips/stats` - 대시보드 통계
- `GET /api/ips/country/:countryCode` - 국가별 차단된 IP 목록
- `POST /api/ips` - 새 IP 차단 등록
- `PUT /api/ips/:id` - IP 차단 정보 수정
- `DELETE /api/ips/:id` - IP 차단 해제

## 데이터베이스 스키마

### Countries 컬렉션
```javascript
{
  name: String,        // 국가명
  code: String,        // 국가 코드 (2자리)
  flag: String,        // 국기 이모지
  serverCount: Number, // 서버 수
  blockedIPCount: Number, // 차단된 IP 수
  isActive: Boolean    // 활성 상태
}
```

### BlockedIPs 컬렉션
```javascript
{
  ipAddress: String,    // IP 주소
  countryCode: String,  // 국가 코드
  reason: String,       // 차단 사유
  severity: String,     // 위험도 (low, medium, high, critical)
  blockedBy: String,    // 차단한 관리자
  isActive: Boolean,    // 활성 상태
  expiresAt: Date,      // 만료일 (선택사항)
  lastDetected: Date    // 마지막 탐지일
}
```

## 보안 기능

- JWT 토큰 기반 인증
- bcryptjs를 이용한 비밀번호 암호화
- Helmet.js 보안 헤더
- Rate limiting (Express rate limit)
- CORS 설정
- Input validation

## 모니터링 및 로깅

- Health check 엔드포인트 (`/api/health`)
- Docker health check
- Nginx 액세스 로그
- 애플리케이션 에러 로깅

## 개발 가이드

### 새로운 기능 추가
1. 백엔드 라우트 추가 (`backend/routes/`)
2. 데이터베이스 모델 수정 (`backend/models/`)
3. 프론트엔드 UI 업데이트 (`frontend/`)
4. API 문서 업데이트

### 코드 스타일
- ES6+ 문법 사용
- async/await 패턴
- 모듈화된 구조
- 에러 핸들링

## 배포

### 프로덕션 배포
```bash
# 프로덕션 빌드
docker-compose -f docker-compose.yml up -d

# SSL 인증서 설정 (선택사항)
# ssl/ 디렉토리에 인증서 파일 배치
```

### 환경별 설정
- 개발: `NODE_ENV=development`
- 프로덕션: `NODE_ENV=production`

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request