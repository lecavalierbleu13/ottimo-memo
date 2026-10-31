(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : fond visible dès que le haut de page est dépassé */
  const header = document.querySelector('.site-header');
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none';
  document.body.prepend(sentinel);
  if (header && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* Menu mobile */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const icon = toggle.querySelector('use');
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      if (icon) icon.setAttribute('href', open ? '#i-close' : '#i-menu');
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', (mq) => { if (mq.matches) setOpen(false); });
  }

  /* Apparition des blocs au défilement */
  const revealables = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* Pensions : le panneau survolé, cliqué ou focalisé s'ouvre */
  const panelGroup = document.querySelector('[data-panels]');
  if (panelGroup) {
    const panels = [...panelGroup.querySelectorAll('.panel')];
    const wide = window.matchMedia('(min-width: 901px)');
    const activate = (panel) => panels.forEach((p) => p.classList.toggle('is-active', p === panel));
    panels.forEach((panel) => {
      panel.addEventListener('mouseenter', () => { if (wide.matches) activate(panel); });
      panel.addEventListener('focusin', () => activate(panel));
      panel.addEventListener('click', () => activate(panel));
      panel.addEventListener('keydown', (e) => {
        const i = panels.indexOf(panel);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); panels[(i + 1) % panels.length].focus(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); panels[(i - 1 + panels.length) % panels.length].focus(); }
      });
    });
  }

  /* Formulaire : vérification, puis ouverture de la messagerie */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const rules = {
      nom: (v) => (v.trim().length >= 2 ? '' : 'Indiquez votre nom.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Indiquez une adresse e-mail valide.'),
      message: (v) => (v.trim().length >= 10 ? '' : 'Votre message est un peu court.'),
    };
    const check = (name) => {
      const field = form.elements[name];
      const msg = rules[name](field.value);
      const err = document.getElementById('e-' + name);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach((name) => {
      form.elements[name].addEventListener('blur', () => { if (form.elements[name].value) check(name); });
      form.elements[name].addEventListener('input', () => {
        if (form.elements[name].getAttribute('aria-invalid') === 'true') check(name);
      });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        status.textContent = '';
        return;
      }
      const f = form.elements;
      const subject = `${f.objet.value} : demande de ${f.nom.value.trim()}`;
      const body = [
        f.message.value.trim(),
        '',
        '---',
        `Nom : ${f.nom.value.trim()}`,
        `E-mail : ${f.email.value.trim()}`,
        f.telephone.value.trim() ? `Téléphone : ${f.telephone.value.trim()}` : '',
      ].filter((line, i, arr) => !(line === '' && i === arr.length - 1)).join('\n');
      window.location.href = `mailto:contact@ecuriesdelarotonde.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Votre messagerie s’ouvre avec le message prêt à partir. Si rien ne se passe, écrivez-nous directement à contact@ecuriesdelarotonde.fr.';
    });
  }

  /* Année du pied de page */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
