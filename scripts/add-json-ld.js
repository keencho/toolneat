const fs = require('fs');
const path = require('path');

// Configuration for different page types
const pageConfigs = {
  // Main homepage
  homepage: {
    ko: {
      name: "Toolneat - 온라인 도구 모음",
      description: "개발자와 일상생활에 필요한 무료 온라인 도구 모음. Base64, JSON 포맷터, QR 생성기, PDF 도구 등 100개 이상의 도구를 무료로 사용하세요.",
      url: "https://toolneat.com/"
    },
    en: {
      name: "Toolneat - Free Online Tools",
      description: "Free online tools for developers and everyday life. Base64, JSON formatter, QR generator, PDF tools and 100+ more tools available for free.",
      url: "https://toolneat.com/en/"
    }
  },
  // All tools page
  allTools: {
    ko: {
      name: "모든 도구",
      description: "Toolneat의 모든 무료 온라인 도구를 한눈에. 개발 도구, 생활 도구, PDF 도구 100개 이상의 도구를 무료로 사용하세요.",
      url: "https://toolneat.com/tools/"
    },
    en: {
      name: "All Tools",
      description: "Browse all free online tools on Toolneat. Developer tools, life tools, PDF tools - 100+ tools available for free.",
      url: "https://toolneat.com/en/tools/"
    }
  },
  // Dev tools category
  devTools: {
    ko: {
      name: "개발 도구",
      description: "개발자를 위한 무료 온라인 도구 모음. Base64, JSON 포매터, UUID 생성기, 정규식 테스터 등 35개 이상의 개발 도구를 바로 사용하세요.",
      url: "https://toolneat.com/tools/dev/"
    },
    en: {
      name: "Developer Tools",
      description: "Free online tools for developers. Base64, JSON formatter, UUID generator, regex tester and 35+ more developer tools.",
      url: "https://toolneat.com/en/tools/dev/"
    }
  },
  // Life tools category
  lifeTools: {
    ko: {
      name: "생활 도구",
      description: "일상생활에 유용한 무료 온라인 도구 모음. QR 생성기, 이미지 편집, 계산기, 타이머 등 50개 이상의 생활 도구를 바로 사용하세요.",
      url: "https://toolneat.com/tools/life/"
    },
    en: {
      name: "Life Tools",
      description: "Free online tools for everyday life. QR generator, image editor, calculators, timers and 50+ more useful tools.",
      url: "https://toolneat.com/en/tools/life/"
    }
  },
  // PDF tools category
  pdfTools: {
    ko: {
      name: "PDF 도구",
      description: "PDF 파일을 쉽게 편집하는 무료 온라인 도구 모음. PDF 병합, 분할, 압축, 변환 등 10개 이상의 PDF 도구를 바로 사용하세요.",
      url: "https://toolneat.com/tools/pdf/"
    },
    en: {
      name: "PDF Tools",
      description: "Free online PDF editing tools. Merge, split, compress, convert PDFs and more with 10+ PDF tools.",
      url: "https://toolneat.com/en/tools/pdf/"
    }
  }
};

function generateWebSiteSchema(config) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.name,
    "description": config.description,
    "url": config.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": config.url + "?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    }
  };
}

function generateCollectionPageSchema(config) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": config.name,
    "description": config.description,
    "url": config.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    },
    "provider": {
      "@type": "Organization",
      "name": "Toolneat",
      "url": "https://toolneat.com"
    }
  };
}

function getJsonLdScript(schema) {
  return `<script type="application/ld+json">
  ${JSON.stringify(schema, null, 2).split('\n').join('\n  ')}
  </script>`;
}

function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules') {
        getAllHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasJsonLd(content) {
  return content.includes('application/ld+json');
}

function addJsonLdToPage(filePath, content) {
  const relativePath = filePath.replace(/\\/g, '/');
  const isEnglish = relativePath.includes('/en/');
  const lang = isEnglish ? 'en' : 'ko';

  let config = null;
  let schemaType = null;

  // Determine page type
  if (relativePath.endsWith('/index.html') || relativePath.endsWith('\\index.html')) {
    // Check which type of index page
    if (relativePath.match(/[\/\\]tools[\/\\]dev[\/\\]index\.html$/)) {
      config = pageConfigs.devTools[lang];
      schemaType = 'collection';
    } else if (relativePath.match(/[\/\\]tools[\/\\]life[\/\\]index\.html$/)) {
      config = pageConfigs.lifeTools[lang];
      schemaType = 'collection';
    } else if (relativePath.match(/[\/\\]tools[\/\\]pdf[\/\\]index\.html$/)) {
      config = pageConfigs.pdfTools[lang];
      schemaType = 'collection';
    } else if (relativePath.match(/[\/\\]tools[\/\\]index\.html$/)) {
      config = pageConfigs.allTools[lang];
      schemaType = 'collection';
    } else if (relativePath.match(/[\/\\]en[\/\\]index\.html$/) ||
               relativePath.match(/toolneat[\/\\]index\.html$/)) {
      config = pageConfigs.homepage[lang];
      schemaType = 'website';
    }
  }

  if (!config) {
    return null; // Not an index page we handle
  }

  const schema = schemaType === 'website'
    ? generateWebSiteSchema(config)
    : generateCollectionPageSchema(config);

  const jsonLdScript = getJsonLdScript(schema);

  // Insert before </head>
  const newContent = content.replace('</head>', `${jsonLdScript}\n</head>`);

  return newContent;
}

function main() {
  const rootDir = path.join(__dirname, '..');
  const htmlFiles = getAllHtmlFiles(rootDir);

  let checked = 0;
  let added = 0;
  let alreadyHas = 0;
  const missing = [];
  const updated = [];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(rootDir, file);

    // Only check index pages (category pages, not tool pages)
    const isIndexPage = file.endsWith('index.html') &&
      (file.includes('tools' + path.sep + 'dev' + path.sep + 'index.html') ||
       file.includes('tools' + path.sep + 'life' + path.sep + 'index.html') ||
       file.includes('tools' + path.sep + 'pdf' + path.sep + 'index.html') ||
       file.includes('tools' + path.sep + 'index.html') ||
       file.match(/[\/\\]en[\/\\]index\.html$/) ||
       relativePath === 'index.html');

    if (!isIndexPage) {
      continue;
    }

    checked++;

    if (hasJsonLd(content)) {
      alreadyHas++;
      console.log(`✓ ${relativePath} (already has JSON-LD)`);
      continue;
    }

    const newContent = addJsonLdToPage(file, content);
    if (newContent) {
      fs.writeFileSync(file, newContent);
      added++;
      updated.push(relativePath);
      console.log(`✅ Added JSON-LD to ${relativePath}`);
    } else {
      missing.push(relativePath);
      console.log(`⚠️ ${relativePath} - unhandled page type`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Checked: ${checked} index pages`);
  console.log(`   Already had JSON-LD: ${alreadyHas}`);
  console.log(`   Added JSON-LD: ${added}`);

  if (updated.length > 0) {
    console.log('\n📝 Updated files:');
    updated.forEach(f => console.log(`   - ${f}`));
  }

  if (missing.length > 0) {
    console.log('\n⚠️ Unhandled pages:');
    missing.forEach(f => console.log(`   - ${f}`));
  }
}

main();
