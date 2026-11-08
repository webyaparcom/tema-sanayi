# tema-sanayi · t7ls01 — Sayfa Listesi Kare

## Nedir

tema-sanayi sitesinin matrix modülü. `Sayfa Listesi Kare` şablonu (div kökü,
sınıf `modulex`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (5 KB) |
| `index.html` | Modül şablonu (render hedefi) (5 KB) |
| `index.jpeg` | Önizleme görseli (11 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `eyebrow` | `{'tr': '', 'en': ''}` |
| `sectionTitle` | `{'tr': '', 'en': ''}` |
| `sectionSubtitle` | `{'tr': '', 'en': ''}` |
| `ctaLabel` | `{'tr': '', 'en': ''}` |
| `page` | `page` |
| `size` | `4` |
| `category` | `` |
| `aspect-ratio` | `1 / 1` |

- `name`: `Sayfa Listesi Kare`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **eyebrow**, **sectionTitle**, **sectionSubtitle**, **ctaLabel**, **page**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/t7ls01/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Sayfa Listesi Kare",
  "desing": {
    "eyebrow": {
      "tr": "",
      "en": ""
    },
    "sectionTitle": {
      "tr": "",
      "en": ""
    },
    "sectionSubtitle": {
      "tr": "",
      "en": ""
    },
    "ctaLabel": {
      "tr": "",
      "en": ""
    },
    "page": "page",
    "size": 4,
    "category": "",
    "aspect-ratio": "1 / 1",
    "showAllProducts": false,
    "margin": "20px 0px 20px 0px",
    "bgcolor": "transparent",
    "cardbg": "#ffffff",
    "titlecolor": "#111827",
    "textcolor": "#4b5563",
    "bordercolor": "rgba(17, 24, 39, 0.1)",
    "radius": "14px",
    "accent": "#1e3a5f"
  },
  "data": null
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
