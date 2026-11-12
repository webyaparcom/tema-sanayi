/* 8 Kas 2026: asagidaki for (var page of ...) render parametresi page'i ezer; dort-sutun duzeni gecerli sayfayi buradan okur */
var f3GecerliSayfa = page;
var pagesettingjson = webmakerdata.pagesetting.data.find(
  function(item) { return item.modulestatus && item.modulestatus.page; },
);
var backhtml = `<li class="modulex-menu__item"><a class="modulex-menu_link" href="${wxLangInternalHref('')}">@home@</a></li>`;
if (pagesettingjson) {
  for (var page of webmakerdata[pagesettingjson.path]?.data || []) {
    if (page.status === "play") {
      backhtml += `<li class="modulex-menu__item"><a class="modulex-menu_link" href="/${
        json.lang
      }/${page.path}/">${((page.name && (page.name[json.lang] != null ? page.name[json.lang] : page.name.tr)) || "")}</a></li>`;
    }
  }
}
var color = json.desing.color.replace(/#/g, "");
/* 31 Eki 2026: contact_line (auto|false) — yalniz setting.phone / setting.email VARSA tek satir basilir, uydurma yok.
   logo_plate:true — koyu logoyu koyu zeminde okunur kilan beyaz plaka sinifi. */
var f3Setting = (webmakerdata && webmakerdata.setting) || {};
var f3Mode = json.desing.contact_line;
var f3Parts = [];
if (f3Mode !== false && f3Mode !== "false" && f3Mode !== "" && f3Mode != null) {
  var f3Phone = typeof f3Setting.phone === "string" ? f3Setting.phone.trim() : "";
  var f3Email = typeof f3Setting.email === "string" ? f3Setting.email.trim() : "";
  if (f3Phone) f3Parts.push('<a href="tel:' + f3Phone.replace(/[^+\d]/g, "") + '" dir="ltr">' + f3Phone + "</a>");
  if (f3Email) f3Parts.push('<a href="mailto:' + f3Email + '">' + f3Email + "</a>");
}
var f3Contact = f3Parts.length
  ? '<div class="footer-contact">' + f3Parts.join('<span class="footer-contact__sep" aria-hidden="true">&middot;</span>') + "</div>"
  : "";
html = html.replace(/{{html}}/g, backhtml).replace(/#color#/g, color).replace(/{{contactline}}/g, f3Contact);
if (json.desing.logo_plate === true || json.desing.logo_plate === "true") {
  html = html.replace('class="footer-logo"', 'class="footer-logo footer-logo--plate"');
}

/* 8 Kas 2026 (sevgane altbilgisinden genelleştirildi) — seçenekler; boşsa yukarıdaki klasik çıktı aynen kalır.
   desing.logoDark (yoksa setting.logoDark): koyu temada ikinci logo. desing.duzen === "dort-sutun": marka (logo · slogan · sosyal) ·
   gezinti · alt sayfalar (desing.ikinciSutun = hub slug'ı; boşsa alt sayfası olan ilk menü öğesi) · iletişim (yalnız setting'te olan
   e-posta/telefon/adres) + alt şerit (telif · altLinkler · dil çipleri). Yasal bağlantılar verilmezse motorun wm-yasal bloğu ekler. */
var f3LogoDark = String(json.desing.logoDark || f3Setting.logoDark || "").trim();
if (!/^[^"<>\s]+$/.test(f3LogoDark)) f3LogoDark = "";
var f3OtoKoyu = f3Setting.colorScheme === "auto";
var f3LogoCss = !f3LogoDark ? "" : ".mx-logo-koyu{display:none!important}" +
  (f3OtoKoyu ? '@media (prefers-color-scheme:dark){:root:not([data-mx-scheme="light"]) .mx-logo-acik{display:none!important}:root:not([data-mx-scheme="light"]) .mx-logo-koyu{display:block!important}}' : "") +
  'html[data-mx-scheme="dark"] .mx-logo-acik{display:none!important}html[data-mx-scheme="dark"] .mx-logo-koyu{display:block!important}';
if (f3LogoDark && json.desing.duzen !== "dort-sutun") {
  html = html.replace(/<img src="\/img\/\{\{logo\}\}"[^>]*>/, function (tag) {
    return tag.replace("<img ", '<img class="mx-logo-acik" ') + tag.replace("{{logo}}", function () { return f3LogoDark; }).replace("<img ", '<img class="mx-logo-koyu" ');
  });
  html += "<style>" + f3LogoCss + "</style>";
}
if (json.desing.duzen === "dort-sutun") {
  var f3L = json.lang || "tr";
  var f3Tx = function (o) {
    if (o == null) return "";
    if (typeof o === "string") return o;
    return o[f3L] || o.tr || o.en || "";
  };
  var f3Esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var F3T = {
    nav: { tr: "Gezinti", en: "Navigate", ar: "التنقل", de: "Navigation", es: "Navegación" },
    contact: { tr: "İletişim", en: "Contact", ar: "تواصل", de: "Kontakt", es: "Contacto" },
    lang: { tr: "Dil", en: "Language", ar: "اللغة", de: "Sprache", es: "Idioma" },
    social: { tr: "Sosyal bağlantılar", en: "Social links", ar: "روابط التواصل", de: "Soziale Netzwerke", es: "Redes sociales" },
    legal: { tr: "Alt bağlantılar", en: "Footer links", ar: "روابط التذييل", de: "Fußzeilen-Links", es: "Enlaces del pie" }
  };
  var f3Slug = function (it) {
    var n = it && it.pathnext;
    if (n != null && String(n).trim() !== "") return String(n).trim();
    return it && it.path != null ? String(it.path) : "";
  };
  var f3Ad = function (it) {
    if (!it || !it.name) return "";
    return typeof it.name === "string" ? it.name : it.name[f3L] || it.name.tr || it.name.en || "";
  };
  var f3Cur = f3GecerliSayfa ? f3Slug(f3GecerliSayfa) : "";
  var f3Link = function (slug, ad) {
    return '<li><a href="' + wxLangInternalHref(slug) + '"' + (slug === f3Cur ? ' aria-current="page"' : "") + ">" + f3Esc(ad) + "</a></li>";
  };
  var f3Rows = pagesettingjson && webmakerdata[pagesettingjson.path] ? webmakerdata[pagesettingjson.path].data || [] : [];
  var f3Ust = f3Rows.filter(function (r) { return r && r.status === "play" && (r.category == "" || r.category == null); });
  var f3Alt = function (ust) {
    var cikti = [], gorulen = {};
    var ekle = function (r) {
      if (!r || r.status !== "play") return;
      var k = String(r.id || r.path || "");
      if (!k || gorulen[k]) return;
      gorulen[k] = true;
      cikti.push(r);
    };
    var kova = webmakerdata[ust.path] && webmakerdata[ust.path].data ? webmakerdata[ust.path] : webmakerdata[ust.id] && webmakerdata[ust.id].data ? webmakerdata[ust.id] : null;
    if (kova) kova.data.forEach(ekle);
    if (ust.id) f3Rows.forEach(function (r) { if (r && r.category === ust.id) ekle(r); });
    return cikti;
  };
  var f3NavHtml = f3Ust.map(function (r) { return f3Link(f3Slug(r), f3Ad(r)); }).join("");
  var f3Hub = null;
  var f3HubIstek = String(json.desing.ikinciSutun || "").replace(/^\/+|\/+$/g, "");
  f3Ust.some(function (r) {
    if (f3HubIstek ? f3Slug(r) === f3HubIstek || r.id === f3HubIstek : f3Alt(r).length) { f3Hub = r; return true; }
    return false;
  });
  var f3HubAlt = f3Hub ? f3Alt(f3Hub) : [];
  var f3HubHtml = f3HubAlt.map(function (r) { return f3Link(f3Slug(r), f3Ad(r)); }).join("");

  var f3SiteAd = f3Esc(f3Ad({ name: f3Setting.name }));
  var f3Logo = '<img class="f3k-logo-img' + (f3LogoDark ? " mx-logo-acik" : "") + '" src="/img/{{logo}}" height="48" alt="' + f3SiteAd + '" loading="lazy" decoding="async" />';
  if (f3LogoDark) f3Logo += '<img class="f3k-logo-img mx-logo-koyu" src="/img/' + f3Esc(f3LogoDark) + '" height="48" alt="' + f3SiteAd + '" loading="lazy" decoding="async" />';
  var f3Slogan = f3Tx(json.desing.slogan);
  var f3Sosyal = typeof wmSocialBar === "function" ? wmSocialBar({ liste: "f3k-social", aria: f3Tx(F3T.social) }) : "";

  var f3Ilet = [];
  var f3Mail = typeof f3Setting.email === "string" ? f3Setting.email.trim() : "";
  var f3Tel = typeof f3Setting.phone === "string" ? f3Setting.phone.trim() : "";
  var f3Adres = f3Tx(f3Setting.address);
  if (f3Mail) f3Ilet.push('<li><a href="mailto:' + f3Esc(f3Mail) + '" dir="ltr">' + f3Esc(f3Mail) + "</a></li>");
  if (f3Tel) f3Ilet.push('<li><a href="tel:' + f3Tel.replace(/[^+\d]/g, "") + '" dir="ltr">' + f3Esc(f3Tel) + "</a></li>");
  if (f3Adres) f3Ilet.push('<li class="f3k-not">' + f3Esc(f3Adres) + "</li>");
  if (f3Tx(json.desing.iletisimNot)) f3Ilet.push('<li class="f3k-not">' + f3Esc(f3Tx(json.desing.iletisimNot)) + "</li>");

  var f3AltLink = (Array.isArray(json.desing.altLinkler) ? json.desing.altLinkler : []).map(function (x) {
    if (!x) return "";
    var hedef = String(x.slug || x.href || "").trim();
    var ad = f3Tx(x.ad);
    if (!hedef || !ad || /["<>\s]/.test(hedef)) return "";
    return f3Link(hedef.replace(/^\/+|\/+$/g, ""), ad);
  }).join("");

  var f3Cip = "", f3Lm, f3Lre = /<li class="([^"]*)"><a href="([^"]*)" hreflang="([^"]*)"/g;
  var f3LangHam = typeof wmLangHtml === "function" && json.desing.showlang !== false && json.desing.showlang !== "false" ? wmLangHtml({ style: "text" }) : "";
  while ((f3Lm = f3Lre.exec(f3LangHam))) {
    f3Cip += '<a class="f3k-chip"' + (/wm-lang-active/.test(f3Lm[1]) ? ' aria-current="true"' : "") + ' href="' + f3Lm[2] + '" hreflang="' + f3Lm[3] + '" lang="' + f3Lm[3] + '">' + f3Lm[3].toUpperCase() + "</a>";
  }

  var f3Kol = '<div class="f3k-col f3k-brand"><a class="f3k-logo" href="' + wxLangInternalHref("") + '">' + f3Logo + "</a>" +
    (f3Slogan ? '<p class="f3k-tag">' + f3Esc(f3Slogan) + "</p>" : "") + f3Sosyal + "</div>";
  if (f3NavHtml) f3Kol += '<nav class="f3k-col" aria-label="' + f3Esc(f3Tx(F3T.nav)) + '"><h2 class="f3k-h">' + f3Esc(f3Tx(F3T.nav)) + '</h2><ul class="f3k-links">' + f3NavHtml + "</ul></nav>";
  if (f3HubHtml) f3Kol += '<nav class="f3k-col" aria-label="' + f3Esc(f3Ad(f3Hub)) + '"><h2 class="f3k-h">' + f3Esc(f3Ad(f3Hub)) + '</h2><ul class="f3k-links">' + f3HubHtml + "</ul></nav>";
  if (f3Ilet.length) f3Kol += '<div class="f3k-col"><h2 class="f3k-h">' + f3Esc(f3Tx(F3T.contact)) + '</h2><ul class="f3k-links f3k-contact">' + f3Ilet.join("") + "</ul></div>";

  var f3Stil = [
    ".f3k{background:--bgcolor--;color:--color--;padding:56px 24px 84px;border-top:1px solid color-mix(in srgb,--color-- 14%,transparent)}",
    ".f3k *,.f3k *::before,.f3k *::after{box-sizing:border-box}.f3k :where(ul){list-style:none;margin:0;padding:0}.f3k :where(a){color:inherit;text-decoration:none}",
    ".f3k a:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:4px}",
    ".f3k-inner{max-width:1240px;margin:0 auto}",
    ".f3k-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px 48px;text-align:start}",
    ".f3k-col{min-width:0}.f3k-logo{display:inline-flex}",
    ".f3k-logo-img{display:block;height:auto;max-height:--logo_maxh--;width:auto;max-width:220px;object-fit:contain}",
    ".f3k-tag{margin:16px 0 20px;max-width:34ch;font-size:15px;line-height:1.6;opacity:.85}",
    ".f3k-social{display:flex;flex-wrap:wrap;gap:10px;list-style:none;margin:0;padding:0}",
    ".f3k-social a{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);border-radius:10px}",
    ".f3k-social svg{width:20px;height:20px;fill:currentColor}",
    ".f3k .f3k-h{margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.8;color:inherit}",
    ".f3k-links{display:flex;flex-direction:column;gap:2px}",
    ".f3k-links a{display:inline-flex;align-items:center;min-height:36px;font-size:15px}",
    ".f3k-links a:hover,.f3k-bottom a:hover{text-decoration:underline;text-underline-offset:3px}",
    '.f3k-links a[aria-current="page"],.f3k-legal a[aria-current="page"]{font-weight:700;text-decoration:underline;text-underline-offset:3px}',
    ".f3k-not{margin-top:8px;font-size:14px;line-height:1.55;max-width:32ch;opacity:.85}",
    ".f3k-bottom{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:44px;padding-top:20px;border-top:1px solid color-mix(in srgb,--color-- 14%,transparent);font-size:14px}",
    ".f3k-copy{margin:0;opacity:.85}.f3k-legal{display:flex;flex-wrap:wrap;gap:4px 20px;flex:1 1 auto}.f3k-legal a{display:inline-flex;align-items:center;min-height:32px}",
    ".f3k-langs{display:flex;flex-wrap:wrap;gap:6px}",
    ".f3k-chip{display:inline-flex;align-items:center;justify-content:center;min-width:40px;min-height:36px;padding:0 10px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);border-radius:8px;font-size:13px;font-weight:600;letter-spacing:.04em}",
    '.f3k-chip[aria-current="true"]{background:--color--;color:--bgcolor--;border-color:--color--}',
    "@media (max-width:768px){.f3k-links a,.f3k-legal a,.f3k-chip{min-height:48px}.f3k-chip{min-width:48px}.f3k-social a{width:48px;height:48px}}",
    "@media (max-width:600px){.f3k{padding:40px 20px 84px}.f3k-cols{grid-template-columns:1fr;gap:32px}.f3k-bottom{flex-direction:column;align-items:flex-start;margin-top:32px}}"
  ].join("");

  html = '<footer class="f3k"><div class="f3k-inner"><div class="f3k-cols">' + f3Kol + "</div>" +
    '<div class="f3k-bottom"><p class="f3k-copy">&copy; {{web-name}} ' + new Date().getFullYear() + ". @all-rights@.</p>" +
    (f3AltLink ? '<ul class="f3k-legal" aria-label="' + f3Esc(f3Tx(F3T.legal)) + '">' + f3AltLink + "</ul>" : "") +
    (f3Cip ? '<div class="f3k-langs" role="group" aria-label="' + f3Esc(f3Tx(F3T.lang)) + '">' + f3Cip + "</div>" : "") +
    "</div></div></footer><style>" + f3Stil + f3LogoCss + "</style>";
}

/* --- mobil uygulama kuralı (12 Kas 2026): mobilde sabit ALT BAR Ara · E-posta · Dil + dil için alttan açılan sayfa (footer-9 kalıbı).
   Veri yoksa o düğme yok (uydurma kanal yok): telefon/e-posta desing.phone/email → setting.phone/email; dil düğmesi yalnız >1 dil + showlang açıkken.
   Hiç düğme yoksa bar basılmaz, sayfa altına boşluk ayrılmaz. Masaüstünde (>768px) görünmez; CF Worker (strict) uyumlu, yalnız var/function. */
var f3bDict = {
  tr: { ara: "Ara", mail: "E-posta", dil: "Dil", hizli: "Hızlı erişim", kapat: "Kapat" },
  en: { ara: "Call", mail: "Email", dil: "Language", hizli: "Quick access", kapat: "Close" },
  de: { ara: "Anrufen", mail: "E-Mail", dil: "Sprache", hizli: "Schnellzugriff", kapat: "Schließen" },
  es: { ara: "Llamar", mail: "Correo", dil: "Idioma", hizli: "Acceso rápido", kapat: "Cerrar" },
  fr: { ara: "Appeler", mail: "E-mail", dil: "Langue", hizli: "Accès rapide", kapat: "Fermer" },
  ru: { ara: "Звонок", mail: "Почта", dil: "Язык", hizli: "Быстрый доступ", kapat: "Закрыть" },
  ar: { ara: "اتصال", mail: "بريد", dil: "اللغة", hizli: "وصول سريع", kapat: "إغلاق" }
};
var f3bT = f3bDict[json.lang] || f3bDict.en;
function f3bEsc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function f3bTx(v) {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  return v[json.lang] != null ? String(v[json.lang]) : (v.tr != null ? String(v.tr) : (v.en != null ? String(v.en) : ""));
}
var f3bAyar = (webmakerdata && webmakerdata.setting) || {};
var f3bTel = (f3bTx(json.desing && json.desing.phone).trim()) || (typeof f3bAyar.phone === "string" ? f3bAyar.phone.trim() : "");
var f3bMail = (f3bTx(json.desing && json.desing.email).trim()) || (typeof f3bAyar.email === "string" ? f3bAyar.email.trim() : "");
/* örnek/yer tutucu adres (example.*) gerçek kanal değildir: bara girmez */
if (/@example\./i.test(f3bMail)) f3bMail = "";
var f3bDilSayi = 0;
if (f3bAyar.langs && typeof f3bAyar.langs === "object") { for (var f3bLk in f3bAyar.langs) { if (f3bAyar.langs[f3bLk]) f3bDilSayi++; } }
var f3bLangLi = "";
if (typeof wmLangHtml === "function") { try { f3bLangLi = wmLangHtml({ style: "text" }) || ""; f3bDilSayi = f3bLangLi ? 2 : 0; } catch (e) { /* sayım yedeği */ } }
var f3bDilAcik = f3bDilSayi > 1 && !(json.desing && (json.desing.showlang === false || json.desing.showlang === "false"));
var f3bDugme = "";
if (f3bTel) f3bDugme += '<a href="tel:' + f3bTel.replace(/[^+\d]/g, "") + '" dir="ltr"><span class="material-symbols-outlined" aria-hidden="true">call</span>' + f3bEsc(f3bT.ara) + "</a>";
if (f3bMail) f3bDugme += '<a href="mailto:' + f3bEsc(f3bMail) + '"><span class="material-symbols-outlined" aria-hidden="true">mail</span>' + f3bEsc(f3bT.mail) + "</a>";
if (f3bDilAcik) f3bDugme += '<button type="button" class="modulex-f3__bar-dil" aria-haspopup="dialog" aria-expanded="false"><span class="material-symbols-outlined" aria-hidden="true">language</span>' + f3bEsc(f3bT.dil) + " · " + f3bEsc(String(json.lang || "").toUpperCase()) + "</button>";
if (f3bDugme) {
  html += '<nav class="modulex-f3__bar" aria-label="' + f3bEsc(f3bT.hizli) + '">' + f3bDugme + "</nav>" +
    (f3bDilAcik ? '<div class="modulex-f3__sheet" hidden><div class="modulex-f3__sheet-ic" role="dialog" aria-modal="true" aria-label="' + f3bEsc(f3bT.dil) + '"><div class="modulex-f3__sheet-ust"><strong>' + f3bEsc(f3bT.dil) + '</strong><button type="button" class="modulex-f3__sheet-kapat" aria-label="' + f3bEsc(f3bT.kapat) + '"><span class="material-symbols-outlined" aria-hidden="true">close</span></button></div><div class="modulex-f3__sheet-liste">' + (f3bLangLi ? "<ul>" + f3bLangLi + "</ul>" : "") + '</div></div></div>' : "") +
    '<style>' +
    '.modulex-f3__bar,.modulex-f3__sheet{display:none}' +
    '@media (max-width:768px){' +
    ':root{--mx-altbar-h:56px}' +
    'body{padding-bottom:calc(56px + env(safe-area-inset-bottom,0px))}' +
    '.modulex-f3__bar{display:flex;position:fixed;inset-inline:0;bottom:0;z-index:9990;background:--bgcolor--;border-top:1px solid color-mix(in srgb,--color-- 35%,transparent);box-shadow:0 -6px 20px rgba(0,0,0,.22);padding-bottom:env(safe-area-inset-bottom,0)}' +
    '.modulex-f3__bar a,.modulex-f3__bar-dil{flex:1 1 0;min-width:0;min-height:56px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:--color--;text-decoration:none;font:inherit;font-weight:600;font-size:15px;border:0;background:transparent;cursor:pointer;padding:0 8px}' +
    '.modulex-f3__bar>*+*{border-inline-start:1px solid color-mix(in srgb,--color-- 25%,transparent)}' +
    '.modulex-f3__bar .material-symbols-outlined,.modulex-f3__sheet .material-symbols-outlined{font-size:22px;line-height:1}' +
    '.modulex-f3__bar a:focus-visible,.modulex-f3__bar-dil:focus-visible,.modulex-f3__sheet-kapat:focus-visible,.modulex-f3__sheet a:focus-visible{outline:2px solid currentColor;outline-offset:-4px}' +
    '.modulex-f3__sheet:not([hidden]){display:flex;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);align-items:flex-end}' +
    '.modulex-f3__sheet-ic{width:100%;max-height:70vh;overflow-y:auto;background:--bgcolor--;color:--color--;border-radius:18px 18px 0 0;padding:8px 16px calc(16px + env(safe-area-inset-bottom,0px))}' +
    '.modulex-f3__sheet-ust{display:flex;align-items:center;justify-content:space-between;min-height:48px;margin-bottom:8px;font-size:16px}' +
    '.modulex-f3__sheet-kapat{width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;cursor:pointer;border-radius:50%}' +
    '.modulex-f3__sheet-liste{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.modulex-f3__sheet-liste ul{display:contents}' +
    '.modulex-f3__sheet-liste a{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:48px;min-height:48px;padding:0 10px;border:1px solid color-mix(in srgb,--color-- 40%,transparent);border-radius:12px;font-weight:600;color:--color--;text-decoration:none;background:transparent}' +
    '.modulex-f3__sheet-liste li.wm-lang-active a,.modulex-f3__sheet-liste a[aria-current]{background:--color--;color:--bgcolor--;border-color:--color--}' +
    '.modulex-f3__sheet-liste li{list-style:none;margin:0;padding:0;display:contents}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.modulex-f3__bar,.modulex-f3__sheet{transition:none!important;animation:none!important}}' +
    '</style>' +
    (f3bDilAcik ? '<script>(function(){var b=document.querySelector(".modulex-f3__bar-dil"),sh=document.querySelector(".modulex-f3__sheet");if(!b||!sh){return;}' +
      'function kapa(){sh.hidden=true;b.setAttribute("aria-expanded","false");b.focus();}' +
      'b.addEventListener("click",function(){var ic=sh.querySelector(".modulex-f3__sheet-liste");' +
      'if(ic&&!ic.firstChild){var kaynak=document.querySelector(".wm-langbar ul")||document.querySelector("[class*=langs]");' +
      'if(kaynak){var kopya=kaynak.cloneNode(true);ic.appendChild(kopya);}else{var linkler=document.querySelectorAll("a[hreflang]");var ul=document.createElement("ul");for(var i=0;i<linkler.length;i++){if(sh.contains(linkler[i])){continue;}var li=document.createElement("li");li.appendChild(linkler[i].cloneNode(true));ul.appendChild(li);}if(ul.firstChild){ic.appendChild(ul);}else{b.hidden=true;return;}}}' +
      'var ac=sh.hidden;sh.hidden=!ac;b.setAttribute("aria-expanded",ac?"true":"false");if(ac){var k=sh.querySelector(".modulex-f3__sheet-kapat");if(k){k.focus();}}});' +
      'sh.addEventListener("click",function(e){if(e.target===sh||(e.target.closest&&e.target.closest(".modulex-f3__sheet-kapat"))){kapa();}});' +
      'document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!sh.hidden){kapa();}});})();<\/script>' : "");
}
