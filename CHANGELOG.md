# Jurnal de modificări

## 2.0.1 — 2026-10-27 (anterior: v2.0.0)

Recenzie 2026-10-27.

### Implementat
- Descriere detaliată: 10 variante jucabile (Block, Draw, All Fives, Muggins, Sniff, Fives and Threes, Matador, domino latin 2v2, domino latin 200, Mexican Train) și 5 doar documentate (Chicken Foot, Bergen, Five Up, All Threes, variante latine regionale), în 8 limbi.
- Test nou `tests/descriere.test.mjs` (10 verificări).

### Neimplementat și de ce
- AI cu niveluri de dificultate: neimplementat în această rundă (necesită calibrare și teste dedicate pe motorul jocului).
- Statistici comune între jocuri: neimplementat (ar cere un spațiu de stocare partajat între aplicații separate, contrar izolării actuale).
- Mod multiplayer local unificat între jocuri: **planificat**, NU acum; jocurile rămân separate.
