// database array
const hiraganaSeion = [
    ['あ','a','row-a'], ['い','i','row-a'], ['う','u','row-a'], ['え','e','row-a'], ['お','o','row-a'],
    ['か','ka','row-k'], ['き','ki','row-k'], ['く','ku','row-k'], ['け','ke','row-k'], ['こ','ko','row-k'],
    ['さ','sa','row-s'], ['し','shi','row-s'], ['す','su','row-s'], ['せ','se','row-s'], ['そ','so','row-s'],
    ['た','ta','row-t'], ['ち','chi','row-t'], ['つ','tsu','row-t'], ['て','te','row-t'], ['と','to','row-t'],
    ['な','na','row-n'], ['に','ni','row-n'], ['ぬ','nu','row-n'], ['ね','ne','row-n'], ['の','no','row-n'],
    ['は','ha','row-h'], ['ひ','hi','row-h'], ['ふ','fu','row-h'], ['へ','he','row-h'], ['ほ','ho','row-h'],
    ['ま','ma','row-m'], ['み','mi','row-m'], ['む','mu','row-m'], ['め','me','row-m'], ['も','mo','row-m'],
    ['や','ya','row-y'], [null], ['ゆ','yu','row-y'], [null], ['よ','yo','row-y'],
    ['ら','ra','row-r'], ['り','ri','row-r'], ['る','ru','row-r'], ['れ','re','row-r'], ['ろ','ro','row-r'],
    ['わ','wa','row-w'], [null], [null], [null], ['を','wo','row-w'],
    ['ん','n/ng','row-w']
];

const hiraganaDakuten = [
    ['が','ga','row-g'], ['ぎ','gi','row-g'], ['ぐ','gu','row-g'], ['げ','ge','row-g'], ['ご','go','row-g'],
    ['ざ','za','row-z'], ['じ','ji','row-z'], ['ず','zu','row-z'], ['ぜ','ze','row-z'], ['ぞ','zo','row-z'],
    ['だ','da','row-d'], ['ぢ','ji','row-d'], ['づ','zu','row-d'], ['で','de','row-d'], ['ど','do','row-d'],
    ['ば','ba','row-b'], ['び','bi','row-b'], ['ぶ','bu','row-b'], ['べ','be','row-b'], ['ぼ','bo','row-b']
];

const hiraganaHandakuten = [
    ['ぱ','pa','row-p'], ['ぴ','pi','row-p'], ['ぷ','pu','row-p'], ['ぺ','pe','row-p'], ['ぽ','po','row-p']
];

const katakanaSeion = [
    ['ア','a','row-a'], ['イ','i','row-a'], ['ウ','u','row-a'], ['エ','e','row-a'], ['オ','o','row-a'],
    ['カ','ka','row-k'], ['キ','ki','row-k'], ['ク','ku','row-k'], ['ケ','ke','row-k'], ['コ','ko','row-k'],
    ['サ','sa','row-s'], ['シ','shi','row-s'], ['ス','su','row-s'], ['セ','se','row-s'], ['ソ','so','row-s'],
    ['タ','ta','row-t'], ['チ','chi','row-t'], ['ツ','tsu','row-t'], ['テ','te','row-t'], ['ト','to','row-t'],
    ['ナ','na','row-n'], ['ニ','ni','row-n'], ['ヌ','nu','row-n'], ['ネ','ne','row-n'], ['ノ','no','row-n'],
    ['ハ','ha','row-h'], ['ヒ','hi','row-h'], ['フ','fu','row-h'], ['ヘ','he','row-h'], ['ホ','ho','row-h'],
    ['マ','ma','row-m'], ['ミ','mi','row-m'], ['ム','mu','row-m'], ['メ','me','row-m'], ['モ','mo','row-m'],
    ['ヤ','ya','row-y'], [null], ['ユ','yu','row-y'], [null], ['ヨ','yo','row-y'],
    ['ラ','ra','row-r'], ['リ','ri','row-r'], ['ル','ru','row-r'], ['レ','re','row-r'], ['ロ','ro','row-r'],
    ['ワ','wa','row-w'], [null], [null], [null], ['ヲ','wo','row-w'],
    ['ン','n/ng','row-w']
];

const katakanaDakuten = [
    ['ガ','ga','row-g'], ['ギ','gi','row-g'], ['グ','gu','row-g'], ['ゲ','ge','row-g'], ['ゴ','go','row-g'],
    ['ザ','za','row-z'], ['ジ','ji','row-z'], ['ズ','zu','row-z'], ['ゼ','ze','row-z'], ['ゾ','zo','row-z'],
    ['ダ','da','row-d'], ['ヂ','ji','row-d'], ['ヅ','zu','row-d'], ['デ','de','row-d'], ['ド','do','row-d'],
    ['バ','ba','row-b'], ['ビ','bi','row-b'], ['ブ','bu','row-b'], ['ベ','be','row-b'], ['ボ','bo','row-b']
];

const katakanaHandakuten = [
    ['パ','pa','row-p'], ['ピ','pi','row-p'], ['プ','pu','row-p'], ['ペ','pe','row-p'], ['ポ','po','row-p']
];

const yoonGabungan = [
    ['キャ','kya','row-k'], ['キュ','kyu','row-k'], ['キョ','kyo','row-k'],
    ['シャ','sha','row-s'], ['シュ','shu','row-s'], ['ショ','sho','row-s'],
    ['チャ','cha','row-t'], ['チュ','chu','row-t'], ['チョ','cho','row-t']
];

const hurufKhusus = [
    ['ファ','fa','row-h'], ['フィ','fi','row-h'], ['フェ','fe','row-h'], ['フォ','fo','row-h'],
    ['ウィ','wi','row-w'], ['ウェ','we','row-w'], [null], ['ウォ','wo','row-w'],
    ['ティ','ti','row-t'], ['ディ','di','row-d'], ['トゥ','tu','row-t'], ['ドゥ','du','row-d'],
    ['シェ','she','row-s'], ['チェ','che','row-t'], ['ジェ','je','row-z'], [null]
];

