/* randevu-uzman-kart — Randevu Uzman Kartı — önce uzmanı seç (15 Kas 2026 · mcp:webmaker/20261115-224259-bpa9 · D17).
   Uzmanlar baş harf rozetli (ya da fotoğraflı) dikey kartlar; biri seçilince altta hizmet, tarih, saat ve bilgiler; «fark etmez» kartı da var. Uzman listesi yoksa hizmet kartları gelir.
   Üretici: scripts/modul-fabrika (aile randevu) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: phone · whatsapp · email · formAction · submit (whatsapp|mailto|ics) · services[{id,name,duration,price}] · staff[{id,name,role}] · hours{days,start,end,slot,breaks} · closed[] · leadDays · maxDays · mode (masa → kişi + bölüm) · kvkk{text,href}; data [{ ad, sure, fiyat, ikon, metin }] hizmet satırları (desing.services yerine) — metinler dil sözlüğü. */
const P = "modulex-randevu-uzman-kart";
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
/* --- aile: randevu --- */
const guvenli = (v) => { const s = String(v ?? "").trim(); return !s || /^\s*(javascript|vbscript|data|file):/i.test(s) ? "" : s; };
const U = des.ui && typeof des.ui === "object" ? des.ui : {};
const et = (ks, uk, yedek) => metinAl(des, ks) || (uk ? metinAl(U, [uk]) : "") || yedek;
const telYazi = metinAl(des, ["telefon", "phone", "phoneRaw"]) || String(setting.phone || "").trim();
const telNo = telYazi.replace(/[^+\d]/g, "");
const eposta = metinAl(des, ["eposta", "email"]) || String(setting.email || "").trim();
const waHam = String(pick(ilk(des, ["whatsapp", "whatsappRaw"])) || setting.whatsapp || "").replace(/\D/g, "") || telYazi.replace(/\D/g, "");
const waNo = waHam.length >= 8 ? waHam : "";
const yer = metinAl(des, ["konum", "location", "adres", "address"]);
const IMG = medyaUrl(pick(ilk(des, ["img", "gorsel", "image"])));
const marka = pick(setting.name).trim();
const ACTION = ((a) => (/^\/(?!\/)[A-Za-z0-9_\-./]*$/.test(a) || /^https:\/\/[^\s"'<>\\]+$/i.test(a) ? a : ""))(pick(des.formAction).trim());
const SUB = pick(ilk(des, ["submit", "gonderim"])).trim();
let GON = ["whatsapp", "mailto", "ics"].includes(SUB) ? SUB : waNo ? "whatsapp" : "mailto";
if (GON === "whatsapp" && !waNo && eposta) GON = "mailto";
if (GON === "mailto" && !eposta && waNo) GON = "whatsapp";
const AKTIF = !!(ACTION || waNo || eposta);
const sayiAl = (ks, yedek, a, b) => { const v = ilk(des, ks); const n = v === "" ? yedek : Math.round(Number(v)); return Number.isFinite(n) ? Math.min(b, Math.max(a, n)) : yedek; };
const ONGUN = sayiAl(["onGun", "leadDays"], 1, 0, 365);
const AZAMI = sayiAl(["azamiGun", "maxDays"], 60, 1, 730);
const MAXKISI = sayiAl(["maxKisi", "maxPartySize", "maxGuests"], 8, 1, 100);
const EPZOR = dogru(des.requireEmail, false);
const MASA = pick(des.mode).trim() === "masa";
const KAPALI = (Array.isArray(des.closed) ? des.closed : []).map(String).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x));
/* saatler: hours{days,start,end,slot,breaks} → aralıklar; slots[] doğrudan; dayparts[] gün dilimi seçimi */
const hm = (v, yedek) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(v ?? "").trim()); return m ? (+m[1]) * 60 + (+m[2]) : yedek; };
const ss = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const SA = des.hours && typeof des.hours === "object" ? des.hours : des.saatler && typeof des.saatler === "object" ? des.saatler : {};
const GUNLER = ((g) => (g.length ? g : [1, 2, 3, 4, 5]))((Array.isArray(SA.days) ? SA.days : []).map(Number).filter((n) => n >= 1 && n <= 7));
const ACILIS = hm(SA.start, 540);
const KAPANIS = hm(SA.end, 1080);
const ADIM = Math.min(240, Math.max(10, Math.round(Number(SA.slot)) || 30));
const MOLA = (Array.isArray(SA.breaks) ? SA.breaks : []).map((b) => [hm(b && b.start, -1), hm(b && b.end, -1)]).filter((b) => b[0] >= 0 && b[1] > b[0]);
const PARCA = (Array.isArray(des.dayparts) ? des.dayparts : []).map((x) => ({ v: String((x && x.id) || "").replace(/[^\w-]/g, ""), m: metinAl(x || {}, ["ad", "name"]), g: -1 })).filter((x) => x.v && x.m);
const SAATLER = [];
if (Array.isArray(des.slots) && des.slots.length) des.slots.map((x) => pick(x).trim()).filter((x) => /^\d{1,2}:\d{2}$/.test(x)).forEach((v) => SAATLER.push({ v, d: hm(v, 0) }));
else for (let m = ACILIS; m + ADIM <= KAPANIS && SAATLER.length < 96; m += ADIM) if (!MOLA.some((b) => m < b[1] && m + ADIM > b[0])) SAATLER.push({ v: ss(m), d: m });
const SECENEK = PARCA.length ? PARCA : SAATLER.map((x) => ({ v: x.v, m: x.v, g: x.d < 720 ? 0 : x.d < 1020 ? 1 : 2 }));
/* etiketler: desing (yeni ad · eski ad) › ui sözlüğü (randevu-formu) › dil sözlüğü */
const dkBirim = metinAl(U, ["minUnit"]);
const kvO = des.kvkk && typeof des.kvkk === "object" ? des.kvkk : {};
const E = {
  hizmet: et(["hizmetAd", "serviceLabel"], "s_service", "@booking-service@"), secin: et(["secinAd", "servicePick", "timePlaceholder"], "", "@booking-choose@"),
  uzman: et(["uzmanAd", "staffLabel"], "s_staff", "@booking-staff@"), fark: et(["farkAd"], "anyStaff", "@booking-any@"),
  kisi: et(["kisiAd", "guestsLabel"], "s_party", "@booking-guests@"), bolum: et(["bolumAd", "areaLabel"], "t_section", "@booking-area@"),
  tarih: et(["tarihAd", "dateLabel"], "s_date", "@booking-date@"), saat: et(["saatAd", "timeLabel", "daypartLabel"], "s_time", "@booking-time@"),
  ad: et(["adEtiket", "nameLabel"], "fName", "@your-name-and-surname@"), tel: et(["telEtiket", "phoneLabel"], "fPhone", "@contact-phone@"),
  ep: et(["epostaEtiket", "emailLabel"], "fEmail", "@contact-email@"), not: et(["notEtiket", "noteLabel"], "fNote", "@your-message@"),
  bilgi: et(["bilgiAd"], "s_info", "@booking-details@"), kanal: et(["kanalAd"], "", "@booking-channel@"),
  kapaliGun: et(["kapaliMesaj", "dayClosed"], "dayUnavailable", "@booking-day-closed@"), kapali: et(["kapaliAd", "closedLabel"], "", "@booking-closed@"),
  saatler: et(["saatlerAd", "hoursTitle"], "", "@opening-hours@"), ozet: et(["ozetAd", "summaryTitle"], "", "@booking-summary@"),
  adres: et(["adresAd", "addressTitle"], "", "@contact-address@"), yol: et(["yolAd", "mapLink"], "", "@get-directions@"),
  ileri: et(["ileriAd"], "next", "@next@"), geri: et(["geriAd"], "back", "@previous@"),
  dilim: [et([], "p_morning", "@booking-morning@"), et([], "p_afternoon", "@booking-afternoon@"), et([], "p_evening", "@booking-evening@")],
  ok: et(["okAd", "successText"], "", "@form-sent@"), hata: et(["hataAd", "sendErrText"], "", "@form-error@"),
  konu: et(["konu", "subject", "mailSubject"], "mailSubject_randevu", ""),
  kvkk: et(["kvkkText", "consentText"], "", "") || metinAl(kvO, ["text"]), kvkkBag: et(["kvkkLink"], "kvkkLink", ""),
  dk: (n) => (dkBirim ? dkBirim.replace("{n}", sayiBicim(n, 0)) : `${sayiBicim(n, 0)} @booking-minutes@`),
};
E.gonder = metinAl(des, ["gonderAd", "submitText"]) || (GON === "whatsapp" ? et(["submitWhatsapp", "whatsappText"], "submit_whatsapp", "")
  : GON === "ics" ? et([], "submit_ics", "") : et(["submitMailto", "mailtoText"], "submit_mailto", "")) || "@booking-submit@";
