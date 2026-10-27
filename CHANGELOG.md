# Jurnal de modificări

## 2.1.0 — 2026-10-27

### Implementat
- **Verificarea nivelurilor AI prin simulare** (rămasă „neimplementată” în 2.0.1): `tests/niveluri-sim.test.mjs` extrage motorul (`DOM`) din fișier și joacă partide complete 1 contra 1 în Node (60 pe variantă, locuri alternate). Rezultatele sunt în README. Pe scurt: nivelul 3 bate semnificativ nivelul 1 în toate variantele simulate, în afară de Fives and Threes (34–26, nesemnificativ, ceea ce atlasul spunea deja); nivelul 2 nu se distinge semnificativ de nivelul 1 la All Fives, Muggins, Sniff și Fives and Threes.
- Constatare: **cele trei niveluri AI și statisticile locale (partide jucate/câștigate per variantă) existau deja** în aplicație; nu s-a adăugat nimic duplicat. Partidele cu mutări anulate nu intră în statistici (neschimbat).

### Neimplementat și de ce
- Simularea variantelor latine (4 jucători, în echipe): motorul cere 4 locuri și echipe fixe; nu au fost simulate, deci nivelurile lor nu sunt verificate.
- Statistici comune între jocuri / multiplayer local unificat: neschimbat (aplicații separate, cu stocare izolată).

## 2.0.1 — 2026-10-27 (anterior: v2.0.0)

Recenzie 2026-10-27.

### Implementat
- Descriere detaliată: 10 variante jucabile (Block, Draw, All Fives, Muggins, Sniff, Fives and Threes, Matador, domino latin 2v2, domino latin 200, Mexican Train) și 5 doar documentate (Chicken Foot, Bergen, Five Up, All Threes, variante latine regionale), în 8 limbi.
- Test nou `tests/descriere.test.mjs` (10 verificări).

### Neimplementat și de ce
- AI cu niveluri de dificultate: neimplementat în această rundă (necesită calibrare și teste dedicate pe motorul jocului).
- Statistici comune între jocuri: neimplementat (ar cere un spațiu de stocare partajat între aplicații separate, contrar izolării actuale).
- Mod multiplayer local unificat între jocuri: **planificat**, NU acum; jocurile rămân separate.
