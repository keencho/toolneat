# Toolneat 운영 가이드

내가 참고할 문서. 배포, AdSense, 프로젝트 세팅 방법 등.

---

## 1. 프로젝트 세팅

### 최초 설치
```bash
cd toolneat
npm install
```

### 개발 모드
```bash
npm run dev
```
- Tailwind CSS 실시간 빌드 + 로컬 서버 실행
- http://localhost:3000 에서 확인

### 프로덕션 빌드
```bash
npm run build
```
- `assets/css/output.css` 파일 생성 (minified)

---

## 2. 배포 (Cloudflare Pages)

### Step 1: GitHub에 Push
```bash
git add .
git commit -m "메시지"
git push origin main
```

### Step 2: Cloudflare Pages 설정 (최초 1회)

1. https://dash.cloudflare.com 로그인
2. 좌측 메뉴 → **Pages** 클릭
3. **Create a project** → **Connect to Git**
4. GitHub 계정 연결 → `toolneat` 저장소 선택

### Step 3: 빌드 설정
```
Framework preset: None
Build command: npm run build
Build output directory: /
Root directory: /
```

환경변수 추가:
```
NODE_VERSION: 20
```

### Step 4: 배포
- **Save and Deploy** 클릭
- 자동으로 `https://toolneat.pages.dev` 생성

### Step 5: 커스텀 도메인 연결

1. Pages 프로젝트 → **Custom domains** 탭
2. **Set up a custom domain** 클릭
3. `toolneat.com` 입력
4. DNS 자동 설정됨 (Cloudflare DNS 사용 시)

### 이후 배포
- `main` 브랜치에 push하면 자동 배포
- PR 생성 시 Preview URL 자동 생성

---

## 3. AdSense 설정 (초보자용)

### 현재 상태
- 광고 컨테이너(ad-container) 이미 모든 페이지에 있음
- 승인 전에는 빈 div라서 안 보임
- 승인 후 코드만 넣으면 자동으로 광고 표시

### Step 1: AdSense 신청

1. https://www.google.com/adsense 접속
2. Google 계정으로 로그인
3. **시작하기** 클릭
4. 사이트 URL 입력: `https://toolneat.com`
5. 국가: 대한민국

### Step 2: 인증 코드 받기

신청하면 이런 코드를 줌:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
```

### Step 3: 인증 코드 삽입

모든 HTML 파일의 `<head>`에 추가해야 함.

### Step 4: 심사 대기
- 보통 1~14일 소요
- 이메일로 승인/거절 통보
- 거절되면 사유 확인 후 수정해서 재신청

### Step 5: 승인 후 - 광고 단위 생성

1. AdSense 대시보드 → **광고** → **광고 단위 기준**
2. **새 광고 단위 만들기** → **디스플레이 광고** 선택
3. 이름 입력: `toolneat-top` (상단용)
4. 광고 크기: **반응형** 선택
5. **만들기** 클릭 → 코드 복사

### Step 6: 광고 코드 삽입

현재 빈 ad-container에 코드 삽입:
```html
<div class="ad-container mb-6">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### Step 7: 자동 광고 설정 (선택)

| 옵션 | 추천 |
|------|------|
| 페이지 내 광고 | ⚠️ 주의 |
| 앵커 광고 | ❌ OFF |
| 전면 광고 | ❌ OFF |
| 측면 레일 | ✅ OK |

**초기에는 자동 광고 OFF 권장**

---

## 4. 수익 확인

- https://www.google.com/adsense → 홈
- 매월 21~26일 지급
- **최소 $100** 이상이어야 지급
- 한국 은행 계좌로 받기 가능

---

## 5. Google Search Console 등록

1. https://search.google.com/search-console 접속
2. **속성 추가** → `https://toolneat.com`
3. 소유권 확인 (Cloudflare DNS 자동)
4. Sitemap 제출: `sitemap.xml`

---

## 6. 체크리스트

### 배포 전
- [ ] `npm run build` 실행
- [ ] 로컬 테스트
- [ ] 반응형/다크모드 확인
- [ ] 한/영 전환 확인

### 배포 후
- [ ] HTTPS 작동 확인
- [ ] Search Console 등록
- [ ] AdSense 신청

### AdSense 승인 후
- [ ] 인증 스크립트 추가
- [ ] 광고 단위 생성
- [ ] ad-container에 코드 삽입

---

## 7. 문제 해결

### 빌드 실패
- NODE_VERSION 환경변수 확인 (20)

### CSS 적용 안됨
- `npm run build` 후 커밋 확인

### 404 에러
- 파일 경로 대소문자 확인

### 광고 안 나옴
- 광고 차단 확장 프로그램 비활성화
- 승인 후 24시간 대기

