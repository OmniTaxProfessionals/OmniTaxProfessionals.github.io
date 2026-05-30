/* ============================================================
   OmniTax Professionals — pdf-viewer.js
   Shared full-screen PDF viewer (used by Insights & Our People)
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

    function PdfViewer(options) {
        this.basePath = options.basePath || '';
        this.overlay  = document.getElementById(options.overlayId);
        this.pageArea = document.getElementById(options.pageAreaId);
        this.inner    = document.getElementById(options.pageInnerId);
        this.titleEl  = document.getElementById(options.titleId);
        this.subtitleEl = options.subtitleId ? document.getElementById(options.subtitleId) : null;
        this.curEl    = document.getElementById(options.curPageId);
        this.totEl    = document.getElementById(options.totalPagesId);
        this.countEl  = options.countId ? document.getElementById(options.countId) : null;
        this.prevBtn  = document.getElementById(options.prevId);
        this.nextBtn  = document.getElementById(options.nextId);
        this.closeBtn = document.getElementById(options.closeId);
        this.state    = { pdf: null, cur: 1, tot: 0 };
        this._bindEvents();
    }

    PdfViewer.prototype._bindEvents = function () {
        var self = this;

        this.prevBtn.addEventListener('click', function () {
            if (self.state.cur > 1) self.showPage(self.state.cur - 1);
        });
        this.nextBtn.addEventListener('click', function () {
            if (self.state.cur < self.state.tot) self.showPage(self.state.cur + 1);
        });
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

    PdfViewer.prototype.showLoading = function () {
        this.inner.innerHTML = '<div class="pdf-viewer__loading"><div class="pdf-viewer__spinner"></div></div>';
    };

    PdfViewer.prototype.open = async function (doc) {
        this.titleEl.textContent = doc.title || '';
        if (this.subtitleEl) this.subtitleEl.textContent = doc.subtitle || '';
        this.curEl.textContent = '1';
        this.totEl.textContent = '—';
        if (this.countEl) this.countEl.textContent = '— / —';
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        this.showLoading();

        this.overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        var url = resolvePdfUrl(this.basePath, doc.file);

        try {
            this.state.pdf = await pdfjsLib.getDocument({ url: url }).promise;
            this.state.cur = 1;
            this.state.tot = this.state.pdf.numPages;
            this.totEl.textContent = this.state.tot;
            await this.showPage(1);
        } catch (e) {
            this.inner.innerHTML = '<p class="pdf-viewer__error">Could not load document.</p>';
        }
    };

    PdfViewer.prototype.showPage = async function (n) {
        this.showLoading();
        this.pageArea.scrollTop = 0;

        var page = await this.state.pdf.getPage(n);
        var dpr  = window.devicePixelRatio || 1;
        var containerW = Math.min(this.inner.clientWidth || 820, 820);
        var vp0  = page.getViewport({ scale: 1 });
        var scale = (containerW / vp0.width) * dpr;
        var vp   = page.getViewport({ scale });

        var canvas = document.createElement('canvas');
        canvas.width  = vp.width;
        canvas.height = vp.height;
        canvas.style.width  = (vp.width  / dpr) + 'px';
        canvas.style.height = (vp.height / dpr) + 'px';
        canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

        this.inner.innerHTML = '';
        this.inner.appendChild(canvas);

        this.state.cur = n;
        this.curEl.textContent = n;
        if (this.countEl) this.countEl.textContent = n + ' / ' + this.state.tot;
        this.prevBtn.disabled = n <= 1;
        this.nextBtn.disabled = n >= this.state.tot;
    };

    PdfViewer.prototype.close = function () {
        this.overlay.classList.remove('open');
        document.body.style.overflow = '';
        if (this.state.pdf) {
            this.state.pdf.destroy();
            this.state.pdf = null;
        }
        this.inner.innerHTML = '';
    };

    PdfViewer.prototype.isOpen = function () {
        return this.overlay.classList.contains('open');
    };

    global.PdfViewer = PdfViewer;
})(window);
