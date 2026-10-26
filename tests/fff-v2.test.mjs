// DOMINO — teste pentru turneu (v2). Rulare: node tests/fff-v2.test.mjs
import {launch, check, summary, hOverflow, chromium, INDEX} from "./_lib.mjs";

const PLAYERS = "Ana\nBogdan\nCora\nDan";
async function setup(page, fmt, players = PLAYERS) {
  await page.click("#btnTourn");
  await page.fill("#tnPlayers", players);
  await page.selectOption("#tnFormat", fmt);
  await page.click("#dlgTourn .btn.pri:has-text('Creează'), #dlgTourn .btn.pri:has-text('Create')");
}

console.log("1. logică pură: round-robin, scoruri, clasament");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(400);
  check("0 erori la pornire", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  const r = await page.evaluate(() => {
    const T = DFF.tourn, out = {};
    const t4 = T.make({name: "x", format: "rr", players: ["A", "B", "C", "D"], variants: ["block", "mexican"]});
    out.n4 = t4.matches.length; out.rounds4 = new Set(t4.matches.map(m => m.round)).size;
    const pairs = new Set(t4.matches.map(m => [m.a, m.b].sort().join("-"))); out.pairs4 = pairs.size;
    const t5 = T.make({name: "x", format: "rr", players: ["A", "B", "C", "D", "E"], variants: ["block"]});
    out.n5real = t5.matches.filter(m => !(m.res && m.res.bye)).length; out.n5bye = t5.matches.filter(m => m.res && m.res.bye).length;
    out.varsAlt = t4.matches.filter(m => m.round === 1)[0].variant + "," + t4.matches.filter(m => m.round === 2)[0].variant;
    // reguli de scor
    out.blockHigh = T.outcome("block", 50, 30, undefined, false); out.mexLow = T.outcome("mexican", 50, 30, undefined, false);
    out.tieRR = T.outcome("draw", 10, 10, undefined, false); out.tieKOnone = T.outcome("draw", 10, 10, undefined, true); out.tieKO = T.outcome("draw", 10, 10, "b", true);
    // clasament
    const m1 = t4.matches[0]; T.setResult(t4, m1.id, 60, 20); // block: a câștigă (runda 1 = block)
    const s = T.standings(t4); out.leader = s[0].p === m1.a && s[0].pts === 3 && s[0].w === 1;
    out.badScore = T.setResult(t4, m1.id, -1, 5); out.floatScore = T.setResult(t4, m1.id, 1.5, 5);
    return out;
  });
  check("4 jucători RR: 6 meciuri în 3 runde, toate perechile distincte", r.n4 === 6 && r.rounds4 === 3 && r.pairs4 === 6, r);
  check("5 jucători RR: 10 meciuri reale + 5 libere", r.n5real === 10 && r.n5bye === 5, r);
  check("variantele alternează pe runde", r.varsAlt === "block,mexican", r.varsAlt);
  check("Block/Draw: scorul mai mare câștigă; Mexican Train: scorul mai mic", r.blockHigh === "a" && r.mexLow === "b", r);
  check("egalitate: remiză în RR, cere câștigător în KO", r.tieRR === "d" && r.tieKOnone === null && r.tieKO === "b", r);
  check("clasament: victorie = 3 puncte", r.leader === true, r);
  check("scoruri invalide respinse", r.badScore === "bad-score" && r.floatScore === "bad-score", r);
  await browser.close();
}

