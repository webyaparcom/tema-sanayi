// textmodul: sayfa özel modül HTML ise (örn. <style> veya < ile başlıyorsa) olduğu gibi kullan

// Aksi halde düz metin gibi satırlara bölüp her satırı <p> ile sar

var finalHtml = "";

if (page["text"] != undefined && page["text"][json.lang]) {

  var rawText = page["text"][json.lang];

  var isHtml =

    typeof rawText === "string" &&

    (rawText.trim().indexOf("<") === 0 || rawText.indexOf("<style") !== -1);

  if (isHtml) {

    finalHtml = rawText;

  } else {

    var lines = rawText.split("\n");

    var htmlContent = [];

    var li;

    for (li = 0; li < lines.length; li++) {

      if (lines[li]) {

        htmlContent.push("<p>" + lines[li] + "</p>");

      }

    }

    var ulIndex = htmlContent.lastIndexOf("</li>");

    if (ulIndex !== -1) {

      htmlContent.splice(ulIndex + 1, 0, "</ul>");

    }

    finalHtml = htmlContent.join("\n");

  }

}



function pd5Pick(val) {
  if (val == null) return "";
  if (typeof val === "object") {
    return val[json.lang] || val.tr || "";
  }
  return String(val);
}

var getName = function(item) {

  if (!item) {

    return pd5Pick(json.desing.noTitle);

  }

  if (item.name) {

    if (typeof item.name === "object") {

      return (

        item.name[json.lang] ||

        item.name.tr ||

        Object.values(item.name)[0] ||

        pd5Pick(json.desing.noTitle)

      );

    }

    return item.name;

  }

  return pd5Pick(json.desing.noTitle);

};



var pageSlug = function(item) {

  if (!item || typeof item !== "object") {

    return "";

  }

  var n = item.pathnext;

  if (n != null && String(n).trim() !== "") {

    return String(n).trim();

  }

  return item.path != null ? String(item.path) : "";

};



var currentSlug = pageSlug(page);



var menuSourceKey = "";

if (

  json.desing &&

  json.desing.category &&

  webmakerdata[json.desing.category] &&

  webmakerdata[json.desing.category].data

) {

  menuSourceKey = json.desing.category;

} else if (

  page.categorypage &&

  webmakerdata[page.categorypage] &&

  webmakerdata[page.categorypage].data

) {

  menuSourceKey = page.categorypage;

} else if (

  page.category &&

  page.category !== "" &&

  webmakerdata.products &&

  webmakerdata.products.data

) {

  menuSourceKey = "products";

}



var pageData = menuSourceKey ? webmakerdata[menuSourceKey].data : [];



var isCategoryHub = false;

if (webmakerdata.category && webmakerdata.category.data) {

  var hubIdx;

  for (hubIdx = 0; hubIdx < webmakerdata.category.data.length; hubIdx++) {

    if (

      webmakerdata.category.data[hubIdx].id === page.id &&

      webmakerdata.category.data[hubIdx].status === "play"

    ) {

      isCategoryHub = true;

      break;

    }

  }

}



var inProductsList = false;

if (page && page.id && webmakerdata.products && webmakerdata.products.data) {

  var pIdx;

  for (pIdx = 0; pIdx < webmakerdata.products.data.length; pIdx++) {

    if (webmakerdata.products.data[pIdx] && webmakerdata.products.data[pIdx].id === page.id) {

      inProductsList = true;

      break;

    }

  }

}

var isProductDetail = !isCategoryHub && inProductsList;



var menuItems = [];

if (isCategoryHub && webmakerdata.category && webmakerdata.category.data) {

  menuItems = webmakerdata.category.data.filter(function(item) {

    return item.status === "play" && (!item.category || item.category === "");

  });

} else if (isProductDetail) {

  menuItems = pageData.filter(function(item) {

    return item.status === "play" && item.category === page.category;

  });

} else if (menuSourceKey === "category") {

  menuItems = pageData.filter(function(item) {

    return item.status === "play" && (!item.category || item.category === "");

  });

} else {

  menuItems = pageData.filter(function(item) {

    return item.status === "play";

  });

}



