/**
 * Toolneat - Tools Metadata for Global Search
 * All 64+ tools with names, paths, descriptions, and tags
 */

const TOOLS_DATA = {
  dev: [
    {
      id: 'base64',
      path: '/tools/dev/base64',
      name: { ko: 'Base64 인코딩', en: 'Base64 Encoder' },
      description: { ko: '텍스트를 Base64로 인코딩/디코딩', en: 'Encode/decode text to Base64' },
      tags: ['encoding', 'decode', 'encode', 'base64', '인코딩', '디코딩'],
      icon: 'code'
    },
    {
      id: 'url-encoder',
      path: '/tools/dev/url-encoder',
      name: { ko: 'URL 인코딩', en: 'URL Encoder' },
      description: { ko: 'URL 문자열 인코딩/디코딩', en: 'Encode/decode URL strings' },
      tags: ['url', 'encoding', 'decode', 'percent', 'uri', 'encodeURIComponent'],
      icon: 'link'
    },
    {
      id: 'html-entity',
      path: '/tools/dev/html-entity',
      name: { ko: 'HTML 엔티티', en: 'HTML Entity Encoder' },
      description: { ko: 'HTML 특수문자 인코딩/디코딩', en: 'Encode/decode HTML entities' },
      tags: ['html', 'entity', 'escape', 'special', 'characters', '특수문자'],
      icon: 'code'
    },
    {
      id: 'uuid-generator',
      path: '/tools/dev/uuid-generator',
      name: { ko: 'UUID 생성기', en: 'UUID Generator' },
      description: { ko: 'UUID v4 생성', en: 'Generate UUID v4' },
      tags: ['uuid', 'guid', 'unique', 'id', 'identifier', '고유'],
      icon: 'key'
    },
    {
      id: 'hash-generator',
      path: '/tools/dev/hash-generator',
      name: { ko: '해시 생성기', en: 'Hash Generator' },
      description: { ko: 'MD5, SHA-1, SHA-256 해시 생성', en: 'Generate MD5, SHA-1, SHA-256 hashes' },
      tags: ['hash', 'md5', 'sha', 'sha256', 'sha1', 'checksum', '해시'],
      icon: 'shield'
    },
    {
      id: 'lorem-ipsum',
      path: '/tools/dev/lorem-ipsum',
      name: { ko: 'Lorem Ipsum', en: 'Lorem Ipsum Generator' },
      description: { ko: '더미 텍스트 생성', en: 'Generate placeholder text' },
      tags: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', '더미', '텍스트'],
      icon: 'document'
    },
    {
      id: 'jwt-generator',
      path: '/tools/dev/jwt-generator',
      name: { ko: 'JWT 생성기', en: 'JWT Generator' },
      description: { ko: 'JWT 토큰 생성', en: 'Generate JWT tokens' },
      tags: ['jwt', 'token', 'json', 'web', 'authentication', '인증', '토큰'],
      icon: 'key'
    },
    {
      id: 'jwt-decoder',
      path: '/tools/dev/jwt-decoder',
      name: { ko: 'JWT 디코더', en: 'JWT Decoder' },
      description: { ko: 'JWT 토큰 해석', en: 'Decode JWT tokens' },
      tags: ['jwt', 'token', 'decode', 'parse', 'authentication', '해석'],
      icon: 'key'
    },
    {
      id: 'password-generator',
      path: '/tools/dev/password-generator',
      name: { ko: '비밀번호 생성기', en: 'Password Generator' },
      description: { ko: '안전한 무작위 비밀번호 생성', en: 'Generate secure random passwords' },
      tags: ['password', 'random', 'secure', 'generate', '비밀번호', '패스워드'],
      icon: 'lock'
    },
    {
      id: 'cron-generator',
      path: '/tools/dev/cron-generator',
      name: { ko: 'Cron 표현식 생성기', en: 'Cron Expression Generator' },
      description: { ko: 'Cron 스케줄 표현식 생성', en: 'Generate cron schedule expressions' },
      tags: ['cron', 'schedule', 'job', 'timer', 'crontab', '스케줄'],
      icon: 'clock'
    },
    {
      id: 'gradient-generator',
      path: '/tools/dev/gradient-generator',
      name: { ko: '그라데이션 생성기', en: 'Gradient Generator' },
      description: { ko: 'CSS 그라데이션 생성', en: 'Generate CSS gradients' },
      tags: ['gradient', 'css', 'color', 'linear', 'radial', '그라데이션', '색상'],
      icon: 'color'
    },
    {
      id: 'json-formatter',
      path: '/tools/dev/json-formatter',
      name: { ko: 'JSON 포매터', en: 'JSON Formatter' },
      description: { ko: 'JSON 정렬 및 검증', en: 'Format and validate JSON' },
      tags: ['json', 'format', 'beautify', 'validate', 'pretty', '포매터', '정렬'],
      icon: 'code'
    },
    {
      id: 'color-converter',
      path: '/tools/dev/color-converter',
      name: { ko: '색상 변환기', en: 'Color Converter' },
      description: { ko: 'HEX, RGB, HSL 색상 변환', en: 'Convert HEX, RGB, HSL colors' },
      tags: ['color', 'hex', 'rgb', 'hsl', 'convert', '색상', '컬러'],
      icon: 'color'
    },
    {
      id: 'color-palette',
      path: '/tools/dev/color-palette',
      name: { ko: '색상 팔레트 추출', en: 'Color Palette Extractor' },
      description: { ko: '이미지에서 색상 팔레트 추출', en: 'Extract color palette from images' },
      tags: ['color', 'palette', 'extract', 'image', '팔레트', '색상', '추출'],
      icon: 'color'
    },
    {
      id: 'timestamp-converter',
      path: '/tools/dev/timestamp-converter',
      name: { ko: '타임스탬프 변환기', en: 'Timestamp Converter' },
      description: { ko: 'Unix 타임스탬프 변환', en: 'Convert Unix timestamps' },
      tags: ['timestamp', 'unix', 'epoch', 'date', 'time', '타임스탬프', '시간'],
      icon: 'clock'
    },
    {
      id: 'yaml-json',
      path: '/tools/dev/yaml-json',
      name: { ko: 'YAML ↔ JSON 변환', en: 'YAML to JSON Converter' },
      description: { ko: 'YAML과 JSON 상호 변환', en: 'Convert between YAML and JSON' },
      tags: ['yaml', 'json', 'convert', 'config', 'yml', '변환'],
      icon: 'switch'
    },
    {
      id: 'markdown-preview',
      path: '/tools/dev/markdown-preview',
      name: { ko: '마크다운 미리보기', en: 'Markdown Preview' },
      description: { ko: '마크다운 실시간 미리보기', en: 'Preview Markdown in real-time' },
      tags: ['markdown', 'md', 'preview', 'editor', '마크다운', '미리보기'],
      icon: 'document'
    },
    {
      id: 'case-converter',
      path: '/tools/dev/case-converter',
      name: { ko: '대소문자 변환', en: 'Case Converter' },
      description: { ko: 'camelCase, snake_case 등 변환', en: 'Convert camelCase, snake_case, etc.' },
      tags: ['case', 'camel', 'snake', 'pascal', 'convert', '대소문자'],
      icon: 'text'
    },
    {
      id: 'sql-formatter',
      path: '/tools/dev/sql-formatter',
      name: { ko: 'SQL 포매터', en: 'SQL Formatter' },
      description: { ko: 'SQL 쿼리 정렬', en: 'Format SQL queries' },
      tags: ['sql', 'format', 'query', 'database', 'beautify', 'db', '쿼리'],
      icon: 'database'
    },
    {
      id: 'css-minifier',
      path: '/tools/dev/css-minifier',
      name: { ko: 'CSS 압축', en: 'CSS Minifier' },
      description: { ko: 'CSS 코드 압축/최소화', en: 'Minify CSS code' },
      tags: ['css', 'minify', 'compress', 'optimize', '압축', '최소화'],
      icon: 'code'
    },
    {
      id: 'line-ending',
      path: '/tools/dev/line-ending',
      name: { ko: '줄바꿈 변환', en: 'Line Ending Converter' },
      description: { ko: 'CRLF, LF 줄바꿈 변환', en: 'Convert CRLF/LF line endings' },
      tags: ['line', 'ending', 'crlf', 'lf', 'newline', '줄바꿈'],
      icon: 'text'
    },
    {
      id: 'regex-tester',
      path: '/tools/dev/regex-tester',
      name: { ko: '정규식 테스터', en: 'Regex Tester' },
      description: { ko: '정규표현식 테스트', en: 'Test regular expressions' },
      tags: ['regex', 'regular', 'expression', 'test', 'pattern', '정규식', '정규표현식'],
      icon: 'search'
    },
    {
      id: 'diff-checker',
      path: '/tools/dev/diff-checker',
      name: { ko: '텍스트 비교', en: 'Diff Checker' },
      description: { ko: '두 텍스트 간 차이점 비교', en: 'Compare differences between texts' },
      tags: ['diff', 'compare', 'text', 'difference', '비교', '차이'],
      icon: 'compare'
    },
    {
      id: 'meta-tag-generator',
      path: '/tools/dev/meta-tag-generator',
      name: { ko: '메타 태그 생성기', en: 'Meta Tag Generator' },
      description: { ko: 'SEO 최적화를 위한 메타 태그 생성', en: 'Generate meta tags for SEO' },
      tags: ['meta', 'seo', 'og', 'twitter', 'tags', '메타태그', 'opengraph'],
      icon: 'code'
    },
    {
      id: 'utm-generator',
      path: '/tools/dev/utm-generator',
      name: { ko: 'UTM 링크 생성기', en: 'UTM Link Generator' },
      description: { ko: '마케팅 캠페인 추적용 UTM 링크 생성', en: 'Generate UTM links for campaign tracking' },
      tags: ['utm', 'link', 'campaign', 'marketing', 'analytics', '캠페인', '추적'],
      icon: 'link'
    },
    {
      id: 'xml-json',
      path: '/tools/dev/xml-json',
      name: { ko: 'XML ↔ JSON 변환', en: 'XML to JSON Converter' },
      description: { ko: 'XML과 JSON 상호 변환', en: 'Convert between XML and JSON' },
      tags: ['xml', 'json', 'convert', 'data', '변환', '데이터'],
      icon: 'switch'
    },
    {
      id: 'json-csv',
      path: '/tools/dev/json-csv',
      name: { ko: 'JSON ↔ CSV 변환', en: 'JSON to CSV Converter' },
      description: { ko: 'JSON과 CSV 상호 변환', en: 'Convert between JSON and CSV' },
      tags: ['json', 'csv', 'convert', 'data', 'excel', '변환', '엑셀'],
      icon: 'switch'
    },
    {
      id: 'js-minifier',
      path: '/tools/dev/js-minifier',
      name: { ko: 'JavaScript 압축기', en: 'JavaScript Minifier' },
      description: { ko: 'JavaScript 코드 압축/난독화', en: 'Minify and obfuscate JavaScript' },
      tags: ['javascript', 'js', 'minify', 'compress', 'uglify', '압축', '난독화'],
      icon: 'code'
    },
    {
      id: 'html-minifier',
      path: '/tools/dev/html-minifier',
      name: { ko: 'HTML 압축기', en: 'HTML Minifier' },
      description: { ko: 'HTML 코드 압축 및 최적화', en: 'Minify and optimize HTML code' },
      tags: ['html', 'minify', 'compress', 'optimize', '압축', '최적화'],
      icon: 'code'
    },
    {
      id: 'robots-txt',
      path: '/tools/dev/robots-txt',
      name: { ko: 'Robots.txt 생성기', en: 'Robots.txt Generator' },
      description: { ko: 'robots.txt 파일 생성', en: 'Generate robots.txt files' },
      tags: ['robots', 'seo', 'crawl', 'bot', 'search', '검색엔진', '크롤러'],
      icon: 'document'
    },
    {
      id: 'og-preview',
      path: '/tools/dev/og-preview',
      name: { ko: 'OG 미리보기', en: 'Open Graph Preview' },
      description: { ko: 'Open Graph 메타태그 미리보기', en: 'Preview Open Graph meta tags' },
      tags: ['og', 'opengraph', 'meta', 'social', 'facebook', 'twitter', 'seo', '미리보기'],
      icon: 'eye'
    },
    {
      id: 'box-shadow',
      path: '/tools/dev/box-shadow',
      name: { ko: 'Box Shadow 생성기', en: 'Box Shadow Generator' },
      description: { ko: 'CSS box-shadow 생성기', en: 'Generate CSS box-shadow' },
      tags: ['css', 'shadow', 'box-shadow', 'design', 'style', '그림자', '디자인'],
      icon: 'color'
    },
    {
      id: 'text-escape',
      path: '/tools/dev/text-escape',
      name: { ko: '텍스트 이스케이프', en: 'Text Escape' },
      description: { ko: '특수문자 이스케이프 처리', en: 'Escape special characters' },
      tags: ['escape', 'text', 'special', 'characters', '이스케이프', '특수문자'],
      icon: 'code'
    },
    {
      id: 'color-contrast',
      path: '/tools/dev/color-contrast',
      name: { ko: '색상 대비 검사기', en: 'Color Contrast Checker' },
      description: { ko: 'WCAG 색상 대비 검사', en: 'Check WCAG color contrast' },
      tags: ['color', 'contrast', 'wcag', 'accessibility', 'a11y', '색상', '대비', '접근성'],
      icon: 'color'
    },
    {
      id: 'json-validator',
      path: '/tools/dev/json-validator',
      name: { ko: 'JSON 유효성 검사기', en: 'JSON Validator' },
      description: { ko: 'JSON 문법 오류 검사', en: 'Validate JSON syntax' },
      tags: ['json', 'validate', 'syntax', 'error', '검사', '유효성', '문법'],
      icon: 'code'
    }
  ],
  life: [
    {
      id: 'salary-calculator',
      path: '/tools/life/salary-calculator',
      name: { ko: '연봉 계산기', en: 'Salary Calculator' },
      description: { ko: '연봉 실수령액 계산', en: 'Calculate net salary' },
      tags: ['salary', 'tax', 'income', 'net', '연봉', '급여', '세금', '실수령'],
      icon: 'calculator'
    },
    {
      id: 'dday-calculator',
      path: '/tools/life/dday-calculator',
      name: { ko: 'D-Day 계산기', en: 'D-Day Calculator' },
      description: { ko: '날짜 간 일수 계산', en: 'Calculate days between dates' },
      tags: ['dday', 'd-day', 'date', 'countdown', '디데이', '날짜', '카운트다운'],
      icon: 'calendar'
    },
    {
      id: 'bmi-calculator',
      path: '/tools/life/bmi-calculator',
      name: { ko: 'BMI 계산기', en: 'BMI Calculator' },
      description: { ko: '체질량지수(BMI) 계산', en: 'Calculate Body Mass Index' },
      tags: ['bmi', 'body', 'mass', 'weight', 'health', '체질량', '비만도', '건강'],
      icon: 'health'
    },
    {
      id: 'loan-calculator',
      path: '/tools/life/loan-calculator',
      name: { ko: '대출 계산기', en: 'Loan Calculator' },
      description: { ko: '대출 이자 및 상환액 계산', en: 'Calculate loan interest and payments' },
      tags: ['loan', 'interest', 'mortgage', 'payment', '대출', '이자', '상환'],
      icon: 'calculator'
    },
    {
      id: 'age-calculator',
      path: '/tools/life/age-calculator',
      name: { ko: '나이 계산기', en: 'Age Calculator' },
      description: { ko: '만 나이 및 한국 나이 계산', en: 'Calculate age in different formats' },
      tags: ['age', 'birthday', 'date', '나이', '생년월일', '만나이'],
      icon: 'calendar'
    },
    {
      id: 'percent-calculator',
      path: '/tools/life/percent-calculator',
      name: { ko: '퍼센트 계산기', en: 'Percentage Calculator' },
      description: { ko: '백분율 계산', en: 'Calculate percentages' },
      tags: ['percent', 'percentage', 'ratio', '퍼센트', '백분율', '비율'],
      icon: 'calculator'
    },
    {
      id: 'compound-calculator',
      path: '/tools/life/compound-calculator',
      name: { ko: '복리 계산기', en: 'Compound Interest Calculator' },
      description: { ko: '복리 이자 계산', en: 'Calculate compound interest' },
      tags: ['compound', 'interest', 'investment', 'savings', '복리', '이자', '투자'],
      icon: 'calculator'
    },
    {
      id: 'tip-calculator',
      path: '/tools/life/tip-calculator',
      name: { ko: '팁 계산기', en: 'Tip Calculator' },
      description: { ko: '팁 및 더치페이 계산', en: 'Calculate tips and split bills' },
      tags: ['tip', 'split', 'bill', 'dutch', '팁', '더치페이', '계산'],
      icon: 'calculator'
    },
    {
      id: 'character-counter',
      path: '/tools/life/character-counter',
      name: { ko: '글자수 세기', en: 'Character Counter' },
      description: { ko: '글자수, 단어수, 바이트수 계산', en: 'Count characters, words, and bytes' },
      tags: ['character', 'word', 'count', 'byte', '글자수', '단어수', '바이트'],
      icon: 'text'
    },
    {
      id: 'unit-converter',
      path: '/tools/life/unit-converter',
      name: { ko: '단위 변환기', en: 'Unit Converter' },
      description: { ko: '길이, 무게, 온도 등 단위 변환', en: 'Convert length, weight, temperature, etc.' },
      tags: ['unit', 'convert', 'length', 'weight', 'temperature', '단위', '변환', '길이', '무게'],
      icon: 'switch'
    },
    {
      id: 'qr-generator',
      path: '/tools/life/qr-generator',
      name: { ko: 'QR 코드 생성기', en: 'QR Code Generator' },
      description: { ko: 'QR 코드 생성', en: 'Generate QR codes' },
      tags: ['qr', 'code', 'generate', 'barcode', 'scan', 'qr코드', '큐알'],
      icon: 'qr'
    },
    {
      id: 'qr-scanner',
      path: '/tools/life/qr-scanner',
      name: { ko: 'QR 코드 스캐너', en: 'QR Code Scanner' },
      description: { ko: 'QR 코드 스캔 및 인식', en: 'Scan and read QR codes' },
      tags: ['qr', 'scan', 'read', 'camera', 'decode', 'qr코드', '스캔'],
      icon: 'qr'
    },
    {
      id: 'barcode-generator',
      path: '/tools/life/barcode-generator',
      name: { ko: '바코드 생성기', en: 'Barcode Generator' },
      description: { ko: '다양한 형식의 바코드 생성', en: 'Generate various barcode formats' },
      tags: ['barcode', 'code128', 'ean', 'upc', '바코드', '생성'],
      icon: 'barcode'
    },
    {
      id: 'favicon-generator',
      path: '/tools/life/favicon-generator',
      name: { ko: '파비콘 생성기', en: 'Favicon Generator' },
      description: { ko: '이미지를 파비콘으로 변환', en: 'Convert images to favicon' },
      tags: ['favicon', 'icon', 'website', 'ico', '파비콘', '아이콘'],
      icon: 'image'
    },
    {
      id: 'image-compressor',
      path: '/tools/life/image-compressor',
      name: { ko: '이미지 압축', en: 'Image Compressor' },
      description: { ko: '이미지 파일 크기 줄이기', en: 'Reduce image file size' },
      tags: ['image', 'compress', 'resize', 'optimize', '이미지', '압축', '최적화'],
      icon: 'image'
    },
    {
      id: 'image-resizer',
      path: '/tools/life/image-resizer',
      name: { ko: '이미지 크기 조절', en: 'Image Resizer' },
      description: { ko: '이미지 해상도 변경', en: 'Resize image dimensions' },
      tags: ['image', 'resize', 'dimension', 'scale', '이미지', '크기', '해상도'],
      icon: 'image'
    },
    {
      id: 'image-converter',
      path: '/tools/life/image-converter',
      name: { ko: '이미지 포맷 변환', en: 'Image Converter' },
      description: { ko: 'PNG, JPG, WebP 등 형식 변환', en: 'Convert between PNG, JPG, WebP, etc.' },
      tags: ['image', 'convert', 'format', 'png', 'jpg', 'webp', '이미지', '변환'],
      icon: 'image'
    },
    {
      id: 'image-watermark',
      path: '/tools/life/image-watermark',
      name: { ko: '이미지 워터마크', en: 'Image Watermark' },
      description: { ko: '이미지에 워터마크 추가', en: 'Add watermark to images' },
      tags: ['image', 'watermark', 'copyright', 'protect', '이미지', '워터마크', '저작권'],
      icon: 'image'
    },
    {
      id: 'color-picker',
      path: '/tools/life/color-picker',
      name: { ko: '색상 피커', en: 'Color Picker' },
      description: { ko: '화면에서 색상 추출 (EyeDropper)', en: 'Pick colors from screen (EyeDropper)' },
      tags: ['color', 'picker', 'eyedropper', 'screen', '색상', '피커', '스포이드'],
      icon: 'color'
    },
    {
      id: 'background-remover',
      path: '/tools/life/background-remover',
      name: { ko: '배경 제거', en: 'Background Remover' },
      description: { ko: 'AI로 이미지 배경 자동 제거', en: 'Remove image background with AI' },
      tags: ['background', 'remove', 'ai', 'transparent', '배경', '제거', '투명'],
      icon: 'image'
    },
    {
      id: 'video-to-gif',
      path: '/tools/life/video-to-gif',
      name: { ko: '동영상 → GIF', en: 'Video to GIF' },
      description: { ko: '동영상을 GIF로 변환', en: 'Convert video to GIF' },
      tags: ['video', 'gif', 'convert', 'animation', '동영상', '움짤'],
      icon: 'video'
    },
    {
      id: 'screen-recorder',
      path: '/tools/life/screen-recorder',
      name: { ko: '화면 녹화', en: 'Screen Recorder' },
      description: { ko: '브라우저에서 화면 녹화', en: 'Record screen in browser' },
      tags: ['screen', 'record', 'capture', 'video', '화면', '녹화', '캡처'],
      icon: 'video'
    },
    {
      id: 'ocr',
      path: '/tools/life/ocr',
      name: { ko: 'OCR 텍스트 인식', en: 'OCR Text Recognition' },
      description: { ko: '이미지에서 텍스트 추출', en: 'Extract text from images' },
      tags: ['ocr', 'text', 'recognition', 'extract', 'scan', '문자', '인식', '추출'],
      icon: 'text'
    },
    {
      id: 'base-converter',
      path: '/tools/life/base-converter',
      name: { ko: '진법 변환기', en: 'Base Converter' },
      description: { ko: '2진수, 8진수, 16진수 변환', en: 'Convert binary, octal, hex' },
      tags: ['base', 'binary', 'octal', 'hex', 'decimal', '진법', '2진수', '16진수'],
      icon: 'calculator'
    },
    {
      id: 'ascii-unicode',
      path: '/tools/life/ascii-unicode',
      name: { ko: 'ASCII/유니코드 변환', en: 'ASCII/Unicode Converter' },
      description: { ko: '문자와 코드 변환', en: 'Convert characters and codes' },
      tags: ['ascii', 'unicode', 'char', 'code', '아스키', '유니코드', '문자'],
      icon: 'text'
    },
    {
      id: 'emoji-picker',
      path: '/tools/life/emoji-picker',
      name: { ko: '이모지 피커', en: 'Emoji Picker' },
      description: { ko: '이모지 검색 및 복사', en: 'Search and copy emojis' },
      tags: ['emoji', 'emoticon', 'copy', '이모지', '이모티콘', '복사'],
      icon: 'emoji'
    },
    {
      id: 'dead-pixel-test',
      path: '/tools/life/dead-pixel-test',
      name: { ko: '데드픽셀 테스트', en: 'Dead Pixel Test' },
      description: { ko: '모니터 불량 픽셀 검사', en: 'Test for dead pixels on monitor' },
      tags: ['dead', 'pixel', 'test', 'monitor', 'screen', '데드픽셀', '모니터', '화면'],
      icon: 'monitor'
    },
    {
      id: 'pixel-fixer',
      path: '/tools/life/pixel-fixer',
      name: { ko: '픽셀 복구', en: 'Pixel Fixer' },
      description: { ko: '스턱 픽셀 복구 시도', en: 'Try to fix stuck pixels' },
      tags: ['pixel', 'fix', 'stuck', 'repair', '픽셀', '복구', '수리'],
      icon: 'monitor'
    },
    {
      id: 'screen-burn-test',
      path: '/tools/life/screen-burn-test',
      name: { ko: '번인 테스트', en: 'Screen Burn-in Test' },
      description: { ko: '화면 번인 현상 검사', en: 'Test for screen burn-in' },
      tags: ['burn', 'screen', 'test', 'oled', '번인', '화면', '테스트'],
      icon: 'monitor'
    },
    {
      id: 'screen-color-test',
      path: '/tools/life/screen-color-test',
      name: { ko: '화면 색상 테스트', en: 'Screen Color Test' },
      description: { ko: '모니터 색상 정확도 테스트', en: 'Test monitor color accuracy' },
      tags: ['color', 'screen', 'test', 'calibration', '색상', '화면', '모니터'],
      icon: 'monitor'
    },
    {
      id: 'lottery-generator',
      path: '/tools/life/lottery-generator',
      name: { ko: '로또 번호 생성기', en: 'Lottery Number Generator' },
      description: { ko: '무작위 로또 번호 생성', en: 'Generate random lottery numbers' },
      tags: ['lottery', 'lotto', 'random', 'number', '로또', '번호', '랜덤'],
      icon: 'dice'
    },
    {
      id: 'roulette',
      path: '/tools/life/roulette',
      name: { ko: '룰렛', en: 'Roulette' },
      description: { ko: '커스텀 룰렛 돌리기', en: 'Spin custom roulette wheel' },
      tags: ['roulette', 'spin', 'random', 'wheel', '룰렛', '랜덤', '선택'],
      icon: 'dice'
    },
    {
      id: 'dice-roller',
      path: '/tools/life/dice-roller',
      name: { ko: '주사위', en: 'Dice Roller' },
      description: { ko: '가상 주사위 굴리기', en: 'Roll virtual dice' },
      tags: ['dice', 'roll', 'random', 'game', '주사위', '게임', '랜덤'],
      icon: 'dice'
    },
    {
      id: 'coin-flip',
      path: '/tools/life/coin-flip',
      name: { ko: '동전 던지기', en: 'Coin Flip' },
      description: { ko: '가상 동전 던지기', en: 'Flip a virtual coin' },
      tags: ['coin', 'flip', 'random', 'heads', 'tails', '동전', '랜덤'],
      icon: 'dice'
    },
    {
      id: 'typing-test',
      path: '/tools/life/typing-test',
      name: { ko: '타자 연습', en: 'Typing Test' },
      description: { ko: '타자 속도 측정', en: 'Measure typing speed' },
      tags: ['typing', 'speed', 'test', 'wpm', '타자', '속도', '연습'],
      icon: 'keyboard'
    },
    {
      id: 'reaction-test',
      path: '/tools/life/reaction-test',
      name: { ko: '반응 속도 테스트', en: 'Reaction Test' },
      description: { ko: '반응 속도 측정', en: 'Measure reaction time' },
      tags: ['reaction', 'speed', 'test', 'reflex', '반응', '속도', '테스트'],
      icon: 'bolt'
    },
    {
      id: 'speech-to-text',
      path: '/tools/life/speech-to-text',
      name: { ko: '음성을 텍스트로', en: 'Speech to Text' },
      description: { ko: '음성을 실시간으로 텍스트로 변환', en: 'Convert speech to text in real-time' },
      tags: ['speech', 'voice', 'text', 'stt', 'transcribe', '음성', '변환', '받아쓰기'],
      icon: 'microphone'
    },
    {
      id: 'text-to-speech',
      path: '/tools/life/text-to-speech',
      name: { ko: '텍스트를 음성으로', en: 'Text to Speech' },
      description: { ko: '텍스트를 음성으로 읽어주기', en: 'Read text aloud with speech synthesis' },
      tags: ['text', 'speech', 'voice', 'tts', 'read', '음성', '읽기', '낭독'],
      icon: 'speaker'
    },
    {
      id: 'image-crop',
      path: '/tools/life/image-crop',
      name: { ko: '이미지 자르기', en: 'Image Crop' },
      description: { ko: '이미지를 원하는 영역으로 자르기', en: 'Crop images to desired area' },
      tags: ['image', 'crop', 'cut', 'resize', '이미지', '자르기', '크롭'],
      icon: 'crop'
    },
    {
      id: 'meme-generator',
      path: '/tools/life/meme-generator',
      name: { ko: '밈 생성기', en: 'Meme Generator' },
      description: { ko: '이미지에 텍스트를 추가하여 밈 만들기', en: 'Create memes by adding text to images' },
      tags: ['meme', 'image', 'text', 'funny', '밈', '짤', '생성'],
      icon: 'image'
    },
    {
      id: 'pomodoro-timer',
      path: '/tools/life/pomodoro-timer',
      name: { ko: '뽀모도로 타이머', en: 'Pomodoro Timer' },
      description: { ko: '집중력 향상을 위한 뽀모도로 타이머', en: 'Pomodoro timer for better focus' },
      tags: ['pomodoro', 'timer', 'focus', 'productivity', '뽀모도로', '타이머', '집중'],
      icon: 'clock'
    },
    {
      id: 'image-rotate',
      path: '/tools/life/image-rotate',
      name: { ko: '이미지 회전/뒤집기', en: 'Image Rotate/Flip' },
      description: { ko: '이미지를 회전하거나 뒤집기', en: 'Rotate or flip images' },
      tags: ['image', 'rotate', 'flip', 'mirror', '이미지', '회전', '뒤집기', '반전'],
      icon: 'image'
    },
    {
      id: 'exif-remover',
      path: '/tools/life/exif-remover',
      name: { ko: 'EXIF 메타데이터 제거', en: 'EXIF Metadata Remover' },
      description: { ko: '이미지에서 EXIF 메타데이터 제거', en: 'Remove EXIF metadata from images' },
      tags: ['exif', 'metadata', 'privacy', 'gps', 'location', '메타데이터', '개인정보', '위치'],
      icon: 'shield'
    },
    {
      id: 'ip-lookup',
      path: '/tools/life/ip-lookup',
      name: { ko: 'IP 주소 조회', en: 'IP Address Lookup' },
      description: { ko: 'IP 주소로 위치 정보 조회', en: 'Look up location from IP address' },
      tags: ['ip', 'address', 'location', 'geo', 'lookup', 'whois', 'IP주소', '위치', '조회'],
      icon: 'globe'
    },
    {
      id: 'countdown-timer',
      path: '/tools/life/countdown-timer',
      name: { ko: '카운트다운 타이머', en: 'Countdown Timer' },
      description: { ko: '목표 시간까지 카운트다운', en: 'Countdown to target time' },
      tags: ['countdown', 'timer', 'alarm', 'time', '카운트다운', '타이머', '알람'],
      icon: 'clock'
    },
    {
      id: 'stopwatch',
      path: '/tools/life/stopwatch',
      name: { ko: '스톱워치', en: 'Stopwatch' },
      description: { ko: '시간 측정용 스톱워치', en: 'Stopwatch for time measurement' },
      tags: ['stopwatch', 'timer', 'lap', 'time', '스톱워치', '시간', '랩'],
      icon: 'clock'
    },
    {
      id: 'aspect-ratio',
      path: '/tools/life/aspect-ratio',
      name: { ko: '화면비율 계산기', en: 'Aspect Ratio Calculator' },
      description: { ko: '화면 비율 계산 및 해상도 변환', en: 'Calculate aspect ratios and convert resolutions' },
      tags: ['aspect', 'ratio', 'resolution', 'screen', 'width', 'height', '화면비', '해상도', '비율'],
      icon: 'monitor'
    },
    {
      id: 'ai-detector',
      path: '/tools/life/ai-detector',
      name: { ko: 'AI 글 감지기', en: 'AI Text Detector' },
      description: { ko: 'AI가 작성한 글인지 감지', en: 'Detect AI-generated text' },
      tags: ['ai', 'detect', 'chatgpt', 'gpt', 'text', 'writing', 'AI감지', '인공지능'],
      icon: 'search'
    },
    {
      id: 'youtube-thumbnail',
      path: '/tools/life/youtube-thumbnail',
      name: { ko: '유튜브 썸네일 다운로드', en: 'YouTube Thumbnail Downloader' },
      description: { ko: '유튜브 영상 썸네일 다운로드', en: 'Download YouTube video thumbnails' },
      tags: ['youtube', 'thumbnail', 'download', 'video', 'image', '유튜브', '썸네일'],
      icon: 'video'
    },
    {
      id: 'morse-code',
      path: '/tools/life/morse-code',
      name: { ko: '모스 부호 변환기', en: 'Morse Code Converter' },
      description: { ko: '텍스트와 모스 부호 변환', en: 'Convert text to Morse code and vice versa' },
      tags: ['morse', 'code', 'convert', 'text', '모스부호', '변환'],
      icon: 'text'
    },
    {
      id: 'noise-generator',
      path: '/tools/life/noise-generator',
      name: { ko: '백색소음 생성기', en: 'White Noise Generator' },
      description: { ko: '집중과 수면을 위한 백색소음', en: 'White noise for focus and sleep' },
      tags: ['noise', 'white', 'pink', 'brown', 'sleep', 'focus', '백색소음', '집중', '수면'],
      icon: 'speaker'
    },
    {
      id: 'sleep-calculator',
      path: '/tools/life/sleep-calculator',
      name: { ko: '수면 계산기', en: 'Sleep Calculator' },
      description: { ko: '최적의 수면/기상 시간 계산', en: 'Calculate optimal sleep and wake times' },
      tags: ['sleep', 'calculator', 'wake', 'cycle', '수면', '기상', '계산기', '잠'],
      icon: 'clock'
    },
    {
      id: 'fake-chat',
      path: '/tools/life/fake-chat',
      name: { ko: '가짜 카톡 생성기', en: 'Fake Chat Generator' },
      description: { ko: '가짜 채팅 스크린샷 생성', en: 'Create fake chat screenshots' },
      tags: ['fake', 'chat', 'kakao', 'message', '가짜', '카톡', '채팅', '메시지'],
      icon: 'text'
    },
    {
      id: 'fancy-text',
      path: '/tools/life/fancy-text',
      name: { ko: '예쁜 글씨 생성기', en: 'Fancy Text Generator' },
      description: { ko: '유니코드 스타일 텍스트 변환', en: 'Convert to Unicode style text' },
      tags: ['fancy', 'text', 'unicode', 'font', 'aesthetic', '예쁜', '글씨', '폰트', 'SNS'],
      icon: 'text'
    },
    {
      id: 'webcam-test',
      path: '/tools/life/webcam-test',
      name: { ko: '웹캠 테스트', en: 'Webcam Test' },
      description: { ko: '웹캠 작동 테스트', en: 'Test your webcam' },
      tags: ['webcam', 'camera', 'test', 'video', '웹캠', '카메라', '테스트', '화상'],
      icon: 'video'
    },
    {
      id: 'mic-test',
      path: '/tools/life/mic-test',
      name: { ko: '마이크 테스트', en: 'Microphone Test' },
      description: { ko: '마이크 작동 테스트', en: 'Test your microphone' },
      tags: ['microphone', 'mic', 'test', 'audio', '마이크', '테스트', '음성', '녹음'],
      icon: 'microphone'
    },
    {
      id: 'image-blur',
      path: '/tools/life/image-blur',
      name: { ko: '이미지 모자이크', en: 'Image Blur/Mosaic' },
      description: { ko: '이미지 부분 블러/모자이크', en: 'Blur or pixelate image areas' },
      tags: ['image', 'blur', 'mosaic', 'pixelate', 'censor', '이미지', '모자이크', '블러', '가리기'],
      icon: 'eye'
    },
    {
      id: 'korean-name-generator',
      path: '/tools/life/korean-name-generator',
      name: { ko: '한국 이름 생성기', en: 'Korean Name Generator' },
      description: { ko: '랜덤 한국 이름 생성', en: 'Generate random Korean names' },
      tags: ['korean', 'name', 'generator', 'random', '한국', '이름', '생성기', '작명'],
      icon: 'text'
    }
  ],
  pdf: [
    {
      id: 'merge-pdf',
      path: '/tools/pdf/merge-pdf',
      name: { ko: 'PDF 병합', en: 'Merge PDF' },
      description: { ko: '여러 PDF를 하나로 합치기', en: 'Combine multiple PDFs into one' },
      tags: ['pdf', 'merge', 'combine', 'join', '병합', '합치기'],
      icon: 'document'
    },
    {
      id: 'split-pdf',
      path: '/tools/pdf/split-pdf',
      name: { ko: 'PDF 분할', en: 'Split PDF' },
      description: { ko: 'PDF 페이지 나누기', en: 'Split PDF pages' },
      tags: ['pdf', 'split', 'separate', 'divide', '분할', '나누기'],
      icon: 'document'
    },
    {
      id: 'compress-pdf',
      path: '/tools/pdf/compress-pdf',
      name: { ko: 'PDF 압축', en: 'Compress PDF' },
      description: { ko: 'PDF 파일 크기 줄이기', en: 'Reduce PDF file size' },
      tags: ['pdf', 'compress', 'reduce', 'size', '압축', '용량'],
      icon: 'document'
    },
    {
      id: 'pdf-to-image',
      path: '/tools/pdf/pdf-to-image',
      name: { ko: 'PDF → 이미지', en: 'PDF to Image' },
      description: { ko: 'PDF를 이미지로 변환', en: 'Convert PDF to images' },
      tags: ['pdf', 'image', 'convert', 'jpg', 'png', '이미지', '변환'],
      icon: 'image'
    },
    {
      id: 'image-to-pdf',
      path: '/tools/pdf/image-to-pdf',
      name: { ko: '이미지 → PDF', en: 'Image to PDF' },
      description: { ko: '이미지를 PDF로 변환', en: 'Convert images to PDF' },
      tags: ['image', 'pdf', 'convert', 'jpg', 'png', '이미지', 'pdf변환'],
      icon: 'document'
    },
    {
      id: 'rotate-pdf',
      path: '/tools/pdf/rotate-pdf',
      name: { ko: 'PDF 페이지 회전', en: 'Rotate PDF Pages' },
      description: { ko: 'PDF 페이지를 회전', en: 'Rotate PDF pages' },
      tags: ['pdf', 'rotate', 'orientation', 'page', '회전', '페이지'],
      icon: 'document'
    },
    {
      id: 'watermark-pdf',
      path: '/tools/pdf/watermark-pdf',
      name: { ko: 'PDF 워터마크', en: 'PDF Watermark' },
      description: { ko: 'PDF에 텍스트 워터마크 추가', en: 'Add text watermark to PDF' },
      tags: ['pdf', 'watermark', 'text', 'copyright', '워터마크', '저작권'],
      icon: 'document'
    },
    {
      id: 'delete-pdf',
      path: '/tools/pdf/delete-pdf',
      name: { ko: 'PDF 페이지 삭제', en: 'Delete PDF Pages' },
      description: { ko: 'PDF에서 원하는 페이지 삭제', en: 'Delete selected pages from PDF' },
      tags: ['pdf', 'delete', 'remove', 'page', '삭제', '페이지'],
      icon: 'document'
    },
    {
      id: 'reorder-pdf',
      path: '/tools/pdf/reorder-pdf',
      name: { ko: 'PDF 페이지 재정렬', en: 'Reorder PDF Pages' },
      description: { ko: 'PDF 페이지 순서 변경', en: 'Reorder PDF page sequence' },
      tags: ['pdf', 'reorder', 'sort', 'arrange', 'page', '재정렬', '순서'],
      icon: 'document'
    }
  ],
  game: [
    {
      id: '2048',
      path: '/tools/game/2048',
      name: { ko: '2048', en: '2048' },
      description: { ko: '숫자 블록을 합쳐 2048을 만드세요', en: 'Merge number blocks to reach 2048' },
      tags: ['game', 'puzzle', '게임', '퍼즐', '2048', '숫자'],
      icon: 'puzzle'
    },
    {
      id: 'minesweeper',
      path: '/tools/game/minesweeper',
      name: { ko: '지뢰찾기', en: 'Minesweeper' },
      description: { ko: '클래식 지뢰찾기 게임', en: 'Classic minesweeper game' },
      tags: ['game', 'puzzle', 'minesweeper', '게임', '지뢰찾기', '퍼즐'],
      icon: 'puzzle'
    },
    {
      id: 'snake',
      path: '/tools/game/snake',
      name: { ko: '스네이크', en: 'Snake' },
      description: { ko: '뱀을 조종해 먹이를 먹는 게임', en: 'Control the snake to eat food' },
      tags: ['game', 'snake', 'arcade', '게임', '스네이크', '뱀'],
      icon: 'puzzle'
    },
    {
      id: 'memory-game',
      path: '/tools/game/memory-game',
      name: { ko: '기억력 테스트', en: 'Memory Game' },
      description: { ko: '카드를 뒤집어 짝을 맞추세요', en: 'Flip cards and match pairs' },
      tags: ['game', 'memory', 'card', '게임', '기억력', '카드'],
      icon: 'puzzle'
    },
    {
      id: 'tetris',
      path: '/tools/game/tetris',
      name: { ko: '테트리스', en: 'Tetris' },
      description: { ko: '블록을 쌓아 줄을 완성하세요', en: 'Stack blocks to complete lines' },
      tags: ['game', 'tetris', 'puzzle', 'block', '게임', '테트리스', '블록'],
      icon: 'puzzle'
    }
  ]
};

