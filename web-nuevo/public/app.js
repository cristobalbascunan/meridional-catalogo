/* JS mínimo: menú móvil, buscador/filtros del catálogo y lista de presupuesto. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KEY = 'mp-presupuesto';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };

$('.burger')?.addEventListener('click', (e) => {
  const open = $('nav.main').classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});

// Contador de la lista de presupuesto
const paintCount = () => {
  const n = load().length;
  $$('.qcount').forEach((el) => { el.textContent = n; el.classList.toggle('on', n > 0); });
};
paintCount();

// Buscador de la cabecera → catálogo
$('.hsearch')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('input', e.currentTarget).value.trim();
  location.href = '/catalogo/' + (q ? '?q=' + encodeURIComponent(q) : '');
});

// Catálogo: búsqueda + categoría + etiquetas
const search = $('#buscar');
if (search) {
  const cards = $$('.pcard[data-cat]');
  const params = new URLSearchParams(location.search);
  let cat = params.get('cat') || 'all';
  search.value = params.get('q') || '';
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const run = () => {
    const terms = norm(search.value.trim()).split(/\s+/).filter(Boolean);
    const tags = $$('.side input[type=checkbox]:checked').map((c) => c.value);
    let n = 0;
    cards.forEach((c) => {
      const ok =
        (cat === 'all' || c.dataset.cat === cat) &&
        terms.every((t) => c.dataset.text.includes(t)) &&
        (tags.length === 0 || tags.some((t) => c.dataset.tags.split('|').includes(t)));
      c.style.display = ok ? '' : 'none';
      if (ok) n++;
    });
    $('#vacio').style.display = n ? 'none' : 'block';
    $('#cuenta').textContent = n + (n === 1 ? ' producto' : ' productos');
    $$('.side button[data-cat]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
  };
  search.addEventListener('input', run);
  $$('.side input[type=checkbox]').forEach((c) => c.addEventListener('change', run));
  $$('.side button[data-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; run(); }));
  run();
}

// Añadir a la lista
$$('[data-add]').forEach((b) => b.addEventListener('click', () => {
  const list = load();
  if (!list.includes(b.dataset.add)) list.push(b.dataset.add);
  save(list);
  paintCount();
  b.textContent = '✓ Añadido a mi presupuesto';
}));

// Formulario
const form = $('form.quote');
if (form) {
  const names = JSON.parse($('#nombres').textContent);
  const list = load().filter((id) => names[id]);
  if (list.length) {
    const box = $('#qlist');
    box.hidden = false;
    $('ul', box).innerHTML = list.map((id) => `<li>${names[id]}</li>`).join('');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const body = [
      `Nombre: ${f.get('nombre')}`,
      `Empresa: ${f.get('empresa')}`,
      `Teléfono: ${f.get('telefono')}`,
      `Código postal de entrega: ${f.get('cp')}`,
      list.length ? `Productos: ${list.map((id) => names[id]).join(', ')}` : '',
      '',
      f.get('mensaje'),
    ].join('\n');
    location.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent('Solicitud de presupuesto')}&body=${encodeURIComponent(body)}`;
  });
}
