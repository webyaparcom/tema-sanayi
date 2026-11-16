// Metni satırlara ayırıyoruz
var lines = (page["text"] && page["text"][json.lang]) ? page["text"][json.lang].split("\n") : [];
// HTML içeriğini oluşturacağımız diziyi başlatıyoruz
var htmlContent = [];
// Her satırı işliyoruz
lines.forEach(function(line, index) {
  htmlContent.push(`<p>${line}</p>`);
});
// Hizmetler listesini kapatıyoruz
var ulIndex = htmlContent.lastIndexOf("</li>");
if (ulIndex !== -1) {
  htmlContent.splice(ulIndex + 1, 0, "</ul>");
}
// HTML içeriğini birleştiriyoruz
var finalHtml = htmlContent.join("\n");
// Sonucu konsola yazdırıyoruz (gerçek uygulamada bu HTML'i DOM'a ekleyebilirsiniz)
if (page["text"] != undefined) {
  html = html.replace(new RegExp("{{text}}", "g"), finalHtml);
} else {
  html = html.replace(new RegExp("{{text}}", "g"), "");
}
if (page["img"] == undefined) {
  html = html.replace(new RegExp("{{img}}", "g"), "");
} else {
  html = html.replace(
    new RegExp("{{img}}", "g"),
    "/page/" + page["id"] + "/" + page["img"],
  );
}



try {
  
  if ( page["img"] == "") {

  }
  else if (page["img"] != undefined && page["img"] != "") {
    var descimg = `
    <div class="modulex-desc-body">
            <img src="/page/${page["id"]}/{{img}}?v={{random}}" width="100%" alt="{{title}}" />
    </div>`;
  
    html = html.replace(new RegExp("{{descimg}}", "g"), descimg);
  
  } else {
    html = html.replace(new RegExp("{{descimg}}", "g"), "");
  }
} catch (error) {
  html = html.replace(new RegExp("{{descimg}}", "g"), "");
}

html = html.replace(new RegExp("{{descimg}}", "g"), "");


var pagelist = "";
for (var iterator of webmakerdata[page.categorypage].data) {
  menuactive = "";
  if (iterator.path == page.path) {
    menuactive = `class="active"`;
  }
  pagelist += `<a ${menuactive}  href="${wxLangInternalHref(
    iterator.pathnext || iterator.path,
  )}" >${
    (iterator.name && iterator.name[json.lang]) ? iterator.name[json.lang] : iterator.name || ''
  }</a>`;
}



html = html.replace(new RegExp("{{descimg}}", "g"), "");

 
html = html.replace(new RegExp("{{pagelist}}", "g"), pagelist);
