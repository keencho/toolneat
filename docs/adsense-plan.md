# 애드센스 승인 계획서

> 작성: 2026-09-08 · 측정 기준일: 2026-09-08 · 배포본 = `3514a1d`

---

## 1. 거절 사유 (원문)

애드센스 대시보드 표시:

> **정책 위반이 발견되었습니다.**
> 사이트가 애드센스 프로그램 정책을 준수해야 합니다. 위반사항을 수정했으면 사이트 검토를 요청할 수 있습니다.
>
> **가치가 별로 없는 콘텐츠**
> 고객님의 사이트가 Google 게시자 네트워크의 사용 기준을 충족하지 않고 있습니다.
>
> 참고 리소스로 제시된 링크:
> - 최소 콘텐츠 요건
> - 사이트에서 고유 콘텐츠와 우수한 사용자 환경을 제공하는지 확인하기
> - **내용이 빈약한 콘텐츠(thin content)에 대한 웹마스터 품질 가이드라인**
> - 웹마스터 품질 가이드라인

**해석:** 상표·저작권·사행성 같은 개별 정책 위반이 아니라 **thin content** 판정이다.
제시된 링크 4개가 전부 "콘텐츠 분량·고유성" 계열이다.

### 검토에서 제외한 가설

| 가설 | 판정 | 근거 |
|---|---|---|
| 테트리스/가짜카톡 상표 위반 | **아님** | 인용 사유가 thin content. 위생 차원 과제로만 남김 (§6) |
| 로또 = 사행성 정책 | **아님** | 위와 동일 |
| 크롤링 차단 / 사이트 접근 불가 | **아님** | §3 측정 결과 전부 정상 |
| AI 템플릿 중복 콘텐츠 | **해결됨** | 5월·7월 청소 작업 성공. 중복률 측정 결과 대부분 0% (§4) |

---

## 2. 6개월 이력 (git 75커밋)

| 시기 | 작업 | 결과 |
|---|---|---|
| 2026-01-12 ~ 02-11 | 사이트 오픈, 도구 대량 생성 (`update` 커밋 40여 개) | — |
| 03-25 ~ 03-28 | 블로그 +8, 토스풍 CSS 개편, asset 경로/footer 수정 | 반려 |
| 03-28 | 블로그 +15, About/Privacy 개선 | 반려 |
| **05-12** | "AI 흔적 제거", "Thin content 보강", 카테고리 generic 섹션 제거 (4커밋) | 반려 |
| **07-03** | "애드센스 대응: 도구 40페이지 콘텐츠 보강 + AI 필러 103개 섹션 제거 + 문의 페이지 신설" | 반려 |
| 07-03 ~ 09-08 | 작업 없음 (2개월 방치) | — |

### 이력에서 얻은 교훈

1. **거절 사유를 저장소에 기록한 적이 없다.** `docs/plan.md`는 01-15에서 멈췄고 `CLAUDE.md`엔 "승인 팁" 4줄뿐. 6개월을 사유 확인 없이 감으로 대응했다. → 이 문서가 그 기록을 대신한다.
2. **매번 같은 방향(콘텐츠 품질)으로만 갔다.** 방향 자체는 맞았지만 **범위가 부족했다.** 07-03에 40페이지를 보강하고 71페이지를 남겨뒀는데, 애드센스는 사이트를 총합으로 평가한다.
3. **한 문제를 고치며 다른 문제를 만들었다.** 05-12 "카테고리 generic 섹션 제거"가 과하게 밀어내서 `/tools/game`이 본문 194자가 됐다.

---

## 3. 기술 점검 — 전부 정상 (여기 파지 말 것)

2026-09-08 라이브 측정:

| 항목 | 결과 |
|---|---|
| `Googlebot` / `AdsBot-Google` / `Mediapartners-Google` | 전부 `200` |
| `ads.txt` | `google.com, pub-8846557285079359, DIRECT, f08c47fec0942fa0` 정상 |
| `robots.txt` | 전체 개방, sitemap 선언됨 |
| `sitemap.xml` | 320 URL, 145KB, `200` |
| `.html` / trailing slash 접근 | `308` 정규화 정상 |
| canonical / hreflang | 정상 |
| 배포본 ↔ 로컬 최신 커밋 | 동기화됨 |
| 애드센스 스크립트 커버리지 | **321 / 322** |

