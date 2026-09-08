const fs = require('fs');
const path = require('path');

const extraContent = {
  'game/snake': {
    ko: { title: '고득점을 위한 실전 공략', content: '<p>스네이크 게임에서 높은 점수를 얻으려면 체계적인 전략이 필요합니다. 초반에는 격자의 가장자리를 따라 이동하며 안전한 경로를 확보하세요. 뱀이 길어질수록 중앙에서 움직이면 사방이 막히기 쉽습니다. 먹이가 나타나면 바로 돌진하지 말고, 먹이를 먹은 후 빠져나올 경로를 먼저 확인하세요.</p><p>중반 이후에는 나선형 패턴이 효과적입니다. 자신의 꼬리를 따라가듯 큰 원을 그리며 이동하면 빈 공간을 최대한 확보할 수 있습니다. 좁은 틈새로 들어가는 것은 피하세요. 뱀이 길어진 상태에서 막다른 곳에 들어가면 탈출이 불가능합니다. 속도 설정은 자신의 반응 속도에 맞춰 조절하되, 실력이 늘면 점차 높여가는 것이 좋습니다. 터치 기기에서는 스와이프보다 화면 하단의 버튼 조작이 더 정확합니다.</p>' },
    en: { title: 'Pro Tips for High Scores', content: '<p>Achieving high scores in Snake requires systematic strategy. Early on, move along grid edges to secure safe paths. As the snake grows, moving through the center easily leads to being trapped. When food appears, check your escape route before rushing to eat it.</p><p>In mid-to-late game, a spiral pattern works best. Move in large circles following your own tail to maximize open space. Avoid narrow gaps — entering a dead-end with a long snake means game over. Adjust speed to match your reaction time, gradually increasing as you improve. On touch devices, the on-screen buttons are more precise than swipe controls.</p>' }
  },
  'game/memory-game': {
    ko: { title: '기억력 향상을 위한 플레이 전략', content: '<p>메모리 게임에서 좋은 성적을 내려면 체계적인 기억 전략이 필요합니다. 처음 몇 번의 뒤집기는 카드 위치를 파악하는 데 집중하세요. 무작위로 뒤집기보다 한 줄씩 순서대로 확인하면 위치를 기억하기 쉽습니다. 이미 본 카드의 위치를 머릿속에서 격자 좌표로 기억하면 효과적입니다.</p><p>짝을 못 찾았을 때도 정보를 얻는 과정입니다. 두 장을 뒤집어 일치하지 않더라도 각 카드의 위치를 기억해 두면, 나중에 같은 그림이 나왔을 때 바로 짝을 맞출 수 있습니다. 연속으로 짝을 맞추면 자신감이 올라가지만, 서두르면 실수하기 쉽습니다. 차분하게 한 쌍씩 확실하게 맞추는 것이 전체 시도 횟수를 줄이는 핵심입니다. 정기적으로 메모리 게임을 하면 단기 기억력과 집중력 향상에 도움이 됩니다.</p>' },
    en: { title: 'Strategies for Better Memory Performance', content: '<p>Succeeding at the memory game requires systematic memorization strategy. Use your first few flips to survey card positions. Instead of random flipping, check row by row to make positions easier to remember. Mentally noting cards by grid coordinates is effective.</p><p>Even unsuccessful matches provide valuable information. When two cards do not match, remember both positions — when the same image appears later, you can immediately find its pair. Consecutive matches build confidence, but rushing leads to mistakes. Calmly matching one pair at a time is key to minimizing total attempts. Playing memory games regularly helps improve short-term memory and concentration.</p>' }
  },
  'pdf/compress-pdf': {
    ko: { title: '최적의 압축 설정 가이드', content: '<p>PDF 압축에서 가장 중요한 것은 용도에 맞는 품질 설정입니다. 이메일 첨부용이라면 품질 50~60%로 설정하면 대부분의 메일 서비스 첨부 제한(10~25MB)을 맞출 수 있습니다. 웹 업로드용이라면 60~70%가 적합하며, 인쇄용이라면 80% 이상을 유지하세요.</p><p>압축 효과는 PDF 내부의 이미지 비율에 따라 크게 달라집니다. 사진이 많은 스캔 문서는 50% 이상 크기를 줄일 수 있지만, 텍스트 위주의 문서는 압축 효과가 미미합니다. 여러 번 압축해도 원본이 변경되지 않으므로 다양한 품질 설정을 시도해 보세요. 중요한 문서는 항상 원본을 별도로 보관하고, 압축된 버전은 공유용으로 사용하는 것이 좋습니다. 공공기관 서류 제출 시 용량 제한이 있다면 품질을 단계적으로 낮추며 최적 설정을 찾으세요.</p>' },
    en: { title: 'Optimal Compression Settings Guide', content: '<p>The key to PDF compression is choosing the right quality for your purpose. For email attachments, 50-60% quality usually meets service attachment limits (10-25MB). For web uploads, 60-70% works well. For printing, maintain 80% or higher.</p><p>Compression effectiveness depends heavily on image content within the PDF. Scanned photo-heavy documents can shrink by 50% or more, while text-heavy documents see minimal reduction. Since the original file is never modified, experiment with different quality settings freely. Always keep originals separate for important documents and use compressed versions for sharing. When facing size limits for government submissions, gradually lower quality to find the optimal setting.</p>' }
  },
  'life/image-rotate': {
    ko: { title: '이미지 회전 활용 가이드', content: '<p>이미지 회전은 스캔 문서, 스마트폰 사진, 디지털 카메라 이미지에서 자주 필요합니다. 스캔한 문서가 기울어져 있으면 90° 회전으로 바로잡을 수 있고, 스마트폰 사진이 가로/세로 방향이 잘못 저장된 경우에도 간단히 수정됩니다.</p><p>여러 장의 이미지를 일괄 처리해야 할 때는 한 장씩 회전 후 다운로드하는 것이 효율적입니다. 이미지 형식은 JPEG, PNG, WebP, GIF 모두 지원하며, 회전 후에도 원본 해상도가 유지됩니다. 뒤집기(좌우/상하) 기능은 셀피 사진의 거울 효과를 제거하거나, 인쇄 시 좌우 반전이 필요한 경우에 유용합니다. 모든 처리는 브라우저에서 이루어지므로 개인 사진도 안심하고 사용할 수 있습니다.</p>' },
    en: { title: 'Image Rotation Usage Guide', content: '<p>Image rotation is frequently needed for scanned documents, smartphone photos, and digital camera images. Tilted scans can be corrected with a 90° rotation, and smartphone photos saved in the wrong orientation are easily fixed.</p><p>For batch processing multiple images, rotate and download one at a time. All major formats (JPEG, PNG, WebP, GIF) are supported, and original resolution is maintained after rotation. The flip function (horizontal/vertical) is useful for removing mirror effects from selfies or when print layout requires a reversed image. All processing occurs in your browser, so personal photos remain private.</p>' }
  },
  'game/minesweeper': {
    ko: { title: '지뢰찾기 논리적 풀이법', content: '<p>지뢰찾기는 순수한 논리 게임입니다. 숫자 1이 표시된 칸 주변에 닫힌 칸이 하나만 남았다면 그곳이 반드시 지뢰입니다. 반대로 숫자 주변에 이미 해당 숫자만큼 깃발이 꽂혀 있다면, 나머지 닫힌 칸은 모두 안전합니다. 이 두 가지 기본 패턴만으로도 많은 칸을 열 수 있습니다.</p><p>고급 기법으로는 두 숫자 사이의 차이를 이용한 패턴 분석이 있습니다. 예를 들어 연속된 1-2 패턴에서 2 쪽의 닫힌 칸에 지뢰가 있다고 추론할 수 있습니다. 게임 초반에는 모서리나 가장자리를 먼저 클릭하면 넓은 영역이 한 번에 열릴 확률이 높습니다. 확실하지 않은 칸은 절대 클릭하지 말고, 다른 영역에서 정보를 더 모은 후 돌아오세요.</p>' },
    en: { title: 'Logical Solving Techniques', content: '<p>Minesweeper is a pure logic game. If a cell showing 1 has only one unrevealed neighbor remaining, that neighbor must be a mine. Conversely, if a number already has that many flags around it, all remaining unrevealed neighbors are safe. These two basic patterns alone can reveal many cells.</p><p>Advanced techniques involve analyzing differences between adjacent numbers. For example, in a 1-2 pattern, you can deduce mine locations from the difference. Early game, clicking corners or edges often reveals large areas at once. Never click uncertain cells — gather more information from other areas first, then return with a clearer picture.</p>' }
  },
  'game/tetris': {
    ko: { title: '테트리스 상급자 전략', content: '<p>테트리스의 핵심 전략은 한쪽 끝에 I-블록(긴 막대)을 위한 우물을 유지하는 것입니다. 오른쪽 또는 왼쪽 1열을 비워두고 나머지를 평탄하게 쌓으면, I-블록이 나왔을 때 한 번에 4줄을 지울 수 있어 최고 점수(테트리스)를 얻습니다.</p><p>블록을 쌓을 때는 표면을 최대한 평탄하게 유지하세요. 높낮이 차이가 크면 빈 공간(구멍)이 생기기 쉽고, 구멍이 쌓이면 회복이 어렵습니다. T-스핀 기법을 익히면 T-블록을 회전하여 빈틈에 정확히 끼워 넣을 수 있어 점수 효율이 높아집니다. 다음 블록 미리보기를 항상 확인하고, 현재 블록의 배치를 다음 블록에 유리하게 결정하세요. 속도가 빨라지면 하드드롭(스페이스바)을 적극 활용하여 빠르게 블록을 배치합니다.</p>' },
    en: { title: 'Advanced Tetris Strategy', content: '<p>The core Tetris strategy is maintaining a well (empty column) on one side for the I-piece (long bar). Keep one edge column empty while stacking the rest flat. When the I-piece arrives, clearing 4 lines at once scores a Tetris — the maximum points.</p><p>Keep the surface as flat as possible when stacking. Large height differences create gaps (holes) that are hard to recover from. Learning T-spins lets you rotate T-pieces into tight spaces for higher scoring efficiency. Always check the next piece preview and position the current piece to benefit the upcoming one. As speed increases, use hard drop (spacebar) aggressively for faster placement.</p>' }
  },
  'pdf/delete-pdf': {
    ko: { title: 'PDF 페이지 삭제 활용 시나리오', content: '<p>PDF 페이지 삭제는 다양한 상황에서 유용합니다. 스캔 문서에서 빈 페이지가 포함되었을 때, 보고서에서 불필요한 표지나 부록을 제거할 때, 또는 공유 전에 민감한 정보가 포함된 페이지를 제거할 때 사용합니다.</p><p>삭제 작업 전에 원본 파일을 백업해 두는 것이 좋습니다. 이 도구는 브라우저에서 처리되므로 원본 파일 자체는 변경되지 않지만, 다운로드한 파일이 의도한 대로 되었는지 반드시 확인하세요. 연속된 여러 페이지를 삭제할 때는 페이지 번호가 변경되는 점에 유의하세요. 예를 들어 3페이지를 삭제하면 기존 4페이지가 3페이지가 됩니다. 대량의 페이지를 관리해야 한다면 페이지 재정렬 도구와 함께 사용하면 더 효율적입니다.</p>' },
    en: { title: 'PDF Page Deletion Use Cases', content: '<p>PDF page deletion is useful in many scenarios: removing blank pages from scanned documents, stripping unnecessary covers or appendices from reports, or removing pages with sensitive information before sharing.</p><p>Always backup the original before deleting. While this browser-based tool does not modify your original file, always verify the downloaded result matches your intentions. When deleting multiple consecutive pages, note that page numbers shift — deleting page 3 makes the former page 4 become page 3. For managing large numbers of pages, combine with the page reorder tool for greater efficiency.</p>' }
  },
  'life/image-watermark': {
    ko: { title: '효과적인 워터마크 적용 가이드', content: '<p>워터마크는 이미지의 저작권을 보호하고 무단 사용을 방지하는 효과적인 방법입니다. 텍스트 워터마크는 브랜드 이름이나 저작권 표시에 적합하고, 이미지 워터마크는 로고 삽입에 유용합니다. 투명도는 30~50%가 가장 자연스러우며, 너무 진하면 원본 이미지를 가리고 너무 연하면 쉽게 제거됩니다.</p><p>워터마크 위치는 중앙이 가장 효과적이지만, 구도를 해치지 않으려면 하단 모서리에 배치할 수 있습니다. 타일형(반복) 워터마크는 이미지 전체에 워터마크가 분포하여 크롭으로 제거하기 어렵습니다. 포트폴리오 공개, 온라인 갤러리, 상품 이미지 보호 등에 활용하세요. 인쇄용 고해상도 파일은 워터마크 없이 별도 관리하는 것이 좋습니다.</p>' },
    en: { title: 'Effective Watermarking Guide', content: '<p>Watermarks effectively protect image copyright and prevent unauthorized use. Text watermarks suit brand names or copyright notices, while image watermarks work well for logo placement. Opacity of 30-50% looks most natural — too strong obscures the image, too light is easily removed.</p><p>Center placement is most effective, though corner placement preserves composition. Tiled (repeating) watermarks cover the entire image, making removal by cropping difficult. Use for portfolio sharing, online galleries, and product image protection. Keep high-resolution print files without watermarks as separate copies.</p>' }
  },
  'life/image-resizer': {
    ko: { title: '이미지 리사이즈 실전 가이드', content: '<p>이미지 리사이즈는 웹사이트 최적화, SNS 업로드, 이메일 첨부 시 가장 자주 필요한 작업입니다. 웹 배너는 보통 1200×628 픽셀, 인스타그램 정사각형은 1080×1080, 유튜브 썸네일은 1280×720이 표준입니다. 비율 유지 옵션을 켜면 이미지가 찌그러지지 않습니다.</p><p>큰 이미지를 축소하면 파일 크기가 크게 줄어듭니다. 4000×3000 사진을 1920×1440으로 줄이면 용량이 50~70% 감소합니다. 반대로 작은 이미지를 확대하면 화질이 떨어지므로, 원본보다 크게 리사이즈하는 것은 권장하지 않습니다. 여러 장의 이미지를 동일한 크기로 맞추어야 할 때 이 도구가 특히 유용합니다.</p>' },
    en: { title: 'Image Resizing Practical Guide', content: '<p>Image resizing is the most common task for website optimization, social media uploads, and email attachments. Standard sizes include web banners at 1200×628px, Instagram squares at 1080×1080, and YouTube thumbnails at 1280×720. Enable aspect ratio lock to prevent distortion.</p><p>Downscaling large images significantly reduces file size. A 4000×3000 photo resized to 1920×1440 can shrink 50-70% in size. Conversely, upscaling small images degrades quality, so enlarging beyond the original is not recommended. This tool is especially useful when multiple images need to match the same dimensions.</p>' }
  },
  'life/fancy-text': {
    ko: { title: '특수문자 텍스트 활용 팁', content: '<p>특수문자 텍스트는 SNS 프로필 이름, 인스타그램 바이오, 트위터 닉네임, Discord 이름 등에서 눈에 띄는 효과를 줍니다. 유니코드 기반이므로 대부분의 플랫폼에서 별도 설치 없이 표시됩니다. 다만 일부 구형 기기나 특정 앱에서는 글자가 깨질 수 있으니 미리 확인하세요.</p><p>비즈니스 문서나 이메일에서는 사용을 자제하는 것이 좋습니다. 스크린 리더가 특수 유니코드 문자를 올바르게 읽지 못할 수 있어 접근성 문제가 발생합니다. 또한 검색 엔진은 특수문자 텍스트를 일반 텍스트와 다르게 인식하므로 SEO에도 불리합니다. 개인 표현이나 캐주얼한 소셜 미디어 용도로 활용하세요.</p>' },
    en: { title: 'Fancy Text Usage Tips', content: '<p>Fancy text makes profiles stand out on social media bios, Instagram, Twitter, and Discord. Being Unicode-based, it displays on most platforms without any installation. However, some older devices or certain apps may not render characters correctly, so preview before posting.</p><p>Avoid fancy text in business documents or emails. Screen readers may not correctly interpret special Unicode characters, creating accessibility issues. Search engines also treat fancy text differently from regular text, hurting SEO. Use it for personal expression and casual social media purposes.</p>' }
  },
  'life/character-counter': {
    ko: { title: '글자수 세기 실전 활용법', content: '<p>글자수 세기는 SNS 게시물, 자기소개서, 블로그 글, 광고 카피 작성에서 필수적입니다. 트위터는 280자, 인스타그램 캡션은 2,200자, 네이버 블로그 제목은 100자 제한이 있습니다. 한국어는 1글자가 2~3바이트를 차지하므로 바이트 수와 글자 수가 다를 수 있습니다.</p><p>자기소개서나 논문 작성 시에는 공백 포함/제외 글자 수를 모두 확인하세요. 대부분의 공모전과 대학교는 공백 포함 기준을 사용하지만, 일부는 공백 제외 기준을 적용합니다. 단어 수와 문장 수 통계는 글의 전체적인 구조를 파악하는 데 도움이 됩니다. 읽기 시간 추정 기능으로 블로그 글이나 발표 자료의 적절한 분량을 확인할 수 있습니다.</p>' },
    en: { title: 'Practical Character Counting Tips', content: '<p>Character counting is essential for social media posts, resumes, blog articles, and ad copy. Twitter limits to 280 characters, Instagram captions to 2,200, and various platforms have their own restrictions. Non-ASCII characters like Korean occupy 2-3 bytes each, so byte count differs from character count.</p><p>For resumes and academic papers, check both with-spaces and without-spaces counts. Most competitions and universities use the with-spaces standard, though some use without-spaces. Word and sentence statistics help assess overall writing structure. Reading time estimation helps determine appropriate length for blog posts and presentations.</p>' }
  },
  'pdf/reorder-pdf': {
    ko: { title: 'PDF 페이지 재정렬 활용법', content: '<p>PDF 페이지 재정렬은 프레젠테이션 자료의 순서를 바꾸거나, 여러 문서를 합친 후 논리적 순서로 배치할 때 유용합니다. 드래그 앤 드롭으로 직관적으로 순서를 변경할 수 있어 별도의 학습이 필요 없습니다.</p><p>계약서나 보고서에서 첨부 자료의 순서를 조정하거나, 스캔 문서에서 잘못된 순서로 들어간 페이지를 바로잡을 때 특히 편리합니다. 페이지가 많은 문서에서는 썸네일 미리보기를 활용하여 각 페이지의 내용을 확인하면서 정렬하세요. 재정렬 후에는 다운로드하기 전에 순서가 올바른지 한 번 더 검토하는 것이 좋습니다. 이 도구는 페이지 삭제 도구와 함께 사용하면 불필요한 페이지를 제거하고 남은 페이지를 원하는 순서로 정리할 수 있습니다.</p>' },
    en: { title: 'PDF Page Reordering Tips', content: '<p>PDF page reordering is useful for changing presentation slide order or arranging logically after merging multiple documents. Intuitive drag-and-drop requires no learning curve.</p><p>Particularly handy for adjusting attachment order in contracts and reports, or correcting misordered scanned pages. For large documents, use thumbnail previews to verify page content while rearranging. Always review the order before downloading. Combine with the page delete tool to remove unnecessary pages and arrange the rest in your desired sequence.</p>' }
  },
  'pdf/image-to-pdf': {
    ko: { title: '이미지를 PDF로 변환하는 활용 사례', content: '<p>이미지-PDF 변환은 다양한 실무 상황에서 활용됩니다. 스캔한 영수증이나 서류를 하나의 PDF로 합치면 관리가 편해집니다. 포트폴리오 이미지들을 PDF로 묶으면 하나의 파일로 전달할 수 있어 면접이나 프레젠테이션에 유용합니다.</p><p>여러 이미지를 업로드하면 각각 별도 페이지로 배치됩니다. 이미지 순서는 업로드 순서를 따르므로, 원하는 순서대로 파일을 선택하세요. 고해상도 이미지는 PDF에서도 선명하게 유지되며, 인쇄 시에도 품질이 보장됩니다. 변환 후 파일 크기가 크다면 PDF 압축 도구를 사용하여 최적화할 수 있습니다. 사진 앨범, 디자인 시안, 교육 자료 등을 PDF로 정리하면 누구에게나 동일하게 보이는 문서를 만들 수 있습니다.</p>' },
    en: { title: 'Image to PDF Conversion Use Cases', content: '<p>Image-to-PDF conversion serves many practical purposes. Combining scanned receipts or documents into one PDF simplifies management. Bundling portfolio images into a PDF creates a single-file package for interviews or presentations.</p><p>Multiple uploaded images are placed on separate pages, following upload order. High-resolution images remain sharp in PDF and maintain print quality. If the resulting file is too large, use the PDF compression tool to optimize. Photo albums, design mockups, and educational materials organized as PDFs ensure consistent viewing across all devices and platforms.</p>' }
  },
  'game/2048': {
    ko: { title: '2048 고득점 공략법', content: '<p>2048에서 가장 중요한 전략은 가장 큰 숫자를 한쪽 모서리에 고정시키는 것입니다. 왼쪽 하단 또는 오른쪽 하단을 선택하고, 큰 숫자가 그 위치에서 벗어나지 않도록 주의하세요. 한 방향으로만 밀지 말고 두 방향(예: 아래와 왼쪽)을 번갈아 사용하면 큰 숫자가 안정적으로 유지됩니다.</p><p>작은 숫자들은 큰 숫자 근처에서 합쳐지도록 배치하세요. 이상적인 패턴은 한 줄에 숫자가 내림차순으로 정렬되는 것입니다. 위쪽 방향으로 밀기는 큰 숫자가 모서리에서 빠질 수 있으므로 가능하면 피하세요. 4×4 격자가 거의 꽉 찼을 때가 가장 위험한 순간이므로, 항상 빈 칸을 2~3개 유지하도록 합쳐지는 기회를 놓치지 마세요.</p>' },
    en: { title: '2048 High Score Strategy', content: '<p>The most important 2048 strategy is keeping the highest number fixed in one corner. Choose a corner (e.g., bottom-left) and prevent the largest tile from moving away. Alternate between two directions (e.g., down and left) to keep it stable.</p><p>Arrange smaller numbers near the largest so they can merge efficiently. The ideal pattern is a descending sequence along one row. Avoid pushing upward as it can dislodge your corner tile. The most dangerous moment is when the grid is nearly full, so always maintain 2-3 empty cells by not missing merge opportunities.</p>' }
  },
  'life/image-crop': {
    ko: { title: '이미지 자르기 실전 활용', content: '<p>이미지 자르기는 사진 구도 개선, SNS 프로필 사진 만들기, 제품 이미지 배경 정리에 핵심적인 도구입니다. 인스타그램 정사각형(1:1), 유튜브 썸네일(16:9), 프로필 사진(1:1 원형) 등 플랫폼별 비율에 맞춰 자를 수 있습니다.</p><p>사진의 구도를 개선하려면 삼분법(Rule of Thirds)을 활용하세요. 주요 피사체를 이미지의 1/3 지점에 배치하면 더 안정적이고 매력적인 구도가 됩니다. 불필요한 배경을 잘라내면 주제가 더 부각되고 파일 크기도 줄어듭니다. 원본 해상도가 유지되므로 인쇄 품질에도 영향이 없습니다. 자르기 전에 최종 용도의 해상도 요구사항을 확인하세요.</p>' },
    en: { title: 'Image Cropping in Practice', content: '<p>Image cropping is essential for improving photo composition, creating social media profile pictures, and cleaning up product image backgrounds. Crop to platform-specific ratios: Instagram square (1:1), YouTube thumbnails (16:9), and profile photos (1:1 circular).</p><p>Apply the Rule of Thirds for better composition — place key subjects at the 1/3 intersection points for a more balanced, appealing layout. Removing unnecessary background emphasizes the subject and reduces file size. Original resolution is maintained, so print quality is unaffected. Check resolution requirements for your intended use before cropping.</p>' }
  },
  'life/image-blur': {
    ko: { title: '이미지 블러 활용 가이드', content: '<p>이미지 블러는 개인정보 보호, 배경 흐림 효과, 디자인 작업에서 널리 사용됩니다. 스크린샷에서 개인 정보(이름, 전화번호, 이메일)를 가리거나, 사진 배경을 흐리게 하여 인물을 강조하는 데 효과적입니다.</p><p>블러 강도에 따라 효과가 크게 달라집니다. 약한 블러(반경 3~5px)는 부드러운 분위기를 연출하고, 강한 블러(반경 15~30px)는 내용을 완전히 가립니다. 개인정보 보호 목적이라면 충분히 강한 블러를 적용하여 원본 내용을 복원할 수 없도록 하세요. 전체 블러와 부분 블러 중 상황에 맞는 옵션을 선택하세요. 블로그 대표 이미지나 배너의 배경으로 흐린 사진을 사용하면 텍스트 가독성이 높아집니다.</p>' },
    en: { title: 'Image Blur Usage Guide', content: '<p>Image blur is widely used for privacy protection, background defocus effects, and design work. It effectively hides personal information (names, phone numbers, emails) in screenshots or emphasizes subjects by blurring backgrounds.</p><p>Effect varies significantly with blur strength. Light blur (radius 3-5px) creates a soft atmosphere, while heavy blur (radius 15-30px) completely obscures content. For privacy purposes, apply strong enough blur that original content cannot be recovered. Choose between full and partial blur based on your needs. Blurred photos used as blog hero images or banner backgrounds improve text readability.</p>' }
  },
};

