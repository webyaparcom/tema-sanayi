# tema-sanayi · 8onjfn — CTA Şerit 1

## Nedir

tema-sanayi sitesinin matrix modülü. `CTA Şerit 1` şablonu (section kökü,
sınıf `modulex-cta`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (0 KB) |
| `index.html` | Modül şablonu (render hedefi) (3 KB) |
| `index.jpeg` | Önizleme görseli (18 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `max` | `1200px` |
| `gradient` | `linear-gradient(135deg, #1e3046 0%, #2a4560 100%)` |
| `btnbg` | `#ffffff` |
| `btncolor` | `#0B3A6E` |
| `title` | `{'tr': 'Projenizi Birlikte Hayata Geçirelim', 'en': "Let's Bring Your Project to Life"}` |
| `description` | `{'tr': 'Ücretsiz keşif görüşmesi için hemen iletişime geçin.', 'en': 'Contact us now for a free discovery call.'}` |
| `btn1Text` | `{'tr': 'İletişime Geç', 'en': 'Contact Us'}` |
| `btn1Url` | `iletisim` |

- `name`: `CTA Şerit 1`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **max**, **gradient**, **btnbg**, **btncolor**, **title**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-cta`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/8onjfn/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "CTA Şerit 1",
  "desing": {
    "max": "1200px",
    "gradient": "linear-gradient(135deg, #1e3046 0%, #2a4560 100%)",
    "btnbg": "#ffffff",
    "btncolor": "#0B3A6E",
    "title": {
      "tr": "Projenizi Birlikte Hayata Geçirelim",
      "en": "Let's Bring Your Project to Life"
    },
    "description": {
      "tr": "Ücretsiz keşif görüşmesi için hemen iletişime geçin.",
      "en": "Contact us now for a free discovery call."
    },
    "btn1Text": {
      "tr": "İletişime Geç",
      "en": "Contact Us"
    },
    "btn1Url": "iletisim",
    "btn2Text": {
      "tr": "Ürünler / Hizmetler",
      "en": "Products / Services"
    },
    "btn2Url": "urunler"
  },
  "data": null
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