**기술 결함 2건 (사소):**
- `en/tools/dev/jwt-decoder.html` — 애드센스 스크립트 누락 (유일)
- `www.toolneat.com` — apex로 리다이렉트하지 않고 `200` 반환 (canonical로 방어 중)

---

## 4. 콘텐츠 측정 (실제 원인)

### 4.1 중복은 문제가 아니다

문장 단위 교차 중복률 측정 결과, KO 도구 페이지 **대부분 0%**. 5월·7월 청소 작업은 성공했다.

3개 이상 페이지에 반복되는 문장은 5종뿐:

| 반복 | 문장 |
|---|---|
| 6회 | "간단한 팁 결과를 그대로 코드에 붙여 넣기 전에 한 번 더 확인하는 습관을…" |
| 4회 | "의료, 법률, 금융처럼 중요한 결정이 걸려 있다면 반드시 전문가의 의견을…" |
| 4회 | "빠른 확인용으로는 충분히 유용합니다." |
| 4회 | "PDF 파일을 드래그하거나 클릭하여 선택 PDF 파일만 지원됩니다" |
| 3회 | "이미지를 드래그하거나 클릭해서 선택하세요" |

### 4.2 분량이 문제다

| 구분 | 페이지 | 평균 HTML | 평균 본문 | 텍스트 비율 |
|---|---|---|---|---|
| KO 도구 | 111 | 60KB | **1,394자** | **2.3%** |
| EN 도구 | 111 | 64KB | 3,182자 (≈KO 1,400자 수준) | 4.9% |
| KO 블로그 | 42 | 54KB | 3,318자 | 6.0% |

- 본문 비율 **1.5% 미만**: KO 도구 111개 중 **46개**
- 본문 **1,500자 미만**: KO 도구 111개 중 **82개** + 카테고리 인덱스 4개 = **86개**
- sitemap 등록 **320 URL** 중 절반 이상이 얇음

**블로그(42개)는 정상이다.** 평균 3,318자, 중복 0%. 손대지 않는다.

### 4.3 이미 합격선인 25개 (기준선)

```
tools/dev/base64 (3,978)  tools/dev/jwt-decoder (3,990)  tools/life/loan-calculator (4,029)
tools/life/salary-calculator (3,965)  tools/dev/json-formatter (3,852)  tools/dev/regex-tester (3,641)
tools/life/qr-generator (3,665)  tools/dev/timestamp-converter (3,679)  tools/life/youtube-thumbnail (3,503)
tools/dev/uuid-generator (3,474)  tools/life/bmi-calculator (3,339)  tools/life/image-resizer (3,337)
tools/life/character-counter (3,324)  tools/life/background-remover (3,106)  tools/life/video-to-gif (3,100)
tools/pdf/compress-pdf (3,048)  tools/life/image-compressor (2,948)  tools/pdf/split-pdf (2,669)
tools/pdf/merge-pdf (2,643)  tools/pdf/pdf-to-image (2,642)  tools/game/memory-game (1,593)
tools/dev/color-contrast (1,556)  tools/game/tetris (1,547)  tools/game/snake (1,532)
tools/game/minesweeper (1,523)
```

`tools/dev/base64.html`이 품질 기준선이다. 구조:

```
도구 소개 (200~300자)
  → "○○이란?" 정의 + 역사/표준 (RFC 번호 등 구체적 출처)
  → 작동 원리 (실제 값으로 하는 단계별 예시 — "Hi" → 01001000 01101001 → SGk=)
  → 사용법 (이 페이지 UI 기준 단계별)
  → 실무 사례 3개 (각 150~250자, 구체적 코드/값 포함)
  → FAQ 8~10개 (각 100~200자, 진짜 헷갈리는 것만)
  → 관련 도구 (실제로 연관된 것만)
```