/** Ürün metnindeki tekrarlayan inline ölçü bloğunu kaldır (modül otomatik üretir) */

if (isProductDetail && finalHtml) {

  finalHtml = finalHtml.replace(

    /<div class="modulex-olcu-inline">[\s\S]*?<\/div>/gi,

    "",

  );

  finalHtml = finalHtml.replace(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>\s*(?=<div|$)/i, function(match) {

    if (match.indexOf("kategorisinde") !== -1 || match.indexOf("category") !== -1) {

      return "";

    }

    return match;

  });

}



if (page["text"] != undefined) {

  html = html.replace(new RegExp("{{text}}", "g"), finalHtml);

} else {

  html = html.replace(new RegExp("{{text}}", "g"), "");

}



var resolveDescLabel = function(pathKey) {

  var defs =

    webmakerdata.products && webmakerdata.products.desc

      ? webmakerdata.products.desc

      : null;

  var di;

  if (defs && defs.length) {

    for (di = 0; di < defs.length; di++) {

      if (defs[di].path === pathKey && defs[di].name) {

        if (typeof defs[di].name === "object") {

          return defs[di].name[json.lang] || defs[di].name.tr || pathKey;

        }

        return defs[di].name;

      }

    }

  }

  return pathKey;

};



var formatDescValue = function(pathKey, rawVal) {

  var v = String(rawVal).replace(/^\s+|\s+$/g, "");

  if (v === "") {

    return "";

  }

  if (pathKey === "genislik" || pathKey === "derinlik" || pathKey === "yukseklik") {

    if (v.indexOf("cm") === -1) {

      return v + " cm";

    }

  }

  if (pathKey === "agirlik" && v.indexOf("kg") === -1) {

    return "~" + v + " kg";

  }

  return v;

};



var descImgFile = "";

if (page["img"] != null && page["img"] !== undefined) {

  descImgFile = String(page["img"]).replace(/^\s+|\s+$/g, "");

}

if (descImgFile === "" && page["id"] && isProductDetail) {

  descImgFile = "index.webp";

}

var hasDescImage = descImgFile !== "";

/* 13 Kas 2026 (hanbroscargo /tr/teklif-al/): sayfa görseli page/<id>/ altında yoksa kırık <img> basılmaz — sitenin img/
   klasöründe aynı ad varsa o kullanılır (logo.png, icon.png gibi site görselleri), yoksa görsel bloğu çizilmez.
   Disk bilgisi yoksa (Worker/dinamik render: webDir boş, görseller R2'de) davranış değişmez. */
let descImgSrc = hasDescImage ? `/page/${page["id"]}/${descImgFile}` : "";
const pd5WebDir = typeof webDir === "string" ? webDir : "";
const pd5Fs = typeof fsSync !== "undefined" ? fsSync : null;
if (hasDescImage && pd5WebDir && typeof pd5Fs?.existsSync === "function" && typeof path !== "undefined" && !/^(https?:)?\/\//i.test(descImgFile) && !descImgFile.includes("..")) {
  const sayfaKlasoru = path.join(pd5WebDir, "page", String(page["id"] ?? ""));
  if (pd5Fs.existsSync(sayfaKlasoru) && !pd5Fs.existsSync(path.join(sayfaKlasoru, descImgFile))) {
    descImgSrc = pd5Fs.existsSync(path.join(pd5WebDir, "img", descImgFile)) ? `/img/${descImgFile}` : "";
    hasDescImage = descImgSrc !== "";
  }
}



var bgFile = "";

if (page["bgimg"] != null && page["bgimg"] !== undefined) {

  bgFile = String(page["bgimg"]).replace(/^\s+|\s+$/g, "");

}

if (bgFile !== "") {

  html = html.replace(

    /background-image:\s*none;\s*\/\*\s*modulex-title-bg-dyn\s*\*\//g,

    'background-image: url("/page/' +

      page["id"] +

      "/bg/" +

      bgFile +

      '"); /* modulex-title-bg-dyn */',

  );

}



var parentCat = null;

