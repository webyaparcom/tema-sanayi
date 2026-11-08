if (page["text"] != undefined) {
  html = html.replace(new RegExp("{{text}}", "g"), page["text"][json.lang]);
} else {
  html = html.replace(new RegExp("{{text}}", "g"), "");
}
html = html.replace(
  new RegExp("{{img}}", "g"),
  "/img/" + json["id"] + "/" + json.desing["img"],
);

/* G8-D (31 Eki 2026): desing.stil "cerceveli" → üstte adres rozeti; "yan-bilgi" → yanda bilgi kartı (adres/telefon/e-posta +
   yol tarifi). Metinler desing.badgeText / infoTitle / directions ({tr,en,ar}); adres/telefon/e-posta desing'den, boşsa setting'den.
   Kök eleman <a> olduğu için kart içinde ikinci bağlantı yok (tel/mailto düz metin). Klasikte iki yer tutucu da boş → HTML birebir aynı. */
var mapStil = json && json.desing && json.desing.stil != null ? String(json.desing.stil) : "";
function mapPick(v) {
  if (v == null) {
    return "";
  }
  if (typeof v !== "object") {
    return String(v);
  }
  if (typeof wmPickLang === "function") {
    try {
      return wmPickLang(v, json.lang) || "";
    } catch (e) {
      /* alt satır */
    }
  }
  return v[json.lang] != null ? String(v[json.lang]) : (v.tr != null ? String(v.tr) : (v.en != null ? String(v.en) : ""));
}
function mapEsc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var mapSetting = webmakerdata && webmakerdata.setting ? webmakerdata.setting : {};
var mapAddress = mapPick(json.desing.address).trim() || mapPick(mapSetting.address).trim();
var mapPhone = mapPick(json.desing.phone).trim() || (typeof mapSetting.phone === "string" ? mapSetting.phone.trim() : "");
var mapEmail = mapPick(json.desing.email).trim() || (typeof mapSetting.email === "string" ? mapSetting.email.trim() : "");
var mapBadgeHtml = "";
var mapInfoHtml = "";
if (mapStil === "cerceveli") {
  mapBadgeHtml =
    '<div class="modulex-badge"><span class="material-symbols-outlined" aria-hidden="true">location_on</span><span>' +
    mapEsc(mapAddress || mapPick(json.desing.badgeText)) +
    "</span></div>";
}
if (mapStil === "yan-bilgi") {
  mapInfoHtml = '<div class="modulex-info"><h2 class="modulex-info-title">' + mapEsc(mapPick(json.desing.infoTitle)) + "</h2>";
  if (mapAddress) {
    mapInfoHtml += '<p class="modulex-info-row"><span class="material-symbols-outlined" aria-hidden="true">location_on</span><span>' + mapEsc(mapAddress) + "</span></p>";
  }
  if (mapPhone) {
    mapInfoHtml += '<p class="modulex-info-row"><span class="material-symbols-outlined" aria-hidden="true">call</span><span dir="ltr">' + mapEsc(mapPhone) + "</span></p>";
  }
  if (mapEmail) {
    mapInfoHtml += '<p class="modulex-info-row"><span class="material-symbols-outlined" aria-hidden="true">mail</span><span dir="ltr">' + mapEsc(mapEmail) + "</span></p>";
  }
  mapInfoHtml +=
    '<span class="modulex-info-cta">' +
    mapEsc(mapPick(json.desing.directions)) +
    '<span class="material-symbols-outlined modulex-info-arrow" aria-hidden="true">arrow_forward</span></span></div>';
}
html = html.replace(new RegExp("{{badgehtml}}", "g"), mapBadgeHtml);
html = html.replace(new RegExp("{{infohtml}}", "g"), mapInfoHtml);