---

## 5. 계획

### 전략

6개월간 계속 **더했는데** 계속 반려됐다. 애드센스는 사이트를 총합/평균으로 본다.
82페이지를 4,000자로 채우는 건 몇 달짜리다. **평가 대상 자체를 줄이면서 남은 것을 심화한다.**

**폐기된 안:** 위젯형 도구 13개를 4페이지로 통합
→ 롱테일 키워드 손실("로또번호생성기", "동전던지기", "주사위굴리기"는 각각 독립 검색어).
→ 그리고 이 도구들도 쓸 내용이 있다 (동전던지기 = 도박사의 오류 + `crypto.getRandomValues` + Diaconis 51% 연구, 로또 = 45C6 = 8,145,060 조합론 + 인기번호 회피 시 당첨금 분할 감소). **도구 111개 전부 유지한다.**

---

### Phase 0 — 즉시 (반나절)

평가 대상 URL을 절반으로 줄이고 잔여 필러를 제거한다.

| # | 작업 | 대상 |
|---|---|---|
| 0-1 | **EN 전체 `noindex`** — `<meta name="robots" content="noindex,follow">` | `en/**/*.html` 153개 |
| 0-2 | **EN을 sitemap에서 제외** — `scripts/auto/generate-sitemap.js` 수정 후 재생성 | 320 → 167 URL |
| 0-3 | 템플릿 필러 문장 제거 | `life/stopwatch`, `life/ascii-unicode`, `life/background-remover`, `life/image-compressor` |
| 0-4 | "간단한 팁 결과를 그대로 코드에…" 제거 | 6개 페이지 |
| 0-5 | 블로그 "이 주제에 대한 자세한 내용은 위 본문을…" 제거 | 9개 페이지 |
| 0-6 | 애드센스 스크립트 누락 보정 | `en/tools/dev/jwt-decoder.html` |
| 0-7 | 무관한 크로스링크 정리 — 스톱워치 → 대출계산기 같은 것 | 21개 페이지 |

> **EN은 되돌릴 수 있다.** KO 승인 후 `noindex` 제거 + sitemap 복구하면 원상복구된다.
> 페이지는 살아있으므로 사용자·직접 유입에는 영향 없다.

---

### ※ 블로그 FAQ 건은 계획 수립 시 파악한 것보다 심각했다. 해당 9개 글의
   "자주 묻는 질문" 항목 26개가 **전부** 플레이스홀더였다(진짜 답변 0개).
   삭제하면 섹션이 통째로 비므로 실제 답변을 작성했다. 결과적으로 블로그
   평균 본문이 3,318자 → 3,410자로 늘고 반복 문장은 0이 되었다.

※ Phase 0 직후 KO 도구 평균 본문은 1,394자 → 1,359자로 **줄었다.** 필러를
   걷어냈으니 당연한 결과이며, 이 수치를 올리는 것이 Phase 1~2의 일이다.
   1.5% 미만 페이지도 46개 → 57개로 늘었다.

Phase 1 — 카테고리 인덱스 복구 (1일)

05-12 커밋이 과하게 밀어낸 부분. **generic 문구가 아닌 실제 내용**으로 채운다.

| 페이지 | 현재 | 목표 |
|---|---|---|
| `tools/game.html` | **194자** | 800자+ |
| `tools/pdf.html` | **423자** | 800자+ |
| `tools/life.html` | 1,165자 | 1,200자+ |
| `tools/dev.html` | 1,232자 | 1,200자+ |

채울 내용: 카테고리 도구 선택 가이드(어떤 상황에 뭘 쓰는지), 브라우저 처리 방식 설명, 카테고리별 자주 묻는 질문 3~4개. **다른 카테고리와 같은 문장을 쓰지 말 것.**

---

### Phase 2 — 도구 페이지 심화 (핵심 · 배치 진행)

82개를 **1,500자 이상**으로. 기준선은 `tools/dev/base64.html`.

**작성 원칙 (07-03에 103개 필러 섹션을 걷어낸 이유를 반복하지 않기 위해):**

