var backhtml = "";
var plShowAll =
  json.desing && json.desing.showAllProducts === true;
var plPageKey = json.desing && json.desing.page ? json.desing.page : "page";
var plPageId = page && page.id ? String(page.id) : "";
var plLang = json.lang || "tr";
var plCatMeta =
  typeof webmakerdata !== "undefined" &&
  webmakerdata &&
  webmakerdata[plPageKey]
    ? webmakerdata[plPageKey]
    : {};
var plCatImgOff =
  plCatMeta.modulestatus && plCatMeta.modulestatus.img === false;

function plRowImgOff(row) {
  if (plCatImgOff) return true;
  return !!(row && row.modulestatus && row.modulestatus.img === false);
}

function plEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

var plEyebrow = wmPickLang(
  json.desing && json.desing.eyebrow ? json.desing.eyebrow : null,
  plLang
);
var plSectionTitle = wmPickLang(
  json.desing && json.desing.sectionTitle ? json.desing.sectionTitle : null,
  plLang
);
var plSectionSubtitle = wmPickLang(
  json.desing && json.desing.sectionSubtitle ? json.desing.sectionSubtitle : null,
  plLang
);
var plCtaLabel = wmPickLang(
  json.desing && json.desing.ctaLabel ? json.desing.ctaLabel : null,
  plLang
);

var plHeadHtml = "";
if (plEyebrow || plSectionTitle || plSectionSubtitle) {
  plHeadHtml =
    '<header class="modulex-head">' +
    (plEyebrow ? '<span class="modulex-eyebrow">' + plEsc(plEyebrow) + "</span>" : "") +
    (plSectionTitle ? '<h2 class="modulex-title">' + plEsc(plSectionTitle) + "</h2>" : "") +
    (plSectionSubtitle ? '<p class="modulex-subtitle">' + plEsc(plSectionSubtitle) + "</p>" : "") +
    "</header>";
}

function plCardCtaHtml() {
  if (!plCtaLabel) return "";
  return (
    '<div class="modulex-card-cta">' +
    '<span class="modulex-card-cta-text">' + plEsc(plCtaLabel) + "</span>" +
    '<span class="material-symbols-outlined modulex-card-cta-icon" aria-hidden="true">arrow_forward</span>' +
    "</div>"
  );
}

/* Satırda img yoksa page/<id>/index.webp varsayılırdı: dosya yoksa kırık görsel + denetimde eksik varlık (antepinici hub, 12 kart).
   Dosya okunamıyorsa (dinamik render) eski davranış. */
function plIndexGorselVar(rowId) {
  if (typeof fsSync === "undefined" || typeof path === "undefined" || typeof webDir === "undefined" || !webDir) return true;
  try {
    return fsSync.existsSync(path.join(webDir, "page", String(rowId), "index.webp"));
  } catch (e) {
    return true;
  }
}

function plMediaHtml(name, imgName, rowId, icon) {
  if (imgName !== "") {
    return (
      '<img src="/page/' +
      plEsc(rowId) +
      "/" +
      plEsc(imgName) +
      '" alt="' +
      plEsc(name) +
      '" loading="lazy">'
    );
  }
  return (
    '<div class="modulex-card-placeholder" aria-hidden="true">' +
    '<span class="material-symbols-outlined">' + (/^[a-z0-9_]+$/.test(String(icon || "")) ? icon : "image") + "</span>" +
    "</div>"
  );
}

var plSrc =
  plCatMeta.data && Array.isArray(plCatMeta.data) ? plCatMeta.data : [];
/* Kategori'siz satir: category alani yok ya da bos dizge (eski verilerde
   category her zaman "" idi; yalniz "" karsilastirmasi category alani
   olmayan satirlari yutan bir sinif hatasydi). */
function plNoCategory(row) {
  var c = row["category"];
  return c == null || String(c).trim() === "";
}
/* Kategori sayfası tespiti: sayfa id'si en az bir ürün satırının category
   alanında referans veriliyor mu? Veriliyorsa kategori sayfası — yalnız o
   ürünler listelenir. Aksi halde bu "listesi" sayfasıdır ve kategori'siz
   ürünleri listeler (canlı referans: agsmakina /tr/urunlerimiz/ 11 kart).
   Neden: eski motorda sayfa satırları id'sizdi (category=="" kolu); id
   zorunlu hâline gelince (pageid geri dolumu) bu kolu korumak için geri
   düğüm eklenmesi gerekiyordu. plShowAll açıkken ikisi de atlanır. */
var plIsCategoryPage = false;
if (plPageId && !plShowAll) {
  for (var plC = 0; plC < plSrc.length; plC++) {
    if (
      plSrc[plC] &&
      plSrc[plC]["status"] == "play" &&
      String(plSrc[plC]["category"] == null ? "" : plSrc[plC]["category"]) === plPageId
    ) {
      plIsCategoryPage = true;
      break;
    }
  }
}
for (var plI = 0; plI < plSrc.length; plI++) {
  try {
    var iterator = plSrc[plI];
    if (!iterator) continue;
    var plMatch = iterator["status"] == "play";
    if (plMatch) {
      if (plShowAll) {
        plMatch = true;
      } else if (plPageKey === "products") {
        if (plPageId && plIsCategoryPage) {
          plMatch = iterator["category"] == plPageId;
        } else {
          plMatch = plNoCategory(iterator);
        }
      } else {
        plMatch = plNoCategory(iterator);
      }
    }
    if (plMatch) {
      var plName = wmPickLang(iterator["name"], plLang);
      var plImgName = "";
      if (!plRowImgOff(iterator) && iterator["img"]) {
        plImgName = String(iterator["img"]);
      } else if (!plRowImgOff(iterator) && plIndexGorselVar(iterator["id"])) {
        plImgName = "index.webp";
      }
      var plHref =
        typeof wxLangInternalHref === "function"
          ? wxLangInternalHref(iterator["path"])
          : "/" + plLang + "/" + String(iterator["path"] || "") + "/";
      backhtml +=
        '<a class="modulex-card" href="' +
        plEsc(plHref) +
        '">' +
        '<div class="modulex-card-media">' +
        plMediaHtml(plName, plImgName, iterator["id"], iterator["icon"]) +
        "</div>" +
        '<div class="modulex-card-body">' +
        '<div class="modulex-card-title">' +
        plEsc(plName) +
        "</div>" +
        plCardCtaHtml() +
        "</div>" +
        "</a>";
    }
  } catch (error) {}
}
html = html.replace(new RegExp("\\{\\{html\\}\\}", "g"), backhtml);
html = html.replace(new RegExp("\\{\\{headHtml\\}\\}", "g"), plHeadHtml);
