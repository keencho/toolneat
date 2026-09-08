const fs = require('fs');
const path = require('path');

// Tool content data: howItWorks (ko/en), relatedTools, relatedBlog
const toolsData = {
  // ===== DEV TOOLS =====
  'dev/color-converter': {
    howItWorks: {
      ko: '색상 변환기는 입력된 색상 값을 파싱한 후 내부적으로 RGB 색공간으로 통일합니다. RGB 값을 기반으로 수학적 공식을 적용하여 HSL, HSV, CMYK 등 다른 색공간으로 변환합니다. 예를 들어 HEX #FF6B35를 입력하면, 먼저 16진수를 R=255, G=107, B=53으로 분리하고, HSL 변환 공식을 적용하여 H=16°, S=100%, L=60%를 계산합니다. CMYK 변환은 RGB 값을 0~1 범위로 정규화한 뒤 K=1-max(R,G,B), C=(1-R-K)/(1-K) 공식으로 산출합니다.',
      en: 'The color converter parses your input color value and internally normalizes it to the RGB color space. From RGB, it applies mathematical formulas to convert to other spaces like HSL, HSV, and CMYK. For example, entering HEX #FF6B35 first splits into R=255, G=107, B=53, then the HSL formula yields H=16°, S=100%, L=60%. CMYK conversion normalizes RGB to a 0-1 range and applies K=1-max(R,G,B), C=(1-R-K)/(1-K) to produce print-ready values.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/color-contrast', name: '색상 대비 검사기', desc: 'WCAG 접근성 기준에 따라 텍스트와 배경색의 대비율을 검사합니다.' },
        { id: 'dev/color-palette', name: '색상 팔레트 생성기', desc: '조화로운 색상 조합을 자동으로 생성합니다.' },
        { id: 'dev/gradient-generator', name: '그라디언트 생성기', desc: 'CSS 그라디언트 코드를 시각적으로 만듭니다.' }
      ],
      en: [
        { id: 'dev/color-contrast', name: 'Color Contrast Checker', desc: 'Check text and background color contrast ratios against WCAG standards.' },
        { id: 'dev/color-palette', name: 'Color Palette Generator', desc: 'Automatically generate harmonious color combinations.' },
        { id: 'dev/gradient-generator', name: 'Gradient Generator', desc: 'Visually create CSS gradient code.' }
      ]
    },
    relatedBlog: { id: 'color-theory-guide', ko: '웹 디자인을 위한 색상 이론 가이드', en: 'Color Theory Guide for Web Design' }
  },
  'dev/color-palette': {
    howItWorks: {
      ko: '색상 팔레트 생성기는 색상 이론의 수학적 관계를 활용합니다. HSL 색공간에서 색상환(Hue wheel)의 각도를 기준으로 보색(180°), 유사색(±30°), 삼각 배색(120° 간격), 사각 배색(90° 간격) 등을 계산합니다. 기준 색상의 Hue 값에 각 조화 규칙의 각도를 더하거나 빼서 새로운 색상을 도출하며, 채도와 명도를 미세 조정하여 실제 디자인에 바로 적용할 수 있는 조화로운 팔레트를 만들어냅니다.',
      en: 'The palette generator leverages mathematical relationships from color theory. In the HSL color space, it calculates complementary (180°), analogous (±30°), triadic (120° apart), and tetradic (90° apart) colors based on the hue wheel. By adding or subtracting harmony rule angles from the base hue and fine-tuning saturation and lightness, it produces design-ready palettes that follow established color harmony principles.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/color-converter', name: '색상 변환기', desc: 'HEX, RGB, HSL 등 다양한 색상 형식을 변환합니다.' },
        { id: 'dev/color-contrast', name: '색상 대비 검사기', desc: '접근성 기준에 맞는 색상 대비를 확인합니다.' },
        { id: 'dev/gradient-generator', name: '그라디언트 생성기', desc: '팔레트 색상으로 그라디언트를 만듭니다.' }
      ],
      en: [
        { id: 'dev/color-converter', name: 'Color Converter', desc: 'Convert between HEX, RGB, HSL and other color formats.' },
        { id: 'dev/color-contrast', name: 'Color Contrast Checker', desc: 'Verify color contrast meets accessibility standards.' },
        { id: 'dev/gradient-generator', name: 'Gradient Generator', desc: 'Create gradients with your palette colors.' }
      ]
    },
    relatedBlog: { id: 'color-theory-guide', ko: '웹 디자인을 위한 색상 이론 가이드', en: 'Color Theory Guide for Web Design' }
  },
  'dev/cron-generator': {
    howItWorks: {
      ko: 'Cron 표현식은 5개(또는 6개) 필드로 구성됩니다: 분(0-59), 시(0-23), 일(1-31), 월(1-12), 요일(0-7). 각 필드에 *(모든 값), 쉼표(목록), 하이픈(범위), 슬래시(간격)를 조합하여 스케줄을 정의합니다. 예를 들어 "*/15 9-17 * * 1-5"는 "평일 오전 9시부터 오후 5시까지 15분마다"를 의미합니다. 이 도구는 시각적 UI로 각 필드를 설정하고 실시간으로 표현식과 다음 실행 시간을 미리 보여줍니다.',
      en: 'A cron expression consists of 5 (or 6) fields: minute (0-59), hour (0-23), day (1-31), month (1-12), weekday (0-7). Each field accepts * (all values), commas (lists), hyphens (ranges), and slashes (intervals). For example, "*/15 9-17 * * 1-5" means "every 15 minutes from 9 AM to 5 PM on weekdays." This tool provides a visual UI to configure each field and preview the expression with upcoming execution times in real time.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/timestamp-converter', name: '타임스탬프 변환기', desc: 'Unix 타임스탬프와 날짜/시간을 변환합니다.' },
        { id: 'dev/regex-tester', name: '정규식 테스터', desc: '정규표현식을 테스트하고 검증합니다.' },
        { id: 'dev/uuid-generator', name: 'UUID 생성기', desc: '고유 식별자를 생성합니다.' }
      ],
      en: [
        { id: 'dev/timestamp-converter', name: 'Timestamp Converter', desc: 'Convert between Unix timestamps and dates.' },
        { id: 'dev/regex-tester', name: 'Regex Tester', desc: 'Test and validate regular expressions.' },
        { id: 'dev/uuid-generator', name: 'UUID Generator', desc: 'Generate unique identifiers.' }
      ]
    },
    relatedBlog: { id: 'cron-expression-guide', ko: 'Cron 표현식 완벽 가이드', en: 'Complete Guide to Cron Expressions' }
  },
  'dev/html-entity': {
    howItWorks: {
      ko: 'HTML 엔티티 변환은 HTML 문서에서 특수한 의미를 가지는 문자들을 안전한 엔티티 참조로 대체하는 과정입니다. &는 &amp;로, <는 &lt;로, >는 &gt;로 변환됩니다. 이름 기반 엔티티(&amp;copy; → ©)와 숫자 기반 엔티티(&#169; → ©) 두 가지 형식이 있습니다. 이 도구는 입력 텍스트의 각 문자를 검사하여 HTML에서 예약된 문자인지 확인하고, 해당하는 엔티티 코드로 치환합니다.',
      en: 'HTML entity conversion replaces characters with special meaning in HTML with safe entity references. & becomes &amp;, < becomes &lt;, > becomes &gt;. Two formats exist: named entities (&amp;copy; → ©) and numeric entities (&#169; → ©). This tool examines each character in your input, checks whether it is reserved in HTML, and substitutes the corresponding entity code.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/text-escape', name: '텍스트 이스케이프', desc: 'HTML, JSON, URL 등 다양한 컨텍스트의 이스케이프 처리.' },
        { id: 'dev/url-encoder', name: 'URL 인코더', desc: 'URL 특수문자를 퍼센트 인코딩으로 변환합니다.' },
        { id: 'dev/html-minifier', name: 'HTML 압축기', desc: 'HTML 코드를 최소화하여 파일 크기를 줄입니다.' }
      ],
      en: [
        { id: 'dev/text-escape', name: 'Text Escape', desc: 'Escape special characters for HTML, JSON, URL contexts.' },
        { id: 'dev/url-encoder', name: 'URL Encoder', desc: 'Convert URL special characters to percent-encoding.' },
        { id: 'dev/html-minifier', name: 'HTML Minifier', desc: 'Minimize HTML code to reduce file size.' }
      ]
    }
  },
  'dev/html-minifier': {
    howItWorks: {
      ko: 'HTML 압축기는 여러 단계의 최적화를 수행합니다. 먼저 주석을 제거하고, 연속된 공백과 줄바꿈을 하나의 공백으로 축소합니다. 태그 속성의 불필요한 따옴표를 제거하고, boolean 속성(checked, disabled 등)의 값을 생략합니다. 인라인 CSS와 JavaScript도 함께 최소화할 수 있습니다. 이러한 과정을 통해 HTML 파일 크기를 일반적으로 20~40% 줄여 페이지 로드 시간을 단축합니다.',
      en: 'The HTML minifier performs multiple optimization passes. It removes comments, collapses consecutive whitespace and line breaks into single spaces, strips unnecessary attribute quotes, and omits values from boolean attributes (checked, disabled, etc.). Inline CSS and JavaScript can be minified simultaneously. These transformations typically reduce HTML file size by 20-40%, resulting in faster page load times.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/css-minifier', name: 'CSS 압축기', desc: 'CSS 코드를 최소화합니다.' },
        { id: 'dev/js-minifier', name: 'JavaScript 압축기', desc: 'JS 코드를 최소화합니다.' },
        { id: 'dev/html-entity', name: 'HTML 엔티티 변환기', desc: 'HTML 특수문자를 엔티티로 변환합니다.' }
      ],
      en: [
        { id: 'dev/css-minifier', name: 'CSS Minifier', desc: 'Minimize CSS code.' },
        { id: 'dev/js-minifier', name: 'JavaScript Minifier', desc: 'Minimize JS code.' },
        { id: 'dev/html-entity', name: 'HTML Entity Converter', desc: 'Convert special characters to HTML entities.' }
      ]
    },
    relatedBlog: { id: 'css-optimization-guide', ko: 'CSS 최적화와 압축 가이드', en: 'CSS Optimization and Minification Guide' }
  },
  'dev/json-csv': {
    howItWorks: {
      ko: 'JSON-CSV 변환은 계층적 데이터 구조와 테이블형 데이터 구조 사이의 매핑입니다. JSON 배열의 각 객체가 CSV의 한 행이 되고, 객체의 키들이 열 헤더가 됩니다. 중첩된 객체는 점 표기법(user.name)으로 평탄화하여 CSV 열로 변환합니다. 반대로 CSV를 JSON으로 변환할 때는 첫 번째 행을 헤더로 파싱하고, 각 데이터 행을 키-값 쌍의 객체로 매핑합니다. 쉼표가 포함된 값은 큰따옴표로 감싸서 처리합니다.',
      en: 'JSON-CSV conversion maps between hierarchical and tabular data structures. Each object in a JSON array becomes a CSV row, with object keys serving as column headers. Nested objects are flattened using dot notation (user.name) for CSV columns. Conversely, CSV-to-JSON parsing treats the first row as headers and maps each data row to key-value pair objects. Values containing commas are wrapped in double quotes following RFC 4180.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/json-formatter', name: 'JSON 포맷터', desc: 'JSON 데이터를 보기 좋게 정렬합니다.' },
        { id: 'dev/json-validator', name: 'JSON 유효성 검사기', desc: 'JSON 구문 오류를 검사합니다.' },
        { id: 'dev/xml-json', name: 'XML-JSON 변환기', desc: 'XML과 JSON 간 변환합니다.' }
      ],
      en: [
        { id: 'dev/json-formatter', name: 'JSON Formatter', desc: 'Pretty-print and format JSON data.' },
        { id: 'dev/json-validator', name: 'JSON Validator', desc: 'Check JSON syntax errors.' },
        { id: 'dev/xml-json', name: 'XML-JSON Converter', desc: 'Convert between XML and JSON.' }
      ]
    },
    relatedBlog: { id: 'json-yaml-xml', ko: 'JSON vs YAML vs XML 비교', en: 'JSON vs YAML vs XML Comparison' }
  },
  'dev/line-ending': {
    howItWorks: {
      ko: '줄바꿈 변환기는 텍스트 내의 줄바꿈 문자를 감지하고 변환합니다. Windows는 CRLF(\\r\\n, 0x0D0A), Unix/Linux/macOS는 LF(\\n, 0x0A), 구형 macOS는 CR(\\r, 0x0D)를 사용합니다. 이 도구는 입력 텍스트의 바이트를 스캔하여 현재 사용 중인 줄바꿈 방식을 자동 감지하고, 선택한 대상 형식으로 일괄 변환합니다. 혼합된 줄바꿈도 감지하여 통일할 수 있습니다.',
      en: 'The line ending converter detects and transforms newline characters in text. Windows uses CRLF (\\r\\n, 0x0D0A), Unix/Linux/macOS uses LF (\\n, 0x0A), and classic macOS used CR (\\r, 0x0D). This tool scans input bytes to auto-detect the current line ending style and batch-converts to your chosen target format. Mixed line endings are also detected and can be unified.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/diff-checker', name: '텍스트 비교 도구', desc: '두 텍스트의 차이를 비교합니다.' },
        { id: 'dev/text-escape', name: '텍스트 이스케이프', desc: '특수문자를 이스케이프 처리합니다.' },
        { id: 'dev/case-converter', name: '대소문자 변환기', desc: '텍스트 케이스를 변환합니다.' }
      ],
      en: [
        { id: 'dev/diff-checker', name: 'Diff Checker', desc: 'Compare differences between two texts.' },
        { id: 'dev/text-escape', name: 'Text Escape', desc: 'Escape special characters.' },
        { id: 'dev/case-converter', name: 'Case Converter', desc: 'Convert text case formats.' }
      ]
    }
  },
  'dev/lorem-ipsum': {
    howItWorks: {
      ko: 'Lorem Ipsum 생성기는 의사 라틴어 텍스트 데이터베이스에서 단어를 무작위로 조합합니다. 원본은 기원전 45년 키케로의 "De Finibus Bonorum et Malorum"에서 유래했으며, 1960년대 조판 업계에서 더미 텍스트로 채택되었습니다. 이 도구는 단어 빈도와 문장 길이의 자연스러운 분포를 유지하면서 지정된 단락/문장/단어 수만큼 텍스트를 생성합니다. 실제 콘텐츠 없이 레이아웃과 타이포그래피를 미리 확인하는 데 사용합니다.',
      en: 'The Lorem Ipsum generator assembles words from a pseudo-Latin text database. The source text originates from Cicero\'s "De Finibus Bonorum et Malorum" (45 BC) and was adopted as dummy text by the typesetting industry in the 1960s. This tool maintains natural word frequency and sentence length distribution while generating the specified number of paragraphs, sentences, or words. It helps preview layouts and typography without actual content.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/case-converter', name: '대소문자 변환기', desc: '텍스트 케이스를 변환합니다.' },
        { id: 'dev/text-escape', name: '텍스트 이스케이프', desc: '특수문자를 이스케이프합니다.' },
        { id: 'dev/markdown-preview', name: '마크다운 미리보기', desc: '마크다운 텍스트를 렌더링합니다.' }
      ],
      en: [
        { id: 'dev/case-converter', name: 'Case Converter', desc: 'Convert text case formats.' },
        { id: 'dev/text-escape', name: 'Text Escape', desc: 'Escape special characters.' },
        { id: 'dev/markdown-preview', name: 'Markdown Preview', desc: 'Render markdown text.' }
      ]
    },
    relatedBlog: { id: 'markdown-guide', ko: '마크다운 문법 완벽 가이드', en: 'Complete Guide to Markdown Syntax' }
  },
  'dev/markdown-preview': {
    howItWorks: {
      ko: '마크다운 미리보기는 마크다운 문법을 HTML로 변환하는 파서를 사용합니다. #은 &lt;h1&gt;~&lt;h6&gt;으로, **텍스트**는 &lt;strong&gt;으로, [링크](url)는 &lt;a&gt; 태그로 변환됩니다. CommonMark 규격을 따르며, 코드 블록은 구문 강조(syntax highlighting)를 적용합니다. 입력할 때마다 마크다운 텍스트를 토큰화하고, AST(추상 구문 트리)를 생성한 뒤 HTML로 렌더링하여 실시간 미리보기를 제공합니다.',
      en: 'The markdown preview uses a parser that converts markdown syntax to HTML. # becomes &lt;h1&gt;-&lt;h6&gt;, **text** becomes &lt;strong&gt;, and [link](url) becomes &lt;a&gt; tags. It follows the CommonMark specification and applies syntax highlighting to code blocks. On each keystroke, the tool tokenizes the markdown text, builds an AST (Abstract Syntax Tree), and renders it as HTML for a real-time preview.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/lorem-ipsum', name: 'Lorem Ipsum 생성기', desc: '더미 텍스트를 생성합니다.' },
        { id: 'dev/html-entity', name: 'HTML 엔티티 변환기', desc: 'HTML 특수문자를 변환합니다.' },
        { id: 'dev/diff-checker', name: '텍스트 비교 도구', desc: '두 텍스트의 차이를 비교합니다.' }
      ],
      en: [
        { id: 'dev/lorem-ipsum', name: 'Lorem Ipsum Generator', desc: 'Generate dummy text.' },
        { id: 'dev/html-entity', name: 'HTML Entity Converter', desc: 'Convert HTML special characters.' },
        { id: 'dev/diff-checker', name: 'Diff Checker', desc: 'Compare differences between two texts.' }
      ]
    },
    relatedBlog: { id: 'markdown-guide', ko: '마크다운 문법 완벽 가이드', en: 'Complete Guide to Markdown Syntax' }
  },
  'dev/meta-tag-generator': {
    howItWorks: {
      ko: '메타 태그 생성기는 입력한 사이트 정보를 기반으로 HTML &lt;head&gt; 섹션에 필요한 메타 태그 코드를 자동 생성합니다. 기본 SEO 태그(title, description, canonical), Open Graph 태그(og:title, og:description, og:image), Twitter Card 태그, JSON-LD 구조화 데이터를 포함합니다. 각 태그의 유효성을 검증하고 권장 길이(title 60자, description 155자)를 확인하여 검색 엔진 최적화에 적합한 코드를 생성합니다.',
      en: 'The meta tag generator automatically creates HTML &lt;head&gt; meta tag code based on your site information. It includes basic SEO tags (title, description, canonical), Open Graph tags (og:title, og:description, og:image), Twitter Card tags, and JSON-LD structured data. It validates each tag and checks recommended lengths (title 60 chars, description 155 chars) to produce search engine optimized code.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/og-preview', name: 'OG 미리보기', desc: 'Open Graph 태그가 소셜 미디어에서 어떻게 보이는지 확인합니다.' },
        { id: 'dev/robots-txt', name: 'robots.txt 생성기', desc: '검색 엔진 크롤러를 위한 robots.txt를 생성합니다.' },
        { id: 'dev/utm-generator', name: 'UTM 생성기', desc: '마케팅 캠페인 추적 URL을 생성합니다.' }
      ],
      en: [
        { id: 'dev/og-preview', name: 'OG Preview', desc: 'Preview how Open Graph tags appear on social media.' },
        { id: 'dev/robots-txt', name: 'robots.txt Generator', desc: 'Generate robots.txt for search engine crawlers.' },
        { id: 'dev/utm-generator', name: 'UTM Generator', desc: 'Create marketing campaign tracking URLs.' }
      ]
    },
    relatedBlog: { id: 'og-tag-guide', ko: 'Open Graph 태그 완벽 가이드', en: 'Complete Guide to Open Graph Tags' }
  },
  'dev/og-preview': {
    howItWorks: {
      ko: 'OG 미리보기는 입력된 URL에서 Open Graph 메타 태그를 파싱하거나, 수동으로 입력한 정보를 기반으로 소셜 미디어 공유 카드를 시뮬레이션합니다. og:title, og:description, og:image, og:url 태그 값을 읽어 Facebook, Twitter, LinkedIn 등 각 플랫폼의 공유 카드 레이아웃으로 렌더링합니다. 이미지 크기, 텍스트 잘림 등을 미리 확인하여 공유 전에 최적화할 수 있습니다.',
      en: 'The OG preview parses Open Graph meta tags from a given URL or simulates social media share cards from manually entered information. It reads og:title, og:description, og:image, and og:url tag values and renders them in the share card layouts of Facebook, Twitter, LinkedIn, and other platforms. You can preview image sizing and text truncation to optimize before sharing.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/meta-tag-generator', name: '메타 태그 생성기', desc: 'SEO 메타 태그를 자동 생성합니다.' },
        { id: 'dev/utm-generator', name: 'UTM 생성기', desc: '캠페인 추적 URL을 만듭니다.' },
        { id: 'dev/robots-txt', name: 'robots.txt 생성기', desc: '검색 엔진 크롤링을 제어합니다.' }
      ],
      en: [
        { id: 'dev/meta-tag-generator', name: 'Meta Tag Generator', desc: 'Auto-generate SEO meta tags.' },
        { id: 'dev/utm-generator', name: 'UTM Generator', desc: 'Create campaign tracking URLs.' },
        { id: 'dev/robots-txt', name: 'robots.txt Generator', desc: 'Control search engine crawling.' }
      ]
    },
    relatedBlog: { id: 'og-tag-guide', ko: 'Open Graph 태그 완벽 가이드', en: 'Complete Guide to Open Graph Tags' }
  },
  'dev/password-generator': {
    howItWorks: {
      ko: '비밀번호 생성기는 암호학적으로 안전한 난수 생성기(CSPRNG)를 사용합니다. 브라우저의 crypto.getRandomValues() API를 호출하여 예측 불가능한 난수를 생성하고, 이를 선택한 문자 집합(대/소문자, 숫자, 특수문자)에 매핑합니다. Math.random()과 달리 CSPRNG는 시드 값을 추측할 수 없어 생성된 비밀번호의 보안성이 보장됩니다. 비밀번호 강도는 문자 집합 크기와 길이의 조합인 엔트로피(비트)로 측정합니다.',
      en: 'The password generator uses a cryptographically secure pseudo-random number generator (CSPRNG). It calls the browser\'s crypto.getRandomValues() API to produce unpredictable random numbers and maps them to your chosen character set (uppercase, lowercase, digits, symbols). Unlike Math.random(), CSPRNG seeds cannot be guessed, ensuring generated password security. Password strength is measured in entropy (bits), a function of character set size and length.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/hash-generator', name: '해시 생성기', desc: '데이터의 해시 값을 생성합니다.' },
        { id: 'dev/uuid-generator', name: 'UUID 생성기', desc: '고유 식별자를 생성합니다.' },
        { id: 'dev/base64', name: 'Base64 인코더', desc: '바이너리 데이터를 텍스트로 인코딩합니다.' }
      ],
      en: [
        { id: 'dev/hash-generator', name: 'Hash Generator', desc: 'Generate hash values from data.' },
        { id: 'dev/uuid-generator', name: 'UUID Generator', desc: 'Generate unique identifiers.' },
        { id: 'dev/base64', name: 'Base64 Encoder', desc: 'Encode binary data as text.' }
      ]
    },
    relatedBlog: { id: 'password-guide', ko: '안전한 비밀번호 만들기', en: 'Password Security Guide' }
  },
  'dev/regex-tester': {
    howItWorks: {
      ko: '정규표현식 테스터는 JavaScript의 RegExp 엔진을 사용하여 패턴을 컴파일하고 실행합니다. 입력된 패턴 문자열을 RegExp 객체로 변환하고, 플래그(g, i, m, s 등)를 적용한 뒤 테스트 문자열에 대해 match/exec를 수행합니다. 매칭된 부분을 하이라이트하고, 캡처 그룹의 인덱스와 값을 표시합니다. 패턴 구문 오류가 있으면 실시간으로 에러 메시지를 보여줍니다.',
      en: 'The regex tester uses JavaScript\'s RegExp engine to compile and execute patterns. It converts the input pattern string into a RegExp object, applies flags (g, i, m, s, etc.), and performs match/exec against the test string. Matched portions are highlighted, and capture group indices and values are displayed. Syntax errors in the pattern trigger real-time error messages.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/text-escape', name: '텍스트 이스케이프', desc: '특수문자를 이스케이프합니다.' },
        { id: 'dev/diff-checker', name: '텍스트 비교 도구', desc: '텍스트 차이를 비교합니다.' },
        { id: 'dev/case-converter', name: '대소문자 변환기', desc: '텍스트 케이스를 변환합니다.' }
      ],
      en: [
        { id: 'dev/text-escape', name: 'Text Escape', desc: 'Escape special characters.' },
        { id: 'dev/diff-checker', name: 'Diff Checker', desc: 'Compare text differences.' },
        { id: 'dev/case-converter', name: 'Case Converter', desc: 'Convert text case formats.' }
      ]
    },
    relatedBlog: { id: 'regex-tutorial', ko: '정규표현식 입문 가이드', en: "Beginner's Guide to Regular Expressions" }
  },
  'dev/robots-txt': {
    howItWorks: {
      ko: 'robots.txt 생성기는 Robots Exclusion Protocol 표준에 따라 크롤러 지시문을 작성합니다. User-agent로 대상 크롤러를 지정하고, Allow/Disallow로 접근 허용/차단 경로를 설정합니다. Sitemap 위치도 지정할 수 있습니다. 이 도구는 시각적 UI로 규칙을 추가하고, 표준 형식의 텍스트 파일을 생성합니다. 와일드카드(*)와 경로 패턴을 지원하여 세밀한 크롤링 제어가 가능합니다.',
      en: 'The robots.txt generator creates crawler directives following the Robots Exclusion Protocol standard. User-agent specifies the target crawler, while Allow/Disallow sets accessible/blocked paths. Sitemap locations can also be defined. This tool provides a visual UI for adding rules and generates a standards-compliant text file. Wildcards (*) and path patterns enable fine-grained crawling control.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/meta-tag-generator', name: '메타 태그 생성기', desc: 'SEO 메타 태그를 생성합니다.' },
        { id: 'dev/og-preview', name: 'OG 미리보기', desc: 'Open Graph 미리보기를 확인합니다.' },
        { id: 'dev/utm-generator', name: 'UTM 생성기', desc: '캠페인 추적 URL을 만듭니다.' }
      ],
      en: [
        { id: 'dev/meta-tag-generator', name: 'Meta Tag Generator', desc: 'Generate SEO meta tags.' },
        { id: 'dev/og-preview', name: 'OG Preview', desc: 'Preview Open Graph tags.' },
        { id: 'dev/utm-generator', name: 'UTM Generator', desc: 'Create campaign tracking URLs.' }
      ]
    }
  },
  'dev/sql-formatter': {
    howItWorks: {
      ko: 'SQL 포맷터는 SQL 구문을 렉싱(토큰화)한 후 AST(추상 구문 트리)를 기반으로 들여쓰기와 줄바꿈을 적용합니다. SELECT, FROM, WHERE, JOIN 같은 주요 키워드를 새 줄에 배치하고, 서브쿼리는 추가 들여쓰기를 적용합니다. CASE 문, 함수 호출, 괄호 표현식 등의 중첩 구조도 계층적으로 정렬합니다. 여러 SQL 방언(MySQL, PostgreSQL, Oracle 등)의 키워드를 지원합니다.',
      en: 'The SQL formatter lexes (tokenizes) SQL syntax and applies indentation and line breaks based on an AST (Abstract Syntax Tree). Major keywords like SELECT, FROM, WHERE, and JOIN are placed on new lines, with subqueries receiving additional indentation. Nested structures such as CASE statements, function calls, and parenthesized expressions are arranged hierarchically. It supports keywords from multiple SQL dialects (MySQL, PostgreSQL, Oracle, etc.).'
    },
    relatedTools: {
      ko: [
        { id: 'dev/json-formatter', name: 'JSON 포맷터', desc: 'JSON 데이터를 보기 좋게 정렬합니다.' },
        { id: 'dev/diff-checker', name: '텍스트 비교 도구', desc: '포맷 전후를 비교합니다.' },
        { id: 'dev/css-minifier', name: 'CSS 압축기', desc: 'CSS 코드를 최소화합니다.' }
      ],
      en: [
        { id: 'dev/json-formatter', name: 'JSON Formatter', desc: 'Pretty-print JSON data.' },
        { id: 'dev/diff-checker', name: 'Diff Checker', desc: 'Compare before and after formatting.' },
        { id: 'dev/css-minifier', name: 'CSS Minifier', desc: 'Minimize CSS code.' }
      ]
    }
  },
  'dev/text-escape': {
    howItWorks: {
      ko: '텍스트 이스케이프 도구는 대상 컨텍스트에 따라 다른 이스케이프 규칙을 적용합니다. HTML에서는 <, >, &, " 등을 엔티티로 변환하고, JSON에서는 ", \\, 제어문자를 백슬래시 시퀀스로 변환합니다. URL에서는 예약 문자를 %XX 형태의 퍼센트 인코딩으로 변환합니다. 각 문자를 순회하며 해당 컨텍스트의 이스케이프 테이블과 대조하여 치환하는 방식으로 동작합니다.',
      en: 'The text escape tool applies different escaping rules depending on the target context. For HTML, it converts <, >, &, " to entities. For JSON, it converts ", \\, and control characters to backslash sequences. For URLs, it converts reserved characters to %XX percent-encoding. It works by iterating through each character and matching against the escape table for the selected context.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/html-entity', name: 'HTML 엔티티 변환기', desc: 'HTML 특수문자를 엔티티로 변환합니다.' },
        { id: 'dev/url-encoder', name: 'URL 인코더', desc: 'URL을 인코딩/디코딩합니다.' },
        { id: 'dev/base64', name: 'Base64 인코더', desc: '데이터를 Base64로 인코딩합니다.' }
      ],
      en: [
        { id: 'dev/html-entity', name: 'HTML Entity Converter', desc: 'Convert special characters to HTML entities.' },
        { id: 'dev/url-encoder', name: 'URL Encoder', desc: 'Encode/decode URLs.' },
        { id: 'dev/base64', name: 'Base64 Encoder', desc: 'Encode data as Base64.' }
      ]
    }
  },
  'dev/timestamp-converter': {
    howItWorks: {
      ko: '타임스탬프 변환기는 Unix 에포크(1970년 1월 1일 00:00:00 UTC)부터 경과한 초(또는 밀리초)를 사람이 읽을 수 있는 날짜/시간으로 변환합니다. JavaScript의 Date 객체를 사용하여 타임스탬프를 파싱하고, 사용자의 로컬 시간대 또는 지정된 시간대로 포맷합니다. 반대로 날짜/시간을 입력하면 getTime() 메서드로 밀리초 단위 타임스탬프를 계산합니다.',
      en: 'The timestamp converter translates seconds (or milliseconds) elapsed since the Unix epoch (January 1, 1970 00:00:00 UTC) into human-readable dates. It uses JavaScript\'s Date object to parse timestamps and format them in the user\'s local timezone or a specified timezone. Conversely, entering a date/time calculates the millisecond timestamp via the getTime() method.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/cron-generator', name: 'Cron 표현식 생성기', desc: '스케줄 표현식을 생성합니다.' },
        { id: 'dev/uuid-generator', name: 'UUID 생성기', desc: '고유 식별자를 생성합니다.' },
        { id: 'dev/json-formatter', name: 'JSON 포맷터', desc: 'JSON 데이터를 정렬합니다.' }
      ],
      en: [
        { id: 'dev/cron-generator', name: 'Cron Expression Generator', desc: 'Generate schedule expressions.' },
        { id: 'dev/uuid-generator', name: 'UUID Generator', desc: 'Generate unique identifiers.' },
        { id: 'dev/json-formatter', name: 'JSON Formatter', desc: 'Format JSON data.' }
      ]
    }
  },
  'dev/url-encoder': {
    howItWorks: {
      ko: 'URL 인코딩(퍼센트 인코딩)은 RFC 3986에 정의된 규칙을 따릅니다. URL에서 허용되지 않는 문자를 %와 16진수 값 두 자리로 변환합니다. 예를 들어 공백은 %20, 한글 "가"는 UTF-8로 0xEA 0xB0 0x80이므로 %EA%B0%80이 됩니다. 영문 알파벳, 숫자, 그리고 -, _, ., ~ 4개의 비예약 문자는 변환하지 않습니다. encodeURIComponent()는 경로 구분자(/)도 인코딩하지만 encodeURI()는 보존합니다.',
      en: 'URL encoding (percent-encoding) follows rules defined in RFC 3986. Characters not allowed in URLs are converted to % followed by two hexadecimal digits. For example, a space becomes %20. Letters, digits, and four unreserved characters (-, _, ., ~) remain unchanged. encodeURIComponent() encodes path separators (/) while encodeURI() preserves them, serving different use cases for full URLs vs. query parameters.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/base64', name: 'Base64 인코더', desc: '바이너리 데이터를 텍스트로 인코딩합니다.' },
        { id: 'dev/text-escape', name: '텍스트 이스케이프', desc: '다양한 컨텍스트의 이스케이프 처리.' },
        { id: 'dev/html-entity', name: 'HTML 엔티티 변환기', desc: 'HTML 특수문자를 변환합니다.' }
      ],
      en: [
        { id: 'dev/base64', name: 'Base64 Encoder', desc: 'Encode binary data as text.' },
        { id: 'dev/text-escape', name: 'Text Escape', desc: 'Escape for various contexts.' },
        { id: 'dev/html-entity', name: 'HTML Entity Converter', desc: 'Convert HTML special characters.' }
      ]
    },
    relatedBlog: { id: 'url-encoding-guide', ko: 'URL 인코딩 완벽 가이드', en: 'Complete Guide to URL Encoding' }
  },
  'dev/utm-generator': {
    howItWorks: {
      ko: 'UTM 생성기는 URL에 Google Analytics 추적 파라미터를 추가합니다. utm_source(트래픽 출처), utm_medium(매체), utm_campaign(캠페인명), utm_term(키워드), utm_content(콘텐츠 구분)을 URL의 쿼리 스트링에 추가합니다. 이 파라미터들은 Google Analytics에서 자동으로 파싱되어 트래픽 소스별 성과를 분석할 수 있게 합니다. 특수문자는 URL 인코딩 처리됩니다.',
      en: 'The UTM generator appends Google Analytics tracking parameters to URLs. It adds utm_source (traffic source), utm_medium (medium), utm_campaign (campaign name), utm_term (keyword), and utm_content (content variant) to the URL query string. These parameters are automatically parsed by Google Analytics to analyze performance by traffic source. Special characters are URL-encoded.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/url-encoder', name: 'URL 인코더', desc: 'URL을 인코딩/디코딩합니다.' },
        { id: 'dev/meta-tag-generator', name: '메타 태그 생성기', desc: 'SEO 메타 태그를 생성합니다.' },
        { id: 'dev/og-preview', name: 'OG 미리보기', desc: 'Open Graph 미리보기를 확인합니다.' }
      ],
      en: [
        { id: 'dev/url-encoder', name: 'URL Encoder', desc: 'Encode/decode URLs.' },
        { id: 'dev/meta-tag-generator', name: 'Meta Tag Generator', desc: 'Generate SEO meta tags.' },
        { id: 'dev/og-preview', name: 'OG Preview', desc: 'Preview Open Graph tags.' }
      ]
    }
  },
  'dev/uuid-generator': {
    howItWorks: {
      ko: 'UUID(Universally Unique Identifier)는 128비트 값으로, 중앙 서버 없이도 전역적으로 고유한 식별자를 생성합니다. v4 UUID는 crypto.getRandomValues()로 122비트의 무작위 값을 생성하고, 4비트는 버전(0100), 2비트는 변형(10)으로 고정합니다. 형식은 8-4-4-4-12의 16진수 문자열(예: 550e8400-e29b-41d4-a716-446655440000)입니다. 충돌 확률은 천문학적으로 낮아 실질적으로 고유성이 보장됩니다.',
      en: 'UUID (Universally Unique Identifier) is a 128-bit value that generates globally unique identifiers without a central server. A v4 UUID uses crypto.getRandomValues() to produce 122 bits of randomness, with 4 bits fixed as the version (0100) and 2 bits as the variant (10). The format is 8-4-4-4-12 hexadecimal characters (e.g., 550e8400-e29b-41d4-a716-446655440000). Collision probability is astronomically low, practically guaranteeing uniqueness.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/password-generator', name: '비밀번호 생성기', desc: '안전한 비밀번호를 생성합니다.' },
        { id: 'dev/hash-generator', name: '해시 생성기', desc: '데이터의 해시 값을 생성합니다.' },
        { id: 'dev/timestamp-converter', name: '타임스탬프 변환기', desc: 'Unix 타임스탬프를 변환합니다.' }
      ],
      en: [
        { id: 'dev/password-generator', name: 'Password Generator', desc: 'Generate secure passwords.' },
        { id: 'dev/hash-generator', name: 'Hash Generator', desc: 'Generate hash values from data.' },
        { id: 'dev/timestamp-converter', name: 'Timestamp Converter', desc: 'Convert Unix timestamps.' }
      ]
    }
  },
  'dev/xml-json': {
    howItWorks: {
      ko: 'XML-JSON 변환은 두 데이터 형식 간의 구조적 매핑입니다. XML 요소는 JSON 객체로, 속성은 특수 키(@attr)로, 텍스트 콘텐츠는 #text 키로 변환됩니다. 같은 이름의 형제 요소는 JSON 배열로 그룹화됩니다. 반대 방향에서는 JSON 객체를 XML 요소로, 배열을 반복 요소로, 원시값을 텍스트 노드로 변환합니다. 네임스페이스, CDATA, 주석 등 XML 고유 기능도 처리합니다.',
      en: 'XML-JSON conversion is a structural mapping between two data formats. XML elements become JSON objects, attributes become special keys (@attr), and text content becomes #text keys. Sibling elements with the same name are grouped into JSON arrays. In reverse, JSON objects become XML elements, arrays become repeating elements, and primitives become text nodes. XML-specific features like namespaces, CDATA, and comments are also handled.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/json-formatter', name: 'JSON 포맷터', desc: 'JSON 데이터를 보기 좋게 정렬합니다.' },
        { id: 'dev/yaml-json', name: 'YAML-JSON 변환기', desc: 'YAML과 JSON 간 변환합니다.' },
        { id: 'dev/json-csv', name: 'JSON-CSV 변환기', desc: 'JSON과 CSV 간 변환합니다.' }
      ],
      en: [
        { id: 'dev/json-formatter', name: 'JSON Formatter', desc: 'Pretty-print JSON data.' },
        { id: 'dev/yaml-json', name: 'YAML-JSON Converter', desc: 'Convert between YAML and JSON.' },
        { id: 'dev/json-csv', name: 'JSON-CSV Converter', desc: 'Convert between JSON and CSV.' }
      ]
    },
    relatedBlog: { id: 'json-yaml-xml', ko: 'JSON vs YAML vs XML 비교', en: 'JSON vs YAML vs XML Comparison' }
  },
  'dev/yaml-json': {
    howItWorks: {
      ko: 'YAML-JSON 변환은 두 직렬화 형식 간의 변환입니다. YAML의 들여쓰기 기반 구조를 파싱하여 중첩된 객체/배열로 변환하고, 이를 JSON 형식으로 직렬화합니다. YAML의 앵커(&)와 별칭(*), 멀티라인 문자열(| 또는 >), 태그(!!) 등을 처리합니다. JSON에서 YAML로 변환할 때는 중괄호와 쉼표를 들여쓰기와 줄바꿈으로 대체하여 가독성을 높입니다.',
      en: 'YAML-JSON conversion translates between two serialization formats. YAML\'s indentation-based structure is parsed into nested objects/arrays, then serialized as JSON. YAML features like anchors (&) and aliases (*), multiline strings (| or >), and tags (!!) are processed. Converting JSON to YAML replaces braces and commas with indentation and newlines for improved readability.'
    },
    relatedTools: {
      ko: [
        { id: 'dev/json-formatter', name: 'JSON 포맷터', desc: 'JSON 데이터를 보기 좋게 정렬합니다.' },
        { id: 'dev/xml-json', name: 'XML-JSON 변환기', desc: 'XML과 JSON 간 변환합니다.' },
        { id: 'dev/json-validator', name: 'JSON 유효성 검사기', desc: 'JSON 구문을 검증합니다.' }
      ],
      en: [
        { id: 'dev/json-formatter', name: 'JSON Formatter', desc: 'Pretty-print JSON data.' },
        { id: 'dev/xml-json', name: 'XML-JSON Converter', desc: 'Convert between XML and JSON.' },
        { id: 'dev/json-validator', name: 'JSON Validator', desc: 'Validate JSON syntax.' }
      ]
    },
    relatedBlog: { id: 'json-yaml-xml', ko: 'JSON vs YAML vs XML 비교', en: 'JSON vs YAML vs XML Comparison' }
  },

  // ===== PDF TOOLS =====
  'pdf/merge-pdf': {
    howItWorks: {
      ko: 'PDF 병합은 여러 PDF 파일의 페이지 트리를 하나로 결합하는 과정입니다. 각 PDF의 크로스 레퍼런스 테이블을 파싱하여 페이지 객체를 추출하고, 새로운 PDF 문서의 페이지 트리에 순서대로 삽입합니다. 북마크, 주석, 폼 필드 등의 메타데이터도 함께 병합됩니다. 브라우저의 PDF.js 라이브러리를 사용하여 모든 처리가 클라이언트에서 이루어집니다.',
      en: 'PDF merging combines page trees from multiple PDF files into one. It parses each PDF\'s cross-reference table to extract page objects, then inserts them sequentially into a new PDF document\'s page tree. Metadata like bookmarks, annotations, and form fields are also merged. All processing occurs client-side using the PDF.js library in your browser.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/split-pdf', name: 'PDF 분할', desc: 'PDF를 여러 파일로 나눕니다.' },
        { id: 'pdf/reorder-pdf', name: 'PDF 페이지 재정렬', desc: '페이지 순서를 변경합니다.' },
        { id: 'pdf/compress-pdf', name: 'PDF 압축', desc: 'PDF 파일 크기를 줄입니다.' }
      ],
      en: [
        { id: 'pdf/split-pdf', name: 'Split PDF', desc: 'Split PDF into multiple files.' },
        { id: 'pdf/reorder-pdf', name: 'Reorder PDF', desc: 'Change page order.' },
        { id: 'pdf/compress-pdf', name: 'Compress PDF', desc: 'Reduce PDF file size.' }
      ]
    },
    relatedBlog: { id: 'pdf-merge-guide', ko: 'PDF 합치기 완벽 가이드', en: 'PDF Merge Guide' }
  },
  'pdf/split-pdf': {
    howItWorks: {
      ko: 'PDF 분할은 원본 PDF의 페이지 트리에서 지정된 범위의 페이지 객체만 추출하여 새 PDF로 재구성합니다. 사용자가 선택한 페이지 번호나 범위(예: 1-3, 5, 7-10)에 따라 해당 페이지의 콘텐츠 스트림, 리소스, 주석을 복사합니다. 각 분할된 파일은 독립적인 PDF 구조(헤더, 크로스 레퍼런스 테이블, 트레일러)를 갖춥니다.',
      en: 'PDF splitting extracts specified page objects from the original PDF\'s page tree and reconstructs them as new PDFs. Based on user-selected page numbers or ranges (e.g., 1-3, 5, 7-10), it copies each page\'s content streams, resources, and annotations. Each split file has its own complete PDF structure (header, cross-reference table, trailer).'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: '여러 PDF를 하나로 합칩니다.' },
        { id: 'pdf/delete-pdf', name: 'PDF 페이지 삭제', desc: '불필요한 페이지를 제거합니다.' },
        { id: 'pdf/reorder-pdf', name: 'PDF 페이지 재정렬', desc: '페이지 순서를 변경합니다.' }
      ],
      en: [
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into one.' },
        { id: 'pdf/delete-pdf', name: 'Delete PDF Pages', desc: 'Remove unnecessary pages.' },
        { id: 'pdf/reorder-pdf', name: 'Reorder PDF', desc: 'Change page order.' }
      ]
    },
    relatedBlog: { id: 'pdf-management-tips', ko: 'PDF 파일 관리 완벽 가이드', en: 'Complete PDF Management Guide' }
  },
  'pdf/compress-pdf': {
    howItWorks: {
      ko: 'PDF 압축은 여러 최적화 기법을 적용합니다. 이미지를 재압축(JPEG 품질 조절, 해상도 다운샘플링)하고, 중복 리소스(폰트, 이미지)를 통합하며, 사용하지 않는 객체를 제거합니다. 콘텐츠 스트림에 Flate(zlib) 압축을 적용하고, 메타데이터를 정리합니다. 이미지가 많은 PDF에서 가장 큰 효과를 보며, 품질과 크기 간의 균형을 조절할 수 있습니다.',
      en: 'PDF compression applies multiple optimization techniques. It recompresses images (adjusting JPEG quality, downsampling resolution), consolidates duplicate resources (fonts, images), and removes unused objects. Flate (zlib) compression is applied to content streams and metadata is cleaned up. The greatest effect is seen in image-heavy PDFs, with adjustable quality-size balance.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: 'PDF를 합친 후 압축하세요.' },
        { id: 'pdf/image-to-pdf', name: '이미지를 PDF로', desc: '이미지를 PDF로 변환합니다.' },
        { id: 'pdf/watermark-pdf', name: 'PDF 워터마크', desc: 'PDF에 워터마크를 추가합니다.' }
      ],
      en: [
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Merge then compress your PDFs.' },
        { id: 'pdf/image-to-pdf', name: 'Image to PDF', desc: 'Convert images to PDF.' },
        { id: 'pdf/watermark-pdf', name: 'PDF Watermark', desc: 'Add watermarks to PDFs.' }
      ]
    },
    relatedBlog: { id: 'pdf-management-tips', ko: 'PDF 파일 관리 완벽 가이드', en: 'Complete PDF Management Guide' }
  },
  'pdf/rotate-pdf': {
    howItWorks: {
      ko: 'PDF 회전은 페이지 사전(Page Dictionary)의 /Rotate 속성을 수정하여 구현합니다. 이 값은 0, 90, 180, 270도 중 하나로 설정되며, PDF 뷰어가 해당 각도로 페이지를 렌더링합니다. 실제 콘텐츠 스트림은 변경하지 않고 메타데이터만 수정하므로 품질 손실이 없습니다. 스캔한 문서의 방향을 바로잡거나 가로/세로 전환에 유용합니다.',
      en: 'PDF rotation modifies the /Rotate property in the Page Dictionary. This value is set to 0, 90, 180, or 270 degrees, and the PDF viewer renders the page at that angle. Since only metadata is modified without changing the actual content stream, there is no quality loss. Useful for correcting scanned document orientation or switching between landscape and portrait.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/reorder-pdf', name: 'PDF 페이지 재정렬', desc: '페이지 순서를 변경합니다.' },
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: 'PDF를 하나로 합칩니다.' },
        { id: 'pdf/pdf-to-image', name: 'PDF를 이미지로', desc: 'PDF를 이미지로 변환합니다.' }
      ],
      en: [
        { id: 'pdf/reorder-pdf', name: 'Reorder PDF', desc: 'Change page order.' },
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs into one.' },
        { id: 'pdf/pdf-to-image', name: 'PDF to Image', desc: 'Convert PDF to images.' }
      ]
    }
  },
  'pdf/delete-pdf': {
    howItWorks: {
      ko: 'PDF 페이지 삭제는 문서의 페이지 트리에서 선택한 페이지 객체를 제거하고, 남은 페이지들의 참조를 재구성합니다. 페이지 번호가 재정렬되고 크로스 레퍼런스 테이블이 업데이트됩니다. 삭제된 페이지의 리소스(이미지, 폰트 등)가 다른 페이지에서 참조되지 않으면 함께 제거되어 파일 크기가 줄어듭니다.',
      en: 'PDF page deletion removes selected page objects from the document\'s page tree and reconstructs references for remaining pages. Page numbers are reindexed and the cross-reference table is updated. Resources (images, fonts) from deleted pages are also removed if not referenced by other pages, reducing file size.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/split-pdf', name: 'PDF 분할', desc: 'PDF를 여러 파일로 나눕니다.' },
        { id: 'pdf/reorder-pdf', name: 'PDF 페이지 재정렬', desc: '페이지 순서를 변경합니다.' },
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: 'PDF를 하나로 합칩니다.' }
      ],
      en: [
        { id: 'pdf/split-pdf', name: 'Split PDF', desc: 'Split PDF into multiple files.' },
        { id: 'pdf/reorder-pdf', name: 'Reorder PDF', desc: 'Change page order.' },
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs into one.' }
      ]
    }
  },
  'pdf/reorder-pdf': {
    howItWorks: {
      ko: 'PDF 페이지 재정렬은 페이지 트리의 Kids 배열에서 페이지 참조의 순서를 변경합니다. 드래그 앤 드롭으로 원하는 순서를 지정하면, 내부적으로 페이지 객체의 인덱스가 재배열되고 페이지 번호가 갱신됩니다. 각 페이지의 콘텐츠와 리소스는 그대로 유지되므로 품질 변화 없이 구조만 변경됩니다.',
      en: 'PDF page reordering changes the sequence of page references in the page tree\'s Kids array. After specifying the desired order via drag-and-drop, page object indices are rearranged and page numbers updated internally. Each page\'s content and resources remain intact, so only the structure changes without quality loss.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/delete-pdf', name: 'PDF 페이지 삭제', desc: '불필요한 페이지를 제거합니다.' },
        { id: 'pdf/rotate-pdf', name: 'PDF 회전', desc: '페이지를 회전합니다.' },
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: 'PDF를 하나로 합칩니다.' }
      ],
      en: [
        { id: 'pdf/delete-pdf', name: 'Delete PDF Pages', desc: 'Remove unnecessary pages.' },
        { id: 'pdf/rotate-pdf', name: 'Rotate PDF', desc: 'Rotate pages.' },
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs into one.' }
      ]
    }
  },
  'pdf/watermark-pdf': {
    howItWorks: {
      ko: 'PDF 워터마크는 각 페이지의 콘텐츠 스트림 위에 텍스트나 이미지 레이어를 추가합니다. 텍스트 워터마크는 PDF 그래픽 연산자를 사용하여 지정된 폰트, 크기, 색상, 투명도, 회전 각도로 렌더링됩니다. 이미지 워터마크는 XObject로 삽입됩니다. 워터마크 레이어의 z-order를 조절하여 콘텐츠 앞(전경) 또는 뒤(배경)에 배치할 수 있습니다.',
      en: 'PDF watermarking adds a text or image layer on top of each page\'s content stream. Text watermarks are rendered using PDF graphic operators with specified font, size, color, opacity, and rotation angle. Image watermarks are inserted as XObjects. The watermark layer\'s z-order can be adjusted to place it in front of (foreground) or behind (background) the content.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/compress-pdf', name: 'PDF 압축', desc: '워터마크 추가 후 압축하세요.' },
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: 'PDF를 하나로 합칩니다.' },
        { id: 'pdf/image-to-pdf', name: '이미지를 PDF로', desc: '이미지를 PDF로 변환합니다.' }
      ],
      en: [
        { id: 'pdf/compress-pdf', name: 'Compress PDF', desc: 'Compress after adding watermarks.' },
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs into one.' },
        { id: 'pdf/image-to-pdf', name: 'Image to PDF', desc: 'Convert images to PDF.' }
      ]
    }
  },
  'pdf/image-to-pdf': {
    howItWorks: {
      ko: '이미지-PDF 변환은 이미지 파일(JPG, PNG, WebP 등)을 PDF 페이지에 삽입하는 과정입니다. 각 이미지의 크기와 해상도를 읽어 적절한 PDF 페이지 크기를 결정하고, 이미지를 XObject 스트림으로 인코딩하여 페이지의 콘텐츠 스트림에서 참조합니다. 여러 이미지를 하나의 PDF로 결합할 때 각각 별도 페이지로 배치합니다.',
      en: 'Image-to-PDF conversion inserts image files (JPG, PNG, WebP, etc.) into PDF pages. It reads each image\'s dimensions and resolution to determine appropriate PDF page sizes, encodes images as XObject streams, and references them from page content streams. When combining multiple images into one PDF, each is placed on a separate page.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/pdf-to-image', name: 'PDF를 이미지로', desc: 'PDF를 이미지로 변환합니다.' },
        { id: 'pdf/merge-pdf', name: 'PDF 병합', desc: '변환된 PDF를 합칩니다.' },
        { id: 'pdf/compress-pdf', name: 'PDF 압축', desc: 'PDF 크기를 줄입니다.' }
      ],
      en: [
        { id: 'pdf/pdf-to-image', name: 'PDF to Image', desc: 'Convert PDF to images.' },
        { id: 'pdf/merge-pdf', name: 'Merge PDF', desc: 'Merge converted PDFs.' },
        { id: 'pdf/compress-pdf', name: 'Compress PDF', desc: 'Reduce PDF file size.' }
      ]
    },
    relatedBlog: { id: 'image-format-guide', ko: '이미지 포맷 비교: JPG vs PNG vs WebP', en: 'Image Format Comparison: JPG vs PNG vs WebP' }
  },
  'pdf/pdf-to-image': {
    howItWorks: {
      ko: 'PDF-이미지 변환은 PDF 페이지를 캔버스에 렌더링한 후 이미지로 내보내는 과정입니다. PDF.js가 각 페이지의 콘텐츠 스트림을 파싱하여 Canvas API로 렌더링하고, canvas.toBlob()으로 PNG 또는 JPEG 형식으로 변환합니다. 출력 해상도(DPI)를 조절하여 이미지 품질과 파일 크기를 제어할 수 있습니다.',
      en: 'PDF-to-image conversion renders PDF pages onto a canvas and exports them as images. PDF.js parses each page\'s content stream, renders it via the Canvas API, and converts it to PNG or JPEG format using canvas.toBlob(). Output resolution (DPI) can be adjusted to control image quality and file size.'
    },
    relatedTools: {
      ko: [
        { id: 'pdf/image-to-pdf', name: '이미지를 PDF로', desc: '이미지를 PDF로 변환합니다.' },
        { id: 'pdf/compress-pdf', name: 'PDF 압축', desc: 'PDF 크기를 줄입니다.' },
        { id: 'pdf/split-pdf', name: 'PDF 분할', desc: '특정 페이지만 추출합니다.' }
      ],
      en: [
        { id: 'pdf/image-to-pdf', name: 'Image to PDF', desc: 'Convert images to PDF.' },
        { id: 'pdf/compress-pdf', name: 'Compress PDF', desc: 'Reduce PDF file size.' },
        { id: 'pdf/split-pdf', name: 'Split PDF', desc: 'Extract specific pages.' }
      ]
    }
  },

  // ===== GAME TOOLS =====
  'game/2048': {
    howItWorks: {
      ko: '2048는 4x4 격자에서 같은 숫자의 타일을 합치는 슬라이딩 퍼즐 게임입니다. 방향키로 모든 타일을 한 방향으로 밀면 같은 숫자가 맞닿는 타일이 합쳐져 두 배가 됩니다. 이동할 때마다 빈 칸에 2 또는 4 타일이 무작위로 생성됩니다. 2048 타일을 만들면 승리하지만, 더 높은 점수를 위해 계속 플레이할 수 있습니다. 더 이상 이동할 수 없으면 게임이 종료됩니다.',
      en: '2048 is a sliding puzzle game on a 4x4 grid where you merge tiles with the same number. Arrow keys push all tiles in one direction, and matching adjacent tiles combine to double their value. After each move, a 2 or 4 tile spawns randomly in an empty cell. Creating a 2048 tile wins the game, but you can continue for higher scores. The game ends when no moves remain.'
    },
    relatedTools: {
      ko: [
        { id: 'game/tetris', name: '테트리스', desc: '클래식 블록 퍼즐 게임.' },
        { id: 'game/minesweeper', name: '지뢰찾기', desc: '논리적 추론 퍼즐 게임.' },
        { id: 'game/memory-game', name: '메모리 게임', desc: '카드 짝 맞추기 게임.' }
      ],
      en: [
        { id: 'game/tetris', name: 'Tetris', desc: 'Classic block puzzle game.' },
        { id: 'game/minesweeper', name: 'Minesweeper', desc: 'Logic-based puzzle game.' },
        { id: 'game/memory-game', name: 'Memory Game', desc: 'Card matching game.' }
      ]
    }
  },
  'game/minesweeper': {
    howItWorks: {
      ko: '지뢰찾기는 숨겨진 지뢰의 위치를 논리적으로 추론하는 퍼즐 게임입니다. 격자의 각 칸을 클릭하면 주변 8칸에 있는 지뢰의 수가 표시됩니다. 숫자가 0이면 주변에 지뢰가 없으므로 인접 칸이 자동으로 열립니다. 숫자 단서를 조합하여 지뢰 위치를 확정하고 깃발을 꽂습니다. 지뢰가 아닌 모든 칸을 열면 승리합니다.',
      en: 'Minesweeper is a puzzle game where you logically deduce hidden mine locations. Clicking a cell reveals the number of mines in the surrounding 8 cells. A zero means no adjacent mines, so neighboring cells open automatically. By combining number clues, you can determine mine locations and flag them. Opening all non-mine cells wins the game.'
    },
    relatedTools: {
      ko: [
        { id: 'game/2048', name: '2048', desc: '숫자 합치기 퍼즐 게임.' },
        { id: 'game/memory-game', name: '메모리 게임', desc: '기억력 훈련 게임.' },
        { id: 'game/tetris', name: '테트리스', desc: '블록 퍼즐 게임.' }
      ],
      en: [
        { id: 'game/2048', name: '2048', desc: 'Number merging puzzle game.' },
        { id: 'game/memory-game', name: 'Memory Game', desc: 'Memory training game.' },
        { id: 'game/tetris', name: 'Tetris', desc: 'Block puzzle game.' }
      ]
    }
  },
  'game/snake': {
    howItWorks: {
      ko: '스네이크 게임은 방향키로 뱀을 조작하여 먹이를 먹는 아케이드 게임입니다. 뱀이 먹이를 먹으면 길이가 한 칸 늘어나고 점수가 올라갑니다. 게임 루프는 requestAnimationFrame으로 실행되며, 매 틱마다 뱀의 머리 위치를 이동 방향으로 갱신하고 몸체 세그먼트를 따라오게 합니다. 벽이나 자기 몸에 부딪히면 게임이 종료됩니다.',
      en: 'Snake is an arcade game where you guide a snake with arrow keys to eat food. Each food item increases the snake\'s length by one segment and adds to the score. The game loop runs via requestAnimationFrame, updating the head position each tick and having body segments follow. Hitting a wall or the snake\'s own body ends the game.'
    },
    relatedTools: {
      ko: [
        { id: 'game/tetris', name: '테트리스', desc: '클래식 아케이드 게임.' },
        { id: 'game/2048', name: '2048', desc: '퍼즐 게임.' },
        { id: 'game/memory-game', name: '메모리 게임', desc: '기억력 게임.' }
      ],
      en: [
        { id: 'game/tetris', name: 'Tetris', desc: 'Classic arcade game.' },
        { id: 'game/2048', name: '2048', desc: 'Puzzle game.' },
        { id: 'game/memory-game', name: 'Memory Game', desc: 'Memory game.' }
      ]
    }
  },
  'game/memory-game': {
    howItWorks: {
      ko: '메모리 게임은 뒤집힌 카드들 중 같은 그림의 짝을 찾는 게임입니다. 카드 배열은 Fisher-Yates 셔플 알고리즘으로 무작위 배치됩니다. 한 번에 두 장을 뒤집어 같은 그림이면 열린 상태로 유지하고, 다르면 다시 뒤집힙니다. 시도 횟수와 시간을 기록하여 기억력과 집중력을 측정합니다. 모든 짝을 찾으면 게임이 완료됩니다.',
      en: 'The memory game challenges you to find matching pairs among face-down cards. Card placement is randomized using the Fisher-Yates shuffle algorithm. Flip two cards at a time; matching pairs stay face-up, while mismatches flip back. Attempts and time are tracked to measure memory and concentration. Finding all pairs completes the game.'
    },
    relatedTools: {
      ko: [
        { id: 'game/minesweeper', name: '지뢰찾기', desc: '논리 추론 게임.' },
        { id: 'game/2048', name: '2048', desc: '숫자 퍼즐 게임.' },
        { id: 'game/snake', name: '스네이크', desc: '아케이드 게임.' }
      ],
      en: [
        { id: 'game/minesweeper', name: 'Minesweeper', desc: 'Logic deduction game.' },
        { id: 'game/2048', name: '2048', desc: 'Number puzzle game.' },
        { id: 'game/snake', name: 'Snake', desc: 'Arcade game.' }
      ]
    }
  },
  'game/tetris': {
    howItWorks: {
      ko: '테트리스는 7가지 테트로미노(I, O, T, S, Z, J, L) 블록이 위에서 떨어지는 퍼즐 게임입니다. 블록을 좌우로 이동하고 회전하여 가로 줄을 빈틈없이 채우면 해당 줄이 사라지고 점수를 얻습니다. SRS(Super Rotation System)로 벽 근처에서도 회전이 가능하며, 레벨이 올라갈수록 낙하 속도가 빨라집니다. 블록이 쌓여 맨 위에 도달하면 게임이 종료됩니다.',
      en: 'Tetris is a puzzle game where 7 tetromino shapes (I, O, T, S, Z, J, L) fall from above. Move and rotate blocks to fill horizontal lines completely; completed lines clear and score points. SRS (Super Rotation System) enables rotation near walls, and drop speed increases with each level. The game ends when blocks stack to the top.'
    },
    relatedTools: {
      ko: [
        { id: 'game/2048', name: '2048', desc: '숫자 퍼즐 게임.' },
        { id: 'game/snake', name: '스네이크', desc: '클래식 아케이드 게임.' },
        { id: 'game/minesweeper', name: '지뢰찾기', desc: '논리 추론 게임.' }
      ],
      en: [
        { id: 'game/2048', name: '2048', desc: 'Number puzzle game.' },
        { id: 'game/snake', name: 'Snake', desc: 'Classic arcade game.' },
        { id: 'game/minesweeper', name: 'Minesweeper', desc: 'Logic deduction game.' }
      ]
    }
  }
};