- ❌ 도구와 무관한 일반론 ("의료·법률·금융 결정은 전문가와…")
- ❌ 모든 페이지에 같은 구조·같은 문장
- ❌ 분량 채우기용 반복
- ✅ 그 도구에서만 나올 수 있는 구체적 사실 — 표준 번호, 실제 계산 예시, 수치, 알고리즘
- ✅ 실제로 헷갈리는 지점 기반 FAQ
- ✅ 페이지마다 다른 시작 문장·다른 섹션 구성

**배치 순서 — 얇은 것부터 (수치 = 현재 고유 본문 자수):**

#### 배치 A — 500~800자 (최우선, 35개)
| 페이지 | 현재 |
|---|---|
| `tools/dev/xml-json.html` | 509자 |
| `tools/pdf/rotate-pdf.html` | 521자 |
| `tools/pdf/watermark-pdf.html` | 533자 |
| `tools/life/lottery-generator.html` | 590자 |
| `tools/dev/yaml-json.html` | 603자 |
| `tools/life/roulette.html` | 617자 |
| `tools/life/stopwatch.html` | 620자 |
| `tools/life/emoji-picker.html` | 621자 |
| `tools/life/dice-roller.html` | 627자 |
| `tools/life/pomodoro-timer.html` | 628자 |
| `tools/life/ip-lookup.html` | 637자 |
| `tools/dev/url-encoder.html` | 642자 |
| `tools/life/age-calculator.html` | 645자 |
| `tools/life/aspect-ratio.html` | 648자 |
| `tools/life/countdown-timer.html` | 653자 |
| `tools/life/fake-chat.html` | 654자 |
| `tools/life/qr-scanner.html` | 655자 |
| `tools/dev/json-csv.html` | 666자 |
| `tools/life/coin-flip.html` | 674자 |
| `tools/life/ai-detector.html` | 695자 |
| `tools/life/webcam-test.html` | 697자 |
| `tools/dev/markdown-preview.html` | 698자 |
| `tools/life/image-crop.html` | 700자 |
| `tools/dev/robots-txt.html` | 701자 |
| `tools/dev/color-palette.html` | 702자 |
| `tools/life/korean-name-generator.html` | 702자 |
| `tools/life/dday-calculator.html` | 723자 |
| `tools/life/screen-recorder.html` | 746자 |
| `tools/life/morse-code.html` | 748자 |
| `tools/life/sleep-calculator.html` | 754자 |
| `tools/life/mic-test.html` | 755자 |
| `tools/life/ocr.html` | 755자 |
| `tools/life/exif-remover.html` | 763자 |
| `tools/life/color-picker.html` | 779자 |
| `tools/life/base-converter.html` | 788자 |

#### 배치 B — 800~1,100자 (35개)
| 페이지 | 현재 |
|---|---|
| `tools/life/meme-generator.html` | 800자 |
| `tools/life/compound-calculator.html` | 811자 |
| `tools/dev/html-minifier.html` | 823자 |
| `tools/life/text-to-speech.html` | 826자 |
| `tools/life/speech-to-text.html` | 829자 |
| `tools/dev/og-preview.html` | 832자 |
| `tools/life/tip-calculator.html` | 834자 |
| `tools/dev/sql-formatter.html` | 842자 |
| `tools/life/typing-test.html` | 844자 |
| `tools/life/noise-generator.html` | 849자 |
| `tools/dev/meta-tag-generator.html` | 862자 |
| `tools/pdf/delete-pdf.html` | 863자 |
| `tools/pdf/reorder-pdf.html` | 865자 |
| `tools/dev/text-escape.html` | 869자 |
| `tools/dev/utm-generator.html` | 878자 |
| `tools/dev/password-generator.html` | 879자 |
| `tools/pdf/image-to-pdf.html` | 889자 |
| `tools/life/favicon-generator.html` | 893자 |
| `tools/life/screen-burn-test.html` | 894자 |
| `tools/life/ascii-unicode.html` | 902자 |
| `tools/life/dead-pixel-test.html` | 914자 |
| `tools/life/image-converter.html` | 921자 |
| `tools/life/barcode-generator.html` | 936자 |
| `tools/life/percent-calculator.html` | 954자 |
| `tools/life/fancy-text.html` | 970자 |
| `tools/life/reaction-test.html` | 971자 |
| `tools/dev/html-entity.html` | 989자 |
| `tools/life/image-blur.html` | 996자 |
| `tools/life/image-rotate.html` | 1048자 |
| `tools/dev/jwt-generator.html` | 1054자 |
| `tools/dev/line-ending.html` | 1060자 |
| `tools/life/image-watermark.html` | 1080자 |
| `tools/dev/hash-generator.html` | 1091자 |
| `tools/dev/color-converter.html` | 1094자 |
| `tools/dev/lorem-ipsum.html` | 1098자 |