// Flatten all tools for search
const ALL_TOOLS = [
  ...TOOLS_DATA.dev.map(t => ({ ...t, category: 'dev' })),
  ...TOOLS_DATA.life.map(t => ({ ...t, category: 'life' })),
  ...TOOLS_DATA.pdf.map(t => ({ ...t, category: 'pdf' })),
  ...TOOLS_DATA.game.map(t => ({ ...t, category: 'game' }))
];

// Popular tools (manually curated for homepage)
const POPULAR_TOOLS = [
  'merge-pdf',
  'background-remover',
  'qr-generator',
  'json-formatter',
  'image-compressor',
  'base64'
];

// Recently added tools
const NEW_TOOLS = [
  'json-validator',
  'ai-detector',
  'youtube-thumbnail',
  'morse-code',
  'noise-generator',
  'html-minifier',
  'robots-txt',
  'og-preview',
  'box-shadow',
  'ip-lookup'
];

/**
 * Get tool by ID
 */
function getToolById(id) {
  return ALL_TOOLS.find(t => t.id === id);
}

/**
 * Get tools by category
 */
function getToolsByCategory(category) {
  return TOOLS_DATA[category] || [];
}

/**
 * Get popular tools
 */
function getPopularTools() {
  return POPULAR_TOOLS.map(id => getToolById(id)).filter(Boolean);
}

/**
 * Get new tools
 */
function getNewTools() {
  return NEW_TOOLS.map(id => getToolById(id)).filter(Boolean);
}

/**
 * Get localized name
 */
function getToolName(tool, lang = 'ko') {
  return tool.name[lang] || tool.name.ko;
}

/**
 * Get localized description
 */
function getToolDescription(tool, lang = 'ko') {
  return tool.description[lang] || tool.description.ko;
}

/**
 * Get localized path (adds /en prefix for English)
 */
function getToolPath(tool, lang = 'ko') {
  return lang === 'en' ? `/en${tool.path}` : tool.path;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TOOLS_DATA,
    ALL_TOOLS,
    POPULAR_TOOLS,
    NEW_TOOLS,
    getToolById,
    getToolsByCategory,
    getPopularTools,
    getNewTools,
    getToolName,
    getToolDescription,
    getToolPath
  };
}
