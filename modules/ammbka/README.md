# tema-sanayi · ammbka — Demo Bandı

## Nedir

tema-sanayi sitesinin matrix modülü. `Demo Bandı` şablonu (div kökü,
sınıf `modulex-db`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (2 KB) |
| `index.html` | Modül şablonu (render hedefi) (5 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `tone` | `info` |
| `bandBg` | `` |
| `bandFg` | `` |
| `ctaHref` | `https://webyapar.com/temalar` |
| `ariaLabel` | `{'tr': 'Demo site uyarısı', 'en': 'Demo site notice', 'ar': 'تنبيه الموقع التجريبي'}` |
| `text` | `{'tr': 'Bu bir demo sitedir — içerik kurgusaldır, ödeme alınmaz', 'en': 'This is a demo site — the content is fictional and no payment is taken', 'ar': 'هذا موقع تجريبي — المحتوى افتراضي ولا يتم تحصيل أي مدفوعات'}` |
| `ctaText` | `{'tr': 'Bu temayı iste', 'en': 'Get this theme', 'ar': 'اطلب هذا القالب'}` |
| `newTabText` | `{'tr': '(yeni sekmede açılır)', 'en': '(opens in a new tab)', 'ar': '(يفتح في علامة تبويب جديدة)'}` |

- `name`: `Demo Bandı`
- Diğer anahtarlar: `description`, `version`, `icon`, `category`, `tags`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **tone**, **bandBg**, **bandFg**, **ctaHref**, **ariaLabel**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-db`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/ammbka/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Demo Bandı",
  "desing": {
    "tone": "info",
    "bandBg": "",
    "bandFg": "",
    "ctaHref": "https://webyapar.com/temalar",
    "ariaLabel": {
      "tr": "Demo site uyarısı",
      "en": "Demo site notice",
      "ar": "تنبيه الموقع التجريبي"
    },
    "text": {
      "tr": "Bu bir demo sitedir — içerik kurgusaldır, ödeme alınmaz",
      "en": "This is a demo site — the content is fictional and no payment is taken",
      "ar": "هذا موقع تجريبي — المحتوى افتراضي ولا يتم تحصيل أي مدفوعات"
    },
    "ctaText": {
      "tr": "Bu temayı iste",
      "en": "Get this theme",
      "ar": "اطلب هذا القالب"
    },
    "newTabText": {
      "tr": "(yeni sekmede açılır)",
      "e
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
