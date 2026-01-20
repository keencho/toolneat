const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// ============================================================
// Configuration
// ============================================================

const indexPageConfigs = {
  'tools/index.html': {
    ko: { title: '모든 도구', desc: 'Toolneat의 모든 무료 온라인 도구를 한눈에. 개발 도구, 생활 도구, PDF 도구 100개 이상의 도구를 무료로 사용하세요.', url: 'https://toolneat.com/tools/' },
    en: { title: 'All Tools', desc: 'Browse all free online tools on Toolneat. Developer tools, life tools, PDF tools - 100+ tools available for free.', url: 'https://toolneat.com/en/tools/' }
  },
  'tools/dev/index.html': {
    ko: { title: '개발 도구', desc: '개발자를 위한 무료 온라인 도구 모음. Base64, JSON 포매터, UUID 생성기, 정규식 테스터 등 35개 이상의 개발 도구를 바로 사용하세요.', url: 'https://toolneat.com/tools/dev/' },
    en: { title: 'Developer Tools', desc: 'Free online tools for developers. Base64, JSON formatter, UUID generator, regex tester and 35+ more developer tools.', url: 'https://toolneat.com/en/tools/dev/' }
  },
  'tools/life/index.html': {
    ko: { title: '생활 도구', desc: '일상생활에 유용한 무료 온라인 도구 모음. QR 생성기, 이미지 편집, 계산기, 타이머 등 50개 이상의 생활 도구를 바로 사용하세요.', url: 'https://toolneat.com/tools/life/' },
    en: { title: 'Life Tools', desc: 'Free online tools for everyday life. QR generator, image editor, calculators, timers and 50+ more useful tools.', url: 'https://toolneat.com/en/tools/life/' }
  },
  'tools/pdf/index.html': {
    ko: { title: 'PDF 도구', desc: 'PDF 파일을 쉽게 편집하는 무료 온라인 도구 모음. PDF 병합, 분할, 압축, 변환 등 10개 이상의 PDF 도구를 바로 사용하세요.', url: 'https://toolneat.com/tools/pdf/' },
    en: { title: 'PDF Tools', desc: 'Free online PDF editing tools. Merge, split, compress, convert PDFs and more with 10+ PDF tools.', url: 'https://toolneat.com/en/tools/pdf/' }
  }
};

const staticPageConfigs = {
  'pages/about/index.html': {
    ko: { title: '소개', desc: 'Toolneat은 개발자와 일상생활에 필요한 무료 온라인 도구를 제공합니다.', url: 'https://toolneat.com/pages/about/', type: 'AboutPage' },
    en: { title: 'About', desc: 'Toolneat provides free online tools for developers and everyday life.', url: 'https://toolneat.com/en/pages/about/', type: 'AboutPage' }
  },
  'pages/privacy/index.html': {
    ko: { title: '개인정보처리방침', desc: 'Toolneat 개인정보처리방침입니다.', url: 'https://toolneat.com/pages/privacy/', type: 'WebPage' },
    en: { title: 'Privacy Policy', desc: 'Toolneat Privacy Policy.', url: 'https://toolneat.com/en/pages/privacy/', type: 'WebPage' }
  },
  'pages/terms/index.html': {
    ko: { title: '이용약관', desc: 'Toolneat 이용약관입니다.', url: 'https://toolneat.com/pages/terms/', type: 'WebPage' },
    en: { title: 'Terms of Service', desc: 'Toolneat Terms of Service.', url: 'https://toolneat.com/en/pages/terms/', type: 'WebPage' }
  }
};

// ============================================================
// Helper Functions
// ============================================================

function getRelativePath(filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

function isEnglish(filePath) {
  return filePath.includes('/en/') || filePath.includes('\\en\\');
}

function generateOGTags(config) {
  return `
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="${config.title} - Toolneat">
  <meta property="og:description" content="${config.desc}">
  <meta property="og:url" content="${config.url}">
  <meta property="og:image" content="https://toolneat.com/assets/images/og-image.png">
  <meta property="og:locale" content="${config.locale || 'ko_KR'}">`;
}

function generateCanonicalAndHreflang(koUrl, enUrl) {
  return `
  <!-- Canonical & hreflang -->
  <link rel="canonical" href="${koUrl}">
  <link rel="alternate" hreflang="ko" href="${koUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${koUrl}">`;
}

function generateJsonLd(config) {
  const schema = {
    "@context": "https://schema.org",
    "@type": config.type || "WebPage",
    "name": config.title,
    "description": config.desc,
    "url": config.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    }
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(schema, null, 2).split('\n').join('\n  ')}
  </script>`;
}

function addFaviconTags(content) {
  const faviconBlock = `<link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">`;

  // If already has favicon but missing apple-touch-icon
  if (content.includes('favicon.ico') && !content.includes('apple-touch-icon')) {
    // Find the last favicon line and add after it
    content = content.replace(
      /(<link rel="icon"[^>]*>)(\s*<link rel="icon"[^>]*>)*(\s*<link rel="icon"[^>]*>)?/,
      (match) => {
        return match + '\n  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">\n  <link rel="manifest" href="/manifest.json">';
      }
    );
  }

  return content;
}

