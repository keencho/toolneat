/**
 * SEO Tags Adder
 * 1. Add Open Graph tags to pages missing them
 * 2. Add JSON-LD structured data to all tool pages
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Tool metadata for JSON-LD
const toolMeta = {
  // Dev Tools
  'base64': { name: 'Base64 Encoder/Decoder', category: 'DeveloperApplication' },
  'url-encoder': { name: 'URL Encoder/Decoder', category: 'DeveloperApplication' },
  'html-entity': { name: 'HTML Entity Encoder', category: 'DeveloperApplication' },
  'uuid-generator': { name: 'UUID Generator', category: 'DeveloperApplication' },
  'hash-generator': { name: 'Hash Generator', category: 'DeveloperApplication' },
  'lorem-ipsum': { name: 'Lorem Ipsum Generator', category: 'DeveloperApplication' },
  'jwt-generator': { name: 'JWT Generator', category: 'DeveloperApplication' },
  'jwt-decoder': { name: 'JWT Decoder', category: 'DeveloperApplication' },
  'password-generator': { name: 'Password Generator', category: 'DeveloperApplication' },
  'cron-generator': { name: 'Cron Expression Generator', category: 'DeveloperApplication' },
  'json-formatter': { name: 'JSON Formatter', category: 'DeveloperApplication' },
  'color-converter': { name: 'Color Converter', category: 'DeveloperApplication' },
  'timestamp-converter': { name: 'Unix Timestamp Converter', category: 'DeveloperApplication' },
  'yaml-json': { name: 'YAML JSON Converter', category: 'DeveloperApplication' },
  'markdown-preview': { name: 'Markdown Preview', category: 'DeveloperApplication' },
  'case-converter': { name: 'Case Converter', category: 'DeveloperApplication' },
  'sql-formatter': { name: 'SQL Formatter', category: 'DeveloperApplication' },
  'css-minifier': { name: 'CSS Minifier', category: 'DeveloperApplication' },
  'line-ending': { name: 'Line Ending Converter', category: 'DeveloperApplication' },
  'regex-tester': { name: 'Regex Tester', category: 'DeveloperApplication' },
  'diff-checker': { name: 'Diff Checker', category: 'DeveloperApplication' },

  // Life Tools - Calculators
  'salary-calculator': { name: '연봉 계산기', nameEn: 'Salary Calculator', category: 'UtilitiesApplication' },
  'dday-calculator': { name: 'D-day 계산기', nameEn: 'D-day Calculator', category: 'UtilitiesApplication' },
  'bmi-calculator': { name: 'BMI 계산기', nameEn: 'BMI Calculator', category: 'UtilitiesApplication' },
  'loan-calculator': { name: '대출 이자 계산기', nameEn: 'Loan Calculator', category: 'UtilitiesApplication' },
  'age-calculator': { name: '나이 계산기', nameEn: 'Age Calculator', category: 'UtilitiesApplication' },
  'percent-calculator': { name: '퍼센트 계산기', nameEn: 'Percent Calculator', category: 'UtilitiesApplication' },
  'compound-calculator': { name: '복리 계산기', nameEn: 'Compound Interest Calculator', category: 'UtilitiesApplication' },
  'tip-calculator': { name: '팁 계산기', nameEn: 'Tip Calculator', category: 'UtilitiesApplication' },

  // Life Tools - Utilities
  'character-counter': { name: '글자수 세기', nameEn: 'Character Counter', category: 'UtilitiesApplication' },
  'unit-converter': { name: '단위 변환기', nameEn: 'Unit Converter', category: 'UtilitiesApplication' },
  'qr-generator': { name: 'QR코드 생성기', nameEn: 'QR Code Generator', category: 'UtilitiesApplication' },
  'barcode-generator': { name: '바코드 생성기', nameEn: 'Barcode Generator', category: 'UtilitiesApplication' },
  'favicon-generator': { name: '파비콘 생성기', nameEn: 'Favicon Generator', category: 'UtilitiesApplication' },
  'base-converter': { name: '진법 변환기', nameEn: 'Base Converter', category: 'UtilitiesApplication' },
  'ascii-unicode': { name: 'ASCII/유니코드 변환기', nameEn: 'ASCII/Unicode Converter', category: 'UtilitiesApplication' },
  'emoji-picker': { name: '이모지 검색', nameEn: 'Emoji Picker', category: 'UtilitiesApplication' },

  // Life Tools - Image
  'image-compressor': { name: '이미지 압축', nameEn: 'Image Compressor', category: 'MultimediaApplication' },
  'image-resizer': { name: '이미지 리사이즈', nameEn: 'Image Resizer', category: 'MultimediaApplication' },
  'image-converter': { name: '이미지 형식 변환', nameEn: 'Image Converter', category: 'MultimediaApplication' },

  // Life Tools - Monitor
  'dead-pixel-test': { name: '데드픽셀 테스트', nameEn: 'Dead Pixel Test', category: 'UtilitiesApplication' },
  'pixel-fixer': { name: '픽셀 수리 도구', nameEn: 'Pixel Fixer', category: 'UtilitiesApplication' },
  'screen-burn-test': { name: '번인 테스트', nameEn: 'Burn-in Test', category: 'UtilitiesApplication' },
  'screen-color-test': { name: '화면 색상 테스트', nameEn: 'Screen Color Test', category: 'UtilitiesApplication' },

  // Life Tools - Fun
  'lottery-generator': { name: '로또 번호 생성기', nameEn: 'Lottery Generator', category: 'GameApplication' },
  'roulette': { name: '룰렛 돌리기', nameEn: 'Random Picker Wheel', category: 'GameApplication' },
  'dice-roller': { name: '주사위 굴리기', nameEn: 'Dice Roller', category: 'GameApplication' },
  'coin-flip': { name: '동전 던지기', nameEn: 'Coin Flip', category: 'GameApplication' },
  'typing-test': { name: '타자 연습', nameEn: 'Typing Test', category: 'GameApplication' },
  'reaction-test': { name: '반응속도 테스트', nameEn: 'Reaction Time Test', category: 'GameApplication' },
};

// Find all HTML files in tools directories
function findToolFiles() {
  const files = [];
  const dirs = ['tools/dev', 'tools/life', 'en/tools/dev', 'en/tools/life'];

  for (const dir of dirs) {
    const fullDir = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;

    const tools = fs.readdirSync(fullDir);
    for (const tool of tools) {
      const indexPath = path.join(fullDir, tool, 'index.html');
      if (fs.existsSync(indexPath)) {
        files.push({
          path: indexPath,
          tool: tool,
          isEnglish: dir.startsWith('en/'),
          category: dir.includes('/dev') ? 'dev' : 'life'
        });
      }
    }
  }

  return files;
}

// Generate OG tags for a tool
function generateOGTags(tool, isEnglish, filePath) {
  const meta = toolMeta[tool];
  if (!meta) return null;

  const name = isEnglish ? (meta.nameEn || meta.name) : meta.name;
  const locale = isEnglish ? 'en_US' : 'ko_KR';
  const urlPath = filePath.replace(ROOT_DIR, '').replace(/\\/g, '/').replace('/index.html', '');
  const url = `https://toolneat.com${urlPath}`;

  return `  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="${name} - Toolneat">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://toolneat.com/assets/images/og-image.png">
  <meta property="og:locale" content="${locale}">`;
}

// Generate JSON-LD for a tool
function generateJSONLD(tool, isEnglish, filePath, description) {
  const meta = toolMeta[tool];
  if (!meta) return null;

  const name = isEnglish ? (meta.nameEn || meta.name) : meta.name;
  const urlPath = filePath.replace(ROOT_DIR, '').replace(/\\/g, '/').replace('/index.html', '');
  const url = `https://toolneat.com${urlPath}`;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": meta.category,
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": isEnglish ? "USD" : "KRW"
    },
    "author": {
      "@type": "Organization",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    }
  };

  return `<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>`;
}

// Extract description from HTML
function extractDescription(content) {
  const match = content.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

// Add OG tags if missing
function addOGTags(filePath, tool, isEnglish) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has OG tags
  if (content.includes('og:title')) {
    return false;
  }

  const ogTags = generateOGTags(tool, isEnglish, filePath);
  if (!ogTags) return false;

  // Insert before </head>
  content = content.replace('</head>', `${ogTags}\n</head>`);
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Add JSON-LD if missing
function addJSONLD(filePath, tool, isEnglish) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has JSON-LD
  if (content.includes('application/ld+json')) {
    return false;
  }

  const description = extractDescription(content);
  const jsonld = generateJSONLD(tool, isEnglish, filePath, description);
  if (!jsonld) return false;

  // Insert before </head>
  content = content.replace('</head>', `${jsonld}\n</head>`);
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Main
function main() {
  const files = findToolFiles();
  let ogAdded = 0;
  let jsonldAdded = 0;

  console.log('🔧 Adding SEO tags...\n');

  for (const file of files) {
    const relativePath = path.relative(ROOT_DIR, file.path);

    const ogResult = addOGTags(file.path, file.tool, file.isEnglish);
    const jsonldResult = addJSONLD(file.path, file.tool, file.isEnglish);

    if (ogResult) {
      console.log(`✅ OG: ${relativePath}`);
      ogAdded++;
    }
    if (jsonldResult) {
      console.log(`✅ LD: ${relativePath}`);
      jsonldAdded++;
    }
  }

  console.log(`\n📊 Summary: ${ogAdded} OG tags added, ${jsonldAdded} JSON-LD added`);
}

main();
