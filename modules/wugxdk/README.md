# tema-sanayi · wugxdk — SSS Akordeon 1

## Nedir

tema-sanayi sitesinin matrix modülü. `SSS Akordeon 1` şablonu (section kökü,
sınıf `modulex-faq`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (4 KB) |
| `index.jpeg` | Önizleme görseli (27 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `max` | `900px` |
| `bgcolor` | `#ffffff` |
| `cardbg` | `#f8fafc` |
| `bordercolor` | `#e2e8f0` |
| `titlecolor` | `#1e293b` |
| `textcolor` | `#475569` |
| `accent` | `#DE6D26` |
| `badge` | `{'tr': 'SSS', 'en': 'FAQ'}` |

- `name`: `SSS Akordeon 1`
- `data`: 3 kayıt. Örnek: `{"question": {"tr": "Hizmetleriniz hangi şehirleri kapsıyor?", "en": "Which cities do your services cover?"}, "answer": {"tr": "Tüm Türkiye…`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **max**, **bgcolor**, **cardbg**, **bordercolor**, **titlecolor**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-faq`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/wugxdk/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "SSS Akordeon 1",
  "desing": {
    "max": "900px",
    "bgcolor": "#ffffff",
    "cardbg": "#f8fafc",
    "bordercolor": "#e2e8f0",
    "titlecolor": "#1e293b",
    "textcolor": "#475569",
    "accent": "#DE6D26",
    "badge": {
      "tr": "SSS",
      "en": "FAQ"
    },
    "title": {
      "tr": "Sıkça Sorulan Sorular",
      "en": "Frequently Asked Questions"
    },
    "description": {
      "tr": "Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.",
      "en": "Find answers to the most common questions here."
    }
  },
  "data": [
    {
      "question": {
        "tr": "Hizmetleriniz hangi şehirleri kapsıyor?",
        "en": "Which cities do your services cove
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
