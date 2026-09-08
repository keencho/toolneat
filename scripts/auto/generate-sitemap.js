#!/usr/bin/env node
/**
 * Sitemap Generator for Toolneat
 *
 * Usage: node scripts/generate-sitemap.js
 *
 * Scans tools/dev, tools/life, pages directories and generates sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toolneat.com';
const ROOT_DIR = path.join(__dirname, '..', '..');

// 애드센스 "가치가 별로 없는 콘텐츠" 대응: EN 페이지를 색인 대상에서 제외하는 동안
// sitemap에서도 빼둔다. EN 페이지는 noindex 상태이므로 hreflang alternate도 함께 뺀다.
// KO 승인 후 되돌리기: 이 값을 true로 바꾸고 재생성 + node scripts/auto/en-noindex.js --remove
// 참고: docs/adsense-plan.md Phase 0-2
const INCLUDE_EN = false;

// Configuration for different page types
const config = {
  mainPages: [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
  ],
  staticPages: [
    { path: '/pages/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/pages/contact', priority: '0.5', changefreq: 'monthly' },
    { path: '/pages/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/pages/terms', priority: '0.3', changefreq: 'monthly' },
  ],
  // Category index pages
  categoryPages: [
    { path: '/tools', priority: '0.7', changefreq: 'weekly' },
    { path: '/tools/dev', priority: '0.7', changefreq: 'weekly' },
    { path: '/tools/life', priority: '0.7', changefreq: 'weekly' },
    { path: '/tools/game', priority: '0.7', changefreq: 'weekly' },
    { path: '/tools/pdf', priority: '0.7', changefreq: 'weekly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  ],
  toolDirs: [
    { dir: 'tools/dev', priority: '0.8', changefreq: 'monthly' },
    { dir: 'tools/life', priority: '0.8', changefreq: 'monthly' },
    { dir: 'tools/game', priority: '0.8', changefreq: 'monthly' },
    { dir: 'tools/pdf', priority: '0.8', changefreq: 'monthly' },
  ],
  // Blog posts
  blogDir: { dir: 'blog', priority: '0.7', changefreq: 'monthly' }
};

// Get .html files (excluding index.html, category pages like dev.html)
function getHtmlFiles(dirPath) {
  const fullPath = path.join(ROOT_DIR, dirPath);
  if (!fs.existsSync(fullPath)) return [];

  return fs.readdirSync(fullPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
    .map(dirent => dirent.name.replace('.html', ''))
    .filter(name => !['dev', 'life', 'game', 'pdf', 'index'].includes(name)); // exclude category pages
}

function generateUrlEntry(koPath, priority, changefreq) {
  // Handle root path to avoid trailing slash
  const koUrlPath = koPath === '/' ? '' : koPath;
  const enUrlPath = koPath === '/' ? '/en' : `/en${koPath}`;

  if (!INCLUDE_EN) {
    return `  <url>
    <loc>${BASE_URL}${koUrlPath}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  return `  <url>
    <loc>${BASE_URL}${koUrlPath}</loc>
    <xhtml:link rel="alternate" hreflang="ko" href="${BASE_URL}${koUrlPath}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enUrlPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${koUrlPath}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>

  <url>
    <loc>${BASE_URL}${enUrlPath}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enUrlPath}"/>
    <xhtml:link rel="alternate" hreflang="ko" href="${BASE_URL}${koUrlPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${koUrlPath}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap() {
  let urls = [];

  // Main pages
  config.mainPages.forEach(page => {
    urls.push(generateUrlEntry(page.path, page.priority, page.changefreq));
  });

  // Static pages (about, privacy, terms)
  config.staticPages.forEach(page => {
    urls.push(generateUrlEntry(page.path, page.priority, page.changefreq));
  });

  // Category index pages
  config.categoryPages.forEach(page => {
    urls.push(generateUrlEntry(page.path, page.priority, page.changefreq));
  });

  // Tool pages (now .html files)
  config.toolDirs.forEach(({ dir, priority, changefreq }) => {
    const tools = getHtmlFiles(dir);
    tools.forEach(tool => {
      const toolPath = `/${dir}/${tool}`;
      urls.push(generateUrlEntry(toolPath, priority, changefreq));
    });
  });

  // Blog posts
  if (config.blogDir) {
    const { dir, priority, changefreq } = config.blogDir;
    const posts = getHtmlFiles(dir);
    posts.forEach(post => {
      const postPath = `/${dir}/${post}`;
      urls.push(generateUrlEntry(postPath, priority, changefreq));
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${urls.join('\n\n')}

</urlset>
`;

  const outputPath = path.join(ROOT_DIR, 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf8');

  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`   Total URLs: ${urls.length * (INCLUDE_EN ? 2 : 1)} (${INCLUDE_EN ? 'ko + en' : 'ko only — EN excluded'})`);
}

generateSitemap();
