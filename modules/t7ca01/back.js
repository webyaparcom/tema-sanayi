/* cagri-daire-dugme — Çağrı Daire Düğme — dev yuvarlak eylem (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Başlık + metin bir yanda; öbür yanda birincil eylem dev bir daire (iç halkası döner, ok hover'da eğilir). İkincil düğme altta metin bağlantısı.
   Üretici: scripts/modul-fabrika (aile cta) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: { ust?, baslik, metin?, btn1Text/btn1Url, btn2Text/btn2Url, img?, ikon?, not?, number?, waLabel?, hours? } · data (isteğe bağlı): [{ ikon?, baslik, aciklama? }] kısa maddeler — metinler dil sözlüğü. */
const P = "modulex-cagri-daire-dugme";
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
/* --- aile: cta --- */
/* bağlantı: dil önekli sabit değer (/tr/iletisim) aktif dile çevrilir (cta-1 F3 onarımıyla aynı) */
const urlAl = (v) => { const s = pick(v).trim(); if (!s) return ""; return href(/^(https?:)?\/\//i.test(s) ? s : s.replace(/^\/[a-z]{2}(\/|$)/i, "/")); };
const dugmeler = [
  [metinAl(des, ["btn1Text", "btn1Label", "btnText", "cta_ad", "button"]), urlAl(ilk(des, ["btn1Url", "btnUrl", "cta_url", "buttonurl", "url"]))],
  [metinAl(des, ["btn2Text", "btn2Label", "cta2_ad"]), urlAl(ilk(des, ["btn2Url", "cta2_url"]))],
].filter((d) => d[0] && d[1]).map((d, i) => ({ ad: d[0], url: d[1], i }));
/* telefon / WhatsApp: desing.number > setting.whatsapp > setting.phone (yalnız rakam, en az 8) */
const telHam = String(pick(ilk(des, ["number", "tel"])) || setting.whatsapp || setting.phone || "").replace(/[^\d]/g, "");
const tel = telHam.length >= 8 ? telHam : "";
const waMesaj = metinAl(des, ["waMessage"]);
const D = {
  dugmeler, img: medyaUrl(ilk(des, ["img", "image", "gorsel"])), alt: metinAl(des, ["alt"]), ikon: ikonAd(ilk(des, ["ikon", "icon"])),
  not: metinAl(des, ["not", "note"]), tel, telYazi: metinAl(des, ["numberText"]) || (tel ? "+" + tel : ""),
  wa: tel ? `https://wa.me/${tel}${waMesaj ? "?text=" + encodeURIComponent(waMesaj) : ""}` : "",
  waAd: metinAl(des, ["waLabel"]), waBaslik: metinAl(des, ["waTitle"]), saat: metinAl(des, ["hours"]), saatAd: metinAl(des, ["hoursLabel"]),
};
const kayitlar = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title", "metin", "text"]),
  metin: metinAl(o, ["aciklama", "description"]),
})).filter((k) => k.baslik);
/* parça yardımcıları — başlık kimliği bölümün aria-labelledby'sine bağlı */
const bslk = (B, s, t) => (B.baslik ? `<${t || "h2"} class="${P}-${s || "baslik"}" id="${P}-{{id}}-b">${esc(B.baslik)}</${t || "h2"}>` : "");
const ustH = (B, s) => (B.ust ? `<p class="${P}-${s || "ust"}">${esc(B.ust)}</p>` : "");
const metH = (B, s) => (B.metin ? `<p class="${P}-${s || "metin"}">${satirlar(B.metin)}</p>` : "");
const okH = (ad) => `<span class="material-symbols-outlined mx-flip" aria-hidden="true">${ad || "arrow_forward"}</span>`;
const dgTek = (d, s) => `<a class="${P}-dugme${d.i ? ` ${P}-dugme--ikincil` : ""}${s ? ` ${P}-${s}` : ""}" href="${esc(d.url)}">${esc(d.ad)}${d.i ? "" : okH()}</a>`;
const dgH = (s) => (D.dugmeler.length ? `<div class="${P}-${s || "cta"}">${D.dugmeler.map((d) => dgTek(d)).join("")}</div>` : "");
const notH = (s) => (D.not ? `<p class="${P}-${s || "not"}">${esc(D.not)}</p>` : "");
const maddeH = (ic, s) => (ic ? `<ul class="${P}-${s || "maddeler"}" role="list">${ic}</ul>` : "");
const gorH = (s, w, h) => (D.img ? `<img class="${P}-${s || "gorsel"}" src="${esc(D.img)}" alt="${esc(D.alt)}" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const WA = `<svg class="${P}-wasvg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>`;
const telH = (s) => (D.tel ? `<a class="${P}-${s || "tel"}" href="tel:+${D.tel}"><bdi dir="ltr">${esc(D.telYazi)}</bdi></a>` : "");
const waH = (s) => (D.wa ? `<a class="${P}-${s || "wa"}" href="${esc(D.wa)}" target="_blank" rel="noopener">${WA}<span>${esc(D.waAd || D.telYazi)}</span></a>` : "");
const saatH = (s) => (D.saat ? `<p class="${P}-${s || "saat"}"><span class="material-symbols-outlined" aria-hidden="true">schedule</span><span>${D.saatAd ? `<strong>${esc(D.saatAd)}:</strong> ` : ""}${esc(D.saat)}</span></p>` : "");
/* renk anahtarı köprüsü (aile.renkAd): eski veride `text` RENK değeriyse renk olarak kalır (yer tutucu eski ada döner),
   değilse içerik sayılır; renk değeri hiçbir zaman metin olarak basılmaz. Yeni anahtar varsayılandan farklı verilmişse o kazanır. */
const renkMi = (v) => typeof v === "string" && /^\s*(#[0-9a-f]{3,8}|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|var)\(.+\)|transparent|currentcolor)\s*$/i.test(v);
const RENK_KOPRU = {"yaziRenk":["text","var(--mx-site-text, #111318)"]};
const desMetin = { ...des };
for (const [yeni, [eski, vars]] of Object.entries(RENK_KOPRU)) {
  if (!renkMi(des[eski])) continue;
  desMetin[eski] = "";
  if (des[yeni] == null || des[yeni] === "" || des[yeni] === vars) html = html.split(`--${yeni}--`).join(`--${eski}--`);
}
/* --- modül: cagri-daire-dugme --- */
const kart = (k) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<span class="${P}-myazi"><strong>${esc(k.baslik)}</strong>${k.metin ? `<small>${esc(k.metin)}</small>` : ""}</span></li>`;
const sar = (ic, A, B) => `<div class="${P}-duzen"><div class="${P}-yazi">${ustH(B)}${bslk(B)}${metH(B)}${D.dugmeler.filter((d) => d.i).map((d) => `<a class="${P}-bag" href="${esc(d.url)}">${esc(d.ad)}${okH()}</a>`).join("")}</div>${D.dugmeler.filter((d) => !d.i).map((d) => `<a class="${P}-daire" href="${esc(d.url)}"><span class="${P}-halka" aria-hidden="true"></span><span class="${P}-dad">${esc(d.ad)}</span>${okH("north_east")}</a>`).join("")}</div>`;
const B = { ust: metinAl(desMetin, ["ust","badge","kicker","eyebrow"]), baslik: metinAl(desMetin, ["baslik","title"]), metin: metinAl(desMetin, ["metin","description","text"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !D.dugmeler.length;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
