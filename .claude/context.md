# Toolneat 도구 추가 가이드

## 도구 페이지 구조 (필수 요소)

### 1. HTML `<head>` 필수 항목

```html
<head>
  <!-- Google Ads -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8846557285079359" crossorigin="anonymous"></script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Title: 도구명 - Toolneat -->
  <title data-i18n-title="tools.{key}.title">도구명 - Toolneat</title>

  <!-- Description: 150자 이상 상세 설명 (SEO 핵심!) -->
  <meta name="description" data-i18n-desc="tools.{key}.description" content="상세 설명...">

  <!-- Canonical & hreflang (다국어 필수) -->
  <link rel="canonical" href="https://toolneat.com/tools/{category}/{tool}/">
  <link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool}/">
  <link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool}/">
  <link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool}/">

  <!-- Open Graph (소셜 공유용) -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="도구명 - Toolneat">
  <meta property="og:description" content="짧은 설명">
  <meta property="og:url" content="https://toolneat.com/tools/{category}/{tool}/">
  <meta property="og:image" content="https://toolneat.com/assets/images/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#2563eb">

  <!-- Favicon & CSS -->
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="stylesheet" href="../../../assets/css/output.css">

  <!-- JS (공통) -->
  <script src="../../../assets/js/common.js"></script>
  <script src="../../../assets/js/i18n.js"></script>
  <script src="../../../assets/js/components.js"></script>

  <!-- JSON-LD 구조화 데이터 (SEO 필수!) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tool Name",
    "description": "상세 설명...",
    "url": "https://toolneat.com/tools/{category}/{tool}",
    "applicationCategory": "DeveloperApplication",  // 또는 UtilitiesApplication
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "author": {
      "@type": "Organization",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    }
  }
  </script>

  <!-- 검색 기능 -->
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
  <script src="../../../assets/js/tools-data.js"></script>
  <script src="../../../assets/js/search.js" defer></script>
</head>
```

### 2. 페이지 레이아웃 구조

```html
<body class="min-h-screen flex flex-col">
  <!-- Header (include) -->
  <div id="header">...</div>

  <!-- Main Content -->
  <main class="flex-1 py-8 md:py-12">
    <div class="container-main">
      <!-- 1. 페이지 제목 + 설명 -->
      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-bold ..." data-i18n="tools.{key}.title">도구명</h1>
        <p class="text-gray-600 ..." data-i18n="tools.{key}.descriptionLong">상세 설명</p>
      </div>

      <!-- 2. 상단 광고 -->
      <div class="ad-container mb-6"></div>

      <!-- 3. 도구 카드 (핵심 기능) -->
      <div class="card">
        <!-- 옵션 바 -->
        <!-- 입출력 영역 -->
      </div>

      <!-- 4. FAQ/설명 섹션 (SEO 필수!) -->
      <section class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ...">
        <h2 class="text-xl font-bold ...">도구명이란?</h2>
        <div class="prose ...">
          <p>도구 설명...</p>

          <h3>사용 방법</h3>
          <ol>...</ol>

          <h3>자주 묻는 질문</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium">Q: 질문?</h4>
              <p>답변...</p>
            </div>
            <!-- 3-5개 FAQ 필수 -->
          </div>
        </div>
      </section>

      <!-- 5. 하단 광고 -->
      <div class="ad-container mt-6"></div>
    </div>
  </main>

  <!-- Footer (include) -->
  <div id="footer">...</div>

  <!-- 도구 스크립트 -->
  <script>...</script>
</body>
```

### 3. applicationCategory 값 (JSON-LD)

| 카테고리 | applicationCategory |
|---------|---------------------|
| Dev (개발) | DeveloperApplication |
| Life (생활) | UtilitiesApplication |
| PDF | UtilitiesApplication |

---

## SEO 체크리스트

