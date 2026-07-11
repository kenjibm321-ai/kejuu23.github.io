// ==========================================
// 🧠 DATABASE PREMIUM (20 KASUS TERSTRUKTUR)
// ==========================================
const dbSatzbau = [
    { id: 1, caseGroup: "Nominativ", mission: "Buku itu menarik.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"adj", label:"Adj"}], words: [{text:"Das Buch", type:"nom"}, {text:"ist", type:"verb"}, {text:"interessant", type:"adj"}, {text:"Dem Buch", type:"dat"}], note: "Nominativ: 'Das Buch' adalah subjek utama kalimat." },
    { id: 2, caseGroup: "Nominativ", mission: "Pria itu adalah guru.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"nom", label:"Nom"}], words: [{text:"Der Mann", type:"nom"}, {text:"ist", type:"verb"}, {text:"ein Lehrer", type:"nom"}, {text:"den Mann", type:"akk"}], note: "Nominativ: Setelah kata kerja 'sein' (ist), kata benda tetap dalam bentuk Nominativ." },
    { id: 3, caseGroup: "Nominativ", mission: "Wanita itu membaca.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}], words: [{text:"Die Frau", type:"nom"}, {text:"liest", type:"verb"}, {text:"Der Frau", type:"dat"}], note: "Nominativ: 'Die Frau' bertindak sebagai pelaku aksi (Subjek)." },
    { id: 4, caseGroup: "Nominativ", mission: "Anak itu bermain.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}], words: [{text:"Das Kind", type:"nom"}, {text:"spielt", type:"verb"}, {text:"Dem Kind", type:"dat"}], note: "Nominativ: 'Das Kind' adalah subjek (Netral)." },
    { id: 5, caseGroup: "Nominativ", mission: "Anjing itu menggonggong.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}], words: [{text:"Der Hund", type:"nom"}, {text:"bellt", type:"verb"}, {text:"Den Hund", type:"akk"}], note: "Nominativ: Subjek maskulin menggunakan 'Der'." },

    { id: 6, caseGroup: "Akkusativ", mission: "Aku punya sebuah mobil.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"akk", label:"Akk"}], words: [{text:"Ich", type:"nom"}, {text:"habe", type:"verb"}, {text:"ein Auto", type:"akk"}, {text:"einem Auto", type:"dat"}], note: "Akkusativ: 'haben' selalu butuh objek Akkusativ." },
    { id: 7, caseGroup: "Akkusativ", mission: "Pria itu melihat anjing itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"akk", label:"Akk"}], words: [{text:"Der Mann", type:"nom"}, {text:"sieht", type:"verb"}, {text:"den Hund", type:"akk"}, {text:"der Hund", type:"nom"}], note: "Akkusativ: Maskulin berubah! 'der Hund' menjadi 'den Hund'." },
    { id: 8, caseGroup: "Akkusativ", mission: "Dia minum teh.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"akk", label:"Akk"}], words: [{text:"Sie", type:"nom"}, {text:"trinkt", type:"verb"}, {text:"den Tee", type:"akk"}, {text:"der Tee", type:"nom"}], note: "Akkusativ: 'Tee' adalah maskulin, menjadi 'den Tee'." },
    { id: 9, caseGroup: "Akkusativ", mission: "Kami membeli meja itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"akk", label:"Akk"}], words: [{text:"Wir", type:"nom"}, {text:"kaufen", type:"verb"}, {text:"den Tisch", type:"akk"}, {text:"dem Tisch", type:"dat"}], note: "Akkusativ: Meja (der Tisch) dibeli, berubah jadi 'den Tisch'." },
    { id: 10, caseGroup: "Akkusativ", mission: "Kamu mencari kunci itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"akk", label:"Akk"}], words: [{text:"Du", type:"nom"}, {text:"suchst", type:"verb"}, {text:"den Schlüssel", type:"akk"}, {text:"der Schlüssel", type:"nom"}], note: "Akkusativ: Kata kerja 'suchen' + Akkusativ." },

    { id: 11, caseGroup: "Dativ", mission: "Aku membantu wanita itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"dat", label:"Dat"}], words: [{text:"Ich", type:"nom"}, {text:"helfe", type:"verb"}, {text:"der Frau", type:"dat"}, {text:"die Frau", type:"akk"}], note: "Dativ: 'helfen' memaksa objek menjadi Dativ ('der Frau')." },
    { id: 12, caseGroup: "Dativ", mission: "Buku itu milik anak itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"dat", label:"Dat"}], words: [{text:"Das Buch", type:"nom"}, {text:"gehört", type:"verb"}, {text:"dem Kind", type:"dat"}, {text:"das Kind", type:"nom"}], note: "Dativ: 'gehören' diikuti Dativ. 'das' menjadi 'dem'." },
    { id: 13, caseGroup: "Dativ", mission: "Dia berterima kasih padaku.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"dat", label:"Dat"}], words: [{text:"Er", type:"nom"}, {text:"dankt", type:"verb"}, {text:"mir", type:"dat"}, {text:"mich", type:"akk"}], note: "Dativ: 'danken' pakai Dativ. 'Ich' berubah menjadi 'mir'." },
    { id: 14, caseGroup: "Dativ", mission: "Mobil itu gefällt pria itu.", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"dat", label:"Dat"}], words: [{text:"Das Auto", type:"nom"}, {text:"gefällt", type:"verb"}, {text:"dem Mann", type:"dat"}, {text:"den Mann", type:"akk"}], note: "Dativ: 'gefallen' pakai Dativ. 'der' menjadi 'dem'." },
    { id: 15, caseGroup: "Dativ", mission: "Bagaimana kabarmu?", slots: [{type:"nom", label:"Nom"}, {type:"verb", label:"Verb"}, {type:"dat", label:"Dat"}], words: [{text:"Wie", type:"nom"}, {text:"geht es", type:"verb"}, {text:"dir", type:"dat"}, {text:"dich", type:"akk"}], note: "Dativ: Frasa 'Wie geht es...' selalu menanyakan kondisi (Dativ)." },

    { id: 16, caseGroup: "Genitiv", mission: "Mobil sang ayah berwarna merah.", slots: [{type:"nom", label:"Nom"}, {type:"gen", label:"Gen"}, {type:"verb", label:"Verb"}, {type:"adj", label:"Adj"}], words: [{text:"Das Auto", type:"nom"}, {text:"des Vaters", type:"gen"}, {text:"ist", type:"verb"}, {text:"rot", type:"adj"}, {text:"dem Vater", type:"dat"}], note: "Genitiv: Maskulin 'der Vater' menjadi 'des Vaters'." },
    { id: 17, caseGroup: "Genitiv", mission: "Tas wanita itu mahal.", slots: [{type:"nom", label:"Nom"}, {type:"gen", label:"Gen"}, {type:"verb", label:"Verb"}, {type:"adj", label:"Adj"}], words: [{text:"Die Tasche", type:"nom"}, {text:"der Frau", type:"gen"}, {text:"ist", type:"verb"}, {text:"teuer", type:"adj"}, {text:"die Frau", type:"nom"}], note: "Genitiv: Feminin 'die Frau' menjadi 'der Frau'." },
    { id: 18, caseGroup: "Genitiv", mission: "Selama ujian, dia tidur.", slots: [{type:"gen", label:"Gen (Prep)"}, {type:"gen", label:"Gen"}, {type:"verb", label:"Verb"}, {type:"nom", label:"Nom"}], words: [{text:"Während", type:"gen"}, {text:"der Prüfung", type:"gen"}, {text:"schläft", type:"verb"}, {text:"er", type:"nom"}, {text:"die Prüfung", type:"nom"}], note: "Genitiv: Preposisi 'während' mengharuskan Genitiv." },
    { id: 19, caseGroup: "Genitiv", mission: "Warna langit biru.", slots: [{type:"nom", label:"Nom"}, {type:"gen", label:"Gen"}, {type:"verb", label:"Verb"}, {type:"adj", label:"Adj"}], words: [{text:"Die Farbe", type:"nom"}, {text:"des Himmels", type:"gen"}, {text:"ist", type:"verb"}, {text:"blau", type:"adj"}, {text:"dem Himmel", type:"dat"}], note: "Genitiv: Maskulin 'der Himmel' + akhiran -s." },
    { id: 20, caseGroup: "Genitiv", mission: "Karena hujan, kami diam.", slots: [{type:"gen", label:"Gen (Prep)"}, {type:"gen", label:"Gen"}, {type:"verb", label:"Verb"}, {type:"nom", label:"Nom"}], words: [{text:"Wegen", type:"gen"}, {text:"des Regens", type:"gen"}, {text:"bleiben", type:"verb"}, {text:"wir", type:"nom"}], note: "Genitiv: Preposisi 'wegen' memakai Genitiv." }
];

let filledSlotsCount = 0;
let unlockedIds = loadUnlockedProgress(); 
let currentPlayingLevel = null;

const slotsContainer = document.getElementById('sentence-slots');
const bankContainer = document.getElementById('word-bank');
const missionText = document.getElementById('mission-text');

// 🚀 1. LOCAL STORAGE
function loadUnlockedProgress() {
    const saved = localStorage.getItem('kejuuDeutsh_BP_progress');
    return saved ? JSON.parse(saved) : [];
}
function saveProgress() {
    localStorage.setItem('kejuuDeutsh_BP_progress', JSON.stringify(unlockedIds));
}

// 🚀 2. TAB NAVIGATION LOGIC (Pakai Class Blueprint Mas)
function switchTab(tabId) {
    document.querySelectorAll('.focus-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.de-panel').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');

    if(tabId === 'museum') renderMuseum();
}

// 🚀 3. ARENA GAMEPLAY (Math.random 🎲)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadLevel() {
    const lockedItems = dbSatzbau.filter(item => !unlockedIds.includes(item.id));

    if(lockedItems.length === 0) {
        missionText.innerHTML = "<span style='color:#55efc4'>🎉 TAMAT! Cek Museum!</span>";
        slotsContainer.innerHTML = ''; bankContainer.innerHTML = '';
        return;
    }

    const randomIndex = Math.floor(Math.random() * lockedItems.length);
    currentPlayingLevel = lockedItems[randomIndex];
    
    missionText.innerText = currentPlayingLevel.mission;
    slotsContainer.innerHTML = ''; bankContainer.innerHTML = '';
    filledSlotsCount = 0;

    currentPlayingLevel.slots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = `slot-case slot-${slot.type}`;
        slotEl.dataset.type = slot.type;
        slotEl.innerText = `[ ${slot.label} ]`;
        slotsContainer.appendChild(slotEl);
    });

    let shuffledWords = [...currentPlayingLevel.words];
    shuffleArray(shuffledWords);

    shuffledWords.forEach(word => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.innerText = word.text;
        chip.dataset.type = word.type;

        chip.addEventListener('click', () => {
            const targetSlot = Array.from(slotsContainer.children).find(s => !s.classList.contains('filled') && s.dataset.type === chip.dataset.type);
            
            if (targetSlot) {
                chip.classList.add('hidden');
                targetSlot.innerText = chip.innerText;
                targetSlot.classList.add('filled');
                filledSlotsCount++;

                if(filledSlotsCount === currentPlayingLevel.slots.length) {
                    if(!unlockedIds.includes(currentPlayingLevel.id)) unlockedIds.push(currentPlayingLevel.id);
                    saveProgress(); 
                    setTimeout(() => { loadLevel(); }, 1000);
                }
            } else {
                chip.style.borderColor = '#ff7675';
                chip.style.transform = 'translateX(5px)';
                setTimeout(() => { chip.style.borderColor = '#718093'; chip.style.transform = 'translateY(0) scale(1)'; }, 200);
            }
        });
        bankContainer.appendChild(chip);
    });
}

// 🏛️ 4. MUSEUM ACCORDION PROGRESSIVE (Blueprint Style ↺)
function renderMuseum() {
    const accContainer = document.getElementById('accordion-container');
    accContainer.innerHTML = '';
    const cases = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];

    cases.forEach(caseName => {
        const caseItems = dbSatzbau.filter(item => item.caseGroup === caseName);
        const unlockedItemsForMuseum = caseItems.filter(item => unlockedIds.includes(item.id));

        const accItem = document.createElement('div');
        accItem.className = 'batch-item'; 
        accItem.style.flexDirection = 'column';
        accItem.style.alignItems = 'stretch';
        accItem.style.padding = '0';

        // MISTERI TERPECAHKAN: Kuli coder masukin <div class="card-grid"> di sini! 🛠️
        accItem.innerHTML = `
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <h3>📘 ${caseName}</h3>
                <span class="status">[ ${unlockedItemsForMuseum.length} / ${caseItems.length} ]</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-body">
                    <div class="card-grid">
                        ${unlockedItemsForMuseum.length === 0 ? '<p style="color:#718093; font-style:italic; grid-column: 1/-1; text-align: center;">Kosong. Mainkan Arena Latihan!</p>' : ''}
                    </div>
                </div>
            </div>
        `;

        // Targetin .card-grid yang bener!
        const grid = accItem.querySelector('.card-grid');
        
        unlockedItemsForMuseum.forEach(item => {
            const fullSentence = item.words.filter(w => item.slots.some(s => s.type === w.type)).map(w => w.text).join(' ');
            const card = document.createElement('div');
            card.className = 'flip-card';
            
            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <h4>${fullSentence}</h4>
                        <p class="translate">${item.mission.split(' (')[0]}</p>
                        <span class="flip-hint">[ TAP TO FLIP ↺ ]</span>
                    </div>
                    <div class="flip-card-back">
                        <h5>NOTES</h5>
                        <p class="notes-text">${item.note}</p>
                        <span class="flip-hint">[ TAP TO FLIP ↺ ]</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => card.classList.toggle('is-flipped'));
            grid.appendChild(card);
        });
        accContainer.appendChild(accItem);
    });
}
// ==========================================
// 🛠️ FUNGSI ACCORDION YANG KEPOTONG
// ==========================================
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const allContents = document.querySelectorAll('.accordion-content');
    
    // Tutup laci yang lain pas satu dibuka biar rapi
    allContents.forEach(c => { 
        if(c !== content) c.classList.remove('open'); 
    });
    
    // Buka/tutup laci yang lagi diklik
    content.classList.toggle('open');
}

// ==========================================
// 🚀 STARTER MESIN GAME (WAJIB ADA)
// ==========================================
// Nyalain mesin Satzbau pertama kali pas web dibuka!
loadLevel();
