import { numero, nombre, canales } from '@params';

const waUrl = (text) => `https://wa.me/${numero}?text=${encodeURIComponent(text)}`;

// Canal de origen: ?desde=facebook|volante|google|estado (sin parámetro, o uno desconocido: web).
const desde = new URLSearchParams(location.search).get('desde');
const firma = canales[desde] ?? canales.web;
if (canales[desde]) {
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waUrl(`Hola ${nombre}. ${firma}`); });
}

// Armador del mensaje. Sin JS, el botón abre WhatsApp con el saludo genérico.
const lista = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} y ${items.at(-1)}` : items[0]);
const builder = document.querySelector('[data-builder]');
if (builder) {
  const preview = builder.querySelector('[data-preview]');
  const link = document.querySelector('[data-wa-builder]');
  const update = () => {
    const f = new FormData(builder);
    const que = f.getAll('que');
    const text = `Hola ${nombre}, necesito ${que.length ? lista(que) : 'una visita'} en ${f.get('donde')}, ${f.get('cuando')}. ${firma}`;
    preview.textContent = text;
    link.href = waUrl(text);
  };
  builder.addEventListener('change', update);
  update();
}

// Entradas escalonadas, una vez por sección.
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.setProperty('--i', i);
      el.classList.add('is-in');
    });
    io.unobserve(e.target);
  }
}, { threshold: 0.12 });
document.querySelectorAll('.chapter, .footer').forEach((s) => io.observe(s));

// La barra toma el fondo y la tinta del capítulo que tiene debajo.
const bar = document.querySelector('.bar');
const chapters = [...document.querySelectorAll('.chapter, .footer')];
const paint = () => {
  const y = bar.offsetHeight / 2;
  const under = chapters.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= y && r.bottom > y;
  });
  if (!under) return;
  const cs = getComputedStyle(under);
  bar.style.setProperty('--bar-bg', cs.backgroundColor);
  bar.style.setProperty('--bar-ink', cs.color);
  // Sobre el capítulo verde, el botón verde de la barra se invierte para no perderse.
  bar.dataset.on = under.matches('.cta') ? 'accent' : '';
};
addEventListener('scroll', paint, { passive: true });
paint();