#### 배치 C — 1,100~1,500자 (12개)
| 페이지 | 현재 |
|---|---|
| `tools/life/pixel-fixer.html` | 1144자 |
| `tools/dev/js-minifier.html` | 1164자 |
| `tools/life/screen-color-test.html` | 1202자 |
| `tools/life/unit-converter.html` | 1223자 |
| `tools/dev/json-validator.html` | 1244자 |
| `tools/dev/cron-generator.html` | 1274자 |
| `tools/dev/gradient-generator.html` | 1314자 |
| `tools/dev/css-minifier.html` | 1321자 |
| `tools/dev/diff-checker.html` | 1321자 |
| `tools/game/2048.html` | 1332자 |
| `tools/dev/box-shadow.html` | 1351자 |
| `tools/dev/case-converter.html` | 1375자 |

---

### Phase 3 — 검토 요청 전 대기

**Phase 2 완료 즉시 검토 요청하지 말 것.** 구글이 재크롤링해서 바뀐 콘텐츠를 봐야 판정이 바뀐다.

1. Search Console에서 대표 페이지 10~20개 **색인 요청** (배치 A에서 심화한 것 위주)
2. sitemap 재제출
3. **2~4주 대기** — 색인된 페이지 수와 캐시된 내용이 갱신됐는지 확인
4. 갱신 확인 후 애드센스 "문제를 수정했음을 확인합니다" 체크 → **검토 요청**

> 검토 요청 전 확인: `site:toolneat.com` 결과 수, Search Console 색인 페이지 수, 심화한 페이지의 구글 캐시 본문이 새 내용인지.

---

## 6. 보류 과제 (이번 거절 사유 아님 · 승인 후 처리)

인용된 사유가 thin content이므로 **지금 건드리지 않는다.** 다만 향후 정책 검토에서 걸릴 수 있는 항목:

| 페이지 | 사유 |
|---|---|
| `tools/game/tetris` | Tetris Holding LLC 상표. 클론 상대 소송 이력 있음 (Xio Interactive 판례) |
| `tools/life/fake-chat` | "카카오톡" 2회 / "카톡" 7회 표기 + 가짜 스크린샷 생성 = 허위 진술 콘텐츠 소지 |
| `tools/life/ai-detector` | 본문 695자에 "AI 생성 확률 %"를 수치로 제시. 근거 없는 정확도 주장 |
| `tools/life/lottery-generator` | 사행성 제한 카테고리 (한국 대상 특히) |
| `www.toolneat.com` | apex로 301 리다이렉트 필요 |

---

## 7. 체크리스트

