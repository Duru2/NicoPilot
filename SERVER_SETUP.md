# 서버에서 실행하는 방법

## ⚠️ 현재 문제
- 현재 Node 버전: **16.20.2**
- 필요한 버전: **Node 20.9.0 이상**

---

## 🚀 방법 1: NVM으로 Node 업그레이드 (추천)

### 1-1. NVM 설치
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 또는 wget 사용
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 1-2. 터미널 재시작 또는 소스 로드
```bash
source ~/.bashrc
# 또는
source ~/.zshrc
```

### 1-3. Node 20 설치
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

### 1-4. 확인
```bash
node --version  # v20.x.x 출력되어야 함
```

### 1-5. 프로젝트 실행
```bash
cd /home/nick/career-analyzer
npm run dev
```

---

## 🐳 방법 2: Docker 사용 (Node 버전 걱정 없음)

### 2-1. Dockerfile 생성 (이미 생성됨)
프로젝트 루트에 `Dockerfile`이 있습니다.

### 2-2. Docker 실행
```bash
cd /home/nick/career-analyzer

# 이미지 빌드
docker build -t career-analyzer .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env.local career-analyzer
```

### 2-3. 접속
브라우저에서 `http://localhost:3000` 접속

---

## ☁️ 방법 3: Vercel에 배포 (가장 쉬움, 무료)

Node 버전 걱정 없이 바로 배포 가능!

### 3-1. GitHub에 푸시
```bash
cd /home/nick/career-analyzer

git init
git add .
git commit -m "Initial commit"

# GitHub에 레포지토리 생성 후
git remote add origin https://github.com/your-username/career-analyzer.git
git push -u origin main
```

### 3-2. Vercel 배포
1. [vercel.com](https://vercel.com) 접속
2. "Import Project" 클릭
3. GitHub 레포지토리 선택
4. 환경 변수 추가 (`.env.local` 내용)
5. Deploy 클릭

### 3-3. 완료!
몇 분 후 `https://your-app.vercel.app` 에서 접속 가능

---

## 🔧 방법 4: 시스템 Node 업그레이드 (권장하지 않음)

### Ubuntu/Debian
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 확인
node --version
```

### CentOS/RHEL
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

---

## 📝 환경 변수 설정 (필수)

실행 전에 `.env.local` 파일을 반드시 설정하세요:

```bash
cd /home/nick/career-analyzer
nano .env.local
```

다음 내용 입력:
```env
# Supabase (https://supabase.com 에서 프로젝트 생성 후)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenAI (https://platform.openai.com 에서 API 키 생성)
OPENAI_API_KEY=sk-proj-...

# Stripe (https://stripe.com 에서 API 키 생성)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 추천 순서

### 로컬 개발용
1. **NVM 설치** (방법 1) ← 가장 안전
2. Node 20 설치
3. `npm run dev` 실행

### 프로덕션 배포용
1. **Vercel 배포** (방법 3) ← 가장 쉬움
2. 환경 변수 설정
3. 바로 사용 가능!

---

## 🐛 트러블슈팅

### "Cannot find module" 에러
```bash
rm -rf node_modules package-lock.json
npm install
```

### 포트 3000이 이미 사용 중
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

### Supabase 연결 실패
- `.env.local` 파일 확인
- Supabase URL과 키가 정확한지 확인
- `supabase/schema.sql` 실행했는지 확인

---

## 💡 빠른 시작 (NVM 방식)

```bash
# 1. NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 2. Node 20 설치
nvm install 20
nvm use 20

# 3. 프로젝트로 이동
cd /home/nick/career-analyzer

# 4. 환경 변수 설정 (위 내용 참고)
nano .env.local

# 5. 실행!
npm run dev
```

브라우저에서 http://localhost:3000 접속!