// Life tools - simplified with just related tools and blog mappings
const lifeToolsSimple = {
  'life/age-calculator': { related: ['life/dday-calculator', 'life/bmi-calculator', 'life/countdown-timer'], blog: null },
  'life/ai-detector': { related: ['life/character-counter', 'life/ocr', 'life/speech-to-text'], blog: null },
  'life/ascii-unicode': { related: ['life/character-counter', 'life/fancy-text', 'life/morse-code'], blog: null },
  'life/aspect-ratio': { related: ['life/image-resizer', 'life/image-crop', 'life/image-converter'], blog: null },
  'life/background-remover': { related: ['life/image-compressor', 'life/image-converter', 'life/image-crop'], blog: 'image-compress-guide' },
  'life/barcode-generator': { related: ['life/qr-generator', 'life/qr-scanner', 'life/favicon-generator'], blog: 'qr-code-guide' },
  'life/base-converter': { related: ['life/ascii-unicode', 'life/percent-calculator', 'life/unit-converter'], blog: null },
  'life/bmi-calculator': { related: ['life/age-calculator', 'life/sleep-calculator', 'life/unit-converter'], blog: 'bmi-guide' },
  'life/character-counter': { related: ['life/ai-detector', 'life/fancy-text', 'life/ascii-unicode'], blog: null },
  'life/coin-flip': { related: ['life/dice-roller', 'life/roulette', 'life/lottery-generator'], blog: null },
  'life/color-picker': { related: ['dev/color-converter', 'dev/color-palette', 'dev/gradient-generator'], blog: 'color-theory-guide' },
  'life/compound-calculator': { related: ['life/loan-calculator', 'life/salary-calculator', 'life/percent-calculator'], blog: 'loan-interest-guide' },
  'life/countdown-timer': { related: ['life/stopwatch', 'life/pomodoro-timer', 'life/dday-calculator'], blog: null },
  'life/dday-calculator': { related: ['life/age-calculator', 'life/countdown-timer', 'life/sleep-calculator'], blog: null },
  'life/dead-pixel-test': { related: ['life/pixel-fixer', 'life/screen-burn-test', 'life/screen-color-test'], blog: null },
  'life/dice-roller': { related: ['life/coin-flip', 'life/roulette', 'life/lottery-generator'], blog: null },
  'life/emoji-picker': { related: ['life/fancy-text', 'life/character-counter', 'life/ascii-unicode'], blog: null },
  'life/exif-remover': { related: ['life/image-compressor', 'life/image-converter', 'life/background-remover'], blog: 'image-compress-guide' },
  'life/fake-chat': { related: ['life/meme-generator', 'life/fancy-text', 'life/emoji-picker'], blog: null },
  'life/fancy-text': { related: ['life/emoji-picker', 'life/character-counter', 'life/ascii-unicode'], blog: null },
  'life/favicon-generator': { related: ['life/qr-generator', 'life/image-resizer', 'life/image-converter'], blog: null },
  'life/image-blur': { related: ['life/image-compressor', 'life/image-watermark', 'life/image-crop'], blog: 'image-compress-guide' },
  'life/image-compressor': { related: ['life/image-resizer', 'life/image-converter', 'life/exif-remover'], blog: 'image-compress-guide' },
  'life/image-converter': { related: ['life/image-compressor', 'life/image-resizer', 'life/image-crop'], blog: 'image-format-guide' },
  'life/image-crop': { related: ['life/image-resizer', 'life/image-rotate', 'life/aspect-ratio'], blog: null },
  'life/image-resizer': { related: ['life/image-compressor', 'life/image-crop', 'life/aspect-ratio'], blog: 'image-compress-guide' },
  'life/image-rotate': { related: ['life/image-crop', 'life/image-resizer', 'life/image-converter'], blog: null },
  'life/image-watermark': { related: ['life/image-compressor', 'life/image-blur', 'life/meme-generator'], blog: null },
  'life/ip-lookup': { related: ['life/qr-generator', 'life/webcam-test', 'life/mic-test'], blog: 'online-privacy-guide' },
  'life/korean-name-generator': { related: ['life/lottery-generator', 'life/dice-roller', 'life/coin-flip'], blog: null },
  'life/loan-calculator': { related: ['life/compound-calculator', 'life/salary-calculator', 'life/percent-calculator'], blog: 'loan-interest-guide' },
  'life/lottery-generator': { related: ['life/coin-flip', 'life/dice-roller', 'life/roulette'], blog: null },
  'life/meme-generator': { related: ['life/fake-chat', 'life/image-watermark', 'life/fancy-text'], blog: null },
  'life/mic-test': { related: ['life/webcam-test', 'life/screen-recorder', 'life/speech-to-text'], blog: null },
  'life/morse-code': { related: ['life/ascii-unicode', 'life/character-counter', 'life/fancy-text'], blog: null },
  'life/noise-generator': { related: ['life/mic-test', 'life/pomodoro-timer', 'life/sleep-calculator'], blog: 'sleep-science-guide' },
  'life/ocr': { related: ['life/image-converter', 'life/speech-to-text', 'life/character-counter'], blog: null },
  'life/percent-calculator': { related: ['life/compound-calculator', 'life/tip-calculator', 'life/unit-converter'], blog: null },
  'life/pixel-fixer': { related: ['life/dead-pixel-test', 'life/screen-burn-test', 'life/screen-color-test'], blog: null },
  'life/pomodoro-timer': { related: ['life/countdown-timer', 'life/stopwatch', 'life/noise-generator'], blog: null },
  'life/qr-generator': { related: ['life/qr-scanner', 'life/barcode-generator', 'life/favicon-generator'], blog: 'qr-code-guide' },
  'life/qr-scanner': { related: ['life/qr-generator', 'life/barcode-generator', 'life/ocr'], blog: 'qr-code-guide' },
  'life/reaction-test': { related: ['life/typing-test', 'life/stopwatch', 'life/pomodoro-timer'], blog: null },
  'life/roulette': { related: ['life/coin-flip', 'life/dice-roller', 'life/lottery-generator'], blog: null },
  'life/salary-calculator': { related: ['life/loan-calculator', 'life/compound-calculator', 'life/percent-calculator'], blog: null },
  'life/screen-burn-test': { related: ['life/dead-pixel-test', 'life/screen-color-test', 'life/pixel-fixer'], blog: null },
  'life/screen-color-test': { related: ['life/dead-pixel-test', 'life/screen-burn-test', 'life/pixel-fixer'], blog: null },
  'life/screen-recorder': { related: ['life/webcam-test', 'life/mic-test', 'life/video-to-gif'], blog: 'screen-recorder-guide' },
  'life/sleep-calculator': { related: ['life/pomodoro-timer', 'life/noise-generator', 'life/bmi-calculator'], blog: 'sleep-science-guide' },
  'life/speech-to-text': { related: ['life/text-to-speech', 'life/ocr', 'life/character-counter'], blog: null },
  'life/stopwatch': { related: ['life/countdown-timer', 'life/pomodoro-timer', 'life/reaction-test'], blog: null },
  'life/text-to-speech': { related: ['life/speech-to-text', 'life/character-counter', 'life/ocr'], blog: null },
  'life/tip-calculator': { related: ['life/percent-calculator', 'life/salary-calculator', 'life/unit-converter'], blog: null },
  'life/typing-test': { related: ['life/reaction-test', 'life/stopwatch', 'life/character-counter'], blog: 'typing-test-guide' },
  'life/unit-converter': { related: ['life/percent-calculator', 'life/base-converter', 'life/bmi-calculator'], blog: 'unit-conversion-guide' },
  'life/video-to-gif': { related: ['life/screen-recorder', 'life/image-compressor', 'life/image-converter'], blog: 'video-gif-guide' },
  'life/webcam-test': { related: ['life/mic-test', 'life/screen-recorder', 'life/ip-lookup'], blog: null },
  'life/youtube-thumbnail': { related: ['life/image-resizer', 'life/image-compressor', 'life/image-crop'], blog: null },
};

