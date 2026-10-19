# Domino fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versión:** 1.1.0 · **Última actualización:** 2026-10-14

Atlas del dominó y juego contra una IA local: 10 variantes jugables (2–4 jugadores, equipos 2 contra 2 donde la regla lo exige) y 5 fichas solo documentadas. Un único archivo HTML, sin conexión, sin dependencias.

**Aplicación en línea:** https://chiuta.github.io/Domino-fara-frontiere/

![Captura: mesa de dominó latino, línea en serpentina con los extremos marcados](screenshot.png)

## Qué es

Un atlas del dominó (origen, reglas, aproximaciones) y, para las variantes implementadas, una mesa de juego en la que juegas tú (asiento 0) contra 1–3 jugadores IA. El motor de reglas está separado de la interfaz en el mismo archivo, para poder probarse en Node. La interfaz está en rumano y en otros 6 idiomas (véase «Idiomas»).

## Funciones

Solo lo que está verificado en el código y en las pruebas:

- 10 variantes jugables, un motor parametrizado para los juegos «en línea» (Block, Draw, All Fives, Muggins, Sniff, Fives and Threes, Matador, dominó latino) y un motor aparte para el Mexican Train.
- Juegos de doble-6 (28 fichas), doble-9 (55; solo en el Matador) y doble-12 (91; Mexican Train y Matador). El invariante 28/55/91 se verifica en cada jugada en las pruebas.
- Fichas SVG grandes, con los puntos dibujados; cada ficha de la mano tiene un `aria-label` de la forma «5–3». Opción «Cifras» en lugar de puntos.
- Mesa en serpentina: la línea se quiebra en el borde con una ficha puesta en vertical y cambia de sentido; cero fichas fuera de la pantalla (verificado sobre 32.277 instantáneas con anchos de 8 a 26 columnas, sin solapamientos y sin salirse del ancho); desplazamiento y zoom (−, ajustar, +), también a 390 px.
- Spinner con cuatro brazos (All Fives, Sniff); trenes personales, tren mexicano, marcadores y dobles abiertos (Mexican Train).
- Primer jugador: el doble más alto de las manos (o 6-6 en el dominó latino); robo del pozo donde la regla lo permite; bloqueo (nadie puede jugar ya): gana quien tiene menos puntos restantes, con la regla de puntuación de cada variante (descrita en la ficha de la variante).
- IA en tres niveles que realmente difieren (véase «Límites»): 1 aleatorio/voraz, 2 heurísticas, 3 cuenta las fichas jugadas y deduce de los pases lo que un adversario no tiene. La IA trabaja solo sobre la vista pública + su propia mano.
- Sugerencia (H), modo «mostrar las manos de la IA» explícito y solo para aprender, semilla opcional para partidas reproducibles, estadísticas locales, tema claro/oscuro (en la primera apertura se sigue la preferencia del sistema), 3 tamaños de texto, juego automático de la jugada única (robar/pasar).
- «Deshacer jugada» (botón o tecla U): vuelve al estado anterior a tu última jugada (hasta 40 pasos, incluidas las jugadas de la IA hechas entretanto; el estado se clona, no se recalcula). Una partida en la que has usado deshacer no entra en las estadísticas.
- Aleatoriedad: `crypto.getRandomValues` con muestreo por rechazo; con semilla, mulberry32 (el mismo muestreo). Mezcla de Fisher–Yates.
- Accesibilidad: juego completo con teclado, `aria-live` en el estado, foco visible, objetivos táctiles ≥ 44 px (medido a 390 px; excepción: los botones del pie de donaciones, ~29 px), foco de teclado conservado tras cada jugada, contraste ≥ 4,5:1 (medido en los pares de colores de ambos temas), `prefers-reduced-motion`, sin desplazamiento horizontal a 390 px, `<noscript>`, `lang` dinámico.

## Variantes

