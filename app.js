const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('[data-nav]')];
const chatBody = document.getElementById('chat-body');
const dynamicMessages = document.getElementById('dynamic-messages');
const quickReplies = document.getElementById('quick-replies');
const dayLabel = document.querySelector('.day-label');
const timeTransition = document.getElementById('time-transition');
const demoEnding = document.getElementById('demo-ending');
const phoneScreen = document.querySelector('.phone-screen');
const transitionLabel = document.getElementById('transition-label');
const transitionTitle = document.getElementById('transition-title');
const transitionDate = document.getElementById('transition-date');
const notificationMessage = document.getElementById('notification-message');
const statusBarTime = document.querySelector('.status-bar > span');

const timeline = {
  onboarding: { date: '1月1日', minutes: 9 * 60 + 41 },
  recommendation: { date: '5月1日', minutes: 18 * 60 + 30 },
  oneStop: { date: '12月20日', minutes: 10 * 60 + 15 },
  yearEndReview: { date: '翌年1月31日', minutes: 19 * 60 }
};

const questions = [
  { key: 'preference', text: '返礼品を選ぶとき、いちばん大事にしたいことはある？', options: ['自分へのご褒美になるものがほしい', '日常で使えるものを選びたい', '自分に合うものをおまかせしたい'] },
  { key: 'favorite', text: 'ご褒美なら、特にどれがうれしい？', options: ['牛タン', 'お米', 'フルーツ'], when: (answers) => answers.preference === '自分へのご褒美になるものがほしい' },
  { key: 'age', text: '次に、年齢を教えてね。', options: ['20代', '30代', '40代以上'] },
  { key: 'area', text: 'お住まいは東京23区内ですか？<br>控除額の確認に使います。', options: ['東京23区内', 'それ以外'] },
  { key: 'income', text: '今年の年収は、だいたいどのくらい？<br>これも控除上限の参考額を計算するために使うよ。', options: ['500万円前後', '700万円前後', '900万円以上'] },
  { key: 'family', text: '配偶者や扶養家族はいる？', options: ['扶養なし', '扶養あり'] },
  { key: 'donatedStatus', text: '今年はもう、ふるさと納税をした？', options: ['まだしていない', 'すでに寄付した'] },
  { key: 'donated', text: 'これまでに寄付した金額はいくら？', options: ['30,000円前後', '50,000円前後', '50,000円以上'], when: (answers) => answers.donatedStatus === 'すでに寄付した' },
  { key: 'siteStatus', text: '普段使っているふるさと納税のサイトはある？', options: ['特にない', 'ある'] },
  { key: 'site', text: 'どのサイトを使っている？', options: ['楽天ふるさと納税', 'さとふる', 'ふるなび'], when: (answers) => answers.siteStatus === 'ある' },
  { key: 'oneStop', intro: 'ワンストップ特例は、確定申告をしなくてもふるさと納税の控除を受けられる制度です。<br>寄付先が5自治体以内で、確定申告の予定がない場合に利用できます。', text: 'ワンストップ特例を利用しますか？', options: ['利用したい', '今は決めない'] }
];

const preferencePresets = {
  '自分へのご褒美になるものがほしい': {
    summary: '季節のフルーツやお肉など、ご褒美になる食品を優先。冷蔵・冷凍品は少量ずつ、配送時期も分散するね。',
    favoriteType: '食品がうれしい', avoid: '量が多すぎるもの', freezer: '少しなら入る', delivery: '1〜2月'
  },
  '日常で使えるものを選びたい': {
    summary: '日用品を中心に、置き場所を取りにくく、長く使える返礼品を優先するね。',
    favoriteType: '日用品がうれしい', favorite: '日用品', avoid: '冷凍品', freezer: '空きは少ない', delivery: '特になし'
  },
  '自分に合うものをおまかせしたい': {
    summary: '食品と日用品のバランスを見ながら、量を抑えて配送時期が重ならないように選ぶね。',
    favoriteType: '食品がうれしい', favorite: 'お米', avoid: '量が多すぎるもの', freezer: '少しなら入る', delivery: '特になし'
  }
};

