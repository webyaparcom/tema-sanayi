# tema-sanayi · ham — ham site şablonu (proje kopyası)

## Nedir

Bu klasör, webmaker'in `webmodules/ham` ham site şablon kitinin tema-sanayi sitesindeki
proje içi kopyasıdır: giriş HTML iskeleti (SEO/head + header/content/footer
soketleri), 404 sayfası ve `src/` içi paylaşılan varlıklar. Sayfa modülleri render
sırasında `{{header}}`/`{{body}}`/`{{footer}}` soketlerine enjekte edilir.

Kaynak kit: `mcp/webmaker/webmodules/ham` (oradaki README.md tam açıklamayı içerir).

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `404.html` | 404 sayfası şablonu |
| `index.html` | Modül şablonu (render hedefi) |
| `index.json` | Veri + tema token'ları |
| `src` | Paylaşılan varlıklar (css/js/font/bayrak) |

## Girdiler

Template değişkenleri render tarafından doldurulur: `{{lang}}`, `{{seotitle}}`,
`{{seodescription}}`, `{{robots}}`, `{{canonicalurl}}`, `{{hreflang}}`, OpenGraph/Twitter
değişkenleri, `{{themecolor}}`, `{{mxapibase}}`, `{{mxtokens}}`, `{{StructuredData}}`,
`{{header}}`, `{{body}}`, `{{footer}}`. (Tam liste: kaynak kit README'si)

## Temaya bağımlılık

Tema token'ları `{{mxtokens}}` noktasından giren; `css.css` site genel stilidir.

## Test

Render çıktısında site iskeleti (title, header/content/footer) yerleşik görülmeli;
bilinmeyen yolda 404 şablonu yanıt verilmeli.

## Kullanım örneği

`index.json` (bu klasör):
```
{
  "schemaVersion": 1,
  "description": "ham sablon dosyalari — giris HTML; modul index.json degil",
  "entry": "webmodules/ham/index.html",
  "notFound": "webmodules/ham/404.html",
  "assetsDir": "webmodules/ham/src"
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; değişiklikte elden güncellenmelidir.
