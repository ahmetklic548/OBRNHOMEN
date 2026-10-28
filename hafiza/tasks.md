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
- [x] 19 ürün kodla kaldırıldı (görünür 36), ana sayfa görselleri değişti, Eşarp/Din Kitabı menüden çıktı, boş kategori 500→404

## 2026-10-27 — Katalog Trendyol koleksiyonlarından yeniden kuruldu
- [x] 14 koleksiyon → 689 ilan → 637 ürün (52 tekrar/büyük paket atıldı) — [[trendyol-aktarim-2026-10-27]]
- [x] 8 yeni kategori, menü/ana sayfa/SEO güncellendi; arama hafifletildi
- [ ] /api/trendyol/products eski sapigw ucunu kullanıyor (500) → apigw.trendyol.com/integration/product ile güncellenmeli
- [x] /api/trendyol/products yeni apigw adresine geçti (canlıda 200, 3494 kayıt); stok/fiyat güncelleme (POST) gerçek veride denenmedi
- [x] [[search]] güçlü arama: Türkçe/eş anlamlı/yazım hatası; arama çubuğu bölüm önerileri + tüm sonuçlar
- [x] Alt gruplar ([[subcategories]]), listede başlıklı gruplar + alt grup çipleri + fiyat sıralaması

## 2026-10-27 akşam — keskin kategoriler, kodlar, admin silme, erişilebilirlik
- [x] [[classify]] 14 kategori + SKU + tekrar tespiti ([[benzer-urunler]] 63 benzer çift kontrol bekliyor)
- [x] Açılır menü, slug URL, Lora font, %10 rozeti kaldırıldı, Hint + ödeme rehberi
- [x] Admin Sil / Gizlenen Ürünler; toptan önerilenler + fiyatsız görünüm
- [ ] Kullanıcı Sil düğmesini ilk kez denesin (Firestore yazma izni teyidi)

## 2026-10-27 gece — ödeme ve ek özellikler
- [x] Kapıda ödeme +70 ₺ + WhatsApp onay (başarı sayfası), hediye paketi/not
- [x] Kafile paketleri ([[packages]]), telefonla sipariş, A+, Trendyol puanı, /toptan/katalog + PDF (masaüstü)
- [ ] Havale/EFT: şirket hesabı / PayTR havale kararı bekleniyor
- [ ] Meta WhatsApp Cloud API ile otomatik sipariş mesajı
- [ ] Kapıda ödeme Firestore kaydının admin panelde göründüğünü ilk gerçek siparişte kontrol et

- [x] 2026-10-28: 10'lu kutulu kadife Yasin-i Şerif setleri 11 renk geri eklendi (OBR-HED-0066..0076); Toptan Sipariş menüde çerçeveli düğme; yatay kaydırma çubuğu inceltildi
- [x] 2026-10-28: 10'lu kutulu kadife Yasin setleri 849 TL, 5'li (OBR-HED-0011) 499 TL
- [x] 2026-10-28: Paketli ilanlarda sayaç 'paket' sayar, her yerde '5 paket (50 adet)' yazar (lib/pack.ts)
