/* sayfa-editoryal — Sayfa Editoryal — ortalı başlık, çip menü, dar okuma sütunu (16 Kas 2026 · mcp:webmaker/20261116-031127-jyn8 · D17).
   Ortalanmış gezinti yolu ve iri başlık, altında kısa vurgu çizgisi; sayfa menüsü başlığın altında ortalı çip satırı; içerik dar, okunaklı tek sütun.
   Üretici: scripts/modul-fabrika (aile page) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: Sayfanın kendisi (page): name · text[dil] · img · bgimg · description[dil] · desc{genislik, derinlik, yukseklik, agirlik, malzeme} · category · categorypage; menü kaynağı desing.category › page.categorypage › products; category.data (kategori sayfası) · products.{name, desc}. desing: ui[dil] · noTitle · productNavAria · contact_path · whatsapp. */
const P = "modulex-sayfa-editoryal";
const IMG_KOK = "/img/";
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: page --- */
/* --- page-desing-5 veri modeli (aynı kurallar) --- */
const sayfa = page || {};
const wd = webmakerdata || {};
const noBaslik = metinAl(des, ["noTitle"]) || "@page-no-title@";
const ad = (it) => {
  if (!it || typeof it !== "object" || it.name == null || it.name === "") return noBaslik;
  return pick(it.name).trim() || noBaslik;
};
const slug = (it) => {
  if (!it || typeof it !== "object") return "";
  const n = it.pathnext;
  if (n != null && String(n).trim() !== "") return String(n).trim();
  return it.path != null ? String(it.path) : "";
};
const suan = slug(sayfa);
const koll = (k) => (k && wd[k] && Array.isArray(wd[k].data) ? wd[k].data : null);
let kaynak = "";
if (des.category && koll(des.category)) kaynak = des.category;
else if (sayfa.categorypage && koll(sayfa.categorypage)) kaynak = sayfa.categorypage;
else if (sayfa.category && sayfa.category !== "" && koll("products")) kaynak = "products";
const kData = kaynak ? koll(kaynak) : [];
const katlar = koll("category") || [];
const urunler = koll("products") || [];
const hub = katlar.some((x) => x && x.id === sayfa.id && x.status === "play");
const urun = !hub && !!sayfa.id && urunler.some((x) => x && x.id === sayfa.id);
let ogeler;
if (hub) ogeler = katlar.filter((x) => x && x.status === "play" && !x.category);
else if (urun) ogeler = kData.filter((x) => x && x.status === "play" && x.category === sayfa.category);
else if (kaynak === "category") ogeler = kData.filter((x) => x && x.status === "play" && !x.category);
else ogeler = kData.filter((x) => x && x.status === "play");
/* sayfa metni: yalnız sayfa dilinde (page-desing-5 gibi); HTML ise olduğu gibi, düz metin satır başına <p> */
let metin = "";
const hamT = sayfa.text != null && typeof sayfa.text === "object" ? sayfa.text[dil] : undefined;
if (hamT) {
  if (typeof hamT === "string" && (hamT.trim().indexOf("<") === 0 || hamT.indexOf("<style") !== -1)) metin = hamT;
  else metin = String(hamT).split("\n").filter(Boolean).map((l) => `<p>${l}</p>`).join("\n");
}
if (urun && metin) {
  metin = metin.replace(/<div class="modulex-olcu-inline">[\s\S]*?<\/div>/gi, "");
  metin = metin.replace(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>\s*(?=<div|$)/i, (m) => (m.indexOf("kategorisinde") !== -1 || m.indexOf("category") !== -1 ? "" : m));
}
const descTanim = wd.products && Array.isArray(wd.products.desc) ? wd.products.desc : [];
const descAd = (k) => { const d = descTanim.find((x) => x && x.path === k && x.name); return d ? (pick(d.name) || k) : k; };
const descDeger = (k, v) => {
  const t = String(v).trim();
  if (!t) return "";
  if ((k === "genislik" || k === "derinlik" || k === "yukseklik") && t.indexOf("cm") === -1) return t + " cm";
  if (k === "agirlik" && t.indexOf("kg") === -1) return "~" + t + " kg";
  return t;
};
/* görsel: page.img (ürün detayında yoksa index.webp); disk bilgisi varsa eksik dosya → img/<ad> → yoksa basılmaz */
let gDosya = sayfa.img != null ? String(sayfa.img).trim() : "";
if (!gDosya && sayfa.id && urun) gDosya = "index.webp";
let gSrc = gDosya ? `/page/${sayfa.id}/${gDosya}` : "";
const wDir = typeof webDir === "string" ? webDir : "";
const fsY = typeof fsSync !== "undefined" ? fsSync : null;
if (gSrc && wDir && fsY && typeof fsY.existsSync === "function" && typeof path !== "undefined" && !/^(https?:)?\/\//i.test(gDosya) && !gDosya.includes("..")) {
  const kl = path.join(wDir, "page", String(sayfa.id ?? ""));
  if (fsY.existsSync(kl) && !fsY.existsSync(path.join(kl, gDosya))) gSrc = fsY.existsSync(path.join(wDir, "img", gDosya)) ? `/img/${gDosya}` : "";
}
const bgD = sayfa.bgimg != null ? String(sayfa.bgimg).trim() : "";
const bgSrc = bgD ? `/page/${sayfa.id}/bg/${bgD}` : "";
const ustKat = urun ? katlar.find((x) => x && x.id === sayfa.category) || null : null;
/* arayüz metni: desing.ui[dil] (page-desing-5 paketi) → yoksa lang.json (24 dil) */
const uiP = des.ui && typeof des.ui === "object" && des.ui[dil] && typeof des.ui[dil] === "object" ? des.ui[dil] : {};
const ui = (k, yedek) => (typeof uiP[k] === "string" && uiP[k].trim() ? esc(uiP[k]) : yedek);
const urunlerAd = (wd.products && wd.products.name ? esc(pick(wd.products.name)) : "") || ui("products", "@products@");
const kirinti = urun ? [{ ad: ui("home", "@home@"), url: wxLangInternalHref("") }, { ad: urunlerAd, url: wxLangInternalHref("urunler") }]
  .concat(ustKat ? [{ ad: esc(ad(ustKat)), url: wxLangInternalHref(slug(ustKat)) }] : [], [{ ad: esc(ad(sayfa)), url: "" }]) : [];
