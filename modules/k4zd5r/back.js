/* alt-merkez — Alt Merkez — ortalı tek eksen, noktalı satır gezinme (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Her şey tek eksende ortalı: logo, tanıtım, nokta ayraçlı tek satır sayfa listesi, ikincil bağlantılar, satır içi iletişim, sosyal daireler, dil ve telif.
   Üretici: scripts/modul-fabrika (aile footer) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: Sayfalar site sayfalarından (pagesetting, `maxpages`, varsayılan 6); desing: hakkinda · tel · eposta · adres · services/links [{ ad|name, url|href }] · hours [{ days, time }] · legal [{ text, href }] · social [{ ad, url }] · rightsText · cta_ad/cta_url · nlTitle/nlText/nlEmail (bülten); data [{ ad, url }] ek bağlantılar. */
const P = "modulex-alt-merkez";
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
/* --- aile: footer --- */
/* sayfalar: pagesetting → kategorisiz, yayında sayfalar; ilk öğe @home@ (footer-9/10 · footer-bento ile aynı) */
const sayfa = page || {};
let maks = parseInt(des.maxpages, 10);
if (!Number.isFinite(maks)) maks = 6;
const ps = Array.isArray(webmakerdata?.pagesetting?.data) ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page) : null;
const sSatir = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
const kayitlar = [{ ad: "@home@", url: wxLangInternalHref(""), aktif: !sayfa.path }];
for (const r of sSatir) {
  if (maks > 0 && kayitlar.length > maks) break;
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const a = pick(r.name).trim();
  if (a) kayitlar.push({ ad: a, url: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
/* bağlantılar: desing.services (footer-10) + desing.links + data satırları [{ ad|name|text, url|href }] */
const baglantilar = [].concat(Array.isArray(des.services) ? des.services : [], Array.isArray(des.links) ? des.links : [], veri)
  .map((o) => ({ ad: metinAl(o, ["ad", "name", "text", "baslik", "title"]), url: href(ilk(o, ["url", "href", "link"])) }))
  .filter((k) => k.ad);
/* iletişim: desing → setting (footer-bento / footer-10 sırası) */
const tel = metinAl(des, ["tel", "phone", "telefon"]) || (typeof setting.phone === "string" ? setting.phone.trim() : "");
const posta = metinAl(des, ["eposta", "email"]) || (typeof setting.email === "string" ? setting.email.trim() : "");
const adres = metinAl(des, ["adres", "address"]) || pick(setting.address).trim();
const harita = href(ilk(des, ["haritaUrl", "mapUrl", "mapsUrl"])) || (adres ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}` : "");
const iletisim = [];
if (adres) iletisim.push({ tur: "adres", ikon: "location_on", etiket: "@contact-address@", deger: satirlar(adres), url: "" });
if (tel) iletisim.push({ tur: "tel", ikon: "call", etiket: "@contact-phone@", deger: `<bdi dir="ltr">${esc(tel)}</bdi>`, url: `tel:${tel.replace(/[^+\d]/g, "")}`, ham: tel });
if (posta) iletisim.push({ tur: "posta", ikon: "mail", etiket: "@contact-email@", deger: `<bdi dir="ltr">${esc(posta)}</bdi>`, url: `mailto:${posta}`, ham: posta });
const saatler = (Array.isArray(des.hours) ? des.hours : []).map((o) => ({ gun: metinAl(o, ["days", "gun"]), saat: metinAl(o, ["time", "saat"]) })).filter((k) => k.gun && k.saat);
const yasal = (Array.isArray(des.legal) ? des.legal : []).map((o) => ({ ad: metinAl(o, ["text", "name", "ad"]), url: href(ilk(o, ["href", "url"])) })).filter((k) => k.ad && k.url);
const hakkinda = metinAl(des, ["hakkinda", "about", "slogan"]) || pick(setting.description).trim();
const hakMetin = metinAl(des, ["rightsText", "copyright"]);
const yil = String(new Date().getFullYear());
const T = {
  sayfa: metinAl(des, ["title_pages"]) || "@pages@", bag: metinAl(des, ["title_services", "title_links"]),
  il: metinAl(des, ["title_contact"]) || "@contact-us@", saat: metinAl(des, ["title_hours"]) || "@opening-hours@", sosyal: metinAl(des, ["title_social"]) || "@follow-us@",
};
/* bülten (footer-10): başlık/metin + alıcı e-posta varsa mailto formu; nlShow:false ya da nlGonderim:"kapali" kapatır */
const nlBaslik = metinAl(des, ["nlTitle", "bultenBaslik"]);
const nlMetin = metinAl(des, ["nlText", "bultenMetin"]);
const nlPosta = metinAl(des, ["nlEmail"]) || posta;
const nlAcik = dogru(des.nlShow, true) && String(des.nlGonderim || "").trim() !== "kapali" && !!(nlBaslik || nlMetin) && !!nlPosta;
/* --- parça üreticileri: her modül yalnız yerleşimi çizer --- */
const bagA = (k) => (k.url ? `<a class="${P}-bag" href="${esc(k.url)}"${k.aktif ? ' aria-current="page"' : ""}>${esc(k.ad)}</a>` : `<span>${esc(k.ad)}</span>`);
const sayfaH = (s) => `<ul class="${P}-${s || "sayfalar"}">${kayitlar.map((k) => `<li>${bagA(k)}</li>`).join("")}</ul>`;
const bagH = (s) => (baglantilar.length ? `<ul class="${P}-${s || "baglantilar"}">${baglantilar.map((k) => `<li>${bagA(k)}</li>`).join("")}</ul>` : "");
const ilH = (s, etiketli) => (iletisim.length ? `<ul class="${P}-${s || "iletisim"}">${iletisim.map((k) => `<li class="${P}-il ${P}-il--${k.tur}">${ikonH(k.ikon, `${P}-il-ikon`)}<span class="${P}-il-ic">${etiketli ? `<span class="${P}-il-etiket">${k.etiket}</span>` : ""}${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${k.deger}</a>` : `<span>${k.deger}</span>`}</span></li>`).join("")}</ul>` : "");
const saatH = (s) => (saatler.length ? `<dl class="${P}-${s || "saatler"}">${saatler.map((k) => `<div class="${P}-saat"><dt>${esc(k.gun)}</dt><dd><bdi dir="ltr">${esc(k.saat)}</bdi></dd></div>`).join("")}</dl>` : "");
const yasalH = (s) => (yasal.length ? `<ul class="${P}-${s || "yasal"}">${yasal.map((k) => `<li>${bagA(k)}</li>`).join("")}</ul>` : "");
const sosyalH = () => (typeof wmSocialBar === "function" ? wmSocialBar({ liste: `${P}-sosyal`, oge: `${P}-sosyal-li`, baglanti: `${P}-sosyal-a`, aria: "@follow-us@" }) : "");
const blok = (baslik, ic, s) => (ic ? `<div class="${P}-blok${s ? ` ${P}-blok--${s}` : ""}">${baslik ? `<h2 class="${P}-bbaslik">${esc(baslik)}</h2>` : ""}${ic}</div>` : "");
const logoH = (s) => `<a class="${P}-${s || "logo"}" href="/{{lang}}/" aria-label="@home@ - {{web-name}}">${String(setting.logo || "").trim() ? `<img src="/img/{{logo}}" alt="{{web-name}}" loading="lazy" decoding="async" />` : `<span class="${P}-ad">{{web-name}}</span>`}</a>`;
const hakkindaH = (s) => (hakkinda ? `<p class="${P}-${s || "hakkinda"}">${satirlar(hakkinda)}</p>` : "");
const telifH = (s) => `<p class="${P}-${s || "telif"}"><span>&copy; ${yil} {{web-name}}</span><span>${hakMetin ? esc(hakMetin) : "@all-rights@"}</span></p>`;
const dilH = () => `<div class="${P}-dil">{{langbar}}</div>`;
const yukariH = (s) => `<a class="${P}-${s || "yukari"}" href="#" aria-label="@back-to-top@"><span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span></a>`;
const bultenH = (s) => (nlAcik ? `<form class="${P}-${s || "bulten"}" data-fb-form data-eposta="${esc(nlPosta)}" data-konu="${esc(nlBaslik)}" data-ok="@form-sent@" data-hata="@form-error@" action="mailto:${esc(nlPosta)}" method="post" enctype="text/plain">`
  + `<label class="${P}-nl-etiket" for="${P}-{{id}}-nl">${esc(metinAl(des, ["nlLabel"])) || "@contact-email@"}</label>`
  + `<span class="${P}-nl-satir"><input class="${P}-nl-girdi" id="${P}-{{id}}-nl" name="email" type="email" inputmode="email" autocomplete="email" required />`
  + `<button type="submit" class="${P}-nl-dugme">${esc(metinAl(des, ["nlBtn"])) || "@sent@"}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></button></span>`
  + `<span class="${P}-nl-durum" role="status" aria-live="polite"></span></form>` : "");
const bultenYazi = (s) => (nlAcik ? `<div class="${P}-${s || "nl-yazi"}">${nlBaslik ? `<h2 class="${P}-nl-baslik">${esc(nlBaslik)}</h2>` : ""}${nlMetin ? `<p class="${P}-nl-metin">${esc(nlMetin)}</p>` : ""}</div>` : "");
/* --- modül: alt-merkez --- */
const kart = function () { return ""; };
const sar = () => `<div class="${P}-yigin">${logoH()}${hakkindaH()}<nav class="${P}-nav" aria-label="@navigation@">${sayfaH("satir")}</nav>${bagH("satir2")}${ilH("satir3")}${sosyalH()}${dilH()}<span class="${P}-cizgi" aria-hidden="true"></span>${telifH()}</div>`;
const B = { ust: metinAl(des, ["ust","kicker"]), baslik: metinAl(des, ["baslik","ctaBaslik"]), metin: metinAl(des, ["metin","ctaMetin"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = false;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik && bas ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