```
Phase 0 — 즉시  ✅ 2026-09-08 완료
[x] EN 160개 페이지 noindex 메타 삽입 (en/ 159 + 루트 en.html)
      → scripts/auto/en-noindex.js  (되돌리기: --remove)
[x] generate-sitemap.js에서 en/ 제외 → sitemap 재생성 (320 → 160 URL, 145KB → 23KB)
      → INCLUDE_EN 상수를 true로 바꾸면 복구
[x] 템플릿 필러 제거 (KO 4 + EN 1) — "의료, 법률, 금융처럼…"
[x] "간단한 팁…" 6개 페이지 제거
[x] 블로그 FAQ 26개 답변 작성 (9개 글) — 아래 주석 참고
[x] 애드센스 스크립트 누락 수정 — 원인은 URL 오타(adsbygoogle.jczs). 322/322 정상
[x] 무관 크로스링크 83개 페이지 재계산
      → scripts/auto/fix-cross-links.js (태그 유사도 기반, 재실행 가능)

※ 블로그 FAQ 건은 계획 수립 시 파악한 것보다 심각했다. 해당 9개 글의
   "자주 묻는 질문" 항목 26개가 **전부** 플레이스홀더였다(진짜 답변 0개).
   삭제하면 섹션이 통째로 비므로 실제 답변을 작성했다. 결과적으로 블로그
   평균 본문이 3,318자 → 3,410자로 늘고 반복 문장은 0이 되었다.

※ Phase 0 직후 KO 도구 평균 본문은 1,394자 → 1,359자로 **줄었다.** 필러를
   걷어냈으니 당연한 결과이며, 이 수치를 올리는 것이 Phase 1~2의 일이다.
   1.5% 미만 페이지도 46개 → 57개로 늘었다.

Phase 1 — 카테고리 인덱스  ✅ 2026-09-08 완료 (4개 페이지 간 중복 문장 0)
[x] tools/game.html     194자 → 1,524자  (게임 선택 가이드 / 기록 저장 방식 / FAQ 3)
[x] tools/pdf.html      423자 → 2,115자  (브라우저 처리 원리 / 작업별 도구 / 압축 주의사항 / FAQ 4)
[x] tools/dev.html    1,232자 → 2,680자  (토큰·키 보안 / 네 갈래 분류 / FAQ 4)
[x] tools/life.html   1,165자 → 2,520자  (쓰임새별 분류 / 권한 / 음성인식 예외 / FAQ 4)
[x] 덤: tools/life/speech-to-text.html 의 허위 프라이버시 문구 수정 (아래 주석)

※ Phase 1 작업 중 사실관계 오류를 발견해 함께 고쳤다. speech-to-text 페이지가
   "서버 업로드 없이 브라우저에서 안전하게 처리됩니다", "음성이 서버로 전송되지
   않습니다"라고 적고 있었으나, 이 도구는 webkitSpeechRecognition을 쓰므로
   크롬 계열에서 음성이 브라우저 제조사 서버로 전송된다. 사실과 다른 프라이버시
   주장이라 두 문구를 정정했다.
   → pages/about.html 의 "모든 데이터는 브라우저 내에서 처리되며 서버로 전송되지
     않습니다"도 같은 이유로 예외 표기가 필요하다. Phase 2에서 처리할 것.

Phase 2 — 도구 페이지 (82개, 전부 1,500자+)
[ ] 배치 A (35개) — 500~800자
[ ] 배치 B (35개) — 800~1,100자
[ ] 배치 C (12개) — 1,100~1,500자
[ ] 배치마다 재측정: node scripts/measure-content.js

Phase 3 — 검토 요청
[ ] Search Console 색인 요청 (대표 10~20개)
[ ] sitemap 재제출
[ ] 2~4주 대기 + 색인 갱신 확인
[ ] 애드센스 검토 요청
[ ] 결과를 이 문서 §2 이력 표에 기록  ← 다음 사이클을 위해 반드시
```

---

## 8. 측정 방법

본문 자수·중복률 재측정 스크립트를 `scripts/measure-content.js`로 커밋할 것.
현재 측정에 쓴 로직:

- `<script>` / `<style>` / `<svg>` 제거 → `<main>` 범위만 추출 → 태그·엔티티 제거 → 공백 정규화
- 중복률: 15자 초과 문장이 3개 이상 페이지에 등장하면 중복으로 집계
- 합격 기준: **고유 본문 1,500자 이상 & 텍스트 비율 1.5% 이상**

---

*이 문서는 거절될 때마다 §2 이력 표와 §1 사유를 갱신한다. 6개월간 사유 기록이 없어서 같은 방향으로만 반복 대응한 것이 이번 지연의 근본 원인이다.*