const dataPartikel = [
    ['は (Wa)', "Penanda subjek/topik utama. Dibaca 'wa'.", "Watashi wa (Saya adalah...)"],
    ['が (Ga)', "Penanda subjek spesifik atau penegas informasi baru.", "Kuma ga imasu (Ada beruang)"],
    ['を (O)', "Penanda objek penderita. Dibaca 'o'.", "Ocha o nomu (Minum teh)"],
    ['に (Ni)', "Menunjukkan tempat, arah tujuan (ke), atau waktu (pada).", "Rokuji ni okimasu (Bangun jam 6)"],
    ['で (De)', "Menunjukkan tempat aktivitas (di) atau alat (dengan).", "Uchi de taberu (Makan di rumah)"],
    ['の (No)', "Penanda kepemilikan.", "Watashi no namae (Namaku)"],
    ['と (To) & も (Mo)', "<b>と (To)</b> = Dan/bersama. <b>も (Mo)</b> = Juga.", "Chichi to (Bersama ayah)"]
];

const dataHubung = [
    ['そして', 'Soshite', 'Dan / Lalu (Untuk kalimat)'],
    ['でも', 'Demo', 'Tetapi (Kasual)'],
    ['だから', 'Dakara', 'Karena itu / Jadi'],
    ['または', 'Matawa', 'Atau'],
    ['だって', 'Datte', 'Habisnya... / Tapi kan... (Alasan)'],
    ['しかも', 'Shikamo', 'Bahkan'],
    ['それでも', 'Sore demo', 'Meski begitu'],
    ['それに', 'Soreni', 'Selain itu / Dan juga'],
    ['それから', 'Sore kara', 'Setelah itu'],
];

const dataWaktu = [
    ['今日', 'Kyou', 'Hari ini'],
    ['明日', 'Ashita', 'Besok'],
    ['あさって', 'Asatte', 'Lusa'],
    ['昨日', 'Kinou', 'Kemarin'],
    ['今', 'Ima', 'Sekarang'],
    ['後で', 'Ato de', 'Nanti'],
    ['去年', 'Kyonen', 'Tahun lalu'],
    ['せんげつ', 'Sengetsu', 'Bulan lalu'],
    ['ことし', 'Kotoshi', 'Tahun ini'],
    ['らいげつ', 'Raigetsu', 'Bulan depan'],
    ['こんげつ', 'Kongetsu', 'Bulan ini'],
];

const namaBulan = [
    ['いちがつ', 'ichi-gatsu', 'Januari'],
    ['にがつ', 'ni-gatsu', 'Februari'],
    ['さんがつ', 'san-gatsu', 'Maret'],
    ['しがつ', 'shi-gatsu', 'April'],
    ['ごがつ', 'go-gatsu', 'Mei'],
    ['ろくがつ', 'roku-gatsu', 'Juni'],
    ['しちがつ', 'shichi-gatsu', 'Juli'],
    ['はちがつ', 'hachi-gatsu', 'Agustus'],
    ['くがつ', 'ku-gatsu', 'September'],
    ['じゅうがつ', 'juu-gatsu', 'Oktober'],
    ['じゅういちがつ', 'juu-ichi-gatsu', 'November'],
    ['じゅうにがつ', 'juu-ni-gatsu', 'Desember'],
    ['なんがつ', 'nan-gatsu?', 'Bulan apa?']
];

const dataFrekuensi = [
    ['いつも', 'Itsumo', 'Selalu (100%)'],
    ['たいてい', 'Taitei', 'Biasanya (80-90%)'],
    ['よく', 'Yoku', 'Sering (70-80%)'],
    ['時々', 'Tokidoki', 'Kadang-kadang (50%)'],
    ['あまり', 'Amari', 'Jarang (Diikuti bentuk negatif)'],
    ['ほとんど', 'Hotondo', 'Hampir tidak pernah (Diikuti bentuk negatif)'],
    ['全然', 'Zenzen', 'Sama sekali tidak (Diikuti bentuk negatif)']
];

const dataWarna = [
    ['Merah', '赤 (Aka)', '赤い (Akai)'],
    ['Biru', '青 (Ao)', '青い (Aoi)'],
    ['Putih', '白 (Shiro)', '白い (Shiroi)'],
    ['Hitam', '黒 (Kuro)', '黒い (Kuroi)'],
    ['Hijau', '緑 (Midori)', '- (Benda: Midori no...)'],
    ['Pink', 'ピンク (pinku)', '-'],
    ['Oranye', 'オレンジ (orenji)', '-'],
];

const dataUngkapan = [
    ['おはよう', 'Ohayou', 'Selamat pagi'],
    ['こんにちは', 'Konnichiwa', 'Selamat siang / Halo'],
    ['こんばんは', 'Konbanwa', 'Selamat malam'],
    ['ありがとう', 'Arigatou', 'Terima kasih'],
    ['すみません', 'Sumimasen', 'Permisi / Maaf'],
    ['やばい！', 'Yabai!', 'Gawat! / Wah gila!'],
    ['すごい！', 'Sugoi!', 'Hebat! / Luar biasa!'],
    ['サンキュー', 'Sankyuu', 'Thank you (Serapan)'],
    ['できる', 'Dekiru', 'Mampu / bisa'],
    ['うまい', 'Umai', 'Lezat']
];

