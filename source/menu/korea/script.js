// --- STATE & DATA ---
let state = {
    maxCombo: 0,
    currentCombo: 0,
    mistakes: { batchim: 0, object: 0, subject: 0 }
};

// Coba load dari LocalStorage
if(localStorage.getItem('kejuuHangulState')) {
    let saved = JSON.parse(localStorage.getItem('kejuuHangulState'));
    state.maxCombo = saved.maxCombo || 0;
}

let currentMode = 'camp';
let typeInterval; 

// Database Materi & Soal
const hangulBasics = {
    vowels: [
        { char: 'ㅏ', rom: 'A', desc: 'Mulut terbuka lebar.' },
        { char: 'ㅓ', rom: 'EO', desc: 'Buka mulut seperti mau bilang O, tapi sebut A.' },
        { char: 'ㅗ', rom: 'O', desc: 'Bibir membulat.' },
        { char: 'ㅜ', rom: 'U', desc: 'Bibir maju ke depan.' },
        { char: 'ㅡ', rom: 'EU', desc: 'Gigi merapat.' },
        { char: 'ㅣ', rom: 'I', desc: 'Sama seperti I biasa.' }
    ],
    consonants: [
        { char: 'ㄱ', rom: 'G/K', desc: 'Bentuknya seperti pistol ke bawah.' },
        { char: 'ㄴ', rom: 'N', desc: 'Bentuknya seperti sudut siku-siku.' },
        { char: 'ㄷ', rom: 'D/T', desc: 'Bentuknya seperti kotak terbuka.' },
        { char: 'ㄹ', rom: 'R/L', desc: 'Seperti ular atau angka 2.' },
        { char: 'ㅁ', rom: 'M', desc: 'Kotak, mudah diingat!' },
        { char: 'ㅂ', rom: 'B/P', desc: 'Seperti gelas kotak berisi air.' },
        { char: 'ㅅ', rom: 'S', desc: 'Seperti atap rumah.' },
        { char: 'ㅇ', rom: 'NG/-', desc: 'Kosong di awal, "NG" jika di bawah (Batchim).' }
    ]
};

const particleData = [
    { text: "나는 밥 __ 먹어요", answer: "을", hint: "밥 ada Batchim, pakai 을 😏", type: "object" },
    { text: "사과 __ 맛있어요", answer: "가", hint: "사과 berakhiran vokal, pakai 가", type: "subject" },
    { text: "물 __ 마셔요", answer: "을", hint: "물 ada Batchim, pakai 을", type: "object" },
    { text: "저 __ 학생입니다", answer: "는", hint: "저 berakhiran vokal, pakai 는", type: "subject" }
];

const survivalData = [
    { kr: '먹다', id: 'makan', wrong: ['minum', 'tidur'] }, 
    { kr: '가다', id: 'pergi', wrong: ['datang', 'makan'] }, 
    { kr: '자다', id: 'tidur', wrong: ['belajar', 'pergi'] }
];

// --- CORE SYSTEM ---

let typeTimeout; // Kita ganti namanya dari typeInterval jadi typeTimeout

// Tambahkan return new Promise
function charSpeak(text) {
    return new Promise((resolve) => {
        const el = document.getElementById('speechText');
        clearTimeout(typeTimeout); 
        
        let i = 0;
        let currentString = "";
        
        function typeWriter() {
            if (i < text.length) {
                let char = text[i];
                currentString += char;
                el.textContent = currentString;
                i++;
                
                let speed = 25; 
                if (char === '.' || char === '!' || char === '?') speed = 500;
                else if (char === ',') speed = 250;
                
                typeTimeout = setTimeout(typeWriter, speed);
            } else {
                // 🔥 Kalau udah beres ngetik semua, lapor ke sistem "UDAH SELESAI!" 🔥
                resolve(); 
            }
        }
        
        typeWriter(); 
    });
}

// Save & Update Combo
function updateCombo(isCorrect) {
    const el = document.getElementById('comboDisplay');
    
    if(isCorrect) {
        state.currentCombo++;
        if(state.currentCombo > state.maxCombo) state.maxCombo = state.currentCombo;
        
        el.innerText = `Combo 🔥 ${state.currentCombo}`;
        el.classList.add('combo-glow');
        el.style.transform = "scale(1.3)";
        setTimeout(() => el.style.transform = "scale(1)", 150);
    } else {
        state.currentCombo = 0;
        el.innerText = `Combo 🔥 0`;
        el.classList.remove('combo-glow');
    }
    // Simpan ke memory hp/browser
    localStorage.setItem('kejuuHangulState', JSON.stringify(state));
}

