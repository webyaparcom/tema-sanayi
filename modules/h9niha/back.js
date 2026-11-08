html = html.replace(new RegExp("{{id}}", "g"), json.id);
/* {{img}} render motorunda boş kalırsa /img/<id>/?v=… 404 olur — desing.img veya index.jpg */
var imgFile =
  json && json.desing && json.desing.img != null && String(json.desing.img) !== ""
    ? String(json.desing.img).replace(/^\/+/, "")
    : "index.jpg";
html = html.replace(new RegExp("{{img}}", "g"), imgFile);

/* G8-D (31 Eki 2026): desing.stil === "ikon-liste" → vizyon/misyon satır başına ikon (desing.icon2 / icon3).
   Diğer stillerde ve klasikte yer tutucu boş kalır → HTML çıktısı değişiklik öncesiyle birebir aynı. */
var m1Stil = json && json.desing && json.desing.stil != null ? String(json.desing.stil) : "";
function m1IconHtml(ad) {
  if (m1Stil !== "ikon-liste" || !ad) {
    return "";
  }
  return '<span class="material-symbols-outlined modulex-chile-icon" aria-hidden="true">' + String(ad).replace(/[<>"&]/g, "") + "</span>";
}
html = html.replace(new RegExp("{{icon2html}}", "g"), m1IconHtml(json && json.desing ? json.desing.icon2 : ""));
html = html.replace(new RegExp("{{icon3html}}", "g"), m1IconHtml(json && json.desing ? json.desing.icon3 : ""));
