/* =================================================================
   SCRIPT CHAT AI - KEJUU.WEB.ID (VERSI DIET KODE + DUAL WEBP)
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Gambar AI (Pastikan ada file asisten.webp)
    const iconAI = `<img src="source/asisten.webp" alt="AI" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1.5px solid #B0E0E6;">`;
    
    // 2. Gambar User (Pastikan ada file user.webp)
    const iconUser = `<img src="source/user.webp" alt="User" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 1.5px solid #FFB6C1;">`;

    const $ = id => document.getElementById(id);
    const el = { btn: $('btn-chat-ai'), cls: $('ai-chat-close'), ovr: $('ai-chat-overlay'), lang: $('ai-lang-selector'), rm: $('ai-chat-room'), hist: $('ai-chat-history'), opt: $('ai-chat-options') };
    
    if (!el.btn || !el.ovr) return;

    let lang = '', isTyping = false;

    const db = {
        jp: {
            start: { ai: "Konnichiwa! 🌸 Kyō wa dō deshita ka?", c: [{ t: "Genki desu! (Baik!)", n: "genki" }, { t: "Tsukaremashita... (Lelah...)", n: "tsukareta" }] },
            genki: { ai: "Yokatta desu ne! Nani o shimashita ka?", c: [{ t: "Nihongo o benkyou shimashita.", n: "benkyou" }, { t: "Tomodachi to asobimashita.", n: "asobu" }] },
            tsukareta: { ai: "Otsukaresama! Yukkuri yasunde kudasai ne. 🍵", c: [{ t: "Arigatou!", n: "end" }] },
            benkyou: { ai: "Sugoi! 🚀 Sono choushi de ganbatte kudasai!", c: [{ t: "Hai, ganbarimasu!", n: "end" }] },
            asobu: { ai: "Ii desu ne! Tanoshikatta desu ka? ✨", c: [{ t: "Hai, totemo!", n: "end" }] },
            end: { ai: "Mata itsudemo hanashikakete kudasai ne! 👋", c: [] }
        },
        en: {
            start: { ai: "Hello there! 👋 How are you doing today?", c: [{ t: "I'm doing great!", n: "great" }, { t: "A bit tired.", n: "tired" }] },
            great: { ai: "Awesome! Did you do anything fun?", c: [{ t: "Studied English!", n: "study" }, { t: "Chilled at home.", n: "chill" }] },
            tired: { ai: "Oh no, make sure to get some rest! 🛏️", c: [{ t: "I will, thank you!", n: "end" }] },
            study: { ai: "That's the spirit! Keep up the good work. 🌟", c: [{ t: "Thanks!", n: "end" }] },
            chill: { ai: "Sometimes a relaxing day is all we need. ☕", c: [{ t: "Exactly!", n: "end" }] },
            end: { ai: "Talk to you later! 👋", c: [] }
        },
        de: {
            start: { ai: "Guten Tag! 🇩🇪 Wie geht es dir heute?", c: [{ t: "Mir geht es gut, danke!", n: "gut" }, { t: "Ich bin müde.", n: "muede" }] },
            gut: { ai: "Das freut mich zu hören! Was hast du gemacht?", c: [{ t: "Deutsch gelernt!", n: "end" }] },
            muede: { ai: "Oh, ruh dich gut aus! 🌙", c: [{ t: "Danke schön!", n: "end" }] },
            end: { ai: "Bis bald! Tschüss! 👋", c: [] }
        },
        kr: {
            start: { ai: "Annyeonghaseyo! 🇰🇷 Oneul haru eottaesseoyo?", c: [{ t: "Neomu joasseoyo!", n: "joa" }, { t: "Pigonhaeyo...", n: "pigon" }] },
            joa: { ai: "Dahaeng-ineyo! Mwo haesseoyo?", c: [{ t: "Hangugeo gongbu haesseoyo!", n: "end" }] },
            pigon: { ai: "Sugo manasseoyo. Puk swiseyo! 🛌", c: [{ t: "Gamsahamnida!", n: "end" }] },
            end: { ai: "Tto iyagihaeyo! Annyeong! 👋", c: [] }
        }
    };

    el.btn.onclick = () => { el.ovr.classList.add('active'); el.lang.style.display = 'block'; el.rm.style.display = 'none'; el.hist.innerHTML = ''; };
    el.cls.onclick = () => el.ovr.classList.remove('active');

    document.querySelectorAll('.ai-lang-btn').forEach(btn => {
        btn.onclick = (e) => {
            let l = e.target.getAttribute('data-lang');
            if (l === 'jp' || l === 'en' || l === 'de' || l === 'kr') {
                lang = l; 
                el.lang.style.display = 'none'; 
                el.rm.style.display = 'flex'; 
                run('start');
            }
        };
    });

    function run(step) {
        if (!isTyping) {
            isTyping = true; 
            el.opt.innerHTML = '';
            
            let row = document.createElement('div');
            row.className = 'chat-row ai';
            row.innerHTML = `<div class="chat-avatar">${iconAI}</div><div class="chat-bubble ai-msg"></div>`;
            el.hist.appendChild(row);
            
            let bubble = row.querySelector('.ai-msg');
            let i = 0, txt = db[lang][step].ai, choices = db[lang][step].c;

            let ngetik = setInterval(() => {
                bubble.textContent += txt[i++];
                el.hist.scrollTop = el.hist.scrollHeight;
                
                if (i >= txt.length) { 
                    clearInterval(ngetik); 
                    isTyping = false; 
                    
                    if (choices.length === 0) {
                        el.opt.innerHTML = '<p style="color:#718093; text-align:center; font-size:0.9rem;">— Sesi Percakapan Selesai —</p>';
                    } else {
                        choices.forEach(c => {
                            let b = document.createElement('button');
                            b.className = 'chat-choice-btn'; 
                            b.textContent = c.t;
                            b.onclick = () => {
                                el.hist.innerHTML += `<div class="chat-row user"><div class="chat-bubble user-msg">${c.t}</div><div class="chat-avatar">${iconUser}</div></div>`;
                                run(c.n);
                            };
                            el.opt.appendChild(b);
                        });
                    }
                }
            }, 30);
        }
    }
});
