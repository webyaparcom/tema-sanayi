# tema-sanayi · c684df — Zaman Çizelgesi 1

## Nedir

tema-sanayi sitesinin matrix modülü. `Zaman Çizelgesi 1` şablonu (section kökü,
sınıf `modulex-tline`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (2 KB) |
| `index.jpeg` | Önizleme görseli (28 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `max` | `1200px` |
| `bgcolor` | `#ffffff` |
| `titlecolor` | `#1e293b` |
| `textcolor` | `#475569` |
| `accent` | `#DE6D26` |
| `linecolor` | `#e2e8f0` |
| `badge` | `{'tr': 'Tarihçe', 'en': 'Timeline'}` |
| `title` | `{'tr': 'Yolculuğumuz', 'en': 'Our Journey'}` |

- `name`: `Zaman Çizelgesi 1`
- `data`: 3 kayıt. Örnek: `{"year": "2015", "title": {"tr": "Kuruluş", "en": "Founded"}, "text": {"tr": "Küçük bir ekiple ilk ofisimizde yola çıktık.", "en": "We star…`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **max**, **bgcolor**, **titlecolor**, **textcolor**, **accent**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-tline`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/c684df/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Zaman Çizelgesi 1",
  "desing": {
    "max": "1200px",
    "bgcolor": "#ffffff",
    "titlecolor": "#1e293b",
    "textcolor": "#475569",
    "accent": "#DE6D26",
    "linecolor": "#e2e8f0",
    "badge": {
      "tr": "Tarihçe",
      "en": "Timeline"
    },
    "title": {
      "tr": "Yolculuğumuz",
      "en": "Our Journey"
    },
    "description": {
      "tr": "Kuruluşumuzdan bugüne önemli dönüm noktalarımız.",
      "en": "Key milestones from our founding to today."
    }
  },
  "data": [
    {
      "year": "2015",
      "title": {
        "tr": "Kuruluş",
        "en": "Founded"
      },
      "text": {
        "tr": "Küçük bir ekiple ilk ofisimizde yola çıktık.",
      
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