console.log("2. interfață: creare, introducere rezultate, clasament, persistență");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(400);
  await setup(page, "rr");
  check("tabelul apare cu 6 meciuri", (await page.locator("#dlgTourn [data-match]").count()) === 6);
  check("progres 0 din 6", /0.*6/.test(await page.textContent("#tnProg")), await page.textContent("#tnProg"));
  const row = page.locator("#dlgTourn [data-match]").first();
  await row.locator("[data-side=a]").fill("100"); await row.locator("[data-side=b]").fill("40");
  await row.locator("button:has-text('Salvează'), button:has-text('Save')").first().click();
  check("rezultat salvat → progres 1 din 6", /^.*1.*6/.test(await page.textContent("#tnProg")));
  check("clasament afișat", (await page.locator("[data-role=standings] tr").count()) === 5);
  const topPts = await page.locator("[data-role=standings] tr").nth(1).locator("td").last().textContent();
  check("liderul are 3 puncte", topPts.trim() === "3", topPts);
  // scor invalid
  const row2 = page.locator("#dlgTourn [data-match]").nth(1);
  await row2.locator("[data-side=a]").fill("5");
  await row2.locator("button.pri").click();
  check("scor incomplet → mesaj, nu salvează", (await page.textContent("#tnMsg")).length > 5 && /1.*6/.test(await page.textContent("#tnProg")));
  // persistență
  const keys = await page.evaluate(() => Object.keys(localStorage));
  check("stocare cu prefixul aplicației", keys.includes("domino-fara-frontiere.tourn"), keys);
  await page.reload(); await page.waitForTimeout(400);
  await page.click("#btnTourn");
  check("turneul și rezultatul supraviețuiesc reîncărcării", (await page.locator("#dlgTourn [data-match]").count()) === 6 && /1.*6/.test(await page.textContent("#tnProg")));
  // export / import
  await page.click("#dlgTourn button:has-text('Exportă'), #dlgTourn button:has-text('Export')");
  const json = await page.inputValue("#tnIO");
  check("export JSON valid", JSON.parse(json).players.length === 4);
  await page.fill("#tnIO", '{"v":1,"players":["x"]}');
  await page.click("#dlgTourn button:has-text('Importă'), #dlgTourn button:has-text('Import')");
  check("import invalid respins, turneul rămâne", /1.*6/.test(await page.textContent("#tnProg")));
  // două click-uri pentru ștergere
  await page.click("#tnNew");
  check("prima apăsare cere confirmare (fără dialog nativ)", /încă o dată|again/i.test(await page.textContent("#tnNew")));
  await page.click("#tnNew");
  check("a doua apăsare șterge turneul", await page.locator("#tnPlayers").count() === 1);
  check("fără depășire orizontală", (await hOverflow(page)) <= 0);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  await browser.close();
}

console.log("3. eliminare directă (5 jucători → bye-uri, egalitate cu câștigător ales)");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const T = DFF.tourn, t5 = T.make({name: "k", format: "ko", players: ["A", "B", "C", "D", "E"], variants: ["draw"]});
    const o = {};
    o.total = t5.matches.length; o.byes = t5.matches.filter(m => m.res && m.res.bye).length;
    const real = t5.matches.filter(m => m.round === 1 && !(m.res && m.res.bye));
    o.realR1 = real.length;
    real.forEach(m => T.setResult(t5, m.id, 10, 5));
    // finalele ating participanți
    o.r2 = t5.matches.filter(m => m.round === 2).map(m => [m.a, m.b]);
    return o;
  });
  check("KO cu 5: 7 meciuri în schelet (4+2+1), 3 bye-uri", r.total === 7 && r.byes === 3, r);
  check("o singură partidă reală în runda 1", r.realR1 === 1, r);
  check("runda 2 completată din învingători/bye", r.r2.flat().filter(Boolean).length >= 3, r.r2);
  await setup(page, "ko", "A\nB");
  const row = page.locator("#dlgTourn [data-match]").first();
  await row.locator("[data-side=a]").fill("7"); await row.locator("[data-side=b]").fill("7");
  await row.locator("button.pri").click();
  check("KO: egalitate fără câștigător ales → nu se salvează", /0.*1/.test(await page.textContent("#tnProg")));
  await row.locator("select").last().selectOption("b");
  await row.locator("button.pri").click();
  check("KO: cu câștigător ales → turneu încheiat cu campion", (await page.locator(".tn-champ").count()) === 1, await page.textContent("#tnProg"));
  await browser.close();
}

