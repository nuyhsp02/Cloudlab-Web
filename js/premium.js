(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const progress = document.createElement('div');
    progress.className = 'premium-progress';
    document.body.appendChild(progress);

    const noise = document.createElement('div');
    noise.className = 'premium-noise';
    noise.setAttribute('aria-hidden', 'true');
    document.body.appendChild(noise);

    const setScrollProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--scroll', Math.max(0, Math.min(1, p)));
        document.documentElement.style.setProperty('--hero-shift', Math.min(44, window.scrollY * .05));
    };
    setScrollProgress();
    window.addEventListener('scroll', setScrollProgress, { passive: true });

    if (!reduced && window.matchMedia('(pointer:fine)').matches) {
        window.addEventListener('pointermove', (e) => {
            document.documentElement.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
            document.documentElement.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
        }, { passive: true });

        const tiltTargets = document.querySelectorAll('.value-card, .course-card, .member-card, .professor-card, .lab-project-card');
        tiltTargets.forEach((card) => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                const rx = (0.5 - y) * 2.6;
                const ry = (x - 0.5) * 3.4;
                card.style.setProperty('--cx', `${x * 100}%`);
                card.style.setProperty('--cy', `${y * 100}%`);
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px) scale(1.008)`;
            });
            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    document.querySelectorAll('.value-grid, .member-grid, .course-grid').forEach((grid) => {
        [...grid.children].forEach((el, i) => {
            if (el.classList.contains('reveal')) el.dataset.stagger = String((i % 4) + 1);
        });
    });

})();
