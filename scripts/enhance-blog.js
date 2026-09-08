const fs = require('fs');
const path = require('path');

const blogFAQ = {
  'hash-guide': {
    ko: [
      ['해시 함수와 암호화의 차이는 무엇인가요?', '해시 함수는 단방향 함수로, 원본 데이터를 복원할 수 없습니다. 암호화는 키를 사용하여 데이터를 변환하고, 올바른 키가 있으면 원본을 복원할 수 있습니다. 해시는 데이터 무결성 검증과 비밀번호 저장에, 암호화는 데이터 보호에 사용됩니다.'],
      ['MD5는 왜 안전하지 않나요?', 'MD5는 충돌 공격에 취약합니다. 2004년 왕샤오윈 교수팀이 같은 해시값을 가진 서로 다른 입력을 빠르게 찾는 방법을 발견했습니다. 현재 MD5는 파일 체크섬 등 보안이 중요하지 않은 용도로만 사용하고, 보안 용도에는 SHA-256 이상을 권장합니다.'],
      ['솔트(Salt)란 무엇인가요?', '솔트는 비밀번호 해싱 시 추가하는 무작위 문자열입니다. 같은 비밀번호라도 솔트가 다르면 해시값이 달라져 레인보우 테이블 공격을 방지합니다. 각 사용자마다 고유한 솔트를 사용하는 것이 중요합니다. bcrypt, Argon2 같은 현대적 해싱 알고리즘은 솔트를 자동으로 관리합니다.'],
      ['SHA-256과 SHA-512 중 어떤 것을 사용해야 하나요?', 'SHA-256은 대부분의 용도에 충분한 보안성을 제공합니다. SHA-512는 64비트 시스템에서 더 빠를 수 있고, 더 긴 해시값이 필요한 경우 유용합니다. 비트코인은 SHA-256을, 일부 리눅스 배포판은 비밀번호에 SHA-512를 사용합니다.'],
      ['해시 충돌이란 무엇인가요?', '서로 다른 두 입력이 같은 해시값을 생성하는 현상입니다. 비둘기집 원리에 의해 이론적으로 항상 존재하지만, 좋은 해시 함수는 의도적으로 충돌을 만들기 극도로 어렵게 설계됩니다. SHA-256의 경우 2^128번의 연산이 필요하여 현재 기술로는 사실상 불가능합니다.'],
    ],
    en: [
      ['What is the difference between hashing and encryption?', 'Hashing is a one-way function that cannot recover original data. Encryption uses keys to transform data and can be reversed with the correct key. Hashing is used for data integrity verification and password storage, while encryption protects data confidentiality.'],
      ['Why is MD5 considered insecure?', 'MD5 is vulnerable to collision attacks. In 2004, researchers discovered methods to quickly find different inputs producing the same hash. MD5 should only be used for non-security purposes like file checksums. For security applications, SHA-256 or higher is recommended.'],
      ['What is a salt in password hashing?', 'A salt is a random string added before hashing a password. Even identical passwords produce different hashes with different salts, preventing rainbow table attacks. Modern hashing algorithms like bcrypt and Argon2 manage salts automatically.'],
      ['Should I use SHA-256 or SHA-512?', 'SHA-256 provides sufficient security for most purposes. SHA-512 may be faster on 64-bit systems and offers a longer hash output. Bitcoin uses SHA-256, while some Linux distributions use SHA-512 for passwords.'],
      ['What is a hash collision?', 'A hash collision occurs when two different inputs produce the same hash value. By the pigeonhole principle, collisions theoretically always exist, but well-designed hash functions make intentional collisions extremely difficult. SHA-256 requires approximately 2^128 operations, making it practically impossible with current technology.'],
    ]
  },
  'regex-tutorial': {
    ko: [
      ['정규표현식을 배우기 가장 좋은 방법은?', '실제 문제를 풀며 배우는 것이 가장 효과적입니다. 이메일 검증, 전화번호 추출 같은 간단한 패턴부터 시작하세요. 온라인 테스터에서 실시간으로 결과를 확인하며 연습하면 빠르게 익힐 수 있습니다. 모든 문법을 외우려 하지 말고 필요할 때 찾아보세요.'],
      ['정규표현식이 느린 경우는 언제인가요?', '중첩된 수량자(예: (a+)+)는 카타스트로픽 백트래킹을 일으켜 성능이 급격히 저하됩니다. 큰 입력에 복잡한 패턴을 적용할 때도 느려질 수 있습니다. 가능하면 구체적인 패턴을 사용하고, .* 같은 탐욕적 수량자는 최소화하세요.'],
      ['JavaScript와 Python의 정규표현식은 같나요?', '기본 문법은 유사하지만 차이점이 있습니다. Python은 명명 그룹에 (?P<name>)을, JavaScript는 (?<name>)을 사용합니다. Python은 후방 참조(lookbehind)에 가변 길이를 지원하지 않지만, JavaScript ES2018부터는 지원합니다. 각 언어의 문서를 확인하세요.'],
      ['정규표현식으로 HTML을 파싱할 수 있나요?', '단순한 패턴 추출은 가능하지만, HTML의 중첩 구조를 정규표현식으로 완벽하게 파싱하는 것은 불가능합니다. HTML은 문맥 자유 문법이므로 정규 문법으로는 표현할 수 없습니다. DOM 파서를 사용하는 것이 올바른 접근입니다.'],
      ['자주 쓰는 정규표현식 패턴은?', '이메일: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}, 한국 전화번호: 01[016789]-?\\d{3,4}-?\\d{4}, URL: https?://[\\S]+, 숫자만: ^\\d+$, 한글만: ^[가-힣]+$ 등이 있습니다.'],
    ],
    en: [
      ['What is the best way to learn regex?', 'Practice with real problems. Start with simple patterns like email validation or phone number extraction. Use online testers to see results in real time. Don\'t try to memorize all syntax - look it up when needed.'],
      ['When can regex be slow?', 'Nested quantifiers like (a+)+ can cause catastrophic backtracking. Complex patterns on large inputs can also be slow. Use specific patterns and minimize greedy quantifiers like .* where possible.'],
      ['Are regex the same in JavaScript and Python?', 'Basic syntax is similar but differences exist. Python uses (?P<name>) for named groups while JavaScript uses (?<name>). Each language has its own extensions and limitations - check language-specific documentation.'],
      ['Can regex parse HTML?', 'Simple pattern extraction works, but perfectly parsing HTML\'s nested structure with regex is impossible. HTML is a context-free grammar that cannot be expressed with regular grammar. Use a DOM parser instead.'],
      ['What are commonly used regex patterns?', 'Email: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}, URL: https?://[\\S]+, digits only: ^\\d+$, and many more. Build a personal cheatsheet of patterns you use frequently.'],
    ]
  },
  'base64-encoding': {
    ko: [
      ['Base64로 인코딩하면 보안이 강화되나요?', 'Base64는 보안과 전혀 관련이 없습니다. 인코딩 방식일 뿐 암호화가 아니므로 누구나 쉽게 디코딩할 수 있습니다. 민감한 데이터를 보호하려면 AES, RSA 같은 암호화 알고리즘을 사용해야 합니다.'],
      ['Base64 인코딩 시 크기가 얼마나 증가하나요?', '원본 대비 약 33% 증가합니다. 3바이트의 원본 데이터가 4개의 Base64 문자로 변환되기 때문입니다. 추가로 줄바꿈이 포함되면 조금 더 늘어날 수 있습니다.'],
      ['Base64와 Base64URL의 차이는?', 'Base64는 +, /, = 문자를 사용하고, Base64URL은 -, _ 로 대체하며 패딩(=)을 생략합니다. URL이나 파일명에서 안전하게 사용할 수 있어 JWT 토큰 등에 사용됩니다.'],
      ['모든 프로그래밍 언어에서 Base64를 지원하나요?', '네, 대부분의 언어에서 기본 라이브러리로 지원합니다. JavaScript는 btoa()/atob(), Python은 base64 모듈, Java는 java.util.Base64를 사용합니다.'],
      ['이미지를 Base64로 변환하는 것이 항상 좋은가요?', '작은 아이콘(수 KB 이하)에는 Data URI로 사용하면 HTTP 요청을 줄일 수 있어 유리합니다. 하지만 큰 이미지는 33% 크기 증가와 브라우저 캐싱 불가로 인해 일반 파일로 제공하는 것이 효율적입니다.'],
    ],
    en: [
      ['Does Base64 encoding improve security?', 'Base64 has nothing to do with security. It is an encoding scheme, not encryption, and anyone can easily decode it. Use AES or RSA encryption for protecting sensitive data.'],
      ['How much does Base64 encoding increase file size?', 'About 33% larger than the original. Three bytes of original data become four Base64 characters. Line breaks may add slightly more overhead.'],
      ['What is the difference between Base64 and Base64URL?', 'Base64 uses +, /, = characters. Base64URL replaces these with -, _ and omits padding (=), making it safe for URLs and filenames. It is used in JWT tokens.'],
      ['Do all programming languages support Base64?', 'Yes, most languages provide built-in support. JavaScript has btoa()/atob(), Python has the base64 module, and Java has java.util.Base64.'],
      ['Should I always convert images to Base64?', 'Small icons (a few KB) benefit from Data URIs by reducing HTTP requests. Larger images should be served as regular files due to the 33% size increase and inability to cache.'],
    ]
  },
  'jwt-explained': {
    ko: [
      ['JWT는 암호화된 것인가요?', 'JWT는 기본적으로 서명되어 있지만 암호화되지는 않습니다. Base64URL로 인코딩된 것이므로 누구나 내용을 읽을 수 있습니다. JWE(JSON Web Encryption)를 사용하면 페이로드를 암호화할 수 있지만, 일반적인 JWT는 서명만 포함합니다.'],
      ['JWT의 만료 시간은 어떻게 설정하나요?', 'exp(expiration) 클레임에 Unix 타임스탬프를 설정합니다. 일반적으로 액세스 토큰은 15분~1시간, 리프레시 토큰은 7일~30일로 설정합니다. 너무 길면 보안 위험이, 너무 짧으면 사용성이 저하됩니다.'],
      ['JWT vs 세션 기반 인증, 어떤 것이 좋나요?', 'JWT는 서버 상태가 없어 확장성이 좋고 마이크로서비스에 적합합니다. 세션은 서버에서 관리하므로 즉시 무효화가 가능합니다. 단일 서버 애플리케이션에는 세션이, 분산 시스템에는 JWT가 더 적합한 경우가 많습니다.'],
      ['JWT를 어디에 저장해야 하나요?', 'httpOnly 쿠키가 가장 안전합니다. localStorage는 XSS 공격에 취약하고, 일반 쿠키는 CSRF에 취약합니다. httpOnly + Secure + SameSite 플래그를 설정한 쿠키가 권장됩니다.'],
      ['JWT 토큰이 탈취되면 어떻게 하나요?', '짧은 만료 시간을 설정하고, 토큰 블랙리스트를 구현하거나, 리프레시 토큰 로테이션을 사용합니다. 토큰에 사용자의 IP나 디바이스 정보를 포함시켜 검증하는 방법도 있습니다.'],
    ],
    en: [
      ['Is JWT encrypted?', 'JWT is signed but not encrypted by default. Since it uses Base64URL encoding, anyone can read the contents. JWE (JSON Web Encryption) can encrypt the payload, but standard JWT only includes a signature.'],
      ['How should I set JWT expiration time?', 'Set the exp (expiration) claim with a Unix timestamp. Access tokens typically expire in 15 minutes to 1 hour, refresh tokens in 7-30 days. Too long risks security, too short hurts usability.'],
      ['JWT vs session-based auth - which is better?', 'JWT is stateless and scalable, ideal for microservices. Sessions are server-managed and can be immediately invalidated. Sessions suit single-server apps, while JWT works better for distributed systems.'],
      ['Where should I store JWT tokens?', 'httpOnly cookies are the safest option. localStorage is vulnerable to XSS, and regular cookies to CSRF. Use cookies with httpOnly + Secure + SameSite flags.'],
      ['What if a JWT token is stolen?', 'Use short expiration times, implement token blacklists, or use refresh token rotation. You can also include user IP or device info in the token for additional verification.'],
    ]
  },
  'json-yaml-xml': {
    ko: [
      ['JSON과 YAML 중 설정 파일에는 어떤 것이 좋나요?', 'YAML은 주석을 지원하고 들여쓰기 기반이라 사람이 읽기 편합니다. Docker Compose, Kubernetes, GitHub Actions 등 많은 도구가 YAML을 사용합니다. 단, 들여쓰기 실수에 민감하므로 주의가 필요합니다.'],
      ['XML은 아직 사용되나요?', '네, SOAP 웹서비스, 안드로이드 레이아웃, Maven/Gradle 빌드 파일, SVG 그래픽, Office 문서(OOXML) 등에서 여전히 널리 사용됩니다. 네임스페이스와 스키마 검증이 필요한 복잡한 문서 구조에 적합합니다.'],
      ['JSON에서 주석을 사용할 수 없나요?', '표준 JSON은 주석을 지원하지 않습니다. JSONC(JSON with Comments)나 JSON5 같은 확장 형식에서는 주석을 사용할 수 있습니다. TypeScript의 tsconfig.json이나 VS Code 설정은 JSONC를 지원합니다.'],
      ['API 응답으로는 어떤 형식이 가장 좋나요?', 'JSON이 사실상 표준입니다. 파싱이 빠르고, 대부분의 언어에서 네이티브 지원하며, 웹 클라이언트(JavaScript)와 호환성이 좋습니다. 특별한 이유가 없다면 REST API에는 JSON을 사용하세요.'],
      ['YAML에서 들여쓰기 오류를 방지하는 방법은?', '탭 대신 공백 2칸을 사용하세요. EditorConfig나 IDE의 YAML 확장을 설치하면 자동 검증이 됩니다. YAML 린터(yamllint)를 CI 파이프라인에 추가하는 것도 좋은 방법입니다.'],
    ],
    en: [
      ['Which is better for config files, JSON or YAML?', 'YAML supports comments and uses indentation, making it human-readable. Many tools like Docker Compose, Kubernetes, and GitHub Actions use YAML. However, be careful with indentation errors.'],
      ['Is XML still used today?', 'Yes, XML is widely used in SOAP web services, Android layouts, Maven/Gradle build files, SVG graphics, and Office documents (OOXML). It excels in complex document structures requiring namespaces and schema validation.'],
      ['Can I use comments in JSON?', 'Standard JSON does not support comments. Extended formats like JSONC (JSON with Comments) and JSON5 allow comments. TypeScript\'s tsconfig.json and VS Code settings support JSONC.'],
      ['What format is best for API responses?', 'JSON is the de facto standard. It parses quickly, has native support in most languages, and works well with web clients (JavaScript). Use JSON for REST APIs unless you have a specific reason not to.'],
      ['How do I prevent YAML indentation errors?', 'Use 2 spaces instead of tabs. Install EditorConfig or YAML extensions in your IDE for auto-validation. Adding a YAML linter (yamllint) to your CI pipeline also helps.'],
    ]
  },
  'qr-code-guide': {
    ko: [
      ['QR코드의 최대 데이터 용량은?', '숫자 최대 7,089자, 영숫자 4,296자, 바이너리 2,953바이트까지 저장할 수 있습니다. 오류 정정 레벨이 높을수록 저장 가능한 데이터가 줄어듭니다. 일반적으로 URL은 충분히 저장할 수 있습니다.'],
      ['QR코드가 손상되어도 읽을 수 있나요?', 'Reed-Solomon 오류 정정 덕분에 부분적 손상에도 읽을 수 있습니다. L레벨은 7%, M은 15%, Q는 25%, H는 30%까지 손상을 복구합니다. 로고를 중앙에 넣을 때 H레벨을 권장하는 이유입니다.'],
      ['정적 QR코드와 동적 QR코드의 차이는?', '정적 QR코드는 데이터가 직접 인코딩되어 변경 불가합니다. 동적 QR코드는 리디렉션 URL을 인코딩하여 대상 링크를 서버에서 변경할 수 있고 스캔 통계도 추적 가능합니다.'],
      ['QR코드 인쇄 시 최소 크기는?', '일반적으로 2cm x 2cm 이상이 권장됩니다. 스캔 거리에 따라 크기를 조절해야 하며, 비율은 스캔 거리의 1/10 정도가 적합합니다. 주변에 여백(Quiet Zone)도 반드시 확보하세요.'],
      ['QR코드에 색상을 넣어도 되나요?', '가능하지만 주의가 필요합니다. 어두운 모듈과 밝은 배경 간의 충분한 대비를 유지해야 합니다. 전경색을 어둡게, 배경색을 밝게 유지하고, 색상 반전은 인식률을 크게 떨어뜨리므로 피하세요.'],
    ],
    en: [
      ['What is the maximum data capacity of a QR code?', 'Up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data. Higher error correction levels reduce storage capacity. URLs are typically well within capacity.'],
      ['Can damaged QR codes still be read?', 'Thanks to Reed-Solomon error correction, partially damaged QR codes can still be read. Level L recovers 7%, M recovers 15%, Q recovers 25%, and H recovers 30% of damage.'],
      ['What is the difference between static and dynamic QR codes?', 'Static QR codes encode data directly and cannot be changed. Dynamic QR codes encode a redirect URL, allowing the destination link to be changed on the server, and scan statistics can be tracked.'],
      ['What is the minimum print size for QR codes?', 'Generally 2cm x 2cm or larger is recommended. Size should scale with scan distance at about 1/10 of the scanning distance. Always include a quiet zone margin around the code.'],
      ['Can I add colors to QR codes?', 'Yes, but maintain sufficient contrast between dark modules and light background. Keep foreground dark and background light. Avoid color inversion as it significantly reduces scan reliability.'],
    ]
  },
  'image-compress-guide': {
    ko: [
      ['이미지 압축 시 품질이 얼마나 떨어지나요?', '손실 압축(JPEG)은 80% 품질 설정에서 육안으로 거의 차이를 느끼지 못하면서 파일 크기를 50-70% 줄일 수 있습니다. 무손실 압축(PNG 최적화)은 품질 저하 없이 10-30% 크기를 줄입니다.'],
      ['웹사이트에 최적인 이미지 형식은?', '사진은 JPEG 또는 WebP, 투명 배경이 필요한 그래픽은 PNG 또는 WebP, 아이콘이나 로고는 SVG가 적합합니다. WebP는 JPEG보다 25-35% 더 작은 파일 크기를 제공합니다.'],
      ['브라우저에서 이미지를 압축하면 안전한가요?', '네, 브라우저 기반 압축은 이미지가 서버로 전송되지 않으므로 개인 사진도 안심하고 압축할 수 있습니다. Canvas API를 사용하여 로컬에서 처리됩니다.'],
      ['대량의 이미지를 한 번에 압축할 수 있나요?', '이 도구는 브라우저에서 동작하므로 대량 처리 시 메모리 제한이 있을 수 있습니다. 10-20장 이하로 나눠서 처리하는 것을 권장합니다. 수백 장 이상은 데스크톱 도구나 빌드 도구(imagemin 등)를 사용하세요.'],
    ],
    en: [
      ['How much quality is lost during compression?', 'Lossy compression (JPEG) at 80% quality reduces file size by 50-70% with barely visible differences. Lossless compression (PNG optimization) reduces size by 10-30% without any quality loss.'],
      ['What image format is best for websites?', 'JPEG or WebP for photos, PNG or WebP for graphics needing transparency, SVG for icons and logos. WebP provides 25-35% smaller files than JPEG.'],
      ['Is browser-based image compression safe?', 'Yes, browser-based compression processes images locally without sending them to a server. Your photos never leave your device.'],
      ['Can I compress many images at once?', 'Browser-based tools have memory limitations for batch processing. Process 10-20 images at a time. For hundreds of images, use desktop tools or build tools like imagemin.'],
    ]
  },
  'pdf-merge-guide': {
    ko: [
      ['병합 후 PDF 크기가 너무 크면?', '병합 후 PDF 압축 도구를 사용하세요. 이미지가 많은 PDF의 경우 압축으로 50% 이상 크기를 줄일 수 있습니다. 이메일 첨부 제한(보통 25MB)을 초과하면 클라우드 링크를 사용하는 것도 방법입니다.'],
      ['병합 시 페이지 순서를 변경할 수 있나요?', '파일 업로드 후 드래그 앤 드롭으로 파일 순서를 변경할 수 있습니다. 개별 페이지 순서까지 조정하려면 페이지 재정렬 도구를 함께 사용하세요.'],
      ['비밀번호가 걸린 PDF도 병합할 수 있나요?', '비밀번호로 보호된 PDF는 먼저 비밀번호를 해제해야 합니다. 보안상 이유로 이 도구에서는 암호화된 PDF의 자동 해제를 지원하지 않습니다.'],
      ['모바일에서도 PDF 병합이 가능한가요?', '네, 브라우저 기반 도구이므로 스마트폰이나 태블릿에서도 사용할 수 있습니다. 다만 대용량 파일은 모바일 브라우저의 메모리 제한으로 인해 처리가 어려울 수 있습니다.'],
    ],
    en: [
      ['What if the merged PDF is too large?', 'Use the PDF compression tool after merging. Image-heavy PDFs can be reduced by 50% or more. If exceeding email attachment limits (usually 25MB), consider using cloud links.'],
      ['Can I change page order when merging?', 'You can reorder files via drag-and-drop after uploading. For individual page ordering, use the page reorder tool alongside.'],
      ['Can I merge password-protected PDFs?', 'Password-protected PDFs must be unlocked first. For security reasons, this tool does not support automatic decryption of encrypted PDFs.'],
      ['Can I merge PDFs on mobile?', 'Yes, as a browser-based tool it works on smartphones and tablets. However, large files may be difficult to process due to mobile browser memory limitations.'],
    ]
  },
  'password-guide': {
    ko: [
      ['비밀번호는 얼마나 길어야 안전한가요?', '최소 12자 이상을 권장합니다. 대소문자, 숫자, 특수문자를 혼합하면 8자도 가능하지만, 길이가 보안의 가장 중요한 요소입니다. 16자 이상의 패스프레이즈(여러 단어 조합)가 기억하기 쉽고 보안도 좋습니다.'],
      ['비밀번호 관리자를 사용해야 하나요?', '강력히 권장합니다. 각 사이트마다 고유하고 복잡한 비밀번호를 사용하되 모두 기억할 필요가 없어집니다. 1Password, Bitwarden, KeePass 같은 신뢰할 수 있는 관리자를 선택하세요.'],
      ['2단계 인증(2FA)은 꼭 필요한가요?', '가능하면 모든 중요 계정에 2FA를 설정하세요. SMS보다는 인증 앱(Google Authenticator, Authy)이나 하드웨어 키(YubiKey)가 더 안전합니다. 비밀번호가 유출되더라도 2FA가 추가 방어선 역할을 합니다.'],
      ['비밀번호를 얼마나 자주 변경해야 하나요?', '최신 보안 가이드라인(NIST)은 정기적 변경보다 강력한 고유 비밀번호 사용을 권장합니다. 유출이 의심되거나 침해 알림을 받았을 때만 변경하세요. 잦은 변경은 오히려 약한 비밀번호 사용으로 이어질 수 있습니다.'],
    ],
    en: [
      ['How long should a password be?', 'At least 12 characters is recommended. Mixing uppercase, lowercase, numbers, and symbols helps, but length is the most important factor. Passphrases of 16+ characters are easy to remember and highly secure.'],
      ['Should I use a password manager?', 'Strongly recommended. Use unique, complex passwords for each site without having to remember them all. Choose trusted managers like 1Password, Bitwarden, or KeePass.'],
      ['Is two-factor authentication (2FA) necessary?', 'Enable 2FA on all important accounts when possible. Authenticator apps (Google Authenticator, Authy) or hardware keys (YubiKey) are safer than SMS. 2FA provides an additional defense even if your password is compromised.'],
      ['How often should I change passwords?', 'Modern security guidelines (NIST) recommend strong unique passwords over frequent changes. Only change when a breach is suspected or reported. Frequent changes often lead to weaker passwords.'],
    ]
  },
  'screen-recorder-guide': {
    ko: [
      ['화면 녹화 시 최적 해상도와 프레임률은?', '일반적인 튜토리얼은 1080p 30fps면 충분합니다. 게임 녹화는 60fps가 좋고, 4K 녹화는 파일 크기가 매우 커지므로 편집 후 필요한 해상도로 출력하는 것이 효율적입니다.'],
      ['브라우저에서 녹화하면 품질이 떨어지나요?', 'MediaRecorder API를 사용하므로 데스크톱 프로그램과 유사한 품질을 제공합니다. 단, 브라우저의 코덱 지원에 따라 출력 형식이 제한될 수 있습니다(보통 WebM 또는 MP4).'],
      ['시스템 오디오도 함께 녹음할 수 있나요?', '브라우저 기반 녹화에서 시스템 오디오 캡처는 브라우저와 OS에 따라 제한될 수 있습니다. Chrome은 탭 오디오 캡처를 지원하며, 전체 시스템 오디오는 운영체제 설정이 필요할 수 있습니다.'],
    ],
    en: [
      ['What are optimal resolution and frame rate for screen recording?', '1080p at 30fps is sufficient for tutorials. Gaming recordings benefit from 60fps. 4K recordings produce very large files, so export at the needed resolution after editing.'],
      ['Does browser-based recording affect quality?', 'Using the MediaRecorder API, quality is comparable to desktop applications. Output format may be limited by browser codec support (usually WebM or MP4).'],
      ['Can I record system audio?', 'System audio capture may be limited depending on the browser and OS. Chrome supports tab audio capture, while full system audio may require OS-level configuration.'],
    ]
  },
};