---

## 8. 외부 도메인을 Cloudflare Pages에 연결하기

다른 곳(가비아, 호스팅케이알, GoDaddy 등)에서 구매한 도메인을 연결하는 방법.

### 방법 1: Cloudflare DNS 사용 (권장)

네임서버를 Cloudflare로 변경. Cloudflare의 모든 기능(CDN, 보안, 캐싱) 사용 가능.

#### Step 1: Cloudflare에 도메인 추가
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 로그인
2. **Add a site** 클릭
3. 도메인 입력 (예: `toolneat.com`)
4. **Free** 플랜 선택
5. DNS 레코드 스캔 완료 대기

#### Step 2: 네임서버 변경
1. Cloudflare가 제공하는 네임서버 2개 확인
   - 예: `alice.ns.cloudflare.com`, `bob.ns.cloudflare.com`
2. **도메인 구매처 로그인** (가비아, 호스팅케이알 등)
3. 도메인 관리 → 네임서버 설정
4. 기존 네임서버 삭제 후 **Cloudflare 네임서버 입력**
5. 변경 저장 (적용까지 최대 24시간, 보통 1시간 내)

#### Step 3: Cloudflare Pages에 도메인 연결
1. Cloudflare Dashboard → **Pages**
2. 프로젝트 선택 (toolneat)
3. **Custom domains** 탭
4. **Set up a custom domain** 클릭
5. 도메인 입력: `toolneat.com`
6. **Activate domain** 클릭
7. `www.toolneat.com`도 같은 방식으로 추가

#### Step 4: DNS 레코드 확인
자동으로 추가되지만, 확인 필요:
```
Type: CNAME
Name: @
Target: <project-name>.pages.dev

Type: CNAME
Name: www
Target: <project-name>.pages.dev
```

---

### 방법 2: 외부 DNS 유지 (CNAME 방식)

네임서버 변경 없이 기존 DNS에서 CNAME만 추가.

#### Step 1: Cloudflare Pages에서 도메인 추가
1. Cloudflare Dashboard → **Pages** → 프로젝트 선택
2. **Custom domains** → **Set up a custom domain**
3. 도메인 입력 후 진행
4. "DNS not configured" 경고 무시하고 계속

#### Step 2: 도메인 구매처에서 DNS 설정
도메인 구매처의 DNS 관리에서 다음 레코드 추가:

```
# 루트 도메인 (CNAME flattening 지원 시)
Type: CNAME
Name: @ (또는 빈칸)
Value: <project-name>.pages.dev

# www 서브도메인
Type: CNAME
Name: www
Value: <project-name>.pages.dev
```

**주의**: 일부 DNS는 루트 도메인(@)에 CNAME을 지원하지 않음.
→ 이 경우 **방법 1(네임서버 변경)** 권장.

---

### 한국 도메인 업체별 네임서버 변경

#### 가비아 (Gabia)
1. 가비아 로그인 → My가비아
2. 도메인 → 관리
3. 해당 도메인 선택 → 네임서버 → 설정
4. "외부 네임서버 사용" 선택
5. Cloudflare 네임서버 입력

#### 호스팅케이알 (Hosting.kr)
1. 호스팅케이알 로그인
2. 나의서비스 → 도메인 관리
3. 도메인 선택 → 네임서버 변경
4. Cloudflare 네임서버 입력

#### 카페24
1. 카페24 로그인 → 나의서비스
2. 도메인 관리 → 도메인 정보 변경
3. 네임서버 정보 → 직접 입력
4. Cloudflare 네임서버 입력

---

### SSL 인증서

- **Cloudflare DNS 사용 시**: 자동으로 SSL 발급 (몇 분 소요)
- **외부 DNS 사용 시**: 도메인 연결 후 자동 발급 (최대 24시간)

---

### 권장 Cloudflare 설정

도메인 연결 후 Dashboard에서:

1. **SSL/TLS**
   - 암호화 모드: `Full (strict)`
   - Always Use HTTPS: `On`

2. **Rules → Redirect Rules** (www → apex 리다이렉트)
   - If: `hostname equals www.toolneat.com`
   - Then: Dynamic redirect to `https://toolneat.com${http.request.uri.path}`
   - Status: 301

---

### 문제 해결

| 문제 | 해결 |
|------|------|
| "DNS not configured" | 네임서버 변경 후 최대 24시간 대기 |
| SSL 인증서 발급 안됨 | DNS 전파 대기 |
| www가 작동 안함 | www CNAME 레코드 추가 확인 |
| 리다이렉트 루프 | SSL 설정을 "Full" 또는 "Full (strict)"로 |