| Variante | ¿Jugable? | ⚠ Aproximaciones (en breve; el texto completo está en la ficha de la aplicación) |
|---|---|---|
| Block (sin robo) | sí | – |
| Draw (con robo del pozo) | sí | Manos 7/7/6 (2/3/4 jugadores), reserva de 2 fichas (Pagat); ⚠ el robo voluntario no está permitido (se roba solo cuando no se puede jugar) |
| All Fives (con spinner) | sí | ⚠ los brazos 3–4 se abren solo cuando el spinner tiene ambos lados cubiertos (uso americano); redondeo a 5 sobre el total, no ficha por ficha; con 3 jugadores, el empate reparte la mitad redondeada hacia abajo |
| Muggins (All Fives sin spinner) | sí | ⚠ la fuente es inconsistente; se eligió «quien sale cobra»; sin equipos |
| Sniff | sí | variante americana (Sniff transversal = spinner); los extremos laterales del spinner se cuentan mientras están libres (el ejemplo 8/14/15 de Pagat verificado); ⚠ redondeo y bloqueo no precisados por la fuente; sin equipos |
| Fives and Threes | sí | ⚠ sin equipos («chip out» sobre los compañeros); abre con el doble más alto en lugar de sorteo; IA: los niveles no difieren de forma medible |
| Matador (suma 7) | sí | ⚠ los matadores para doble-9/12 están extrapolados; la fuente describe solo 4 jugadores (2–3 es una ampliación); mano de 7 fichas también en doble-9/12; regla de pase elegida: «robas hasta poder jugar o hasta que queden 2 fichas» |
| Dominó latino por equipos 2v2, estilo venezolano, objetivo 100 | sí | ⚠ la versión mexicana (reglas de bloqueo/inicio distintas) no está implementada; solo la variante descrita en Pagat; Cuban/Dominican no se reproducen; sin «rehacer la mano», sin bonificaciones capicúa/chuchazo/dominao |
| Dominó latino 200 | sí | ⚠ ni FID puro ni «Doscientos» puro (híbrido); tras un bloqueo empieza el jugador con menos puntos del equipo ganador; abre con 6-6 (la FID elige sacando fichas); sin «Quinientos» ni «Chiva» |
| Mexican Train (doble-12, trenes personales) | sí | ⚠ 2–4 jugadores (la fuente permite 10); 1, 3 o 13 rondas; el doble-blanco a 50 solo como opción; IA: los niveles 2 y 3 son igual de fuertes |
| Chicken Foot | solo atlas | no implementado (disposición en árbol) |
| Bergen / Double Bergen | solo atlas | la puntuación Bergen no está implementada |
| Five Up | solo atlas | las reglas completas no se han verificado |
| All Threes | solo atlas | no implementado por separado |
| Variantes latinas regionales (Quinientos, Milo, Sudan) | solo atlas | – |

No se incluyen los «dominós de colores» (término ambiguo) ni el Sebastopol (la página fuente no pudo consultarse; no se afirma nada sobre ellos).

**La variante latina elegida.** El dominó latino por equipos se juega en varias versiones regionales. Se ha implementado la versión venezolana/mexicana descrita en Pagat (objetivo 100, al final el ganador se lleva los puntos de las fichas restantes de los adversarios) y la versión de 200 (FID/«Doscientos», se suman todos los puntos restantes, el ganador de la mano abre la siguiente). Los términos: «pase» = abstenerse de jugar; «pase mutual» = tranque, es decir, el bloqueo en el que nadie puede jugar ya (gana el equipo con menos puntos, el empate no da puntos); «capot» = victoria con los adversarios a cero (definición elegida aquí, no norma federativa).

## Manual de uso

1. En el **Atlas**, elige una variante y pulsa «Jugar». «Reglas» muestra el origen, las reglas y las aproximaciones.
2. En la ventana de ajustes elige el número de jugadores, los equipos (con 4), el nivel de la IA, eventualmente una semilla; pulsa «Jugar».
3. Cuando es tu turno, las fichas jugables se levantan y se resaltan. Pulsa una ficha; si tiene un único destino se juega de inmediato, si no eliges el destino con los botones bajo la mano o pulsando un extremo marcado en la mesa.
4. Si no tienes jugada: «Robar» (D) o «Pasar» (P). Con «Auto» activado, la jugada única se hace automáticamente tras un segundo.
5. Mexican Train: tu primer turno puede ser una cadena de fichas en tu tren, y luego «Terminar turno» (E). Un doble exige una ficha más; un doble abierto debe satisfacerse. Cuando pasas, pones tu marcador en el tren.
6. Teclado: Tab hasta la mano, flechas entre fichas, Intro para jugar; D, P, E, H (sugerencia), U (deshacer jugada). Esc cierra las ventanas.
7. Los botones de la esquina: idioma, tema, tamaño del texto, cifras, auto, estadísticas, acerca de. Zoom en la mesa: −, ⤢, +.

## Idiomas

Los elementos de la interfaz (botones, mensajes, registro, resultados) están en rumano, inglés, francés, italiano, español, portugués y alemán, con selector y autodetección. **Los textos largos del atlas (origen, reglas, aproximaciones) existen solo en rumano e inglés; en francés, italiano, español, portugués y alemán se muestra el inglés, con la discreta nota «texto en inglés».** La paridad de las claves de traducción se verifica con un script (`tests/i18n-check.js`: 180 claves × 7 idiomas, sin huecos, los mismos marcadores de posición).

