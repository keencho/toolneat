/**
 * SEO Meta Description Updater
 * Updates all tool pages with optimized meta descriptions
 * Based on docs/00-meta-plan.md
 */

const fs = require('fs');
const path = require('path');

// Meta descriptions mapping - Korean (KO) and English (EN)
const metaDescriptions = {
  // Dev Tools
  'base64': {
    ko: 'Base64 인코딩 및 디코딩을 온라인에서 무료로 변환하세요. 텍스트를 Base64 문자열로 변환하거나, Base64로 인코딩된 데이터를 원본 텍스트로 복원할 수 있습니다. URL-safe 옵션을 지원하며, 이미지 Data URI 생성, API 토큰 디코딩, 파일 데이터 처리 등 개발 작업에 필수적인 도구입니다.',
    en: 'Free online Base64 encoder and decoder tool. Convert text to Base64 encoded strings or decode Base64 data back to original text instantly. Supports URL-safe encoding option, perfect for creating image Data URIs, decoding API tokens, and handling file data in web development.'
  },
  'url-encoder': {
    ko: 'URL 인코딩 및 디코딩 온라인 도구입니다. 한글, 특수문자, 공백 등을 URL에서 안전하게 사용할 수 있는 형식으로 변환합니다. encodeURIComponent와 encodeURI 방식을 모두 지원합니다. API 호출, 쿼리스트링 생성, 링크 공유 시 필수적인 개발자 도구입니다.',
    en: 'Free online URL encoder and decoder tool. Convert special characters, unicode, and spaces to URL-safe percent-encoded format. Supports both encodeURIComponent and encodeURI methods. Essential for API calls, query string generation, and link sharing.'
  },
  'html-entity': {
    ko: 'HTML 특수문자를 엔티티 코드로 변환하는 온라인 도구입니다. <, >, &, ", \' 등의 문자를 &lt; &gt; &amp; 형태로 인코딩하여 웹페이지에 안전하게 표시할 수 있습니다. XSS 공격을 방지하고 HTML 문서의 문법 오류를 예방합니다.',
    en: 'Free online HTML entity encoder and decoder. Convert special characters like <, >, &, ", \' to their HTML entity equivalents for safe display on web pages. Prevents XSS attacks and HTML syntax errors. Essential security tool for web developers.'
  },
  'uuid-generator': {
    ko: 'UUID(범용 고유 식별자)를 온라인에서 무료로 생성하세요. UUID v4(완전 랜덤), v1(MAC 주소+타임스탬프), v7(시간순 정렬 가능) 버전을 모두 지원합니다. 대량 생성 기능으로 한번에 최대 100개까지 생성 가능합니다. 데이터베이스 기본키, API 토큰 생성에 활용하세요.',
    en: 'Generate UUIDs (Universally Unique Identifiers) online for free. Supports UUID v4 (random), v1 (timestamp + MAC), and v7 (time-sortable) versions. Bulk generate up to 100 UUIDs at once with formatting options. Perfect for database primary keys, API tokens, and session IDs.'
  },
  'hash-generator': {
    ko: 'MD5, SHA-1, SHA-256, SHA-384, SHA-512 해시값을 온라인에서 무료로 생성하세요. 텍스트 입력 또는 파일 업로드로 해시를 계산할 수 있습니다. 파일 무결성 검증, 비밀번호 해싱, 디지털 서명에 활용됩니다. 모든 처리는 브라우저에서 이루어집니다.',
    en: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hash values online for free. Calculate hashes from text input or file upload. Use for file integrity verification, password hashing, and digital signatures. All processing happens in your browser.'
  },
  'lorem-ipsum': {
    ko: 'Lorem Ipsum 더미 텍스트를 온라인에서 무료로 생성하세요. 단락, 문장, 단어 단위로 원하는 만큼 생성할 수 있습니다. 웹 디자인 목업, 출판물 레이아웃 테스트, 타이포그래피 미리보기에 활용됩니다. HTML 태그 형식 출력을 지원합니다.',
    en: 'Generate Lorem Ipsum placeholder text online for free. Create paragraphs, sentences, or words as needed for web design mockups, publication layouts, and typography previews. Supports HTML paragraph tag output for easy copy-paste into your web projects.'
  },
  'jwt-generator': {
    ko: 'JWT(JSON Web Token)를 온라인에서 무료로 생성하세요. HMAC 알고리즘(HS256, HS384, HS512)을 지원하며, Header와 Payload를 직접 설정하고 Secret Key로 서명할 수 있습니다. 만료시간, 발급시간 등 표준 클레임을 쉽게 추가할 수 있습니다.',
    en: 'Generate JWT (JSON Web Tokens) online for free. Supports HMAC algorithms (HS256, HS384, HS512) with custom Header and Payload configuration. Easily add standard claims like expiration, issued at, issuer, and custom claims. Sign tokens with your secret key.'
  },
  'jwt-decoder': {
    ko: 'JWT(JSON Web Token)를 온라인에서 무료로 디코딩하고 분석하세요. 토큰의 Header, Payload, Signature 세 부분을 분리하여 보여주고, 만료시간, 발급시간, 권한 등 클레임 정보를 읽기 쉽게 표시합니다. Secret Key로 서명 유효성을 검증할 수 있습니다.',
    en: 'Decode and analyze JWT (JSON Web Tokens) online for free. View Header, Payload, and Signature components separately with human-readable claim information including expiration, issued time, and permissions. Verify signature validity with your secret key.'
  },
  'password-generator': {
    ko: '안전한 랜덤 비밀번호를 온라인에서 무료로 생성하세요. 길이(8-128자), 대문자, 소문자, 숫자, 특수문자 포함 여부를 자유롭게 설정할 수 있습니다. 비밀번호 강도를 실시간으로 표시하고, 여러 개를 한번에 대량 생성할 수 있습니다.',
    en: 'Generate secure random passwords online for free. Customize length (8-128 characters), uppercase, lowercase, numbers, and special characters. Real-time password strength indicator with bulk generation support. Uses cryptographically secure random number generator.'
  },
  'cron-generator': {
    ko: 'Cron 표현식을 쉽게 생성하고 해석하는 온라인 도구입니다. 분, 시, 일, 월, 요일 필드를 GUI로 직관적으로 설정하고, 생성된 표현식의 다음 실행 시간을 미리 확인할 수 있습니다. Linux crontab, AWS CloudWatch Events, Kubernetes CronJob 등에 사용됩니다.',
    en: 'Create and interpret Cron expressions easily with our online tool. Set minute, hour, day, month, and weekday fields intuitively through GUI and preview upcoming execution times. Works with Linux crontab, AWS CloudWatch Events, Kubernetes CronJob, and more.'
  },
  'json-formatter': {
    ko: 'JSON 데이터를 보기 좋게 포맷팅하고 유효성을 검사하는 온라인 도구입니다. 자동 들여쓰기, 키 정렬, 접기/펼치기 기능과 문법 하이라이팅으로 복잡한 JSON 구조를 쉽게 파악할 수 있습니다. 압축(Minify) 기능도 제공합니다.',
    en: 'Format and validate JSON data online with our free tool. Features auto-indentation, key sorting, collapse/expand functionality, and syntax highlighting for easy structure visualization. Minify JSON to reduce file size. Supports large JSON files.'
  },
  'color-converter': {
    ko: 'HEX, RGB, HSL, RGBA, HSLA 등 다양한 색상 형식을 상호 변환하는 온라인 도구입니다. 컬러 피커로 색상을 직접 선택하거나 색상 코드를 입력하여 모든 형식으로 변환할 수 있습니다. 웹 디자인, CSS 스타일링에 필수적인 도구입니다.',
    en: 'Convert between HEX, RGB, HSL, RGBA, HSLA color formats online. Pick colors visually or enter color codes to convert to all formats instantly. Get automatic suggestions for complementary and related colors. Essential tool for web design and CSS styling.'
  },
  'timestamp-converter': {
    ko: 'Unix Timestamp(Epoch Time)와 날짜/시간을 상호 변환하는 온라인 도구입니다. 초 단위와 밀리초(JavaScript) 단위를 모두 지원하며, 현재 시간의 타임스탬프를 실시간으로 확인할 수 있습니다. 로그 분석, API 개발에 필수적인 도구입니다.',
    en: 'Convert between Unix Timestamp (Epoch Time) and human-readable dates online. Supports both seconds and milliseconds (JavaScript) formats. View current timestamp in real-time with timezone conversion. Essential for log analysis and API development.'
  },
  'yaml-json': {
    ko: 'YAML과 JSON 형식을 상호 변환하는 온라인 도구입니다. Kubernetes 설정 파일, Docker Compose, Ansible Playbook, GitHub Actions 워크플로우 등 DevOps 작업에서 자주 사용되는 포맷을 쉽게 변환할 수 있습니다. 문법 오류 감지 기능도 제공합니다.',
    en: 'Convert between YAML and JSON formats online for free. Perfect for DevOps tasks with Kubernetes configs, Docker Compose files, Ansible Playbooks, and GitHub Actions workflows. Syntax error detection helps validate your YAML/JSON.'
  },
  'markdown-preview': {
    ko: 'Markdown 문법을 실시간으로 미리보기하는 온라인 에디터입니다. 제목, 목록, 코드 블록, 테이블, 이미지, 링크 등 GitHub Flavored Markdown(GFM)을 완벽 지원합니다. README.md 작성, 기술 문서 작성, 블로그 포스팅에 활용하세요.',
    en: 'Preview Markdown syntax in real-time with our online editor. Full support for GitHub Flavored Markdown (GFM) including headings, lists, code blocks, tables, images, and links. Perfect for writing README files, technical documentation, and blog posts.'
  },
  'case-converter': {
    ko: '텍스트 대소문자를 다양한 형식으로 변환하는 온라인 도구입니다. UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE 등을 지원합니다. 프로그래밍 변수명 변환, 제목 스타일 통일에 유용합니다.',
    en: 'Convert text between different case formats online. Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more. Perfect for programming variable naming and text normalization.'
  },
  'sql-formatter': {
    ko: 'SQL 쿼리를 보기 좋게 포맷팅하는 온라인 도구입니다. SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER 등 모든 SQL 문을 지원하며, 자동 들여쓰기와 키워드 대문자 변환으로 가독성을 높입니다. MySQL, PostgreSQL, SQL Server 등 모든 SQL에서 사용 가능합니다.',
    en: 'Format SQL queries for better readability online. Supports all SQL statements including SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER with auto-indentation and keyword uppercasing. Works with MySQL, PostgreSQL, SQL Server, Oracle, and all SQL dialects.'
  },
  'css-minifier': {
    ko: 'CSS 코드를 압축(Minify)하거나 보기 좋게 정리(Beautify)하는 온라인 도구입니다. 압축 기능으로 불필요한 공백과 줄바꿈을 제거하여 파일 크기를 줄이고 웹사이트 로딩 속도를 개선합니다. 프론트엔드 개발 필수 도구입니다.',
    en: 'Minify or beautify CSS code online for free. Minification removes unnecessary whitespace and line breaks to reduce file size and improve website loading speed. Beautification expands compressed CSS with proper indentation for easy analysis.'
  },
  'line-ending': {
    ko: '텍스트 파일의 줄바꿈 문자를 변환하는 온라인 도구입니다. CRLF(Windows), LF(Unix/Linux/Mac), CR(구형 Mac) 형식 간 변환을 지원합니다. 운영체제 간 파일 호환성 문제를 해결하고, Git 줄바꿈 설정 확인에 활용됩니다.',
    en: 'Convert text file line endings online. Transform between CRLF (Windows), LF (Unix/Linux/Mac), and CR (old Mac) formats. Resolve cross-platform file compatibility issues and verify Git line ending settings. Essential for cross-platform development.'
  },
  'regex-tester': {
    ko: '정규표현식(Regular Expression)을 실시간으로 테스트하는 온라인 도구입니다. 패턴 매칭 결과를 하이라이팅으로 표시하고, 캡처 그룹과 매치 인덱스를 상세히 보여줍니다. 이메일, 전화번호, URL 등 자주 사용하는 정규식 예제가 포함되어 있습니다.',
    en: 'Test regular expressions (regex) in real-time online. See pattern matches highlighted with detailed capture groups and match indices. Includes string replacement functionality and common regex pattern examples for email, phone numbers, URLs, and more.'
  },
  'diff-checker': {
    ko: '두 텍스트의 차이점을 비교하는 온라인 도구입니다. 추가된 줄, 삭제된 줄, 변경된 줄을 색상으로 구분하여 표시합니다. 코드 리뷰, 문서 버전 비교, 설정 파일 변경사항 추적에 활용됩니다. 라인 단위 또는 단어 단위로 상세 비교가 가능합니다.',
    en: 'Compare two texts and find differences online. Highlights added, deleted, and modified lines with color coding. Perfect for code review, document version comparison, and config file change tracking. Supports line-by-line or word-by-word detailed comparison.'
  },

  // Life Tools
  'salary-calculator': {
    ko: '연봉 실수령액을 계산하는 온라인 도구입니다. 연봉을 입력하면 국민연금, 건강보험, 장기요양보험, 고용보험 4대 보험료와 소득세, 지방소득세를 자동으로 계산하여 월 실수령액과 연간 실수령액을 알려드립니다. 2025년 최신 보험요율이 적용됩니다.',
    en: 'Calculate Korean salary after tax deductions online. Enter your annual salary to automatically calculate National Pension, Health Insurance, Long-term Care, Employment Insurance premiums plus Income Tax and Local Income Tax. Shows monthly and yearly take-home pay.'
  },
  'dday-calculator': {
    ko: 'D-day를 계산하는 온라인 도구입니다. 목표 날짜를 선택하면 오늘부터 며칠 남았는지 자동으로 계산합니다. 수능, 자격증 시험, 결혼기념일, 생일, 여행, 프로젝트 마감일 등 중요한 날까지의 카운트다운을 확인하세요. 두 날짜 사이의 일수 차이 계산도 가능합니다.',
    en: 'Calculate D-day countdown online. Select your target date to instantly see how many days remain from today. Perfect for exam dates, anniversaries, birthdays, travel plans, project deadlines, and due dates. Also calculate the exact number of days between any two dates.'
  },
  'bmi-calculator': {
    ko: 'BMI(체질량지수)를 계산하여 비만도를 확인하는 온라인 도구입니다. 키(cm)와 몸무게(kg)를 입력하면 BMI 수치와 저체중, 정상, 과체중, 비만 판정 결과를 알려드립니다. 내 키에 맞는 정상 체중 범위도 함께 안내합니다.',
    en: 'Calculate your BMI (Body Mass Index) to check obesity level online. Enter height and weight to get your BMI value with classification: underweight, normal, overweight, or obese. Shows healthy weight range for your height. Supports metric and imperial units.'
  },
  'loan-calculator': {
    ko: '대출 원리금 상환액을 계산하는 온라인 도구입니다. 대출 원금, 연 이자율, 상환 기간을 입력하면 월 상환액, 총 상환액, 총 이자를 계산합니다. 원리금균등상환, 원금균등상환, 만기일시상환 세 가지 방식을 지원합니다.',
    en: 'Calculate loan repayment amounts online. Enter principal, annual interest rate, and loan term to see monthly payment, total payment, and total interest. Supports equal payment, equal principal, and bullet payment methods. Export amortization schedule as CSV.'
  },
  'age-calculator': {
    ko: '생년월일로 나이를 계산하는 온라인 도구입니다. 생년월일을 입력하면 만 나이(국제 표준)와 한국 나이(연 나이)를 모두 알려드립니다. 다음 생일까지 남은 일수, 지금까지 살아온 총 일수, 태어난 요일도 확인할 수 있습니다.',
    en: 'Calculate age from birthdate online. Enter your birth date to see both international age (completed years) and Korean age. Also shows days until next birthday, total days lived, and the day of the week you were born. Perfect for age verification.'
  },
  'percent-calculator': {
    ko: '퍼센트(백분율) 계산을 쉽게 하는 온라인 도구입니다. "100의 25%는?", "30은 120의 몇 %?", "80에서 100으로 증가율은?" 등 다양한 퍼센트 계산 공식을 지원합니다. 할인율 계산, 성적 백분율 계산, 변화율 계산에 활용하세요.',
    en: 'Calculate percentages easily online. Supports various percentage formulas: "What is 25% of 100?", "30 is what % of 120?", "What is the % change from 80 to 100?" Perfect for discount calculations, grade percentages, and growth rates.'
  },
  'compound-calculator': {
    ko: '복리 이자를 계산하는 온라인 도구입니다. 원금, 연 이자율, 기간, 복리 주기(월복리/분기복리/연복리)를 입력하면 최종 금액과 이자 수익을 계산합니다. 적금, 예금, 펀드, 주식 투자 수익 시뮬레이션에 활용하세요.',
    en: 'Calculate compound interest online. Enter principal, annual interest rate, time period, and compounding frequency to see final amount and interest earned. Perfect for savings, deposits, funds, and investment simulations. Visualize the power of compound interest.'
  },
  'tip-calculator': {
    ko: '팁과 더치페이 금액을 계산하는 온라인 도구입니다. 음식 값에 원하는 팁 비율(10%, 15%, 20% 등)을 적용하고, 인원수로 나누어 1인당 부담 금액을 계산합니다. 해외여행 중 레스토랑, 카페, 택시, 호텔에서 팁을 계산할 때 유용합니다.',
    en: 'Calculate tips and split bills online. Apply your preferred tip percentage (10%, 15%, 20%) to the bill amount and divide by number of people. Perfect for restaurants, cafes, taxis, and hotels during travel. See total with tip and per-person amounts instantly.'
  },
  'character-counter': {
    ko: '글자수, 공백 제외 글자수, 단어수, 바이트수를 실시간으로 세는 온라인 도구입니다. 블로그 포스팅, 인스타그램·트위터 글자 제한 확인, 자기소개서·이력서 글자수 맞추기, 논문·리포트 분량 체크에 필수적입니다.',
    en: 'Count characters, words, and bytes in real-time online. Essential for blog posts, social media character limits (Twitter, Instagram), resume requirements, and academic paper lengths. Shows character count with/without spaces, word count, byte count, and more.'
  },
  'unit-converter': {
    ko: '다양한 단위를 변환하는 온라인 도구입니다. 면적(평↔제곱미터), 길이(인치↔센티미터), 무게(파운드↔킬로그램), 온도(섭씨↔화씨), 데이터 용량(MB↔GB↔TB)을 지원합니다. 부동산 평수 계산, 해외직구 사이즈 확인에 유용합니다.',
    en: 'Convert various units online. Supports area (pyeong↔square meters), length (inches↔cm, feet↔meters), weight (pounds↔kg), temperature (Celsius↔Fahrenheit), and data storage (MB↔GB↔TB). Perfect for real estate and international shopping conversions.'
  },
  'qr-generator': {
    ko: 'QR코드를 무료로 생성하는 온라인 도구입니다. URL 링크, 텍스트 메시지, 전화번호, 이메일, Wi-Fi 접속 정보를 QR코드로 변환할 수 있습니다. 크기, 색상, 오류 복원 레벨을 자유롭게 설정하고 PNG 또는 SVG 형식으로 다운로드가 가능합니다.',
    en: 'Generate QR codes for free online. Convert URLs, text messages, phone numbers, emails, and Wi-Fi credentials into QR codes. Customize size, colors, and error correction level. Download as high-quality PNG or SVG. Perfect for business cards and posters.'
  },
  'barcode-generator': {
    ko: '바코드를 무료로 생성하는 온라인 도구입니다. CODE128(범용), EAN-13/EAN-8(국제 상품 바코드), UPC-A/UPC-E(미국 상품 바코드), CODE39, ITF-14(물류), Codabar(도서관, 택배), Pharmacode(의약품), MSI(창고 재고관리) 등 18종 바코드 형식을 지원합니다.',
    en: 'Generate barcodes for free online. Supports 18 barcode formats: CODE128 (universal), EAN-13/EAN-8 (international products), UPC-A/UPC-E (US products), CODE39, ITF-14 (logistics), Codabar (libraries, shipping), Pharmacode, MSI and more. Download as PNG or SVG.'
  },
  'favicon-generator': {
    ko: '이미지를 웹사이트 파비콘으로 변환하는 온라인 도구입니다. JPG, PNG, SVG 이미지를 업로드하면 16x16, 32x32, 48x48, 64x64, 128x128, 256x256 등 다양한 크기의 파비콘을 한번에 생성합니다. ICO 파일과 PNG 파일로 다운로드할 수 있습니다.',
    en: 'Convert images to website favicons online. Upload JPG, PNG, or SVG images to generate favicons in multiple sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256 at once. Download as ICO file or individual PNGs for all browsers and devices.'
  },
  'image-compressor': {
    ko: 'JPG, PNG, WebP 이미지 파일 크기를 줄이는 온라인 도구입니다. 품질 슬라이더로 압축률을 조절하여 웹사이트 로딩 속도를 개선하고 저장 공간을 절약하세요. 여러 이미지를 한번에 일괄 압축할 수 있습니다. 서버 업로드 없이 브라우저에서 처리됩니다.',
    en: 'Compress JPG, PNG, and WebP images online to reduce file size. Adjust compression quality with slider to improve website loading speed and save storage space. Batch compress multiple images at once. All processing happens in your browser for complete privacy.'
  },
  'image-resizer': {
    ko: '이미지 크기(해상도)를 변경하는 온라인 도구입니다. 픽셀 단위로 원하는 너비×높이를 직접 지정하거나, 퍼센트로 비율을 조절할 수 있습니다. 비율 유지 옵션으로 이미지가 찌그러지지 않게 리사이즈합니다. SNS 맞춤 프리셋도 제공합니다.',
    en: 'Resize image dimensions online. Specify exact width×height in pixels or scale by percentage. Aspect ratio lock prevents image distortion. Includes presets for Instagram, Facebook, YouTube thumbnails and other social media platforms. No server upload required.'
  },
  'image-converter': {
    ko: 'PNG, JPG, WebP, GIF, BMP, ICO 등 이미지 형식을 변환하는 온라인 도구입니다. 최대 20개 파일을 한번에 일괄 변환할 수 있으며, JPG/WebP는 품질 설정을 지원합니다. 브라우저에서 처리되어 서버 업로드가 없습니다.',
    en: 'Convert between PNG, JPG, WebP, GIF, BMP, ICO image formats online. Batch convert up to 20 files at once with quality settings for JPG/WebP. Preserve PNG transparency or reduce file size with WebP. All processing happens locally in your browser.'
  },
  'base-converter': {
    ko: '2진수, 8진수, 10진수, 16진수를 상호 변환하는 온라인 도구입니다. 숫자를 입력하면 모든 진법으로 실시간 변환 결과를 보여줍니다. 프로그래밍에서 비트 연산 이해, 메모리 주소 분석, 색상 코드(HEX) 계산에 활용됩니다.',
    en: 'Convert between binary, octal, decimal, and hexadecimal numbers online. Enter a number to see real-time conversion results in all bases. Essential for programming bit operations, memory address analysis, and color code (HEX) calculations.'
  },
  'ascii-unicode': {
    ko: '문자를 ASCII 코드, 유니코드 코드포인트로 변환하거나, 코드를 문자로 변환하는 온라인 도구입니다. 10진수, 16진수(0x), Unicode Escape(\\u), HTML Entity(&#;) 형식을 모두 지원합니다. 특수문자 입력, 이모지 코드 확인에 유용합니다.',
    en: 'Convert characters to ASCII codes, Unicode code points, or codes back to characters online. Supports decimal, hexadecimal (0x), Unicode Escape (\\u), and HTML Entity (&#;) formats. Useful for special character input and emoji code lookup.'
  },
  'emoji-picker': {
    ko: '이모지를 검색하고 클릭 한번으로 복사하는 온라인 도구입니다. 😀 스마일, ❤️ 하트, 🐶 동물, 🍕 음식, ✈️ 여행, 🎮 게임 등 카테고리별로 탐색하거나 키워드로 검색하세요. 최근 사용한 이모지 기록이 저장됩니다.',
    en: 'Search and copy emojis with one click online. Browse by categories like 😀 smileys, ❤️ hearts, 🐶 animals, 🍕 food, ✈️ travel, 🎮 gaming, or search by keyword. Recently used emojis are saved for quick access to your favorites.'
  },
  'dead-pixel-test': {
    ko: '모니터의 불량 화소(데드픽셀, 핫픽셀, 스턱픽셀)를 찾는 온라인 도구입니다. 빨강, 초록, 파랑, 흰색, 검정색 단색 화면을 전체화면으로 표시하여 화소 불량을 쉽게 확인할 수 있습니다. 새 모니터 구매 시 품질 검사, 중고 모니터 점검에 필수적입니다.',
    en: 'Find dead pixels, hot pixels, and stuck pixels on your monitor online. Display solid red, green, blue, white, and black screens in fullscreen to easily spot pixel defects. Essential for quality checking new monitors and inspecting used monitors.'
  },
  'pixel-fixer': {
    ko: '고착된 픽셀(Stuck Pixel)을 수리하는 온라인 도구입니다. 빠르게 깜빡이는 RGB 색상 박스를 드래그하여 불량 화소 위에 놓고 10-30분간 실행하면 픽셀이 복구될 수 있습니다. 스턱픽셀(특정 색에 고착된 픽셀)은 높은 확률로 복구됩니다.',
    en: 'Repair stuck pixels on your monitor online. Drag the rapidly flashing RGB color box over the stuck pixel and run for 10-30 minutes for potential recovery. Stuck pixels (fixed on one color) have a high recovery rate with this method.'
  },
  'screen-burn-test': {
    ko: 'OLED 디스플레이의 번인(Burn-in) 현상을 확인하는 온라인 도구입니다. 회색 단색 화면을 전체화면으로 표시했을 때 이전 이미지의 잔상(고스트 이미지)이 보이면 번인이 발생한 것입니다. 스마트폰, OLED TV 중고 구매 시 필수 점검 항목입니다.',
    en: 'Check for burn-in on OLED displays online. Display a solid gray fullscreen - if you see ghost images of previous content, burn-in has occurred. Essential test when buying used smartphones, OLED TVs, and AMOLED monitors.'
  },
  'screen-color-test': {
    ko: '모니터의 색상 품질을 테스트하는 온라인 도구입니다. 색상 균일성(화면 전체가 균일한 색인지), 그라데이션 밴딩(색 전환 시 줄무늬), 색 정확도를 다양한 테스트 패턴으로 확인할 수 있습니다. 새 모니터 설정, 캘리브레이션 전 점검에 활용하세요.',
    en: 'Test monitor color quality online. Check color uniformity (even color across screen), gradient banding (striping in color transitions), and color accuracy with various test patterns. Perfect for new monitor setup and pre-calibration inspection.'
  },
  'lottery-generator': {
    ko: '로또 6/45 번호를 랜덤으로 생성하는 온라인 도구입니다. 1부터 45까지 숫자 중 중복 없이 6개를 무작위로 추첨합니다. 한번에 여러 게임(최대 10게임)을 생성할 수 있고, 특정 번호를 제외하는 옵션도 제공합니다.',
    en: 'Generate random Korean Lotto 6/45 numbers online. Randomly draw 6 unique numbers from 1-45 without duplicates. Generate multiple games at once (up to 10) with option to exclude specific numbers. Uses fair random number generation.'
  },
  'roulette': {
    ko: '온라인 룰렛을 돌려 랜덤으로 선택하는 도구입니다. 점심 메뉴 정하기, 팀원 순서 정하기, 당첨자 추첨, 벌칙 정하기 등에 활용하세요. 항목을 자유롭게 추가/삭제할 수 있고, 각 항목의 당첨 확률을 조절할 수도 있습니다.',
    en: 'Spin the wheel for random selection online. Perfect for choosing lunch menus, deciding team order, picking winners, or determining penalties. Add or remove items freely and adjust probability weights for each option. Exciting spin animation included.'
  },
  'dice-roller': {
    ko: '가상 주사위를 굴리는 온라인 도구입니다. D4(4면체), D6(6면체), D8(8면체), D10(10면체), D12(12면체), D20(20면체), D100(100면체) 주사위를 지원합니다. 여러 개를 동시에 굴리고 합계를 계산할 수 있습니다. TRPG, 보드게임에 활용하세요.',
    en: 'Roll virtual dice online. Supports D4, D6, D8, D10, D12, D20, and D100 (percentile) dice. Roll multiple dice simultaneously and calculate totals. Perfect for TRPG games like Dungeons & Dragons, Call of Cthulhu, and board games.'
  },
  'coin-flip': {
    ko: '동전을 던져 앞면(Head) 또는 뒷면(Tail)을 결정하는 온라인 도구입니다. 애니메이션으로 동전이 회전하는 효과를 보여주고, 앞면/뒷면 통계를 기록합니다. 간단한 양자택일 결정, 가위바위보 대신 사용, 확률 실험에 활용하세요.',
    en: 'Flip a coin online to decide heads or tails. Watch the coin spin with realistic animation and track your flip statistics. Perfect for simple binary decisions, settling disputes, or probability experiments. Guarantees fair 50:50 odds.'
  },
  'typing-test': {
    ko: '타자 속도와 정확도를 측정하는 온라인 도구입니다. 한글 또는 영문 텍스트를 보고 타이핑하면 분당 타수(WPM), 정확도(%), 오타 수를 실시간으로 측정합니다. 1분, 3분, 5분 테스트를 선택할 수 있으며 최고 기록이 저장됩니다.',
    en: 'Test your typing speed and accuracy online. Type the displayed Korean or English text to measure WPM (words per minute), accuracy percentage, and error count in real-time. Choose 1, 3, or 5-minute tests with high score tracking.'
  },
  'reaction-test': {
    ko: '반응속도를 측정하는 온라인 도구입니다. 화면이 초록색으로 바뀌면 최대한 빨리 클릭하세요. 밀리초(ms) 단위로 정확한 반응시간을 측정하고 평균 반응속도를 계산합니다. 게이머의 반사신경 테스트, 집중력 측정에 활용됩니다.',
    en: 'Test your reaction time online. Click as fast as possible when the screen turns green. Measures your reaction time in milliseconds (ms) with average calculation. Perfect for gamers testing reflexes and measuring concentration levels.'
  }
};