// Offline fallback vocabulary database
const fallbackVocabData = [
  { level: "n5", kana: "あう", romaji: "au", arti: "bertemu", tipe: "verb" },
  { level: "n5", kana: "あさ", romaji: "asa", arti: "pagi", tipe: "noun" },
  { level: "n5", kana: "あかい", romaji: "akai", arti: "merah", tipe: "adjective" },
  { level: "n5", kana: "あぶない", romaji: "abunai", arti: "bahaya", tipe: "adjective" },
  { level: "n5", kana: "あめ", romaji: "ame", arti: "hujan / permen", tipe: "noun" },
  { level: "n5", kana: "いく", romaji: "iku", arti: "pergi", tipe: "verb" },
  { level: "n5", kana: "いぬ", romaji: "inu", arti: "anjing", tipe: "noun" },
  { level: "n5", kana: "えき", romaji: "eki", arti: "stasiun", tipe: "noun" },
  { level: "n5", kana: "おちゃ", romaji: "ocha", arti: "teh hijau", tipe: "noun" },
  { level: "n5", kana: "おいしい", romaji: "oishii", arti: "lezat / enak", tipe: "adjective" },
  { level: "n5", kana: "かう", romaji: "kau", arti: "membeli", tipe: "verb" },
  { level: "n5", kana: "くるま", romaji: "kuruma", arti: "mobil", tipe: "noun" },
  { level: "n5", kana: "ねこ", romaji: "neko", arti: "kucing", tipe: "noun" },
  { level: "n5", kana: "たべる", romaji: "taberu", arti: "makan", tipe: "verb" },
  { level: "n5", kana: "のむ", romaji: "nomu", arti: "minum", tipe: "verb" },
  { level: "n4", kana: "あつまる", romaji: "atsumaru", arti: "berkumpul", tipe: "verb" },
  { level: "n4", kana: "いそぐ", romaji: "isogu", arti: "terburu-buru", tipe: "verb" },
  { level: "n4", kana: "かんたん", romaji: "kantan", arti: "mudah", tipe: "adjective" },
  { level: "n3", kana: "あいさつ", romaji: "aisatsu", arti: "salam", tipe: "ungkapan" },
  { level: "n3", kana: "あきらめる", romaji: "akirameru", arti: "menyerah", tipe: "verb" }
];

const ROW_CLASS_MAP = {
  a: "row-a",
  k: "row-k",
  s: "row-s",
  t: "row-t",
  n: "row-n",
  h: "row-h",
  m: "row-m",
  y: "row-y",
  r: "row-r",
  w: "row-w",
  g: "row-g",
  z: "row-z",
  d: "row-d",
  b: "row-b",
  p: "row-p"
};

const GRID_PATTERNS = {
  seion: [
    ["a", "i", "u", "e", "o"],
    ["ka", "ki", "ku", "ke", "ko"],
    ["sa", "shi", "su", "se", "so"],
    ["ta", "chi", "tsu", "te", "to"],
    ["na", "ni", "nu", "ne", "no"],
    ["ha", "hi", "fu", "he", "ho"],
    ["ma", "mi", "mu", "me", "mo"],
    ["ya", null, "yu", null, "yo"],
    ["ra", "ri", "ru", "re", "ro"],
    ["wa", null, null, null, "wo"],
    ["n"]
  ],
  dakuten: [
    ["ga", "gi", "gu", "ge", "go"],
    ["za", "ji", "zu", "ze", "zo"],
    ["da", "ji", "zu", "de", "do"],
    ["ba", "bi", "bu", "be", "bo"]
  ],
  handakuten: [
    ["pa", "pi", "pu", "pe", "po"]
  ]
};

function getRowClass(romaji = "") {
  const normalized = romaji.toLowerCase();
  if (normalized.startsWith("ch") || normalized.startsWith("ts")) return "row-t";
  if (normalized.startsWith("sh")) return "row-s";
  return ROW_CLASS_MAP[normalized[0]] || "row-a";
}

function decorateGridEntries(entries, script, category) {
  return entries.map((item) => {
    if (!item || item[0] === null) return [null];
    return [item[0], item[1], item[2] || getRowClass(item[1]), script, category];
  });
}

function buildDefaultKanaState() {
  return {
    hiragana: {
      seion: decorateGridEntries(hiraganaSeion, "hiragana", "seion"),
      dakuten: decorateGridEntries(hiraganaDakuten, "hiragana", "dakuten"),
      handakuten: decorateGridEntries(hiraganaHandakuten, "hiragana", "handakuten"),
      yoon: decorateGridEntries([], "hiragana", "yoon"),
      khusus: decorateGridEntries([], "hiragana", "khusus")
    },
    katakana: {
      seion: decorateGridEntries(katakanaSeion, "katakana", "seion"),
      dakuten: decorateGridEntries(katakanaDakuten, "katakana", "dakuten"),
      handakuten: decorateGridEntries(katakanaHandakuten, "katakana", "handakuten"),
      yoon: decorateGridEntries(yoonGabungan, "katakana", "yoon"),
      khusus: decorateGridEntries(hurufKhusus, "katakana", "khusus")
    }
  };
}

function tupleFromJsonItem(item, script, category) {
  return [item.jp, item.romaji, getRowClass(item.romaji), script, category];
}

function buildPatternGrid(items, script, category) {
  const pattern = GRID_PATTERNS[category] || [];
  const dictionary = new Map();

  items.forEach((item) => {
    const key = String(item.romaji).toLowerCase();
    const bucket = dictionary.get(key) || [];
    bucket.push(item);
    dictionary.set(key, bucket);
  });

  return pattern.flatMap((row) => row.map((token) => {
    if (token === null) return [null];
    const bucket = dictionary.get(String(token).toLowerCase()) || [];
    const found = bucket.shift();
    return found ? tupleFromJsonItem(found, script, category) : [null];
  }));
}

function buildKanaStateFromJson({ hiragana = [], katakana = [] }) {
  const createScriptState = (items, script) => ({
    seion: buildPatternGrid(items.filter((item) => item.kategori === "seion"), script, "seion"),
    dakuten: buildPatternGrid(items.filter((item) => item.kategori === "dakuten"), script, "dakuten"),
    handakuten: buildPatternGrid(items.filter((item) => item.kategori === "handakuten"), script, "handakuten"),
    yoon: items.filter((item) => item.kategori === "yoon").map((item) => tupleFromJsonItem(item, script, "yoon")),
    khusus: items.filter((item) => item.kategori === "khusus").map((item) => tupleFromJsonItem(item, script, "khusus"))
  });

  return {
    hiragana: createScriptState(hiragana, "hiragana"),
    katakana: createScriptState(katakana, "katakana")
  };
}

let kanaState = buildDefaultKanaState();

