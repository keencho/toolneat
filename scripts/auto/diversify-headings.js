#!/usr/bin/env node
/**
 * Diversify Tool Page Headings for Toolneat
 *
 * Transforms tool page guide section headings into 4 variants (A/B/C/D)
 * to avoid Google flagging pages as auto-generated content.
 *
 * Usage:
 *   node scripts/auto/diversify-headings.js           # Execute changes
 *   node scripts/auto/diversify-headings.js --dry-run  # Preview only
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const DRY_RUN = process.argv.includes('--dry-run');

// Tool directories to process (exclude game)
const TOOL_DIRS = ['tools/dev', 'tools/life', 'tools/pdf'];

// ─── Korean Heading Variants ───────────────────────────────────────────────

const KO_VARIANTS = {
  A: {
    // Original - no changes needed
    headings: {
      '주요 기능': '주요 기능',
      '사용 방법': '사용 방법',
      '활용 사례': '활용 사례',
      '팁과 주의사항': '팁과 주의사항',
      '자주 묻는 질문': '자주 묻는 질문',
    },
    introSuffix: '이란?',
    order: null, // keep original order
  },
  B: {
    headings: {
      '주요 기능': '핵심 기능',
      '사용 방법': '이용 가이드',
      '활용 사례': '이런 상황에서 유용해요',
      '팁과 주의사항': '알아두면 좋은 점',
      '자주 묻는 질문': '궁금한 점 모음',
    },
    introReplace: (text) => text.replace(/이란\?$/, ' 소개'),
    order: [1, 0, 2, 4, 3], // reorder: 이용 가이드, 핵심 기능, 이런 상황에서..., 궁금한 점, 알아두면...
  },
  C: {
    headings: {
      '주요 기능': '무엇을 할 수 있나요?',
      '사용 방법': '사용 가이드',
      '활용 사례': '추천 활용법',
      '팁과 주의사항': '참고사항',
      '자주 묻는 질문': 'Q&A',
    },
    introReplace: (text) => text.replace(/이란\?$/, ' 알아보기'),
    order: null, // keep original order
  },
  D: {
    headings: {
      '주요 기능': '기능 소개',
      '사용 방법': '시작하기',
      '활용 사례': '활용 팁',
      '팁과 주의사항': '주의할 점',
      '자주 묻는 질문': '자주 하는 질문',
    },
    introReplace: (text) => text.replace(/이란\?$/, '에 대해서'),
    order: [1, 0, 3, 2, 4], // reorder: 시작하기, 기능 소개, 주의할 점, 활용 팁, 자주 하는 질문
  },
};

// ─── English Heading Variants ──────────────────────────────────────────────

const EN_VARIANTS = {
  A: {
    headings: {
      'Key Features': 'Key Features',
      'How to Use': 'How to Use',
      'Common Use Cases': 'Common Use Cases',
      'Tips and Notes': 'Tips and Notes',
      'Frequently Asked Questions': 'Frequently Asked Questions',
    },
    order: null,
  },
  B: {
    headings: {
      'Key Features': 'Core Features',
      'How to Use': 'User Guide',
      'Common Use Cases': 'When This Comes in Handy',
      'Tips and Notes': 'Good to Know',
      'Frequently Asked Questions': 'Common Questions',
    },
    introReplace: (text) => text.replace(/^What is (.+)\?$/, 'About $1'),
    order: [1, 0, 2, 4, 3],
  },
  C: {
    headings: {
      'Key Features': 'What Can You Do?',
      'How to Use': 'Getting Started Guide',
      'Common Use Cases': 'Recommended Uses',
      'Tips and Notes': 'Things to Keep in Mind',
      'Frequently Asked Questions': 'Q&A',
    },
    introReplace: (text) => text.replace(/^What is (.+)\?$/, 'Understanding $1'),
    order: null,
  },
  D: {
    headings: {
      'Key Features': 'Feature Overview',
      'How to Use': 'Quick Start',
      'Common Use Cases': 'Usage Tips',
      'Tips and Notes': 'Important Notes',
      'Frequently Asked Questions': 'FAQ',
    },
    introReplace: (text) => text.replace(/^What is (.+)\?$/, 'All About $1'),
    order: [1, 0, 3, 2, 4],
  },
};

// ─── Tool List (for deterministic round-robin) ─────────────────────────────

function getToolFiles(dir) {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();
}

// ─── Section Detection & Reordering ────────────────────────────────────────

const KO_STANDARD_HEADINGS = ['주요 기능', '사용 방법', '활용 사례', '팁과 주의사항', '자주 묻는 질문'];
const EN_STANDARD_HEADINGS = ['Key Features', 'How to Use', 'Common Use Cases', 'Tips and Notes', 'Frequently Asked Questions'];

/**
 * Find the guide section in HTML and parse it into sections.
 * Each section = { heading: string, headingLine: string, content: string[] }
 */
