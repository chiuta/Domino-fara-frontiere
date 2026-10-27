// DOMINO FĂRĂ FRONTIERE: verificare prin simulare a nivelurilor AI (1, 2, 3). Motorul (DOM) se extrage din fișier și rulează în Node.
// Pentru fiecare variantă: N partide complete 1 contra 1 (2 jucători), locurile alternate. Variantele latine (4 jucători, în echipe) nu sunt simulate. Se raportează ce diferă și ce NU diferă.
// Rulare: node tests/niveluri-sim.test.mjs [N per pereche și variantă] [variante separate prin virgulă]
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, "..", "index.html"), "utf8");
const a = html.indexOf("var DOM = (function(){"), b = html.indexOf("/* ===== 60-ui-core");
if (a < 0 || b < a) throw new Error("motorul DOM nu a fost găsit");
const ctx = vm.createContext({console, Math, Date, Uint8Array, Uint32Array, Int32Array, Array, Object, JSON, Number, String});
vm.runInContext(html.slice(a, b) + "\nthis.__D = DOM;", ctx);
const D = ctx.__D;
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log("  ok   " + n); } else { fail++; console.log("FAIL " + n + (x !== undefined ? "  -> " + JSON.stringify(x) : "")); } };
const N = parseInt(process.argv[2], 10) || 50;
const VARS = (process.argv[3] || "block,draw,matador,allfives,muggins,sniff,f53,mexican").split(",");

function play(vid, lv0, lv1, seed) {
  const rng = D.makeRng(seed), aiRng = D.makeRng((seed + 0x9E3779B9) >>> 0);
  const st = D.newGame(vid, {np: 2}, rng);
  let guard = 0;
  while (st.phase !== "gameOver" && guard++ < 6000) {
    if (st.phase === "handOver" || st.phase === "roundOver") { D.nextHand(st, rng); continue; }
    if (st.phase !== "play") break;
    const p = st.turn, v = D.view(st, p);
    let act = null; try { act = D.aiAction(v, p === 0 ? lv0 : lv1, aiRng); } catch (e) { act = null; }
    try { D.act(st, act, rng); } catch (e) { D.act(st, D.legalActions(st)[0], rng); }
  }
  if (st.phase !== "gameOver") return null;
  if (st.winners) return st.winners.length === 1 ? st.winners[0] : -1;
  return st.winnerEnt === st.entOf[0] ? 0 : st.winnerEnt === st.entOf[1] ? 1 : -1;
}
function duel(vid, hi, lo, n) {
  let w = 0, l = 0, d = 0, done = 0;
  for (let i = 0; i < n * 2 && done < n; i++) {
    const hiFirst = done % 2 === 0;
    const r = play(vid, hiFirst ? hi : lo, hiFirst ? lo : hi, 1000 + i * 7 + hi * 100000 + lo * 1000000);
    if (r === null) continue;
    done++;
    const hiWon = r === (hiFirst ? 0 : 1);
    if (r === -1) d++; else if (hiWon) w++; else l++;
  }
  const dec = w + l, z = dec ? (w - dec / 2) / Math.sqrt(dec / 4) : 0;
  return {vid, hi, lo, n: done, w, l, d, rate: +((w + d / 2) / done).toFixed(3), z: +z.toFixed(2)};
}
const t0 = Date.now(), res = [];
for (const v of VARS) for (const [hi, lo] of [[3, 1], [2, 1], [3, 2]]) { const r = duel(v, hi, lo, N); res.push(r); console.log(`  ${v}: nivel ${hi} vs ${lo}: ${r.n} partide, ${r.w}-${r.l} (remize ${r.d}), scor ${r.rate}, z=${r.z}`); }
console.log(`  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
ok("fiecare pereche are N >= 50 partide", res.every(r => r.n >= 50), res.map(r => r.n));
for (const v of VARS) {
  const r31 = res.find(r => r.vid === v && r.hi === 3 && r.lo === 1);
  const sig = r31.z >= 2.58 && r31.rate > 0.5;
  if (v === "f53") console.log(`  [info] f53: nivelul 3 ${sig ? "bate semnificativ" : "NU bate semnificativ"} nivelul 1 (z=${r31.z}); în atlas se spune deschis că aici nivelurile sunt aproape egale`);
  else ok(`${v}: nivelul 3 bate semnificativ nivelul 1 (z >= 2.58, scor > 0.5)`, sig, r31);
}
console.log(`\n${pass} reușite, ${fail} eșuate`); process.exit(fail ? 1 : 0);