// Tool to category mapping
const toolCategories = {
  // Dev tools
  'base64': 'dev',
  'url-encoder': 'dev',
  'html-entity': 'dev',
  'uuid-generator': 'dev',
  'hash-generator': 'dev',
  'lorem-ipsum': 'dev',
  'jwt-generator': 'dev',
  'jwt-decoder': 'dev',
  'password-generator': 'dev',
  'cron-generator': 'dev',
  'json-formatter': 'dev',
  'color-converter': 'dev',
  'timestamp-converter': 'dev',
  'yaml-json': 'dev',
  'markdown-preview': 'dev',
  'case-converter': 'dev',
  'sql-formatter': 'dev',
  'css-minifier': 'dev',
  'line-ending': 'dev',
  'regex-tester': 'dev',
  'diff-checker': 'dev',

  // Life tools
  'salary-calculator': 'life',
  'dday-calculator': 'life',
  'bmi-calculator': 'life',
  'loan-calculator': 'life',
  'age-calculator': 'life',
  'percent-calculator': 'life',
  'compound-calculator': 'life',
  'tip-calculator': 'life',
  'character-counter': 'life',
  'unit-converter': 'life',
  'qr-generator': 'life',
  'barcode-generator': 'life',
  'favicon-generator': 'life',
  'image-compressor': 'life',
  'image-resizer': 'life',
  'image-converter': 'life',
  'base-converter': 'life',
  'ascii-unicode': 'life',
  'emoji-picker': 'life',
  'dead-pixel-test': 'life',
  'pixel-fixer': 'life',
  'screen-burn-test': 'life',
  'screen-color-test': 'life',
  'lottery-generator': 'life',
  'roulette': 'life',
  'dice-roller': 'life',
  'coin-flip': 'life',
  'typing-test': 'life',
  'reaction-test': 'life'
};

