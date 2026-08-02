/**
 * Focus Mode — Single Kana Overlay + Practice Canvas
 */

class KanaFocusMode {
  constructor() {
    this.overlay = document.getElementById("focusModeOverlay");
    this.canvas = document.getElementById("focusCanvas");
    this.wrapper = document.getElementById("focusCanvasWrapper");

    this.kanaEl = document.getElementById("focusKana");
    this.romajiEl = document.getElementById("focusRomaji");

    if (!this.overlay || !this.canvas) {
      console.warn("[FocusMode] Elemen overlay/canvas tidak ditemukan.");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;

    this.zoomLevel = 1;
    this.strokes = [];
    this.currentStroke = null;
    this.isDrawing = false;

    this.baseWidth = 0;
    this.baseHeight = 0;

    this._setupDOMEvents();
    this._setupCanvasEvents();
    this._setupZoomControls();
  }

  /* =========================
     DOM EVENTS
  ========================= */

  _setupDOMEvents() {
    this.overlay
      .querySelector(".focus-mode-close")
      ?.addEventListener("click", () => this.close());

    this.overlay.addEventListener("click", (e) => {
      if (
        e.target === this.overlay ||
        e.target.classList.contains("focus-mode-backdrop")
      ) {
        this.close();
      }
    });

    document
      .getElementById("focusCloseBtn")
      ?.addEventListener("click", () => this.close());

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.overlay.classList.contains("active")
      ) {
        this.close();
      }
    });

    window.addEventListener("popstate", () => {
      if (this.overlay.classList.contains("active")) {
        this._closeWithoutHistory();
      }
    });

    window.addEventListener("resize", () => {
      if (this.overlay.classList.contains("active")) {
        this._resizeCanvas();
      }
    });
  }

  /* =========================
     ZOOM
  ========================= */

  _setupZoomControls() {
    document
      .getElementById("focusZoomIn")
      ?.addEventListener("click", () => {
        this._setZoom(0.25);
      });

    document
      .getElementById("focusZoomOut")
      ?.addEventListener("click", () => {
        this._setZoom(-0.25);
      });

    document
      .getElementById("focusClear")
      ?.addEventListener("click", () => {
        this.clearCanvas();
      });
  }

  _setZoom(delta) {
    const oldZoom = this.zoomLevel;

    const newZoom = Math.max(
      0.5,
      Math.min(2.5, oldZoom + delta)
    );

    if (newZoom === oldZoom) return;

    this.zoomLevel = newZoom;
    this._redraw();
  }

  /* =========================
     CANVAS
  ========================= */

  _setupCanvasEvents() {
    this.canvas.style.touchAction = "none";

    this.canvas.addEventListener(
      "pointerdown",
      (e) => this._startDrawing(e)
    );

    this.canvas.addEventListener(
      "pointermove",
      (e) => this._draw(e)
    );

    this.canvas.addEventListener(
      "pointerup",
      (e) => this._stopDrawing(e)
    );

    this.canvas.addEventListener(
      "pointerleave",
      (e) => this._stopDrawing(e)
    );

    this.canvas.addEventListener(
      "pointercancel",
      (e) => this._stopDrawing(e)
    );
  }

  _resizeCanvas() {
    if (!this.wrapper || !this.canvas) return;

    const rect = this.wrapper.getBoundingClientRect();

    this.baseWidth = rect.width;
    this.baseHeight = rect.height;

    this.canvas.width = Math.round(
      this.baseWidth * this.dpr
    );

    this.canvas.height = Math.round(
      this.baseHeight * this.dpr
    );

    this.canvas.style.width = `${this.baseWidth}px`;
    this.canvas.style.height = `${this.baseHeight}px`;

    this._redraw();
  }

  /* =========================
     KOORDINAT
  ========================= */

  _getPoint(e) {
    const rect = this.canvas.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom dipusatkan ke tengah canvas
    const x =
      (mouseX - centerX) / this.zoomLevel +
      this.baseWidth / 2;

    const y =
      (mouseY - centerY) / this.zoomLevel +
      this.baseHeight / 2;

    return { x, y };
  }

  /* =========================
     DRAWING
  ========================= */

  _startDrawing(e) {
    e.preventDefault();

    this.isDrawing = true;

    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    const point = this._getPoint(e);

    this.currentStroke = [point];
  }

  _draw(e) {
    if (
      !this.isDrawing ||
      !this.currentStroke ||
      !this.ctx
    ) {
      return;
    }

    e.preventDefault();

    const point = this._getPoint(e);

    this.currentStroke.push(point);

    this._redraw();
  }

  _stopDrawing(e) {
    if (!this.isDrawing) return;

    this.isDrawing = false;

    if (
      this.currentStroke &&
      this.currentStroke.length > 0
    ) {
      this.strokes.push([
        ...this.currentStroke
      ]);
    }

    this.currentStroke = null;

    try {
      this.canvas.releasePointerCapture?.(
        e.pointerId
      );
    } catch (_) {}
  }

  /* =========================
     REDRAW
  ========================= */

  _redraw() {
    if (!this.ctx) return;

    const ctx = this.ctx;

    ctx.setTransform(
      this.dpr,
      0,
      0,
      this.dpr,
      0,
      0
    );

    ctx.clearRect(
      0,
      0,
      this.baseWidth,
      this.baseHeight
    );

    // Zoom dari titik tengah
    ctx.translate(
      this.baseWidth / 2,
      this.baseHeight / 2
    );

    ctx.scale(
      this.zoomLevel,
      this.zoomLevel
    );

    ctx.translate(
      -this.baseWidth / 2,
      -this.baseHeight / 2
    );

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "#f5f1e8";

    // Supaya ketebalan tetap konsisten
    ctx.lineWidth = 3 / this.zoomLevel;

    for (const stroke of this.strokes) {
      if (stroke.length < 2) continue;

      ctx.beginPath();

      ctx.moveTo(
        stroke[0].x,
        stroke[0].y
      );

      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(
          stroke[i].x,
          stroke[i].y
        );
      }

      ctx.stroke();
    }

    // Gambar stroke yang sedang dibuat
    if (
      this.currentStroke &&
      this.currentStroke.length > 1
    ) {
      ctx.beginPath();

      ctx.moveTo(
        this.currentStroke[0].x,
        this.currentStroke[0].y
      );

      for (
        let i = 1;
        i < this.currentStroke.length;
        i++
      ) {
        ctx.lineTo(
          this.currentStroke[i].x,
          this.currentStroke[i].y
        );
      }

      ctx.stroke();
    }
  }

  /* =========================
     CLEAR
  ========================= */

  clearCanvas() {
    this.strokes = [];
    this.currentStroke = null;
    this.isDrawing = false;

    this._redraw();
  }

  /* =========================
     OPEN / CLOSE
  ========================= */

  open(kana, romaji) {
    if (!this.overlay) return;

    this.kanaEl.textContent = kana || "";
    this.romajiEl.textContent = romaji || "";

    this.clearCanvas();

    this.zoomLevel = 1;

    history.pushState(
      { focusMode: true },
      "",
      location.href
    );

    this.overlay.classList.add("active");

    this.overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      this._resizeCanvas();
    });
  }

  close() {
    if (!this.overlay) return;

    if (
      history.state &&
      history.state.focusMode
    ) {
      history.back();
      return;
    }

    this._closeWithoutHistory();
  }

  _closeWithoutHistory() {
    this.overlay.classList.remove("active");

    this.overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

    this.isDrawing = false;
    this.currentStroke = null;
  }
}


/* =========================
   INIT
========================= */

let kanaFocusMode;

document.addEventListener(
  "DOMContentLoaded",
  () => {
    kanaFocusMode = new KanaFocusMode();

    // Bisa dipanggil dari huruf.js
    window.kanaFocusMode = kanaFocusMode;
  }
);