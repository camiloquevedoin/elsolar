// El Solar – interacciones mínimas
(function () {
  // Header con fondo al hacer scroll
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú en celular
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  // Abierto / cerrado según la hora de Colombia (lun–sáb 8:00–15:00)
  const statusEl = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const day = get('weekday');               // Mon..Sun
    const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    const workday = day !== 'Sun';
    if (workday && mins >= 480 && mins < 900) {
      statusEl.classList.add('is-open');
      statusText.textContent = 'Abierto ahora · domicilios hasta las 3:00 p. m.';
    } else if (workday && mins < 480) {
      statusText.textContent = 'Hoy abrimos a las 8:00 a. m.';
    } else {
      const tomorrowOpen = day !== 'Sat';
      statusText.textContent = tomorrowOpen
        ? 'Cerrado ahora · mañana desde las 8:00 a. m.'
        : 'Cerrado ahora · el lunes desde las 8:00 a. m.';
    }
  } catch (e) { /* deja el horario fijo */ }

  // Resaltar sección activa en el menú
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // Aparición suave
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