// Remaining blog posts get generic FAQ based on topic
const genericBlogFAQ = {
  'bmi-guide': { ko: '이 도구는 무료인가요?|BMI 계산 결과는 정확한가요?|모바일에서도 사용할 수 있나요?|개인정보가 저장되나요?', en: 'Is this tool free?|Are BMI calculations accurate?|Can I use it on mobile?|Is my data stored?' },
  'typing-test-guide': { ko: '타이핑 속도를 어떻게 향상시킬 수 있나요?|평균 타이핑 속도는 얼마인가요?|WPM과 CPM의 차이는?|모바일에서도 테스트할 수 있나요?', en: 'How can I improve typing speed?|What is the average typing speed?|What is the difference between WPM and CPM?|Can I test on mobile?' },
  'url-encoding-guide': { ko: 'URL 인코딩은 왜 필요한가요?|encodeURI와 encodeURIComponent의 차이는?|한글 URL은 어떻게 처리되나요?|URL 인코딩은 보안에 도움이 되나요?', en: 'Why is URL encoding necessary?|What is the difference between encodeURI and encodeURIComponent?|How are non-ASCII characters handled?|Does URL encoding help with security?' },
  'pdf-management-tips': { ko: 'PDF 편집에 유료 소프트웨어가 필요한가요?|브라우저 기반 PDF 도구는 안전한가요?|PDF 파일의 최대 크기 제한이 있나요?|PDF를 Word로 변환할 수 있나요?', en: 'Do I need paid software for PDF editing?|Are browser-based PDF tools safe?|Is there a maximum PDF file size?|Can I convert PDF to Word?' },
  'online-privacy-guide': { ko: 'VPN은 꼭 필요한가요?|브라우저 시크릿 모드는 안전한가요?|쿠키를 모두 차단해야 하나요?|온라인 추적을 완전히 차단할 수 있나요?', en: 'Do I need a VPN?|Is browser incognito mode safe?|Should I block all cookies?|Can online tracking be completely blocked?' },
  'color-theory-guide': { ko: '웹 디자인에서 색상 수는 몇 가지가 적당한가요?|접근성을 위한 색상 대비 비율은?|색맹을 고려한 디자인은 어떻게 하나요?|브랜드 색상을 어떻게 선정하나요?', en: 'How many colors are appropriate for web design?|What is the required contrast ratio for accessibility?|How to design for color blindness?|How to choose brand colors?' },
  'unit-conversion-guide': { ko: '미터법과 야드파운드법은 왜 다른가요?|온도 변환 공식은?|컴퓨터 저장 단위(KB, MB, GB)는 어떻게 다른가요?|가장 자주 필요한 단위 변환은?', en: 'Why are metric and imperial systems different?|What is the temperature conversion formula?|How do computer storage units (KB, MB, GB) differ?|What are the most common unit conversions?' },
  'cron-expression-guide': { ko: 'Cron 표현식을 테스트하는 방법은?|가장 자주 쓰는 Cron 표현식은?|Cron 작업이 실패하면 어떻게 되나요?|서버 시간대와 Cron의 관계는?', en: 'How to test cron expressions?|What are the most common cron expressions?|What happens when a cron job fails?|How does server timezone affect cron?' },
  'image-format-guide': { ko: 'WebP를 모든 브라우저에서 지원하나요?|AVIF는 WebP보다 나은가요?|투명도가 필요할 때는 어떤 형식?|인쇄용 이미지에는 어떤 형식?', en: 'Is WebP supported in all browsers?|Is AVIF better than WebP?|Which format for transparency?|Which format for print images?' },
  'css-optimization-guide': { ko: 'CSS 최소화로 성능이 얼마나 개선되나요?|사용하지 않는 CSS를 찾는 방법은?|CSS-in-JS vs 전통적 CSS, 어떤 것이 더 빠른가요?|Critical CSS란 무엇인가요?', en: 'How much does CSS minification improve performance?|How to find unused CSS?|CSS-in-JS vs traditional CSS, which is faster?|What is Critical CSS?' },
  'loan-interest-guide': { ko: '원리금균등상환과 원금균등상환의 차이는?|대출 이자를 줄이는 방법은?|변동금리와 고정금리 중 어떤 것을 선택해야 하나요?|조기상환 수수료는 어떻게 계산되나요?', en: 'What is the difference between equal payments and equal principal?|How to reduce loan interest?|Fixed vs variable rate - which to choose?|How are early repayment fees calculated?' },
  'og-tag-guide': { ko: 'OG 태그가 SNS에서 바로 반영되지 않는 이유는?|OG 이미지 권장 크기는?|트위터 카드와 OG 태그의 차이는?|OG 태그를 디버깅하는 방법은?', en: 'Why are OG tags not immediately reflected on social media?|What is the recommended OG image size?|Difference between Twitter Cards and OG tags?|How to debug OG tags?' },
  'sleep-science-guide': { ko: '최적의 수면 시간은 몇 시간인가요?|수면 주기란 무엇인가요?|낮잠은 건강에 좋은가요?|수면의 질을 측정하는 방법은?', en: 'How many hours of sleep is optimal?|What is a sleep cycle?|Are naps healthy?|How to measure sleep quality?' },
  'video-gif-guide': { ko: 'GIF의 최대 프레임 수 제한은?|GIF 파일 크기를 줄이는 방법은?|GIF 대신 사용할 수 있는 대안은?|GIF의 색상 제한은?', en: 'Is there a maximum frame limit for GIFs?|How to reduce GIF file size?|What are alternatives to GIF?|What are GIF color limitations?' },
  'markdown-guide': { ko: '마크다운을 지원하는 플랫폼은?|마크다운에서 표를 만드는 방법은?|마크다운과 HTML을 섞어 쓸 수 있나요?|마크다운 에디터 추천은?', en: 'Which platforms support Markdown?|How to create tables in Markdown?|Can I mix Markdown and HTML?|Recommended Markdown editors?' },
};