// Life tool names for related links
const lifeToolNames = {
  'life/age-calculator': { ko: '나이 계산기', en: 'Age Calculator' },
  'life/ai-detector': { ko: 'AI 텍스트 감지기', en: 'AI Text Detector' },
  'life/ascii-unicode': { ko: 'ASCII/유니코드 변환기', en: 'ASCII/Unicode Converter' },
  'life/aspect-ratio': { ko: '화면 비율 계산기', en: 'Aspect Ratio Calculator' },
  'life/background-remover': { ko: '배경 제거', en: 'Background Remover' },
  'life/barcode-generator': { ko: '바코드 생성기', en: 'Barcode Generator' },
  'life/base-converter': { ko: '진법 변환기', en: 'Base Converter' },
  'life/bmi-calculator': { ko: 'BMI 계산기', en: 'BMI Calculator' },
  'life/character-counter': { ko: '글자수 세기', en: 'Character Counter' },
  'life/coin-flip': { ko: '동전 던지기', en: 'Coin Flip' },
  'life/color-picker': { ko: '색상 추출기', en: 'Color Picker' },
  'life/compound-calculator': { ko: '복리 계산기', en: 'Compound Calculator' },
  'life/countdown-timer': { ko: '카운트다운 타이머', en: 'Countdown Timer' },
  'life/dday-calculator': { ko: 'D-Day 계산기', en: 'D-Day Calculator' },
  'life/dead-pixel-test': { ko: '데드픽셀 테스트', en: 'Dead Pixel Test' },
  'life/dice-roller': { ko: '주사위 굴리기', en: 'Dice Roller' },
  'life/emoji-picker': { ko: '이모지 검색기', en: 'Emoji Picker' },
  'life/exif-remover': { ko: 'EXIF 제거', en: 'EXIF Remover' },
  'life/fake-chat': { ko: '가짜 채팅 생성기', en: 'Fake Chat Generator' },
  'life/fancy-text': { ko: '특수문자 생성기', en: 'Fancy Text Generator' },
  'life/favicon-generator': { ko: '파비콘 생성기', en: 'Favicon Generator' },
  'life/image-blur': { ko: '이미지 블러', en: 'Image Blur' },
  'life/image-compressor': { ko: '이미지 압축', en: 'Image Compressor' },
  'life/image-converter': { ko: '이미지 변환기', en: 'Image Converter' },
  'life/image-crop': { ko: '이미지 자르기', en: 'Image Crop' },
  'life/image-resizer': { ko: '이미지 리사이즈', en: 'Image Resizer' },
  'life/image-rotate': { ko: '이미지 회전', en: 'Image Rotate' },
  'life/image-watermark': { ko: '이미지 워터마크', en: 'Image Watermark' },
  'life/ip-lookup': { ko: 'IP 조회', en: 'IP Lookup' },
  'life/korean-name-generator': { ko: '한국 이름 생성기', en: 'Korean Name Generator' },
  'life/loan-calculator': { ko: '대출 계산기', en: 'Loan Calculator' },
  'life/lottery-generator': { ko: '로또 번호 생성기', en: 'Lottery Generator' },
  'life/meme-generator': { ko: '밈 생성기', en: 'Meme Generator' },
  'life/mic-test': { ko: '마이크 테스트', en: 'Mic Test' },
  'life/morse-code': { ko: '모스 부호 변환기', en: 'Morse Code Converter' },
  'life/noise-generator': { ko: '소음 생성기', en: 'Noise Generator' },
  'life/ocr': { ko: 'OCR 텍스트 인식', en: 'OCR Text Recognition' },
  'life/percent-calculator': { ko: '퍼센트 계산기', en: 'Percent Calculator' },
  'life/pixel-fixer': { ko: '픽셀 수리', en: 'Pixel Fixer' },
  'life/pomodoro-timer': { ko: '뽀모도로 타이머', en: 'Pomodoro Timer' },
  'life/qr-generator': { ko: 'QR코드 생성기', en: 'QR Code Generator' },
  'life/qr-scanner': { ko: 'QR코드 스캐너', en: 'QR Code Scanner' },
  'life/reaction-test': { ko: '반응 속도 테스트', en: 'Reaction Test' },
  'life/roulette': { ko: '룰렛', en: 'Roulette' },
  'life/salary-calculator': { ko: '연봉 계산기', en: 'Salary Calculator' },
  'life/screen-burn-test': { ko: '번인 테스트', en: 'Screen Burn Test' },
  'life/screen-color-test': { ko: '화면 색상 테스트', en: 'Screen Color Test' },
  'life/screen-recorder': { ko: '화면 녹화', en: 'Screen Recorder' },
  'life/sleep-calculator': { ko: '수면 계산기', en: 'Sleep Calculator' },
  'life/speech-to-text': { ko: '음성을 텍스트로', en: 'Speech to Text' },
  'life/stopwatch': { ko: '스톱워치', en: 'Stopwatch' },
  'life/text-to-speech': { ko: '텍스트를 음성으로', en: 'Text to Speech' },
  'life/tip-calculator': { ko: '팁 계산기', en: 'Tip Calculator' },
  'life/typing-test': { ko: '타이핑 테스트', en: 'Typing Test' },
  'life/unit-converter': { ko: '단위 변환기', en: 'Unit Converter' },
  'life/video-to-gif': { ko: '비디오를 GIF로', en: 'Video to GIF' },
  'life/webcam-test': { ko: '웹캠 테스트', en: 'Webcam Test' },
  'life/youtube-thumbnail': { ko: '유튜브 썸네일 다운로더', en: 'YouTube Thumbnail Downloader' },
};

