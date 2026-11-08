# tema-sanayi · t7pd01 — Page Desing 3

## Nedir

tema-sanayi sitesinin matrix modülü. `Page Desing 3` şablonu (div kökü,
sınıf `modulex-title`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (2 KB) |
| `index.html` | Modül şablonu (render hedefi) (2 KB) |
| `index.jpeg` | Önizleme görseli (15 KB) |
| `index.json` | Veri + tema token'ları (0 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `height` | `200` |
| `opacity` | `0.5` |
| `font-size` | `50` |
| `backgroundcolor` | `#000` |
| `category` | `page` |
| `menu-active` | `#1e3046` |

- `name`: `Page Desing 3`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **height**, **opacity**, **font-size**, **backgroundcolor**, **category**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-title`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/t7pd01/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Page Desing 3",
  "desing": {
    "height": "200",
    "opacity": "0.5",
    "font-size": "50",
    "backgroundcolor": "#000",
    "category": "page",
    "menu-active": "#1e3046"
  },
  "data": null
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
