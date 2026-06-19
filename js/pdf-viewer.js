/* ============================================================
   OmniTax Professionals — pdf-viewer.js
   Shared full-screen PDF viewer (used by Insights & Our People)
   Character-select layout with adjacent page previews
   Requires: pdf.js loaded before this script
   ============================================================ */

(function (global) {
    'use strict';

    if (!global.pdfjsLib) {
        console.warn('pdf-viewer.js: pdf.js not loaded');
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    function resolvePdfUrl(basePath, file) {
        if (!file) return '';
        if (/^https?:\/\//i.test(file)) return file;
        if (file.startsWith('/') || file.startsWith('assets/')) return file;
        return (basePath || '') + encodeURIComponent(file);
    }

    function padPage(n) {
        return String(n).padStart(2, '0');
    }

    function PdfViewer(options) {
        this.basePath = options.basePath || '';
        this.overlay  = document.getElementById(options.overlayId);
        this.pageArea = document.getElementById(options.pageAreaId);
        this.titleEl  = document.getElementById(options.titleId);
        this.subtitleEl = options.subtitleId ? document.getElementById(options.subtitleId) : null;
        this.curEl    = document.getElementById(options.curPageId);
        this.totEl    = document.getElementById(options.totalPagesId);
        this.countEl  = options.countId ? document.getElementById(options.countId) : null;
        this.prevBtn  = document.getElementById(options.prevId);
        this.nextBtn  = document.getElementById(options.nextId);
        this.closeBtn = document.getElementById(options.closeId);

        this.mainFrame  = this.overlay.querySelector('.pdf-viewer__frame--main');
        this.prevFrame  = this.overlay.querySelector('.pdf-viewer__frame--prev');
        this.nextFrame  = this.overlay.querySelector('.pdf-viewer__frame--next');
        this.prevPanel  = this.overlay.querySelector('.pdf-viewer__panel--prev');
        this.nextPanel  = this.overlay.querySelector('.pdf-viewer__panel--next');
        this.dockPrev   = this.overlay.querySelector('.pdf-viewer__dock-frame--prev');
        this.dockNext   = this.overlay.querySelector('.pdf-viewer__dock-frame--next');
        this.progressBar = this.overlay.querySelector('.pdf-viewer__progress-bar');
        this.activeTag  = this.overlay.querySelector('.pdf-viewer__panel-tag--active');

        this.state = { pdf: null, cur: 1, tot: 0, rendering: false };
        this._cache = { main: new Map(), preview: new Map() };
        this._bindEvents();
    }

    PdfViewer.prototype._bindEvents = function () {
        var self = this;

        function goPrev() {
            if (self.state.cur > 1) self.showPage(self.state.cur - 1);
        }
        function goNext() {
            if (self.state.cur < self.state.tot) self.showPage(self.state.cur + 1);
        }

        this.prevBtn.addEventListener('click', goPrev);
        this.nextBtn.addEventListener('click', goNext);

        if (this.prevPanel) {
            this.prevPanel.addEventListener('click', goPrev);
        }
        if (this.nextPanel) {
            this.nextPanel.addEventListener('click', goNext);
        }

        var dockPrevCard = this.overlay.querySelector('.pdf-viewer__dock-card--prev');
        var dockNextCard = this.overlay.querySelector('.pdf-viewer__dock-card--next');
        if (dockPrevCard) dockPrevCard.addEventListener('click', goPrev);
        if (dockNextCard) dockNextCard.addEventListener('click', goNext);

        this.closeBtn.addEventListener('click', function () { self.close(); });
        this.overlay.addEventListener('click', function (e) {
            if (e.target === self.overlay) self.close();
        });
        document.addEventListener('keydown', function (e) {
            if (!self.overlay.classList.contains('open')) return;
            if (e.key === 'Escape') self.close();
            if (e.key === 'ArrowRight' && self.state.cur < self.state.tot) self.showPage(self.state.cur + 1);
            if (e.key === 'ArrowLeft'  && self.state.cur > 1)          self.showPage(self.state.cur - 1);
        });
    };

    PdfViewer.prototype._getMainWidth = function () {
        var isMobile = window.matchMedia('(max-width: 768px)').matches;
        var desktopMax = 980;

        if (isMobile) {
            var mobileW = this.mainFrame ? this.mainFrame.clientWidth : 0;
            return mobileW || Math.min(window.innerWidth - 32, 680);
        }

        var w = this.mainFrame ? this.mainFrame.clientWidth : 0;
        if (!w) {
            w = Math.min(Math.floor(window.innerWidth * 0.56), desktopMax);
        }
        return Math.min(w || desktopMax, desktopMax);
    };

    PdfViewer.prototype._cloneCanvas = function (source) {
        var copy = document.createElement('canvas');
        copy.width = source.width;
        copy.height = source.height;
        copy.style.width = source.style.width;
        copy.style.height = source.style.height;
        copy.getContext('2d').drawImage(source, 0, 0);
        copy.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        return copy;
    };

    PdfViewer.prototype._renderPage = async function (pageNum, maxWidth, cacheKey) {
        var cache = cacheKey === 'main' ? this._cache.main : this._cache.preview;
        if (cache.has(pageNum)) {
            return this._cloneCanvas(cache.get(pageNum));
        }

        var page = await this.state.pdf.getPage(pageNum);
        var dpr  = window.devicePixelRatio || 1;
        var vp0  = page.getViewport({ scale: 1 });
        var scale = (maxWidth / vp0.width) * dpr;
        var vp   = page.getViewport({ scale });

        var canvas = document.createElement('canvas');
        canvas.width  = vp.width;
        canvas.height = vp.height;
        canvas.style.width  = (vp.width  / dpr) + 'px';
        canvas.style.height = (vp.height / dpr) + 'px';
        canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        cache.set(pageNum, canvas);
        return this._cloneCanvas(canvas);
    };

    PdfViewer.prototype.showLoading = function () {
        if (!this.mainFrame) return;
        this.mainFrame.innerHTML = '<div class="pdf-viewer__loading"><div class="pdf-viewer__spinner"></div></div>';
        this.mainFrame.classList.add('pdf-viewer__frame--loading');
    };

    PdfViewer.prototype._setPreviewFrame = async function (frame, pageNum, maxW, empty) {
        if (!frame) return;

        if (empty) {
            frame.classList.add('pdf-viewer__frame--empty');
            frame.innerHTML = '<div class="pdf-viewer__frame-ghost"><span>—</span></div>';
            return;
        }

        frame.classList.remove('pdf-viewer__frame--empty');
        frame.innerHTML = '<div class="pdf-viewer__frame-shimmer"></div>';
        var canvas = await this._renderPage(pageNum, maxW, 'preview');
        frame.innerHTML = '';
        frame.appendChild(canvas);
    };

    PdfViewer.prototype._updateHud = function (n) {
        this.curEl.textContent = padPage(n);
        if (this.countEl) this.countEl.textContent = padPage(n) + ' / ' + padPage(this.state.tot);
        if (this.activeTag) this.activeTag.textContent = 'PAGE ' + padPage(n);
        if (this.progressBar && this.state.tot > 0) {
            this.progressBar.style.width = ((n / this.state.tot) * 100) + '%';
        }

        var atStart = n <= 1;
        var atEnd   = n >= this.state.tot;

        this.prevBtn.disabled = atStart;
        this.nextBtn.disabled = atEnd;

        if (this.prevPanel) {
            this.prevPanel.disabled = atStart;
            this.prevPanel.classList.toggle('pdf-viewer__panel--disabled', atStart);
        }
        if (this.nextPanel) {
            this.nextPanel.disabled = atEnd;
            this.nextPanel.classList.toggle('pdf-viewer__panel--disabled', atEnd);
        }

        var dockPrevCard = this.overlay.querySelector('.pdf-viewer__dock-card--prev');
        var dockNextCard = this.overlay.querySelector('.pdf-viewer__dock-card--next');
        if (dockPrevCard) dockPrevCard.disabled = atStart;
        if (dockNextCard) dockNextCard.disabled = atEnd;
    };

    PdfViewer.prototype.open = async function (doc) {
        this.titleEl.textContent = doc.title || '';
        if (this.subtitleEl) this.subtitleEl.textContent = doc.subtitle || '';
        this.curEl.textContent = '01';
        this.totEl.textContent = '—';
        if (this.countEl) this.countEl.textContent = '— / —';
        if (this.progressBar) this.progressBar.style.width = '0%';
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        this._cache.main.clear();
        this._cache.preview.clear();
        this.showLoading();

        this.overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        var url = resolvePdfUrl(this.basePath, doc.file);

        try {
            this.state.pdf = await pdfjsLib.getDocument({ url: url }).promise;
            this.state.cur = 1;
            this.state.tot = this.state.pdf.numPages;
            this.totEl.textContent = padPage(this.state.tot);
            await this.showPage(1);
        } catch (e) {
            if (this.mainFrame) {
                this.mainFrame.innerHTML = '<p class="pdf-viewer__error">Could not load document.</p>';
            }
        }
    };

    PdfViewer.prototype.showPage = async function (n) {
        if (!this.state.pdf || n < 1 || n > this.state.tot || this.state.rendering) return;

        var direction = n > this.state.cur ? 'forward' : n < this.state.cur ? 'back' : '';
        this.state.rendering = true;
        this._updateHud(n);

        this.pageArea.scrollTop = 0;
        this.overlay.classList.add('pdf-viewer--transition');
        if (direction) {
            this.overlay.classList.remove('pdf-viewer--forward', 'pdf-viewer--back');
            this.overlay.classList.add(direction === 'forward' ? 'pdf-viewer--forward' : 'pdf-viewer--back');
        }

        this.showLoading();

        var mainW    = this._getMainWidth();
        var previewW = window.matchMedia('(max-width: 768px)').matches ? 72 : 168;

        try {
            var mainCanvas = await this._renderPage(n, mainW, 'main');
            this.mainFrame.classList.remove('pdf-viewer__frame--loading');
            this.mainFrame.innerHTML = '';
            this.mainFrame.appendChild(mainCanvas);

            await Promise.all([
                this._setPreviewFrame(this.prevFrame, n - 1, previewW, n <= 1),
                this._setPreviewFrame(this.nextFrame, n + 1, previewW, n >= this.state.tot),
                this._setPreviewFrame(this.dockPrev, n - 1, previewW, n <= 1),
                this._setPreviewFrame(this.dockNext, n + 1, previewW, n >= this.state.tot)
            ]);

            this.state.cur = n;
        } finally {
            this.state.rendering = false;
            requestAnimationFrame(function () {
                this.overlay.classList.remove('pdf-viewer--transition');
            }.bind(this));
        }
    };

    PdfViewer.prototype.close = function () {
        this.overlay.classList.remove('open', 'pdf-viewer--forward', 'pdf-viewer--back', 'pdf-viewer--transition');
        document.body.style.overflow = '';
        if (this.state.pdf) {
            this.state.pdf.destroy();
            this.state.pdf = null;
        }
        this._cache.main.clear();
        this._cache.preview.clear();
        if (this.mainFrame) this.mainFrame.innerHTML = '';
        if (this.prevFrame) this.prevFrame.innerHTML = '';
        if (this.nextFrame) this.nextFrame.innerHTML = '';
        if (this.dockPrev) this.dockPrev.innerHTML = '';
        if (this.dockNext) this.dockNext.innerHTML = '';
    };

    PdfViewer.prototype.isOpen = function () {
        return this.overlay.classList.contains('open');
    };

    global.PdfViewer = PdfViewer;
})(window);
