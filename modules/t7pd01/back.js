/* page-desing-3 — metin + gorsel + kategori sayfa listesi.
   Duzeltmeler: dil fallback (lang → tr → ilk anahtar), sayfa detay dosyasi
   eksikse tum modulun patlamamasi (satir bazli try/catch + kategori satiri
   fallback), debug kalintisi 'ccccc' kaldirildi. */

function pd3Lang(val) {
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
    var pd3Keys = Object.keys(val);
    return pd3Keys.length ? (val[pd3Keys[0]] || "") : "";
  }
  return String(val);
}

/* Metin: ilk satir baslik vurgulu, digerleri paragraf */
var pd3Text = pd3Lang(page["text"]);
var htmlContent = [];
if (pd3Text) {
  String(pd3Text).split("\n").forEach(function (line, index) {
    if (index === 0) {
      htmlContent.push("<p>" + line + "</p><br>");
    } else {
      htmlContent.push("<p>" + line + "</p>");
    }
  });
}
var ulIndex = htmlContent.lastIndexOf("</li>");
if (ulIndex !== -1) {
  htmlContent.splice(ulIndex + 1, 0, "</ul>");
}
html = html.replace(new RegExp("{{text}}", "g"), htmlContent.join("\n"));

/* Gorsel */
if (page["img"] == undefined || page["img"] === "") {
  html = html.replace(new RegExp("{{img}}", "g"), "");
} else {
  html = html.replace(
    new RegExp("{{img}}", "g"),
    "/page/" + page["id"] + "/" + page["img"],
  );
}

/* Aciklama etiketleri */
var desc = "";
if (page["desc"] && typeof page["desc"] === "object") {
  for (var key in page["desc"]) {
    var descVal = pd3Lang(page["desc"][key]);
    if (descVal !== "") {
      desc += "<div>" + descVal + "</div>";
    }
  }
}
if (desc !== "") {
  desc = '<div class="modulex-desc-menu">' + desc + "</div>";
}
html = html.replace(new RegExp("{{desc}}", "g"), desc);

/* Kategori sayfa listesi — detay dosyasi varsa isim oradan, yoksa kategori satirindan */
var pagelist = "";
if (json.desing && json.desing.category && webmakerdata[json.desing.category] && Array.isArray(webmakerdata[json.desing.category].data)) {
  for (var iterator of webmakerdata[json.desing.category].data) {
    var rowItem = iterator;
    try {
      var data = fsSync.readFileSync(
        path.join("public/data/proje", projePath, "web", "page", iterator.id, "index.json"),
        "utf8",
      );
      rowItem = JSON.parse(data);
    } catch (readErr) {
      /* detay yoksa kategori satiri kullanilir; tek satir icin liste kirilmaz */
    }
    var menuactive = "";
    if (rowItem.path == page.path) {
      menuactive = 'class="active"';
    }
    pagelist += "<a " + menuactive + ' href="' + wxLangInternalHref(rowItem.pathnext || rowItem.path) + '" >' + pd3Lang(rowItem.name) + "</a>";
  }
}
html = html.replace(new RegExp("{{pagelist}}", "g"), pagelist);
