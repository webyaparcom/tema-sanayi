# tema-sanayi · t7ft01 — Footer 1

## Nedir

tema-sanayi sitesinin matrix modülü. `Footer 1` şablonu (footer kökü,
sınıf `footer`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (4 KB) |
| `index.jpeg` | Önizleme görseli (11 KB) |
| `index.json` | Veri + tema token'ları (0 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `showlang` | `True` |
| `bgcolor` | `#1e3046` |
| `color` | `#fff` |
| `img` | `` |
| `imgwidth` | `250px` |

- `name`: `Footer 1`
- `data`: 0 kayıt. Örnek: `[]`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **showlang**, **bgcolor**, **color**, **img**, **imgwidth**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`footer`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/t7ft01/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Footer 1",
  "desing": {
    "showlang": true,
    "bgcolor": "#1e3046",
    "color": "#fff",
    "img": "",
    "imgwidth": "250px"
  },
  "data": []
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
