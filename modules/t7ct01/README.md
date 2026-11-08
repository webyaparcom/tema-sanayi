# tema-sanayi · t7ct01 — İletişim

## Nedir

tema-sanayi sitesinin matrix modülü. `İletişim` şablonu (div kökü,
sınıf `modulex`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (2 KB) |
| `index.jpeg` | Önizleme görseli (25 KB) |
| `index.json` | Veri + tema token'ları (0 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `color` | `#000` |
| `name` | `{'tr': 'Bize Ulaşın'}` |
| `margin` | `30px 0px 30px 0px` |
| `linkcolor` | `#1B3A6B` |

- `name`: `İletişim`
- `data`: 3 kayıt. Örnek: `{"icon": "phone", "text": "+90", "url": ""}`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **color**, **name**, **margin**, **linkcolor**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/t7ct01/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "İletişim",
  "desing": {
    "color": "#000",
    "name": {
      "tr": "Bize Ulaşın"
    },
    "margin": "30px 0px 30px 0px",
    "linkcolor": "#1B3A6B"
  },
  "data": [
    {
      "icon": "phone",
      "text": "+90",
      "url": ""
    },
    {
      "icon": "email",
      "text": ""
    },
    {
      "icon": "map",
      "text": ""
    }
  ]
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