async function hydrateKanaData() {
  // hiragana.json & katakana.json belum tersedia — pakai hardcoded state langsung.
  // Jika file JSON kana tersedia di server, uncomment blok try-catch di bawah.
  kanaState = buildDefaultKanaState();

  /* -- uncomment jika hiragana.json & katakana.json sudah ada --
  try {
    const [hiraganaResponse, katakanaResponse] = await Promise.all([
      fetch("hiragana.json"),
      fetch("katakana.json")
    ]);
    if (!hiraganaResponse.ok || !katakanaResponse.ok) {
      throw new Error("Gagal memuat sumber JSON kana.");
    }
    const [hiraganaJson, katakanaJson] = await Promise.all([
      hiraganaResponse.json(),
      katakanaResponse.json()
    ]);
    kanaState = buildKanaStateFromJson({ hiragana: hiraganaJson, katakana: katakanaJson });
  } catch (error) {
    console.warn("Memakai fallback data kana lokal.", error);
    kanaState = buildDefaultKanaState();
  }
  -- */
}

function normalizeKanaItem(item) {
  if (!item || item[0] === null) return null;
  return {
    kana: item[0],
    romaji: item[1],
    rowClass: item[2] || getRowClass(item[1]),
    script: item[3] || "",
    category: item[4] || "seion"
  };
}

function renderKanaGrid(elementId, dataArray) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = dataArray.map((item) => {
    const normalized = normalizeKanaItem(item);
    if (!normalized) {
      return '<div class="kana-card empty" aria-hidden="true"></div>';
    }

    return `
      <button class="kana-card ${normalized.rowClass} script-${normalized.script}" type="button" data-kana="${normalized.kana}" data-romaji="${normalized.romaji}" data-script="${normalized.script}" data-category="${normalized.category}">
        <span class="h-jp">${normalized.kana}</span>
        <span class="h-romaji">${normalized.romaji}</span>
      </button>
    `;
  }).join("");
}

function renderAllKana() {
  renderKanaGrid("grid-h-seion", kanaState.hiragana.seion);
  renderKanaGrid("grid-h-dakuten", kanaState.hiragana.dakuten);
  renderKanaGrid("grid-h-handakuten", kanaState.hiragana.handakuten);
  renderKanaGrid("grid-k-seion", kanaState.katakana.seion);
  renderKanaGrid("grid-k-dakuten", kanaState.katakana.dakuten);
  renderKanaGrid("grid-k-handakuten", kanaState.katakana.handakuten);
  renderKanaGrid("grid-yoon", kanaState.katakana.yoon);
  renderKanaGrid("grid-khusus", kanaState.katakana.khusus);
}

function renderPartikelCards(elementId, dataArray) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = dataArray.map((item) => `
    <article class="partikel-card">
      <h3 class="p-huruf">${item[0]}</h3>
      <p class="p-desc">${item[1]}<br><em>Contoh: ${item[2]}</em></p>
    </article>
  `).join("");
}

function renderTable(elementId, headers, dataArray) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = `
    <thead>
      <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${dataArray.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
    </tbody>
  `;
}

const tabButtons = [...new Set([...document.querySelectorAll(".tab-btn[data-tab]")])];
const sectionIds = ["hiragana", "partikel", "katakana", "sketch", "kosakata"];

function activateTab(tabName) {
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.classList.toggle("active", id === tabName);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  // Mencegah screen jumpiness tak menentu
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (tabName === "sketch") {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  }
}

window.openTab = function openTab(tabName) {
  activateTab(tabName);
};

const vocabSearch = document.getElementById("vocabSearch");
const wadahKosaKata = document.getElementById("wadah-kosa-kata");
const vocabCount = document.getElementById("vocabCount");
const vocabEmpty = document.getElementById("vocabEmpty");
const loadMoreVocab = document.getElementById("loadMoreVocab");
const levelTabs = [...document.querySelectorAll(".level-tab")];
const filterOptions = [...document.querySelectorAll(".filter-option")];

const vocabSources = {
  n5: [],
  n4: [],
  n3: []
};

let currentLevel = "n5";
let currentData = vocabSources[currentLevel];
let filterAktif = "semua";
let filteredData = [];
let visibleCount = 24;

async function hydrateVocabData() {
  try {
    const [n5Response, n4Response, n3Response] = await Promise.all([
      fetch("n5.json"),
      fetch("n4.json"),
      fetch("n3.json")
    ]);

    if (!n5Response.ok || !n4Response.ok || !n3Response.ok) {
      throw new Error("Gagal memuat file kosakata JSON.");
    }

    const [n5Data, n4Data, n3Data] = await Promise.all([
      n5Response.json(),
      n4Response.json(),
      n3Response.json()
    ]);

    vocabSources.n5 = Array.isArray(n5Data) ? n5Data : [];
    vocabSources.n4 = Array.isArray(n4Data) ? n4Data : [];
    vocabSources.n3 = Array.isArray(n3Data) ? n3Data : [];
    currentData = vocabSources[currentLevel] || [];
  } catch (error) {
    console.warn("Memakai data kosakata fallback offline.", error);
    vocabSources.n5 = fallbackVocabData.filter(x => x.level === "n5");
    vocabSources.n4 = fallbackVocabData.filter(x => x.level === "n4");
    vocabSources.n3 = fallbackVocabData.filter(x => x.level === "n3");
    currentData = vocabSources[currentLevel] || [];
  }
}

function formatTypeLabel(type) {
  if (!type) return "umum";
  return type.replaceAll("_", " ");
}

function applyVocabFilters() {
  const query = (vocabSearch?.value || "").trim().toLowerCase();
  const activeSource = currentData && currentData.length ? currentData : fallbackVocabData.filter(x => x.level === currentLevel);

  filteredData = activeSource.filter((item) => {
    const rawType = (item.tipe || "").toLowerCase();
    const typeChunks = rawType.split(/\s+/).filter(Boolean);
    const matchType = filterAktif === "semua" || typeChunks.includes(filterAktif);
    const matchQuery = !query || [item.kana, item.romaji, item.arti, rawType].some((value) =>
      (value || "").toLowerCase().includes(query)
    );
    return matchType && matchQuery;
  });

  visibleCount = 24;
  renderVisibleVocab();
}