const dsc = sayfa.desc && typeof sayfa.desc === "object" ? sayfa.desc : {};
let olcu = null;
if (urun && dsc.genislik && dsc.derinlik && dsc.yukseklik) {
  const g = descDeger("genislik", dsc.genislik);
  const d = descDeger("derinlik", dsc.derinlik);
  const y = descDeger("yukseklik", dsc.yukseklik);
  olcu = { ozet: `${g} × ${d} × ${y}`, satir: [[descAd("genislik"), g], [descAd("derinlik"), d], [descAd("yukseklik"), y]] };
  if (dsc.agirlik) olcu.satir.push([descAd("agirlik"), descDeger("agirlik", dsc.agirlik)]);
  if (dsc.malzeme) olcu.satir.push([descAd("malzeme"), String(dsc.malzeme), true]);
}
const giris = urun && sayfa.description && typeof sayfa.description === "object" && sayfa.description[dil] ? String(sayfa.description[dil]) : "";
const teklifUrl = wxLangInternalHref(des.contact_path ? String(des.contact_path) : "iletisim");
const wa = des.whatsapp ? String(des.whatsapp).replace(/[^\d]/g, "") : "";
let gez = null;
if (urun && ogeler.length > 1) {
  const ix = ogeler.findIndex((x) => slug(x) === suan);
  if (ix >= 0) {
    const o = ix > 0 ? ogeler[ix - 1] : null;
    const s2 = ix < ogeler.length - 1 ? ogeler[ix + 1] : null;
    gez = { once: o ? { ad: ad(o), url: wxLangInternalHref(slug(o)) } : null, sonra: s2 ? { ad: ad(s2), url: wxLangInternalHref(slug(s2)) } : null };
  }
}
const navAria = esc(metinAl(des, ["productNavAria"])) || "@page-product-nav@";
/* yan menü: alt sayfalı üst öğe → grup (üst öğenin kendi bağlantısı + alt sayfalar); değilse düz liste (+ ürün detayında üst kategori) */
const ustler = ogeler.filter((x) => !x.category);
const grupla = ustler.length > 0 && kaynak !== "products" && !hub;
const menu = [];
if (grupla) {
  ustler.forEach((t) => {
    const cs = ogeler.filter((c) => c.status === "play" && c.category === t.id);
    const ta = suan === slug(t);
    const ca = cs.some((c) => slug(c) === suan);
    menu.push({ ad: ad(t), url: wxLangInternalHref(slug(t)), aktif: ta, acik: ta || ca || sayfa.category === t.id,
      alt: cs.map((c) => ({ ad: ad(c), url: wxLangInternalHref(slug(c)), aktif: slug(c) === suan })) });
  });
} else {
  ogeler.forEach((x) => menu.push({ ad: ad(x), url: wxLangInternalHref(slug(x)), aktif: slug(x) === suan, alt: [] }));
}
const menuUst = !grupla && urun && ustKat ? { ad: ad(ustKat), url: wxLangInternalHref(slug(ustKat)) } : null;
const menuVar = menu.length > 0 || !!menuUst;
const kayitlar = [sayfa];

