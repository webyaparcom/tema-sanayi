/* timeline-1 — kurumsal tarihce / surec adimlari.
   item: { year, title: {tr,en}, text: {tr,en} } */

function tl1Lang(val) {
  if (val == null) {
    return "";
  }
  if (typeof val === "object") {
    if (val[json.lang] != null) {
      return val[json.lang];
    }
    if (val.tr != null) {
      return val.tr;
    }
    var tl1Keys = Object.keys(val);
    return tl1Keys.length ? (val[tl1Keys[0]] || "") : "";
  }
  return String(val);
}

var backhtml = "";
var rows = Array.isArray(json.data) ? json.data : [];
for (var ti = 0; ti < rows.length; ti++) {
  var item = rows[ti];
  var title = tl1Lang(item.title);
  if (!title) {
    continue;
  }
  var text = tl1Lang(item.text);
  backhtml +=
    '<div class="modulex-tline-item" style="animation-delay:' + (ti * 0.1) + 's">' +
    '<span class="modulex-tline-dot" aria-hidden="true"></span>' +
    (item.year != null && String(item.year) !== "" ? '<div class="modulex-tline-year">' + item.year + "</div>" : "") +
    '<h3 class="modulex-tline-item-title">' + title + "</h3>" +
    (text ? '<p class="modulex-tline-item-text">' + text + "</p>" : "") +
    "</div>";
}
html = html.replace(/{{html}}/g, backhtml);