// Tab Switcher
function switchMode(modeId, el) {
    clearInterval(survTimerInterval); // Stop timer kalo pindah tab
    document.querySelectorAll('.arena-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(modeId).classList.add('active');
    el.classList.add('active');
    currentMode = modeId;
    
    if(modeId === 'camp') {
        charSpeak("kenalan dulu yuk sama hangul!");
        loadCamp();
    } else if(modeId === 'particle') {
        charSpeak("Hati-hati sama Batchim! Ayo mulai 🔥");
        loadParticle();
    } else if(modeId === 'survival') {
        charSpeak("Jawab cepat atau mati! ⏳");
        loadSurvival();
    } else if(modeId === 'build') {
        charSpeak("Rakit hurufnya jadi kata yang benar!");
    }
}

// --- MODE: CAMP ---
function loadCamp() {
    const vGrid = document.getElementById('vowelGrid');
    const cGrid = document.getElementById('consonantGrid');
    vGrid.innerHTML = ''; cGrid.innerHTML = '';

    hangulBasics.vowels.forEach(item => {
        let btn = document.createElement('button');
        btn.className = 'btn-option'; btn.innerText = item.char;
        btn.onclick = () => charSpeak(`Itu '${item.char}' dibaca ${item.rom}. ${item.desc}`);
        vGrid.appendChild(btn);
    });

    hangulBasics.consonants.forEach(item => {
        let btn = document.createElement('button');
        btn.className = 'btn-option'; btn.innerText = item.char;
        btn.onclick = () => charSpeak(`Itu '${item.char}' dibaca ${item.rom}. ${item.desc}`);
        cGrid.appendChild(btn);
    });
}

// --- MODE: PARTICLE TRAP ---
let currentParticleAnswer = "";
let currentParticleHint = "";
let currentMistakeType = "";

function loadParticle() {
    const q = particleData[Math.floor(Math.random() * particleData.length)];
    document.getElementById("particleQuestion").innerHTML = q.text.replace("__", `<span style="color:var(--neon-blue)">___</span>`);
    currentParticleAnswer = q.answer;
    currentParticleHint = q.hint;
    currentMistakeType = q.type;
}

function checkParticle(answer) {
    if(answer === currentParticleAnswer) {
        charSpeak("✔ Mantap!");
        updateCombo(true);
        setTimeout(loadParticle, 850);
    } else {
        state.mistakes[currentMistakeType]++;
        charSpeak("❌ Salah! " + currentParticleHint);
        updateCombo(false);
    }
}

// --- MODE: SURVIVAL ---
let survTimerInterval;
let currentSurvAnswer = "";

function startTimer() {
    let width = 100;
    const bar = document.getElementById('timerFill');
    clearInterval(survTimerInterval);

    survTimerInterval = setInterval(() => {
        width -= 1;
        bar.style.width = width + "%";

        if(width <= 0) {
            clearInterval(survTimerInterval);
            charSpeak("⏳ Waktu habis! Terlalu lambat 😏");
            updateCombo(false);
            setTimeout(loadSurvival, 1500);
        }
    }, 100);
}

function loadSurvival() {
    const q = survivalData[Math.floor(Math.random() * survivalData.length)];
    document.getElementById("survQuestion").innerText = "Apa arti: " + q.kr;
    currentSurvAnswer = q.id;
    
    let options = [q.id, ...q.wrong];
    options.sort(() => Math.random() - 0.5); 
    
    const optionsContainer = document.getElementById("survOptions");
    optionsContainer.innerHTML = "";
    
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "btn-option"; btn.innerText = opt;
        btn.onclick = () => checkSurvival(opt);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function checkSurvival(answer) {
    clearInterval(survTimerInterval);
    if(answer === currentSurvAnswer) {
        charSpeak("✔ Cepat & Tepat!");
        updateCombo(true);
        setTimeout(loadSurvival, 500);
    } else {
        charSpeak("❌ Ngawur!");
        updateCombo(false);
        setTimeout(loadSurvival, 1000);
    }
}

// --- MODE: BUILD ---
let currentBuild = "";

function addChar(char) {
    if(currentBuild === "___") currentBuild = "";
    currentBuild += char;
    document.getElementById("buildResult").innerText = currentBuild;
}

function resetBuild() {
    currentBuild = "___";
    document.getElementById("buildResult").innerText = currentBuild;
}

function submitBuild() {
    if(currentBuild === "ㅁㅓㄱㄷㅏ") { 
        document.getElementById("buildResult").innerText = "먹다";
        charSpeak("✔ Perfect Combo!");
        updateCombo(true);
    } else {
        charSpeak("❌ Susunannya aneh 😏");
        updateCombo(false);
    }
}

window.onload = async () => {
    loadCamp();
    
    // cek jeda
    await charSpeak("Selamat datang di Pusat Pelatihan! Kenalan dulu sama hurufnya ya 😏");
    
    // Cek apakah punya rekor combo
    if(state.maxCombo > 0) {
        
        setTimeout(() => {
            charSpeak(`Rekor Combo tertinggimu: ${state.maxCombo}. Bisa kalahin? 🔥`);
        }, 1200); 
    }
};
