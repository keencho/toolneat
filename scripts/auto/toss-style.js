const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules','.git','components','.claude','.idea'].includes(item)) findHtmlFiles(full, files);
    } else if (item.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const f of findHtmlFiles('.')) {
  let c = fs.readFileSync(f, 'utf-8');
  const orig = c;

  // 1. Remove border classes
  c = c.replace(/ border border-gray-200 dark:border-gray-700/g, '');
  c = c.replace(/ border border-gray-100 dark:border-gray-700/g, '');
  c = c.replace(/ border border-gray-200/g, '');
  c = c.replace(/ border border-gray-100/g, '');

  // 2. Remove hover border effects (all colors)
  c = c.replace(/ hover:border-[\w]+-\d+ dark:hover:border-[\w]+-\d+/g, '');
  c = c.replace(/ hover:border-[\w]+-\d+/g, '');

  // 3. Remove hover shadow effects
  c = c.replace(/ hover:shadow-md/g, '');
  c = c.replace(/ hover:shadow-sm/g, '');

  // 4. rounded-xl on cards -> rounded-2xl
  c = c.replace(/bg-white dark:bg-gray-800 rounded-xl/g, 'bg-white dark:bg-gray-800 rounded-2xl');

  // 5. Dark icon bg opacity /10 -> /15
  c = c.replace(/dark:bg-([\w]+)-500\/10/g, 'dark:bg-$1-500/15');

  // 6. Add hover:bg to card-like <a> that have transition-all but no hover:bg
  c = c.replace(/transition-all group"/g, 'transition-all hover:bg-gray-100 dark:hover:bg-gray-700 group"');
  // Avoid double-adding
  c = c.replace(/hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/g,
    'hover:bg-gray-100 dark:hover:bg-gray-700');
  // For elements that already had hover:bg-gray-50
  c = c.replace(/hover:bg-gray-50 dark:hover:bg-gray-700\/50/g, 'hover:bg-gray-100 dark:hover:bg-gray-700');

  if (c !== orig) {
    fs.writeFileSync(f, c);
    changed++;
  }
}
console.log('Files updated:', changed);