## Privacidad y red

Sin telemetría, sin solicitudes de red, sin `fetch`, sin `eval`. CSP: `default-src 'none'; script-src 'sha256-…'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'` (el script está ligado por hash; `style-src 'unsafe-inline'` es necesario para el estilo en línea y para el bloque de apoyo). Las preferencias y las estadísticas se guardan en `localStorage` (clave `dff1`), al que se accede solo en `try/catch`; sin él la aplicación funciona (probado con `localStorage` bloqueado). `innerHTML` se usa solo para SVG generado a partir de enteros y cadenas pasadas por `esc()`. Los únicos enlaces externos son Buy Me a Coffee en el bloque de apoyo (`rel="noopener"`), copiado idéntico de los otros repositorios.

## Límites y advertencias

- **IA**: no tiene acceso a las manos de los demás. Nivel 1: aleatorio (o voraz en puntos en los juegos con puntuación en los extremos). Nivel 2: heurísticas (puntos, flexibilidad, dobles, conservación de los matadores). Nivel 3: además cuenta las fichas jugadas, deduce de los pases lo que un adversario no tiene y estima la probabilidad de que los adversarios pasen. Fuerza medida (300 partidas, asientos alternados): el nivel 3 vence al nivel 1 en el 54–98 % de las partidas (según la variante) y al nivel 2 en el 52–76 %; el nivel 2 vence al nivel 1 en el 48–98 %. **Excepciones**: en Fives and Threes los niveles son prácticamente iguales (~50 %), y en Mexican Train los niveles 2 y 3 son igual de fuertes (44 % para el nivel 3 frente al 2), y ambos vencen con claridad al nivel 1 (80–85 %). El modo «mostrar las manos de la IA» es explícito y solo para aprender; la IA, de todos modos, no mira tu mano.
- Las reglas de algunos juegos difieren de una región a otra; las elecciones hechas están en la columna ⚠ y en las fichas de la aplicación.
- No es una herramienta de apuestas y no tiene valor oficial para las federaciones.
- La interfaz se ha verificado visualmente en Chromium (1280×800 y 390×844); no se ha probado en Safari, Firefox ni con lectores de pantalla reales.
- No se ha implementado el modo multijugador en red (y no se hará: la aplicación no tiene red).

## Pruebas

Todo lo siguiente se ejecutó sobre el `index.html` final (los scripts se guardan fuera del paquete):

- **Partidas IA contra IA**, 500 partidas por configuración, validadas paso a paso por un validador de legalidad independiente (reimplementado a partir de las reglas, sin código del motor): Block 2/3/4, Draw 2/3/4, Matador doble-6/9/12 con 2/3/4, All Fives 2/3/4 + equipos, Muggins 2/3/4, Sniff 2/3/4, Fives and Threes 2/3/4, latino 100 y latino 200; Mexican Train 2/3/4 × 500 partidas × 13 rondas (19.500 rondas). Resultado: **0 fallos** (sin bloqueos del motor, sin jugadas ilegales, invariante 28/55/91 en cada jugada, manos y pozo idénticos al validador, puntos en los extremos iguales a los calculados de forma independiente, ganancia de fin de mano idéntica).
- **Escenarios escritos a mano**: 227 comprobaciones, 0 fallos (puntuación All Fives / Muggins / Fives and Threes en los extremos, incluido doble en el extremo, spinner y ausencia de spinner; Mexican Train: dobles abiertos en el tren propio, en el de otro marcado/no marcado y en el mexicano, primer turno, marcadores, bloqueo, doble-blanco a 50, 13 rondas; IA sin acceso a las manos).
- **Disposición de la mesa**: 32.277 instantáneas, 12,7 millones de comprobaciones (sin solapamientos, sin salirse del ancho, número correcto de fichas), anchos de 8 a 26 columnas.
- **UI** (Playwright + Chromium): una partida completa jugada por la interfaz en cada variante a 1280 px y 390 px, 0 errores en la consola, 0 infracciones de CSP, 0 solicitudes externas, sin desplazamiento horizontal; juego con teclado; `localStorage` bloqueado; autodetección de idioma; objetivos táctiles ≥ 44 px (salvo el pie de página).

## Fuentes

- Pagat.com: Muggins, Block, All Fives, Sniff, Fives and Threes, Matador, Bergen, Latin Partnership Dominoes, Mexican Train, Chicken Foot y las páginas de familias (fives family, train family, matador matching, Bergen scoring). Las reglas se leyeron y se implementaron a partir del texto; donde la fuente es inconsistente o calla, la elección se marca ⚠.
- Para las versiones cubana, dominicana y Sebastopol no se pudo consultar ninguna fuente; no se afirma que estén reproducidas.

