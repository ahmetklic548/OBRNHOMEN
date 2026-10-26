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