const KVHREF = ((h) => (h ? href(h) : ""))(guvenli(pick(ilk(des, ["kvkkUrl", "kvkkHref"])) || pick(kvO.href)));
/* hizmetler (kayitlar): yeni data satırları › desing.services (randevu-formu) › desing.hizmetler */
const PB = String(pick(des.currency) || setting.currency || "₺").trim();
const fiyatH = (v) => { const n = Number(v); return v === "" || v == null || !Number.isFinite(n) ? "" : `${sayiBicim(n, Number.isInteger(n) ? 0 : 2)} ${PB}`; };
const hKaynak = veri.length ? veri : Array.isArray(des.services) ? des.services : Array.isArray(des.hizmetler) ? des.hizmetler : [];
const kayitlar = hKaynak.map((o, i) => ({
  id: String(ilk(o, ["id"]) || `h${i + 1}`).replace(/[^\w-]/g, ""), ad: metinAl(o, ["ad", "baslik", "name", "title"]), metin: metinAl(o, ["metin", "aciklama", "description"]),
  sure: Math.max(0, Math.round(Number(ilk(o, ["sure", "duration"]))) || 0), fiyat: fiyatH(ilk(o, ["fiyat", "price"])), ikon: ikonAd(ilk(o, ["ikon", "icon"])),
  img: medyaUrl(pick(ilk(o, ["img", "gorsel"]))),
})).filter((k) => k.ad);
const UZMAN = (Array.isArray(des.staff) ? des.staff : Array.isArray(des.uzmanlar) ? des.uzmanlar : []).map((o, i) => ({
  id: String(ilk(o, ["id"]) || `u${i + 1}`).replace(/[^\w-]/g, ""), ad: metinAl(o, ["ad", "name"]), rol: metinAl(o, ["rol", "role"]), img: medyaUrl(pick(ilk(o, ["img", "gorsel", "photo"]))),
})).filter((x) => x.ad);
const BOLUM = (Array.isArray(des.sections) ? des.sections : Array.isArray(des.areas) ? des.areas : []).map((o) => (o && typeof o === "object" && !("tr" in o || "en" in o) ? metinAl(o, ["ad", "name"]) : pick(o).trim())).filter(Boolean);
/* --- parça yardımcıları --- */
const fid = (k) => `${P}-{{id}}-${k}`;
const okH = (ad) => `<span class="material-symbols-outlined${ad ? "" : " mx-flip"}" aria-hidden="true">${ad || "arrow_forward"}</span>`;
const yildiz = (z) => (z ? `<span class="${P}-zor" aria-hidden="true"> *</span>` : "");
const alan = (k, tip, e2, z, oto, sinif, ek) => `<div class="${P}-alan${sinif ? ` ${P}-alan--${sinif}` : ""}"><label class="${P}-etiket" for="${fid(k)}">${esc(e2)}${yildiz(z)}</label>`
  + (tip === "textarea" ? `<textarea class="${P}-girdi" id="${fid(k)}" name="${k}" rows="3" data-etiket="${esc(e2)}"></textarea>`
    : `<input class="${P}-girdi" id="${fid(k)}" name="${k}" type="${tip}" data-etiket="${esc(e2)}"${oto ? ` autocomplete="${oto}"` : ""}${z ? " required" : ""}${ek || ""} />`) + "</div>";
