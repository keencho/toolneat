#!/usr/bin/env node
/**
 * Diversify Tool Page Guide Section Structure for Toolneat
 *
 * Transforms tool page guide section CSS classes into 4 variants (A/B/C/D)
 * to avoid Google flagging pages as auto-generated content.
 * Uses the same deterministic variant assignment as diversify-headings.js.
 *
 * Usage:
 *   node scripts/auto/diversify-structure.js           # Execute changes
 *   node scripts/auto/diversify-structure.js --dry-run  # Preview only
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const DRY_RUN = process.argv.includes('--dry-run');

// Tool directories to process (exclude game)
const TOOL_DIRS = ['tools/dev', 'tools/life', 'tools/pdf'];

// ─── Variant Definitions ────────────────────────────────────────────────────

const VARIANTS = {
  A: {
    // Original - no changes
    section: null,
    h3: null,
    h3Alt: null,
    ul: null,
    ol: null,
    qaDivWrap: null,
    qaH4: null,
    qaP: null,
    qaPClassed: null,
  },
  B: {
    section: {
      from: 'mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700',
      to:   'mt-10 bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-600',
    },
    h3: {
      from: 'text-lg font-semibold mt-6 mb-3',
      to:   'text-lg font-bold mt-8 mb-2',
    },
    h3Alt: {
      from: 'text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3',
      to:   'text-lg font-bold mt-8 mb-2',
    },
    ul: {
      from: 'list-disc list-inside space-y-2',
      to:   'list-disc pl-5 space-y-1.5',
    },
    ol: {
      from: 'list-decimal list-inside space-y-2',
      to:   'list-decimal pl-5 space-y-1.5',
    },
    qaDivWrap: {
      from: '<div class="space-y-4">',
      to:   '<div class="space-y-3">',
    },
    qaH4: {
      from: '<h4 class="font-medium">',
      to:   '<h4 class="font-semibold text-gray-800 dark:text-gray-200">',
    },
    qaH4Alt: {
      from: '<h4 class="font-medium text-gray-900 dark:text-white">',
      to:   '<h4 class="font-semibold text-gray-800 dark:text-gray-200">',
    },
    qaP: {
      from: /(<h4 class="font-semibold text-gray-800 dark:text-gray-200">[^<]*<\/h4>\s*)<p>/g,
      to:   '$1<p class="text-gray-500 dark:text-gray-400 mt-1">',
    },
    qaPClassed: {
      from: /(<h4 class="font-semibold text-gray-800 dark:text-gray-200">[^<]*<\/h4>\s*)(<p class="text-gray-600 dark:text-gray-400">)/g,
      to:   '$1<p class="text-gray-500 dark:text-gray-400 mt-1">',
    },
  },
  C: {
    section: {
      from: 'mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700',
      to:   'mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700',
    },
    h3: {
      from: 'text-lg font-semibold mt-6 mb-3',
      to:   'text-base font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2',
    },
    h3Alt: {
      from: 'text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3',
      to:   'text-base font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2',
    },
    ul: null, // keep original for variant C
    ol: null, // keep original for variant C
    qaDivWrap: {
      from: '<div class="space-y-4">',
      to:   '<div class="divide-y divide-gray-100 dark:divide-gray-700">',
    },
    qaH4: {
      from: '<h4 class="font-medium">',
      to:   '<h4 class="font-medium pt-3 first:pt-0">',
    },
    qaH4Alt: {
      from: '<h4 class="font-medium text-gray-900 dark:text-white">',
      to:   '<h4 class="font-medium pt-3 first:pt-0 text-gray-900 dark:text-white">',
    },
    qaP: {
      from: /(<h4 class="font-medium pt-3 first:pt-0[^"]*">[^<]*<\/h4>\s*)<p>/g,
      to:   '$1<p class="text-gray-600 dark:text-gray-400 pb-1">',
    },
    qaPClassed: {
      from: /(<h4 class="font-medium pt-3 first:pt-0[^"]*">[^<]*<\/h4>\s*)(<p class="text-gray-600 dark:text-gray-400">)/g,
      to:   '$1<p class="text-gray-600 dark:text-gray-400 pb-1">',
    },
  },
  D: {
    section: {
      from: 'mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700',
      to:   'mt-8 bg-white dark:bg-gray-800 rounded-lg p-5 md:p-8 ring-1 ring-gray-100 dark:ring-gray-700',
    },
    h3: {
      from: 'text-lg font-semibold mt-6 mb-3',
      to:   'text-lg font-semibold mt-6 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700',
    },
    h3Alt: {
      from: 'text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3',
      to:   'text-lg font-semibold mt-6 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700',
    },
    ul: {
      from: 'list-disc list-inside space-y-2',
      to:   'list-disc ml-5 space-y-2',
    },
    ol: {
      from: 'list-decimal list-inside space-y-2',
      to:   'list-decimal ml-5 space-y-2',
    },
    qaDivWrap: {
      from: '<div class="space-y-4">',
      to:   '<div class="space-y-5">',
    },
    qaH4: {
      from: '<h4 class="font-medium">',
      to:   '<h4 class="font-semibold text-sm">',
    },
    qaH4Alt: {
      from: '<h4 class="font-medium text-gray-900 dark:text-white">',
      to:   '<h4 class="font-semibold text-sm">',
    },
    qaP: {
      from: /(<h4 class="font-semibold text-sm">[^<]*<\/h4>\s*)<p>/g,
      to:   '$1<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">',
    },
    qaPClassed: {
      from: /(<h4 class="font-semibold text-sm">[^<]*<\/h4>\s*)(<p class="text-gray-600 dark:text-gray-400">)/g,
      to:   '$1<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">',
    },
  },
};

// ─── Tool List (deterministic round-robin, same as diversify-headings.js) ───

function getToolFiles(dir) {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Guide Section Detection ────────────────────────────────────────────────

/**
 * Find the guide section in HTML. Returns the start/end indices of the
 * <section> that contains the guide content.
 * We look for: <section class="mt-8 bg-white ..."> followed by <h2> guide title
 * then <div class="prose ..."> containing h3 headings.
 */
