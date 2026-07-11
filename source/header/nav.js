document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('navBtn');
    const menu = document.getElementById('navMenu');
    const header = document.querySelector('.main-header'); 
    
    // ==========================================
    // 1. LOGIKA MODE FOKUS (AUTO-GENERATE OVERLAY)
    // ==========================================
    const btnFocus = document.getElementById('btn-focus');
    
    const focusOverlay = document.createElement('div');
    focusOverlay.className = 'focus-overlay';
    document.body.appendChild(focusOverlay);

    if(btnFocus) {
        btnFocus.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isFocusActive = document.body.classList.toggle('focus-mode-active');
            
            if (isFocusActive) {
                btnFocus.classList.add('is-active');
                if (menu && menu.classList.contains('show')) {
                    btn && btn.classList.remove('is-active');
                    menu.classList.remove('show');
                }
            } else {
                btnFocus.classList.remove('is-active');
            }
        });
    }

    // ==========================================
    // 2. LOGIKA TOGGLE MENU (KLIK TOMBOL)
    // ==========================================
    if(btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('is-active');
            menu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (menu.classList.contains('show')) {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    btn.classList.remove('is-active');
                    menu.classList.remove('show');
                }
            }
        });
    }

    // ==========================================
    // 3. LOGIKA SCROLL HEADER (OPTIMASI PAGESPEED)
    // ==========================================
    let arahScrollTerakhir = window.scrollY;
    let isTicking = false; // Variabel pengerem untuk mencegah Layout Thrashing

    window.addEventListener('scroll', () => {
        // Cek saklar halaman utama
        if (header && header.getAttribute('data-siluman') === 'false') {
            return; 
        }

        // Gunakan requestAnimationFrame agar selaras dengan rendering browser
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                let scrollSekarang = window.scrollY;
                
                if (scrollSekarang <= 0) {
                    header.style.transform = "translateY(0)";
                } 
                else if (Math.abs(scrollSekarang - arahScrollTerakhir) >= 15) {
                    if (scrollSekarang > arahScrollTerakhir) {
                        header.style.transform = "translateY(-100%)"; 
                        if (menu && menu.classList.contains('show')) {
                            btn.classList.remove('is-active');
                            menu.classList.remove('show');
                        }
                    } else {
                        header.style.transform = "translateY(0)";     
                    }
                    arahScrollTerakhir = scrollSekarang;
                }
                
                isTicking = false; // Buka rem setelah selesai dirender
            });
            isTicking = true; // Aktifkan rem saat sedang diproses
        }
    }, { passive: true }); // passive:true bikin scroll di HP jauh lebih mulus
});
