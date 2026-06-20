/* ============================================================
   OmniTax Professionals — legal-pdf.js
   Inline high-DPI PDF renderer for Privacy Policy & Terms pages
   Requires: pdf.js loaded before this script
   ============================================================ */

(function (global) {
    'use strict';

    if (!global.pdfjsLib) {
        console.warn('legal-pdf.js: pdf.js not loaded');
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    async function renderLegalPdf(container, url) {
        if (!container) return;

        container.innerHTML = '<div class="legal-pdf-embed__loading"><div class="pdf-viewer__spinner"></div></div>';

        try {
            const pdf = await pdfjsLib.getDocument(url).promise;
            container.innerHTML = '';
            const dpr = window.devicePixelRatio || 1;
            const maxWidth = container.clientWidth || Math.min(window.innerWidth - 48, 820);

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const vp0 = page.getViewport({ scale: 1 });
                const scale = (maxWidth / vp0.width) * dpr;
                const vp = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                canvas.className = 'legal-pdf-embed__page';
                canvas.width = vp.width;
                canvas.height = vp.height;
                canvas.style.width = maxWidth + 'px';
                canvas.style.height = (vp.height / dpr) + 'px';
                canvas.setAttribute('aria-label', 'Page ' + i + ' of ' + pdf.numPages);

                await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
                container.appendChild(canvas);
            }
        } catch (e) {
            container.innerHTML = '<p class="legal-pdf-embed__error">Could not load document. Please refresh the page or try again later.</p>';
        }
    }

    global.renderLegalPdf = renderLegalPdf;
})(window);