| 항목 | 필수 | 설명 |
|-----|:----:|------|
| `<title>` | ✅ | "도구명 - Toolneat" 형식 |
| `<meta description>` | ✅ | 150자 이상, 키워드 포함 |
| `canonical` | ✅ | 정규 URL |
| `hreflang` | ✅ | ko, en, x-default 3개 |
| Open Graph | ✅ | og:title, og:description, og:url, og:image |
| JSON-LD | ✅ | WebApplication 스키마 |
| FAQ 섹션 | ✅ | 3-5개 Q&A (SEO + 사용자 도움) |
| H1 태그 | ✅ | 페이지당 1개만 |
| H2, H3 | ✅ | 계층 구조 유지 |

---

## FAQ 섹션 작성 가이드

**필수 포함 내용:**
1. 도구가 무엇인지 설명
2. 사용 방법 단계별 안내
3. 자주 묻는 질문 3-5개

**FAQ 예시:**
- "이 도구는 무료인가요?" → 네, 완전 무료입니다.
- "데이터가 서버로 전송되나요?" → 아니요, 모든 처리는 브라우저에서 이루어집니다.
- "어떤 파일 형식을 지원하나요?" → PNG, JPG, WebP 등을 지원합니다.
- "모바일에서도 사용할 수 있나요?" → 네, 반응형으로 모바일 지원됩니다.

---

## 새 도구 추가 시 수정해야 할 파일들 (체크리스트)

### 필수 수정 파일
1. **도구 파일 생성**
   - [ ] `/tools/{category}/{tool-name}/index.html` (한글)
   - [ ] `/en/tools/{category}/{tool-name}/index.html` (영어)

2. **sitemap.xml 업데이트**
   - [ ] `/sitemap.xml` - 한글/영어 URL 둘 다 추가

3. **전체 도구 목록 페이지**
   - [ ] `/tools/index.html` - tool-card 추가 + 도구 수 업데이트
   - [ ] `/en/tools/index.html` - tool-card 추가 + 도구 수 업데이트

4. **카테고리 인덱스 페이지**
   - [ ] `/tools/{category}/index.html`
   - [ ] `/en/tools/{category}/index.html`

5. **헤더 네비게이션 (공통 컴포넌트)**
   - [ ] `/components/header.html` - Desktop mega-menu + Mobile accordion 둘 다!

6. **홈페이지 (새로운 도구 섹션에 추가 시)**
   - [ ] `/index.html`
   - [ ] `/en/index.html`

---

## 헤더 수정 방법 (`/components/header.html`)

### Desktop Mega Menu 구조 (line ~23-63)
```html
<div class="nav-mega-menu">
  <div class="mega-column">
    <h4 class="mega-title" data-i18n="nav.encoding">Encoding</h4>
    <a href="/tools/dev/{tool}" class="mega-link nav-link" data-i18n="tools.{key}.title">Tool Name</a>
    <!-- 여기에 추가 -->
  </div>
</div>
```

### Mobile Accordion 구조 (line ~239-306)
```html
<div class="mobile-sub-content hidden pl-4 space-y-1">
  <a href="/tools/dev/{tool}" class="nav-link block py-1.5 text-sm text-gray-600 dark:text-gray-400" data-i18n="tools.{key}.title">Tool Name</a>
  <!-- 여기에도 똑같이 추가 -->
</div>
```

**주의: Desktop과 Mobile 메뉴 둘 다 수정해야 함!**

---

## tool-card 형식 (/tools/index.html, /en/tools/index.html)

```html
<a href="/tools/dev/{tool-name}" class="tool-card">
  <div class="tool-icon bg-gradient-to-br from-{color}-500 to-{color}-600">
    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..."/>
    </svg>
  </div>
  <div class="tool-info">
    <div class="tool-name" data-i18n="tools.{key}.title">도구 이름</div>
    <div class="tool-desc">도구 설명</div>
  </div>
</a>
```

영어 버전은 `/en/tools/dev/{tool-name}` 경로 사용

---

