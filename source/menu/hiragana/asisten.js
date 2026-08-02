document.addEventListener("DOMContentLoaded", () => {
    
    // ====================================================================
    // 1. LOGIKA ANIMASI BOTTOM SHEET (DRAG/SWIPE + SNAP + MOMENTUM + SPRING)
    //    Catatan: Variabel existing TIDAK diganti namanya (isDragging/startY/currentY).
    // ====================================================================
    
    const btnTriggerSheet = document.getElementById("btn-trigger-sheet");
    const bottomSheet = document.getElementById("bottom-sheet");
    const sheetContent = document.getElementById("sheet-content");

    let isDragging = false;
    let startY = 0;
    let currentY = 0;

    // ---- Tambahan (tidak mengubah variabel existing) ----
    let startTranslateY = 0;
    let currentTranslateY = 0;
    let lastMoveY = 0;
    let lastMoveTime = 0;
    let velocityY = 0;
    let activeAnimation = null; // requestAnimationFrame id
    let sheetMetrics = null;
    let shouldDragSheet = false;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const getTranslateY = (el) => {
        const transform = getComputedStyle(el).transform;
        if (!transform || transform === "none") return 0;
        // matrix(a,b,c,d,tx,ty)
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (match) {
            const parts = match[1].split(",").map((p) => parseFloat(p.trim()));
            return Number.isFinite(parts[5]) ? parts[5] : 0;
        }
        // matrix3d(...)
        const match3d = transform.match(/matrix3d\(([^)]+)\)/);
        if (match3d) {
            const parts = match3d[1].split(",").map((p) => parseFloat(p.trim()));
            return Number.isFinite(parts[13]) ? parts[13] : 0;
        }
        return 0;
    };

    const cancelActiveAnimation = () => {
        if (activeAnimation !== null) {
            try { cancelAnimationFrame(activeAnimation); } catch (_) {}
            activeAnimation = null;
        }
    };

    const computeSheetMetrics = () => {
        if (!sheetContent) return null;
        const rect = sheetContent.getBoundingClientRect();
        const sheetHeight = rect.height || sheetContent.offsetHeight || 0;
        const TOP_GAP = Math.max(12, Math.round(window.innerHeight * 0.03));
        const CLOSED_PEEK = 84; // tinggi yang tetap terlihat saat "snap closed"
        const CLOSED_SNAP = Math.max(0, sheetHeight - CLOSED_PEEK);
        const HALF_SNAP = Math.max(TOP_GAP, CLOSED_SNAP * 0.38);
        const FULL_SNAP = TOP_GAP;
        const DISMISS_Y = sheetHeight + 40; // benar-benar keluar layar
        return {
            sheetHeight,
            snapPoints: [FULL_SNAP, HALF_SNAP, CLOSED_SNAP],
            dismissY: DISMISS_Y,
            closedSnap: CLOSED_SNAP,
            halfSnap: HALF_SNAP,
            fullSnap: FULL_SNAP
        };
    };

    const setTranslateY = (y) => {
        currentTranslateY = y;
        sheetContent.style.transform = `translateY(${y}px)`;
    };

    const pickSnapPoint = (projectedY, vY, metrics) => {
        const points = metrics.snapPoints;
        // Jika fling ke bawah cukup cepat, niatnya biasanya menutup.
        if (vY > 0.75) return metrics.dismissY;

        // Pilih snap terdekat dari posisi terproyeksi.
        let best = points[0];
        let bestDist = Math.abs(projectedY - best);
        for (const p of points) {
            const d = Math.abs(projectedY - p);
            if (d < bestDist) {
                best = p;
                bestDist = d;
            }
        }

        // Jika proyeksi melewati area close, anggap dismiss.
        if (projectedY > metrics.closedSnap + 60) return metrics.dismissY;
        return best;
    };

    // Spring integrator sederhana (rAF) agar terasa "native-like" dan tidak kejang
    const springTo = (targetY, initialVelocity, onComplete) => {
        cancelActiveAnimation();
        if (!sheetContent) return;

        // Konstanta physics (lebih stabil):
        // v dalam px/s, dt dalam detik.
        const stiffness = 280; // k (lebih tinggi = lebih cepat)
        const damping = 32;    // c (lebih tinggi = lebih "nahan")
        const stopThresholdPos = 0.5;   // px
        const stopThresholdVel = 8;     // px/s

        let y = getTranslateY(sheetContent);
        let v = Number.isFinite(initialVelocity) ? initialVelocity : 0;
        let lastT = performance.now();

        const step = (t) => {
            const dtMs = Math.min(32, t - lastT);
            const dt = dtMs / 1000; // detik
            lastT = t;

            // Force spring ke target
            const displacement = y - targetY;
            const a = (-stiffness * displacement) - (damping * v);
            v = v + a * dt;
            y = y + v * dt;

            // Clamp agar tidak "melewati" batas atas
            if (sheetMetrics) {
                y = clamp(y, sheetMetrics.fullSnap, sheetMetrics.dismissY);
            }

            setTranslateY(y);

            const donePos = Math.abs(y - targetY) <= stopThresholdPos;
            const doneVel = Math.abs(v) <= stopThresholdVel;
            if (donePos && doneVel) {
                setTranslateY(targetY);
                activeAnimation = null;
                if (typeof onComplete === "function") onComplete();
                return;
            }

            activeAnimation = requestAnimationFrame(step);
        };

        activeAnimation = requestAnimationFrame(step);
    };

    // Buka Bottom Sheet (default: snap lebih tinggi agar menu lebih jelas)
    const openSheet = () => {
        // Hindari double-open
        if (bottomSheet?.classList.contains("muncul")) return;

        sheetMetrics = computeSheetMetrics();
        if (!sheetMetrics) return;

        // Set posisi awal sebelum overlay dimunculkan (mengurangi flicker/jitter)
        sheetContent.style.transition = "none";
        setTranslateY(sheetMetrics.dismissY);

        bottomSheet.classList.add("muncul");
        bottomSheet.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Kunci scroll di background

        requestAnimationFrame(() => {
            springTo(sheetMetrics.fullSnap, 0);
        });
    };

    // Tutup Bottom Sheet (dismiss total)
    const closeSheet = () => {
        cancelActiveAnimation();
        bottomSheet.classList.remove("muncul");
        bottomSheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        sheetContent.style.transform = ""; // Reset transform
        shouldDragSheet = false;
    };

    // Catatan: sesuai permintaan, buka/utup via gesture (swipe), bukan tap.
    // Jadi tombol handle tidak dipakai untuk membuka via click.
    // (Tetap ada sebagai indikator visual swipe-up.)

    // Swipe up dari kapsul (mobile-dock) untuk buka bottom sheet
    // Catatan: tidak mengubah variabel existing, hanya menambah state baru.
    const dock = document.querySelector(".mobile-dock");
    const dockHandle = document.getElementById("btn-trigger-sheet");
    let dockStartX = 0;
    let dockStartY = 0;
    let dockTracking = false;
    let dockTriggered = false;
    let dockAxis = "";

    const resetDockSwipe = () => {
        dockStartX = 0;
        dockStartY = 0;
        dockTracking = false;
        dockTriggered = false;
        dockAxis = "";
    };

    const onDockSwipeStart = (e) => {
        if (e.touches.length !== 1) return;
        // Jangan ganggu saat sheet sedang terbuka
        if (bottomSheet?.classList.contains("muncul")) return;
        dockTracking = true;
        dockTriggered = false;
        dockAxis = "";
        dockStartX = e.touches[0].clientX;
        dockStartY = e.touches[0].clientY;
    };

    const onDockSwipeMove = (e) => {
        if (!dockTracking || e.touches.length !== 1) return;
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        const dx = x - dockStartX;
        const dy = y - dockStartY;

        if (!dockAxis) {
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            if (absX > 6 || absY > 6) {
                dockAxis = absY > absX ? "y" : "x";
            }
        }

        if (dockAxis === "y") {
            e.preventDefault();
        }

        // Jika gesture vertikal, kunci agar listener swipe menu utama lain tidak ikut jalan.
        // Swipe up: dy negatif, dominan vertikal
        if (!dockTriggered && dy < -24 && Math.abs(dy) > Math.abs(dx)) {
            dockTriggered = true;
            openSheet();
            resetDockSwipe();
        }
    };

    dock?.addEventListener("touchstart", onDockSwipeStart, { passive: true });
    dock?.addEventListener("touchmove", onDockSwipeMove, { passive: false });
    dock?.addEventListener("touchend", resetDockSwipe, { passive: true });
    dock?.addEventListener("touchcancel", resetDockSwipe, { passive: true });

    // Area handle (di atas dock) juga bisa untuk swipe up, tapi tetap tanpa tap.
    dockHandle?.addEventListener("touchstart", onDockSwipeStart, { passive: true });
    dockHandle?.addEventListener("touchmove", onDockSwipeMove, { passive: false });
    dockHandle?.addEventListener("touchend", resetDockSwipe, { passive: true });
    dockHandle?.addEventListener("touchcancel", resetDockSwipe, { passive: true });

    // Pointer events untuk device yang lebih suka pointer daripada touch.
    const onDockPointerStart = (e) => {
        if (e.pointerType !== "touch" && e.pointerType !== "pen") return;
        if (bottomSheet?.classList.contains("muncul")) return;
        dockTracking = true;
        dockTriggered = false;
        dockAxis = "";
        dockStartX = e.clientX;
        dockStartY = e.clientY;
    };

    const onDockPointerMove = (e) => {
        if (!dockTracking) return;
        if (e.pointerType !== "touch" && e.pointerType !== "pen") return;

        const dx = e.clientX - dockStartX;
        const dy = e.clientY - dockStartY;

        if (!dockAxis) {
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            if (absX > 6 || absY > 6) {
                dockAxis = absY > absX ? "y" : "x";
            }
        }

        if (!dockTriggered && dy < -24 && Math.abs(dy) > Math.abs(dx)) {
            e.preventDefault();
            dockTriggered = true;
            openSheet();
            resetDockSwipe();
        }
    };

    const onDockPointerEnd = () => {
        resetDockSwipe();
    };

    dock?.addEventListener("pointerdown", onDockPointerStart);
    dock?.addEventListener("pointermove", onDockPointerMove);
    dock?.addEventListener("pointerup", onDockPointerEnd);
    dock?.addEventListener("pointercancel", onDockPointerEnd);

    dockHandle?.addEventListener("pointerdown", onDockPointerStart);
    dockHandle?.addEventListener("pointermove", onDockPointerMove);
    dockHandle?.addEventListener("pointerup", onDockPointerEnd);
    dockHandle?.addEventListener("pointercancel", onDockPointerEnd);

    // Sesuai permintaan: jangan tutup lewat tap overlay. Tutup via swipe down.

    // ---- Gesture handlers (Touch + Pointer) ----
    const onDragStart = (clientY) => {
        if (!sheetContent) return;
        sheetMetrics = sheetMetrics || computeSheetMetrics();
        if (!sheetMetrics) return;
        shouldDragSheet = true;

        cancelActiveAnimation(); // Interruption-safe

        startY = clientY;
        currentY = clientY;
        startTranslateY = getTranslateY(sheetContent);
        currentTranslateY = startTranslateY;

        lastMoveY = clientY;
        lastMoveTime = performance.now();
        velocityY = 0;

        isDragging = true;
        sheetContent.style.transition = "none";
    };

    const onDragMove = (clientY) => {
        if (!isDragging || !sheetContent || !shouldDragSheet) return;
        if (!sheetMetrics) return;

        currentY = clientY;
        const diff = currentY - startY;
        const nextY = clamp(startTranslateY + diff, sheetMetrics.fullSnap, sheetMetrics.dismissY);
        setTranslateY(nextY);

        const now = performance.now();
        const dt = Math.max(1, now - lastMoveTime);
        velocityY = (clientY - lastMoveY) / dt; // px per ms
        lastMoveY = clientY;
        lastMoveTime = now;
    };

    const onDragEnd = () => {
        if (!isDragging || !sheetContent || !shouldDragSheet) {
            isDragging = false;
            shouldDragSheet = false;
            return;
        }
        isDragging = false;
        if (!sheetMetrics) return;

        const dragDistance = currentTranslateY - startTranslateY;

        // Jika user benar-benar swipe turun, prioritaskan close.
        // Ini dibuat lebih tegas agar gesture tutup terasa responsif.
        if (dragDistance > 28 || velocityY > 0.06) {
            shouldDragSheet = false;
            springTo(sheetMetrics.dismissY, Math.max(800, velocityY * 1000), closeSheet);
            return;
        }

        // Proyeksikan sedikit (momentum feel)
        const projectedY = currentTranslateY + (velocityY * 180); // proyeksi ringan
        const target = pickSnapPoint(projectedY, velocityY, sheetMetrics);

        // Konversi velocity ke px/s (lebih konsisten)
        const v0 = velocityY * 1000;

        if (target === sheetMetrics.dismissY) {
            springTo(sheetMetrics.dismissY, Math.max(800, v0), closeSheet);
            return;
        }

        shouldDragSheet = false;
        springTo(target, v0);
    };

    // Touch Event (Mobile)
    sheetContent?.addEventListener("touchstart", (e) => {
        onDragStart(e.touches[0].clientY);
    }, { passive: true });

    sheetContent?.addEventListener("touchmove", (e) => {
        if (isDragging && shouldDragSheet) {
            e.preventDefault();
        }
        onDragMove(e.touches[0].clientY);
    }, { passive: false });

    sheetContent?.addEventListener("touchend", onDragEnd);
    sheetContent?.addEventListener("touchcancel", onDragEnd);

    // Pointer Event (Desktop/Android Chrome)
    sheetContent?.addEventListener("pointerdown", (e) => {
        // Batasi ke primary pointer
        if (e.isPrimary === false) return;
        // Capture agar drag tetap jalan walau pointer keluar elemen
        try { sheetContent.setPointerCapture(e.pointerId); } catch (_) {}
        onDragStart(e.clientY);
    });

    sheetContent?.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        if (shouldDragSheet) {
            e.preventDefault();
        }
        onDragMove(e.clientY);
    });

    sheetContent?.addEventListener("pointerup", (e) => {
        try { sheetContent.releasePointerCapture(e.pointerId); } catch (_) {}
        onDragEnd();
    });

    sheetContent?.addEventListener("pointercancel", (e) => {
        try { sheetContent.releasePointerCapture(e.pointerId); } catch (_) {}
        onDragEnd();
    });

    // ====================================================================
    // 2. LOGIKA INTEGRASI AI (GEMINI API PUBLIK)
    // ====================================================================

    const btnBukaAI = document.getElementById("btn-buka-ai");
    const modalAI = document.getElementById("modal-ai");
    const btnTutupAI = document.getElementById("btn-tutup-ai");
    const btnTanyaAI = document.getElementById("btn-tanya-ai");
    const aiInput = document.getElementById("ai-input");
    const aiResponseContainer = document.getElementById("ai-response-container");
    const aiResponseText = document.getElementById("ai-response-text");
    const aiLoader = document.getElementById("ai-loader");
    const autoResizeAIInput = () => {
    if (!aiInput) return;

    const isMobile = window.innerWidth <= 640;
    const minHeight = isMobile ? 48 : 52;
    const maxHeight = isMobile ? 96 : 120;

    aiInput.style.height = "auto";
    const nextHeight = Math.max(minHeight, Math.min(aiInput.scrollHeight, maxHeight));
    aiInput.style.height = `${nextHeight}px`;
    aiInput.style.maxHeight = `${maxHeight}px`;
    aiInput.style.lineHeight = nextHeight > minHeight ? "1.35" : `${minHeight}px`;
    aiInput.style.paddingTop = nextHeight > minHeight ? "12px" : "0";
    aiInput.style.paddingBottom = nextHeight > minHeight ? "12px" : "0";
};

    const aiModalContent = modalAI?.querySelector(".ai-modal-content");
    const aiHeader = modalAI?.querySelector(".ai-header");
    let aiChatThread = null;
    let aiPendingBubble = null;
    let aiSwipeStartY = 0;
    let aiSwipeCurrentY = 0;
    let aiSwipeDragging = false;
    let aiSwipePointerId = null;

    const escapeHTML = (value) => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const formatChatMessage = (value) => escapeHTML(value).replace(/\n/g, "<br>");

    const getCurrentTime = () => {
        try {
            return new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (_) {
            return "";
        }
    };

    const ensureChatThread = () => {
        if (!aiResponseContainer) return null;
        aiResponseContainer.hidden = false;
        aiResponseText.hidden = true;
        aiLoader.hidden = true;

        if (!aiChatThread || !aiResponseContainer.contains(aiChatThread)) {
            aiChatThread = aiResponseContainer.querySelector(".ai-chat-thread");
        }

        if (!aiChatThread) {
            aiChatThread = document.createElement("div");
            aiChatThread.className = "ai-chat-thread";
            aiResponseContainer.innerHTML = "";
            aiResponseContainer.appendChild(aiChatThread);
        }

        return aiChatThread;
    };

    const scrollChatToBottom = () => {
        if (!aiResponseContainer) return;
        requestAnimationFrame(() => {
            aiResponseContainer.scrollTop = aiResponseContainer.scrollHeight;
        });
    };

    const appendChatBubble = (role, html, isLoader = false) => {
        const thread = ensureChatThread();
        if (!thread) return null;

        const row = document.createElement("div");
        row.className = `ai-chat-row ${role === "user" ? "is-user" : "is-ai"}`;

        const bubble = document.createElement("div");
        bubble.className = `ai-chat-bubble ${role === "user" ? "is-user" : "is-ai"}`;

        if (isLoader) {
            bubble.innerHTML = `
                <div class="ai-loader" aria-label="AI sedang mengetik">
                    <span></span><span></span><span></span>
                </div>
            `;
        } else {
            bubble.innerHTML = `
                <div class="ai-chat-text">${html}</div>
                <small class="ai-chat-time">${getCurrentTime()}</small>
            `;
        }

        row.appendChild(bubble);
        thread.appendChild(row);
        scrollChatToBottom();
        return row;
    };

    const removePendingBubble = () => {
        if (aiPendingBubble) {
            aiPendingBubble.remove();
            aiPendingBubble = null;
        }
    };

    const resetAIModalTransform = () => {
        if (!aiModalContent) return;
        aiModalContent.classList.remove("ai-swipe-closing");
        aiModalContent.style.transform = "";
    };

    const closeAIModal = () => {
        modalAI?.classList.remove("muncul");
        document.body.style.overflow = "";
        resetAIModalTransform();
    };

    const onAISwipeStart = (clientY) => {
        if (!modalAI?.classList.contains("muncul") || !aiModalContent) return;
        aiSwipeDragging = true;
        aiSwipeStartY = clientY;
        aiSwipeCurrentY = clientY;
        aiModalContent.classList.add("ai-swipe-closing");
    };

    const onAISwipeMove = (clientY) => {
        if (!aiSwipeDragging || !aiModalContent) return;
        aiSwipeCurrentY = clientY;
        const diffY = Math.max(0, aiSwipeCurrentY - aiSwipeStartY);
        const dampedY = diffY * 0.96;
        const scale = Math.max(0.96, 1 - (diffY / 1400));
        aiModalContent.style.transform = `translateY(${dampedY}px) scale(${scale})`;
    };

    const onAISwipeEnd = () => {
        if (!aiSwipeDragging || !aiModalContent) return;
        const diffY = aiSwipeCurrentY - aiSwipeStartY;
        aiSwipeDragging = false;
        aiSwipePointerId = null;

        if (diffY > 90) {
            aiModalContent.style.transform = "translateY(120%) scale(0.96)";
            window.setTimeout(() => {
                closeAIModal();
            }, 180);
            return;
        }

        resetAIModalTransform();
    };

    // Integrasi kuis ke button di bottom sheet
    const btnKuisSheet = document.getElementById("btn-kuis-sheet");
    btnKuisSheet?.addEventListener("click", () => {
        closeSheet();
        // Memanggil klik dari tombol kuis utama yang ada di huruf.js
        document.getElementById("heroQuizBtn")?.click(); 
    });

    const btnSketchSheet = document.getElementById("btn-sketch-sheet");
    btnSketchSheet?.addEventListener("click", () => {
        closeSheet();
        setTimeout(() => {
            if (typeof window.openTab === "function") {
                window.openTab("sketch");
            } else {
                document.querySelector('[data-tab="sketch"]')?.click();
            }
        }, 120);
    });

    btnBukaAI?.addEventListener("click", () => {
        closeSheet(); // Tutup bottom sheet dulu
        setTimeout(() => {
            modalAI.classList.add("muncul");
            resetAIModalTransform();
        }, 300); // Beri jeda sedikit agar animasi halus
    });

    btnTutupAI?.addEventListener("click", () => {
        closeAIModal();
    });

    // Tutup AI modal jika klik overlay (seperti WhatsApp)
    modalAI?.addEventListener("click", (e) => {
        if (e.target === modalAI) {
            closeAIModal();
        }
    });

    aiHeader?.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        onAISwipeStart(e.touches[0].clientY);
    }, { passive: true });

    aiHeader?.addEventListener("touchmove", (e) => {
        if (!aiSwipeDragging) return;
        e.preventDefault();
        onAISwipeMove(e.touches[0].clientY);
    }, { passive: false });

    aiHeader?.addEventListener("touchend", onAISwipeEnd);
    aiHeader?.addEventListener("touchcancel", onAISwipeEnd);

    aiHeader?.addEventListener("pointerdown", (e) => {
        if (e.isPrimary === false) return;
        aiSwipePointerId = e.pointerId;
        try { aiHeader.setPointerCapture(e.pointerId); } catch (_) {}
        onAISwipeStart(e.clientY);
    });

    aiHeader?.addEventListener("pointermove", (e) => {
        if (!aiSwipeDragging) return;
        if (aiSwipePointerId !== null && e.pointerId !== aiSwipePointerId) return;
        e.preventDefault();
        onAISwipeMove(e.clientY);
    });

    aiHeader?.addEventListener("pointerup", (e) => {
        if (aiSwipePointerId !== null && e.pointerId !== aiSwipePointerId) return;
        try { aiHeader.releasePointerCapture(e.pointerId); } catch (_) {}
        onAISwipeEnd();
    });

    aiHeader?.addEventListener("pointercancel", (e) => {
        if (aiSwipePointerId !== null && e.pointerId !== aiSwipePointerId) return;
        try { aiHeader.releasePointerCapture(e.pointerId); } catch (_) {}
        onAISwipeEnd();
    });

    // MASUKKAN API KEY PUBLIK GEMINI KAMU DI SINI
    // (Karena alasan keamanan platform AI, API Key Publik yang valid selalu berbayar/terikat akun, 
    // jadi silakan generate key gratis di https://aistudio.google.com/ dan tempel di bawah ini)
    const GEMINI_API_KEY = "nanti saja"; 
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    btnTanyaAI?.addEventListener("click", async () => {
        const text = aiInput.value.trim();
        if (!text) return;

        // Persiapan UI saat sedang loading
        btnTanyaAI.disabled = true;
        btnTanyaAI.textContent = "Sedang berpikir...";
        aiResponseContainer.hidden = false;
        aiLoader.hidden = true;
        aiResponseText.hidden = true;
        aiResponseText.innerHTML = "";

        appendChatBubble("user", formatChatMessage(text));
        aiInput.value = "";

        aiPendingBubble = appendChatBubble("ai", "", true);

        const payload = {
            contents: [{
                parts: [{ text: `Kamu adalah asisten ahli bahasa Jepang. Tolong jawab atau koreksi pertanyaan ini secara singkat dan jelas dalam bahasa Indonesia: ${text}` }]
            }]
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gagal mengambil respon dari AI. Pastikan API Key Valid.");

            const data = await response.json();
            const aiAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, AI tidak mengerti maksudmu.";
            
            removePendingBubble();
            appendChatBubble("ai", formatChatMessage(aiAnswer));

        } catch (error) {
            console.error(error);
            removePendingBubble();
            appendChatBubble("ai", formatChatMessage("Terjadi Kesalahan dalam sinkronisasi server."));
        } finally {
            // Kembalikan UI seperti semula
            aiLoader.hidden = true;
            btnTanyaAI.disabled = false;
            btnTanyaAI.textContent = "Tanyakan Sekarang";
            aiInput.focus();
        }
    });

    aiInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            btnTanyaAI?.click();
        }
    });
});
aiInput?.addEventListener("input", autoResizeAIInput);
window.addEventListener("resize", autoResizeAIInput);
autoResizeAIInput();