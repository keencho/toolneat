# Toolneat 도구 확장 계획

## 현재 상태 (2025-01-14)

### 완료된 작업
- ✅ **SEO 메타 설명 최적화** - 모든 페이지 적용 완료
- ✅ **바코드 생성기 확장** - 18종 바코드 포맷 지원
- ✅ **이미지 도구 추가** - image-resizer, image-converter 영문 버전 추가
- ✅ **파비콘 설정** - 모든 페이지에 절대경로로 적용
- ✅ **Sitemap 개선** - trailing slash 제거
- ✅ **PDF Tools 카테고리 신설** - 4개 도구 (merge, split, pdf-to-image, image-to-pdf)
- ✅ **AI 배경 제거** - @imgly/background-removal 라이브러리 사용
- ✅ **Video to GIF** - gif.js 라이브러리 사용
- ✅ **Screen Recorder** - MediaRecorder API + FFmpeg.wasm MP4 변환
- ✅ **OCR** - Tesseract.js (한/영/일/중 지원)
- ✅ **Loading Overlay 버그 수정** - CSS specificity 문제 해결
- ✅ **결과 화면 UX 개선** - PDF 도구들 자동 다운로드 → 결과 화면 + 다운로드 버튼
- ✅ **Meta 태그 보강** - JSON-LD description, og:description 보강

### 현재 도구 수
- **Dev Tools**: 21개
- **Life Tools**: 33개
- **PDF Tools**: 4개 (신규)
- **총 합계**: 58개 도구 (한/영 각각 = 116페이지)

---

## 트래픽 분석 요약

| 서비스 | 월 방문자 | 핵심 기능 |
|--------|----------|----------|
| iLovePDF | **2.2억** | PDF 변환/편집 |
| Remove.bg | **7,500만** | 이미지 배경 제거 |
| TinyPNG | **440만** | 이미지 압축 |
| SmallSEOTools | 수천만 | SEO/텍스트 도구 |