function renderVisibleVocab() {
  if (!wadahKosaKata) return;

  const visibleItems = filteredData.slice(0, visibleCount);
  wadahKosaKata.innerHTML = visibleItems.map((item) => `
    <article class="vocab-card">
      <span class="vocab-level">${item.level.toUpperCase()}</span>
      <div class="vocab-kana">${item.kana}</div>
      <div class="vocab-romaji">${item.romaji}</div>
      <div class="vocab-arti">${item.arti}</div>
      <div class="vocab-type">${formatTypeLabel(item.tipe)}</div>
    </article>
  `).join("");

  const total = filteredData.length;
  const shown = Math.min(visibleCount, total);
  if (vocabCount) {
    vocabCount.textContent = total ? `Menampilkan ${shown} dari ${total} kata` : "Menampilkan 0 kata";
  }

  if (vocabEmpty) {
    vocabEmpty.hidden = total !== 0;
  }

  if (loadMoreVocab) {
    loadMoreVocab.hidden = shown >= total || total === 0;
  }
}

function showToast(message) {
  const toast = document.getElementById("selectionToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1400);
}

function setupKanaInteractions() {
  document.querySelectorAll(".kana-card:not(.empty)").forEach((card) => {
    card.addEventListener("click", () => {
      // Buka Focus Mode jika tersedia
      if (window.kanaFocusMode) {
        window.kanaFocusMode.open(card.dataset.kana, card.dataset.romaji);
      } else {
        // Fallback: efek aktif + toast seperti sebelumnya
        card.classList.add("active");
        setTimeout(() => card.classList.remove("active"), 240);
        showToast(`${card.dataset.kana} • ${card.dataset.romaji}`);
      }
    });
  });
}

function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });

  document.querySelectorAll("[data-tab-jump]").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tabJump));
  });
}

function setupCapsuleMenuSwipe() {
  const capsuleMenus = [...document.querySelectorAll(".mobile-dock, .section-nav")];
  if (capsuleMenus.length === 0) return;

  const orderedTabs = sectionIds.filter((tabName) =>
    tabButtons.some((button) => button.dataset.tab === tabName)
  );

  function getActiveTabName() {
    const activeButton = tabButtons.find((button) => button.classList.contains("active"));
    return activeButton?.dataset.tab || orderedTabs[0] || null;
  }

  function moveToSiblingTab(direction) {
    const currentTab = getActiveTabName();
    const currentIndex = orderedTabs.indexOf(currentTab);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= orderedTabs.length) return;

    activateTab(orderedTabs[nextIndex]);
  }

  capsuleMenus.forEach((menu) => {
    const isMobileDock = menu.classList.contains("mobile-dock");
    const swipeState = {
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      startTime: 0,
      tracking: false,
      lockedAxis: "",
      triggered: false,
      pointerId: null
    };

    function applyOffset(offset) {
      if (isMobileDock) {
        menu.style.transform = `translateX(calc(-50% + ${offset}px))`;
      } else {
        menu.style.transform = `translateX(${offset}px)`;
      }
    }

    function clearOffset() {
      menu.style.transform = isMobileDock ? "translateX(-50%)" : "";
    }

    function resetSwipeState() {
      swipeState.startX = 0;
      swipeState.startY = 0;
      swipeState.deltaX = 0;
      swipeState.deltaY = 0;
      swipeState.startTime = 0;
      swipeState.tracking = false;
      swipeState.lockedAxis = "";
      swipeState.triggered = false;
      swipeState.pointerId = null;
      menu.classList.remove("is-swipe-dragging", "is-swipe-animating");
      clearOffset();
    }

    function startSwipe(clientX, clientY, pointerId = null) {
      swipeState.startX = clientX;
      swipeState.startY = clientY;
      swipeState.deltaX = 0;
      swipeState.deltaY = 0;
      swipeState.startTime = Date.now();
      swipeState.tracking = true;
      swipeState.lockedAxis = "";
      swipeState.triggered = false;
      swipeState.pointerId = pointerId;
      menu.classList.remove("is-swipe-animating");
      menu.classList.add("is-swipe-dragging");
    }

    function updateSwipe(clientX, clientY) {
      if (!swipeState.tracking) return;

      swipeState.deltaX = clientX - swipeState.startX;
      swipeState.deltaY = clientY - swipeState.startY;

      if (!swipeState.lockedAxis) {
        const absX = Math.abs(swipeState.deltaX);
        const absY = Math.abs(swipeState.deltaY);

        if (absX < 8 && absY < 8) return;
        swipeState.lockedAxis = absX > absY ? "x" : "y";
      }

      if (swipeState.lockedAxis !== "x") return;

      const offset = Math.max(-18, Math.min(18, swipeState.deltaX * 0.14));
      applyOffset(offset);
    }

    function endSwipe() {
      if (!swipeState.tracking) {
        resetSwipeState();
        return;
      }

      const absX = Math.abs(swipeState.deltaX);
      const absY = Math.abs(swipeState.deltaY);
      const duration = Date.now() - swipeState.startTime;
      const isHorizontalSwipe = swipeState.lockedAxis === "x" && absX > absY && absX >= 42 && duration <= 700;

      menu.classList.remove("is-swipe-dragging");
      menu.classList.add("is-swipe-animating");
      clearOffset();

      if (isHorizontalSwipe && !swipeState.triggered) {
        swipeState.triggered = true;
        if (swipeState.deltaX < 0) {
          moveToSiblingTab(1);
        } else {
          moveToSiblingTab(-1);
        }
      }

      window.setTimeout(() => {
        menu.classList.remove("is-swipe-animating");
        clearOffset();
      }, 240);

      swipeState.startX = 0;
      swipeState.startY = 0;
      swipeState.deltaX = 0;
      swipeState.deltaY = 0;
      swipeState.startTime = 0;
      swipeState.tracking = false;
      swipeState.lockedAxis = "";
      swipeState.triggered = false;
      swipeState.pointerId = null;
    }

    menu.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      startSwipe(touch.clientX, touch.clientY);
    }, { passive: true });

    menu.addEventListener("touchmove", (event) => {
      if (!swipeState.tracking || event.touches.length !== 1) return;
      const touch = event.touches[0];
      updateSwipe(touch.clientX, touch.clientY);
    }, { passive: true });

    menu.addEventListener("touchend", endSwipe, { passive: true });
    menu.addEventListener("touchcancel", resetSwipeState, { passive: true });

    menu.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      startSwipe(event.clientX, event.clientY, event.pointerId);
    });

    menu.addEventListener("pointermove", (event) => {
      if (!swipeState.tracking) return;
      if (swipeState.pointerId !== null && event.pointerId !== swipeState.pointerId) return;
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      updateSwipe(event.clientX, event.clientY);
    });

    menu.addEventListener("pointerup", (event) => {
      if (swipeState.pointerId !== null && event.pointerId !== swipeState.pointerId) return;
      endSwipe();
    });

    menu.addEventListener("pointercancel", resetSwipeState);
    menu.addEventListener("pointerleave", () => {
      if (swipeState.lockedAxis === "x") {
        endSwipe();
      }
    });
  });
}

