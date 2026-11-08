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
