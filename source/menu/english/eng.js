// =========================================================================
// ENGINE search,filter,tenses
// =========================================================================

// data tenses
const materiTensesData = [
    { id: 1, name: "Simple Present Tense", rumus: "S + V1 (s/es)", fungsi: "Untuk fakta umum, kebiasaan, atau rutinitas.", contoh: "He plays game every day. (Dia bermain game setiap hari)", warna: "#00c6ff" },
    { id: 2, name: "Present Continuous", rumus: "S + am/is/are + V-ing", fungsi: "Kejadian yang sedang berlangsung DETIK INI JUGA.", contoh: "I am eating a burger now. (Saya sedang makan burger sekarang)", warna: "#00c6ff" },
    { id: 3, name: "Present Perfect", rumus: "S + have/has + V3", fungsi: "Kejadian yang SUDAH selesai, tapi efeknya masih terasa.", contoh: "She has finished her homework. (Dia sudah menyelesaikan PR)", warna: "#00c6ff" },
    { id: 4, name: "Present Perfect Continuous", rumus: "S + have/has + been + V-ing", fungsi: "Dimulai di masa lalu dan MASIH berlangsung sekarang.", contoh: "It has been raining for two hours.", warna: "#00c6ff" },
    { id: 5, name: "Simple Past Tense", rumus: "S + V2", fungsi: "Kejadian yang terjadi dan SELESAI di masa lalu.", contoh: "I went to Tokyo last year.", warna: "#1e90ff" },
    { id: 6, name: "Past Continuous", rumus: "S + was/were + V-ing", fungsi: "Kejadian yang SEDANG berlangsung di waktu spesifik di masa lalu.", contoh: "I was sleeping when you called.", warna: "#1e90ff" },
    { id: 7, name: "Past Perfect", rumus: "S + had + V3", fungsi: "SUDAH SELESAI sebelum kejadian lain terjadi di masa lalu.", contoh: "The train had left when I arrived.", warna: "#1e90ff" },
    { id: 8, name: "Past Perfect Continuous", rumus: "S + had + been + V-ing", fungsi: "Berlangsung beberapa waktu di masa lalu, lalu dipotong kejadian lain.", contoh: "He had been working for 10 hours before he collapsed.", warna: "#1e90ff" },
    { id: 9, name: "Simple Future Tense", rumus: "S + will + V1", fungsi: "Rencana, prediksi, atau keputusan spontan di masa depan.", contoh: "I will call you tomorrow.", warna: "#ff9f43" },
    { id: 10, name: "Future Continuous", rumus: "S + will + be + V-ing", fungsi: "Kejadian yang AKAN SEDANG berlangsung di masa depan.", contoh: "I will be sleeping at 10 PM tonight.", warna: "#ff9f43" },
    { id: 11, name: "Future Perfect", rumus: "S + will + have + V3", fungsi: "AKAN SUDAH SELESAI di suatu titik di masa depan.", contoh: "I will have graduated by 2027.", warna: "#ff9f43" },
    { id: 12, name: "Future Perfect Continuous", rumus: "S + will + have + been + V-ing", fungsi: "Menekankan DURASI kejadian di masa depan.", contoh: "By next month, I will have been living here for a year.", warna: "#ff9f43" },
    { id: 13, name: "Simple Past Future", rumus: "S + would + V1", fungsi: "Rencana di masa lalu yang gagal / Pengandaian (Cond. Type 2).", contoh: "I would buy that car if I had money.", warna: "#a78bfa" },
    { id: 14, name: "Past Future Continuous", rumus: "S + would + be + V-ing", fungsi: "Sesuatu yang SEHARUSNYA SEDANG terjadi di masa lalu.", contoh: "I would be swimming now if it wasn't raining.", warna: "#a78bfa" },
    { id: 15, name: "Past Future Perfect", rumus: "S + would + have + V3", fungsi: "Penyesalan: Seharusnya sudah terjadi di masa lalu (Cond. Type 3).", contoh: "I would have passed if I had studied.", warna: "#a78bfa" },
    { id: 16, name: "Past Future Perfect Continuous", rumus: "S + would + have + been + V-ing", fungsi: "Penyesalan DURASI di masa lalu.", contoh: "I would have been flying for 2 hours if not delayed.", warna: "#a78bfa" }
];

// 🗄️ 2. DATABASE VOCAB UTAMA (Nanti diisi dari vocab_eng.json)
let vocabDataUtama = [];

