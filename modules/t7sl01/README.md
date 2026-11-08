# tema-sanayi · t7sl01 — Slider

## Nedir

tema-sanayi sitesinin matrix modülü. `Slider` şablonu (div kökü,
sınıf `swiper-container`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (0 KB) |
| `index.html` | Modül şablonu (render hedefi) (2 KB) |
| `index.jpeg` | Önizleme görseli (2 KB) |
| `index.json` | Veri + tema token'ları (0 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `delay` | `5000` |
| `margin` | `0px 0 0 0` |

- `name`: `Slider`
- `data`: 3 kayıt. Örnek: `{"img": "1.jpg"}`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **delay**, **margin**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`swiper-container`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/t7sl01/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Slider",
  "desing": {
    "delay": 5000,
    "margin": "0px 0 0 0"
  },
  "data": [
    {
      "img": "1.jpg"
    },
    {
      "img": "2.jpg"
    },
    {
      "img": "3.jpg"
    }
  ]
}
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
