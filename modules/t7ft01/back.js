/* footer-1 — sayfa linkleri + logo + arkaplan rengi.
   wmPickLang motor enjekte (backJs.js); dil fallback: lang → tr → en → ilk anahtar.
   page.json yoksa modul patlamiyor, desing.img/bgcolor eksikse guvenli,
   ic linkler wxLangInternalHref + pathnext ile. */

var backhtml =
  '<li class="menu__item"><a class="menu__link" href="' +
  wxLangInternalHref("") +
  '">@home@</a></li>';
var f1Rows =
  webmakerdata["page"] && Array.isArray(webmakerdata["page"].data)
    ? webmakerdata["page"].data
    : [];
for (var f1I = 0; f1I < f1Rows.length; f1I++) {
  var iterator = f1Rows[f1I];
  if (iterator.status == "play") {
    var f1Name = wmPickLang(iterator.name, json.lang);
    if (!f1Name) {
      continue;
    }
    var f1Href = wxLangInternalHref(iterator.pathnext || iterator.path);
    backhtml +=
      '<li class="menu__item"><a class="menu__link" href="' +
      f1Href +
      '">' +
      f1Name +
      "</a></li>";
  }
}
html = html.replace(new RegExp("{{html}}", "g"), backhtml);

var bgcolor =
  json.desing && json.desing.bgcolor ? String(json.desing.bgcolor) : "";
bgcolor = bgcolor.replace(new RegExp("#", "g"), "");

var moduleimg = "";
if (json.desing && json.desing.img) {
  moduleimg =
    '<div class="moduleimg">\n  <img src="/img/' +
    json.id +
    "/" +
    json.desing.img +
    '" alt="Logo" />\n</div>';
}

html = html.replace(new RegExp("{{moduleimg}}", "g"), moduleimg);
html = html.replace(new RegExp("#bgcolor#", "g"), bgcolor);

/* Sosyal liste: yalnız dolu hesaplar, ikon satır içi svg; hesap yoksa kabuk hiç basılmaz (services/webmaker/sosyalBar.js). CF dinamik render'da wmSocialBar yok → boş. */
var f1Sosyal = typeof wmSocialBar === "function" ? wmSocialBar({ liste: "social-icon", oge: "social-icon__item", baglanti: "social-icon__link" }) : "";
html = html.replace(new RegExp("{{socialbar}}", "g"), function () { return f1Sosyal; });

/* Dil çubuğu rengi: desing.langcolor; yoksa color. color bgcolor üstünde okunmuyorsa (makbas: ikisi de #fff) siyah/beyazdan okunanı.
   Okunuyorsa --color-- kalır: koyu mod güvencesi (modulRenkLib.renderGuvence) anahtarı görebilsin. */
var f1Lang = json.desing && json.desing.langcolor ? String(json.desing.langcolor) : "";
if (!f1Lang) {
  var f1Renk = json.desing && json.desing.color != null ? String(json.desing.color).trim() : "";
  var f1Okunur = typeof wmOkunurRenk === "function" ? wmOkunurRenk([f1Renk], json.desing && json.desing.bgcolor) : null;
  f1Lang = f1Okunur && f1Okunur !== f1Renk ? f1Okunur : "--color--";
}
html = html.replace(new RegExp("--langcolor--", "g"), function () { return f1Lang; });

/* --- mobil uygulama kuralı (12 Kas 2026): mobilde sabit ALT BAR Ara · E-posta · Dil + dil için alttan açılan sayfa (footer-9 kalıbı).
   Veri yoksa o düğme yok (uydurma kanal yok): telefon/e-posta desing.phone/email → setting.phone/email; dil düğmesi yalnız >1 dil + showlang açıkken.
   Hiç düğme yoksa bar basılmaz, sayfa altına boşluk ayrılmaz. Masaüstünde (>768px) görünmez; CF Worker (strict) uyumlu, yalnız var/function. */
