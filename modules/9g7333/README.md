# tema-sanayi · 9g7333 — Kurumsal Değerler 1

## Nedir

tema-sanayi sitesinin matrix modülü. `Kurumsal Değerler 1` şablonu (section kökü,
sınıf `modulex-values`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (1 KB) |
| `index.html` | Modül şablonu (render hedefi) (3 KB) |
| `index.json` | Veri + tema token'ları (2 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `max` | `1200px` |
| `bgcolor` | `#F5F8FC` |
| `accent` | `#2E6BFF` |
| `titlecolor` | `#1B3A6B` |
| `textcolor` | `#475569` |
| `cardbg` | `#ffffff` |
| `badge` | `{'tr': 'Değerlerimiz', 'en': 'Our Values'}` |
| `title` | `{'tr': 'Enerji altyapısında güvenilir duruş', 'en': 'Trusted stance in energy infrastructure'}` |

- `name`: `Kurumsal Değerler 1`
- `data`: 4 kayıt. Örnek: `{"icon": "balance", "name": {"tr": "İlkeli", "en": "Principled"}, "description": {"tr": "İş güvenliği, mevzuat ve sözleşme taahhütlerine ba…`
- Diğer anahtarlar: `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **max**, **bgcolor**, **accent**, **titlecolor**, **textcolor**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-values`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/9g7333/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Kurumsal Değerler 1",
  "desing": {
    "max": "1200px",
    "bgcolor": "#F5F8FC",
    "accent": "#2E6BFF",
    "titlecolor": "#1B3A6B",
    "textcolor": "#475569",
    "cardbg": "#ffffff",
    "badge": {
      "tr": "Değerlerimiz",
      "en": "Our Values"
    },
    "title": {
      "tr": "Enerji altyapısında güvenilir duruş",
      "en": "Trusted stance in energy infrastructure"
    },
    "description": {
      "tr": "Projelerimizi ilkelerimiz, deneyimimiz ve kalite anlayışımızla yürütüyoruz.",
      "en": "We deliver projects with principle, experience and quality."
    }
  },
  "data": [
    {
      "icon": "balance",
      "name": {
        "tr": "İlkeli",
        "en": "
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
