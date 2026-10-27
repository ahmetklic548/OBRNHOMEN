# Görevler

## 2026-10-21 — Mağaza görünümü yenilendi (ensarhac.com tarzı)
- [x] Duyuru şeridi (altın), ortada logo, sosyal ikonlar, kategori menüsü — [[NavbarClient]]
- [x] Hero slider (3'lü kolaj, elle seçilmiş ortam fotoğrafları), güven şeridi
- [x] Ürün karuselleri (indirim rozeti, hızlı sepete ekle), kategori kartları, toplu hediyelik + seccade banner'ları
- [x] Açık renkli footer, koleksiyon grid'i yeni ürün kartına geçti
- [x] Header artık fixed değil (sticky); iç sayfalardaki pt-36/40 → pt-10
- [x] 2026-10-22 main'e merge edildi, `vercel --prod` ile canlıya alındı (Kâbe logo + açılış animasyonu dahil)
- [x] Zayıf fotoğraflı 42 ürün vitrinden gizlendi ([[productCuration]] HIDDEN_SLUGS), 2 seccadenin kapak görseli değişti; 63 ürün görünür
- [ ] Gizlenen çok satanlara yeni fotoğraf: Misvak vakumlu, Dikiş kutusu, 50li kına kesesi, 1250gr ihram, asetat çantalı başörtü seti

## 2026-10-26 — Ödeme akışı düzeltmeleri
- [x] Google Sign-In canlıda test edildi (headless Playwright): popup açılıp Google hesap seçimine gidiyor → ÇALIŞIYOR
- [x] [[paytr-token]] tutarı sunucuda hesaplıyor (istemci total'ine güvenmiyordu — güvenlik açığı)
- [x] Misafir ödeme: checkout artık girişe zorlamıyor
- [x] [[NewsletterPopup]] checkout/odeme/hesap/admin'de açılmıyor
- [x] Commit 536163c (lokal) — [ ] push + `npx vercel --prod` kullanıcı onayı bekliyor
- [ ] NETGSM_* + ADMIN_PHONE env (kullanıcıdan bilgi)
- [ ] Search Console sitemap submit
- [x] Deploy edildi (536163c + sepet yükleme düzeltmesi + toplu alım kutusu) — girişsiz checkout canlıda doğrulandı
- [x] Ürün sayfasına "Toplu mu alacaksınız? 10+ adet" WhatsApp teklif kutusu ([[ProductInfo]])
- [x] Search Console sitemap zaten gönderilmiş (21 Eki okundu, 137 sayfa)
- [ ] RESEND_API_KEY Vercel'de yok → bülten hoş geldin e-postası gitmiyor

## 2026-10-26 — Toptan satış modeli (tekli fiyat kalır + toptan teklif)
- [x] [[WholesaleBox]]: ürün sayfasında 1–9 / 10–49 / 50+ kademe tablosu, adet girişi, WhatsApp "Toptan Fiyat Al" (rakam yok, teklifle)
- [x] Ürün kartlarında "10+ adette toptan fiyat", duyuru şeridi "Toptan satış: 10 adet ve üzerine özel fiyat"
- [x] 8 paket ilanı (5'li/10'lu/41'li…) + 6 zayıf görselli ürün gizlendi ([[productCuration]])
- [x] Kademe indirimi canlıda: 10+ %5, 25+ %10, 50+ %15 (site fiyatı üstüne), [[pricing]] WHOLESALE_TIERS; sepette adet −/+ ve "Toptan Fiyat İste" WhatsApp teklif sepeti
- [ ] /toptan landing sayfası + toptan anahtar kelime reklamı
- [x] Teklif sepeti akışı: ürün sayfası "N Adet Teklif Sepetine Ekle" → sepet açılır ([[CartButton]] openCart), sepet = Teklif Sepeti, "Sepetteki N Adet İçin Toptan Fiyat Al" tüm listeyi WhatsApp'a yollar
- [x] Ana sayfa ilk ekran: slider üstünde toptan alıcı bandı (kademeler + 3 adım + "Toptan Alışverişe Başla")
- [x] CartDrawer body'ye portal ile çiziliyor (sohbet balonu üstüne biniyordu)
- [x] Teklif mesajı: renk/ebat + ürün kodu + "her adet tek ürün" + ürün linki (aynı isimli seccadeler ayırt edilsin); görünür 55 ilanın hepsi tek adetlik
- [x] 2026-10-27 PayTR tutar kontrolü: notify beklenen vs ödenen tutarı karşılaştırır, /admin/siparisler rozetleri
- [ ] Sıradaki: aynı isimli ~20 ilanın adına renk ekle

## 2026-10-27 — Toptan Sipariş sayfası (/toptan)
- [x] [[WholesaleListContext]] ayrı toptan listesi, [[ToptanClient]] seçim + panel + form, min 5.000 ₺
- [x] Sepetten toptan fiyat butonu kaldırıldı, büyük sepete "Toptan Listeme Taşı"
- [x] Ücretsiz kargo 2000 ₺
- [x] Menü/şerit/ana sayfa bantları → /toptan, sitemap
