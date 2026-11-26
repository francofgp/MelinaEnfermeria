// Botón "Copiar texto": copia el bloque que tiene al lado y avisa con el propio botón.
const copiar = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // Navegadores viejos o sin permiso: copia con una selección temporal.
    const area = Object.assign(document.createElement('textarea'), { value: texto });
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
};

document.addEventListener('click', async (e) => {
  const boton = e.target.closest('[data-copiar]');
  if (!boton) return;
  await copiar(boton.parentElement.querySelector('.copiable-texto').textContent);
  const original = boton.textContent;
  boton.textContent = '¡Copiado!';
  boton.classList.add('is-ok');
  setTimeout(() => { boton.textContent = original; boton.classList.remove('is-ok'); }, 1800);
});