/* --- parça üreticileri (yerleşimler bunları kendi düzeninde dizer) --- */
const cur = (a) => (a ? ' aria-current="page"' : "");
const h1H = () => `<h1 class="${P}-h1">${esc(ad(sayfa))}</h1>`;
const kirintiH = () => (kirinti.length ? `<nav class="${P}-kirinti" aria-label="@page-breadcrumb@"><ol>${kirinti.map((k) => `<li>${k.url ? `<a href="${esc(k.url)}">${k.ad}</a>` : `<span aria-current="page">${k.ad}</span>`}</li>`).join("")}</ol></nav>` : "");
const menuListeH = (num) => {
  let h = "";
  if (menuUst) h += `<li class="${P}-mu"><a class="${P}-mo ${P}-mo--ust" href="${esc(menuUst.url)}"><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_back</span><span class="${P}-mt">${esc(menuUst.ad)}</span></a></li>`;
  menu.forEach((m, i) => {
    const sira = num ? `<span class="${P}-mn" aria-hidden="true">${no(i)}</span>` : "";
    if (m.alt.length) {
      const alt = [{ ad: m.ad, url: m.url, aktif: m.aktif }].concat(m.alt).map((c) => `<li><a class="${P}-ma" href="${esc(c.url)}"${cur(c.aktif)}>${esc(c.ad)}</a></li>`).join("");
      h += `<li class="${P}-mu ${P}-mu--grup"><details class="${P}-mg"${m.acik ? " open" : ""}><summary class="${P}-ms${m.aktif || m.alt.some((c) => c.aktif) ? ` ${P}-ms--aktif` : ""}">${sira}<span class="${P}-mt">${esc(m.ad)}</span><span class="material-symbols-outlined ${P}-mi" aria-hidden="true">expand_more</span></summary><ul class="${P}-malt">${alt}</ul></details></li>`;
    } else {
      h += `<li class="${P}-mu"><a class="${P}-mo" href="${esc(m.url)}"${cur(m.aktif)}>${sira}<span class="${P}-mt">${esc(m.ad)}</span></a></li>`;
    }
  });
  return `<ul class="${P}-mliste">${h}</ul>`;
};
/* o: { cekmece: dar ekranda düğme + çekmece (JS), num: sıra numarası, baslik: «Bu bölümde» etiketi } */
const navH = (o) => {
  if (!menuVar) return "";
  const s3 = o || {};
  const ic = `${s3.baslik ? `<p class="${P}-mbas">@page-in-section@</p>` : ""}${menuListeH(s3.num)}`;
  if (!s3.cekmece) return `<nav class="${P}-menu" aria-label="@pages@">${ic}</nav>`;
  return `<button type="button" class="${P}-mac" aria-expanded="false" aria-controls="${P}-{{id}}-menu"><span>@menu@</span><span class="material-symbols-outlined" aria-hidden="true">menu</span></button>`
    + `<div class="${P}-perde" hidden></div><nav class="${P}-menu" id="${P}-{{id}}-menu" aria-label="@pages@"><button type="button" class="${P}-mkapat" aria-label="@menu-close@"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>${ic}</nav>`;
};
const gorselH = () => (gSrc ? `<img class="${P}-gorsel" src="${esc(gSrc)}?v={{random}}" alt="${esc(ad(sayfa))}" loading="lazy" decoding="async" />` : "");
const bgH = () => (bgSrc ? `<img class="${P}-bg" src="${esc(bgSrc)}" alt="" aria-hidden="true" decoding="async" />` : "");
const rozetH = () => (ustKat ? `<span class="${P}-rozet">${esc(ad(ustKat))}</span>` : "");
const girisH = () => (giris ? `<p class="${P}-giris">${giris}</p>` : "");
const olcuH = () => (olcu ? `<div class="${P}-olcu"><div class="${P}-olcu-bas"><span class="material-symbols-outlined" aria-hidden="true">straighten</span><div><h2 class="${P}-olcu-baslik">${ui("dimensions", "@page-dimensions@")}</h2><p class="${P}-olcu-ozet"><bdi>${esc(olcu.ozet)}</bdi></p></div></div>`
  + `<dl class="${P}-olcu-liste">${olcu.satir.map((x) => `<div class="${P}-olcu-oge${x[2] ? ` ${P}-olcu-oge--genis` : ""}"><dt>${esc(x[0])}</dt><dd><bdi>${esc(x[1])}</bdi></dd></div>`).join("")}</dl><p class="${P}-olcu-not">${ui("dimNote", "@page-dim-note@")}</p></div>` : "");