function setupVocabControls() {
  levelTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentLevel = tab.dataset.level;
      currentData = vocabSources[currentLevel];
      levelTabs.forEach((item) => item.classList.toggle("active", item === tab));
      applyVocabFilters();
    });
  });

  filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
      filterAktif = option.dataset.tipe;
      filterOptions.forEach((item) => item.classList.toggle("active", item === option));
      document.getElementById("filter-menu")?.classList.remove("muncul");
      applyVocabFilters();
    });
  });

  vocabSearch?.addEventListener("input", applyVocabFilters);

  document.getElementById("clearSearch")?.addEventListener("click", () => {
    if (vocabSearch) vocabSearch.value = "";
    applyVocabFilters();
  });

  loadMoreVocab?.addEventListener("click", () => {
    visibleCount += 24;
    renderVisibleVocab();
  });

  document.getElementById("btn-filter")?.addEventListener("click", (event) => {
    event.stopPropagation();
    document.getElementById("filter-menu")?.classList.toggle("muncul");
  });

  document.addEventListener("click", (event) => {
    const menu = document.getElementById("filter-menu");
    const button = document.getElementById("btn-filter");
    if (!menu || !button) return;
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      menu.classList.remove("muncul");
    }
  });
}

function setupBackToTop() {
  const button = document.getElementById("btnBackToTop");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("muncul", window.scrollY > 360);
  }, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupFocusMode() {
  const btnFocus = document.getElementById("btn-focus");
  if (!btnFocus) return;

  btnFocus.addEventListener("click", () => {
    const active = document.body.classList.toggle("focus-mode-active");
    btnFocus.classList.toggle("is-active", active);
  });
}

function setupHeaderMenu() {
  const btn = document.getElementById("navBtn");
  const menu = document.getElementById("navMenu");
  const header = document.querySelector(".main-header");

  if (!btn || !menu || !header) return;

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextState = !menu.classList.contains("show");
    btn.classList.toggle("is-active", nextState);
    btn.setAttribute("aria-expanded", String(nextState));
    menu.classList.toggle("show", nextState);
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !btn.contains(event.target)) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("show");
    }
  });

  // Disederhanakan untuk menghindari jitter/efek kedut-kedut saat di-scroll cepat
  let lastScroll = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!header || header.getAttribute("data-siluman") === "false") return;
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 150) {
        // Scroll ke bawah: sembunyikan menu drop-down saja demi kenyamanan baca
        menu.classList.remove("show");
        btn.classList.remove("is-active");
        btn.setAttribute("aria-expanded", "false");
      }
      lastScroll = currentScroll;
      ticking = false;
    });

    ticking = true;
  }, { passive: true });
}

function initQuiz() {
  const modal = document.getElementById("modalKuis");
  const tempatJawaban = document.getElementById("tempatJawaban");
  const tempatHuruf = document.getElementById("tempatHurufAcak");
  const kuisArti = document.getElementById("kuisArti");
  const kuisLevel = document.getElementById("kuisLevel");
  const pesanKuis = document.getElementById("pesanKuis");
  const kuisHint = document.getElementById("kuisHint");
  const btnReroll = document.getElementById("btnRerollKuis");
  const btnTutup = document.getElementById("btnTutupKuis");

  if (!modal || !tempatJawaban || !tempatHuruf || !kuisArti || !kuisLevel || !pesanKuis || !kuisHint || !btnReroll || !btnTutup) {
    return;
  }

  const openers = [document.getElementById("heroQuizBtn"), document.getElementById("heroQuizGhostBtn")].filter(Boolean);

  function openQuiz() {
    const sourcePool = [...vocabSources.n5, ...vocabSources.n4, ...vocabSources.n3];
    const pool = (sourcePool.length ? sourcePool : fallbackVocabData).filter((item) => {
      return item.romaji && !item.romaji.includes(" ") && !item.romaji.includes("/");
    });

    if (pool.length === 0) {
      pesanKuis.textContent = "Data kuis belum siap.";
      pesanKuis.className = "pesan-kuis salah";
      modal.classList.add("muncul");
      modal.setAttribute("aria-hidden", "false");
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    const romaji = picked.romaji.toLowerCase();
    const kana = picked.kana.split(" ")[0];
    const slots = Array.from({ length: romaji.length }, () => null);
    const letters = romaji.split("").map((char, index) => ({
      id: `${index}-${char}`,
      char,
      locked: false
    })).sort(() => Math.random() - 0.5);

    let hints = romaji.length <= 5 ? 2 : 3;
    hints = Math.min(hints, Math.max(romaji.length - 1, 1));

    kuisArti.textContent = picked.arti;
    kuisLevel.textContent = picked.level.toUpperCase();
    pesanKuis.textContent = "";
    pesanKuis.className = "pesan-kuis";
    modal.classList.add("muncul");
    modal.setAttribute("aria-hidden", "false");

    function syncHintLabel() {
      const spanHint = kuisHint.querySelector("span");
      const label = hints > 0 ? `Hint ${hints}x \u2022 ${kana}` : `Hint habis \u2022 ${kana}`;
      if (spanHint) {
        spanHint.textContent = label;
      } else {
        kuisHint.textContent = label;
      }
      kuisHint.disabled = hints === 0;
      kuisHint.style.opacity = hints === 0 ? "0.5" : "1";
    }

    function render() {
      tempatJawaban.innerHTML = "";
      tempatHuruf.innerHTML = "";

      slots.forEach((item, index) => {
        const slot = document.createElement("button");
        slot.type = "button";
        slot.className = `slot-chip${item ? " filled" : ""}${item?.locked ? " locked" : ""}`;
        slot.textContent = item ? item.char : "";

        if (item && !item.locked) {
          slot.addEventListener("click", () => {
            slots[index] = null;
            pesanKuis.textContent = "";
            render();
          });
        } else {
          slot.disabled = true;
        }

        tempatJawaban.appendChild(slot);
      });

      letters.forEach((item) => {
        const used = slots.some((slot) => slot?.id === item.id);
        if (used) return;

        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "huruf-chip";
        chip.textContent = item.char;
        chip.addEventListener("click", () => {
          const emptyIndex = slots.findIndex((slot) => slot === null);
          if (emptyIndex === -1) return;
          slots[emptyIndex] = item;
          pesanKuis.textContent = "";
          render();
          validate();
        });
        tempatHuruf.appendChild(chip);
      });

      syncHintLabel();
    }

    function validate() {
      if (slots.some((slot) => slot === null)) return;
      const answer = slots.map((slot) => slot.char).join("");

      if (answer === romaji) {
        pesanKuis.textContent = "Benar. Mantap.";
        pesanKuis.className = "pesan-kuis benar";
        setTimeout(closeQuiz, 1200);
        return;
      }

      pesanKuis.textContent = "Masih belum pas, coba lagi.";
      pesanKuis.className = "pesan-kuis salah";
    }

    function useHint() {
      if (hints <= 0) return;
      const openIndexes = slots.map((slot, index) => slot?.locked ? null : index).filter((value) => value !== null);
      const targetIndex = openIndexes.find((index) => !slots[index] || slots[index].char !== romaji[index]);
      if (targetIndex === undefined) return;

      const matching = letters.find((item) => item.char === romaji[targetIndex] && !slots.some((slot) => slot?.id === item.id));
      if (!matching) return;

      matching.locked = true;
      slots[targetIndex] = matching;
      hints -= 1;
      render();
      validate();
    }

    kuisHint.onclick = useHint;
    btnReroll.onclick = openQuiz;
    btnTutup.onclick = closeQuiz;
    render();
  }

  function closeQuiz() {
    modal.classList.remove("muncul");
    modal.setAttribute("aria-hidden", "true");
  }

  openers.forEach((button) => button.addEventListener("click", openQuiz));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeQuiz();
  });
}