var f1Dict = {
  tr: { ara: "Ara", mail: "E-posta", dil: "Dil", hizli: "Hızlı erişim", kapat: "Kapat" },
  en: { ara: "Call", mail: "Email", dil: "Language", hizli: "Quick access", kapat: "Close" },
  de: { ara: "Anrufen", mail: "E-Mail", dil: "Sprache", hizli: "Schnellzugriff", kapat: "Schließen" },
  es: { ara: "Llamar", mail: "Correo", dil: "Idioma", hizli: "Acceso rápido", kapat: "Cerrar" },
  fr: { ara: "Appeler", mail: "E-mail", dil: "Langue", hizli: "Accès rapide", kapat: "Fermer" },
  ru: { ara: "Звонок", mail: "Почта", dil: "Язык", hizli: "Быстрый доступ", kapat: "Закрыть" },
  ar: { ara: "اتصال", mail: "بريد", dil: "اللغة", hizli: "وصول سريع", kapat: "إغلاق" }
};
var f1T = f1Dict[json.lang] || f1Dict.en;
function f1Esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function f1Tx(v) {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  return v[json.lang] != null ? String(v[json.lang]) : (v.tr != null ? String(v.tr) : (v.en != null ? String(v.en) : ""));
}
var f1Ayar = (webmakerdata && webmakerdata.setting) || {};
var f1Tel = (f1Tx(json.desing && json.desing.phone).trim()) || (typeof f1Ayar.phone === "string" ? f1Ayar.phone.trim() : "");
var f1Mail = (f1Tx(json.desing && json.desing.email).trim()) || (typeof f1Ayar.email === "string" ? f1Ayar.email.trim() : "");
/* örnek/yer tutucu adres (example.*) gerçek kanal değildir: bara girmez */
if (/@example\./i.test(f1Mail)) f1Mail = "";
var f1DilSayi = 0;
if (f1Ayar.langs && typeof f1Ayar.langs === "object") { for (var f1Lk in f1Ayar.langs) { if (f1Ayar.langs[f1Lk]) f1DilSayi++; } }
var f1LangLi = "";
if (typeof wmLangHtml === "function") { try { f1LangLi = wmLangHtml({ style: "text" }) || ""; f1DilSayi = f1LangLi ? 2 : 0; } catch (e) { /* sayım yedeği */ } }
var f1DilAcik = f1DilSayi > 1 && !(json.desing && (json.desing.showlang === false || json.desing.showlang === "false"));
var f1Dugme = "";
if (f1Tel) f1Dugme += '<a href="tel:' + f1Tel.replace(/[^+\d]/g, "") + '" dir="ltr"><span class="material-symbols-outlined" aria-hidden="true">call</span>' + f1Esc(f1T.ara) + "</a>";
if (f1Mail) f1Dugme += '<a href="mailto:' + f1Esc(f1Mail) + '"><span class="material-symbols-outlined" aria-hidden="true">mail</span>' + f1Esc(f1T.mail) + "</a>";
if (f1DilAcik) f1Dugme += '<button type="button" class="modulex-f1__bar-dil" aria-haspopup="dialog" aria-expanded="false"><span class="material-symbols-outlined" aria-hidden="true">language</span>' + f1Esc(f1T.dil) + " · " + f1Esc(String(json.lang || "").toUpperCase()) + "</button>";
if (f1Dugme) {
  html += '<nav class="modulex-f1__bar" aria-label="' + f1Esc(f1T.hizli) + '">' + f1Dugme + "</nav>" +
    (f1DilAcik ? '<div class="modulex-f1__sheet" hidden><div class="modulex-f1__sheet-ic" role="dialog" aria-modal="true" aria-label="' + f1Esc(f1T.dil) + '"><div class="modulex-f1__sheet-ust"><strong>' + f1Esc(f1T.dil) + '</strong><button type="button" class="modulex-f1__sheet-kapat" aria-label="' + f1Esc(f1T.kapat) + '"><span class="material-symbols-outlined" aria-hidden="true">close</span></button></div><div class="modulex-f1__sheet-liste">' + (f1LangLi ? "<ul>" + f1LangLi + "</ul>" : "") + '</div></div></div>' : "") +
    '<style>' +
    '.modulex-f1__bar,.modulex-f1__sheet{display:none}' +
    '@media (max-width:768px){' +
    ':root{--mx-altbar-h:56px}' +
    'body{padding-bottom:calc(56px + env(safe-area-inset-bottom,0px))}' +
    '.modulex-f1__bar{display:flex;position:fixed;inset-inline:0;bottom:0;z-index:9990;background:--bgcolor--;border-top:1px solid color-mix(in srgb,--color-- 35%,transparent);box-shadow:0 -6px 20px rgba(0,0,0,.22);padding-bottom:env(safe-area-inset-bottom,0)}' +
    '.modulex-f1__bar a,.modulex-f1__bar-dil{flex:1 1 0;min-width:0;min-height:56px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:--color--;text-decoration:none;font:inherit;font-weight:600;font-size:15px;border:0;background:transparent;cursor:pointer;padding:0 8px}' +
    '.modulex-f1__bar>*+*{border-inline-start:1px solid color-mix(in srgb,--color-- 25%,transparent)}' +
    '.modulex-f1__bar .material-symbols-outlined,.modulex-f1__sheet .material-symbols-outlined{font-size:22px;line-height:1}' +
    '.modulex-f1__bar a:focus-visible,.modulex-f1__bar-dil:focus-visible,.modulex-f1__sheet-kapat:focus-visible,.modulex-f1__sheet a:focus-visible{outline:2px solid currentColor;outline-offset:-4px}' +
    '.modulex-f1__sheet:not([hidden]){display:flex;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);align-items:flex-end}' +
    '.modulex-f1__sheet-ic{width:100%;max-height:70vh;overflow-y:auto;background:--bgcolor--;color:--color--;border-radius:18px 18px 0 0;padding:8px 16px calc(16px + env(safe-area-inset-bottom,0px))}' +
    '.modulex-f1__sheet-ust{display:flex;align-items:center;justify-content:space-between;min-height:48px;margin-bottom:8px;font-size:16px}' +
    '.modulex-f1__sheet-kapat{width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;cursor:pointer;border-radius:50%}' +
    '.modulex-f1__sheet-liste{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.modulex-f1__sheet-liste ul{display:contents}' +
    '.modulex-f1__sheet-liste a{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:48px;min-height:48px;padding:0 10px;border:1px solid color-mix(in srgb,--color-- 40%,transparent);border-radius:12px;font-weight:600;color:--color--;text-decoration:none;background:transparent}' +
    '.modulex-f1__sheet-liste li.wm-lang-active a,.modulex-f1__sheet-liste a[aria-current]{background:--color--;color:--bgcolor--;border-color:--color--}' +
    '.modulex-f1__sheet-liste li{list-style:none;margin:0;padding:0;display:contents}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.modulex-f1__bar,.modulex-f1__sheet{transition:none!important;animation:none!important}}' +
    '</style>' +
    (f1DilAcik ? '<script>(function(){var b=document.querySelector(".modulex-f1__bar-dil"),sh=document.querySelector(".modulex-f1__sheet");if(!b||!sh){return;}' +
      'function kapa(){sh.hidden=true;b.setAttribute("aria-expanded","false");b.focus();}' +
      'b.addEventListener("click",function(){var ic=sh.querySelector(".modulex-f1__sheet-liste");' +
      'if(ic&&!ic.firstChild){var kaynak=document.querySelector(".wm-langbar ul")||document.querySelector("[class*=langs]");' +
      'if(kaynak){var kopya=kaynak.cloneNode(true);ic.appendChild(kopya);}else{var linkler=document.querySelectorAll("a[hreflang]");var ul=document.createElement("ul");for(var i=0;i<linkler.length;i++){if(sh.contains(linkler[i])){continue;}var li=document.createElement("li");li.appendChild(linkler[i].cloneNode(true));ul.appendChild(li);}if(ul.firstChild){ic.appendChild(ul);}else{b.hidden=true;return;}}}' +
      'var ac=sh.hidden;sh.hidden=!ac;b.setAttribute("aria-expanded",ac?"true":"false");if(ac){var k=sh.querySelector(".modulex-f1__sheet-kapat");if(k){k.focus();}}});' +
      'sh.addEventListener("click",function(e){if(e.target===sh||(e.target.closest&&e.target.closest(".modulex-f1__sheet-kapat"))){kapa();}});' +
      'document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!sh.hidden){kapa();}});})();<\/script>' : "");
}