function updateMetaDescription(filePath, description) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Update meta description content attribute
    const metaRegex = /(<meta\s+name=["']description["'][^>]*content=["'])([^"']*)(['"][^>]*>)/i;
    const dataMetaRegex = /(<meta\s+[^>]*data-i18n-desc=["'][^"']*["'][^>]*content=["'])([^"']*)(['"][^>]*>)/i;

    if (metaRegex.test(content)) {
      content = content.replace(metaRegex, `$1${description}$3`);
    }
    if (dataMetaRegex.test(content)) {
      content = content.replace(dataMetaRegex, `$1${description}$3`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (e) {
    console.error(`Error updating ${filePath}:`, e.message);
    return false;
  }
}

function main() {
  const rootDir = path.join(__dirname, '..', '..');
  let updated = 0;
  let failed = 0;

  for (const [tool, category] of Object.entries(toolCategories)) {
    const desc = metaDescriptions[tool];
    if (!desc) {
      console.log(`⚠️  No description for: ${tool}`);
      continue;
    }

    // Korean version
    const koPath = path.join(rootDir, 'tools', category, tool, 'index.html');
    if (fs.existsSync(koPath)) {
      if (updateMetaDescription(koPath, desc.ko)) {
        console.log(`✅ KO: ${tool}`);
        updated++;
      } else {
        failed++;
      }
    }

    // English version
    const enPath = path.join(rootDir, 'en', 'tools', category, tool, 'index.html');
    if (fs.existsSync(enPath)) {
      if (updateMetaDescription(enPath, desc.en)) {
        console.log(`✅ EN: ${tool}`);
        updated++;
      } else {
        failed++;
      }
    }
  }

  console.log(`\n📊 Summary: ${updated} updated, ${failed} failed`);
}

main();
