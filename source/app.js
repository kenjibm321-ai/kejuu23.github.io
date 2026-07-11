// =========================================================================
// PUSAT OTAK LOBI UTAMA KEJUU.ID 🌍⚙️
// (EDISI SAPAAN GEDE + ASISTEN RANDOM + JEBAKAN PRANK SHUFFLE 😈)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Tentukan asisten: bisa 'Yachiyo' atau 'Elaina'
    const ACTIVE_ASSISTANT = 'Elaina'; 

    const dialogues = {
        Elaina: {
            greetings: {
                morning: [
                    "Pagi Komandan! ☀️ Udah siap sarapan keju hari ini?",
                    "Ohayou! Pagi-pagi gini emang paling enak push rank bahasa! 🚀",
                    "Morning! Kopi udah siap, let's go! ☕"
                ],
                afternoon: [
                    "Siang! 😎 Waktunya ngisi XP, jangan kasih kendor!",
                    "Woy jangan rebahan terus, ayo kerjain 1 kuis aja! 🎯",
                    "Masih semangat kan? Target hari ini belum kelar lho! 🔥"
                ],
                evening: [
                    "Malem! ✨ Belajar santay dulu yuk sebelum tidur.",
                    "Otsukaresama! Hari yang panjang ya, mau review bentar? 🌙",
                    "Udah malem nih, jangan begadang kalau nggak sambil belajar! 🦉"
                ]
            },
            reactions: {
                startPractice: "Mulai Petualangan? 🚀 Pilihan bagus! Mau bahasa mana dulu nih..?",
                continueCourse: "Lanjut Kursus? 😏 Great!, konsistensi adalah kunci keberhasilan!",
                poked: [
                    "Ah! Jangan cocol-cocol! 😖 Geli tauuu!",
                    "Hoy! Fokus belajar, jangan godain asisten terus! 😤",
                    "Ada yang bisa dibantu, atau cuma mau iseng yah..? 👀"
                ]
            }
        }
    };

    // Cache Elemen UI
    const heroTitle = document.querySelector('.hero h1');
    const heroDesc = document.querySelector('.hero p');
    const practiceBtn = document.getElementById('btn-practice'); 
    const continueBtn = document.getElementById('btn-continue'); 
    const languageSection = document.getElementById('language-selection'); 
    const assistantImg = document.getElementById('assistant-img');
    const speechBubble = document.getElementById('bubble');

    // Fungsi Waktu 
    function getTimeOfDate() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    // Fungsi Ngomong
    let talkTimeout;
    function say(text, duration = 4000) {
        clearTimeout(talkTimeout);
        speechBubble.innerText = text;
        speechBubble.classList.add('show');
        if(assistantImg) assistantImg.classList.add('talking'); 

        talkTimeout = setTimeout(() => {
            speechBubble.classList.remove('show');
            if(assistantImg) assistantImg.classList.remove('talking'); 
        }, duration);
    }

      // ==========================================
    // LOGIKA INISIALISASI (LOAD PERTAMA) 🚀
    // ==========================================
    
    // 1. SAPAAN GEDE 4 BAHASA RANDOM DI HERO TITLE 🌍 (DENGAN SAKLAR AMAN 🎚️)
    const bigGreetings = [
        "What's up, Mr! ",
        "Welcome back! ",
        "Konnichiwa!",
        "Iku zo! dekiru!",
        "Guten Tag!",
        "Hallo, was geht?",
        "Annyeong!"
    ];
    
    // JS ngecek: "Apakah saklarnya BUKAN false?" 
    if (heroTitle && heroTitle.dataset.dynamic !== "false") {
        const randomBigGreet = bigGreetings[Math.floor(Math.random() * bigGreetings.length)];
        heroTitle.innerText = randomBigGreet;
        heroDesc.innerText = "Pilih bahasamu, sesuaikan gaya belajarmu sendiri!. Hari ini mau coba yang mana?";
    }

    // 2. SAPAAN BUBBLE ASISTEN SESUAI WAKTU
    const timeOfDay = getTimeOfDate();
    const greetArray = dialogues[ACTIVE_ASSISTANT].greetings[timeOfDay];
    const randomBubbleGreet = greetArray[Math.floor(Math.random() * greetArray.length)];

    setTimeout(() => {
        say(randomBubbleGreet);
    }, 1000);

    // ==========================================
    // EVENT LISTENERS (INTERAKSI USER) 🔫
    // ==========================================
    if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
            say(dialogues[ACTIVE_ASSISTANT].reactions.startPractice);
            if (languageSection) {
                languageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                languageSection.classList.add('highlight-section');
                setTimeout(() => languageSection.classList.remove('highlight-section'), 1500);
            }
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => say(dialogues[ACTIVE_ASSISTANT].reactions.continueCourse));
    }

    // KLIK SEKALI (POKE)
    if (assistantImg) {
        assistantImg.addEventListener('click', () => {
            const pokeDialogs = dialogues[ACTIVE_ASSISTANT].reactions.poked;
            const randomPoke = pokeDialogs[Math.floor(Math.random() * pokeDialogs.length)];
            
            assistantImg.style.animation = 'none'; 
            assistantImg.offsetHeight; 
            assistantImg.style.animation = 'poke 0.5s ease-in-out'; 

            say(randomPoke, 3000); 

            setTimeout(() => {
                 assistantImg.style.animation = 'float 3s ease-in-out infinite';
            }, 500);
        });
    }

    // ==========================================
    // 😈 SISTEM JEBAKAN BATMAN (PRANK HUKUMAN)
    // ==========================================
    
    const prankDB = [
        { lang: "🇯🇵 Japanese", q: "Apa arti dari 'Taberu' (食べる)?", opts: ["Tidur", "Makan", "Minum", "Lari"], ans: "Makan" },
        { lang: "🇩🇪 Deutsch", q: "Apa artikel yang tepat untuk 'Auto' (Mobil)?", opts: ["Der", "Die", "Das", "Den"], ans: "Das" },
        { lang: "🇬🇧 English", q: "Bentuk V3 (Past Participle) dari 'Eat' adalah?", opts: ["Ate", "Eaten", "Eating", "Eats"], ans: "Eaten" },
        { lang: "🇰🇷 Korean", q: "Apa arti dari 'Meokda' (먹다)?", opts: ["Minum", "Tidur", "Makan", "Pergi"], ans: "Makan" },
        { lang: "🇯🇵 Japanese", q: "Huruf Katakana untuk 'A' adalah?", opts: ["あ", "ア", "い", "イ"], ans: "ア" },
        { lang: "🇩🇪 Deutsch", q: "Bentuk Akkusativ dari 'der Hund' adalah?", opts: ["dem Hund", "des Hundes", "den Hund", "der Hund"], ans: "den Hund" }
    ];

    // 🔥 ALGORITMA DEWA: FISHER-YATES SHUFFLE
    // Dipakai buat ngacak array beneran 100% tanpa celah!
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 🔥 SISTEM SHUFFLE BAG (Kocok Kartu)
    let prankDeck = [];
    
    function getNextPrank() {
        // Kalau tumpukan soal habis (atau pas web pertama dibuka), isi & kocok ulang!
        if (prankDeck.length === 0) {
            prankDeck = [...prankDB];
            shuffleArray(prankDeck);
        }
        // Cabut kartu paling atas
        return prankDeck.pop();
    }

    const overlay = document.getElementById('punishment-overlay');
    const qText = document.getElementById('punish-q');
    const langText = document.getElementById('punish-lang');
    const optsContainer = document.getElementById('punish-opts');
    
    const prankBadge = document.getElementById('prank-badge');
    const prankCountText = document.getElementById('prank-count');

    let prankCount = parseInt(localStorage.getItem('kejuu_prank_count')) || 0;
    
    function updateBadge() {
        if(prankCount > 0) {
            prankBadge.classList.remove('hidden');
            prankCountText.innerText = prankCount;
        }
    }
    updateBadge(); 

    let currentPrankAns = "";
    function triggerPunishment() {
        // probility chance
        const randomQ = getNextPrank();
        currentPrankAns = randomQ.ans;
        
        langText.innerText = randomQ.lang;
        qText.innerText = randomQ.q;
        optsContainer.innerHTML = ''; 

        // ACAK PILIHAN GANDA PAKAI ALGORITMA DEWA
        let shuffledOpts = [...randomQ.opts];
        shuffleArray(shuffledOpts);

        shuffledOpts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'punish-btn';
            btn.innerText = opt;
            
            btn.addEventListener('click', () => {
                if(opt === currentPrankAns) {
                    btn.style.background = "#00d26a";
                    btn.style.borderColor = "#00d26a";
                    
                    setTimeout(() => {
                        overlay.classList.remove('locked');
                        say("Hmph! Lolos kali ini! Jangan iseng lagi ya! 😤", 4000);
                        
                        prankCount++;
                        localStorage.setItem('kejuu_prank_count', prankCount);
                        updateBadge();
                    }, 500);

                } else {
                    btn.classList.add('wrong');
                    say("Salah woy! Jawab yang bener kalau mau keluar! 😈", 3000);
                    setTimeout(() => btn.classList.remove('wrong'), 400);
                }
            });
            optsContainer.appendChild(btn);
        });

        overlay.classList.add('locked');
    }

    // TRIGGER NYA: DOUBLE CLICK DI ASISTEN
    if (assistantImg) {
        assistantImg.addEventListener('dblclick', () => {
            say("OH NANTANGIN YAH?! 💢 RASAKAN INI!", 2000);
            setTimeout(() => {
                triggerPunishment();
            }, 800);
        });
    }

});