// Blog post titles
const blogTitles = {
  'color-theory-guide': { ko: '웹 디자인을 위한 색상 이론 가이드', en: 'Color Theory Guide for Web Design' },
  'cron-expression-guide': { ko: 'Cron 표현식 완벽 가이드', en: 'Complete Guide to Cron Expressions' },
  'css-optimization-guide': { ko: 'CSS 최적화와 압축 가이드', en: 'CSS Optimization and Minification Guide' },
  'hash-guide': { ko: '해시 함수 완벽 가이드', en: 'Complete Guide to Hash Functions' },
  'json-yaml-xml': { ko: 'JSON vs YAML vs XML 비교', en: 'JSON vs YAML vs XML Comparison' },
  'markdown-guide': { ko: '마크다운 문법 완벽 가이드', en: 'Complete Guide to Markdown Syntax' },
  'og-tag-guide': { ko: 'Open Graph 태그 완벽 가이드', en: 'Complete Guide to Open Graph Tags' },
  'password-guide': { ko: '안전한 비밀번호 만들기', en: 'Password Security Guide' },
  'regex-tutorial': { ko: '정규표현식 입문 가이드', en: "Beginner's Guide to Regular Expressions" },
  'url-encoding-guide': { ko: 'URL 인코딩 완벽 가이드', en: 'Complete Guide to URL Encoding' },
  'bmi-guide': { ko: 'BMI 계산하는 방법', en: 'BMI Calculator Guide' },
  'image-compress-guide': { ko: '이미지 용량 줄이기 가이드', en: 'Image Compression Guide' },
  'image-format-guide': { ko: '이미지 포맷 비교: JPG vs PNG vs WebP', en: 'Image Format Comparison: JPG vs PNG vs WebP' },
  'loan-interest-guide': { ko: '대출 이자 계산 완벽 가이드', en: 'Complete Guide to Loan Interest Calculation' },
  'online-privacy-guide': { ko: '온라인 개인정보 보호 가이드', en: 'Online Privacy Protection Guide' },
  'pdf-merge-guide': { ko: 'PDF 합치기 완벽 가이드', en: 'PDF Merge Guide' },
  'pdf-management-tips': { ko: 'PDF 파일 관리 완벽 가이드', en: 'Complete PDF Management Guide' },
  'qr-code-guide': { ko: '무료 QR코드 만들기 가이드', en: 'Free QR Code Generator Guide' },
  'screen-recorder-guide': { ko: '화면 녹화 방법', en: 'Screen Recording Guide' },
  'sleep-science-guide': { ko: '수면 과학: 최적의 수면 시간 계산법', en: 'Sleep Science: How to Calculate Optimal Sleep Time' },
  'typing-test-guide': { ko: '타이핑 속도 측정 가이드', en: 'Typing Speed Test Guide' },
  'unit-conversion-guide': { ko: '단위 변환 완벽 가이드', en: 'Complete Unit Conversion Guide' },
  'video-gif-guide': { ko: '동영상을 GIF로 변환하는 방법', en: 'How to Convert Video to GIF' },
};

