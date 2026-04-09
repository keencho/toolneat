const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const footerHtml = fs.readFileSync(path.join(COMPONENTS_DIR, 'footer.html'), 'utf-8').trim();

function findHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git', 'components', '.claude', '.idea'].includes(item)) findHtmlFiles(full, files);
    } else if (item.endsWith('.html')) files.push(full);
  }
  return files;
}

let fixed = 0;
for (const file of findHtmlFiles(ROOT_DIR)) {
  let content = fs.readFileSync(file, 'utf-8');
  const orig = content;

  // Fix 1: Clean duplicate footers
  const footerStart = content.indexOf('<div id="footer">');
  if (footerStart !== -1) {
    const before = content.substring(0, footerStart);
    const after = content.substring(footerStart);
    const boundary = after.match(/\n\s*(?=<!-- Tool Script -->|<style>|<\/body>)/);
    if (boundary) {
      const footerSection = after.substring(0, boundary.index);
      const rest = after.substring(boundary.index);
      const footerCount = (footerSection.match(/<\/footer>/g) || []).length;
      if (footerCount > 1) {
        const isEnglish = path.relative(ROOT_DIR, file).startsWith('en');
        let cleanFooter = footerHtml;
        if (isEnglish) {
          cleanFooter = cleanFooter
            .replace(/href="\/tools\//g, 'href="/en/tools/')
            .replace(/href="\/pages\//g, 'href="/en/pages/')
            .replace(/href="\/"/g, 'href="/en"');
        }
        content = before + '<div id="footer">\n' + cleanFooter + '\n</div>\n' + rest;
      }
    }
  }

  // Fix 2: </div><main -> proper line break
  content = content.replace(/<\/div><main/g, '</div>\n\n<main');

  // Fix 3: </div></body> -> proper line break
  content = content.replace(/<\/div><\/body>/g, '</div>\n</body>');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf-8');
    fixed++;
  }
}
console.log('Fixed:', fixed, 'files');
