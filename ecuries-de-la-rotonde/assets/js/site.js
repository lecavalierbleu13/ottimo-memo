(() => {
  /* Adresse e-mail assemblée au chargement : elle n'apparaît pas en clair dans le code de la page */
  const mail = ['contact', 'ecuriesdelarotonde.fr'].join('@');
  document.querySelectorAll('[data-mail]').forEach((el) => {
    el.setAttribute('href', 'mailto:' + mail);
    if (el.hasAttribute('data-mail-text')) el.textContent = mail;
  });

  /* Apparition des blocs au défilement */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealables = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* Année du pied de page */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