const adH = (s) => alan("name", "text", E.ad, true, "name", s);
const telH = (s) => alan("phone", "tel", E.tel, true, "tel", s, ' inputmode="tel" minlength="7"');
const epH = (s) => alan("email", "email", E.ep, EPZOR, "email", s);
const notH = (s) => alan("message", "textarea", E.not, false, "", s || "genis");
const kisiselH = (s) => adH(s) + telH(s) + epH(s);
const secimH = (k, e2, z, ops, ilkM, sinif) => `<div class="${P}-alan${sinif ? ` ${P}-alan--${sinif}` : ""}"><label class="${P}-etiket" for="${fid(k)}">${esc(e2)}${yildiz(z)}</label><select class="${P}-girdi ${P}-secim" id="${fid(k)}" name="${k}" data-etiket="${esc(e2)}"${z ? " required" : ""}><option value="">${esc(ilkM)}</option>${ops}</select></div>`;
const hizmetMetin = (k) => [k.ad, k.sure ? E.dk(k.sure) : "", k.fiyat].filter(Boolean).join(" · ");
const hizmetAlt = (k) => [k.sure ? E.dk(k.sure) : "", k.fiyat].filter(Boolean).join(" · ");
const ETK = { service: E.hizmet, staff: E.uzman, time: E.saat, area: E.bolum, "fb-kanal": E.kanal };
const radyo = (ad, deger, metin, zor, ek) => `<input class="${P}-radyo" type="radio" name="${ad}" value="${esc(deger)}" data-metin="${esc(metin)}" data-etiket="${esc(ETK[ad] || ad)}"${zor ? " required" : ""}${ek || ""} />`;
const hKart = (k, i, ic, sinif) => `<label class="${P}-${sinif || "hkart"}">${radyo("service", k.id, hizmetMetin(k), i === 0, ` data-sure="${k.sure}"`)}<span class="${P}-hic">${ic}</span></label>`;
const grupH = (e2, ic, sinif, z) => `<fieldset class="${P}-grup${sinif ? ` ${P}-grup--${sinif}` : ""}"><legend class="${P}-etiket">${esc(e2)}${yildiz(z !== false)}</legend><div class="${P}-secenekler">${ic}</div></fieldset>`;
const hizmetSecH = (s) => (kayitlar.length ? secimH("service", E.hizmet, true, kayitlar.map((k) => `<option value="${esc(k.id)}" data-sure="${k.sure}">${esc(hizmetMetin(k))}</option>`).join(""), E.secin, s) : "");
const hizmetCipH = (s) => (kayitlar.length ? grupH(E.hizmet, kayitlar.map((k, i) => `<label class="${P}-cip">${radyo("service", k.id, hizmetMetin(k), i === 0, ` data-sure="${k.sure}"`)}<span class="${P}-cyazi">${esc(k.ad)}${hizmetAlt(k) ? `<small>${esc(hizmetAlt(k))}</small>` : ""}</span></label>`).join(""), s) : "");
const uzmanSecH = (s) => (UZMAN.length ? secimH("staff", E.uzman, false, UZMAN.map((u) => `<option value="${esc(u.id)}">${esc(u.ad)}${u.rol ? ` · ${esc(u.rol)}` : ""}</option>`).join(""), E.fark, s) : "");
const kisiH = (s, sayacli) => `<div class="${P}-alan ${P}-alan--kisi${s ? ` ${P}-alan--${s}` : ""}"><label class="${P}-etiket" for="${fid("guests")}">${esc(E.kisi)}${yildiz(true)}</label><div class="${P}-sayac">`
  + (sayacli ? `<button type="button" class="${P}-adimla" data-eksi="${fid("guests")}" aria-label="${esc(E.kisi)} −"><span class="material-symbols-outlined" aria-hidden="true">remove</span></button>` : "")
  + `<input class="${P}-girdi ${P}-kisi" id="${fid("guests")}" name="guests" type="number" inputmode="numeric" min="1" max="${MAXKISI}" value="2" data-etiket="${esc(E.kisi)}" required />`
  + (sayacli ? `<button type="button" class="${P}-adimla" data-arti="${fid("guests")}" aria-label="${esc(E.kisi)} +"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>` : "") + "</div></div>";
