// Add a short tool-specific "use case" / "context" paragraph
// to bring thin pages above 250 words. Patterns vary per category and tool index.

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const SINGLE = args.find(a => !a.startsWith('-')) || null;

const toolsDataSrc = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf-8');
const TOOLS_DATA = (() => {
  const m = toolsDataSrc.match(/const TOOLS_DATA = (\{[\s\S]*?\});/);
  return eval('(' + m[1] + ')');
})();

const TOOL_BY_ID = {};
for (const cat of Object.keys(TOOLS_DATA))
  for (const t of TOOLS_DATA[cat]) TOOL_BY_ID[t.id] = { ...t, category: cat };

function simpleHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

// Per-category content templates. Each template returns {heading, paragraph}.
// Templates use tool name and description as slots.
const KO_TEMPLATES = {
  dev: [
    (name, desc) => ({
      heading: '이런 상황에 유용해요',
      body: `프로젝트 초기 셋업이나 디버깅 중에 ${name}이(가) 자주 필요합니다. 코드를 직접 짜는 대신 빠르게 결과만 얻고 싶을 때, 또는 다른 사람이 만든 데이터를 분석해야 할 때 클릭 한 번으로 처리됩니다.`
    }),
    (name, desc) => ({
      heading: '실무 활용',
      body: `${desc}이(가) 필요한 순간은 생각보다 자주 옵니다. 협업 중 API 응답을 검증하거나, 외부 시스템과 데이터를 주고받을 때, 또는 코드 리뷰 중 빠르게 확인해야 할 때 시간을 크게 줄여줍니다.`
    }),
    (name, desc) => ({
      heading: '왜 브라우저 도구로 쓰나요',
      body: `로컬에 별도 라이브러리를 설치하거나 CLI를 띄우지 않아도 ${name} 작업을 즉시 수행할 수 있습니다. 모든 처리가 브라우저에서 끝나므로 보안에 민감한 데이터도 외부로 나가지 않습니다.`
    }),
    (name, desc) => ({
      heading: '함께 쓰면 좋은 흐름',
      body: `보통 ${name}은(는) 단독으로 쓰기보다 다른 도구와 묶어서 씁니다. 결과를 다른 변환 도구에 넘기거나, 검증 도구로 확인 후 실제 코드에 반영하는 식의 작은 워크플로우를 만들면 작업 속도가 빨라집니다.`
    }),
    (name, desc) => ({
      heading: '주의해야 할 점',
      body: `${name}을(를) 사용할 때 가장 흔히 놓치는 부분은 인코딩과 공백 처리입니다. 같은 입력처럼 보여도 줄바꿈이나 BOM 같은 보이지 않는 문자가 섞이면 결과가 달라질 수 있어 주의가 필요합니다.`
    }),
    (name, desc) => ({
      heading: '간단한 팁',
      body: `결과를 그대로 코드에 붙여 넣기 전에 한 번 더 확인하는 습관을 들이면 실수를 줄일 수 있습니다. 특히 ${name} 같은 변환 도구는 양방향 변환이 가능한 경우가 많아, 원본으로 되돌려 보면서 검증하는 게 안전합니다.`
    })
  ],
  life: [
    (name, desc) => ({
      heading: '이럴 때 써보세요',
      body: `${name}은(는) 일상에서 자주 쓰는 단순 계산이나 확인 작업을 빠르게 처리할 때 유용합니다. 손으로 계산하기는 번거롭고, 별도 앱을 깔기엔 부담스러운 그 중간을 채워줍니다.`
    }),
    (name, desc) => ({
      heading: '활용 사례',
      body: `${desc}이(가) 필요한 순간은 의외로 많습니다. 학교 과제나 업무 중 잠깐 필요한 경우, 또는 친구나 가족과 이야기하다 갑자기 확인이 필요한 상황 등에서 부담 없이 꺼내 쓸 수 있습니다.`
    }),
    (name, desc) => ({
      heading: '왜 웹 도구가 편한가',
      body: `${name}을(를) 위해 따로 앱을 깔거나 회원가입하지 않아도 됩니다. 브라우저만 있으면 PC, 모바일, 태블릿 어디서든 바로 쓸 수 있고, 사용 후 흔적이 남지 않아 개인정보 측면에서도 안심됩니다.`
    }),
    (name, desc) => ({
      heading: '알아두면 좋은 점',
      body: `${name}에서 계산되는 값은 어디까지나 참고용입니다. 의료, 법률, 금융처럼 중요한 결정이 걸려 있다면 반드시 전문가의 의견을 받는 것이 좋습니다. 빠른 확인용으로는 충분히 유용합니다.`
    }),
    (name, desc) => ({
      heading: '간단한 사용 팁',
      body: `처음 ${name}을(를) 쓸 때는 익숙한 값으로 한 번 결과를 확인해 보는 것이 좋습니다. 자신이 이미 아는 답이 나오는지 확인하면 도구의 동작 방식이 빠르게 손에 익습니다.`
    }),
    (name, desc) => ({
      heading: '어떤 사람에게 도움 되나',
      body: `${name}은(는) 특정 분야 전문가가 아니어도 누구나 부담 없이 쓸 수 있도록 만들어져 있습니다. 학생, 직장인, 자영업자, 일반 사용자 누구든 필요한 순간에 바로 답을 얻을 수 있습니다.`
    })
  ],
  pdf: [
    (name, desc) => ({
      heading: '문서 작업에서의 활용',
      body: `${name}은(는) 회의 자료 정리, 계약서 통합, 보고서 제출 같은 일상적인 PDF 작업에서 자주 쓰입니다. 별도 유료 프로그램을 결제하지 않아도 비슷한 결과를 얻을 수 있습니다.`
    }),
    (name, desc) => ({
      heading: '실무 활용 예시',
      body: `여러 사람에게서 받은 PDF 파일을 정리하거나 외부로 보내기 전 마지막 점검 단계에서 ${name}이(가) 자주 사용됩니다. 빠르게 처리하고 결과만 다운로드하면 끝입니다.`
    }),
    (name, desc) => ({
      heading: '개인정보 처리',
      body: `${name}은(는) 모든 처리를 브라우저 내부에서 수행하므로, 원본 PDF가 외부 서버로 전송되지 않습니다. 민감한 문서를 다룰 때도 비교적 안심하고 사용할 수 있습니다.`
    }),
    (name, desc) => ({
      heading: '주의할 점',
      body: `${name}을(를) 적용한 결과 파일은 원본과 별도로 보관하는 것이 안전합니다. 처리 과정에서 의도치 않게 페이지 순서나 품질이 바뀔 수 있어, 중요한 문서일수록 결과를 한 번 확인하는 습관이 필요합니다.`
    })
  ],
  game: [
    (name, desc) => ({
      heading: '잠깐의 휴식에',
      body: `${name}은(는) 업무나 공부 사이의 짧은 쉬는 시간에 부담 없이 즐기기 좋은 게임입니다. 회원가입이나 설치 없이 바로 시작할 수 있어 머리를 환기시키기에 충분합니다.`
    }),
    (name, desc) => ({
      heading: '집중력에 도움',
      body: `간단해 보이지만 ${name}은(는) 집중력과 패턴 인식 능력을 자연스럽게 사용하게 만듭니다. 점수를 올리려고 노력하다 보면 순간 집중하는 감각이 살아납니다.`
    }),
    (name, desc) => ({
      heading: '어떻게 즐기면 좋을까',
      body: `${name}은(는) 짧게 한두 판만 가볍게 즐기는 것이 좋습니다. 점수에 너무 집착하지 않고 휴식의 일부로 받아들이면 게임이 주는 즐거움이 더 커집니다.`
    })
  ]
};

