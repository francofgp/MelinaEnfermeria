# Hugo genera también las piezas para redes

Las piezas (posts de Facebook, estados, volante) las arma Hugo como páginas HTML del tamaño exacto, con los mismos datos y el mismo CSS que la landing, y un script de Playwright las pasa a PNG. Así, si cambia un dato (horario, zona, matrícula), se actualizan el sitio y todas las piezas en una sola edición. Se descartó Remotion (lo que usa PhyrosContent) porque obliga a mantener un segundo sistema de diseño en React; solo vuelve a evaluarse si hacen falta piezas en video.