function generateRelatedSection(toolData, lang, blogPath) {
  let html = '';

  // Related tools
  const tools = toolData.relatedTools ? toolData.relatedTools[lang] : null;
  if (tools && tools.length > 0) {
    const heading = lang === 'ko' ? '관련 도구' : 'Related Tools';
    html += `\n          <h3 class="text-lg font-semibold mt-6 mb-3">${heading}</h3>\n`;
    html += '          <ul class="list-disc list-inside space-y-2">\n';
    for (const t of tools) {
      const href = lang === 'ko' ? `/tools/${t.id}` : `/en/tools/${t.id}`;
      html += `            <li><a href="${href}" class="text-blue-600 dark:text-blue-400 hover:underline">${t.name}</a> - ${t.desc}</li>\n`;
    }
    html += '          </ul>\n';
  }

  // Related blog
  const blog = toolData.relatedBlog;
  if (blog) {
    const heading = lang === 'ko' ? '관련 블로그 글' : 'Related Articles';
    const blogHref = lang === 'ko' ? `/blog/${blog.id}` : `/en/blog/${blog.id}`;
    const blogTitle = blog[lang];
    html += `\n          <h3 class="text-lg font-semibold mt-6 mb-3">${heading}</h3>\n`;
    html += '          <ul class="list-disc list-inside space-y-2">\n';
    html += `            <li><a href="${blogHref}" class="text-blue-600 dark:text-blue-400 hover:underline">${blogTitle}</a></li>\n`;
    html += '          </ul>\n';
  }

  return html;
}