const EN_TEMPLATES = {
  dev: [
    (name, desc) => ({
      heading: 'When You\'ll Reach For This',
      body: `During project setup or debugging, ${name} comes up surprisingly often. Whenever you need a quick result without writing more code, or need to inspect data someone else produced, this saves a few minutes each time.`
    }),
    (name, desc) => ({
      heading: 'Real-World Use',
      body: `${desc} is needed more often than expected. While collaborating, verifying API responses, exchanging data between systems, or during code reviews when you need a quick check, this kind of tool removes friction.`
    }),
    (name, desc) => ({
      heading: 'Why a Browser Tool',
      body: `You can perform ${name} immediately without installing a library or starting a CLI. Everything runs locally in the browser, so sensitive data never leaves your device.`
    }),
    (name, desc) => ({
      heading: 'A Useful Workflow',
      body: `${name} is rarely used in isolation. Combine it with other converters or validators, then feed the result into your actual code — small chained workflows like this speed up day-to-day work.`
    }),
    (name, desc) => ({
      heading: 'Common Pitfall',
      body: `When using ${name}, the easiest thing to overlook is encoding and whitespace. Inputs that look identical can produce different outputs if a newline or invisible BOM character sneaks in.`
    }),
    (name, desc) => ({
      heading: 'Quick Tip',
      body: `Before pasting the result directly into your code, take one extra look. Most conversion tools support round-tripping, so a quick reverse check is the easiest way to catch mistakes.`
    })
  ],
  life: [
    (name, desc) => ({
      heading: 'When To Use This',
      body: `${name} fills the gap between tedious manual calculation and installing a full app. For everyday checks, this kind of quick browser tool is often the most comfortable choice.`
    }),
    (name, desc) => ({
      heading: 'Common Scenarios',
      body: `${desc} comes up in everyday situations: school assignments, work tasks, or quick checks during conversations with friends or family. Keeping a tool like this bookmarked saves time.`
    }),
    (name, desc) => ({
      heading: 'Why a Web Tool Feels Easier',
      body: `No installation, no sign-up. Just open the page and ${name} is ready. It works on phones, tablets, and laptops the same way, and nothing is stored after you close the tab.`
    }),
    (name, desc) => ({
      heading: 'Good To Know',
      body: `Treat the result of ${name} as a starting point, not a final answer. For decisions involving medical, legal, or financial matters, always confirm with a professional.`
    }),
    (name, desc) => ({
      heading: 'Quick Tip',
      body: `When using ${name} for the first time, try a value you already know the answer to. Seeing the expected result appear is the fastest way to learn how the tool behaves.`
    }),
    (name, desc) => ({
      heading: 'Who Finds It Helpful',
      body: `${name} is designed so anyone can use it without specialist knowledge. Students, office workers, freelancers, and casual users all benefit from being able to get an answer in seconds.`
    })
  ],
  pdf: [
    (name, desc) => ({
      heading: 'In Document Work',
      body: `${name} comes up regularly when organizing meeting notes, combining contracts, or preparing reports for submission. You don\'t need to buy a paid PDF suite to handle the common cases.`
    }),
    (name, desc) => ({
      heading: 'A Practical Example',
      body: `When tidying PDFs collected from multiple people or doing a last-minute check before sending a document externally, ${name} handles the job quickly. Process, download, done.`
    }),
    (name, desc) => ({
      heading: 'Privacy Note',
      body: `${name} processes everything inside the browser, so the original PDF never reaches a remote server. This makes it a safer choice when handling sensitive documents.`
    }),
    (name, desc) => ({
      heading: 'Worth Remembering',
      body: `Always keep the original file alongside the output of ${name}. Page order, quality, or layout can shift unexpectedly during processing, so a quick review afterward is worth the few seconds.`
    })
  ],
  game: [
    (name, desc) => ({
      heading: 'For A Quick Break',
      body: `${name} is the kind of game you can pick up between tasks without any setup. No accounts, no installs — just a quick session to reset your focus.`
    }),
    (name, desc) => ({
      heading: 'A Light Workout for Focus',
      body: `It looks simple, but ${name} quietly exercises attention and pattern recognition. Try to beat your previous score and you\'ll notice your focus sharpen.`
    }),
    (name, desc) => ({
      heading: 'How to Enjoy It',
      body: `Keep ${name} as a short break, not a goal. One or two rounds is plenty — don\'t chase a high score so hard that the game stops feeling like a rest.`
    })
  ]
};

