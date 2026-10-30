/* demo-kredi — sunucu tarafı: metin içindeki {brand} marka adı <bdi dir="ltr"> ile izole edilir (Arapça cümlede Latin ad bozulmasın);
   bağlantı dış adresse yeni sekmede açılır (rel=noopener). Metinler kaçışlıdır. */
var dkEsc = function (v) {
  return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var dkDes = json.desing || {};
var dkLang = json.lang || "tr";
var dkHrefHam = String(dkDes.href || "").trim();
var dkDis = /^(https?:)?\/\//i.test(dkHrefHam);
var dkHref = /^javascript:/i.test(dkHrefHam) ? "" : dkDis ? dkHrefHam : dkHrefHam ? wxLangInternalHref(dkHrefHam) : "";
var dkSet = function (anahtar, deger) {
  html = html.split("{{" + anahtar + "}}").join(deger);
};
var dkMetin = dkEsc(wmPickLang(dkDes.text, dkLang)).split("{brand}").join('<bdi class="modulex-dk-brand" dir="ltr">' + dkEsc(dkDes.brand || "Webyapar") + "</bdi>");
dkSet("text", dkMetin);
dkSet("ctaText", dkEsc(wmPickLang(dkDes.ctaText, dkLang)));
dkSet("ariaLabel", dkEsc(wmPickLang(dkDes.ariaLabel, dkLang)));
dkSet("dkHref", dkEsc(dkHref));
dkSet("dkHedef", dkDis ? ' target="_blank" rel="noopener noreferrer"' : "");
dkSet("dkYeniSekme", dkDis ? '<span class="mx-visually-hidden"> ' + dkEsc(wmPickLang(dkDes.newTabText, dkLang)) + "</span>" : "");
if (!dkHref) {
  html = html.replace(/<a class="modulex-dk-cta"[\s\S]*?<\/a>/, "");
}
