# Jurnal de modificări

## 2.2.3 — 2026-11-20

- fff-kit 1.8.1: când `localStorage`/`sessionStorage` aruncă sau lipsesc (cookie-uri și date de site blocate, WebView fără stocare, `<iframe sandbox>`), kitul pune în loc o stocare în memorie, iar pagina pornește în loc să se oprească; datele nu se păstrează după închiderea paginii
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși)

## 2.2.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.2.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.2.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.1.9 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.1.4 — 2026-11-08

- Jurnalul de puncte arată calculul: „+10 puncte (capete 4+6 = 10)” (8 limbi); test `ends-calc`.

## 2.1.1 — 2026-11-03

Turneu și clasament Elo local (motor comun de jocuri), rezultate notate de mână

## 2.1.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

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