function processFile(filePath) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.html');
  const tool = TOOL_BY_ID[fileName];
  if (!tool) return { skipped: `no tool data for ${fileName}` };

  const $ = cheerio.load(html, { decodeEntities: false });

  // Word count check - only add to thin pages
  const mainWc = $('main').text().replace(/\s+/g, ' ').trim().split(/\s+/).length;
  if (mainWc >= 250) return { skipped: 'already 250+ words' };

  // Find first content section (with h2 + paragraph)
  let $section = null;
  $('main section').each((_, sec) => {
    if ($section) return;
    const cls = $(sec).attr('class') || '';
    if (!/\b(mt|mb|my)-\d+/.test(cls)) return;
    if ($(sec).find('h2').length > 0 && $(sec).find('p').length > 0) {
      $section = $(sec);
    }
  });
  if (!$section) return { skipped: 'no content section' };

  // Pick template
  const templates = (isKo ? KO_TEMPLATES : EN_TEMPLATES)[tool.category];
  if (!templates) return { skipped: 'no templates for ' + tool.category };

  const h = simpleHash(tool.id);
  const tpl = templates[h % templates.length];
  const name = isKo ? tool.name.ko : tool.name.en;
  const desc = isKo ? tool.description.ko : tool.description.en;
  const content = tpl(name, desc);

  // Find the first "관련" / "Related" h3 to insert BEFORE it
  let $relatedH3 = null;
  $section.find('h3').each((_, h) => {
    if ($relatedH3) return;
    const t = $(h).text().trim();
    if (/^관련|함께|이런|같이|비슷한|Related|You Might|Similar|Tools That|Worth Exploring/i.test(t)) {
      $relatedH3 = $(h);
    }
  });

  // h3 class style - match existing h3 in section
  const sampleH3Class = $section.find('h3').first().attr('class') || 'text-lg font-semibold mt-6 mb-3';

  const newBlock = `<h3 class="${sampleH3Class}">${content.heading}</h3>\n          <p>${content.body}</p>\n          `;

  if ($relatedH3) {
    $relatedH3.before(newBlock);
  } else {
    // Append at end of section's content wrapper
    const $wrap = $section.find('.prose').first().length ? $section.find('.prose').first() : $section;
    $wrap.append(newBlock);
  }

  const newHtml = $.html();
  if (newHtml === html) return { skipped: 'no diff' };
  if (!DRY) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { ok: true, added: content.heading, wordsBefore: mainWc };
}

function list() {
  const out = [];
  for (const lang of ['', 'en']) for (const cat of ['dev', 'life', 'pdf', 'game']) {
    const d = path.join(ROOT, lang, 'tools', cat);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(d, f));
  }
  return out;
}

const files = SINGLE ? [path.resolve(SINGLE)] : list();
const stats = { ok: 0, skipped: {}, byPattern: {} };
const samples = [];
for (const f of files) {
  const r = processFile(f);
  if (r.ok) {
    stats.ok++;
    stats.byPattern[r.added] = (stats.byPattern[r.added] || 0) + 1;
    if (SINGLE || samples.length < 5) samples.push({ f: path.relative(ROOT, f), ...r });
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
  }
}
console.log('Samples:');
samples.forEach(s => console.log(JSON.stringify(s)));
console.log('Stats:', JSON.stringify(stats, null, 2));
console.log('Total:', files.length);
if (DRY) console.log('(DRY)');
