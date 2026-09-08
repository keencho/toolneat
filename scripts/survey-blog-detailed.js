const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function list() {
  const out = [];
  for (const lang of ['', 'en']) {
    const d = path.join(ROOT, lang, 'blog');
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d))
      if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(d, f));
  }
  return out;
}

const files = list();
console.log(`Blogs: ${files.length}`);

const data = [];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });
  const $article = $('main article').first();
  const h2s = $article.find('h2').map((_, h) => $(h).text().trim()).get();

  // word count via text
  const txt = $article.text().replace(/\s+/g, ' ').trim();
  const wc = txt.split(/\s+/).length;

  // FAQ detection (h2 ~ "자주 묻는" / "Frequently")
  const faqIdx = h2s.findIndex(h => /자주.+질문|자주\s*하는\s*질문|Frequently|FAQ/i.test(h));
  // Conclusion
  const concIdx = h2s.findIndex(h => /^마무리$|^마치며$|정리하면|^결론$|Conclusion|^Wrapping|^Summary/i.test(h));

  // Padding h2 = sections after conclusion and before FAQ
  let paddingH2s = [];
  if (concIdx >= 0) {
    if (faqIdx > concIdx) paddingH2s = h2s.slice(concIdx + 1, faqIdx);
    else paddingH2s = h2s.slice(concIdx + 1);
  }

  data.push({
    file: path.relative(ROOT, f),
    h2Count: h2s.length,
    wc,
    h2s,
    faqIdx,
    concIdx,
    paddingH2s
  });
}

const wcs = data.map(d => d.wc).sort((a, b) => a - b);
console.log(`\nWord count: min ${wcs[0]}, median ${wcs[Math.floor(wcs.length / 2)]}, max ${wcs[wcs.length - 1]}`);
console.log(`H2 count median: ${data.map(d => d.h2Count).sort((a,b)=>a-b)[Math.floor(data.length/2)]}`);

console.log(`\nWith FAQ section: ${data.filter(d => d.faqIdx >= 0).length}/${data.length}`);
console.log(`With Conclusion: ${data.filter(d => d.concIdx >= 0).length}`);
console.log(`With padding (after conclusion): ${data.filter(d => d.paddingH2s.length > 0).length}`);

// Show all blogs with padding
console.log('\n=== PADDING DETAIL ===');
for (const d of data.filter(d => d.paddingH2s.length > 0)) {
  console.log(`${d.file} (${d.wc} words)`);
  console.log(`  conc at idx ${d.concIdx} ("${d.h2s[d.concIdx]}")`);
  console.log(`  faq at idx ${d.faqIdx}`);
  console.log(`  padding h2s (${d.paddingH2s.length}): ${d.paddingH2s.join(' | ')}`);
}

// Show distribution of FAQ presence by word count
console.log('\n=== FAQ vs WC ===');
const withFaq = data.filter(d => d.faqIdx >= 0);
const noFaq = data.filter(d => d.faqIdx < 0);
console.log(`  With FAQ: median ${withFaq.map(d=>d.wc).sort((a,b)=>a-b)[Math.floor(withFaq.length/2)]} words`);
console.log(`  No FAQ: median ${noFaq.map(d=>d.wc).sort((a,b)=>a-b)[Math.floor(noFaq.length/2)]} words`);