if (isProductDetail && webmakerdata.category && webmakerdata.category.data) {

  var pk;

  for (pk = 0; pk < webmakerdata.category.data.length; pk++) {

    if (webmakerdata.category.data[pk].id === page.category) {

      parentCat = webmakerdata.category.data[pk];

      break;

    }

  }

}



var uiPack = (json.desing && json.desing.ui) ? json.desing.ui : {};
var uiLangPack = uiPack[json.lang];
if (!uiLangPack || typeof uiLangPack !== "object") {
  uiLangPack = uiPack.tr || uiPack.en || {};
}
var ui = uiLangPack;

var productsLabel = ui.products || "";

if (webmakerdata.products && webmakerdata.products.name) {

  if (typeof webmakerdata.products.name === "object") {

    productsLabel =

      webmakerdata.products.name[json.lang] ||

      webmakerdata.products.name.tr ||

      productsLabel;

  } else {

    productsLabel = webmakerdata.products.name;

  }

}



var breadcrumbHtml = "";

if (isProductDetail) {

  breadcrumbHtml =

    '<nav class="modulex-pd5-breadcrumb" aria-label="Breadcrumb">' +

    '<a href="' +

    wxLangInternalHref("") +

    '">' +

    ui.home +

    "</a>" +

    '<span class="modulex-pd5-breadcrumb-sep" aria-hidden="true">/</span>' +

    '<a href="' +

    wxLangInternalHref("urunler") +

    '">' +

    productsLabel +

    "</a>";

  if (parentCat) {

    breadcrumbHtml +=

      '<span class="modulex-pd5-breadcrumb-sep" aria-hidden="true">/</span>' +

      '<a href="' +

      wxLangInternalHref(pageSlug(parentCat)) +

      '">' +

      getName(parentCat) +

      "</a>";

  }

  breadcrumbHtml +=

    '<span class="modulex-pd5-breadcrumb-sep" aria-hidden="true">/</span>' +

    '<span class="modulex-pd5-breadcrumb-current">' +

    getName(page) +

    "</span></nav>";

}



var specsHtml = "";

if (isProductDetail && page.desc && page.desc.genislik && page.desc.derinlik && page.desc.yukseklik) {

  var gVal = formatDescValue("genislik", page.desc.genislik);

  var dVal = formatDescValue("derinlik", page.desc.derinlik);

  var yVal = formatDescValue("yukseklik", page.desc.yukseklik);

  specsHtml =

    '<div class="modulex-pd5-specs">' +

    '<div class="modulex-pd5-specs-head">' +

    '<span class="material-symbols-outlined modulex-pd5-specs-icon" aria-hidden="true">straighten</span>' +

    "<div><h3 class=\"modulex-pd5-specs-title\">" +

    ui.dimensions +

    '</h3><p class="modulex-pd5-specs-summary">' +

    gVal +

    " × " +

    dVal +

    " × " +

    yVal +

    "</p></div></div>" +

    '<div class="modulex-pd5-spec-grid">';

  specsHtml +=

    '<div class="modulex-pd5-spec-item"><span class="modulex-pd5-spec-label">' +

    resolveDescLabel("genislik") +

    '</span><span class="modulex-pd5-spec-value">' +

    gVal +

    "</span></div>";

  specsHtml +=

    '<div class="modulex-pd5-spec-item"><span class="modulex-pd5-spec-label">' +

    resolveDescLabel("derinlik") +

    '</span><span class="modulex-pd5-spec-value">' +

    dVal +

    "</span></div>";

  specsHtml +=

    '<div class="modulex-pd5-spec-item"><span class="modulex-pd5-spec-label">' +

    resolveDescLabel("yukseklik") +

    '</span><span class="modulex-pd5-spec-value">' +

    yVal +

    "</span></div>";

  if (page.desc.agirlik) {

    specsHtml +=

      '<div class="modulex-pd5-spec-item"><span class="modulex-pd5-spec-label">' +

      resolveDescLabel("agirlik") +

      '</span><span class="modulex-pd5-spec-value">' +

      formatDescValue("agirlik", page.desc.agirlik) +

      "</span></div>";

  }

  if (page.desc.malzeme) {

    specsHtml +=

      '<div class="modulex-pd5-spec-item modulex-pd5-spec-wide"><span class="modulex-pd5-spec-label">' +

      resolveDescLabel("malzeme") +

      '</span><span class="modulex-pd5-spec-value">' +

      page.desc.malzeme +

      "</span></div>";

  }

  specsHtml +=

    "</div><p class=\"modulex-pd5-spec-note\">" + ui.dimNote + "</p></div>";

}