// 🗄️ 3. DATA KUIS ARENA TENSES
const tensesData = [
    { 
        name: "Level 1: Simple Present (To Be)", unlocked: true, 
        questions: [
            { id: "L1Q1", q: "Saya adalah seorang murid.", a: ["i am", "i'm"], base: "I ___ a student", type: "tobe" }, 
            { id: "L1Q2", q: "Dia (Perempuan) sangat sibuk.", a: ["is", "she is", "she's"], base: "She ___ very busy", type: "tobe" },
            { id: "L1Q3", q: "Mereka ada di sini.", a: ["are", "they are", "they're"], base: "They ___ here", type: "tobe" }
        ] 
    },
    { 
        name: "Level 2: Simple Present (Verbs)", unlocked: false, 
        questions: [
            { id: "L2Q1", q: "Dia (Laki) makan nasi tiap hari.", a: ["eats", "he eats"], base: "He ___ rice everyday", type: "verb" }, 
            { id: "L2Q2", q: "Saya bermain game.", a: ["play", "i play"], base: "I ___ games", type: "verb" },
            { id: "L2Q3", q: "Burung itu terbang.", a: ["flies", "it flies"], base: "The bird ___", type: "verb" }
        ] 
    },
    { 
        name: "Level 3: Present Continuous", unlocked: false, 
        questions: [
            { id: "L3Q1", q: "Saya sedang belajar sekarang.", a: ["am studying", "'m studying", "i am studying"], base: "I ___ now", type: "cont" }, 
            { id: "L3Q2", q: "Mereka sedang bermain bola.", a: ["are playing", "'re playing", "they are playing"], base: "They ___ football", type: "cont" },
            { id: "L3Q3", q: "Kucing itu sedang tidur.", a: ["is sleeping", "it is sleeping", "'s sleeping"], base: "The cat ___", type: "cont" }
        ] 
    },
    { 
        name: "Level 4: Simple Past Tense", unlocked: false, 
        questions: [
            { id: "L4Q1", q: "Saya pergi ke Bali tahun lalu.", a: ["went", "i went"], base: "I ___ to Bali last year", type: "past" }, 
            { id: "L4Q2", q: "Dia (Pr) membeli buku kemarin.", a: ["bought", "she bought"], base: "She ___ a book yesterday", type: "past" },
            { id: "L4Q3", q: "Mereka tidak datang.", a: ["did not come", "didn't come"], base: "They ___", type: "past" }
        ] 
    },
    { 
        name: "Level 5: Simple Future Tense", unlocked: false, 
        questions: [
            { id: "L5Q1", q: "Saya akan menelponmu besok.", a: ["will call", "'ll call", "i will call"], base: "I ___ you tomorrow", type: "future" }, 
            { id: "L5Q2", q: "Kami tidak akan menyerah.", a: ["will not give up", "won't give up"], base: "We ___", type: "future" },
            { id: "L5Q3", q: "Apakah kamu akan pergi?", a: ["will you go"], base: "___?", type: "future" }
        ] 
    }
];

let museumDB = JSON.parse(localStorage.getItem('engMistakes')) || [];
let currentLevelIndex = 0;
let currentQIndex = 0;

