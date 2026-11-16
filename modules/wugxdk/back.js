/* sss-destek-yan — SSS Destek Yanı — akordeon ve yapışkan yardım kartı (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Başlık, açıklama ve düğme vurgu renkli yapışkan bir yardım kartında (bitiş yanında); karşısında sorular çizgili açılır liste. Kart yalnız metin ya da düğme doluysa basılır.
   Üretici: scripts/modul-fabrika (aile faq) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: data: [{ soru (ya da question), cevap (ya da answer), kategori?, ikon?, url? }] — metinler dil sözlüğü; sorusuz satır atlanır. FAQPage JSON-LD motorda `question/answer` adlarını okur. */
const P = "modulex-sss-destek-yan";
const IMG_KOK = "/img/";
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: faq --- */
const kayitlar = veri.map((o) => ({
  soru: metinAl(o, ["soru", "question", "q", "baslik", "title", "name"]),
  cevap: metinAl(o, ["cevap", "answer", "a", "metin", "text", "description"]),
  kategori: metinAl(o, ["kategori", "category", "grup"]), ikon: ikonAd(ilk(o, ["ikon", "icon"])), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.soru);
const tekAcik = dogru(des.tekAcik, true);
const ilkAcik = dogru(des.ilkAcik, true);
const cH = (k, s) => (k.cevap ? `<p class="${P}-${s || "cevap"}">${satirlar(k.cevap)}</p>` : "");
const lH = (k) => (k.url ? `<a class="${P}-bag" href="${esc(k.url)}">@read-more@<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
const yH = (k, s) => (k.cevap || k.url ? `<div class="${P}-${s || "yanit"}">${cH(k)}${lH(k)}</div>` : "");
/* yerel açılır: tekAcik → aynı name (tarayıcı diğerlerini kapatır), ilkAcik → ilk öğe açık */
const acH = (k, i, on, son) => `<details class="${P}-oge"${tekAcik ? ` name="${P}-{{id}}"` : ""}${i === 0 && ilkAcik ? " open" : ""}><summary class="${P}-ozet">${on || ""}<span class="${P}-soru">${esc(k.soru)}</span>${son === undefined ? `<span class="${P}-isaret" aria-hidden="true"></span>` : son}</summary>${yH(k)}</details>`;
const gruplar = (A) => {
  const m = new Map();
  A.forEach((k, i) => { const g = k.kategori || ""; if (!m.has(g)) m.set(g, []); m.get(g).push(Object.assign({ sira: i }, k)); });
  return [...m.entries()].map(([ad, liste]) => ({ ad, liste }));
};
/* --- modül: sss-destek-yan --- */
const kart = (k, i) => acH(k, i);
const sar = (ic, A, B) => {
    const cta = ctaHtml();
    const yan = B.ust || B.baslik || B.metin || cta
      ? `<aside class="${P}-yan">${ikonH("support_agent", `${P}-yikon`)}${B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : ""}${B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : ""}${B.metin ? `<p class="${P}-ymetin">${satirlar(B.metin)}</p>` : ""}${cta}</aside>`
      : "";
    return `<div class="${P}-govde${yan ? "" : ` ${P}-govde--tek`}"><div class="${P}-liste">${ic}</div>${yan}</div>`;
  };
const B = { ust: metinAl(des, ["ust","badge","kicker","eyebrow"]), baslik: metinAl(des, ["baslik","title"]), metin: metinAl(des, ["metin","description","text"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !kayitlar.length;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