const ctaH = () => (urun ? `<div class="${P}-eylem"><a class="${P}-teklif" href="${esc(teklifUrl)}"><span class="material-symbols-outlined" aria-hidden="true">request_quote</span><span>${ui("quote", "@page-get-quote@")}</span></a>`
  + `${wa ? `<a class="${P}-wa" href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined" aria-hidden="true">chat</span><span>${ui("whatsapp", "@page-whatsapp@")}</span></a>` : ""}</div>` : "");
/* ürün paneli (ürün detayı) · ürün değilse yalnız görsel (page-desing-5 «desc-body» davranışı) */
const urunH = () => (urun ? `<div class="${P}-urun${gSrc ? "" : ` ${P}-urun--yalin`}">${gSrc ? `<div class="${P}-medya">${gorselH()}</div>` : ""}<div class="${P}-bilgi">${rozetH()}${girisH()}${olcuH()}${ctaH()}</div></div>`
  : (gSrc ? `<figure class="${P}-sgorsel">${gorselH()}</figure>` : ""));
const yaziH = () => (metin ? `<div class="${P}-yazi">${metin}</div>` : "");
const gezH = () => (gez ? `<nav class="${P}-gez" aria-label="${navAria}">`
  + (gez.once ? `<a class="${P}-gez-a ${P}-gez-a--once" href="${esc(gez.once.url)}"><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_back</span><span class="${P}-gez-y"><span class="${P}-gez-k">${ui("prev", "@previous@")}</span><span class="${P}-gez-ad">${esc(gez.once.ad)}</span></span></a>` : `<span class="${P}-gez-bos"></span>`)
  + (gez.sonra ? `<a class="${P}-gez-a ${P}-gez-a--sonra" href="${esc(gez.sonra.url)}"><span class="${P}-gez-y"><span class="${P}-gez-k">${ui("next", "@next@")}</span><span class="${P}-gez-ad">${esc(gez.sonra.ad)}</span></span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "")
  + "</nav>" : "");
const anaH = () => `${urunH()}${yaziH()}${gezH()}`;
/* --- modül: sayfa-editoryal --- */
const kart = () => `<header class="${P}-bas2">${kirintiH()}${h1H()}<span class="${P}-cizgi" aria-hidden="true"></span>${navH()}</header><div class="${P}-okuma">${anaH()}</div>`;
const sar = function (ic) { return ic; };
const B = { ust: metinAl(des, ["ust"]), baslik: metinAl(des, ["baslik"]), metin: metinAl(des, ["metin"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = false;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