function parseSections(html, standardHeadings) {
  const lines = html.split('\n');
  const sections = [];
  let currentSection = null;
  let introSection = null;
  let guideStartIdx = -1;
  let guideEndIdx = -1;

  // Find the guide container boundaries
  // Look for the prose div that wraps the guide content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect first standard heading to know we're in the guide area
    if (guideStartIdx === -1) {
      for (const heading of standardHeadings) {
        if (line.includes(`>${heading}</h3>`)) {
          // Go backwards to find the intro section start (if any)
          // The guide section typically starts a few lines before the first standard heading
          guideStartIdx = i;
          break;
        }
      }
    }
  }

  if (guideStartIdx === -1) return null;

  // Now look for an intro h3 before the first standard heading
  // Check lines before guideStartIdx for a non-standard h3
  for (let i = guideStartIdx - 1; i >= Math.max(0, guideStartIdx - 15); i--) {
    const line = lines[i];
    if (line.includes('<h3 class="text-lg font-semibold mt-6 mb-3">') &&
        !standardHeadings.some(h => line.includes(`>${h}</h3>`))) {
      introSection = {
        startLine: i,
        lines: []
      };
      for (let j = i; j < guideStartIdx; j++) {
        introSection.lines.push(lines[j]);
      }
      break;
    }
  }

  // Parse standard sections
  let currentStart = -1;
  let currentHeading = null;
  let currentHeadingLine = null;

  for (let i = guideStartIdx; i < lines.length; i++) {
    const line = lines[i];
    let foundHeading = null;

    for (const heading of standardHeadings) {
      if (line.includes(`>${heading}</h3>`)) {
        foundHeading = heading;
        break;
      }
    }

    if (foundHeading) {
      // Save previous section
      if (currentHeading !== null) {
        sections.push({
          heading: currentHeading,
          headingLine: currentHeadingLine,
          startLine: currentStart,
          contentLines: lines.slice(currentStart + 1, i)
        });
      }
      currentHeading = foundHeading;
      currentHeadingLine = line;
      currentStart = i;
    }
  }

  // Save last section - need to find where it ends
  if (currentHeading !== null) {
    // Find end of last section (look for closing div tags that end the guide)
    let endLine = currentStart + 1;
    let divDepth = 0;

    // Look for content until we hit the guide container closing
    for (let i = currentStart + 1; i < lines.length; i++) {
      const line = lines[i];
      // Stop at the next major section (non-guide h3 or section/div boundary)
      // The FAQ section typically ends with closing </div> tags
      // We'll collect lines until we find a line that's just closing divs at the guide level
      endLine = i;

      // Check if this is a standard heading (next section)
      let isNextSection = false;
      for (const heading of standardHeadings) {
        if (line.includes(`>${heading}</h3>`)) {
          isNextSection = true;
          break;
        }
      }
      if (isNextSection) {
        endLine = i;
        break;
      }
    }

    // For the last section, find where the space-y-4 div ends (FAQ content)
    // or where the guide prose div ends
    let lastSectionEnd = currentStart + 1;
    for (let i = currentStart + 1; i < Math.min(lines.length, currentStart + 100); i++) {
      lastSectionEnd = i;
      // Look for the closing of the guide prose section
      // This is typically indicated by closing </div> followed by the ad section or page footer
      if (lines[i].trim() === '</div>' && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine === '</div>' || nextLine.startsWith('<!-- Ad') || nextLine.startsWith('<div class="mt-') || nextLine === '') {
          // Check if we're deep enough - the FAQ section has nested divs
          // Count open/close divs from currentStart
          let depth = 0;
          for (let j = currentStart; j <= i; j++) {
            const matches_open = (lines[j].match(/<div/g) || []).length;
            const matches_close = (lines[j].match(/<\/div>/g) || []).length;
            depth += matches_open - matches_close;
          }
          if (depth <= 0) {
            lastSectionEnd = i + 1;
            break;
          }
        }
      }
    }

    sections.push({
      heading: currentHeading,
      headingLine: currentHeadingLine,
      startLine: currentStart,
      contentLines: lines.slice(currentStart + 1, lastSectionEnd)
    });
  }

  return {
    introSection,
    sections,
    allLines: lines
  };
}

