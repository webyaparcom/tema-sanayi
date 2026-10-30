/* proje-kart-filtre - sunucu tarafi: proje kartlarini dile cozer, filtre/siralama arayuzunu ve istemci verisini uretir.
   Yer tutucular: pkvars pkclass pkhead pktools pkchips pkitems pkcount pkempty pkveri.
   Veri: json.data (yoksa desing.projects) = [{id,title{},cat,year,status,meta[{k,v}],img,url}]; kategoriler desing.cats. */
var pkDes = json.desing || {};
var pkLang = json.lang || "tr";

function pkEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pkBool(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}

function pkNum(v, d, mn, mx) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) { n = d; }
  return Math.min(mx, Math.max(mn, n));
}

function pkPick(v) {
  return wmPickLang(v, pkLang);
}

/* Tum dillerdeki metin birlestirilir: kullanici baska dilde yazsa da arama eslesir */
function pkAllLangs(v) {
  if (v == null) { return ""; }
  if (typeof v !== "object") { return String(v); }
  var out = [];
  var k;
  for (k in v) {
    if (Object.prototype.hasOwnProperty.call(v, k)) { out.push(String(v[k])); }
  }
  return out.join(" ");
}

function pkImg(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file):/i.test(s)) { return ""; }
  if (/^data:/i.test(s)) { return /^data:image\//i.test(s) ? s : ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}

/* Detay baglantisi: dis/ozel baglanti aynen; dosya yolu aynen; digeri site yolu (slug) -> dil onekli */
function pkHref(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|data|file):/i.test(s)) { return ""; }
  if (/^((https?:)?\/\/|mailto:|tel:|#)/i.test(s)) { return s; }
  if (s.charAt(0) === "/" && /\.[a-z0-9]{2,5}(\?.*)?$/i.test(s)) { return s; }
  return wxLangInternalHref(s);
}

function pkForms(tbl) {
  var f = {};
  var k;
  for (k in tbl || {}) {
    if (!Object.prototype.hasOwnProperty.call(tbl, k)) { continue; }
    var v = tbl[k];
    if (v && typeof v === "object") {
      if (v[pkLang] !== undefined && String(v[pkLang]).trim() !== "") {
        f[k] = String(v[pkLang]);
      } else if (k === "one" || k === "other") {
        f[k] = wmPickLang(v, pkLang);
      }
    }
  }
  return f;
}

function pkCogul(n, f) {
  var kat = "other";
  try { kat = new Intl.PluralRules(pkLang).select(n); } catch (e) { kat = n === 1 ? "one" : "other"; }
  if (n === 0 && f.zero !== undefined) { kat = "zero"; }
  var t = f[kat] !== undefined ? f[kat] : f.other;
  return String(t === undefined ? "" : t).replace(/\{n\}/g, String(n));
}

/* Durum anahtari + ikon; takma adlar kabul edilir */
var pkStatusMap = { devam: "devam", ongoing: "devam", tamam: "tamam", done: "tamam", completed: "tamam", yakinda: "yakinda", soon: "yakinda" };
var pkStatusIcon = { devam: "construction", tamam: "check_circle", yakinda: "schedule" };
function pkStatus(v) {
  return pkStatusMap[String(v == null ? "" : v).toLowerCase()] || "";
}

var pkProjects = json.data && json.data.length ? json.data : (Array.isArray(pkDes.projects) ? pkDes.projects : []);
var pkCatsRaw = Array.isArray(pkDes.cats) ? pkDes.cats : [];
var pkSearch = pkBool(pkDes.search, true);
var pkSortSelect = pkBool(pkDes.sortSelect, true);
var pkSortDef = String(pkDes.sort || "year") === "title" ? "title" : "year";

var pkCols = pkDes.columns && typeof pkDes.columns === "object" ? pkDes.columns : {};
var pkVars = "--pk-cd:" + pkNum(pkCols.d, 3, 1, 6) + ";--pk-ct:" + pkNum(pkCols.t, 2, 1, 4) + ";--pk-cm:" + pkNum(pkCols.m, 1, 1, 3) + ";";
var pkRatioM = /^(\d{1,2}):(\d{1,2})$/.exec(String(pkDes.ratio || "4:3"));
if (pkRatioM && Number(pkRatioM[1]) > 0 && Number(pkRatioM[2]) > 0) {
  pkVars += "--pk-ar:" + pkRatioM[1] + " / " + pkRatioM[2] + ";";
} else {
  pkVars += "--pk-ar:4 / 3;";
}

var pkCatName = {};
var pkCatOrder = [];
var pki;
for (pki = 0; pki < pkCatsRaw.length; pki++) {
  if (pkCatsRaw[pki] && pkCatsRaw[pki].id != null) {
    pkCatName[String(pkCatsRaw[pki].id)] = pkPick(pkCatsRaw[pki].name);
    pkCatOrder.push(String(pkCatsRaw[pki].id));
  }
}
var pkCatCount = {};
var pkStatusCount = {};
var pkStatusLabels = {};
var pkStatusSrc = pkDes.statusLabels || {};
var pkSk;
for (pkSk in pkStatusSrc) {
  if (Object.prototype.hasOwnProperty.call(pkStatusSrc, pkSk)) { pkStatusLabels[pkSk] = pkPick(pkStatusSrc[pkSk]); }
}

var pkCards = "";
var pkClient = [];
var pkDetail = pkPick(pkDes.detailLabel);
for (pki = 0; pki < pkProjects.length; pki++) {
  var p = pkProjects[pki] || {};
  var cat = p.cat != null ? String(p.cat) : "";
  var st = pkStatus(p.status);
  var title = pkPick(p.title);
  var year = p.year != null && String(p.year).trim() !== "" ? String(p.year).trim() : "";
  var img = pkImg(p.img);
  var href = pkHref(p.url);
  if (cat) { pkCatCount[cat] = (pkCatCount[cat] || 0) + 1; }
  if (st) { pkStatusCount[st] = (pkStatusCount[st] || 0) + 1; }

  var metaHtml = "";
  var metaAll = "";
  var mi;
  var metaArr = Array.isArray(p.meta) ? p.meta : [];
  for (mi = 0; mi < metaArr.length; mi++) {
    var mk = pkPick(metaArr[mi] && metaArr[mi].k);
    var mv = pkPick(metaArr[mi] && metaArr[mi].v);
    if (!mk && !mv) { continue; }
    metaAll += " " + pkAllLangs(metaArr[mi].k) + " " + pkAllLangs(metaArr[mi].v);
    metaHtml += '<li class="modulex-pk-meta-i">' + (mk ? '<span class="modulex-pk-meta-k">' + pkEsc(mk) + "</span>" : "") +
      (mv ? ' <bdi class="modulex-pk-meta-v">' + pkEsc(mv) + "</bdi>" : "") + "</li>";
  }

  var media = "";
  if (img) {
    media += '<img class="modulex-pk-img" src="' + pkEsc(img) + '" alt="' + pkEsc(title) + '" loading="lazy" decoding="async" />';
  } else {
    media += '<span class="modulex-pk-ph" aria-hidden="true"><span class="material-symbols-outlined">domain</span></span>';
  }
  if (st && pkStatusLabels[st]) {
    media += '<span class="modulex-pk-status modulex-pk-st-' + st + '"><span class="material-symbols-outlined" aria-hidden="true">' +
      pkStatusIcon[st] + "</span>" + pkEsc(pkStatusLabels[st]) + "</span>";
  }

  var catLabel = pkCatName[cat] || "";
  var eyebrow = "";
  if (catLabel) { eyebrow += '<span class="modulex-pk-cat">' + pkEsc(catLabel) + "</span>"; }
  if (year) { eyebrow += '<bdi class="modulex-pk-year">' + pkEsc(year) + "</bdi>"; }

  pkCards += '<li class="modulex-pk-card" data-pk-i="' + pki + '" style="animation-delay:' + Math.min(pki, 9) * 0.05 + 's"><article class="modulex-pk-article">' +
    '<div class="modulex-pk-media">' + media + "</div>" +
    '<div class="modulex-pk-body">' +
    (eyebrow ? '<p class="modulex-pk-eyebrow">' + eyebrow + "</p>" : "") +
    '<h3 class="modulex-pk-name">' + (href ? '<a class="modulex-pk-link" href="' + pkEsc(href) + '">' + pkEsc(title) + "</a>" : pkEsc(title)) + "</h3>" +
    (metaHtml ? '<ul class="modulex-pk-meta">' + metaHtml + "</ul>" : "") +
    (href && pkDetail ? '<span class="modulex-pk-more" aria-hidden="true">' + pkEsc(pkDetail) + ' <span class="material-symbols-outlined mx-flip">arrow_forward</span></span>' : "") +
    "</div></article></li>";

  pkClient.push({
    cat: cat,
    status: st,
    year: isFinite(parseInt(year, 10)) ? parseInt(year, 10) : "",
    title: title,
    q: pkAllLangs(p.title) + " " + year + " " + pkAllLangs(pkCatsRaw.length ? pkCatLookup(cat) : "") + metaAll
  });
}

/* Kategori adinin tum dilleri (aramada kullanilir) */
function pkCatLookup(id) {
  var j;
  for (j = 0; j < pkCatsRaw.length; j++) {
    if (pkCatsRaw[j] && String(pkCatsRaw[j].id) === id) { return pkCatsRaw[j].name; }
  }
  return "";
}

/* Baslik */
var pkTitle = pkPick(pkDes.title);
var pkDesc = pkPick(pkDes.description);
var pkHead = "";
if (pkTitle || pkDesc) {
  pkHead = '<header class="modulex-pk-head">' +
    (pkTitle ? '<h2 class="modulex-pk-title">' + pkEsc(pkTitle) + "</h2>" : "") +
    (pkDesc ? '<p class="modulex-pk-desc">' + pkEsc(pkDesc) + "</p>" : "") + "</header>";
}

/* Arac cubugu: arama + durum + siralama (JS gelene dek hidden) */
var pkUsedStatus = [];
var pkOrderSt = ["devam", "tamam", "yakinda"];
for (pki = 0; pki < pkOrderSt.length; pki++) {
  if (pkStatusCount[pkOrderSt[pki]] && pkStatusLabels[pkOrderSt[pki]]) { pkUsedStatus.push(pkOrderSt[pki]); }
}
var pkTools = "";
if (pkProjects.length) {
  pkTools += '<div class="modulex-pk-tools" hidden>';
  if (pkSearch) {
    pkTools += '<label class="modulex-pk-field modulex-pk-search"><span class="modulex-pk-sr">' + pkEsc(pkPick(pkDes.searchLabel)) + "</span>" +
      '<span class="material-symbols-outlined modulex-pk-search-ic" aria-hidden="true">search</span>' +
      '<input class="modulex-pk-input" type="search" data-pk-q autocomplete="off" placeholder="' + pkEsc(pkPick(pkDes.searchPlaceholder)) + '" /></label>';
  }
  if (pkUsedStatus.length > 1) {
    pkTools += '<label class="modulex-pk-field"><span class="modulex-pk-lbl">' + pkEsc(pkPick(pkDes.statusFieldLabel)) + "</span>" +
      '<select class="modulex-pk-select" data-pk-status><option value="">' + pkEsc(pkPick(pkDes.allStatusLabel)) + "</option>";
    for (pki = 0; pki < pkUsedStatus.length; pki++) {
      pkTools += '<option value="' + pkUsedStatus[pki] + '">' + pkEsc(pkStatusLabels[pkUsedStatus[pki]]) + "</option>";
    }
    pkTools += "</select></label>";
  }
  if (pkSortSelect) {
    pkTools += '<label class="modulex-pk-field"><span class="modulex-pk-lbl">' + pkEsc(pkPick(pkDes.sortFieldLabel)) + "</span>" +
      '<select class="modulex-pk-select" data-pk-sort><option value="year">' + pkEsc(pkPick(pkDes.sortYearLabel)) + '</option><option value="title">' +
      pkEsc(pkPick(pkDes.sortTitleLabel)) + "</option></select></label>";
  }
  pkTools += "</div>";
}

var pkUsedCats = [];
for (pki = 0; pki < pkCatOrder.length; pki++) {
  if (pkCatCount[pkCatOrder[pki]]) { pkUsedCats.push(pkCatOrder[pki]); }
}
var pkChips = "";
if (pkUsedCats.length > 1) {
  pkChips = '<div class="modulex-pk-chips" role="group" aria-label="' + pkEsc(pkPick(pkDes.filterLabel)) + '" hidden>' +
    '<button type="button" class="modulex-pk-chip" data-pk-cat="" aria-pressed="true">' + pkEsc(pkPick(pkDes.allLabel)) +
    ' <bdi class="modulex-pk-chip-n">' + pkProjects.length + "</bdi></button>";
  for (pki = 0; pki < pkUsedCats.length; pki++) {
    pkChips += '<button type="button" class="modulex-pk-chip" data-pk-cat="' + pkEsc(pkUsedCats[pki]) + '" aria-pressed="false">' +
      pkEsc(pkCatName[pkUsedCats[pki]]) + ' <bdi class="modulex-pk-chip-n">' + pkCatCount[pkUsedCats[pki]] + "</bdi></button>";
  }
  pkChips += "</div>";
}

var pkForm = pkForms(pkDes.countText);
var pkCountText = pkProjects.length ? pkCogul(pkProjects.length, pkForm) : "";

/* Bos sonuc: istemci gosterir; veri hic yoksa sunucu da gosterir */
var pkEmpty = '<div class="modulex-pk-empty" role="note"' + (pkProjects.length ? " hidden" : "") + ">" +
  '<span class="material-symbols-outlined" aria-hidden="true">search_off</span>' +
  "<p>" + pkEsc(pkPick(pkDes.emptyText)) + "</p>" +
  (pkProjects.length ? '<button type="button" class="modulex-pk-clear" data-pk-clear>' + pkEsc(pkPick(pkDes.clearLabel)) + "</button>" : "") +
  "</div>";

var pkVeri = JSON.stringify({
  lang: pkLang,
  sort: pkSortDef,
  prefix: String(pkDes.urlPrefix || ""),
  count: pkForm,
  items: pkClient
}).replace(/</g, "\\u003c");

html = html.replace(/\{\{pkvars\}\}/g, function () { return pkVars; });
html = html.replace(/\{\{pkhead\}\}/g, function () { return pkHead; });
html = html.replace(/\{\{pktools\}\}/g, function () { return pkTools; });
html = html.replace(/\{\{pkchips\}\}/g, function () { return pkChips; });
html = html.replace(/\{\{pkitems\}\}/g, function () { return pkCards; });
html = html.replace(/\{\{pkcount\}\}/g, function () { return pkEsc(pkCountText); });
html = html.replace(/\{\{pkclear\}\}/g, function () { return pkEsc(pkPick(pkDes.clearLabel)); });
html = html.replace(/\{\{pkempty\}\}/g, function () { return pkEmpty; });
html = html.replace(/\{\{pkveri\}\}/g, function () { return pkVeri; });
