// DOMINO FĂRĂ FRONTIERE 2.0.1 — descrierea detaliată: câte variante, care sunt (numărătoare din cod).
// Rulare: node tests/descriere.test.mjs
import {readFileSync} from "node:fs";
import {launch, check, summary, INDEX} from "./_lib.mjs";

const src = readFileSync(INDEX, "utf8");
const atlas = src.slice(src.indexOf("var ATLAS = ["), src.indexOf("var ATLAS_SOURCES"));
const ids = [...atlas.matchAll(/^\{ id:'([a-z0-9]+)', vid:(?:'[a-z0-9]+'|null), play:(true|false)/gm)].map(m => ({id: m[1], play: m[2] === "true"}));
const nPlay = ids.filter(x => x.play).length, nDoc = ids.filter(x => !x.play).length;
check("în cod: 10 variante jucabile și 5 doar în atlas", nPlay === 10 && nDoc === 5, {nPlay, nDoc});

const APP = JSON.parse(readFileSync(new URL("../app.json", import.meta.url), "utf8"));
const names = ["Block", "Draw", "All Fives", "Muggins", "Sniff", "Fives and Threes", "Matador", "Mexican Train"];
check("app.json: descrierea spune 10 jucabile și 5 doar în atlas", /10 variante jucabile/.test(APP.description) && /5 fișe doar în atlas/.test(APP.description), APP.description);
check("app.json: descrierea enumeră variantele", names.every(n => APP.description.includes(n)) && /domino latin 2v2/.test(APP.description) && /domino latin 200/.test(APP.description));

const {browser, page, st} = await launch({reducedMotion: "reduce"});
await page.waitForTimeout(800);
const md = () => page.getAttribute('meta[name="description"]', "content");
const d0 = await md();
check("meta description (ro): 10 variante, 2 variante latine, 5 doar în atlas", /10 variante jucabile/.test(d0) && /latin 2v2/.test(d0) && /latin 200/.test(d0) && /5 fișe doar în atlas/.test(d0) && names.every(n => d0.includes(n)), d0);
check("statistica din pagină: 10 jucabile", (await page.textContent("#statPlay")).trim() === "10");
for (const [lang, rx] of [["en", /10 variants playable/], ["fr", /10 variantes jouables/], ["de", /10 gegen eine lokale KI spielbaren/], ["hu", /10 helyi MI ellen/]]) {
  await page.selectOption("#langSel", lang);
  await page.waitForTimeout(400);
  const d = await md();
  check(`meta description (${lang}) tradusă și completă`, rx.test(d) && /Mexican Train/.test(d) && /Chicken Foot/.test(d), d);
}
check("0 erori de pagină/CSP și 0 cereri de rețea", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
await browser.close();
summary();
