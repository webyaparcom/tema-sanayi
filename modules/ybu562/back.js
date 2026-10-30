/* teknik-tablo — sanayi urun teknik ozellik tablosu (G2, 30 Eki 2026).
   Tablo SUNUCUDA render dilinde cizilir; istemci yalniz siralama (sortable), TSV kopyalama ve yazdirmayi baglar.
   Hucre: sayi → tr-TR bicimli + data-v ham deger; dil nesnesi {tr,en,ar} → render dili; duz Latin metin → bdi ltr. */
var ttLang = json.lang || "tr";
var ttD = json.desing || {};
var ttData = json.data && typeof json.data === "object" && !Array.isArray(json.data) ? json.data : {};
var ttCols = Array.isArray(ttData.columns) ? ttData.columns : [];
var ttRows = Array.isArray(ttData.rows) ? ttData.rows : [];
var ttDown = Array.isArray(ttData.downloads) ? ttData.downloads : [];

function ttEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/\{\{/g, "&#123;&#123;");
}
function ttPick(v) { return wmPickLang(v, ttLang); }
function ttL(key) { return ttPick(ttD[key]); }
function ttBool(v, def) { return v === undefined ? def : !(v === false || String(v).toLowerCase() === "false"); }
var ttNum = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 3 });

var ttSortable = ttBool(ttD.sortable, false);
var ttSticky = ttBool(ttD.stickyFirst, true);

/* Satir hucresi: dizi (sutun sirasi) veya nesne (key) kabul edilir */
function ttCell(row, ci) {
  if (Array.isArray(row)) { return row[ci]; }
  return row && typeof row === "object" ? row[ttCols[ci].key] : undefined;
}

var ttHead = "<tr>";
for (var ci = 0; ci < ttCols.length; ci++) {
  var col = ttCols[ci] || {};
  var lab = ttEsc(ttPick(col.label));
  var isNum = col.num === true;
  ttHead += '<th scope="col"' + (isNum ? ' class="modulex-tt-num"' : "") + (ttSortable ? ' aria-sort="none"' : "") + ' data-tt-col="' + ci + '" data-tt-type="' + (isNum ? "num" : "txt") + '">';
  if (ttSortable) {
    ttHead += '<button type="button" class="modulex-tt-sort" data-tt-sort="' + ci + '" aria-label="' + ttEsc(ttL("sortBy").replace(/\{col\}/g, ttPick(col.label))) + '"><span>' + lab +
      '</span><span class="material-symbols-outlined modulex-tt-ic" aria-hidden="true">unfold_more</span></button>';
  } else {
    ttHead += lab;
  }
  ttHead += "</th>";
}
ttHead += "</tr>";

var ttBody = "";
for (var ri = 0; ri < ttRows.length; ri++) {
  ttBody += '<tr data-tt-i="' + ri + '">';
  for (var cj = 0; cj < ttCols.length; cj++) {
    var raw = ttCell(ttRows[ri], cj);
    var shown = "";
    var val = "";
    var cnum = ttCols[cj] && ttCols[cj].num === true;
    if (typeof raw === "number" && isFinite(raw)) {
      shown = '<bdi dir="ltr">' + ttEsc(ttNum.format(raw)) + "</bdi>";
      val = String(raw);
    } else if (raw && typeof raw === "object") {
      val = ttPick(raw);
      shown = ttEsc(val);
    } else {
      val = raw == null ? "" : String(raw);
      /* dilden bagimsiz Latin/rakam metin (olcu, kod) yon izole edilir */
      shown = /^[\x20-\x7E×²³°±µ]+$/.test(val) && /\d/.test(val) ? '<bdi dir="ltr">' + ttEsc(val) + "</bdi>" : ttEsc(val);
    }
    var tag = cj === 0 ? "th" : "td";
    ttBody += "<" + tag + (cj === 0 ? ' scope="row"' : "") + (cnum ? ' class="modulex-tt-num"' : "") + ' data-v="' + ttEsc(val) + '">' + shown + "</" + tag + ">";
  }
  ttBody += "</tr>";
}