var leadHtml = "";

if (isProductDetail && page.description && page.description[json.lang]) {

  leadHtml = '<p class="modulex-pd5-lead">' + page.description[json.lang] + "</p>";

}



var contactPath =

  json.desing && json.desing.contact_path

    ? String(json.desing.contact_path)

    : "iletisim";

var whatsappNum =

  json.desing && json.desing.whatsapp

    ? String(json.desing.whatsapp).replace(/[^\d]/g, "")

    : "";



var ctaHtml = "";

if (isProductDetail) {

  ctaHtml =

    '<div class="modulex-pd5-cta">' +

    '<a class="modulex-pd5-cta-primary" href="' +

    wxLangInternalHref(contactPath) +

    '"><span class="material-symbols-outlined" aria-hidden="true">request_quote</span><span class="modulex-pd5-cta-label">' +

    ui.quote +

    "</span></a>";

  if (whatsappNum) {

    ctaHtml +=

      '<a class="modulex-pd5-cta-wa" href="https://wa.me/' +

      whatsappNum +

      '" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">chat</span><span class="modulex-pd5-cta-label">' +

      ui.whatsapp +

      "</span></a>";

  }

  ctaHtml += "</div>";

}



var categoryBadge = "";

if (isProductDetail && parentCat) {

  categoryBadge =

    '<span class="modulex-pd5-cat-badge">' + getName(parentCat) + "</span>";

}



var productPanelHtml = "";