const baseDir = path.resolve(__dirname, '..');
let ok = 0;

for (const [toolPath, data] of Object.entries(extraContent)) {
  for (const lang of ['ko', 'en']) {
    const parts = toolPath.split('/');
    const filePath = lang === 'ko'
      ? path.join(baseDir, 'tools', parts[0], `${parts[1]}.html`)
      : path.join(baseDir, 'en', 'tools', parts[0], `${parts[1]}.html`);

    if (!fs.existsSync(filePath)) { console.log(`SKIP: ${filePath}`); continue; }
    let content = fs.readFileSync(filePath, 'utf-8');

    const d = data[lang];
    if (content.includes(d.title)) { console.log(`SKIP (exists): ${filePath}`); continue; }

    const sectionHtml = `\n          <h3 class="text-lg font-semibold mt-6 mb-3">${d.title}</h3>\n          ${d.content}\n`;

    // Insert before "관련 도구" or "Related Tools" or "Related Content"
    const markers = ['관련 도구</h3>', 'Related Tools</h3>', '<!-- Related Content -->'];
    let inserted = false;
    for (const marker of markers) {
      const idx = content.indexOf(marker);
      if (idx !== -1) {
        // Find the h3 or comment start before this marker
        const searchBack = marker.startsWith('<!--') ? idx : content.lastIndexOf('<h3', idx);
        if (searchBack !== -1) {
          content = content.slice(0, searchBack) + sectionHtml + '\n          ' + content.slice(searchBack);
          inserted = true;
          break;
        }
      }
    }

    if (!inserted) {
      // Fallback: insert before last </div>\n      </section>
      const lastSection = content.lastIndexOf('</div>\n      </section>');
      if (lastSection !== -1) {
        content = content.slice(0, lastSection) + sectionHtml + '        ' + content.slice(lastSection);
        inserted = true;
      }
    }

    if (inserted) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`OK: ${filePath}`);
      ok++;
    }
  }
}
console.log(`\nDone! ${ok} files updated.`);