// ============================================================
// Main Functions
// ============================================================

function fixIndexPages() {
  console.log('\n📁 Fixing index pages (OG, Canonical, hreflang)...\n');
  let fixed = 0;

  for (const [relativePath, configs] of Object.entries(indexPageConfigs)) {
    // Korean version
    const koPath = path.join(rootDir, relativePath);
    // English version
    const enPath = path.join(rootDir, 'en', relativePath);

    for (const [filePath, lang] of [[koPath, 'ko'], [enPath, 'en']]) {
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${getRelativePath(filePath)}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      const config = configs[lang];
      config.locale = lang === 'ko' ? 'ko_KR' : 'en_US';

      // Add OG tags if missing
      if (!content.includes('og:title')) {
        const ogTags = generateOGTags(config);
        content = content.replace('</head>', ogTags + '\n</head>');
        modified = true;
      }

      // Add canonical if missing
      if (!content.includes('rel="canonical"')) {
        const koUrl = configs.ko.url;
        const enUrl = configs.en.url;
        const canonicalTags = generateCanonicalAndHreflang(koUrl, enUrl);
        // Insert after meta description
        if (content.includes('name="description"')) {
          content = content.replace(
            /(<meta name="description"[^>]*>)/,
            '$1' + canonicalTags
          );
        } else {
          content = content.replace('</head>', canonicalTags + '\n</head>');
        }
        modified = true;
      }

      // Add apple-touch-icon and manifest if missing
      if (!content.includes('apple-touch-icon')) {
        content = addFaviconTags(content);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Fixed: ${getRelativePath(filePath)}`);
        fixed++;
      }
    }
  }

  return fixed;
}

function fixStaticPages() {
  console.log('\n📄 Fixing static pages (JSON-LD)...\n');
  let fixed = 0;

  for (const [relativePath, configs] of Object.entries(staticPageConfigs)) {
    // Korean version
    const koPath = path.join(rootDir, relativePath);
    // English version
    const enPath = path.join(rootDir, 'en', relativePath);

    for (const [filePath, lang] of [[koPath, 'ko'], [enPath, 'en']]) {
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${getRelativePath(filePath)}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      const config = configs[lang];

      // Add JSON-LD if missing
      if (!content.includes('application/ld+json')) {
        const jsonLd = generateJsonLd(config);
        content = content.replace('</head>', jsonLd + '\n</head>');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Added JSON-LD: ${getRelativePath(filePath)}`);
        fixed++;
      }
    }
  }

  return fixed;
}

function fixToolPages() {
  console.log('\n🔧 Fixing tool pages (apple-touch-icon, manifest)...\n');
  let fixed = 0;

  const toolDirs = [
    path.join(rootDir, 'tools'),
    path.join(rootDir, 'en/tools')
  ];

  function processDir(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        // Check for index.html in this directory
        const indexPath = path.join(fullPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          let content = fs.readFileSync(indexPath, 'utf-8');

          if (!content.includes('apple-touch-icon') || !content.includes('manifest')) {
            // Add missing favicon tags
            if (content.includes('favicon.ico')) {
              if (!content.includes('apple-touch-icon')) {
                content = content.replace(
                  /(<link rel="icon" type="image\/png" sizes="16x16"[^>]*>)/,
                  '$1\n  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">'
                );
              }
              if (!content.includes('manifest')) {
                content = content.replace(
                  /(<link rel="apple-touch-icon"[^>]*>)/,
                  '$1\n  <link rel="manifest" href="/manifest.json">'
                );
              }
              fs.writeFileSync(indexPath, content);
              console.log(`   ✅ Fixed favicon tags: ${getRelativePath(indexPath)}`);
              fixed++;
            }
          }
        }
        // Recurse into subdirectories
        processDir(fullPath);
      }
    }
  }

  for (const dir of toolDirs) {
    processDir(dir);
  }

  return fixed;
}

function deleteTempFiles() {
  console.log('\n🗑️ Cleaning up temp files...\n');
  const tempFile = path.join(rootDir, 'en/tools/life/salary-calculator/temp.html');
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
    console.log(`   ✅ Deleted: en/tools/life/salary-calculator/temp.html`);
    return 1;
  }
  return 0;
}

// ============================================================
// Run
// ============================================================

console.log('='.repeat(60));
console.log('SEO FIX SCRIPT');
console.log('='.repeat(60));

const indexFixed = fixIndexPages();
const staticFixed = fixStaticPages();
const toolsFixed = fixToolPages();
const tempDeleted = deleteTempFiles();

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Index pages fixed: ${indexFixed}`);
console.log(`Static pages fixed: ${staticFixed}`);
console.log(`Tool pages fixed: ${toolsFixed}`);
console.log(`Temp files deleted: ${tempDeleted}`);
console.log('='.repeat(60));