const donationSites = {
  '楽天ふるさと納税': { name: '楽天ふるさと納税', url: 'https://event.rakuten.co.jp/furusato/' },
  'さとふる': { name: 'さとふる', url: 'https://www.satofull.jp/' },
  'ふるなび': { name: 'ふるなび', url: 'https://furunavi.jp/' }
};

const catalog = [
  { id: 'beef', label: '牛タン', temp: '冷凍' },
  { id: 'rice', label: 'お米', temp: '常温' },
  { id: 'paper', label: '日用品', temp: '常温' },
  { id: 'fruit', label: 'フルーツ', temp: '冷蔵' }
];

const productPages = {
  '楽天ふるさと納税': {
    beef: { name: '岩手県花巻市 厚切り牛タン 塩味 500g', amount: 8000, url: 'https://item.rakuten.co.jp/f032051-hanamaki/14301-30020810/' },
    fruit: { name: '長野県飯田市 シャインマスカット 約1kg', amount: 12000, url: 'https://item.rakuten.co.jp/f202053-iida/cq1/' },
    rice: { name: '福井県坂井市 コシヒカリ 5kg', amount: 13000, url: 'https://item.rakuten.co.jp/f182109-sakai/a-0210/' },
    paper: { name: '大阪府泉佐野市 トイレットペーパー 64ロール', amount: 12000, url: 'https://item.rakuten.co.jp/f272132-izumisano/099h3803_b/' }
  },
  'さとふる': {
    beef: { name: '岩手県宮古市 厚切り塩だれ牛タン 1.4kg', amount: 11500, url: 'https://www.satofull.jp/products/detail.php?product_id=1636569' },
    fruit: { name: '山梨県南アルプス市 シャインマスカット 2房', amount: 11000, url: 'https://www.satofull.jp/products/detail.php?product_id=1065741' },
    rice: { name: '茨城県境町 お米4種食べくらべセット', amount: 14000, url: 'https://www.satofull.jp/products/detail.php?product_id=3093549' },
    paper: { name: '岡山県津山市 トイレットペーパーセット', amount: 14000, url: 'https://www.satofull.jp/products/detail.php?product_id=1574780' }
  },
  'ふるなび': {
    beef: { name: '岩手県花巻市 厚切り牛タン 塩味 1kg', amount: 15000, url: 'https://furunavi.jp/product_detail.aspx?pid=594638' },
    fruit: { name: '山梨県甲府市 シャインマスカット 1kg以上', amount: 10000, url: 'https://furunavi.jp/product_detail.aspx?pid=566369' },
    rice: { name: '新潟県南魚沼市 コシヒカリ 5kg', amount: 15000, url: 'https://furunavi.jp/product_detail.aspx?pid=407293' },
    paper: { name: '大阪府泉佐野市 トイレットペーパー 64ロール', amount: 14000, url: 'https://furunavi.jp/product_detail.aspx?pid=1673977' }
  }
};

let timers = [];
let demoStarted = false;
let questionIndex = 0;
let answeredCount = 0;
let profile = {};
let proposalProducts = [];
let proposalTotal = 0;
let notificationStage = 'recommendation';
let favoriteProductId = '';
let currentMessageMinutes = timeline.onboarding.minutes;

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function later(callback, delay) {
  const timer = setTimeout(callback, delay);
  timers.push(timer);
}

function showScreen(name) {
  clearTimers();
  screens.forEach((screen) => screen.classList.toggle('is-active', screen.dataset.screen === name));
  dots.forEach((dot) => dot.classList.toggle('is-current', dot.dataset.nav === name));
  phoneScreen.classList.toggle('is-chat', name === 'chat');
  if (name === 'chat') scrollChat();
}

function scrollChat() {
  requestAnimationFrame(() => { chatBody.scrollTop = chatBody.scrollHeight; });
}