## 카테고리별 색상
- **Dev**: blue(인코딩), purple(생성기), green(변환기), orange(테스터)
- **Life**: green, pink, indigo, yellow, cyan
- **PDF**: red

---

## 도구 수 업데이트 위치

**현재**: Dev 27, Life 43, PDF 8, 총 78

### 1. 홈페이지 카테고리 카드
```
/index.html (라인 ~561, ~594)
  - "27 <span>도구</span>"  ← Dev 수
  - "78 <span>도구</span>"  ← 전체 수

/en/index.html (라인 ~562, ~595)
  - "27 <span>tools</span>"  ← Dev 수
  - "78 <span>tools</span>"  ← 전체 수
```

### 2. /tools/index.html 탭 라벨
```
/tools/index.html (라인 ~516)
  - "개발 도구 (27)"

/en/tools/index.html (라인 ~516)
  - "Dev Tools (27)"
```

### 3. docs/plan.md
```
라인 9: 현재 도구 수: 78개 (Dev: 27, Life: 43, PDF: 8)
라인 11: 페이지 수: 156개 (78 도구 × 2 언어)
라인 93: 개발 도구 (27개)
라인 294: Dev Tools | 27 | ~50
라인 297: 총합 | 78 | ~135
```

### 4. /tools/index.html 히어로 섹션
```
/tools/index.html (라인 7, 496)
  - meta description: "78개 이상의 무료 온라인 도구"
  - 본문: "78개 이상의 무료 온라인 도구를 사용해보세요"

/en/tools/index.html (라인 7, 496)
  - meta description: "78+ developer tools"
  - 본문: "Browse 78+ free online tools"
```

### 업데이트 체크리스트
새 도구 추가 시:
- [ ] /index.html - 카테고리별 숫자 (Dev/Life/PDF/전체)
- [ ] /en/index.html - 카테고리별 숫자
- [ ] /tools/index.html - 탭 라벨 + 히어로 텍스트
- [ ] /en/tools/index.html - 탭 라벨 + 히어로 텍스트
- [ ] docs/plan.md - 5곳

---

## 주의사항

1. **⚠️ 스크립트 로딩 순서 (중요!)**
   - Fuse.js가 전역 `var t`를 선언하여 i18n의 `window.t`를 덮어쓸 수 있음
   - **반드시 Fuse.js를 i18n.js보다 먼저 로드해야 함!**
   ```html
   <!-- 올바른 순서 -->
   <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
   <script src="/assets/js/common.js"></script>
   <script src="/assets/js/i18n.js"></script>
   <script src="/assets/js/components.js"></script>
   ```

2. **경로 주의**
   - color-palette, gradient-generator는 `/dev/`에 있음 (`/life/` 아님!)

3. **양쪽 버전 동기화**
   - 한글/영어 둘 다 추가 필수
   - 도구 수 맞춰야 함

4. **CSS**
   - `@apply`는 인라인 `<style>`에서 안됨
   - Tailwind 클래스 직접 사용

5. **헤더 수정 시**
   - Desktop mega-menu와 Mobile accordion 둘 다 수정!

---

## sitemap.xml URL 형식

```xml
<url>
  <loc>https://toolneat.com/tools/{category}/{tool-name}</loc>
  <xhtml:link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool-name}"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool-name}"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool-name}"/>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://toolneat.com/en/tools/{category}/{tool-name}</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool-name}"/>
  <xhtml:link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool-name}"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool-name}"/>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**한글 + 영어 URL 2개씩 추가 필수!**

---

## 테스트 체크리스트

도구 추가 후 localhost:3000에서 확인:
- [ ] 한글 도구 페이지 404 없음
- [ ] 영어 도구 페이지 404 없음
- [ ] /tools/index.html에 카드 표시됨
- [ ] /en/tools/index.html에 카드 표시됨
- [ ] 헤더 드롭다운에 링크 표시됨
- [ ] 모바일 메뉴에 링크 표시됨
- [ ] 카테고리 페이지에 표시됨
- [ ] 도구 수 정확함
