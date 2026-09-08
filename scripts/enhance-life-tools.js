const fs = require('fs');
const path = require('path');

const lifeHowItWorks = {
  'age-calculator': {
    ko: '나이 계산기는 생년월일과 기준 날짜 사이의 차이를 연, 월, 일 단위로 계산합니다. JavaScript Date 객체를 사용하여 윤년, 각 월의 일수 차이를 정확하게 처리합니다. 만 나이는 생일이 지났는지 여부에 따라 결정되며, 한국 나이(세는 나이)는 출생 시 1살에서 시작하여 매년 1월 1일에 1살이 추가됩니다.',
    en: 'The age calculator computes the difference between a birth date and a reference date in years, months, and days. It uses JavaScript Date objects to accurately handle leap years and varying month lengths. International age depends on whether the birthday has passed, while Korean age starts at 1 at birth and increments every January 1st.'
  },
  'ai-detector': {
    ko: 'AI 텍스트 감지기는 통계적 언어 분석을 통해 텍스트가 AI에 의해 생성되었을 가능성을 추정합니다. 문장 길이의 균일성, 어휘 다양성(TTR), 반복 패턴, 접속사 사용 빈도, 문장 시작 다양성 등 여러 지표를 종합적으로 분석합니다. AI 생성 텍스트는 일반적으로 문장 길이가 균일하고 어휘 반복이 적으며 전형적인 구조를 따르는 경향이 있습니다.',
    en: 'The AI text detector estimates the likelihood of text being AI-generated through statistical language analysis. It analyzes multiple indicators including sentence length uniformity, vocabulary diversity (TTR), repetition patterns, conjunction frequency, and sentence starter variety. AI-generated text tends to have uniform sentence lengths, less vocabulary repetition, and follows typical structural patterns.'
  },
  'ascii-unicode': {
    ko: 'ASCII/유니코드 변환기는 문자와 숫자 코드 포인트 사이의 매핑을 수행합니다. ASCII는 7비트(0~127)로 영문 알파벳, 숫자, 제어문자를 표현하며, 유니코드는 전 세계 모든 문자 체계를 포함하는 21비트 코드 포인트 체계입니다. JavaScript의 charCodeAt()과 String.fromCharCode()를 사용하여 문자를 코드 포인트로, 코드 포인트를 문자로 변환합니다.',
    en: 'The ASCII/Unicode converter maps between characters and numeric code points. ASCII uses 7 bits (0-127) for English letters, digits, and control characters. Unicode encompasses all world writing systems with 21-bit code points. It uses JavaScript\'s charCodeAt() and String.fromCharCode() to convert between characters and their numeric representations.'
  },
  'aspect-ratio': {
    ko: '화면 비율 계산기는 너비와 높이의 최대공약수(GCD)를 유클리드 알고리즘으로 구하여 비율을 단순화합니다. 예를 들어 1920×1080의 GCD는 120이므로 16:9가 됩니다. 한쪽 치수와 비율이 주어지면 다른 쪽을 자동으로 계산하며, 일반적인 비율(16:9, 4:3, 21:9 등)의 프리셋도 제공합니다.',
    en: 'The aspect ratio calculator uses the Euclidean algorithm to find the GCD (Greatest Common Divisor) of width and height, simplifying the ratio. For example, 1920×1080 has a GCD of 120, yielding 16:9. Given one dimension and a ratio, it automatically calculates the other, with presets for common ratios (16:9, 4:3, 21:9, etc.).'
  },
  'background-remover': {
    ko: '배경 제거 도구는 AI 세그멘테이션 모델을 사용하여 이미지에서 전경(주요 피사체)과 배경을 분리합니다. 딥러닝 모델이 픽셀 단위로 전경 확률을 예측하고, 임계값을 기준으로 마스크를 생성합니다. 생성된 마스크를 알파 채널에 적용하여 배경을 투명하게 만들며, Canvas API로 결과를 렌더링합니다.',
    en: 'The background remover uses an AI segmentation model to separate foreground (main subject) from background. A deep learning model predicts foreground probability per pixel and generates a mask based on a threshold. The mask is applied to the alpha channel to make the background transparent, and the Canvas API renders the result.'
  },
  'barcode-generator': {
    ko: '바코드 생성기는 입력 데이터를 바코드 심볼로지 규격에 따라 흑백 바(bar)의 패턴으로 인코딩합니다. Code 128은 128개의 ASCII 문자를 지원하며, EAN-13은 상품 식별에 사용되는 13자리 숫자 코드입니다. 각 문자가 특정 바 너비 패턴으로 매핑되고, 시작/종료 패턴과 체크섬 디짓이 추가됩니다.',
    en: 'The barcode generator encodes input data into black-and-white bar patterns following barcode symbology standards. Code 128 supports 128 ASCII characters, while EAN-13 is a 13-digit numeric code for product identification. Each character maps to a specific bar width pattern, with start/stop patterns and checksum digits appended.'
  },
  'base-converter': {
    ko: '진법 변환기는 숫자를 다른 기수(base) 체계로 변환합니다. 10진수를 목표 진법으로 변환할 때 숫자를 기수로 나누고 나머지를 역순으로 배열합니다. 예를 들어 255를 16진법으로 변환하면 255÷16=15 나머지 15이므로 FF가 됩니다. 2진법(컴퓨터), 8진법(유닉스 권한), 16진법(색상 코드, 메모리 주소)이 주로 사용됩니다.',
    en: 'The base converter transforms numbers between different radix systems. To convert a decimal to a target base, divide repeatedly by the radix and arrange remainders in reverse. For example, 255 in hexadecimal: 255÷16=15 remainder 15, yielding FF. Common bases include binary (2, computers), octal (8, Unix permissions), and hexadecimal (16, colors, memory addresses).'
  },
  'bmi-calculator': {
    ko: 'BMI(체질량지수)는 체중(kg)을 키(m)의 제곱으로 나눈 값입니다. 공식: BMI = 체중 ÷ (키 × 키). 예를 들어 70kg, 175cm이면 BMI = 70 ÷ (1.75 × 1.75) = 22.86입니다. WHO 기준으로 18.5 미만은 저체중, 18.5~24.9는 정상, 25~29.9는 과체중, 30 이상은 비만으로 분류합니다. 아시아-태평양 기준은 23 이상을 과체중으로 봅니다.',
    en: 'BMI (Body Mass Index) divides weight (kg) by height (m) squared. Formula: BMI = weight ÷ (height × height). For example, 70kg at 175cm: BMI = 70 ÷ (1.75 × 1.75) = 22.86. WHO classifies under 18.5 as underweight, 18.5-24.9 as normal, 25-29.9 as overweight, and 30+ as obese. Asia-Pacific criteria consider 23+ as overweight.'
  },
  'character-counter': {
    ko: '글자수 세기 도구는 입력 텍스트의 문자, 단어, 문장, 단락 수를 실시간으로 계산합니다. 문자 수는 String.length로, 공백 제외 문자 수는 정규식으로 공백을 제거한 후 계산합니다. 단어 수는 공백으로 분리하여 세고, 문장 수는 마침표·물음표·느낌표를 기준으로 카운트합니다. 바이트 수는 TextEncoder로 UTF-8 인코딩 후 측정합니다.',
    en: 'The character counter calculates characters, words, sentences, and paragraphs in real time. Character count uses String.length, while characters without spaces are counted after regex whitespace removal. Words are counted by splitting on whitespace, sentences by counting periods, question marks, and exclamation marks. Byte count is measured after UTF-8 encoding via TextEncoder.'
  },
  'coin-flip': {
    ko: '동전 던지기는 crypto.getRandomValues()를 사용하여 암호학적으로 안전한 난수를 생성합니다. 0 또는 1의 결과를 동전 앞면(Head)과 뒷면(Tail)에 매핑합니다. CSS 애니메이션으로 동전이 회전하는 효과를 구현하며, 누적 통계(앞면/뒷면 비율)를 표시하여 확률의 대수의 법칙을 관찰할 수 있습니다.',
    en: 'Coin flip uses crypto.getRandomValues() to generate cryptographically secure random numbers. Results of 0 or 1 are mapped to heads and tails. CSS animations simulate coin rotation, and cumulative statistics (heads/tails ratio) are displayed so you can observe the law of large numbers in action.'
  },
  'color-picker': {
    ko: '색상 추출기는 업로드된 이미지를 Canvas에 렌더링하고, 클릭 위치의 픽셀 데이터를 getImageData()로 읽어 RGB 값을 추출합니다. 추출된 RGB 값을 HEX, HSL 등 다양한 형식으로 변환하여 표시합니다. 이미지 전체의 주요 색상을 자동 추출할 때는 K-means 클러스터링 또는 중앙값 분할(Median Cut) 알고리즘을 사용합니다.',
    en: 'The color picker renders uploaded images on a Canvas and reads pixel data at click positions via getImageData() to extract RGB values. Extracted RGB values are converted and displayed in HEX, HSL, and other formats. For automatic dominant color extraction, K-means clustering or Median Cut algorithms analyze the entire image.'
  },
  'compound-calculator': {
    ko: '복리 계산기는 A = P(1 + r/n)^(nt) 공식을 사용합니다. P는 원금, r은 연이율, n은 복리 횟수, t는 기간(년)입니다. 예를 들어 1000만원을 연 5% 복리로 10년 투자하면 A = 10,000,000 × (1.05)^10 = 16,288,946원이 됩니다. 단리(P × r × t)와 달리 이자에 이자가 붙어 시간이 지날수록 차이가 커집니다.',
    en: 'The compound calculator uses A = P(1 + r/n)^(nt). P is principal, r is annual rate, n is compounding frequency, t is time in years. For example, $10,000 at 5% compounded annually for 10 years: A = $10,000 × (1.05)^10 = $16,288.95. Unlike simple interest (P × r × t), compound interest earns interest on interest, growing exponentially over time.'
  },
  'countdown-timer': {
    ko: '카운트다운 타이머는 목표 시각과 현재 시각의 차이를 밀리초 단위로 계산하고, 이를 일/시/분/초로 변환하여 표시합니다. setInterval 또는 requestAnimationFrame으로 매 초(또는 더 빈번하게) 업데이트하며, Performance API를 활용하여 정확한 시간 측정을 수행합니다. 알림 기능은 Notification API로 구현됩니다.',
    en: 'The countdown timer calculates the difference between target and current time in milliseconds, converting to days/hours/minutes/seconds for display. It updates every second (or more frequently) via setInterval or requestAnimationFrame, using the Performance API for accurate timing. Notification features are implemented via the Notification API.'
  },
  'dday-calculator': {
    ko: 'D-Day 계산기는 두 날짜 사이의 차이를 밀리초로 계산한 후 86,400,000(하루의 밀리초)으로 나누어 일수를 구합니다. 시간대와 일광절약시간(DST)을 고려하여 정확한 날짜 차이를 계산합니다. D-100, D-30 같은 주요 마일스톤을 자동으로 표시하고, 근무일(주말 제외) 기준 계산도 지원합니다.',
    en: 'The D-Day calculator computes the difference between two dates in milliseconds, then divides by 86,400,000 (milliseconds per day) to get the day count. It accounts for timezones and daylight saving time for accurate date differences. Key milestones like D-100 and D-30 are displayed automatically, with business day (excluding weekends) calculation support.'
  },
  'dead-pixel-test': {
    ko: '데드픽셀 테스트는 화면 전체를 단일 색상(빨강, 초록, 파랑, 흰색, 검정)으로 채워 불량 픽셀을 육안으로 확인하게 합니다. 전체화면 모드로 전환하여 UI 요소가 방해하지 않도록 하고, 키보드나 클릭으로 색상을 전환합니다. 데드픽셀은 항상 검은색, 핫픽셀은 항상 밝은색, 스턱픽셀은 특정 색상에 고정되어 나타납니다.',
    en: 'The dead pixel test fills the entire screen with solid colors (red, green, blue, white, black) to visually identify defective pixels. Full-screen mode eliminates UI distractions, with keyboard or click to switch colors. Dead pixels appear always black, hot pixels always bright, and stuck pixels remain fixed on a specific color.'
  },
  'dice-roller': {
    ko: '주사위 굴리기는 crypto.getRandomValues()로 암호학적 난수를 생성하여 1~6(또는 사용자 지정 면수)의 균일한 분포를 만듭니다. 모듈로 바이어스를 방지하기 위해 적절한 범위의 난수만 수용합니다. CSS 3D transform으로 주사위 회전 애니메이션을 구현하고, 여러 개의 주사위를 동시에 굴려 합계를 표시합니다.',
    en: 'Dice rolling uses crypto.getRandomValues() for cryptographic randomness, producing uniform distribution from 1-6 (or custom sides). It rejects values outside the acceptable range to prevent modulo bias. CSS 3D transforms animate dice rotation, and multiple dice can be rolled simultaneously with totals displayed.'
  },
  'emoji-picker': {
    ko: '이모지 검색기는 유니코드 이모지 데이터베이스를 기반으로 카테고리별·키워드별 검색을 지원합니다. 각 이모지의 유니코드 코드 포인트, 이름, 카테고리, 관련 키워드를 인덱싱하여 빠른 검색을 제공합니다. 클릭하면 navigator.clipboard.writeText()로 클립보드에 복사되며, 최근 사용 이모지는 localStorage에 저장됩니다.',
    en: 'The emoji picker supports category and keyword search based on the Unicode emoji database. Each emoji\'s Unicode code point, name, category, and related keywords are indexed for fast search. Clicking copies to clipboard via navigator.clipboard.writeText(), and recently used emojis are stored in localStorage.'
  },
  'exif-remover': {
    ko: 'EXIF 제거 도구는 JPEG 파일의 메타데이터 세그먼트를 제거합니다. JPEG 파일은 SOI 마커 뒤에 APP1(EXIF), APP2(ICC 프로파일) 등의 메타데이터 세그먼트가 포함됩니다. 이 도구는 이미지를 Canvas에 그린 후 toBlob()으로 다시 인코딩하여 EXIF 데이터(GPS 위치, 카메라 정보, 촬영 시간 등)를 제거합니다.',
    en: 'The EXIF remover strips metadata segments from JPEG files. JPEG files contain metadata segments like APP1 (EXIF) and APP2 (ICC profile) after the SOI marker. This tool draws the image on a Canvas and re-encodes via toBlob(), stripping EXIF data including GPS location, camera info, and capture timestamps.'
  },
  'fake-chat': {
    ko: '가짜 채팅 생성기는 메신저 UI를 Canvas API 또는 HTML 요소로 재현하여 대화 스크린샷을 만듭니다. 사용자가 입력한 메시지, 발신자 이름, 시간, 프로필 이미지를 배치하고, 실제 메신저와 유사한 말풍선 스타일을 적용합니다. 완성된 대화 화면을 이미지로 내보내기하여 저장할 수 있습니다.',
    en: 'The fake chat generator recreates messenger UIs using Canvas API or HTML elements to create conversation screenshots. User-entered messages, sender names, timestamps, and profile images are arranged with bubble styles matching real messengers. The completed conversation can be exported as an image.'
  },
  'fancy-text': {
    ko: '특수문자 생성기는 유니코드의 수학 기호, 장식 문자, 전각 문자 등의 블록에서 일반 알파벳에 대응하는 특수 문자를 매핑합니다. 예를 들어 "Hello"를 "ℍ𝕖𝕝𝕝𝕠"(이중선)로 변환할 때, 각 문자를 Mathematical Double-Struck 블록의 해당 코드 포인트로 치환합니다. 다양한 스타일(굵게, 이탤릭, 필기체, 거꾸로 등)을 제공합니다.',
    en: 'The fancy text generator maps regular alphabet characters to special characters from Unicode blocks like mathematical symbols, decorative characters, and fullwidth forms. For example, converting "Hello" to "ℍ𝕖𝕝𝕝𝕠" substitutes each character with its Mathematical Double-Struck code point. Various styles (bold, italic, script, upside-down, etc.) are available.'
  },
  'favicon-generator': {
    ko: '파비콘 생성기는 업로드된 이미지를 여러 크기(16×16, 32×32, 48×48, 180×180 등)로 리사이즈하고 ICO, PNG, SVG 형식으로 변환합니다. Canvas API에서 drawImage()로 원본을 축소하고, toBlob()으로 각 형식의 파일을 생성합니다. ICO 형식은 여러 크기의 이미지를 하나의 파일에 포함할 수 있습니다.',
    en: 'The favicon generator resizes uploaded images to multiple sizes (16×16, 32×32, 48×48, 180×180, etc.) and converts to ICO, PNG, and SVG formats. Canvas API\'s drawImage() scales the original, and toBlob() generates files in each format. ICO format can contain multiple image sizes in a single file.'
  },
  'image-blur': {
    ko: '이미지 블러는 Canvas API의 filter 속성 또는 컨볼루션 필터를 사용합니다. 가우시안 블러는 각 픽셀의 값을 주변 픽셀들의 가중 평균으로 대체하며, 가우시안 분포에 따라 가까운 픽셀에 더 높은 가중치를 부여합니다. 블러 반경이 클수록 더 넓은 영역을 평균화하여 더 흐릿한 결과를 만듭니다.',
    en: 'Image blur uses Canvas API\'s filter property or convolution filters. Gaussian blur replaces each pixel with a weighted average of surrounding pixels, giving higher weight to closer pixels following a Gaussian distribution. A larger blur radius averages a wider area, producing a more blurred result.'
  },
  'image-compressor': {
    ko: '이미지 압축기는 Canvas API를 사용하여 이미지를 재인코딩합니다. JPEG의 경우 canvas.toBlob("image/jpeg", quality)에서 quality 파라미터(0~1)로 압축률을 조절합니다. 품질을 낮추면 DCT(이산 코사인 변환) 과정에서 고주파 성분이 더 많이 제거되어 파일 크기가 줄어듭니다. 리사이징과 병행하면 더 큰 압축 효과를 얻을 수 있습니다.',
    en: 'The image compressor uses Canvas API to re-encode images. For JPEG, canvas.toBlob("image/jpeg", quality) adjusts compression via the quality parameter (0-1). Lower quality removes more high-frequency components during DCT (Discrete Cosine Transform), reducing file size. Combining with resizing yields even greater compression.'
  },
  'image-converter': {
    ko: '이미지 변환기는 Canvas API로 원본 이미지를 로드한 후 toBlob() 또는 toDataURL()로 다른 형식으로 변환합니다. JPEG, PNG, WebP 간 변환을 지원하며, PNG→JPEG 변환 시 투명 영역을 배경색으로 채웁니다. WebP 형식은 JPEG보다 25~35% 더 작은 파일을 생성하면서 유사한 품질을 유지합니다.',
    en: 'The image converter loads the original via Canvas API and converts to other formats using toBlob() or toDataURL(). It supports conversion between JPEG, PNG, and WebP. When converting PNG to JPEG, transparent areas are filled with a background color. WebP produces 25-35% smaller files than JPEG with comparable quality.'
  },
  'image-crop': {
    ko: '이미지 자르기는 Canvas API의 drawImage() 메서드에서 소스 영역(sx, sy, sw, sh)과 대상 영역(dx, dy, dw, dh)을 지정하여 원하는 부분만 추출합니다. 사용자가 드래그로 선택한 영역의 좌표를 이미지 원본 해상도에 맞게 스케일링하고, 새로운 Canvas에 해당 영역만 그려서 잘린 이미지를 생성합니다.',
    en: 'Image cropping uses Canvas API\'s drawImage() method with source region (sx, sy, sw, sh) and destination region (dx, dy, dw, dh) to extract desired areas. User-selected drag coordinates are scaled to the original image resolution, and only that region is drawn on a new Canvas to produce the cropped image.'
  },
  'image-resizer': {
    ko: '이미지 리사이즈는 Canvas의 drawImage()로 원본 이미지를 지정한 크기의 캔버스에 다시 그리는 방식입니다. 축소 시 브라우저의 바이리니어 또는 바이큐빅 보간법이 적용되어 부드러운 결과를 만듭니다. 비율 유지 옵션에서는 한쪽 치수를 기준으로 다른 쪽을 자동 계산합니다.',
    en: 'Image resizing redraws the original onto a canvas of the specified size via drawImage(). When downscaling, the browser applies bilinear or bicubic interpolation for smooth results. The aspect ratio lock option automatically calculates one dimension based on the other.'
  },
  'image-rotate': {
    ko: '이미지 회전은 Canvas의 2D 컨텍스트에서 translate()와 rotate()를 조합하여 구현합니다. 캔버스의 중심점으로 원점을 이동한 후 지정 각도만큼 회전하고 이미지를 그립니다. 90°, 180° 회전은 캔버스의 너비와 높이를 교환해야 합니다. 자유 각도 회전도 가능하며, 빈 영역은 투명 또는 배경색으로 채워집니다.',
    en: 'Image rotation combines translate() and rotate() on the Canvas 2D context. The origin moves to the canvas center, rotates by the specified angle, then draws the image. 90° and 180° rotations require swapping canvas width and height. Free-angle rotation is also supported, with empty areas filled transparently or with a background color.'
  },
  'image-watermark': {
    ko: '이미지 워터마크는 원본 이미지 위에 텍스트나 이미지 레이어를 Canvas의 globalAlpha와 drawImage()/fillText()로 오버레이합니다. 투명도, 위치, 크기, 회전 각도를 조절할 수 있습니다. 타일형 워터마크는 캔버스 전체에 반복 패턴으로 배치하여 무단 사용을 방지합니다.',
    en: 'Image watermarking overlays text or image layers on the original using Canvas\'s globalAlpha with drawImage()/fillText(). Opacity, position, size, and rotation angle are adjustable. Tiled watermarks repeat across the entire canvas in a pattern to prevent unauthorized use.'
  },
  'ip-lookup': {
    ko: 'IP 조회 도구는 공개 IP 주소를 외부 API를 통해 확인하고, 해당 IP의 지리적 위치(국가, 도시, ISP)를 GeoIP 데이터베이스에서 검색합니다. IPv4(32비트, 약 43억 개)와 IPv6(128비트) 주소를 모두 지원합니다. WebRTC ICE candidate를 통해 로컬 IP도 감지할 수 있습니다.',
    en: 'The IP lookup tool checks your public IP address via external APIs and searches the GeoIP database for geographic location (country, city, ISP). It supports both IPv4 (32-bit, ~4.3 billion addresses) and IPv6 (128-bit). Local IP can also be detected through WebRTC ICE candidates.'
  },
  'korean-name-generator': {
    ko: '한국 이름 생성기는 한국에서 실제로 사용되는 성씨와 이름 글자의 데이터베이스에서 무작위로 조합합니다. 성(1글자)과 이름(2글자)을 결합하며, 통계적으로 많이 사용되는 글자에 가중치를 부여하여 자연스러운 이름을 생성합니다. 성별에 따라 다른 글자 풀을 사용할 수 있습니다.',
    en: 'The Korean name generator randomly combines from databases of actually used Korean surnames and given name characters. It joins a surname (1 character) with a given name (2 characters), weighting commonly used characters for natural-sounding results. Gender-specific character pools can be applied.'
  },
  'loan-calculator': {
    ko: '대출 계산기는 원리금균등상환과 원금균등상환 두 가지 방식을 지원합니다. 원리금균등상환의 월 상환액은 M = P × r(1+r)^n / ((1+r)^n - 1) 공식으로 계산합니다. P는 대출원금, r은 월이율(연이율/12), n은 총 상환 개월수입니다. 각 회차별 원금과 이자 비율, 잔액을 상세하게 보여줍니다.',
    en: 'The loan calculator supports equal payment and equal principal repayment methods. Equal payment monthly amount uses M = P × r(1+r)^n / ((1+r)^n - 1). P is principal, r is monthly rate (annual/12), n is total months. It shows detailed principal/interest breakdown and remaining balance for each payment period.'
  },
  'lottery-generator': {
    ko: '로또 번호 생성기는 crypto.getRandomValues()로 암호학적으로 안전한 난수를 생성하여 중복 없는 번호 조합을 만듭니다. 1~45 범위에서 6개의 고유한 숫자를 선택하며, Fisher-Yates 셔플 알고리즘을 변형하여 편향 없는 무작위 추출을 보장합니다. 생성된 번호는 오름차순으로 정렬됩니다.',
    en: 'The lottery generator uses crypto.getRandomValues() for cryptographically secure random numbers to create non-duplicate combinations. It selects 6 unique numbers from 1-45, using a modified Fisher-Yates shuffle to ensure unbiased random selection. Generated numbers are sorted in ascending order.'
  },
  'meme-generator': {
    ko: '밈 생성기는 Canvas API로 이미지 위에 텍스트를 오버레이합니다. 사용자가 선택한 이미지를 캔버스에 그리고, fillText()와 strokeText()로 상단/하단에 굵은 흰색 텍스트와 검은 외곽선을 추가합니다. Impact 폰트와 대문자를 사용하는 클래식 밈 스타일을 기본으로 제공하며, 폰트 크기와 위치를 커스터마이징할 수 있습니다.',
    en: 'The meme generator overlays text on images using Canvas API. It draws the user-selected image on a canvas, then adds bold white text with black outlines at top/bottom using fillText() and strokeText(). Classic meme style with Impact font and uppercase is the default, with customizable font size and position.'
  },
  'mic-test': {
    ko: '마이크 테스트는 navigator.mediaDevices.getUserMedia()로 마이크 접근 권한을 요청하고 오디오 스트림을 캡처합니다. Web Audio API의 AnalyserNode로 실시간 주파수와 볼륨 데이터를 분석하여 시각화합니다. 볼륨 미터는 getByteFrequencyData()로 얻은 주파수 데이터의 평균값을 표시합니다.',
    en: 'Mic test requests microphone access via navigator.mediaDevices.getUserMedia() and captures the audio stream. Web Audio API\'s AnalyserNode analyzes real-time frequency and volume data for visualization. The volume meter displays the average of frequency data obtained from getByteFrequencyData().'
  },
  'morse-code': {
    ko: '모스 부호 변환기는 각 알파벳 문자를 점(dit)과 선(dah)의 조합으로 매핑합니다. A는 ·−, B는 −···와 같이 국제 모스 부호 표준을 따릅니다. 문자 사이는 공백 3칸, 단어 사이는 공백 7칸으로 구분합니다. 오디오 재생 시 Web Audio API의 OscillatorNode로 특정 주파수의 비프음을 생성합니다.',
    en: 'The Morse code converter maps each letter to combinations of dots (dit) and dashes (dah). A is ·−, B is −··· following the international Morse code standard. Characters are separated by 3 spaces, words by 7 spaces. Audio playback uses Web Audio API\'s OscillatorNode to generate beep tones at specific frequencies.'
  },
  'noise-generator': {
    ko: '소음 생성기는 Web Audio API로 다양한 유형의 노이즈를 생성합니다. 백색 소음은 모든 주파수에 동일한 에너지를 가지며 Math.random() × 2 - 1로 생성합니다. 핑크 소음은 주파수가 높아질수록 에너지가 감소하며, 갈색 소음은 더 급격하게 감소합니다. AudioWorklet 또는 ScriptProcessorNode로 실시간 오디오 샘플을 생성합니다.',
    en: 'The noise generator creates various noise types using Web Audio API. White noise has equal energy at all frequencies, generated by Math.random() × 2 - 1. Pink noise decreases in energy at higher frequencies, and brown noise decreases more steeply. Real-time audio samples are produced via AudioWorklet or ScriptProcessorNode.'
  },
  'ocr': {
    ko: 'OCR(광학 문자 인식)은 이미지에서 텍스트를 추출하는 기술입니다. Tesseract.js 같은 OCR 엔진이 이미지를 전처리(이진화, 노이즈 제거, 기울기 보정)한 후, 문자 영역을 감지하고 각 문자를 인식합니다. 딥러닝 기반 모델이 문자의 특징을 추출하여 가장 가능성 높은 문자로 변환합니다. 한국어, 영어 등 다양한 언어를 지원합니다.',
    en: 'OCR (Optical Character Recognition) extracts text from images. OCR engines like Tesseract.js preprocess images (binarization, noise removal, skew correction), detect text regions, and recognize individual characters. Deep learning models extract character features and convert them to the most likely characters. Multiple languages including Korean and English are supported.'
  },
  'percent-calculator': {
    ko: '퍼센트 계산기는 세 가지 유형의 계산을 수행합니다: (1) A의 B%는 = A × B / 100, (2) A는 B의 몇 %? = A / B × 100, (3) A에서 B%를 더한/뺀 값 = A × (1 ± B/100). 모든 계산은 부동소수점 연산으로 수행되며, 결과는 소수점 이하 적절한 자릿수로 반올림하여 표시합니다.',
    en: 'The percent calculator performs three types of calculations: (1) B% of A = A × B / 100, (2) A is what % of B? = A / B × 100, (3) A plus/minus B% = A × (1 ± B/100). All calculations use floating-point arithmetic, with results rounded to appropriate decimal places.'
  },
  'pixel-fixer': {
    ko: '픽셀 수리 도구는 스턱픽셀(stuck pixel)을 고치기 위해 해당 위치에 빠르게 변하는 색상 패턴을 표시합니다. RGB 값을 매우 빠른 속도(60fps)로 무작위 전환하여 트랜지스터에 전기적 자극을 줍니다. 이 방법은 스턱픽셀을 정상으로 되돌리는 데 효과가 있을 수 있지만, 데드픽셀(물리적 손상)에는 효과가 없습니다.',
    en: 'The pixel fixer displays rapidly changing color patterns at the stuck pixel location to repair it. RGB values cycle randomly at high speed (60fps) to electrically stimulate the transistor. This method may restore stuck pixels to normal operation but is ineffective for dead pixels (physical damage).'
  },
  'pomodoro-timer': {
    ko: '뽀모도로 타이머는 프란체스코 시릴로가 개발한 시간 관리 기법을 구현합니다. 25분 작업(뽀모도로) + 5분 휴식을 1세트로 반복하며, 4세트 완료 후 15~30분의 긴 휴식을 취합니다. setInterval로 매 초 타이머를 업데이트하고, Notification API로 세션 종료를 알립니다. localStorage에 진행 상황을 저장합니다.',
    en: 'The Pomodoro timer implements Francesco Cirillo\'s time management technique. It repeats 25-minute work sessions (pomodoros) + 5-minute breaks, with a 15-30 minute long break after 4 sets. setInterval updates the timer each second, Notification API signals session completion, and localStorage persists progress.'
  },
  'qr-generator': {
    ko: 'QR코드 생성기는 입력 데이터를 QR코드 심볼로지 규격(ISO/IEC 18004)에 따라 2D 매트릭스로 인코딩합니다. 데이터를 비트 스트림으로 변환하고, Reed-Solomon 오류 정정 코드를 추가한 후, 파인더 패턴, 타이밍 패턴, 정렬 패턴과 함께 매트릭스에 배치합니다. 마스크 패턴을 적용하여 가독성을 최적화합니다.',
    en: 'The QR code generator encodes input data into a 2D matrix following QR code symbology (ISO/IEC 18004). Data is converted to a bit stream, Reed-Solomon error correction codes are added, then placed in the matrix with finder, timing, and alignment patterns. Mask patterns are applied to optimize readability.'
  },
  'qr-scanner': {
    ko: 'QR코드 스캐너는 카메라 스트림에서 실시간으로 QR코드를 감지하고 디코딩합니다. getUserMedia()로 카메라에 접근하고, 각 프레임을 Canvas에 그려 이미지 데이터를 추출합니다. jsQR 같은 디코딩 라이브러리가 파인더 패턴을 탐지하고, 원근 변환을 적용한 후 데이터를 읽어냅니다.',
    en: 'The QR code scanner detects and decodes QR codes in real-time from camera streams. It accesses the camera via getUserMedia(), draws each frame to a Canvas to extract image data. Decoding libraries like jsQR detect finder patterns, apply perspective transformation, and read the encoded data.'
  },
  'reaction-test': {
    ko: '반응 속도 테스트는 시각적 자극(색상 변화)이 표시된 시점과 사용자가 클릭한 시점 사이의 시간 차이를 performance.now()로 밀리초 단위까지 정확하게 측정합니다. 자극 출현까지의 대기 시간은 setTimeout으로 무작위(2~5초)로 설정하여 예측을 방지합니다. 평균 인간 반응 시간은 시각 자극에 대해 약 250ms입니다.',
    en: 'The reaction test measures the time difference between a visual stimulus (color change) appearing and the user clicking, with millisecond accuracy via performance.now(). Wait time before the stimulus is randomized (2-5 seconds) via setTimeout to prevent prediction. Average human reaction time to visual stimuli is approximately 250ms.'
  },
  'roulette': {
    ko: '룰렛은 사용자가 입력한 항목들 중 하나를 무작위로 선택합니다. crypto.getRandomValues()로 난수를 생성하여 당첨 항목을 결정하고, CSS transform의 rotate()로 휠 회전 애니메이션을 구현합니다. ease-out 타이밍 함수로 점점 감속하는 자연스러운 회전 효과를 만듭니다.',
    en: 'The roulette randomly selects one item from user entries. crypto.getRandomValues() generates the random number to determine the winner, and CSS transform\'s rotate() implements wheel spinning animation. An ease-out timing function creates a natural deceleration effect.'
  },
  'salary-calculator': {
    ko: '연봉 계산기는 세전 연봉에서 4대 보험(국민연금, 건강보험, 고용보험, 장기요양보험)과 소득세, 지방소득세를 공제하여 실수령액을 계산합니다. 각 보험료율은 법정 비율을 적용하고, 소득세는 간이세액표에 따라 원천징수액을 산출합니다. 월급, 세후 실수령액, 연간 공제 총액을 상세하게 표시합니다.',
    en: 'The salary calculator deducts social insurance (national pension, health insurance, employment insurance, long-term care) and income tax from gross annual salary to calculate net pay. Insurance premiums use legally mandated rates, and income tax follows withholding tax tables. Monthly pay, net take-home, and annual deduction totals are displayed in detail.'
  },
  'screen-burn-test': {
    ko: '번인 테스트는 화면의 잔상(burn-in)을 확인하기 위해 균일한 색상 패턴을 전체 화면에 표시합니다. OLED/AMOLED 디스플레이는 정적 이미지를 오래 표시하면 유기 물질이 불균일하게 노화되어 잔상이 남을 수 있습니다. 회색 화면에서 이전 UI 요소의 흔적이 보이면 번인이 발생한 것입니다.',
    en: 'The burn-in test displays uniform color patterns in fullscreen to check for image retention. OLED/AMOLED displays can develop burn-in when static images are shown for extended periods, causing uneven degradation of organic materials. Traces of previous UI elements visible on a gray screen indicate burn-in.'
  },
  'screen-color-test': {
    ko: '화면 색상 테스트는 디스플레이의 색상 정확도와 균일성을 검사합니다. 순수한 빨강, 초록, 파랑과 그라디언트 패턴을 전체 화면에 표시하여 색상 재현 능력을 확인합니다. 그라디언트에서 밴딩(색 계단 현상)이 보이면 디스플레이의 비트 심도가 부족하거나 색상 프로파일이 올바르지 않은 것입니다.',
    en: 'The screen color test examines display color accuracy and uniformity. Pure red, green, blue, and gradient patterns are shown in fullscreen to verify color reproduction. Banding (visible color steps) in gradients indicates insufficient display bit depth or incorrect color profile.'
  },
  'screen-recorder': {
    ko: '화면 녹화는 navigator.mediaDevices.getDisplayMedia()로 화면 캡처 스트림을 얻고, MediaRecorder API로 비디오를 인코딩합니다. VP8/VP9(WebM) 또는 H.264(MP4) 코덱으로 실시간 인코딩하며, ondataavailable 이벤트로 청크 데이터를 수집합니다. 녹화 완료 후 Blob으로 결합하여 다운로드할 수 있습니다.',
    en: 'Screen recording obtains a screen capture stream via navigator.mediaDevices.getDisplayMedia() and encodes video using the MediaRecorder API. Real-time encoding uses VP8/VP9 (WebM) or H.264 (MP4) codecs, collecting chunk data via ondataavailable events. After recording, chunks are combined into a Blob for download.'
  },
  'sleep-calculator': {
    ko: '수면 계산기는 수면 주기(약 90분)를 기반으로 최적의 취침/기상 시간을 계산합니다. 일반적인 수면 주기는 비렘수면(N1→N2→N3)과 렘수면의 반복으로, 한 주기가 약 90분입니다. 잠드는 데 걸리는 시간(약 14분)을 고려하여 4~6주기(6~9시간)를 완료하는 시점에 기상하면 가장 개운합니다.',
    en: 'The sleep calculator computes optimal bedtime/wake times based on sleep cycles (~90 minutes each). A typical cycle repeats non-REM (N1→N2→N3) and REM stages, totaling ~90 minutes. Accounting for sleep onset time (~14 minutes), waking after completing 4-6 cycles (6-9 hours) feels most refreshed.'
  },
  'speech-to-text': {
    ko: '음성 인식은 Web Speech API의 SpeechRecognition 인터페이스를 사용합니다. 마이크로 캡처한 오디오를 브라우저의 음성 인식 엔진(또는 클라우드 서비스)이 처리합니다. 오디오 신호를 음소 단위로 분석하고, 언어 모델을 사용하여 가장 가능성 높은 텍스트로 변환합니다. 실시간(continuous) 모드와 단일 발화 모드를 지원합니다.',
    en: 'Speech recognition uses the Web Speech API\'s SpeechRecognition interface. Audio captured from the microphone is processed by the browser\'s speech engine (or cloud service). Audio signals are analyzed at the phoneme level, and language models convert them to the most likely text. Continuous and single-utterance modes are supported.'
  },
  'stopwatch': {
    ko: '스톱워치는 performance.now()를 사용하여 밀리초 단위의 정밀한 시간 측정을 제공합니다. 시작 시점의 타임스탬프를 저장하고, requestAnimationFrame으로 매 프레임마다 현재 시간과의 차이를 계산합니다. 랩(구간) 기록, 일시정지/재개, 초기화 기능을 제공하며, 랩 간 최고/최저 기록을 하이라이트합니다.',
    en: 'The stopwatch uses performance.now() for millisecond-precise timing. It stores the start timestamp and calculates the difference from current time each frame via requestAnimationFrame. Features include lap recording, pause/resume, and reset, with best/worst lap times highlighted.'
  },
  'text-to-speech': {
    ko: '텍스트 음성 변환은 Web Speech API의 SpeechSynthesis 인터페이스를 사용합니다. SpeechSynthesisUtterance 객체에 텍스트, 언어, 음성, 속도, 피치를 설정하고 speechSynthesis.speak()으로 재생합니다. 브라우저에 내장된 TTS 엔진이 텍스트를 음소로 분해하고, 음성 합성 모델로 자연스러운 음성을 생성합니다.',
    en: 'Text-to-speech uses the Web Speech API\'s SpeechSynthesis interface. A SpeechSynthesisUtterance object is configured with text, language, voice, rate, and pitch, then played via speechSynthesis.speak(). The browser\'s built-in TTS engine breaks text into phonemes and synthesizes natural-sounding speech.'
  },
  'tip-calculator': {
    ko: '팁 계산기는 총 금액에 팁 비율을 곱하여 팁 금액을 계산합니다: 팁 = 금액 × (팁비율/100). 인원수로 나누기 기능은 (금액 + 팁) / 인원으로 1인당 부담 금액을 구합니다. 일반적인 팁 비율(10%, 15%, 20%)의 프리셋을 제공하고, 사용자 지정 비율도 입력할 수 있습니다.',
    en: 'The tip calculator computes tip amount by multiplying the total by the tip percentage: tip = amount × (rate/100). Split bill divides (amount + tip) / people for per-person cost. Presets for common tip rates (10%, 15%, 20%) are provided, with custom rate input available.'
  },
  'typing-test': {
    ko: '타이핑 테스트는 제시된 텍스트를 사용자가 입력하는 속도와 정확도를 측정합니다. WPM(분당 단어 수)은 (올바르게 입력한 문자 수 / 5) / 경과 시간(분)으로 계산합니다. 5문자를 1단어로 간주하는 것은 국제 표준입니다. 실시간으로 오타를 감지하여 정확도(%)를 표시하고, CPM(분당 문자 수)도 함께 제공합니다.',
    en: 'The typing test measures speed and accuracy as users type presented text. WPM (Words Per Minute) is calculated as (correct characters / 5) / elapsed time in minutes. Counting 5 characters as one word is an international standard. Typos are detected in real-time showing accuracy (%), and CPM (Characters Per Minute) is also provided.'
  },
  'unit-converter': {
    ko: '단위 변환기는 변환 계수 테이블을 사용하여 단위 간 변환을 수행합니다. 각 카테고리(길이, 무게, 온도, 부피 등)에서 기준 단위를 정하고, 모든 단위를 기준 단위와의 비율로 저장합니다. 변환 시 입력값을 먼저 기준 단위로 변환한 후 목표 단위로 재변환합니다. 온도는 선형 비율이 아니므로 별도의 변환 공식(°C = (°F - 32) × 5/9)을 사용합니다.',
    en: 'The unit converter uses conversion factor tables for unit transformations. Each category (length, weight, temperature, volume, etc.) has a base unit, with all units stored as ratios to it. Conversion first transforms to the base unit, then to the target. Temperature uses separate formulas (°C = (°F - 32) × 5/9) since it is not a linear ratio.'
  },
  'video-to-gif': {
    ko: '비디오-GIF 변환은 비디오의 각 프레임을 Canvas에 렌더링하고, 이를 GIF 인코더로 결합합니다. HTMLVideoElement의 currentTime을 조작하여 지정 간격으로 프레임을 캡처하고, gif.js 같은 라이브러리가 각 프레임의 픽셀 데이터를 LZW 압축하여 GIF 형식으로 인코딩합니다. 색상은 256색 팔레트로 양자화됩니다.',
    en: 'Video-to-GIF conversion renders each video frame on Canvas and combines them with a GIF encoder. HTMLVideoElement\'s currentTime is manipulated to capture frames at specified intervals, and libraries like gif.js LZW-compress each frame\'s pixel data into GIF format. Colors are quantized to a 256-color palette.'
  },
  'webcam-test': {
    ko: '웹캠 테스트는 navigator.mediaDevices.getUserMedia({video: true})로 카메라 접근을 요청하고, 반환된 MediaStream을 <video> 요소에 연결하여 실시간 미리보기를 표시합니다. 해상도, FPS, 카메라 이름 등의 정보는 MediaStreamTrack.getSettings()로 확인합니다. 다중 카메라 기기에서는 enumerateDevices()로 목록을 표시합니다.',
    en: 'Webcam test requests camera access via navigator.mediaDevices.getUserMedia({video: true}) and connects the returned MediaStream to a <video> element for live preview. Resolution, FPS, and camera name are checked via MediaStreamTrack.getSettings(). On multi-camera devices, enumerateDevices() lists available cameras.'
  },
  'youtube-thumbnail': {
    ko: '유튜브 썸네일 다운로더는 유튜브 URL에서 비디오 ID를 추출하고, YouTube의 이미지 서버 URL 패턴(img.youtube.com/vi/{VIDEO_ID}/{QUALITY}.jpg)을 사용하여 다양한 해상도(기본, 중간, 고화질, 최대 해상도)의 썸네일을 표시합니다. 사용자는 원하는 크기의 이미지를 선택하여 다운로드할 수 있습니다.',
    en: 'The YouTube thumbnail downloader extracts the video ID from YouTube URLs and uses YouTube\'s image server URL pattern (img.youtube.com/vi/{VIDEO_ID}/{QUALITY}.jpg) to display thumbnails at various resolutions (default, medium, high, maxres). Users can select and download their preferred size.'
  },
};