console.log("4. sincronizare p2p între doi jucători (gazdă + oaspete, WebRTC local)");
{
  const args = ["--allow-loopback-in-peer-connection", "--disable-features=WebRtcHideLocalIpsWithMdns"];
  const A = await launch({args}), B = await launch({args});
  await A.page.waitForTimeout(300); await B.page.waitForTimeout(300);
  const supported = await A.page.evaluate(() => FFF.p2p.supported());
  check("WebRTC disponibil în test", supported);
  if (supported) {
    const D = (p, role) => p.locator("dialog.fff-p2p [data-role=" + role + "]");
    await setup(A.page, "rr");
    await A.page.click("#tnConnect");
    await D(A.page, "optin").check(); await D(A.page, "mode-host").click(); await D(A.page, "gen-offer").click();
    await D(A.page, "offer-out").waitFor();
    const offer = await D(A.page, "offer-out").inputValue();
    await B.page.click("#btnTourn");
    await B.page.fill("#tnPlayers", "zz\nyy");   // oaspetele poate avea deja un turneu propriu; va fi înlocuit de cel al gazdei
    await B.page.click("#tnConnect").catch(() => {});
    if (!(await B.page.locator("dialog.fff-p2p[open]").count())) { await B.page.click("#dlgTourn .btn.pri:has-text('Creează'), #dlgTourn .btn.pri:has-text('Create')"); await B.page.click("#tnConnect"); }
    await D(B.page, "optin").check(); await D(B.page, "mode-join").click();
    await D(B.page, "offer-in").fill(offer); await D(B.page, "gen-answer").click();
    await D(B.page, "answer-out").waitFor();
    const answer = await D(B.page, "answer-out").inputValue();
    await D(A.page, "answer-in").fill(answer); await D(A.page, "connect").click();
    await B.page.waitForFunction(() => DFF.tourn.state && DFF.tourn.state.players.join(",") === "Ana,Bogdan,Cora,Dan", null, {timeout: 15000}).catch(() => {});
    const gotB = await B.page.evaluate(() => DFF.tourn.state && DFF.tourn.state.players.join(","));
    check("oaspetele primește tabelul organizatorului", gotB === "Ana,Bogdan,Cora,Dan", gotB);
    for (const P of [A, B]) { const d = P.page.locator("dialog.fff-p2p[open]"); if (await d.count()) await d.locator("[data-role=close]").click(); }
    await A.page.waitForTimeout(300); await B.page.waitForTimeout(300);
    // oaspetele introduce un rezultat → ajunge la gazdă
    const rowB = B.page.locator("#dlgTourn [data-match]").first();
    await rowB.locator("[data-side=a]").fill("80"); await rowB.locator("[data-side=b]").fill("20");
    await rowB.locator("button.pri").click();
    await A.page.waitForFunction(() => DFF.tourn.counts(DFF.tourn.state).d === 1, null, {timeout: 8000}).catch(() => {});
    check("rezultatul oaspetelui ajunge la gazdă", (await A.page.evaluate(() => DFF.tourn.counts(DFF.tourn.state).d)) === 1);
    check("…și rămâne și la oaspete", (await B.page.evaluate(() => DFF.tourn.counts(DFF.tourn.state).d)) === 1);
    // gazda introduce un rezultat → ajunge la oaspete
    const rowA = A.page.locator("#dlgTourn [data-match]").nth(1);
    await rowA.locator("[data-side=a]").fill("10"); await rowA.locator("[data-side=b]").fill("90");
    await rowA.locator("button.pri").click();
    await B.page.waitForFunction(() => DFF.tourn.counts(DFF.tourn.state).d === 2, null, {timeout: 8000}).catch(() => {});
    check("rezultatul gazdei ajunge la oaspete", (await B.page.evaluate(() => DFF.tourn.counts(DFF.tourn.state).d)) === 2);
    const sa = await A.page.evaluate(() => JSON.stringify(DFF.tourn.standings(DFF.tourn.state))), sb = await B.page.evaluate(() => JSON.stringify(DFF.tourn.standings(DFF.tourn.state)));
    check("clasamentele coincid pe ambele dispozitive", sa === sb);
    check("0 erori (gazdă)", A.st.errs.length === 0, A.st.errs); check("0 erori (oaspete)", B.st.errs.length === 0, B.st.errs);
  }
  await A.browser.close(); await B.browser.close();
}
summary();
