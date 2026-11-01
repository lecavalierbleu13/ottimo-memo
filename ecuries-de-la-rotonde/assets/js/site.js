(() => {
  /* Adresse e-mail assemblée au chargement : elle n'apparaît pas en clair dans le code de la page */
  const mail = ['contact', 'ecuriesdelarotonde.fr'].join('@');
  document.querySelectorAll('[data-mail]').forEach((el) => {
    el.setAttribute('href', 'mailto:' + mail);
    if (el.hasAttribute('data-mail-text')) el.textContent = mail;
  });

  const hasIO = 'IntersectionObserver' in window;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : transparent sur l'ouverture, crème ensuite */
  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');
  if (header && hero && hasIO) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry.isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px', threshold: 0.02 }).observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
  }

  /* Menu mobile plein écran */
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  if (btn && menu) {
    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Fermer' : 'Menu';
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (open) { const first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    };
    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
    });
  }

  /* Lien du menu correspondant à la section affichée */
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (hasIO && links.length) {
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((a) => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* Apparitions au défilement */
  const animated = document.querySelectorAll('[data-reveal], [data-mask]');
  if (!reduceMotion && hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add('is-in'));
  }

  /* Année du pied de page */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
