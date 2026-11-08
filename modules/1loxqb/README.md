# tema-sanayi · 1loxqb — İstatistik Bandı 1

## Nedir

tema-sanayi sitesinin matrix modülü. `İstatistik Bandı 1` şablonu (section kökü,
sınıf `modulex-stats`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (4 KB) |
| `index.jpeg` | Önizleme görseli (15 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `max` | `1200px` |
| `gradient` | `linear-gradient(135deg, #1e3046 0%, #2a4560 100%)` |
| `numbercolor` | `#DE6D26` |
| `labelcolor` | `#e2e8f0` |
| `iconsize` | `56px` |
| `iconbox` | `88px` |

- `name`: `İstatistik Bandı 1`
- `data`: 4 kayıt. Örnek: `{"number": 150, "suffix": "+", "label": {"tr": "Tamamlanan Proje", "en": "Completed Projects"}, "icon": "task_alt"}`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **max**, **gradient**, **numbercolor**, **labelcolor**, **iconsize**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-stats`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/1loxqb/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "İstatistik Bandı 1",
  "desing": {
    "max": "1200px",
    "gradient": "linear-gradient(135deg, #1e3046 0%, #2a4560 100%)",
    "numbercolor": "#DE6D26",
    "labelcolor": "#e2e8f0",
    "iconsize": "56px",
    "iconbox": "88px"
  },
  "data": [
    {
      "number": 150,
      "suffix": "+",
      "label": {
        "tr": "Tamamlanan Proje",
        "en": "Completed Projects"
      },
      "icon": "task_alt"
    },
    {
      "number": 50,
      "suffix": "+",
      "label": {
        "tr": "Mutlu Müşteri",
        "en": "Happy Customers"
      },
      "icon": "sentiment_satisfied"
    },
    {
      "number": 10,
      "suffix": "+",
      "label": {
        "tr": "Yıllık 
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
