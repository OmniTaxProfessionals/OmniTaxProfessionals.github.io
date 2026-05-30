/* ============================================================
   OmniTax Professionals — main.js
   Handles: scroll animations, hero parallax, trust counters
   ============================================================ */

/* ── Scroll-reveal (Intersection Observer) ──────────────────── */
(function () {
    const elements = document.querySelectorAll('.animate-hidden');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
})();

/* ── Hero gradient parallax ─────────────────────────────────── */
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const onScroll = () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.5) {
            hero.style.setProperty('--parallax-offset', scrolled * 0.25 + 'px');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Trust counter animation ─────────────────────────────────── */
(function () {
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;

        const duration = 1200;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
})();

/* ── Navbar — close mobile menu when returning to desktop width ── */
(function () {
    const NAV_DESKTOP_MIN = 1101;
    const mobileNav = document.getElementById('mobileNav');
    const navToggle = document.getElementById('navToggle');
    if (!mobileNav || !navToggle) return;

    function closeMobileNav() {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth >= NAV_DESKTOP_MIN) closeMobileNav();
    }, { passive: true });
})();

/* ── Form character limits (contact & careers) ─────────────── */
(function () {
    const FORM_CHAR_LIMIT = 4000;
    const FORMS = ['#contactForm', '#careersForm'];

    function initCharLimits(form) {
        const fields = form.querySelectorAll(
            'input:not([type="hidden"]):not([type="file"]), textarea'
        );

        fields.forEach((field) => {
            field.maxLength = FORM_CHAR_LIMIT;

            const counter = document.createElement('span');
            const counterId = `${field.id || field.name}-char-count`;
            counter.id = counterId;
            counter.className = 'contact-form__char-count';
            counter.setAttribute('aria-live', 'polite');
            field.setAttribute('aria-describedby', counterId);

            const update = () => {
                const len = field.value.length;
                counter.textContent = `${len} / ${FORM_CHAR_LIMIT}`;
                counter.classList.toggle('contact-form__char-count--limit', len >= FORM_CHAR_LIMIT);
            };

            field.addEventListener('input', update);
            field.parentElement.appendChild(counter);
            update();
        });
    }

    FORMS.forEach((selector) => {
        const form = document.querySelector(selector);
        if (form) initCharLimits(form);
    });
})();
