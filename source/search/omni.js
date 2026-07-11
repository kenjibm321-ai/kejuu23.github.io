// =========================================================================
// FILE KHUSUS: MESIN OMNI SEARCH 🌌🔍
// (EDISI FULL DATA + DEEP SCAN + MINI GAME)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 🗄️ 1. OMNI DATABASE (Kamus Lintas Dimensi)
    // Mas Mandor tinggal nambah-nambahin data di sini nanti!
    const omniDB = [
        {
            concept: "Makan (Eat)",
            keywords: ["makan", "eat", "ate", "eaten", "essen", "taberu", "meokda"],
            langs: [
                { id: "en", flag: "🇬🇧", name: "English", base: "Eat", detail: "V2: Ate | V3: Eaten", task: "Aku makan sebuah apel", words: ["I", "eat", "an", "apple"], ans: "I eat an apple" },
                { id: "de", flag: "🇩🇪", name: "Deutsch", base: "Essen", detail: "+ Akkusativ (ich esse, du isst)", task: "Aku makan sebuah apel", words: ["Ich", "esse", "einen", "Apfel"], ans: "Ich esse einen Apfel" },
                { id: "jp", flag: "🇯🇵", name: "Japanese", base: "食べる (Taberu)", detail: "Masu: Tabemasu | Te: Tabete", task: "Saya makan apel", words: ["私", "は", "りんご", "を", "食べる"], ans: "私 は りんご を 食べる" },
                { id: "kr", flag: "🇰🇷", name: "Korean", base: "먹다 (Meokda)", detail: "Formal: 먹습니다", task: "Saya makan apel", words: ["저는", "사과를", "먹습니다"], ans: "저는 사과를 먹습니다" }
            ]
        },
        {
            concept: "Minum (Drink)",
            keywords: ["minum", "drink", "drank", "drunk", "trinken", "nomu", "masida"],
            langs: [
                { id: "en", flag: "🇬🇧", name: "English", base: "Drink", detail: "V2: Drank | V3: Drunk", task: "Dia (L) minum air", words: ["He", "drinks", "water"], ans: "He drinks water" },
                { id: "de", flag: "🇩🇪", name: "Deutsch", base: "Trinken", detail: "+ Akkusativ (ich trinke, er trinkt)", task: "Dia (L) minum air", words: ["Er", "trinkt", "Wasser"], ans: "Er trinkt Wasser" },
                { id: "jp", flag: "🇯🇵", name: "Japanese", base: "飲む (Nomu)", detail: "Masu: Nomimasu | Te: Nonde", task: "Minum air", words: ["水", "を", "飲む"], ans: "水 を 飲む" },
                { id: "kr", flag: "🇰🇷", name: "Korean", base: "마시다 (Masida)", detail: "Formal: 마십니다", task: "Minum air", words: ["물을", "마십니다"], ans: "물을 마십니다" }
            ]
        }
    ];

    // 🎯 ALGORITMA DEWA: FISHER-YATES SHUFFLE (Buat ngacak kata Mini Game)
    function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ⚙️ CACHE ELEMENT UI
    const btnOmni = document.getElementById('btn-omni');
    const omniOverlay = document.getElementById('omni-overlay');
    const omniClose = document.getElementById('omni-close');
    const omniInput = document.getElementById('omni-input');
    const omniContainer = document.querySelector('.omni-container');
    const omniResults = document.getElementById('omni-results');

        // ==========================================
    // 🔍 MESIN PENCARI (DEEP SCAN - SMART MODE 🧠)
    // ==========================================
    omniInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            omniResults.innerHTML = '<p style="color: #718093; text-align: center; margin-top: 20px; font-style: italic;">ketik beberapa huruf, kosa kata akan muncul dengan multiples result..</p>';
            return;
        }

        // ALGORITMA PENCARIAN PINTAR 🕵️‍♂️
        let hits = omniDB.filter(item => 
            item.keywords.some(kw => {
                const kata = kw.toLowerCase();
                // 1. Cek Awalan: Kalau ngetik "m", cuma cari kata yang BERAWALAN "m" (Misal: Makan, Machi)
                const awalanCocok = kata.startsWith(query);
                
                // 2. Cek Tengah Kata: Baru aktif kalau user ngetik MINIMAL 3 huruf (Misal ngetik "mas" nemu Sumimasen)
                const tengahCocok = query.length >= 3 && kata.includes(query);
                
                return awalanCocok || tengahCocok;
            })
        );

        // BATASI HASIL MAKSIMAL 15 KARTU BIAR HP NGGAK NGADEN / MELEDAK! 🚀
        const hasilDibatasi = hits.slice(0, 10);

        renderResults(hasilDibatasi);
    });

    // ==========================================
    // 🛠️ RENDER HTML & MINI GAME LOGIC
    // ==========================================
    function renderResults(hits) {
        omniResults.innerHTML = ''; // Bersihin hasil sebelumnya

        if (hits.length === 0) {
            omniResults.innerHTML = '<p style="color: #ff7675; text-align: center; margin-top: 20px;">️kosa kata mungkin belum ditambahkan~××~</p>';
            return;
        }

        hits.forEach(concept => {
            // Bikin Wadah Grup Konsep (Misal: "Makan (Eat)")
            const groupDiv = document.createElement('div');
            groupDiv.className = 'concept-group';
            groupDiv.innerHTML = `<div class="concept-title">💡 KONSEP: ${concept.concept}</div>`;

            // Bikin Kartu Geser buat tiap bahasa
            concept.langs.forEach(lang => {
                const swipeContainer = document.createElement('div');
                swipeContainer.className = 'swipe-container';

                // Bikin HTML Laci Depan, Belakang, dan Arena Game
                swipeContainer.innerHTML = `
                    <div class="panel panel-front">
                        <div class="lang-info">
                            <span class="lang-flag">${lang.flag}</span>
                            <span class="lang-word">${lang.base}</span>
                        </div>
                        <span class="swipe-hint">Geser 👉</span>
                    </div>
                    
                    <div class="panel panel-back">
                        <div class="grammar-detail">${lang.detail}</div>
                        <button class="btn-play-mini">🎯 Rangkai Kalimat</button>
                        
                        <div class="mini-arena">
                            <div class="mission-text">Misi: "${lang.task}"</div>
                            <div class="answer-slots"></div>
                            <div class="word-chips"></div>
                        </div>
                    </div>
                `;

                // LOGIKA MINI GAME 🎮
                const btnPlay = swipeContainer.querySelector('.btn-play-mini');
                const arena = swipeContainer.querySelector('.mini-arena');
                const slotsBox = swipeContainer.querySelector('.answer-slots');
                const chipsBox = swipeContainer.querySelector('.word-chips');

                let currentAnswer = [];
                const expectedAnswer = lang.ans.split(" "); // Jawaban dipecah jadi array
                
                btnPlay.addEventListener('click', () => {
                    // Tampilkan arena dan sembunyikan tombol play
                    arena.classList.add('active');
                    btnPlay.style.display = 'none';

                    // Siapkan Slot kosong sesuai jumlah kata
                    slotsBox.innerHTML = '';
                    expectedAnswer.forEach(() => {
                        const slot = document.createElement('div');
                        slot.className = 'slot-box';
                        slot.innerText = '___';
                        slotsBox.appendChild(slot);
                    });

                    // Siapkan Chip kata (Diacak!)
                    chipsBox.innerHTML = '';
                    const shuffledWords = shuffleArray(lang.words);
                    
                    shuffledWords.forEach(word => {
                        const chip = document.createElement('div');
                        chip.className = 'chip';
                        chip.innerText = word;

                        // Pas chip ditekan...
                        chip.addEventListener('click', () => {
                            // Cek apakah urutan tebakannya benar?
                            const nextCorrectWord = expectedAnswer[currentAnswer.length];
                            
                            if (word === nextCorrectWord) {
                                // BENAR! Masuk slot
                                chip.classList.add('hidden');
                                slotsBox.children[currentAnswer.length].innerText = word;
                                slotsBox.children[currentAnswer.length].style.borderColor = '#00c6ff';
                                currentAnswer.push(word);

                                // Kalau udah kejawab semua
                                if (currentAnswer.length === expectedAnswer.length) {
                                    setTimeout(() => {
                                        slotsBox.style.background = 'rgba(0, 210, 106, 0.2)';
                                        arena.innerHTML = `<div style="text-align:center; color:#00d26a; font-weight:bold; font-size:1.2rem;">🎉 PERFECT! MANTAP! 🎉</div>`;
                                    }, 300);
                                }
                            } else {
                                // SALAH! Bergetar merah
                                chip.classList.add('wrong-shake');
                                setTimeout(() => chip.classList.remove('wrong-shake'), 400);
                            }
                        });
                        chipsBox.appendChild(chip);
                    });
                });

                groupDiv.appendChild(swipeContainer);
            });

            omniResults.appendChild(groupDiv);
        });
    }

    // ==========================================
    // 🚪 SAKLAR BUKA/TUTUP JENDELA
    // ==========================================
    function closeOmniSearch() {
        omniContainer.classList.add('closing');
        setTimeout(() => {
            omniOverlay.classList.remove('active');
            omniContainer.classList.remove('closing');
            omniInput.value = ''; 
            omniResults.innerHTML = '<p style="color: #718093; text-align: center; margin-top: 20px; font-style: italic;">Mesin siap. Ketik sesuatu untuk mulai mencari...</p>';
        }, 300);
    }

    if(btnOmni) {
        btnOmni.addEventListener('click', () => {
            omniOverlay.classList.add('active');
            setTimeout(() => omniInput.focus(), 150); 
        });
    }
    if(omniClose) omniClose.addEventListener('click', closeOmniSearch);
    
    if(omniOverlay) {
        omniOverlay.addEventListener('click', (e) => {
            if(e.target === omniOverlay) closeOmniSearch();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && omniOverlay.classList.contains('active')) closeOmniSearch();
    // ==========================================
    // 🚰 PIPA PENYEDOT 3 JSON SEKALIGUS (PROMISE.ALL 🚀)
    // ==========================================
    
    async function loadDataFromJSON() {
        try {
            // 1. Jalankan 3 fetch sekaligus biar ngebut!
            const [resN5, resN4, resN3] = await Promise.all([
                fetch('source/menu/hiragana/n5.json'),
                fetch('source/menu/hiragana/n4.json'),
                fetch('source/menu/hiragana/n3.json')
            ]);
            
            // 2. Pastikan semua file berhasil ditemukan
            if (!resN5.ok || !resN4.ok || !resN3.ok) {
                throw new Error(`HTTP error! Gagal mengambil salah satu file JSON.`);
            }
            
            // 3. Ekstrak data JSON-nya
            const dataN5 = await resN5.json();
            const dataN4 = await resN4.json();
            const dataN3 = await resN3.json();

            // 4. Gabungkan ketiga data menjadi satu array besar
            const semuaJepang = [...dataN5, ...dataN4, ...dataN3];
            
            // 5. Format ulang ke bentuk omniDB
            const sedotanJepang = semuaJepang.map(item => {
                const kepinganKata = item.romaji.split(" "); 
                return {
                    concept: item.arti, 
                    keywords: [item.arti.toLowerCase(), item.romaji.toLowerCase(), item.kana.toLowerCase()], 
                    langs: [
                        { 
                            id: "jp", 
                            flag: "🇯🇵", 
                            name: "Japanese", 
                            base: `${item.kana} (${item.romaji})`, 
                            detail: `Level: ${item.level} | Tipe: ${item.tipe.toUpperCase()}`, 
                            task: `Misi: Susun kata "${item.arti}"`, 
                            words: kepinganKata,
                            ans: item.romaji 
                        }
                    ]
                };
            });

            // 6. Masukkan semua data yang sudah digabung ke mesin pencari utama
            omniDB.push(...sedotanJepang);
            console.log(`✅ Berhasil menyedot ${sedotanJepang.length} kosakata dari N5, N4, dan N3!`);
            
        } catch (error) {
            console.error("❌ Gagal menyedot data JSON:", error);
        }
    }

    // Panggil fungsinya dengan delay 1 detik agar loading awal website enteng
    setTimeout(() => {
        loadDataFromJSON();
    }, 300);
 });
});