> 출처: [Similarweb](https://www.similarweb.com/), [Semrush](https://www.semrush.com/)

---

## 🔥 Priority 1: PDF 도구 (트래픽 킬러) - ✅ 기본 완료

PDF 도구가 압도적으로 트래픽이 높음. **새 대분류 "PDF Tools" 신설 완료**

### 필수 구현
- [x] **PDF 병합** (Merge PDF) - 여러 PDF를 하나로 ✅
- [x] **PDF 분할** (Split PDF) - 페이지별 분리 ✅
- [x] **PDF → 이미지** (PDF to JPG/PNG) ✅
- [x] **이미지 → PDF** (JPG/PNG to PDF) ✅
- [ ] **PDF 압축** (Compress PDF) - 파일 크기 줄이기
- [ ] **PDF → Word** (PDF to DOCX)
- [ ] **Word → PDF** (DOCX to PDF)

### 추가 구현 (차별화)
- [ ] PDF 페이지 회전
- [ ] PDF 워터마크 추가/제거
- [ ] PDF 암호 설정/해제
- [ ] PDF 페이지 순서 변경
- [ ] PDF 서명 추가

### 기술 스택
- **PDF.js** (Mozilla) - PDF 렌더링
- **pdf-lib** - PDF 편집 ✅ 사용중
- **jsPDF** - PDF 생성

---

## 🖼️ Priority 2: 이미지 도구 강화

### AI 기반 (외부 API 또는 WASM)
- [x] **배경 제거** (Remove Background) - @imgly/background-removal ✅
- [ ] **이미지 업스케일링** (AI Upscale) - 저해상도 → 고해상도
- [ ] **얼굴 모자이크** (Face Blur)
- [ ] **오래된 사진 복원** (Photo Restore)

### 기본 도구
- [ ] **이미지 자르기** (Crop)
- [ ] **이미지 회전/뒤집기** (Rotate/Flip)
- [ ] **필터/효과** (Filters) - 흑백, 세피아, 밝기 등
- [ ] **워터마크 추가** (Watermark)
- [ ] **이미지 메타데이터 제거** (EXIF Remover)
- [ ] **GIF 만들기** (GIF Maker) - 이미지 → GIF
- [ ] **스프라이트 시트** (Sprite Sheet Generator)
- [ ] **이미지 비교** (Image Diff) - 두 이미지 차이점

---

## 🎬 Priority 3: 비디오/오디오 도구 (새 대분류)

**새 대분류 "Media Tools" 신설**

### 비디오
- [x] **비디오 → GIF** (Video to GIF) - gif.js 라이브러리 ✅
- [ ] **비디오 자르기** (Video Trimmer)
- [ ] **비디오 형식 변환** (MP4, WebM, AVI)
- [ ] **비디오 압축** (Video Compressor)
- [ ] **비디오 → 오디오 추출** (Extract Audio)
- [ ] **비디오 썸네일 추출**
- [x] **화면 녹화** (Screen Recorder) - MediaRecorder API + FFmpeg.wasm MP4 변환 ✅

### 오디오
- [ ] **오디오 형식 변환** (MP3, WAV, OGG, FLAC)
- [ ] **오디오 자르기** (Audio Trimmer)
- [ ] **오디오 병합** (Audio Merge)
- [ ] **음량 조절** (Volume Adjuster)
- [ ] **노이즈 제거** (Noise Removal)

### 기술 스택
- **FFmpeg.wasm** - 브라우저에서 비디오/오디오 처리

---

## 📝 Priority 4: 텍스트/문서 도구 강화

### 텍스트 변환
- [ ] **한글 ↔ 영문 발음 변환** (로마자 변환)
- [ ] **텍스트 → 음성** (Text to Speech)
- [ ] **음성 → 텍스트** (Speech to Text)
- [x] **OCR** (이미지 → 텍스트) - Tesseract.js (한/영/일/중 지원) ✅
- [ ] **번역기** (간단한 번역)

### 문서 도구
- [ ] **Word 카운터 상세** (읽기 시간, 문장 수 등)
- [ ] **중복 텍스트 제거** (Duplicate Remover)
- [ ] **텍스트 정렬** (Sort Lines)
- [ ] **CSV ↔ JSON 변환**
- [ ] **CSV 뷰어/편집기**

---

## 🔍 Priority 5: SEO/마케팅 도구 (새 대분류)

**새 대분류 "SEO Tools" 신설**

### 분석 도구
- [ ] **메타태그 생성기** (Meta Tag Generator)
- [ ] **Open Graph 프리뷰** (OG Preview)
- [ ] **robots.txt 생성기**
- [ ] **sitemap.xml 생성기**
- [ ] **구조화 데이터 생성기** (Schema.org JSON-LD)

### 텍스트 분석
- [ ] **키워드 밀도 분석기**
- [ ] **가독성 점수** (Readability Score)
- [ ] **표절 검사기** (간단한 유사도 체크)

### 소셜 미디어
- [ ] **소셜 미디어 이미지 크기 가이드**
- [ ] **해시태그 생성기**
- [ ] **UTM 링크 생성기**

---

## 🎮 Priority 6: 재미/유틸리티 확장

### 생산성
- [ ] **포모도로 타이머**
- [ ] **스톱워치**
- [ ] **세계 시계** (World Clock)
- [ ] **카운트다운 타이머 공유** (링크로 공유)

### 재미
- [ ] **밈 생성기** (Meme Generator)
- [ ] **아스키 아트 생성기**
- [ ] **팀 뽑기** (Team Generator)
- [ ] **이름 생성기** (Name Generator)
- [ ] **가짜 정보 생성기** (테스트용 더미 데이터)

---

## 💻 Priority 7: 개발 도구 강화

### 코드
- [ ] **코드 포맷터** (JS, Python, HTML, CSS 통합)
- [ ] **코드 비교** (Code Diff) - 현재 텍스트 diff 강화
- [ ] **코드 → 이미지** (Carbon 클론)
- [ ] **코드 난독화** (Obfuscator)
- [ ] **코드 최소화** (Minifier 통합)

### API/네트워크
- [ ] **API 테스터** (간단한 REST 클라이언트)
- [ ] **HTTP 헤더 분석기**
- [ ] **IP 주소 조회**
- [ ] **DNS 조회**
- [ ] **포트 스캐너**

### 데이터
- [ ] **XML ↔ JSON 변환**
- [ ] **HTML → Markdown 변환**
- [ ] **Markdown → HTML 변환**
- [ ] **정규식 시각화** (Regex Visualizer)

---

## 📋 구현 우선순위

### Phase 1 (즉시) - 트래픽 폭발 기대 ✅ 완료
1. ~~PDF 병합/분할~~ ✅
2. ~~PDF ↔ 이미지 변환~~ ✅
3. ~~배경 제거 (AI)~~ ✅
4. ~~비디오 → GIF~~ ✅

### Phase 2 (단기) - 진행 중
5. PDF 압축
6. 이미지 자르기/회전
7. 오디오 형식 변환
8. ~~OCR~~ ✅

### Phase 3 (중기) - 일부 완료
9. 메타태그/OG 생성기
10. 코드 → 이미지
11. ~~화면 녹화~~ ✅
12. 텍스트 → 음성

---

## 🏗️ 사이트 구조 변경 제안

```
Toolneat
├── Dev Tools (기존)
├── Life Tools (기존)
├── PDF Tools (신규) ⭐
├── Image Tools (신규 또는 Life에서 분리)
├── Media Tools (신규) ⭐
├── SEO Tools (신규)
└── Fun & Games (기존 Life에서 분리)
```

---

## 기술적 고려사항

### 브라우저 기반 처리 (서버 비용 0)
- **PDF**: pdf-lib, jsPDF, PDF.js
- **이미지**: Canvas API, WebGL
- **비디오/오디오**: FFmpeg.wasm (WebAssembly)
- **AI**: TensorFlow.js, ONNX Runtime Web

### 외부 API 고려 (유료 가능성)
- 배경 제거: remove.bg API 또는 자체 AI 모델
- 번역: Google/DeepL API
- OCR: Tesseract.js (무료)

---

*최종 업데이트: 2026-01-14*
