// DOMINO: jurnalul de puncte arată calculul capetelor („capete 4+6 = 10”). Motorul (DOM) rulează în Node.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, "..", "index.html"), "utf8");
const a = html.indexOf("var DOM = (function(){"), b = html.indexOf("/* ===== 60-ui-core");
const ctx = vm.createContext({console, Math, Date, Uint8Array, Uint32Array, Int32Array, Array, Object, JSON, Number, String});
vm.runInContext(html.slice(a, b) + "\nthis.__D = DOM;", ctx);
const D = ctx.__D;
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log("  ok   " + n); } else { fail++; console.log("FAIL " + n + (x !== undefined ? "  -> " + JSON.stringify(x) : "")); } };
let scored = 0, bad = [];
for (const vid of ["allfives", "muggins", "sniff", "f53"]) for (let seed = 1; seed <= 12; seed++) {
  const rng = D.makeRng(seed), ai = D.makeRng(seed + 77);
  const st = D.newGame(vid, {np: 2}, rng); let g = 0;
  while (st.phase !== "gameOver" && g++ < 4000) {
    if (st.phase === "handOver" || st.phase === "roundOver") { D.nextHand(st, rng); continue; }
    if (st.phase !== "play") break;
    const v = D.view(st, st.turn); let act; try { act = D.aiAction(v, 2, ai); } catch (e) { act = D.legalActions(st)[0]; }
    const r = D.act(st, act, rng);
    const evs = Array.isArray(r) ? r : (r && r.events) || [];
    for (const e of evs) if (e.k === "play" && e.pts > 0 && !e.voided && !(e.chip && !e.calc)) {
      scored++;
      const m = /^([\d+]+) = (\d+)$/.exec(e.calc || "");
      if (!m || m[1].split("+").reduce((s, x) => s + +x, 0) !== +m[2]) bad.push(e.calc);
    }
  }
}
ok("există mutări punctate", scored > 0, scored);
ok("calc = sumă corectă la fiecare mutare punctată", bad.length === 0, bad.slice(0, 5));
console.log(`\n${pass} reușite, ${fail} eșuate`); process.exit(fail ? 1 : 0);
