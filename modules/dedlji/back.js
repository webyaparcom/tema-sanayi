/* acilis-kart-yigini — Açılış Kart Yığını — eğik görsel kartı ve yüzen sayı çipleri (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Solda metin ve düğmeler; sağda hafif eğik duran görsel kartı, arkasında ters yöne eğik vurgu kartı, köşelerinde ilk iki maddenin yüzen çipleri. Hover'da yığın düzelir.
   Üretici: scripts/modul-fabrika (aile hero) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · video/poster · alt · cta_ad/cta_url · cta2_ad/cta2_url · rozet_*; data (kısa maddeler/sayılar): [{ ikon?, deger?, metin?, img?, url? }] — metinler dil sözlüğü. */
const P = "modulex-acilis-kart-yigini";
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
/* --- aile: hero --- */
const IMG = medyaUrl(pick(ilk(des, ["img", "image", "gorsel"])));
const IMG2 = medyaUrl(pick(ilk(des, ["img2", "image2"])));
const VID = medyaUrl(pick(ilk(des, ["video"])));
const POS = medyaUrl(pick(ilk(des, ["poster"]))) || IMG;
const ALT = metinAl(des, ["alt"]);
/* düğmeler: yeni ad önce, hero-5 cta1 · hero-1 btn1 · hero-2 btn1Text adları yedek */
const DV = [[["cta_ad", "cta1_ad", "cta1", "btn1", "btn1Text", "button"], ["cta_url", "cta1_url", "btn1_url", "btn1Url", "buttonurl"]], [["cta2_ad", "cta2", "btn2", "btn2Text"], ["cta2_url", "btn2_url", "btn2Url"]]]
  .map((x) => ({ ad: metinAl(des, x[0]), url: href(pick(ilk(des, x[1]))) })).filter((d) => d.ad && d.url);
const dugH = (ek) => (DV.length ? `<div class="${P}-cta${ek ? ` ${ek}` : ""}">${DV.map((d, i) => `<a class="${P}-dugme${i ? ` ${P}-dugme--ikincil` : ""}" href="${esc(d.url)}">${esc(d.ad)}${i ? "" : `<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span>`}</a>`).join("")}</div>` : "");
/* maddeler: data (yeni + hero-4 {icon,text} + hero-6 {deger,etiket,img}) yoksa hero-1 stats borusu, hero-3 statN */
const yeniOge = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), deger: metinAl(o, ["deger", "value", "number", "sayi"]),
  metin: metinAl(o, ["metin", "text", "etiket", "label", "baslik", "title", "name"]), img: medyaUrl(pick(ilk(o, ["img", "image"]))),
  url: href(pick(ilk(o, ["url", "link"]))),
})).filter((k) => k.metin || k.deger);
const boru = metinAl(des, ["stats"]).split("|").map((x) => x.trim());
const boruOge = [];
for (let i = 0; i + 1 < boru.length; i += 2) if (boru[i] || boru[i + 1]) boruOge.push({ ikon: "", deger: boru[i], metin: boru[i + 1], img: "", url: "" });
const statOge = [1, 2, 3, 4].map((n) => ({ ikon: "", deger: metinAl(des, ["stat" + n + "Value"]), metin: metinAl(des, ["stat" + n + "Label"]), img: "", url: "" })).filter((k) => k.deger || k.metin);
const kayitlar = yeniOge.length ? yeniOge : boruOge.concat(statOge);
const RZ = { ikon: ikonAd(ilk(des, ["rozet_ikon", "badge_icon"])), deger: metinAl(des, ["rozet_deger", "badge_value"]), metin: metinAl(des, ["rozet_metin", "badge_label"]) };
const rzH = (s) => (RZ.deger || RZ.metin ? `<p class="${P}-${s || "rozet"}">${ikonH(RZ.ikon, `${P}-rikon`)}${RZ.deger ? `<strong class="${P}-rdeger">${esc(RZ.deger)}</strong>` : ""}${RZ.metin ? `<span class="${P}-rmetin">${esc(RZ.metin)}</span>` : ""}</p>` : "");
const ustH = (B, s) => (B.ust ? `<p class="${P}-ust${s ? ` ${P}-${s}` : ""}">${esc(B.ust)}</p>` : "");
const h1H = (B, ek) => `<h1 class="${P}-h1${ek ? ` ${ek}` : ""}" id="${P}-{{id}}-b">${esc(B.baslik)}</h1>`;
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
/* ilk görsel LCP: eager + fetchpriority; sonrakiler lazy */
const medH = (src, s, w, h, gec, alt) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="${esc(alt == null ? ALT : alt)}" width="${w || 1600}" height="${h || 1000}" ${gec ? `loading="lazy"` : `loading="eager" fetchpriority="high"`} decoding="async" />` : "");
const ogeH = (k, s) => `<li class="${P}-${s || "oge"}">${ikonH(k.ikon, `${P}-oikon`)}${k.deger ? `<strong class="${P}-odeger">${esc(k.deger)}</strong>` : ""}${k.metin ? `<span class="${P}-ometin">${k.url ? `<a class="${P}-obag" href="${esc(k.url)}">${esc(k.metin)}</a>` : esc(k.metin)}</span>` : ""}</li>`;
const listeH = (ic, s) => (ic ? `<ul class="${P}-${s || "ogeler"}" role="list">${ic}</ul>` : "");
/* --- modül: acilis-kart-yigini --- */
const kart = (k, i) => (i < 2 ? `<li class="${P}-cip ${P}-cip--${i + 1}">${ikonH(k.ikon || "auto_awesome", `${P}-oikon`)}<span>${k.deger ? `<strong class="${P}-odeger">${esc(k.deger)}</strong>` : ""}${k.metin ? `<span class="${P}-ometin">${esc(k.metin)}</span>` : ""}</span></li>` : "");
const sar = (ic, A, B) => `<div class="${P}-duzen${IMG ? "" : ` ${P}-duzen--tek`}"><div class="${P}-yazi ${P}-gir">${ustH(B)}${h1H(B)}${metH(B)}${dugH()}${!IMG && A.length ? listeH(A.map((k) => ogeH(k)).join("")) : ""}</div>${IMG ? `<div class="${P}-yigin"><span class="${P}-arka" aria-hidden="true"></span><div class="${P}-on">${medH(IMG, "gorsel", 900, 1100)}</div>${listeH(ic, "cipler")}</div>` : ""}</div>`;
const B = { ust: metinAl(des, ["ust","eyebrow","badge","kicker"]), baslik: metinAl(des, ["baslik","title"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
