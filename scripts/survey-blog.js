const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function listBlogFiles() {
  const out = [];
  for (const lang of ['', 'en']) {
    const dir = path.join(ROOT, lang, 'blog');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(dir, f));
    }
  }
  return out;
}

function analyze(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  // Find <main ...> ... </main>
  const mainStart = html.indexOf('<main');
  const mainEnd = html.indexOf('</main>', mainStart);
  if (mainStart === -1 || mainEnd === -1) return null;
  const main = html.slice(mainStart, mainEnd);

  // Find <article ...> ... </article>
  const artStart = main.indexOf('<article');
  const artEnd = main.indexOf('</article>', artStart);
  if (artStart === -1 || artEnd === -1) return null;
  const article = main.slice(artStart, artEnd);

  // h2 list
  const h2s = [...article.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m =>
    m[1].replace(/<[^>]+>/g, '').trim()
  );

  // word count
  const txt = article.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wc = txt.split(/\s+/).length;

  // FAQ section?
  const hasFaq = h2s.some(h => /자주.+질문|Frequently|FAQ/i.test(h));
  // Conclusion marker?
  const concludeIdx = h2s.findIndex(h => /마무리|마치며|정리하면|결론|Conclusion|Wrapping|Summary/i.test(h));

  return {
    file: path.relative(ROOT, filePath),
    h2Count: h2s.length,
    h2s,
    wc,
    hasFaq,
    concludeIdx,
    h2sAfterConclude: concludeIdx >= 0 ? h2s.slice(concludeIdx + 1) : []
  };
}

const all = listBlogFiles().map(analyze).filter(Boolean);

console.log('=== BLOG SURVEY ===');
console.log(`Total: ${all.length}`);

const wcs = all.map(b => b.wc).sort((a, b) => a - b);
console.log(`Word counts — min: ${wcs[0]}, median: ${wcs[Math.floor(wcs.length / 2)]}, max: ${wcs[wcs.length - 1]}`);

const h2Counts = all.map(b => b.h2Count).sort((a, b) => a - b);
console.log(`H2 counts — min: ${h2Counts[0]}, median: ${h2Counts[Math.floor(h2Counts.length / 2)]}, max: ${h2Counts[h2Counts.length - 1]}`);

const withFaq = all.filter(b => b.hasFaq).length;
const withConclude = all.filter(b => b.concludeIdx >= 0).length;
const withPaddingAfterConclude = all.filter(b => b.h2sAfterConclude.length > 0).length;
console.log(`With FAQ: ${withFaq}/${all.length}`);
console.log(`With "마무리"/Conclusion: ${withConclude}/${all.length}`);
console.log(`With h2 sections AFTER 마무리 (= padding): ${withPaddingAfterConclude}/${all.length}`);

console.log('\n=== PADDING DETAILS (h2 sections after 마무리) ===');
for (const b of all.filter(b => b.h2sAfterConclude.length > 0)) {
  console.log(`\n${b.file} (${b.wc} words, ${b.h2Count} h2)`);
  console.log(`  After 마무리: ${b.h2sAfterConclude.join(' | ')}`);
}