function processBlogs() {
  const baseDir = path.resolve(__dirname, '..');
  let processed = 0;

  const allBlogs = Object.keys(blogFAQ).concat(Object.keys(genericBlogFAQ));

  for (const blogId of allBlogs) {
    for (const lang of ['ko', 'en']) {
      const filePath = lang === 'ko'
        ? path.join(baseDir, 'blog', `${blogId}.html`)
        : path.join(baseDir, 'en', 'blog', `${blogId}.html`);

      if (!fs.existsSync(filePath)) {
        console.log(`  SKIP (not found): ${filePath}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf-8');

      // Check if already enhanced
      if (content.includes('자주 묻는 질문</h2>') || content.includes('Frequently Asked Questions</h2>')) {
        console.log(`  SKIP (already has FAQ): ${filePath}`);
        continue;
      }

      // Build FAQ HTML
      let faqItems = [];
      if (blogFAQ[blogId]) {
        faqItems = blogFAQ[blogId][lang] || [];
      } else if (genericBlogFAQ[blogId]) {
        const parts = genericBlogFAQ[blogId][lang].split('|');
        faqItems = parts.map(q => {
          const answer = lang === 'ko'
            ? '이 주제에 대한 자세한 내용은 위 본문을 참고하시거나, 관련 도구를 직접 사용해 보세요.'
            : 'For detailed information on this topic, please refer to the article above or try our related tools.';
          return [q, answer];
        });
      }

      if (faqItems.length === 0) continue;

      const faqHeading = lang === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions';
      let faqHtml = `\n        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">${faqHeading}</h2>\n        <div class="space-y-4">\n`;
      for (const item of faqItems) {
        const [q, a] = item;
        faqHtml += `          <div>\n            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">${q}</h3>\n            <p class="text-gray-700 dark:text-gray-300">${a}</p>\n          </div>\n`;
      }
      faqHtml += '        </div>\n';

      // Insert before "관련 도구" or "Related" section
      const relatedToolIdx = content.indexOf('<!-- 관련 도구 -->');
      const relatedIdx = content.indexOf('<!-- Related');
      const insertIdx = relatedToolIdx !== -1 ? relatedToolIdx : relatedIdx;

      if (insertIdx !== -1) {
        // Insert before related section, after closing </div> of prose
        content = content.slice(0, insertIdx) + faqHtml + '\n      ' + content.slice(insertIdx);
      } else {
        // Insert before </article>
        const articleClose = content.indexOf('</article>');
        if (articleClose !== -1) {
          content = content.slice(0, articleClose) + faqHtml + '\n    ' + content.slice(articleClose);
        }
      }

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  OK: ${filePath}`);
      processed++;
    }
  }

  console.log(`\nBlog enhancement done! Processed: ${processed}`);
}

processBlogs();
