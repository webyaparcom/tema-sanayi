# tema-sanayi · otodt0 — Demo Kredi Şeridi

## Nedir

tema-sanayi sitesinin matrix modülü. `Demo Kredi Şeridi` şablonu (div kökü,
sınıf `modulex-dk`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (1 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `href` | `https://webyapar.com/temalar` |
| `brand` | `Webyapar` |
| `text` | `{'tr': 'Bu demo {brand} tarafından hazırlanmıştır —', 'en': 'This demo was prepared by {brand} —', 'ar': 'تم إعداد هذا العرض التجريبي بواسطة {brand} —'}` |
| `ctaText` | `{'tr': 'Bu temayı iste', 'en': 'Get this theme', 'ar': 'اطلب هذا القالب'}` |
| `newTabText` | `{'tr': '(yeni sekmede açılır)', 'en': '(opens in a new tab)', 'ar': '(يفتح في علامة تبويب جديدة)'}` |
| `ariaLabel` | `{'tr': 'Demo bilgisi', 'en': 'Demo credit', 'ar': 'معلومات العرض التجريبي'}` |

- `name`: `Demo Kredi Şeridi`
- Diğer anahtarlar: `description`, `version`, `icon`, `category`, `tags`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **href**, **brand**, **text**, **ctaText**, **newTabText**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-dk`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/otodt0/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Demo Kredi Şeridi",
  "desing": {
    "href": "https://webyapar.com/temalar",
    "brand": "Webyapar",
    "text": {
      "tr": "Bu demo {brand} tarafından hazırlanmıştır —",
      "en": "This demo was prepared by {brand} —",
      "ar": "تم إعداد هذا العرض التجريبي بواسطة {brand} —"
    },
    "ctaText": {
      "tr": "Bu temayı iste",
      "en": "Get this theme",
      "ar": "اطلب هذا القالب"
    },
    "newTabText": {
      "tr": "(yeni sekmede açılır)",
      "en": "(opens in a new tab)",
      "ar": "(يفتح في علامة تبويب جديدة)"
    },
    "ariaLabel": {
      "tr": "Demo bilgisi",
      "en": "Demo credit",
      "ar": "معلومات العرض التجريبي"
    }
  },
  "data": null
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