function findGuideSection(html) {
  // Find the section containing the prose guide (has <h2> and <h3> headings)
  // Allow optional extra classes after the base pattern
  const sectionRegex = /<section class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700[^"]*">/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    // Check if this section contains prose div with h3 headings
    const sectionStart = match.index;
    const afterSection = html.substring(sectionStart, Math.min(sectionStart + 2000, html.length));
    if (afterSection.includes('prose') && afterSection.includes('<h3')) {
      return sectionStart;
    }
  }
  return -1;
}

// ─── Apply Variant ──────────────────────────────────────────────────────────

function applyVariant(html, variant) {
  const v = VARIANTS[variant];
  if (variant === 'A') return html; // No changes for variant A

  let result = html;

  // Find guide section to scope replacements
  const guideSectionStart = findGuideSection(result);
  if (guideSectionStart === -1) return html; // No guide section found

  // Split into before-guide and guide+after parts
  const beforeGuide = result.substring(0, guideSectionStart);
  let guideAndAfter = result.substring(guideSectionStart);

  // 1. Section wrapper class (preserve any extra classes after the base pattern)
  if (v.section) {
    const sectionFromEscaped = escapeRegex(v.section.from);
    guideAndAfter = guideAndAfter.replace(
      new RegExp(sectionFromEscaped + '([^"]*)'),
      v.section.to + '$1'
    );
  }

  // 2. H3 classes (both standard and alternate patterns)
  // Replace the alternate pattern first (more specific) then the standard one
  if (v.h3Alt) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.h3Alt.from), 'g'),
      v.h3Alt.to
    );
  }
  if (v.h3) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.h3.from), 'g'),
      v.h3.to
    );
  }

  // 3. UL class
  if (v.ul) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.ul.from), 'g'),
      v.ul.to
    );
  }

  // 4. OL class
  if (v.ol) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.ol.from), 'g'),
      v.ol.to
    );
  }

  // 5. Q&A container div
  if (v.qaDivWrap) {
    guideAndAfter = guideAndAfter.replace(
      v.qaDivWrap.from,
      v.qaDivWrap.to
    );
  }

  // 6. Q&A h4 (handle alternate pattern first — more specific)
  if (v.qaH4Alt) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.qaH4Alt.from), 'g'),
      v.qaH4Alt.to
    );
  }
  if (v.qaH4) {
    guideAndAfter = guideAndAfter.replace(
      new RegExp(escapeRegex(v.qaH4.from), 'g'),
      v.qaH4.to
    );
  }

  // 7. Q&A answer <p> — handle both classless and classed variants
  // First handle the classed variant (some PDF files have class on <p>)
  if (v.qaPClassed) {
    guideAndAfter = guideAndAfter.replace(v.qaPClassed.from, v.qaPClassed.to);
  }
  // Then handle the classless variant (most files)
  if (v.qaP) {
    guideAndAfter = guideAndAfter.replace(v.qaP.from, v.qaP.to);
  }

  return beforeGuide + guideAndAfter;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  const variantKeys = ['A', 'B', 'C', 'D'];
  const stats = { A: 0, B: 0, C: 0, D: 0, skipped: 0, total: 0, changed: 0 };

  // Collect all tool files across directories (same logic as diversify-headings.js)
  const allTools = [];
  for (const dir of TOOL_DIRS) {
    const files = getToolFiles(dir);
    for (const file of files) {
      allTools.push({ dir, file });
    }
  }

  // Sort for deterministic order (same as diversify-headings.js)
  allTools.sort((a, b) => {
    const pathA = `${a.dir}/${a.file}`;
    const pathB = `${b.dir}/${b.file}`;
    return pathA.localeCompare(pathB);
  });

  console.log(`Found ${allTools.length} tool files to process`);
  if (DRY_RUN) console.log('=== DRY RUN MODE ===\n');

  for (let i = 0; i < allTools.length; i++) {
    const { dir, file } = allTools[i];
    const variant = variantKeys[i % 4];
    const koPath = path.join(ROOT_DIR, dir, file);
    const enPath = path.join(ROOT_DIR, 'en', dir, file);

    stats.total++;

    if (!fs.existsSync(koPath)) {
      console.log(`  SKIP (KO not found): ${dir}/${file}`);
      stats.skipped++;
      continue;
    }

    // Process Korean version
    const koHtml = fs.readFileSync(koPath, 'utf8');
    const koResult = applyVariant(koHtml, variant);
    const koChanged = koResult !== koHtml;

    // Process English version
    let enChanged = false;
    let enResult = null;
    if (fs.existsSync(enPath)) {
      const enHtml = fs.readFileSync(enPath, 'utf8');
      enResult = applyVariant(enHtml, variant);
      enChanged = enResult !== enHtml;
    }

    if (DRY_RUN) {
      const label = (koChanged || enChanged) ? '' : ' (no changes - variant A)';
      console.log(`  [${variant}] ${dir}/${file}${label}`);
    } else {
      if (koChanged) {
        fs.writeFileSync(koPath, koResult, 'utf8');
      }
      if (enChanged) {
        fs.writeFileSync(enPath, enResult, 'utf8');
      }
      const label = (koChanged || enChanged) ? ' ✓' : '';
      console.log(`  [${variant}] ${dir}/${file}${label}`);
    }

    if (koChanged || enChanged) stats.changed++;
    stats[variant]++;
  }

  console.log('\n─── Summary ───');
  console.log(`Total files: ${stats.total}`);
  console.log(`Variant A (original): ${stats.A}`);
  console.log(`Variant B: ${stats.B}`);
  console.log(`Variant C: ${stats.C}`);
  console.log(`Variant D: ${stats.D}`);
  console.log(`Changed: ${stats.changed}`);
  console.log(`Skipped: ${stats.skipped}`);
  if (DRY_RUN) console.log('\n(No files were modified - dry run mode)');
}

main();
