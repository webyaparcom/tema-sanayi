/* iletisim-saat-panosu — İletişim Saat Panosu — çalışma saatleri öne (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Çalışma saatleri büyük bir panoda (saat ikonu + dev yazı); yanında öbür kanallar ikonlu liste ve eylem bağlantılarıyla. Saat yoksa ilk kanal panoya çıkar.
   Üretici: scripts/modul-fabrika (aile contact) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: { ust?, baslik, metin?, adres?, telefon?, eposta?, whatsapp?, saat?, haritaUrl?, haritaGomme?, social? [{ ad, url, icon }] } · data (isteğe bağlı): [{ ikon, deger, url?, baslik? }] ek kanal satırları (contact-3 `icon/text/url`) — metinler dil sözlüğü. */
const P = "modulex-iletisim-saat-panosu";
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
/* --- aile: contact --- */
const guvenli = (v) => { const s = String(v ?? "").trim(); return !s || /^\s*(javascript|vbscript|data|file):/i.test(s) ? "" : s; };
/* sosyal: yalnız gerçek hesap (alan adından sonra yol, example.* değil) — contact-7 / sosyalBar ölçütü */
const gercekHesap = (u) => { const m = /^https?:\/\/([^\/?#\s]+)(\/[^?#\s]*)?/i.exec(String(u || "")); if (!m || /(^|\.)example\./i.test(m[1])) return false; return !!(m[2] && m[2].replace(/\//g, "")); };
const adres = metinAl(des, ["adres", "address"]);
const telYazi = metinAl(des, ["telefon", "phone"]) || String(setting.phone || "").trim();
const telNo = telYazi.replace(/[^+\d]/g, "");
const eposta = metinAl(des, ["eposta", "email"]) || String(setting.email || "").trim();
/* WhatsApp: desing.whatsapp > setting.whatsapp > telefon (contact-7 / iletisim-kartlari ile aynı yedek), en az 8 rakam */
const waHam = String(pick(ilk(des, ["whatsapp"])) || setting.whatsapp || "").replace(/\D/g, "") || telYazi.replace(/\D/g, "");
const waNo = waHam.length >= 8 ? waHam : "";
const waMesaj = metinAl(des, ["waMesaj", "waMessage"]);
const saat = metinAl(des, ["saat", "hours"]);
const haritaUrl = guvenli(pick(ilk(des, ["haritaUrl", "mapUrl", "mapsUrl"]))) || (adres ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}` : "");
const gomme = ((g) => (/^https:\/\//i.test(g) ? g : ""))(guvenli(pick(ilk(des, ["haritaGomme", "mapEmbed"]))));
const E = {
  adres: metinAl(des, ["adresAd", "addressTitle", "mapTitle"]) || "@contact-address@", tel: metinAl(des, ["telAd", "phoneTitle", "callTitle"]) || "@contact-phone@",
  eposta: metinAl(des, ["epostaAd", "emailTitle", "mailTitle"]) || "@contact-email@", wa: metinAl(des, ["waAd", "waTitle"]) || "WhatsApp",
  saat: metinAl(des, ["saatAd", "hoursTitle"]) || "@opening-hours@", yol: metinAl(des, ["yolAd", "mapLink", "mapBtn"]) || "@get-directions@",
  ara: metinAl(des, ["araAd", "callBtn"]), waDg: metinAl(des, ["waDugme", "waBtn"]), yaz: metinAl(des, ["yazAd", "mailBtn"]), sosyal: metinAl(des, ["sosyalAd", "socialTitle"]) || "@follow-us@",
};
const kanallar = [];
if (adres) kanallar.push({ tur: "adres", ikon: "location_on", etiket: E.adres, deger: adres, href: haritaUrl, dis: true, eylem: E.yol, ltr: false, kopya: "" });
if (telYazi) kanallar.push({ tur: "tel", ikon: "call", etiket: E.tel, deger: telYazi, href: `tel:${telNo}`, dis: false, eylem: E.ara || E.tel, ltr: true, kopya: telYazi });
if (waNo) kanallar.push({ tur: "wa", ikon: "chat", etiket: E.wa, deger: `+${waNo}`, href: `https://wa.me/${waNo}${waMesaj ? "?text=" + encodeURIComponent(waMesaj) : ""}`, dis: true, eylem: E.waDg || E.wa, ltr: true, kopya: "" });
if (eposta) kanallar.push({ tur: "eposta", ikon: "mail", etiket: E.eposta, deger: eposta, href: `mailto:${eposta}`, dis: false, eylem: E.yaz || E.eposta, ltr: true, kopya: eposta });
if (saat) kanallar.push({ tur: "saat", ikon: "schedule", etiket: E.saat, deger: saat, href: "", dis: false, eylem: "", ltr: false, kopya: "" });
/* contact-3 / yeni data satırları: { icon|ikon, text|deger, url?, baslik? } — bağlantı yoksa içerikten türetilir (contact-3 onarımıyla aynı) */
veri.forEach((o) => {
  const deger = metinAl(o, ["deger", "text", "metin"]);
  if (!deger) return;
  const ik = ikonAd(ilk(o, ["ikon", "icon"])) || "info";
  let u = guvenli(pick(ilk(o, ["url", "href"])));
  let tur = "diger";
  if (/mail/i.test(ik) || (deger.includes("@") && !/\s/.test(deger))) { tur = "eposta"; u = u || `mailto:${deger}`; }
  else if (/phone|call/i.test(ik)) { tur = "tel"; u = u || `tel:${deger.replace(/[^+\d]/g, "")}`; }
  else if (/map|location|place|pin/i.test(ik)) { tur = "adres"; u = u || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deger)}`; }
  else if (/schedule|time|clock/i.test(ik)) tur = "saat";
  const ad = metinAl(o, ["baslik", "title", "name"]) || ({ eposta: E.eposta, tel: E.tel, adres: E.adres, saat: E.saat })[tur] || "";
  const h = u ? (/^(https?:|mailto:|tel:)/i.test(u) ? u : href(u)) : "";
  kanallar.push({ tur, ikon: ik, etiket: ad, deger, href: h, dis: /^https?:/i.test(h), eylem: tur === "adres" ? E.yol : (h ? ad : ""), ltr: tur === "tel" || tur === "eposta", kopya: tur === "tel" || tur === "eposta" ? deger : "" });
});
const kayitlar = kanallar;
const sosyal = (Array.isArray(des.social) ? des.social : Array.isArray(des.sosyal) ? des.sosyal : [])
  .map((x) => ({ ad: metinAl(x || {}, ["ad", "name"]), url: x && gercekHesap(x.url) ? guvenli(x.url) : "", ikon: ikonAd(x && (x.ikon || x.icon)) }))
  .filter((x) => x.ad && x.url);
const IMG = medyaUrl(pick(ilk(des, ["img", "gorsel", "image"])));
const ALT = metinAl(des, ["alt"]);
const marka = pick(setting.name).trim();
/* --- form (contact-7 sözleşmesi): formAction (JSON POST) > gonderim:"whatsapp" > mailto --- */
const FORM = ((a) => ({
  gonderim: pick(des.gonderim).trim() === "whatsapp" && waNo ? "whatsapp" : "mailto",
  action: /^\/(?!\/)[A-Za-z0-9_\-.\/]*$/.test(a) || /^https:\/\/[^\s"'<>\\]+$/i.test(a) ? a : "",
  baslik: metinAl(des, ["formBaslik", "formTitle"]),
  ad: metinAl(des, ["adEtiket", "nameLabel"]) || "@your-name-and-surname@", ep: metinAl(des, ["epostaEtiket", "emailLabel"]) || "@contact-email@",
  tel: metinAl(des, ["telEtiket", "phoneLabel"]) || "@contact-phone@", mesaj: metinAl(des, ["mesajEtiket", "messageLabel"]) || "@your-message@",
  konuAd: metinAl(des, ["konuEtiket", "subjectLabel"]), konuIlk: metinAl(des, ["konuIlk", "subjectPlaceholder"]),
  konular: (Array.isArray(des.subjects) ? des.subjects : []).map((x) => metinAl(x || {}, ["name", "ad"])).filter(Boolean),
  kvkk: metinAl(des, ["kvkkText"]), kvkkHref: guvenli(pick(des.kvkkHref)), kvkkBag: metinAl(des, ["kvkkLinkText"]),
  gonder: metinAl(des, ["gonderAd", "submitText"]) || "@sent@", gonderWa: metinAl(des, ["submitWhatsappText"]),
  konu: metinAl(des, ["mailSubject"]), ok: metinAl(des, ["sentText", "okText"]) || "@form-sent@", hata: metinAl(des, ["sendErrText"]) || "@form-error@",
}))(pick(des.formAction).trim());
FORM.aktif = !!(FORM.action || FORM.gonderim === "whatsapp" || eposta);
/* --- parça yardımcıları --- */
const bslk = (B, s, t) => (B.baslik ? `<${t || "h2"} class="${P}-${s || "baslik"}" id="${P}-{{id}}-b">${esc(B.baslik)}</${t || "h2"}>` : "");
const ustH = (B, s) => (B.ust ? `<p class="${P}-${s || "ust"}">${esc(B.ust)}</p>` : "");
const metH = (B, s) => (B.metin ? `<p class="${P}-${s || "metin"}">${satirlar(B.metin)}</p>` : "");
const okH = (ad) => `<span class="material-symbols-outlined mx-flip" aria-hidden="true">${ad || "arrow_forward"}</span>`;
const disA = (k) => (k.dis ? ' target="_blank" rel="noopener noreferrer"' : "");
const icDeger = (k) => (k.ltr ? `<bdi dir="ltr">${esc(k.deger)}</bdi>` : satirlar(k.deger));
const degerH = (k, s) => (k.href ? `<a class="${P}-${s || "deger"}" href="${esc(k.href)}"${disA(k)}>${icDeger(k)}</a>` : `<span class="${P}-${s || "deger"}">${icDeger(k)}</span>`);
const etH = (k, s) => (k.etiket ? `<span class="${P}-${s || "ketiket"}">${esc(k.etiket)}</span>` : "");
const eylemH = (k, s) => (k.href && k.eylem ? `<a class="${P}-${s || "eylem"}" href="${esc(k.href)}"${disA(k)}>${esc(k.eylem)}${okH()}</a>` : "");
const kopyaH = (k) => (k.kopya ? `<button type="button" class="${P}-kopya" data-kopyala="${esc(k.kopya)}" data-tamam="@copied-text@"><span class="material-symbols-outlined" aria-hidden="true">content_copy</span><span class="${P}-kyazi">@copy-text@</span></button>` : "");
const sosyalH = (s) => (sosyal.length ? `<div class="${P}-${s || "sosyal"}"><p class="${P}-sbaslik">${esc(E.sosyal)}</p><div class="${P}-sliste">${sosyal.map((x) => `<a class="${P}-cip" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${ikonH(x.ikon, `${P}-cikon`)}<span>${esc(x.ad)}</span></a>`).join("")}</div></div>` : "");
/* harita: https gömme varsa iframe; yoksa desenli yer tutucu + yol tarifi (adres varsa) */
const adresK = kanallar.find((k) => k.tur === "adres");
const haritaH = (s) => `<div class="${P}-${s || "harita"}">${gomme ? `<iframe class="${P}-iframe" src="${esc(gomme)}" title="${esc(adresK ? adresK.deger : E.adres)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<div class="${P}-hdesen" aria-hidden="true"><span class="material-symbols-outlined ${P}-pin">location_on</span></div>${adresK && adresK.href ? `<a class="${P}-hyol" href="${esc(adresK.href)}" target="_blank" rel="noopener noreferrer">${esc(E.yol)}${okH("near_me")}</a>` : ""}`}</div>`;
const formH = (s, yuzen) => {
  if (!FORM.aktif) return "";
  const id = (k) => `${P}-{{id}}-${k}`;
  const yer = yuzen ? ' placeholder=" "' : "";
  const alan = (k, tip, et, zor, oto, genis) => `<div class="${P}-alan${genis ? ` ${P}-alan--genis` : ""}">${tip === "textarea" ? `<textarea class="${P}-girdi" id="${id(k)}" name="${k}" rows="4"${yer}${zor ? " required" : ""}></textarea>` : `<input class="${P}-girdi" id="${id(k)}" name="${k}" type="${tip}"${oto ? ` autocomplete="${oto}"` : ""}${yer}${zor ? " required" : ""} />`}<label class="${P}-etiket" for="${id(k)}">${esc(et)}</label></div>`;
  const konu = FORM.konular.length ? `<div class="${P}-alan ${P}-alan--genis"><select class="${P}-girdi ${P}-secim" id="${id("topic")}" name="topic"${FORM.konuAd ? "" : ` aria-label="${esc(FORM.konuIlk || FORM.mesaj)}"`}><option value="">${esc(FORM.konuIlk || "—")}</option>${FORM.konular.map((x) => `<option>${esc(x)}</option>`).join("")}</select>${FORM.konuAd ? `<label class="${P}-etiket ${P}-etiket--sabit" for="${id("topic")}">${esc(FORM.konuAd)}</label>` : ""}</div>` : "";
  const kvkk = FORM.kvkk ? `<div class="${P}-onay"><input type="checkbox" id="${id("kvkk")}" name="kvkk" required /><label for="${id("kvkk")}">${esc(FORM.kvkk)}${FORM.kvkkHref && FORM.kvkkBag ? ` <a href="${esc(href(FORM.kvkkHref))}" target="_blank" rel="noopener">${esc(FORM.kvkkBag)}</a>` : ""}</label></div>` : "";
  const bal = FORM.action ? `<div class="${P}-bal" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>` : "";
  const yedek = !FORM.action && FORM.gonderim === "mailto" && eposta ? ` action="mailto:${esc(eposta)}" method="post" enctype="text/plain"` : "";
  const dg = FORM.gonderim === "whatsapp" && !FORM.action ? FORM.gonderWa || FORM.gonder : FORM.gonder;
  return `<form class="${P}-${s || "form"}${yuzen ? ` ${P}-form--yuzen` : ""}"${yedek} data-fb-form data-gonderim="${FORM.gonderim}" data-eposta="${esc(eposta)}" data-wa="${FORM.gonderim === "whatsapp" ? waNo : ""}" data-action="${esc(FORM.action)}" data-konu="${esc(FORM.konu)}" data-ok="${esc(FORM.ok)}" data-hata="${esc(FORM.hata)}">`
    + (FORM.baslik ? `<h3 class="${P}-fbaslik">${esc(FORM.baslik)}</h3>` : "")
    + `<div class="${P}-alanlar">${alan("name", "text", FORM.ad, true, "name")}${alan("email", "email", FORM.ep, true, "email")}${alan("phone", "tel", FORM.tel, false, "tel", true)}${konu}${alan("message", "textarea", FORM.mesaj, true, "", true)}</div>`
    + kvkk + bal + `<button type="submit" class="${P}-dugme ${P}-gonder">${esc(dg)}${okH("send")}</button><p class="${P}-durum" role="status" aria-live="polite"></p></form>`;
};
/* --- modül: iletisim-saat-panosu --- */
const kart = (k) => `<li class="${P}-kanal ${P}-kanal--${k.tur}">${ikonH(k.ikon, `${P}-kikon`)}<span class="${P}-kgovde">${etH(k)}${degerH(k)}</span></li>`;
const sar = (ic, A) => {
    const pano = A.find((k) => k.tur === "saat") || A[0];
    const diger = A.filter((k) => k !== pano);
    return `<div class="${P}-duzen"><div class="${P}-pano">${ikonH(pano.ikon, `${P}-pikon`)}${etH(pano, "pet")}<p class="${P}-pdeger">${icDeger(pano)}</p>${eylemH(pano, "peylem")}</div>${diger.length ? `<ul class="${P}-liste" role="list">${diger.map((k) => `<li class="${P}-kanal">${ikonH(k.ikon, `${P}-kikon`)}<span class="${P}-kgovde">${etH(k)}${degerH(k)}${eylemH(k)}</span></li>`).join("")}</ul>` : ""}</div>`;
  };
const B = { ust: metinAl(des, ["ust","badge","kicker","eyebrow"]), baslik: metinAl(des, ["baslik","title","name"]), metin: metinAl(des, ["metin","description","text","panelText"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !kayitlar.length;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = basHtml(B, "");
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