document.addEventListener('DOMContentLoaded', () => {

    // --- A. NAVIGASI TAB ---
    window.openEngTab = function(tabId, btn) {
        document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
        btn.classList.add('active');
    };

    // --- B. MESIN ARENA KUIS ---
    const levelGrid = document.getElementById('level-grid');
    const quizArea = document.getElementById('quiz-area');
    const levelSelectArea = document.getElementById('level-select-area');
    
    function renderLevels() {
        if(!levelGrid) return;
        levelGrid.innerHTML = '';
        tensesData.forEach((lvl, index) => {
            const btn = document.createElement('button');
            btn.className = `level-btn ${lvl.unlocked ? 'unlocked' : 'locked'}`;
            btn.innerHTML = lvl.unlocked ? `🔓 ${lvl.name}` : `🔒 ${lvl.name}`;
            
            btn.style.padding = "15px"; btn.style.margin = "5px 0"; btn.style.borderRadius = "10px";
            btn.style.border = "none"; btn.style.cursor = lvl.unlocked ? "pointer" : "not-allowed";
            btn.style.background = lvl.unlocked ? "rgba(0, 198, 255, 0.2)" : "rgba(255, 255, 255, 0.05)";
            btn.style.color = lvl.unlocked ? "#00c6ff" : "#888";
            btn.style.width = "100%"; btn.style.textAlign = "left"; btn.style.fontWeight = "bold";

            if(lvl.unlocked) btn.onclick = () => startLevel(index);
            levelGrid.appendChild(btn);
        });
    }

    function startLevel(index) {
        currentLevelIndex = index;
        currentQIndex = 0;
        levelSelectArea.style.display = 'none';
        quizArea.style.display = 'block';
        document.getElementById('quiz-level-title').innerText = tensesData[index].name;
        loadQuestion();
    }

    function loadQuestion() {
        const qData = tensesData[currentLevelIndex].questions[currentQIndex];
        document.getElementById('q-text').innerText = qData.q;
        document.getElementById('q-base').innerText = qData.base;
        document.getElementById('ans-input').value = '';
        document.getElementById('feedback-msg').style.display = 'none';
        document.getElementById('btn-next').style.display = 'none';
        document.getElementById('btn-check').style.display = 'block';
        
        const progress = ((currentQIndex) / tensesData[currentLevelIndex].questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('q-counter').innerText = `Soal ${currentQIndex + 1}/${tensesData[currentLevelIndex].questions.length}`;
        document.getElementById('ans-input').focus();
    }

    function checkAnswer() {
        const qData = tensesData[currentLevelIndex].questions[currentQIndex];
        const userAnswer = document.getElementById('ans-input').value.toLowerCase().trim();
        const feedback = document.getElementById('feedback-msg');
        
        if (userAnswer === "") return;

        const isCorrect = qData.a.includes(userAnswer);

        if (isCorrect) {
            feedback.innerHTML = "✨ Tepat Sekali!";
            feedback.style.color = "#00d26a";
            feedback.style.background = "rgba(0, 210, 106, 0.1)";
        } else {
            feedback.innerHTML = `❌ Salah Agen! Jawabannya: <b>${qData.a[0]}</b>`;
            feedback.style.color = "#ff4757";
            feedback.style.background = "rgba(255, 71, 87, 0.1)";
            simpanKeMuseum(qData.base, userAnswer, qData.a[0]);
        }

        feedback.style.display = 'block';
        document.getElementById('btn-check').style.display = 'none';
        document.getElementById('btn-next').style.display = 'block';
    }

    document.getElementById('btn-check')?.addEventListener('click', checkAnswer);
    document.getElementById('ans-input')?.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            if (document.getElementById('btn-check').style.display !== 'none') checkAnswer();
            else if (document.getElementById('btn-next').style.display !== 'none') document.getElementById('btn-next').click();
        }
    });

    document.getElementById('btn-next')?.addEventListener('click', () => {
        currentQIndex++;
        if (currentQIndex < tensesData[currentLevelIndex].questions.length) {
            loadQuestion();
        } else {
            if(tensesData[currentLevelIndex + 1]) tensesData[currentLevelIndex + 1].unlocked = true;
            document.getElementById('quiz-area').style.display = 'none';
            levelSelectArea.style.display = 'block';
            renderLevels();
        }
    });

    document.getElementById('btn-back-level')?.addEventListener('click', () => {
        document.getElementById('quiz-area').style.display = 'none';
        levelSelectArea.style.display = 'block';
    });

    // --- C. MISTAKE MUSEUM LOGIC ---
    function simpanKeMuseum(soal, salah, benar) {
        museumDB.push({ soal, salah, benar, id: Date.now() });
        localStorage.setItem('engMistakes', JSON.stringify(museumDB));
    }

    function renderMuseum() {
        const list = document.getElementById('museum-list');
        const query = document.getElementById('museum-search')?.value.toLowerCase() || '';
        if(!list) return;
        list.innerHTML = '';
        
        const filteredDB = museumDB.filter(item => item.soal.toLowerCase().includes(query) || item.benar.toLowerCase().includes(query));

        if (filteredDB.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#aaa;">Belum ada dosa atau data tidak ditemukan. 😇</p>';
            return;
        }
        filteredDB.forEach(item => {
            list.innerHTML += `
                <div style="background:rgba(255,71,87,0.1); border:1px solid #ff4757; padding:15px; border-radius:10px; margin-bottom:10px;">
                    <div style="color:#fff; font-weight:bold; margin-bottom:8px;">${item.soal}</div>
                    <div style="color:#ff4757; font-size:0.9rem;">❌ Kamu jawab: ${item.salah}</div>
                    <div style="color:#00d26a; font-size:0.9rem;">✅ Seharusnya: ${item.benar}</div>
                </div>
            `;
        });
    }

    document.getElementById('btn-museum')?.addEventListener('click', () => {
        document.getElementById('museum-modal').style.display = 'flex';
        renderMuseum();
    });
    document.getElementById('btn-close-museum')?.addEventListener('click', () => document.getElementById('museum-modal').style.display = 'none');
    document.getElementById('museum-search')?.addEventListener('input', renderMuseum);


    // ==========================================
    // D. MESIN BUKU SAKU (ACCORDION & ANIMASI) 📚
    // ==========================================
    const modalSaku = document.getElementById('saku-modal');
    const listSaku = document.getElementById('saku-list');

    const deskripsiData = {
        1: "Kebiasaan, Fakta, Kejadian Sekarang",
        2: "Kejadian yang Sedang Berlangsung",
        3: "Kejadian yang Sudah Selesai/Baru Selesai",
        4: "Dimulai di masa lalu, masih berlanjut",
        5: "Kejadian di masa lalu yang sudah selesai",
        6: "Sedang terjadi di masa lalu",
        7: "Selesai sebelum kejadian lain di masa lalu",
        8: "Berlangsung di masa lalu sebelum kejadian lain",
        9: "Rencana atau prediksi masa depan",
        10: "Akan sedang terjadi di masa depan",
        11: "Akan sudah selesai di masa depan",
        12: "Durasi kejadian di masa depan",
        13: "Rencana gagal di masa lalu / Pengandaian",
        14: "Seharusnya sedang terjadi di masa lalu",
        15: "Penyesalan: Seharusnya sudah terjadi",
        16: "Penyesalan durasi di masa lalu"
    };

    document.getElementById('btn-saku')?.addEventListener('click', () => {
        modalSaku.style.display = 'flex';
        listSaku.innerHTML = ''; 
        
        materiTensesData.forEach((item, index) => {
            const delayAnimasi = (index * 0.05).toFixed(2); 
            const warnaTenses = item.warna || '#00e5ff';
            const descKecil = deskripsiData[item.id] || "Pelajari rumus & fungsinya";
            
            listSaku.innerHTML += `
                <div class="acc-item" style="animation: slideDownFade 0.4s ease forwards; opacity:0; animation-delay: ${delayAnimasi}s;">
                    <button class="acc-header" style="border-left-color: ${warnaTenses};">
                        <span class="acc-dot" style="background:${warnaTenses}; box-shadow: 0 0 8px ${warnaTenses};"></span>
                        <div class="acc-text-wrapper">
                            <span class="acc-name">${item.name}</span>
                            <span class="acc-desc">${descKecil}</span>
                        </div>
                    </button>
                    <div class="acc-body">
                        <p><b>Rumus:</b> <span style="color:${warnaTenses}; font-weight:bold;">${item.rumus}</span></p>
                        <p><b>Fungsi:</b> ${item.fungsi}</p>
                        <p class="acc-contoh" style="color: ${warnaTenses};"><b>Contoh:</b> ${item.contoh}</p>
                    </div>
                </div>
            `;
        });

        const allHeaders = listSaku.querySelectorAll('.acc-header');
        allHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const body = this.nextElementSibling;
                const isOpen = body.style.maxHeight !== "0px" && body.style.maxHeight !== "";

                allHeaders.forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.style.maxHeight = null;
                });

                if (!isOpen) {
                    this.classList.add('active'); 
                    body.style.maxHeight = body.scrollHeight + 36 + "px"; 
                }
            });
        });
    });

    document.getElementById('btn-close-saku')?.addEventListener('click', () => {
        modalSaku.style.display = 'none';
        listSaku.innerHTML = ''; 
    });


    // ==========================================
    // PELATUK BUKA-TUTUP MENU FILTER LIBRARY 🔍
    // ==========================================
    const btnFilterEng = document.getElementById('btn-filter-eng');
    const filterMenuEng = document.getElementById('filter-menu-eng');

    if (btnFilterEng && filterMenuEng) {
        btnFilterEng.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenuEng.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!btnFilterEng.contains(e.target) && !filterMenuEng.contains(e.target)) {
                filterMenuEng.classList.remove('show');
            }
        });
    }


    // ==========================================
    // E. MESIN LIBRARY VOCAB (FETCH JSON) 🗂️
    // ==========================================
    let dataTampil = [];
    let batasBawah = 0;
    const LIMIT_RENDER = 15;
    let filterAktif = ['semua'];

    // Ambil data dari JSON
    fetch('vocab_eng.json')
        .then(response => {
            if (!response.ok) throw new Error("Waduh, JSON-nya gagal dipanggil!");
            return response.json();
        })
        .then(data => {
            vocabDataUtama = data;      
            dataTampil = vocabDataUtama; 
            
            const wadahVocab = document.getElementById('wadah-vocab-eng');
            if(wadahVocab) wadahVocab.innerHTML = ''; 
            
            renderPotongan(); 
        })
        .catch(error => {
            console.error(error);
            const wadahVocab = document.getElementById('wadah-vocab-eng');
            if(wadahVocab) wadahVocab.innerHTML = '<p style="text-align:center; color:#ff4757; margin-top:20px;">Gagal memuat Vocab. Pastikan file JSON ada! 🚨</p>';
        });

    function renderPotongan() {
        const wadahVocab = document.getElementById('wadah-vocab-eng');
        if (!wadahVocab) return;
        
        const potongan = dataTampil.slice(batasBawah, batasBawah + LIMIT_RENDER);
        if (batasBawah === 0 && potongan.length === 0) {
            wadahVocab.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Not found ~x~</p>';
            return;
        } else if (batasBawah === 0) {
            wadahVocab.innerHTML = '';
        }

        potongan.forEach(item => {
            let detailBelakang = "";
            if (item.v1) detailBelakang += `<div style="font-size:0.85rem; margin-bottom:8px;"><b>V1-V3:</b> ${item.v1} ⮕ ${item.v2} ⮕ ${item.v3}</div>`;
            if (item.plural) detailBelakang += `<div style="font-size:0.85rem; margin-bottom:8px;"><b>Plural:</b> ${item.plural}</div>`;

            const card = document.createElement('div');
            card.className = 'swipe-container';
            card.innerHTML = `
                <div class="panel-front">
                    <div>
                        <h2 style="color:#fff; margin:0; font-size:1.4rem;">${item.word}</h2>
                        <p style="color:#888; margin:5px 0 0; font-size:0.9rem;">${item.meaning}</p>
                    </div>
                    <div style="text-align:right;">
                        <span style="background: rgba(0, 198, 255, 0.1); color: #00c6ff; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${item.type.toUpperCase()}</span>
                        <div style="color:#555; font-size:0.7rem; margin-top:8px;">GESER 👉</div>
                    </div>
                </div>
                <div class="panel-back">
                    ${detailBelakang}
                    <div style="color:#f1c40f; font-size:0.8rem; font-style:italic; margin-top:5px;">💡 ${item.note}</div>
                </div>
            `;
            initSwipe(card);
            wadahVocab.appendChild(card);
        });
        batasBawah += LIMIT_RENDER;
    }

    function initSwipe(card) {
        let startX = 0; let isSwiped = false;
        const front = card.querySelector('.panel-front');
        card.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive: true});
        card.addEventListener('touchmove', e => {
            let diffX = startX - e.touches[0].clientX;
            if (diffX > 50 && !isSwiped) { front.style.transform = 'translateX(-100%)'; isSwiped = true; } 
            else if (diffX < -50 && isSwiped) { front.style.transform = 'translateX(0)'; isSwiped = false; }
        }, {passive: true});
    }

    const searchVocab = document.getElementById('engSearch');
    if(searchVocab) {
        searchVocab.addEventListener('input', () => {
            const query = searchVocab.value.toLowerCase();
            batasBawah = 0;
            dataTampil = vocabDataUtama.filter(item => {
                const cocokTipe = filterAktif.includes('semua') || filterAktif.some(f => item.type.toLowerCase().includes(f));
                const cocokKata = item.word.toLowerCase().includes(query) || item.meaning.toLowerCase().includes(query);
                return cocokTipe && cocokKata;
            });
            renderPotongan();
        });
    }

    document.querySelectorAll('.filter-option').forEach(opt => {
        opt.onclick = function() {
            document.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            filterAktif = [this.getAttribute('data-tipe')];
            document.getElementById('filter-menu-eng')?.classList.remove('show');
            if(searchVocab) searchVocab.dispatchEvent(new Event('input'));
        };
    });

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
            if (batasBawah < dataTampil.length) renderPotongan();
        }
    });

    // Jalankan Level Pertama Kali
    renderLevels();
});