# tema-sanayi · rx7304 — Tanıtım Modülü

## Nedir

tema-sanayi sitesinin matrix modülü. `Tanıtım Modülü` şablonu (div kökü,
sınıf `modulex-out`) render sırasında sitenin sayfa akışına eklenir. Şablon içeriği
`index.html`'deki `{{...}}` soketleriyle, veri/tema değerleri `index.json`'la
beslenir.

## Dosyalar

| Dosya | Rol |
|-------|-----|
| `back.js` | Modül davranışı (vanilla JS) (0 KB) |
| `index.html` | Modül şablonu (render hedefi) (4 KB) |
| `index.jpeg` | Önizleme görseli (38 KB) |
| `index.json` | Veri + tema token'ları (1 KB) |

## Girdiler
| Değişken | Örnek değer |
|--------|-------------|
| `name` | `{'tr': 'Bizi Tanıyın', 'en': 'About Us'}` |
| `description` | `{'tr': 'Yılların deneyimi ve uzman kadromuzla kurumsal çözümler sunuyoruz. Kalite, güven ve sürdürülebilir büyüme odaklı çalışıyoruz.', 'en': 'With years of experience and an expert team we deliver corporate solutions focused on quality, trust and sustainable growth.'}` |
| `name2` | `{'tr': 'Vizyonumuz', 'en': 'Our Vision'}` |
| `spot2` | `{'tr': 'Sektörümüzde yenilikçi yaklaşımlarla öncü olmak.', 'en': 'To lead our industry with innovative approaches.'}` |
| `icon2` | `visibility` |
| `name3` | `{'tr': 'Misyonumuz', 'en': 'Our Mission'}` |
| `spot3` | `{'tr': 'İhtiyaç duyulan çözümleri hızlı ve şeffaf sunmak.', 'en': 'Deliver needed solutions quickly and transparently.'}` |
| `icon3` | `flag` |

- `name`: `Tanıtım Modülü`
- Diğer anahtarlar: `local`, `category`, `description`, `version`, `icon`

## Temaya bağımlılık
Tema token'ları `index.json -> desing` üzerinden gelir (önceki tablo): **name**, **description**, **name2**, **spot2**, **icon2**.

## Test

Webmaker render hattında site sayfası üretilir; çıktı HTML'de bu modülün kök bloğu
(`modulex-out`) yerleşik görünmelidir. Render ucu: mcp/webmaker
render aracı / proje site dizini çıktısı.

## Kullanım örneği

Modül tema-sanayi sitesinde `web/matrix/modules/rx7304/` yolunda tanımlıdır; sayfa
yapılandırması bu yolu referans alır. Veri örneği (`index.json`):
```
{
  "name": "Tanıtım Modülü",
  "desing": {
    "name": {
      "tr": "Bizi Tanıyın",
      "en": "About Us"
    },
    "description": {
      "tr": "Yılların deneyimi ve uzman kadromuzla kurumsal çözümler sunuyoruz. Kalite, güven ve sürdürülebilir büyüme odaklı çalışıyoruz.",
      "en": "With years of experience and an expert team we deliver corporate solutions focused on quality, trust and sustainable growth."
    },
    "name2": {
      "tr": "Vizyonumuz",
      "en": "Our Vision"
    },
    "spot2": {
      "tr": "Sektörümüzde yenilikçi yaklaşımlarla öncü olmak.",
      "en": "To lead our industry with innovative approaches."
    },
    "icon2": "visibility",
    "name3": {
      "tr": 
```

## Notlar

- Oluşturuldu: 2026-11-01 — modül envanterinde otomatik tamamlanan README (kaynak dosyalar: index.json, index.html).
- İçerik bu klasördeki gerçek dosyalardan okunarak yazıldı; modül değişikliğinde elden güncellenmelidir.