function formatClock(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours}:${String(mins).padStart(2, '0')}`;
}

function setTimelineStage(stage) {
  const point = timeline[stage];
  dayLabel.textContent = point.date;
  currentMessageMinutes = point.minutes;
  statusBarTime.textContent = formatClock(point.minutes);
}

function nextMessageTime() {
  const time = formatClock(currentMessageMinutes);
  statusBarTime.textContent = time;
  currentMessageMinutes += 1;
  return time;
}

function formatChatText(text) {
  return text.replace(/<br>(?!\s*<a\b)/gi, ' ');
}

function appendUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row user';
  row.innerHTML = `<div class="bubble">${formatChatText(text)}<time>既読<br>${nextMessageTime()}</time></div>`;
  dynamicMessages.append(row);
  scrollChat();
}

function appendAgentMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row agent';
  row.innerHTML = `<div class="mascot mascot-tiny"></div><div class="bubble">${formatChatText(text)}<time>${nextMessageTime()}</time></div>`;
  dynamicMessages.append(row);
  scrollChat();
}

function showChoices(options, action = 'answer') {
  quickReplies.innerHTML = options.map((option) => {
    const item = typeof option === 'string' ? { label: option, value: option } : option;
    return `<button data-action="${action}" data-value="${item.value}">${item.label}</button>`;
  }).join('');
  quickReplies.classList.remove('is-hidden');
  requestAnimationFrame(() => {
    chatBody.style.paddingBottom = `${Math.max(72, quickReplies.offsetHeight + 16)}px`;
    scrollChat();
  });
}

function hideChoices() {
  quickReplies.classList.add('is-hidden');
  quickReplies.replaceChildren();
  chatBody.style.paddingBottom = '';
}

function startOnboarding() {
  clearTimers();
  demoStarted = true;
  questionIndex = 0;
  answeredCount = 0;
  profile = {};
  proposalProducts = [];
  notificationStage = 'recommendation';
  favoriteProductId = '';
  setNotification('recommendation');
  dynamicMessages.replaceChildren();
  setTimelineStage('onboarding');
  hideChoices();
  showScreen('chat');
  appendAgentMessage('こんにちは！ふるさと納税くんです。<br>あなたに合う返礼品を探すために、まずは返礼品選びの希望から聞かせてください 😊');
  later(askCurrentQuestion, 700);
}

function askCurrentQuestion() {
  const question = questions[questionIndex];
  if (question.intro) {
    appendAgentMessage(question.intro);
    later(() => {
      appendAgentMessage(question.text);
      showChoices(question.options);
    }, 650);
    return;
  }
  appendAgentMessage(question.text);
  showChoices(question.options);
}

function applyPreferencePreset(preference) {
  const preset = preferencePresets[preference];
  if (!preset) return '';
  const { summary, ...settings } = preset;
  Object.assign(profile, settings);
  return summary;
}

function answerQuestion(value) {
  const question = questions[questionIndex];
  if (!question) return;
  hideChoices();
  profile[question.key] = value;
  appendUserMessage(value);
  answeredCount += 1;
  let nextDelay = 550;
  if (question.key === 'preference') {
    const summary = applyPreferencePreset(value);
    later(() => appendAgentMessage(`わかった！${summary}<br>合わないところは最後にまとめて確認できます。`), 450);
    nextDelay = 1200;
  }
  if (question.key === 'donatedStatus' && value === 'まだしていない') profile.donated = 'まだしていない';
  if (question.key === 'siteStatus' && value === '特にない') profile.site = 'おまかせ';
  questionIndex += 1;
  while (questions[questionIndex]?.when && !questions[questionIndex].when(profile)) questionIndex += 1;
  if (question.key === 'siteStatus' && value === '特にない') {
    later(() => appendAgentMessage('了解！サイトごとのキャンペーンやポイント条件を比べて、今回いちばんポイントが貯まりやすいサイトも一緒に提案するね。'), 450);
    nextDelay = 1100;
  }
  if (questionIndex < questions.length) later(askCurrentQuestion, nextDelay);
  else later(showProfileConfirmation, 700);
}

function parseMoney(value) {
  if (value === 'まだしていない' || value === '金額が分からない') return 0;
  return Number(value.replace(/[^0-9]/g, ''));
}

function calculateLimit() {
  const base = { '500万円前後': 49000, '700万円前後': 75000, '900万円以上': 110000 }[profile.income] || 75000;
  const deduction = profile.family === '扶養あり' ? 11000 : 0;
  return Math.max(base - deduction, 20000);
}

function formatMoney(value) {
  return `${value.toLocaleString('ja-JP')}円`;
}

function deliveryCondition() {
  return profile.delivery === '特になし' ? '配送時期の希望なし' : `${profile.delivery}を避ける`;
}

function selectedDonationSite() {
  return donationSites[profile.site] || donationSites['ふるなび'];
}

function profileSiteLabel() {
  return profile.site === 'おまかせ' ? 'おまかせ（比較して提案）' : profile.site;
}

function showProfileConfirmation() {
  const limit = calculateLimit();
  profile.limit = limit;
  profile.donatedAmount = parseMoney(profile.donated);
  const card = document.createElement('article');
  card.className = 'profile-confirm-card';
  card.innerHTML = `<div class="profile-confirm-hero"><div class="profile-avatar"></div><div><small>ふるさと納税プロフィール</small><h3>あなたのプロフィール</h3></div></div>
    <div class="profile-confirm-limit"><span>控除上限の参考額</span><strong>約${formatMoney(limit)}</strong><small>入力内容をもとにしたデモ上の参考値です</small></div>
    <dl>
      <div><dt>返礼品選びの希望</dt><dd>${profile.preference}</dd></div>
      <div><dt>基本情報</dt><dd>${profile.age}・${profile.area}<br>${profile.family}</dd></div>
      <div><dt>年収・今年の寄付</dt><dd>${profile.income}<br>${profile.donated}</dd></div>
      <div><dt>好み・避けたいもの</dt><dd>${profile.favorite}<br>${profile.avoid}</dd></div>
      <div><dt>生活の条件</dt><dd>冷凍庫：${profile.freezer}<br>${deliveryCondition()}</dd></div>
      <div><dt>利用するサイト</dt><dd>${profileSiteLabel()}</dd></div>
      <div><dt>申請方法</dt><dd>ワンストップ特例：${profile.oneStop}</dd></div>
    </dl>`;
  dynamicMessages.append(card);
  appendAgentMessage('このプロフィールでいい？');
  showChoices([{ label: 'この内容で保存', value: 'save-profile' }, { label: '修正する', value: 'edit-profile' }], 'profile-action');
  scrollChat();
}

function saveProfile() {
  hideChoices();
  appendUserMessage('この内容で保存');
  later(() => appendAgentMessage('保存しました！<br>この条件に合うタイミングになったら、こちらからLINEしますね 😊'), 500);
  later(() => showTimeTransition('プロフィールを保存しました', '数ヶ月後', timeline.recommendation.date, 'recommendation'), 1500);
}

function editProfile() {
  hideChoices();
  appendUserMessage('修正する');
  later(() => {
    dynamicMessages.replaceChildren();
    questionIndex = 0;
    answeredCount = 0;
    profile = {};
    setTimelineStage('onboarding');
    appendAgentMessage('もちろん！最初から確認し直そう。');
    later(askCurrentQuestion, 500);
  }, 450);
}

function stageOpeningMessage(stage) {
  const messages = {
    recommendation: 'あなたに合いそうな、いい返礼品を3つ見つけたよー！ 🎁',
    oneStop: `5月の${proposalProducts.length}自治体への寄付について、ワンストップ特例の申請準備ができました 📝`,
    yearEndReview: '昨年の寄付で届いた返礼品について、ひとつだけ教えてください 😊'
  };
  return messages[stage];
}

function setNotification(stage) {
  notificationStage = stage;
  notificationMessage.innerHTML = stageOpeningMessage(stage);
}

function showTimeTransition(label, title, date, nextStage) {
  transitionLabel.textContent = label;
  transitionTitle.textContent = title;
  transitionDate.textContent = date;
  timeTransition.classList.add('is-visible');
  later(() => {
    timeTransition.classList.remove('is-visible');
    setTimelineStage(nextStage);
    setNotification(nextStage);
    showScreen('notification');
  }, 2200);
}

function openNotification() {
  if (notificationStage === 'oneStop') startOneStopChat();
  else if (notificationStage === 'yearEndReview') startYearEndReviewChat();
  else startRecommendationChat();
}

function startRecommendationChat() {
  dynamicMessages.replaceChildren();
  hideChoices();
  setTimelineStage('recommendation');
  showScreen('chat');
  appendAgentMessage(stageOpeningMessage('recommendation'));
  later(() => showChoices([{ label: 'おっ、どんなの〜？', value: 'details' }], 'flow'), 450);
}

function selectProducts() {
  const remaining = Math.max(profile.limit - profile.donatedAmount, 0);
  const budget = Math.min(remaining, 70000);
  const site = selectedDonationSite();
  let available = catalog.map((product) => ({ ...product, ...productPages[site.name][product.id] })).filter((product) => {
    if (profile.avoid === '冷凍品' && product.temp === '冷凍') return false;
    return true;
  });
  const favorite = available.find((product) => product.label === profile.favorite);
  available = available.filter((product) => product !== favorite).sort((a, b) => a.amount - b.amount);
  let used = 0;
  proposalProducts = [];
  if (favorite && favorite.amount <= budget) {
    proposalProducts.push(favorite);
    used += favorite.amount;
  }
  available.forEach((product) => {
    if (proposalProducts.length < 3 && used + product.amount <= budget) {
      proposalProducts.push(product);
      used += product.amount;
    }
  });
  proposalTotal = used;
}

function deliveryDates() {
  return ['6月中旬', '9月中旬', '10月上旬'];
}

function appendProposalCard() {
  selectProducts();
  if (!proposalProducts.length) {
    appendAgentMessage('今年の控除上限の参考額まで、残りの枠がほとんどなかったよ。<br>今回は無理に寄付せず、来年また提案するね。');
    showChoices([{ label: '今回は見送る', value: 'stop' }], 'flow');
    return;
  }
  const site = selectedDonationSite();
  const dates = deliveryDates();
  const productsHtml = proposalProducts.map((product, index) => `<div><div class="product-photo ${product.id}">${dates[index]}</div><b>${product.name}</b><strong>${formatMoney(product.amount)} <em class="${product.temp === '冷凍' ? 'cold' : ''}">${product.temp}</em></strong></div>`).join('');
  const card = document.createElement('article');
  card.className = 'proposal-card';
  card.innerHTML = `<h3>✨ あなた専用 おすすめ返礼品セット</h3>
    <div class="campaign-badge">${site.name} 春のキャンペーン対象</div>
    <div class="products" style="grid-template-columns:repeat(${proposalProducts.length},1fr)">${productsHtml}</div>
    <div class="proposal-summary"><p><span>合計寄付額</span><strong>${formatMoney(proposalTotal)}</strong></p><p><span>控除上限目安</span><strong>約${formatMoney(profile.limit)}</strong><i><b style="width:${Math.min(100, Math.round((profile.donatedAmount + proposalTotal) / profile.limit * 100))}%"></b></i></p><ul><li>保存した条件から選定</li><li>${profile.favorite}の好みを反映</li><li>冷凍庫の余裕を考慮</li><li>${deliveryCondition()}</li></ul></div>`;
  dynamicMessages.append(card);
  scrollChat();
}

function appendProductLinkMessages() {
  if (!proposalProducts.length) return;
  const site = selectedDonationSite();
  appendAgentMessage('返礼品ごとの商品ページを送るね。');
  proposalProducts.forEach((product, index) => {
    later(() => appendAgentMessage(`${product.name}<br><a class="message-product-link" href="${product.url}" target="_blank" rel="noreferrer">${product.url}</a>`), 450 + index * 650);
  });
  const afterLinks = 650 + proposalProducts.length * 650;
  later(() => appendAgentMessage(`どれも${site.name}の商品ページです。<br>内容を確認したら、まとめて寄付と決済まで進められます。`), afterLinks);
  later(() => showChoices([{ label: '寄付に進む', value: 'review' }, { label: '今回は見送る', value: 'stop' }], 'flow'), afterLinks + 650);
}

function showDetails() {
  hideChoices();
  appendUserMessage('おっ、どんなの〜？');
  const remaining = Math.max(profile.limit - profile.donatedAmount, 0);
  const site = selectedDonationSite();
  later(() => appendAgentMessage(`控除上限の参考額は約${formatMoney(profile.limit)}。<br>今年の寄付額を差し引いて、残り${formatMoney(remaining)}以内で探したよ。`), 900);
  later(() => appendAgentMessage(`${profile.favorite}を優先して、避けたいものは「${profile.avoid}」。<br>冷凍庫の余裕と「${deliveryCondition()}」も反映したよ。`), 1700);
  later(() => appendAgentMessage(profile.site === 'おまかせ'
    ? `普段使うサイトはないと聞いていたので、サイトごとのキャンペーンやポイント条件を比べました。<br>今回は${site.name}がいちばんポイントを貯めやすい設定だったので、${site.name}で寄付できる返礼品から探したよ！<br>※デモ上のキャンペーン設定です`
    : `いつも使っている${site.name}を優先しました。<br>今年は春のキャンペーンで通常よりポイントを貯めやすい設定だったので、${site.name}で寄付できる返礼品から探したよ！<br>※デモ上のキャンペーン設定です`), 2500);
  later(appendProposalCard, 3300);
  later(appendProductLinkMessages, 4000);
}

function showFinalReview() {
  hideChoices();
  appendUserMessage('寄付に進む');
  const dates = deliveryDates();
  const site = selectedDonationSite();
  later(() => {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `<h3>寄付・決済前の最終確認</h3><div class="review-total"><span>${proposalProducts.length}自治体への寄付</span><strong>${formatMoney(proposalTotal)}</strong></div>
      <dl><div><dt>控除上限目安</dt><dd>約${formatMoney(profile.limit)}</dd></div><div><dt>上限までの余裕</dt><dd>${formatMoney(Math.max(profile.limit - profile.donatedAmount - proposalTotal, 0))}</dd></div><div><dt>利用サイト</dt><dd>${site.name}</dd></div><div><dt>配送予定</dt><dd>${dates.slice(0, proposalProducts.length).join('・')}</dd></div><div><dt>ワンストップ特例</dt><dd>${profile.oneStop}</dd></div><div><dt>寄付金の用途</dt><dd>各自治体のおすすめ用途</dd></div></dl><p>登録済みの住所・決済方法を使用します。控除額はデモ上の参考値です。</p>`;
    dynamicMessages.append(card);
    scrollChat();
    showChoices([{ label: 'OK', value: 'proceed' }, { label: 'やめる', value: 'cancel' }], 'flow');
  }, 650);
}

function adjustPreference(kind) {
  hideChoices();
  appendUserMessage(kind === 'purpose' ? '寄付の用途を変更' : '配送時期を変更');
  later(() => appendAgentMessage(kind === 'purpose' ? '了解！子育て・教育支援を優先するように変更したよ。' : '了解！さらに1か月ずつ間隔を空けるように変更したよ。'), 650);
  later(() => showChoices([{ label: 'この内容で進める', value: 'proceed' }, { label: 'やめる', value: 'stop' }], 'flow'), 1100);
}

function startPaymentFlow() {
  hideChoices();
  appendUserMessage('OK');
  later(() => appendAgentMessage('確認ありがとうございます。登録済みの情報を使って、寄付と決済を進めます。'), 800);
  later(showCompleteCard, 1900);
}

function showCompleteCard() {
  const dates = deliveryDates();
  const items = proposalProducts.map((product, index) => `<div><b>${product.name}</b><span>${dates[index]}・${formatMoney(product.amount)}</span></div>`).join('');
  const card = document.createElement('article');
  card.className = 'complete-card';
  card.innerHTML = `<div class="check">✓</div><h3>寄付と決済が完了しました</h3><p>受付番号を発行しました。<br>配送時期が重ならないよう調整済みです。</p><div class="delivery-list">${items}<div><strong>合計寄付額</strong><strong>${formatMoney(proposalTotal)}</strong></div></div>`;
  dynamicMessages.append(card);
  appendAgentMessage(profile.oneStop === '利用したい' ? 'すべて完了しました！ワンストップ申請の期限前にも、こちらからお知らせしますね 😊' : 'すべて完了しました！返礼品の発送前にも、こちらからお知らせしますね 😊');
  scrollChat();
  later(() => showTimeTransition('寄付と決済が完了しました', '約8ヶ月後', timeline.oneStop.date, 'oneStop'), 3200);
}

function startOneStopChat() {
  dynamicMessages.replaceChildren();
  hideChoices();
  setTimelineStage('oneStop');
  showScreen('chat');
  appendAgentMessage(stageOpeningMessage('oneStop'));
  later(() => {
    appendAgentMessage('利用できるか最終確認します。<br>医療費控除などで、今年分の確定申告をする予定はありますか？');
    showChoices([{ label: '予定はない', value: 'tax-no' }, { label: '予定がある', value: 'tax-yes' }], 'flow');
  }, 700);
}

function answerTaxReturn(hasPlan) {
  hideChoices();
  appendUserMessage(hasPlan ? '確定申告の予定がある' : '確定申告の予定はない');
  if (hasPlan) {
    later(() => appendAgentMessage('確定申告をする場合、ワンストップ特例は利用できません。<br>寄付金受領証明書をまとめて、確定申告の時期にもう一度お知らせしますね。'), 650);
    later(() => scheduleYearEndReview('確定申告用の寄付情報を保存しました'), 2700);
    return;
  }
  later(() => {
    appendAgentMessage('ありがとう。寄付先は5自治体以内なので、ワンストップ特例で進められます。');
    appendOneStopCard();
  }, 650);
}

function appendOneStopCard() {
  const card = document.createElement('article');
  card.className = 'one-stop-card';
  card.innerHTML = `<div class="one-stop-head"><span>申請準備完了</span><h3>ワンストップ特例</h3></div>
    <dl><div><dt>申請対象</dt><dd>${proposalProducts.length}自治体</dd></div><div><dt>申請方法</dt><dd>オンライン</dd></div><div><dt>本人確認</dt><dd>連携済み情報を使用</dd></div><div><dt>申請期限</dt><dd>1月10日</dd></div></dl>
    <p>氏名・住所・寄付情報を確認済みです。申請内容を自治体ごとに作成します。</p>`;
  dynamicMessages.append(card);
  scrollChat();
  showChoices([{ label: `${proposalProducts.length}自治体分を申請する`, value: 'one-stop-submit' }], 'flow');
}

function submitOneStop() {
  hideChoices();
  appendUserMessage(`${proposalProducts.length}自治体分を申請する`);
  later(() => appendAgentMessage('了解しました。連携済みの本人確認情報を使って、各自治体へ申請します。'), 650);
  later(() => {
    const card = document.createElement('article');
    card.className = 'complete-card one-stop-complete';
    card.innerHTML = `<div class="check">✓</div><h3>申請が完了しました</h3><p>${proposalProducts.length}自治体すべてに<br>ワンストップ特例を申請しました。</p><div class="delivery-list"><div><b>申請ステータス</b><span>受付済み</span></div><div><b>申請期限</b><span>1月10日</span></div><div><b>控除予定</b><span>翌年度の住民税</span></div></div>`;
    dynamicMessages.append(card);
    appendAgentMessage('申請まで完了しました！不備の連絡が届いた場合も、こちらからお知らせしますね。<br>翌年1月には、返礼品の感想も聞かせてください 😊');
    scrollChat();
    later(() => scheduleYearEndReview('ワンストップ申請が完了しました'), 3200);
  }, 1700);
}

function scheduleYearEndReview(label) {
  showTimeTransition(label, '翌年1月', timeline.yearEndReview.date, 'yearEndReview');
}

function startYearEndReviewChat() {
  dynamicMessages.replaceChildren();
  hideChoices();
  setTimelineStage('yearEndReview');
  showScreen('chat');
  appendAgentMessage(stageOpeningMessage('yearEndReview'));
  const options = proposalProducts.map((product) => ({ label: product.label, value: product.id }));
  later(() => showChoices(options, 'feedback-product'), 450);
}

function chooseFavoriteProduct(productId) {
  const product = proposalProducts.find((item) => item.id === productId);
  if (!product) return;
  favoriteProductId = productId;
  hideChoices();
  appendUserMessage(product.label);
  later(() => {
    appendAgentMessage(`${product.label}だね！満足度はどうでしたか？`);
    showChoices(['とてもよかった', 'まあまあ', '次回は別のもの'], 'feedback-score');
  }, 600);
}

function saveFeedback(score) {
  const product = proposalProducts.find((item) => item.id === favoriteProductId);
  if (!product) return;
  hideChoices();
  appendUserMessage(score);
  later(() => {
    const card = document.createElement('article');
    card.className = 'memory-card';
    const nextCondition = score === '次回は別のもの' ? `${product.label}は優先度を下げる` : `${product.label}と近い返礼品を優先`;
    card.innerHTML = `<div class="memory-icon">✓</div><div><small>エージェントメモを更新</small><h3>今年の検索条件に保存しました</h3><dl><div><dt>今回の評価</dt><dd>${product.label}・${score}</dd></div><div><dt>今年の条件</dt><dd>${nextCondition}</dd></div><div><dt>継続する条件</dt><dd>控除上限・冷凍庫・配送時期</dd></div></dl></div>`;
    dynamicMessages.append(card);
    appendAgentMessage('ありがとう！この評価を今年の提案に使います。<br>今年は昨年よりも、あなたに合う候補を早く見つけられます 😊');
    scrollChat();
    later(() => {
      demoEnding.hidden = false;
      demoEnding.focus();
    }, 3500);
  }, 650);
}

function showAlternative() {
  hideChoices();
  appendUserMessage('別の候補を見る');
  later(() => appendAgentMessage('もちろん！日用品とお米を中心にして、冷凍品なしの候補も探せるよ。'), 700);
  later(() => showChoices([{ label: '最初の候補を確認する', value: 'review' }, { label: '今回は見送る', value: 'stop' }], 'flow'), 1200);
}

function stopDemo(label = '今回は見送る') {
  hideChoices();
  appendUserMessage(label);
  later(() => appendAgentMessage('わかったよ！条件は覚えておくね。また良いタイミングでお知らせするよ 😊'), 700);
}

function resetDemo() {
  clearTimers();
  demoEnding.hidden = true;
  timeTransition.classList.remove('is-visible');
  dynamicMessages.replaceChildren();
  hideChoices();
  demoStarted = false;
  questionIndex = 0;
  answeredCount = 0;
  profile = {};
  proposalProducts = [];
  notificationStage = 'recommendation';
  favoriteProductId = '';
  setNotification('recommendation');
  setTimelineStage('onboarding');
  chatBody.scrollTop = 0;
  showScreen('home');
}

demoEnding.addEventListener('click', () => {
  resetDemo();
  document.getElementById('start-demo').focus();
});

document.getElementById('start-demo').addEventListener('click', startOnboarding);
document.getElementById('chat-app').addEventListener('click', openNotification);
document.getElementById('notification-card').addEventListener('click', openNotification);
document.getElementById('back-home').addEventListener('click', resetDemo);

quickReplies.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  if (button.dataset.action === 'answer') answerQuestion(button.dataset.value);
  if (button.dataset.action === 'profile-action' && button.dataset.value === 'save-profile') saveProfile();
  if (button.dataset.action === 'profile-action' && button.dataset.value === 'edit-profile') editProfile();
  if (button.dataset.action === 'feedback-product') chooseFavoriteProduct(button.dataset.value);
  if (button.dataset.action === 'feedback-score') saveFeedback(button.dataset.value);
  if (button.dataset.action === 'flow') {
    const actions = { details: showDetails, review: showFinalReview, proceed: startPaymentFlow, alternative: showAlternative, purpose: () => adjustPreference('purpose'), 'delivery-change': () => adjustPreference('delivery'), 'tax-no': () => answerTaxReturn(false), 'tax-yes': () => answerTaxReturn(true), 'one-stop-submit': submitOneStop, stop: stopDemo, cancel: () => stopDemo('やめる') };
    actions[button.dataset.value]?.();
  }
});

dots.forEach((dot) => dot.addEventListener('click', () => {
  if (dot.dataset.nav === 'home') resetDemo();
}));
