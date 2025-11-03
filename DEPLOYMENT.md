# 배포 가이드

## 배포 전 체크리스트

### 1. 환경 설정
- [ ] `.env.production` 파일 생성 및 설정
- [ ] JWT_SECRET 변경 (보안상 중요!)
- [ ] FRONTEND_URL을 실제 도메인으로 변경
- [ ] 로그인 계정 정보 확인 (aldis/aldis1201!)

### 2. 보안 설정
- [ ] 방화벽 설정 (포트 3000 또는 80/443만 열기)
- [ ] SSL 인증서 설정 (HTTPS 사용 권장)
- [ ] 로그인 계정 변경 고려

### 3. 서버 요구사항
- [ ] Node.js 18+ 설치
- [ ] 충분한 디스크 공간 (로그 및 데이터 파일용)
- [ ] 메모리 최소 512MB 이상

## 배포 방법

### 방법 1: 직접 배포
```bash
# 1. 프로젝트 업로드
scp -r ./project user@server:/opt/ip-management/

# 2. 서버에서 설정
cd /opt/ip-management
cp .env.production .env
npm install --production

# 3. PM2로 실행
npm install -g pm2
pm2 start backend/server.js --name "ip-management"
pm2 startup
pm2 save
```

### 방법 2: Docker 배포 (권장)
```bash
# 1. 프로젝트 업로드
git clone your-repo
cd your-project

# 2. 환경 설정
cp .env.production .env

# 3. Docker Compose 수정 (MongoDB 제거)
# docker-compose.yml에서 mongodb 서비스 제거

# 4. 실행
docker-compose up -d
```

### 방법 3: Nginx 리버스 프록시 (추천)
```bash
# Nginx 설정으로 80/443 포트 사용
# SSL 인증서 적용 가능
```

## 접속 방법
- HTTP: http://your-server-ip:3000
- HTTPS (Nginx 사용시): https://your-domain.com

## 모니터링
```bash
# PM2 상태 확인
pm2 status
pm2 logs ip-management

# Docker 상태 확인
docker-compose ps
docker-compose logs app
```

## 백업
- 데이터 파일: `backend/data/storage/` 폴더
- 로그 파일: `logs/` 폴더

## 문제 해결
1. 포트 충돌: `netstat -tulpn | grep :3000`
2. 권한 문제: 파일 소유권 확인
3. 메모리 부족: `free -h`로 메모리 확인