function initSketch() {
  const canvas = document.getElementById("sketchCanvas");
  const brushSize = document.getElementById("brushSize");
  const clearBtn = document.getElementById("clearSketch");
  const undoBtn = document.getElementById("undoSketch");
  const nextBtn = document.getElementById("nextKana");
  const exportBtn = document.getElementById("saveSketchJson");
  const targetKana = document.getElementById("sketchTargetKana");
  const targetRomaji = document.getElementById("sketchTargetRomaji");
  const targetMeta = document.getElementById("sketchTargetMeta");
  const output = document.getElementById("sketchJsonOutput");
  const categorySelect = document.getElementById("sketchCategory");
  const scriptTabs = [...document.querySelectorAll(".sketch-script-tab")];
  const helperGuideBtn = document.getElementById("helperGuideBtn");

  if (!canvas || !brushSize || !clearBtn || !undoBtn || !nextBtn || !exportBtn || !targetKana || !targetRomaji || !targetMeta || !output || !categorySelect || scriptTabs.length === 0 || !helperGuideBtn) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const sketchLibrary = new Map();
  let showGuideLayer = false; // Status bayangan bantuan

  const sketchState = {
    script: "hiragana",
    category: "all",
    currentIndex: 0,
    currentStroke: null,
    strokes: [],
    drawing: false,
    dpr: 1,
    canvasWidth: 0,
    canvasHeight: 0
  };

  function restoreLibrary() {
    try {
      const raw = JSON.parse(localStorage.getItem("studio-kana-sketch-v1") || "{}");
      Object.entries(raw).forEach(([key, value]) => sketchLibrary.set(key, value));
    } catch (error) {
      console.warn("Gagal membaca simpanan sketch lama.", error);
    }
  }

  function persistLibrary() {
    try {
      localStorage.setItem("studio-kana-sketch-v1", JSON.stringify(Object.fromEntries(sketchLibrary)));
    } catch (error) {
      console.warn("Gagal menyimpan sketch.", error);
    }
  }

  function flattenSketchItems() {
    const source = kanaState[sketchState.script] || {};
    const categories = sketchState.category === "all"
      ? ["seion", "dakuten", "handakuten", "yoon", "khusus"]
      : [sketchState.category];

    return categories.flatMap((category) => {
      return (source[category] || []).map((item) => {
        const normalized = normalizeKanaItem(item);
        if (!normalized) return null;
        return {
          kana: normalized.kana,
          romaji: normalized.romaji,
          category,
          script: normalized.script || sketchState.script
        };
      });
    }).filter(Boolean);
  }

  function getCurrentItem() {
    const items = flattenSketchItems();
    if (items.length === 0) return null;
    if (sketchState.currentIndex >= items.length) sketchState.currentIndex = 0;
    return items[sketchState.currentIndex];
  }

  function getSketchKey(item) {
    return `${item.script}:${item.category}:${item.kana}`;
  }

  function buildSketchPayload(item) {
    return {
      script: item.script,
      category: item.category,
      kana: item.kana,
      romaji: item.romaji,
      brushSize: Number(brushSize.value),
      strokes: sketchState.strokes
    };
  }

  function resetContext() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(sketchState.dpr, 0, 0, sketchState.dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#121722";
    ctx.lineWidth = Number(brushSize.value);
  }

  function drawStroke(stroke) {
    if (!ctx || !Array.isArray(stroke) || stroke.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    stroke.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    if (stroke.length === 1) {
      ctx.lineTo(stroke[0].x + 0.01, stroke[0].y + 0.01);
    }
    ctx.stroke();
  }

  function redrawSketch() {
    resetContext();

    // Gambar bayangan bayangan panduan di tengah grid jika diaktifkan
    if (showGuideLayer) {
      const activeItem = getCurrentItem();
      if (activeItem) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(18, 23, 34, 0.08)"; // Bayangan transparan abu-abu lembut
        
        // Font adaptif dihitung berdasar tinggi kanvas
        const fontSize = Math.min(sketchState.canvasWidth, sketchState.canvasHeight) * 0.6;
        ctx.font = `bold ${fontSize}px "Noto Serif JP", "Noto Sans JP", sans-serif`;
        
        // Digambar tepat di tengah-tengah kanvas
        ctx.fillText(activeItem.kana, sketchState.canvasWidth / 2, sketchState.canvasHeight / 2);
        ctx.restore();
      }
    }

    sketchState.strokes.forEach(drawStroke);
  }

  function updateSketchOutput() {
    const item = getCurrentItem();
    if (!item) return;
    output.textContent = JSON.stringify(buildSketchPayload(item), null, 2);
  }

  function syncSketchMemory() {
    const item = getCurrentItem();
    if (!item) return;
    sketchLibrary.set(getSketchKey(item), JSON.parse(JSON.stringify(buildSketchPayload(item))));
    persistLibrary();
    updateSketchOutput();
  }

  function loadSketchForCurrentItem() {
    const item = getCurrentItem();
    if (!item) return;
    const saved = sketchLibrary.get(getSketchKey(item));
    sketchState.strokes = saved?.strokes ? JSON.parse(JSON.stringify(saved.strokes)) : [];
    targetKana.textContent = item.kana;
    targetRomaji.textContent = item.romaji;
    targetMeta.textContent = `${item.script[0].toUpperCase()}${item.script.slice(1)} • ${item.category}`;
    redrawSketch();
    updateSketchOutput();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    sketchState.dpr = dpr;
    sketchState.canvasWidth = rect.width || 720;
    sketchState.canvasHeight = rect.height || 520;
    canvas.width = Math.max(1, Math.round(sketchState.canvasWidth * dpr));
    canvas.height = Math.max(1, Math.round(sketchState.canvasHeight * dpr));
    redrawSketch();
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    return {
      x: Number((clientX - rect.left).toFixed(2)),
      y: Number((clientY - rect.top).toFixed(2)),
      t: Date.now()
    };
  }

  function startStroke(event) {
    event.preventDefault();
    sketchState.drawing = true;
    sketchState.currentStroke = [getPoint(event)];
    canvas.setPointerCapture?.(event.pointerId);
    redrawSketch();
  }

  function moveStroke(event) {
    if (!sketchState.drawing || !sketchState.currentStroke || !ctx) return;
    const point = getPoint(event);
    const lastPoint = sketchState.currentStroke[sketchState.currentStroke.length - 1];
    sketchState.currentStroke.push(point);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function endStroke(event) {
    if (!sketchState.drawing || !sketchState.currentStroke) return;
    if (sketchState.currentStroke.length === 1) {
      sketchState.currentStroke.push({ ...sketchState.currentStroke[0] });
    }
    sketchState.strokes.push(sketchState.currentStroke);
    sketchState.currentStroke = null;
    sketchState.drawing = false;
    canvas.releasePointerCapture?.(event.pointerId);
    syncSketchMemory();
    redrawSketch();
  }

  clearBtn.addEventListener("click", () => {
    sketchState.strokes = [];
    redrawSketch();
    syncSketchMemory();
  });

  undoBtn.addEventListener("click", () => {
    sketchState.strokes.pop();
    redrawSketch();
    syncSketchMemory();
  });

  nextBtn.addEventListener("click", () => {
    const items = flattenSketchItems();
    if (items.length === 0) return;
    sketchState.currentIndex = (sketchState.currentIndex + 1) % items.length;
    loadSketchForCurrentItem();
  });

  // Tombol Bantuan (Tampilkan guide layer bayangan abu-abu di tengah canvas)
  helperGuideBtn.addEventListener("click", () => {
    showGuideLayer = !showGuideLayer;
    helperGuideBtn.classList.toggle("active", showGuideLayer);
    redrawSketch();
  });

  exportBtn.addEventListener("click", () => {
    const item = getCurrentItem();
    if (!item) return;
    const payload = JSON.stringify(buildSketchPayload(item), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sketch-${item.script}-${item.kana}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`JSON ${item.kana} siap diunduh`);
  });

  brushSize.addEventListener("input", () => {
    redrawSketch();
    updateSketchOutput();
  });

  categorySelect.addEventListener("change", () => {
    sketchState.category = categorySelect.value;
    sketchState.currentIndex = 0;
    loadSketchForCurrentItem();
  });

  scriptTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sketchState.script = tab.dataset.sketchScript;
      sketchState.currentIndex = 0;
      scriptTabs.forEach((item) => item.classList.toggle("active", item === tab));
      loadSketchForCurrentItem();
    });
  });

  // Kompatibilitas Pointer Event untuk menggambar di desktop & touch screen
  canvas.addEventListener("pointerdown", startStroke);
  canvas.addEventListener("pointermove", moveStroke);
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointerleave", endStroke);
  canvas.addEventListener("pointercancel", endStroke);
  window.addEventListener("resize", resizeCanvas, { passive: true });

  restoreLibrary();
  resizeCanvas();
  loadSketchForCurrentItem();
}

document.addEventListener("DOMContentLoaded", async () => {
  await hydrateKanaData();
  await hydrateVocabData();
  renderAllKana();

  renderPartikelCards("container-partikel", dataPartikel);
  renderTable("tbl-hubung", ["Kosakata", "Romaji", "Fungsi / Arti"], dataHubung);
  renderTable("tbl-waktu", ["Kosakata", "Romaji", "Arti"], dataWaktu);
  renderTable("tbl-frekuensi", ["Kosakata", "Romaji", "Arti / Keterangan"], dataFrekuensi);
  renderTable("tbl-bulan", ["Kosakata", "Romaji", "Arti"], namaBulan);
  renderTable("tbl-warna", ["Warna", "Jepang / Romaji", "Bentuk"], dataWarna);
  renderTable("tbl-ungkapan", ["Ungkapan", "Romaji", "Arti / Situasi"], dataUngkapan);

  setupKanaInteractions();
  setupTabs();
  setupCapsuleMenuSwipe();
  setupHeaderMenu();
  setupVocabControls();
  setupBackToTop();
  setupFocusMode();
  initQuiz();
  initSketch();
  applyVocabFilters();
});
