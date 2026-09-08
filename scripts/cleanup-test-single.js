// Dry test: run cleanup on one file, print diff, do not write
const fs = require('fs');
const path = require('path');

process.env.DRY = '1';
const orig = fs.readFileSync.bind(fs);
const writes = [];
fs.writeFileSync = (p, c) => { writes.push({ p, c }); };

const target = path.resolve(__dirname, '..', 'tools', 'life', 'age-calculator.html');

// Stub listToolFiles to return only one
const M = require('module');
const realResolve = M._resolveFilename;

// Just inline the logic
const html = orig(target, 'utf-8');
const before = html;

// Use the cleanup module
const cleanup = path.resolve(__dirname, 'cleanup-ai-pattern.js');
// Modify the script to expose function -- skip and just require with override
process.env.SINGLE_TARGET = target;

// Run via require with hack: temporarily replace listToolFiles
// Easier: spawn child process. Let's just exec cleanup but capture file before/after.

const beforeSize = html.length;
console.log('BEFORE size:', beforeSize);
// Just import and exec
delete require.cache[cleanup];
// Override files list by monkey patching
const origReadDir = fs.readdirSync;
fs.readdirSync = (p) => {
  if (p.includes(path.join('tools', 'life')) && !p.includes('en')) return ['age-calculator.html'];
  if (p.includes(path.join('tools', 'dev')) && !p.includes('en')) return [];
  if (p.includes(path.join('tools', 'pdf')) && !p.includes('en')) return [];
  if (p.includes(path.join('tools', 'game')) && !p.includes('en')) return [];
  if (p.includes('en')) return [];
  return [];
};

require(cleanup);

const after = orig(target, 'utf-8');
console.log('AFTER size:', after.length);
console.log('DIFF lines:');
// Show diff of section area
const oldSect = before.indexOf('<section class="mt-8');
const newSect = after.indexOf('<section class="mt-8');
console.log('\n--- NEW SECTION ---');
const endIdx = after.indexOf('</section>', newSect) + 10;
console.log(after.slice(newSect, endIdx + 500));