const bolumH = (s) => (BOLUM.length ? secimH("area", E.bolum, false, BOLUM.map((b) => `<option>${esc(b)}</option>`).join(""), E.fark, s) : "");
const masaH = (s) => (MASA ? kisiH(s) + bolumH(s) : "");
const tarihH = (s, serit) => `<div class="${P}-alan ${P}-alan--tarih${s ? ` ${P}-alan--${s}` : ""}" data-tarih-alan><label class="${P}-etiket" for="${fid("date")}">${esc(E.tarih)}${yildiz(true)}</label><input class="${P}-girdi" id="${fid("date")}" name="date" type="date" data-etiket="${esc(E.tarih)}" required /></div>`
  + (serit ? `<fieldset class="${P}-grup ${P}-grup--gun" data-gun-kap hidden><legend class="${P}-etiket">${esc(E.tarih)}${yildiz(true)}</legend><div class="${P}-gunler" data-gun-serit="${serit}"></div></fieldset>` : "");
const saatEt = (o) => (PARCA.length ? esc(o.m) : `<bdi dir="ltr">${esc(o.m)}</bdi>`);
const saatSecH = (s) => (SECENEK.length ? secimH("time", E.saat, true, SECENEK.map((o) => `<option value="${esc(o.v)}">${esc(o.m)}</option>`).join(""), E.secin, s) : "");
const saatCipH = (s) => (SECENEK.length ? grupH(E.saat, SECENEK.map((o, i) => `<label class="${P}-saat">${radyo("time", o.v, o.m, i === 0)}<span class="${P}-syazi">${saatEt(o)}</span></label>`).join(""), s || "saat") : "");
/* gün dilimine göre kümeli saatler (sabah · öğleden sonra · akşam); gün dilimi listesi (dayparts) varsa düz çip */
const saatGrupH = (s) => {
  if (!SECENEK.length) return "";
  if (PARCA.length) return saatCipH(s);
  return `<fieldset class="${P}-grup ${P}-grup--${s || "dilim"}"><legend class="${P}-etiket">${esc(E.saat)}${yildiz(true)}</legend><div class="${P}-dilimler">${[0, 1, 2].map((g) => {
    const L = SECENEK.filter((o) => o.g === g);
    return L.length ? `<div class="${P}-dilim"><p class="${P}-dbaslik">${okH(["wb_twilight", "light_mode", "dark_mode"][g])}${esc(E.dilim[g])}</p><div class="${P}-secenekler">${L.map((o) => `<label class="${P}-saat">${radyo("time", o.v, o.m, SECENEK.indexOf(o) === 0)}<span class="${P}-syazi">${saatEt(o)}</span></label>`).join("")}</div></div>` : "";
  }).join("")}</div></fieldset>`;
};
const kvkkH = () => (E.kvkk ? `<div class="${P}-onay"><input type="checkbox" class="${P}-onaykutu" id="${fid("kvkk")}" name="kvkk" required /><label for="${fid("kvkk")}">${esc(E.kvkk)}${KVHREF && E.kvkkBag ? ` <a href="${esc(KVHREF)}" target="_blank" rel="noopener">${esc(E.kvkkBag)}</a>` : ""}</label></div>` : "");
const gIkon = GON === "whatsapp" && !ACTION ? "chat" : GON === "ics" && !ACTION ? "event" : "send";
const gonderH = (s) => `<div class="${P}-gkap${s ? ` ${P}-gkap--${s}` : ""}"><button type="submit" class="${P}-dugme ${P}-gonder" data-son>${esc(E.gonder)}${okH(gIkon)}</button><p class="${P}-durum" role="status" aria-live="polite"></p></div>`;
const balH = () => (ACTION ? `<div class="${P}-bal" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>` : "");
const formAc = (s, B2) => `<form class="${P}-form${s ? ` ${P}-form--${s}` : ""}"${!ACTION && GON === "mailto" && eposta ? ` action="mailto:${esc(eposta)}" method="post" enctype="text/plain"` : ""} data-fb-randevu`
  + ` data-gonderim="${GON}" data-wa="${waNo}" data-eposta="${esc(eposta)}" data-action="${esc(ACTION)}" data-konu="${esc(E.konu || (B2 && B2.baslik) || marka)}" data-ok="${esc(E.ok)}" data-hata="${esc(E.hata)}"`
  + ` data-gunler="${GUNLER.join(",")}" data-kapali="${KAPALI.join(",")}" data-on-gun="${ONGUN}" data-azami-gun="${AZAMI}" data-kapali-mesaj="${esc(E.kapaliGun)}" data-sure="${ADIM}" data-yer="${esc(yer)}">`;
