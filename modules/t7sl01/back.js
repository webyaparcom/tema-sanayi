var backhtml = "";
for (var i = 0; i < json.data.length; i++) {
  backhtml += `<div class="swiper-slide"><img src="/img/${json.id}/${json.data[i]["img"]}?v=${Date.now()}" alt="{{web-name}}" /></div>`;
}
html = html.replace(new RegExp("{{imglist}}", "g"), backhtml);