## Ejecución local

Abre `index.html` en un navegador (no requiere servidor). Para reconstruir a partir de las fuentes de trabajo: `node build.mjs`; para las pruebas: `node tests/fuzz.js <index.html> 500`, `node tests/scenarios.js <index.html>`, `node tests/layout.js <index.html>`, `node tests/i18n-check.js` (los scripts están en el directorio de trabajo, fuera del paquete publicado).

## Historial / Changelog

- 1.1.0 — 2026-10-14: Copia de seguridad y etiquetado de datos (fff-kit).

- 1.0.0 — 2026-10-12: la versión y la fecha de la última actualización se muestran en la aplicación (primera versión numerada; en el cuadro «Acerca de»).

Ronda 7:
- Una partida empezada (tras la primera jugada) y no terminada pide ahora la confirmación del navegador al recargar o cerrar la página (`beforeunload`), para no perder la partida por accidente; tras «game over» y antes de la primera jugada no aparece ninguna pregunta. La partida no se guarda entre visitas. Hash CSP recalculado; axe-core = 0 infracciones a 1280 y 360 px.
- La suite `tests/` y `build.mjs` de la sección «Ejecución local» siguen fuera del repositorio publicado (declarado también allí); comprobaciones: `node --check`, una partida por la interfaz, 0 errores de consola/CSP.

Ronda 6:
- Novedad: «Deshacer jugada» (U) con una pila de 40 estados; las partidas con deshacer quedan excluidas de las estadísticas. El tema inicial sigue `prefers-color-scheme` si no hay otro guardado. El registro de la partida se puede desplazar con el teclado (punto de referencia con `tabindex`). Hash CSP recalculado.
- Cuando has elegido una ficha que puede ponerse en dos extremos, aparece ahora un mensaje visible «Elige dónde la pones …» sobre los botones de destino (antes solo existía el mensaje de estado).
- Accesibilidad: los títulos de las tarjetas del atlas son h2 (orden correcto bajo h1), el bloque de apoyo es un punto de referencia `complementary`; axe-core = 0 infracciones a 1280 y 360 px. Se recalculó el hash CSP del script.
- Nota: la suite de pruebas del README (`tests/`) y `build.mjs` no están en este repositorio; tras la modificación se verificaron `node --check`, una partida por la interfaz y 0 errores de consola/CSP.

## Licencia

MIT — véase el archivo `LICENSE`.

## Nombres comerciales

«Mexican Train» y otros nombres de producto pueden ser marcas de sus titulares; la aplicación no está afiliada a ellos, y los nombres se usan de forma descriptiva para reglas tradicionales de dominó.

## Autor

Alexandru-Ionuț Chiuță (Alexio).

## Resumen en inglés

Un atlas del dominó de un único archivo, sin conexión, con diez variantes jugables contra una IA local (Block, Draw, All Fives, Muggins, Sniff, Fives and Threes, Matador en doble-6/9/12, dos versiones latinas por equipos 2v2 y Mexican Train en doble-12) más cinco fichas solo documentadas (Chicken Foot, Bergen, Five Up, All Threes, versiones latinas regionales). El motor de reglas es puro y está separado de la interfaz, con mesa en serpentina, desplazamiento y zoom, juego completo con teclado e interfaz en 7 idiomas (los textos largos del atlas existen solo en rumano e inglés; los demás idiomas muestran el inglés con una nota). La IA nunca ve las manos ocultas (el nivel 3 cuenta las fichas y deduce de los pases); los niveles 2 y 3 son igual de fuertes en Mexican Train, y los tres son aproximadamente iguales en Fives and Threes. Verificado con 500 partidas IA contra IA validadas de forma independiente por configuración (0 fallos), 227 escenarios de reglas escritos a mano (más 135 de la auditoría independiente) y fuzzing de la disposición. Sin red, sin telemetría, CSP estricta. Cada aproximación está marcada en la tabla de variantes y en las reglas de la aplicación. Licencia: MIT (véase LICENSE). Fuentes de las reglas: Pagat.com.

## Auditoría independiente

Una auditoría adversarial aparte corrigió: las manos en Draw, la puntuación del Sniff, el jugador que empieza tras un bloqueo en el latino 200, un fallo con estadísticas corruptas en localStorage, la pérdida del foco de teclado, una alternativa para una jugada ilegal de la IA. Ejecutado sobre la versión final: fuzz independiente (línea + tren), 135 escenarios, prueba de información oculta para la IA, 6000 mesas, RNG, i18n, más las pruebas del constructor.