if (isProductDetail && (hasDescImage || leadHtml || specsHtml || ctaHtml)) {

  var imgBlock = "";

  if (hasDescImage) {

    var imgAlt = getName(page);

    var safeAlt = String(imgAlt).replace(/"/g, "&quot;");

    imgBlock =

      '<div class="modulex-pd5-media">' +

      '<div class="modulex-pd5-img-wrap">' +

      '<img src="' +

      descImgSrc +

      '?v={{random}}" alt="' +

      safeAlt +

      '" loading="lazy" />' +

      "</div></div>";

  }

  productPanelHtml =

    '<div class="modulex-pd5-panel">' +

    imgBlock +

    '<div class="modulex-pd5-info">' +

    categoryBadge +

    leadHtml +

    specsHtml +

    ctaHtml +

    "</div></div>";

} else if (hasDescImage) {

  var legacyAlt = getName(page);

  var legacySafeAlt = String(legacyAlt).replace(/"/g, "&quot;");

  productPanelHtml =

    '<div class="modulex-desc-body">' +

    '<img src="' +

    descImgSrc +

    '?v={{random}}" width="100%" alt="' +

    legacySafeAlt +

    '" loading="lazy" />' +

    "</div>";

}



var productNavHtml = "";

if (isProductDetail && menuItems.length > 1) {

  var curIdx = -1;

  var ni;

  for (ni = 0; ni < menuItems.length; ni++) {

    if (pageSlug(menuItems[ni]) === currentSlug) {

      curIdx = ni;

      break;

    }

  }

  if (curIdx >= 0) {

    var prevItem = curIdx > 0 ? menuItems[curIdx - 1] : null;

    var nextItem = curIdx < menuItems.length - 1 ? menuItems[curIdx + 1] : null;

    productNavHtml = '<nav class="modulex-pd5-nav" aria-label="' + pd5Pick(json.desing.productNavAria) + '">';

    if (prevItem) {

      productNavHtml +=

        '<a class="modulex-pd5-nav-link modulex-pd5-nav-prev" href="' +

        wxLangInternalHref(pageSlug(prevItem)) +

        '"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span><span class="modulex-pd5-nav-text"><span class="modulex-pd5-nav-dir">' +

        ui.prev +

        '</span><span class="modulex-pd5-nav-name">' +

        getName(prevItem) +

        "</span></span></a>";

    } else {

      productNavHtml += '<span class="modulex-pd5-nav-spacer"></span>';

    }

    if (nextItem) {

      productNavHtml +=

        '<a class="modulex-pd5-nav-link modulex-pd5-nav-next" href="' +

        wxLangInternalHref(pageSlug(nextItem)) +

        '"><span class="modulex-pd5-nav-text"><span class="modulex-pd5-nav-dir">' +

        ui.next +

        '</span><span class="modulex-pd5-nav-name">' +

        getName(nextItem) +

        '</span></span><span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>';

    }

    productNavHtml += "</nav>";

  }

}



html = html.replace(new RegExp("{{breadcrumb}}", "g"), breadcrumbHtml);

html = html.replace(new RegExp("{{productPanel}}", "g"), productPanelHtml);

html = html.replace(new RegExp("{{productNav}}", "g"), productNavHtml);

html = html.replace(new RegExp("{{descimg}}", "g"), "");

html = html.replace(new RegExp("{{img}}", "g"), descImgFile);



var topCategories = menuItems.filter(function(item) {

  return !item.category || item.category === "";

});



var pagelist = "";

var useAccordion = topCategories.length > 0 && menuSourceKey !== "products" && !isCategoryHub;



if (useAccordion) {

  var ti;

  for (ti = 0; ti < topCategories.length; ti++) {

    var topItem = topCategories[ti];

    var children = menuItems.filter(function(child) {

      return child.status === "play" && child.category === topItem.id;

    });

    var topActive = currentSlug === pageSlug(topItem);

    var childActive = false;

    var ci;

    for (ci = 0; ci < children.length; ci++) {

      if (pageSlug(children[ci]) === currentSlug) {

        childActive = true;

        break;

      }

    }

    if (children.length > 0) {

      var subHtml = "";

      subHtml +=

        '<a class="modulex-sub-link' +

        (topActive ? " active" : "") +

        '" href="' +

        wxLangInternalHref(pageSlug(topItem)) +

        '">' +

        getName(topItem) +

        "</a>";

      var cj;

      for (cj = 0; cj < children.length; cj++) {

        var subActiveClass = pageSlug(children[cj]) === currentSlug ? " active" : "";

        subHtml +=

          '<a class="modulex-sub-link' +

          subActiveClass +

          '" href="' +

          wxLangInternalHref(pageSlug(children[cj])) +

          '">' +

          getName(children[cj]) +

          "</a>";

      }

      var expanded = topActive || childActive || page.category === topItem.id;

      pagelist +=

        '<div class="modulex-menu-group' +

        (expanded ? " open" : "") +

        '">' +

        '<button type="button" class="modulex-top' +

        (expanded ? " active" : "") +

        '">' +

        "<div>" +

        getName(topItem) +

        "</div>" +

        '<span class="material-symbols-outlined modulex-icon">expand_more</span>' +

        "</button>" +

        '<div class="modulex-sub' +

        (expanded ? " show" : "") +

        '">' +

        subHtml +

        "</div></div>";

    } else {

      pagelist +=

        '<a class="modulex-menu-link' +

        (topActive ? " active" : "") +

        '" href="' +

        wxLangInternalHref(pageSlug(topItem)) +

        '">' +

        getName(topItem) +

        "</a>";

    }

  }

} else {

  if (isProductDetail && parentCat) {

    pagelist +=

      '<a class="modulex-menu-link modulex-menu-parent" href="' +

      wxLangInternalHref(pageSlug(parentCat)) +

      '"><span class="modulex-menu-parent-label">← ' +

      getName(parentCat) +

      "</span></a>";

  }

  var mi;

  for (mi = 0; mi < menuItems.length; mi++) {

    var iterator = menuItems[mi];

    var activeClass = pageSlug(iterator) === currentSlug ? " active" : "";

    pagelist +=

      '<a class="modulex-menu-link' +

      activeClass +

      '" href="' +

      wxLangInternalHref(pageSlug(iterator)) +

      '"><span class="modulex-menu-link-text">' +

      getName(iterator) +

      "</span></a>";

  }

}



html = html.replace(new RegExp("{{pagelist}}", "g"), pagelist);