const formKapa = () => `${balH()}</form>`;
const navH = () => `<div class="${P}-adimnav"><button type="button" class="${P}-dugme ${P}-dugme--ikincil" data-geri>${okH("arrow_back")}${esc(E.geri)}</button><button type="button" class="${P}-dugme" data-ileri>${esc(E.ileri)}${okH()}</button></div>`;
const ozetH = (s) => `<ul class="${P}-${s || "ozet"}" data-ozet></ul>`;
/* bilgi parçaları: kanallar · çalışma çizelgesi */
const gunAd = (n, kisa) => { try { return new Intl.DateTimeFormat(dil || undefined, { weekday: kisa ? "short" : "long" }).format(new Date(Date.UTC(2024, 0, n, 12))); } catch (e) { return String(n); } };
const ARALIK = `${ss(ACILIS)}–${ss(KAPANIS)}`;
const cizelgeH = (s, kisa) => `<dl class="${P}-${s || "cizelge"}">${[1, 2, 3, 4, 5, 6, 7].map((n) => { const a = GUNLER.includes(n); return `<div class="${P}-csatir${a ? "" : ` ${P}-csatir--kapali`}"><dt>${esc(gunAd(n, kisa))}</dt><dd>${a ? `<bdi dir="ltr">${ARALIK}</bdi>` : esc(E.kapali)}</dd></div>`; }).join("")}</dl>`;
const KANAL = [];
if (telYazi) KANAL.push({ ikon: "call", et: E.tel, h: `tel:${telNo}`, v: telYazi, ltr: true });
if (waNo) KANAL.push({ ikon: "chat", et: "WhatsApp", h: `https://wa.me/${waNo}`, v: `+${waNo}`, ltr: true, dis: true });
if (eposta) KANAL.push({ ikon: "mail", et: E.ep, h: `mailto:${eposta}`, v: eposta, ltr: true });
if (yer) KANAL.push({ ikon: "location_on", et: E.adres, h: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(yer)}`, v: yer, dis: true });
const kanalH = (s) => (KANAL.length ? `<ul class="${P}-${s || "kanallar"}">${KANAL.map((k) => `<li class="${P}-kanal">${ikonH(k.ikon, `${P}-kikon`)}<span class="${P}-kyazi"><span class="${P}-ket">${esc(k.et)}</span><a class="${P}-kdeger" href="${esc(k.h)}"${k.dis ? ' target="_blank" rel="noopener noreferrer"' : ""}>${k.ltr ? `<bdi dir="ltr">${esc(k.v)}</bdi>` : esc(k.v)}</a></span></li>`).join("")}</ul>` : "");
const basKendi = (B2, s) => basHtml(B2, s || "");
/* --- modül: randevu-uzman-kart --- */
const kart = (k, i) => hKart(k, i, `${ikonH(k.ikon || "event_available", `${P}-uikon`)}<b class="${P}-uad">${esc(k.ad)}</b>${hizmetAlt(k) ? `<small class="${P}-urol">${esc(hizmetAlt(k))}</small>` : ""}`, "ukart");
const sar = (ic, A, B) => {
    const bas = (ad) => esc(String(ad).trim().split(/\s+/).slice(0, 2).map((x) => x.charAt(0)).join("").toLocaleUpperCase(dil || undefined));
    const kisiler = UZMAN.length ? grupH(E.uzman, `<label class="${P}-ukart">${radyo("staff", "", E.fark, false, " checked")}<span class="${P}-hic"><span class="${P}-avatar ${P}-avatar--bos" aria-hidden="true"><span class="material-symbols-outlined">groups</span></span><b class="${P}-uad">${esc(E.fark)}</b></span></label>`
      + UZMAN.map((u) => `<label class="${P}-ukart">${radyo("staff", u.id, u.ad + (u.rol ? ` · ${u.rol}` : ""), false)}<span class="${P}-hic">${u.img ? `<img class="${P}-avatar" src="${esc(u.img)}" alt="" width="96" height="96" loading="lazy" />` : `<span class="${P}-avatar" aria-hidden="true">${bas(u.ad)}</span>`}<b class="${P}-uad">${esc(u.ad)}</b>${u.rol ? `<small class="${P}-urol">${esc(u.rol)}</small>` : ""}</span></label>`).join(""), "kisi", false)
      : A.length ? `<fieldset class="${P}-grup ${P}-grup--kisi"><legend class="${P}-etiket">${esc(E.hizmet)}${yildiz(true)}</legend><div class="${P}-secenekler">${ic}</div></fieldset>` : "";
    return `${formAc("", B)}${kisiler}<div class="${P}-alanlar ${P}-dortlu">${UZMAN.length ? hizmetSecH() : ""}${masaH()}${tarihH()}${saatSecH()}${kisiselH()}</div>${notH()}${kvkkH()}${gonderH()}${formKapa()}`;
  };
const B = { ust: metinAl(des, ["ust","badge","kicker"]), baslik: metinAl(des, ["baslik","title"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !AKTIF;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = basHtml(B, "");
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