function generateHowItWorks(toolData, lang) {
  if (!toolData.howItWorks) return '';
  const heading = lang === 'ko' ? '작동 원리' : 'How It Works';
  return `\n          <h3 class="text-lg font-semibold mt-6 mb-3">${heading}</h3>\n          <p>${toolData.howItWorks[lang]}</p>\n`;
}

function processToolFile(filePath, toolId, lang) {
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has "관련 도구" or "Related Tools"
  if (content.includes('관련 도구</h3>') || content.includes('Related Tools</h3>')) {
    console.log(`  SKIP (already enhanced): ${filePath}`);
    return false;
  }

  // Get tool data
  let toolData = toolsData[toolId];

  // For life tools, build toolData from simple mapping
  if (!toolData && lifeToolsSimple[toolId]) {
    const simple = lifeToolsSimple[toolId];
    const relatedTools = { ko: [], en: [] };
    for (const relId of simple.related) {
      const names = lifeToolNames[relId];
      if (!names) continue;
      relatedTools.ko.push({ id: relId, name: names.ko, desc: '' });
      relatedTools.en.push({ id: relId, name: names.en, desc: '' });
    }
    toolData = { relatedTools };
    if (simple.blog && blogTitles[simple.blog]) {
      toolData.relatedBlog = { id: simple.blog, ko: blogTitles[simple.blog].ko, en: blogTitles[simple.blog].en };
    }
  }

  if (!toolData) {
    console.log(`  SKIP (no data): ${toolId}`);
    return false;
  }

  // Add "How It Works" section after the intro paragraph (only for tools with howItWorks data)
  if (toolData.howItWorks) {
    const howItWorksHtml = generateHowItWorks(toolData, lang);
    const firstH3 = content.indexOf('<h3 class="text-lg font-semibold mt-6 mb-3">');
    if (firstH3 !== -1) {
      content = content.slice(0, firstH3) + howItWorksHtml.trimStart() + '\n          ' + content.slice(firstH3);
    }
  }

  // Add related sections as a NEW section before </main>
  const relatedHtml = generateRelatedSection(toolData, lang, toolId);
  if (relatedHtml) {
    // Strategy: Find </main> and insert a new section before it
    const mainCloseIdx = content.indexOf('</main>');
    if (mainCloseIdx !== -1) {
      // Find the </div> that precedes </main> (container-main closing)
      // Go backwards from </main> to find the right insertion point
      const beforeMain = content.lastIndexOf('</div>', mainCloseIdx);
      if (beforeMain !== -1) {
        const sectionHtml = `\n      <!-- Related Content -->\n      <section class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">\n        <div class="prose prose-gray dark:prose-invert max-w-none text-sm">${relatedHtml}        </div>\n      </section>\n    `;
        content = content.slice(0, beforeMain) + sectionHtml + content.slice(beforeMain);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  OK: ${filePath}`);
  return true;
}

// Main
const baseDir = path.resolve(__dirname, '..');
let processed = 0;
let skipped = 0;

// Process all tools
const allToolIds = [
  // Remaining dev tools (already done ones will be skipped via "already enhanced" check)
  ...Object.keys(toolsData),
  ...Object.keys(lifeToolsSimple),
];

for (const toolId of allToolIds) {
  const category = toolId.split('/')[0];
  const toolName = toolId.split('/')[1];

  console.log(`Processing: ${toolId}`);

  // Korean
  const koPath = path.join(baseDir, 'tools', category, `${toolName}.html`);
  if (processToolFile(koPath, toolId, 'ko')) processed++; else skipped++;

  // English
  const enPath = path.join(baseDir, 'en', 'tools', category, `${toolName}.html`);
  if (processToolFile(enPath, toolId, 'en')) processed++; else skipped++;
}

console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}`);