var ttTable = ttCols.length && ttRows.length
  ? '<div class="modulex-tt-scroll" tabindex="0" role="region" aria-label="' + ttEsc(ttL("tableLabel")) + '"><table class="modulex-tt-table' + (ttSticky ? " modulex-tt-sticky" : "") + '" data-tt-table>' +
    "<caption class=\"modulex-tt-vh\">" + ttEsc(ttL("title")) + "</caption><thead>" + ttHead + "</thead><tbody>" + ttBody + "</tbody></table></div>"
  : '<p class="modulex-tt-empty">' + ttEsc(ttL("emptyText")) + "</p>";

/* Belge ikonlari: tur → Material Symbols adi */
var ttIcons = { pdf: "picture_as_pdf", dwg: "architecture", dxf: "architecture", zip: "folder_zip", doc: "description", docx: "description", xls: "table_view", xlsx: "table_view", step: "deployed_code", stp: "deployed_code" };
function ttHref(h) {
  var s = String(h || "").trim();
  if (!s || /^javascript:/i.test(s)) { return ""; }
  return /^(https?:)?\/\//i.test(s) || s.charAt(0) === "/" || s.charAt(0) === "#" ? s : "/" + s;
}
var ttDownHtml = "";
for (var di = 0; di < ttDown.length; di++) {
  var dn = ttDown[di] || {};
  var dh = ttHref(dn.href);
  if (!dh) { continue; }
  var dt = String(dn.type || "").toLowerCase();
  ttDownHtml += '<li><a class="modulex-tt-dl" href="' + ttEsc(dh) + '"' + (dt ? ' data-type="' + ttEsc(dt) + '"' : "") + ">" +
    '<span class="material-symbols-outlined" aria-hidden="true">' + (ttIcons[dt] || "download") + "</span>" +
    '<span class="modulex-tt-dln">' + ttEsc(ttPick(dn.name)) + "</span>" + (dt ? '<bdi dir="ltr" class="modulex-tt-dlt">' + ttEsc(dt.toUpperCase()) + "</bdi>" : "") + "</a></li>";
}
var ttDownBlock = ttDownHtml ? '<h3 class="modulex-tt-h3">' + ttEsc(ttL("downloadsTitle")) + '</h3><ul class="modulex-tt-dls">' + ttDownHtml + "</ul>" : "";

var ttTools = "";
if (ttRows.length && ttBool(ttD.showCopy, true)) {
  ttTools += '<button type="button" class="modulex-tt-btn" data-tt-copy><span class="material-symbols-outlined" aria-hidden="true">content_copy</span>' + ttEsc(ttL("copyLabel")) + "</button>";
}
if (ttRows.length && ttBool(ttD.showPrint, true)) {
  ttTools += '<button type="button" class="modulex-tt-btn" data-tt-print><span class="material-symbols-outlined" aria-hidden="true">print</span>' + ttEsc(ttL("printLabel")) + "</button>";
}
var ttCfg = JSON.stringify({ copied: ttL("copiedLabel"), fail: ttL("copyFailLabel"), asc: ttL("sortedAsc"), desc: ttL("sortedDesc"), lang: ttLang }).replace(/</g, "\\u003c").replace(/\{\{/g, "\\u007b\\u007b");

function ttSet(re, val) { html = html.replace(re, function () { return val; }); }
ttSet(/\{\{ttTable\}\}/g, ttTable);
ttSet(/\{\{ttDownloads\}\}/g, ttDownBlock);
ttSet(/\{\{ttTools\}\}/g, ttTools);
ttSet(/\{\{ttHint\}\}/g, ttSortable && ttRows.length ? ttEsc(ttL("sortHint")) : "");
ttSet(/\{\{ttCfg\}\}/g, ttCfg);