function processFile(filePath, howItWorks, lang) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has "작동 원리" or "How It Works"
  if (content.includes('작동 원리</h3>') || content.includes('How It Works</h3>')) return false;

  const heading = lang === 'ko' ? '작동 원리' : 'How It Works';
  const html = `<h3 class="text-lg font-semibold mt-6 mb-3">${heading}</h3>\n          <p>${howItWorks}</p>\n\n          `;

  // Find first h3 in the prose section
  const firstH3 = content.indexOf('<h3 class="text-lg font-semibold mt-6 mb-3">');
  if (firstH3 !== -1) {
    content = content.slice(0, firstH3) + html + content.slice(firstH3);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  // Alt: find first h3 with different class
  const altH3 = content.indexOf('<h3 class="text-[15px] font-semibold');
  if (altH3 !== -1) {
    content = content.slice(0, altH3) + html + content.slice(altH3);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

const baseDir = path.resolve(__dirname, '..');
let ok = 0, skip = 0;

for (const [toolId, data] of Object.entries(lifeHowItWorks)) {
  for (const lang of ['ko', 'en']) {
    const filePath = lang === 'ko'
      ? path.join(baseDir, 'tools', 'life', `${toolId}.html`)
      : path.join(baseDir, 'en', 'tools', 'life', `${toolId}.html`);
    if (processFile(filePath, data[lang], lang)) {
      console.log(`OK: ${filePath}`);
      ok++;
    } else {
      skip++;
    }
  }
}

console.log(`\nDone! OK: ${ok}, Skip: ${skip}`);
