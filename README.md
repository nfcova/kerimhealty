# Kerim Kahraman | Sağlık Sektörü Danışmanlığı

5 dilli (TR · EN · DE · AR · RU) kurumsal web sitesi. Bağımlılıksız (zero-dependency) statik site üreticisi ile her dil için gerçek, taranabilir HTML üretilir.

## Hızlı başlangıç

```bash
npm run build      # dist/ klasörünü üretir (45 sayfa)
npm start          # http://localhost:8080 — site + /api/contact
```

Node.js 18+ yeterlidir; `npm install` gerekmez.

## İletişim bilgilerini güncelleme

Tek dosya: **`site.config.mjs`**

| Alan | Açıklama |
|---|---|
| `siteUrl` | Yayın alan adı (ör. `https://www.alanadi.com`). Girildiğinde canonical/hreflang mutlak olur ve `sitemap.xml` üretilir. |
| `contact.whatsapp` | `905496118240` (ayarlı) |
| `contact.phone` | `+90 549 611 82 40` (ayarlı) |
| `contact.email` | Boş → sitede “Yakında paylaşılacak” görünür |
| `contact.linkedin` | Boş → sitede “Yakında paylaşılacak” görünür |
| `formEndpoint` | Formun JSON gönderdiği adres (varsayılan `/api/contact`) |

Değişiklikten sonra `npm run build`.

## Yapı

```
site.config.mjs        İletişim / alan adı ayarları
build/i18n/*.mjs       Merkezi çeviri sistemi (tr, en, de, ar, ru)
build/pages.mjs        Sayfa şablonları
build/layout.mjs       <head>, SEO, header, footer, dil menüsü
build/build.mjs        Üretici + çeviri bütünlük kontrolü (eksik anahtar varsa build durur)
src/assets/            CSS, JS, yerel fontlar (OFL), görseller
src/public/            favicon, manifest, _headers (Netlify), .htaccess (Apache)
server.mjs             Statik sunucu + güvenli form API'si
dist/                  Yayına hazır çıktı
```

## Çok dillilik
- Türkçe kök dizinde (`/`), diğerleri `/en/`, `/de/`, `/ar/`, `/ru/` altında.
- Her sayfa için çevrilmiş `<title>`, meta açıklama, `hreflang` ve `og:locale`.
- Arapça `dir="rtl"`; tüm CSS mantıksal özelliklerle (logical properties) yazıldı.
- Seçilen dil `localStorage`'da tutulur; siteye dışarıdan gelindiğinde tercih edilen dile yönlendirilir.

## İletişim formu
- İstemci + sunucu tarafı doğrulama, honeypot, hız sınırı (10 dk'da 5 istek), 16 KB gövde sınırı.
- Form verisi **diske ya da loglara yazılmaz**. Teslim için `CONTACT_WEBHOOK_URL` ortam değişkenine
  (e-posta gönderen bir serverless fonksiyon, n8n/Make/Zapier webhook vb.) iletilir.
- `NODE_ENV=production` ve webhook tanımlı değilse API 503 döner; geliştirmede yalnızca başarı kaydı loglanır.

```bash
NODE_ENV=production CONTACT_WEBHOOK_URL=https://... ALLOWED_ORIGIN=https://www.alanadi.com npm start
```

## Yayınlama

### GitHub Pages (aktif)
Site **https://nfcova.github.io/kerimhealty/** adresinde yayınlanır. `.github/workflows/pages.yml`, her push'ta
siteyi `BASE_PATH=/kerimhealty` ile derleyip `gh-pages` dalına gönderir.
GitHub Pages'te sunucu olmadığı için iletişim formu, doğrulamadan sonra mesajı **WhatsApp'ta hazır** olarak açar.
Kendi alan adı bağlandığında `BASE_PATH` boş bırakılmalı ve `SITE_URL` alan adına ayarlanmalıdır.

- **Node sunucu:** `npm start` (form API dahil).
- **Statik hosting (Netlify, Cloudflare Pages, cPanel):** `dist/` klasörünü yükleyin ve `formEndpoint` değerini bir form servisine yönlendirin.

## Not
Gizlilik Politikası ve KVKK Aydınlatma Metni genel bir şablon olarak hazırlandı; yayına almadan önce bir hukukçuya kontrol ettirilmesi önerilir.