/**
 * Apply a heading variant to a single HTML file.
 * Only replaces heading text, does not touch content.
 * For variants B and D, also reorders sections.
 */
function applyVariant(html, variant, lang) {
  const isKO = lang === 'ko';
  const standardHeadings = isKO ? KO_STANDARD_HEADINGS : EN_STANDARD_HEADINGS;
  const variantDef = isKO ? KO_VARIANTS[variant] : EN_VARIANTS[variant];

  if (variant === 'A') return html; // Variant A = original, no changes

  let result = html;

  // 1. Replace standard headings
  // Handle both class variants:
  //   text-lg font-semibold mt-6 mb-3
  //   text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3
  for (const [original, replacement] of Object.entries(variantDef.headings)) {
    const pattern = new RegExp(
      `(<h3 class="text-lg font-semibold[^"]*mt-6 mb-3">)${escapeRegex(original)}(</h3>)`,
      'g'
    );
    result = result.replace(pattern, `$1${replacement}$2`);
  }

  // 2. Replace intro heading if applicable
  if (variantDef.introReplace) {
    if (isKO) {
      // Match Korean intro headings ending with 이란?
      result = result.replace(
        /(<h3 class="text-lg font-semibold[^"]*mt-6 mb-3">)(.+이란\?)(<\/h3>)/g,
        (match, prefix, text, suffix) => {
          return prefix + variantDef.introReplace(text) + suffix;
        }
      );
    } else {
      // Match English intro headings "What is ...?"
      result = result.replace(
        /(<h3 class="text-lg font-semibold[^"]*mt-6 mb-3">)(What is .+\?)(<\/h3>)/g,
        (match, prefix, text, suffix) => {
          return prefix + variantDef.introReplace(text) + suffix;
        }
      );
    }
  }

  // 3. Reorder sections for variants B and D
  if (variantDef.order) {
    result = reorderSections(result, variantDef, standardHeadings);
  }

  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Reorder the 5 standard guide sections according to the variant's order array.
 * The order array maps: newPosition[i] = originalPosition[order[i]]
 */
function reorderSections(html, variantDef, standardHeadings) {
  const lines = html.split('\n');

  // Find section boundaries by looking for the (now renamed) headings
  const newHeadings = Object.values(variantDef.headings);

  // Find each section's start and end line indices
  const sectionBounds = [];

  for (let i = 0; i < newHeadings.length; i++) {
    const heading = newHeadings[i];
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<h3 class="text-lg font-semibold[^"]*mt-6 mb-3">${escapedHeading}</h3>`);
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      if (re.test(lines[lineIdx])) {
        sectionBounds.push({
          idx: i,
          heading,
          startLine: lineIdx,
          endLine: -1
        });
        break;
      }
    }
  }

  if (sectionBounds.length !== 5) return html; // Can't reorder if not all 5 found

  // Sort by startLine to ensure correct order
  sectionBounds.sort((a, b) => a.startLine - b.startLine);

  // Set end lines (each section ends where the next begins)
  for (let i = 0; i < sectionBounds.length - 1; i++) {
    sectionBounds[i].endLine = sectionBounds[i + 1].startLine;
  }

  // Last section: find its end by looking for the closing of the guide content
  const lastStart = sectionBounds[4].startLine;
  let lastEnd = lastStart + 1;

  // Find where the FAQ/last section content ends
  // Look for the pattern of closing divs that end the guide section
  let divStack = 0;
  let foundEnd = false;
  for (let i = lastStart; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    divStack += opens - closes;

    // If we see a space-y-4 div (FAQ container) or similar, track its closure
    if (i > lastStart && divStack < 0) {
      lastEnd = i + 1;
      foundEnd = true;
      break;
    }
  }

  if (!foundEnd) {
    // Fallback: look for the closing div pattern after FAQ
    for (let i = lastStart + 1; i < Math.min(lines.length, lastStart + 80); i++) {
      if (lines[i].trim() === '</div>' && i + 1 < lines.length) {
        const next = lines[i + 1].trim();
        if (next === '</div>' || next === '' || next.startsWith('<!--') || next.startsWith('<div class="mt-')) {
          // Verify by checking div depth from section start
          let depth = 0;
          for (let j = lastStart; j <= i; j++) {
            depth += (lines[j].match(/<div/g) || []).length;
            depth -= (lines[j].match(/<\/div>/g) || []).length;
          }
          if (depth <= 0) {
            lastEnd = i + 1;
            break;
          }
        }
      }
    }
  }

  sectionBounds[4].endLine = lastEnd;

  // Extract section content
  const sectionContents = sectionBounds.map(s =>
    lines.slice(s.startLine, s.endLine).join('\n')
  );

  // Build reordered sections
  const reordered = variantDef.order.map(origIdx => sectionContents[origIdx]);

  // Reconstruct the file
  const beforeSections = lines.slice(0, sectionBounds[0].startLine).join('\n');
  const afterSections = lines.slice(sectionBounds[4].endLine).join('\n');

  return beforeSections + '\n' + reordered.join('\n') + '\n' + afterSections;
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const variantKeys = ['A', 'B', 'C', 'D'];
  const stats = { A: 0, B: 0, C: 0, D: 0, skipped: 0, total: 0 };

  // Collect all tool files across directories
  const allTools = [];
  for (const dir of TOOL_DIRS) {
    const files = getToolFiles(dir);
    for (const file of files) {
      allTools.push({ dir, file });
    }
  }

  // Sort for deterministic order
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

    // Check if files exist
    if (!fs.existsSync(koPath)) {
      console.log(`  SKIP (KO not found): ${dir}/${file}`);
      stats.skipped++;
      continue;
    }

    // Process Korean version
    const koHtml = fs.readFileSync(koPath, 'utf8');
    const koResult = applyVariant(koHtml, variant, 'ko');

    // Process English version
    let enResult = null;
    if (fs.existsSync(enPath)) {
      const enHtml = fs.readFileSync(enPath, 'utf8');
      enResult = applyVariant(enHtml, variant, 'en');
    }

    if (DRY_RUN) {
      const changed = koResult !== koHtml;
      console.log(`  [${variant}] ${dir}/${file}${changed ? '' : ' (no changes - variant A)'}`);
    } else {
      if (koResult !== koHtml) {
        fs.writeFileSync(koPath, koResult, 'utf8');
      }
      if (enResult && fs.existsSync(enPath)) {
        const enHtml = fs.readFileSync(enPath, 'utf8');
        if (enResult !== enHtml) {
          fs.writeFileSync(enPath, enResult, 'utf8');
        }
      }
      console.log(`  [${variant}] ${dir}/${file}`);
    }

    stats[variant]++;
  }

  console.log('\n─── Summary ───');
  console.log(`Total files: ${stats.total}`);
  console.log(`Variant A (original): ${stats.A}`);
  console.log(`Variant B: ${stats.B}`);
  console.log(`Variant C: ${stats.C}`);
  console.log(`Variant D: ${stats.D}`);
  console.log(`Skipped: ${stats.skipped}`);
  if (DRY_RUN) console.log('\n(No files were modified - dry run mode)');
}

main();
