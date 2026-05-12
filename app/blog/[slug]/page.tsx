import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const posts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  related: { label: string; href: string }[];
}> = {
  "hac-umre-hediyesi-nasil-secilir": {
    title: "Hac ve Umre Hediyeliği Nasıl Seçilir?",
    excerpt: "Hac veya umreden dönen sevdiklerinize en anlamlı hediyeyi seçmek için bilmeniz gerekenler.",
    category: "Rehber",
    date: "2025-01-15",
    readTime: "4 dk",
    content: `
Hac ve umre, Müslümanlar için son derece özel ve manevi bir yolculuktur. Bu kutlu seferden dönen sevdiklerinize verilecek hediye de o manevi atmosferi taşımalıdır.

## Hediyelikte Dikkat Edilmesi Gerekenler

Hac veya umre hediyeliği seçerken şu noktalara dikkat etmek faydalıdır:

**Kullanışlılık:** Günlük hayatta kullanılabilecek ürünler her zaman daha değerlidir. Tesbih, seccade ve namaz örtüleri bu kategorinin en güzel örnekleridir.

**Kalite:** Kutsal bir yolculuğun anısına verilen hediye, kalitesiyle de öne çıkmalıdır. Ucuz ve kolayca bozulan ürünler yerine uzun ömürlü seçenekler tercih edin.

**Anlamlılık:** Kuran-ı Kerim, Delailü'l Hayrat gibi dini kitaplar manevi değer taşır ve yıllarca saklanır.

## En Popüler Hac Umre Hediyelikleri

1. **Tesbih Setleri** — İnci, akik veya kuka tesbihler hem kullanışlı hem de şık hediyelerdir.
2. **Seccade** — Kişiye özel boyut ve desende kaliteli seccadeler her zaman makbuldür.
3. **Hediyelik Setler** — Tesbih, misvak ve örtüden oluşan kombine setler pratik bir seçimdir.
4. **Kuran-ı Kerim** — Özellikle mealli ve Türkçe okunuşlu baskılar çok tercih edilmektedir.
5. **Misvak** — Sünnet olan bu ağız bakımı ürünü küçük ama anlamlı bir hediyedir.

## Toplu Hediyelik Siparişi

Hac veya umre kafilesinden dönen biri için tüm gruba hediye almak istiyorsanız toplu sipariş seçeneği hem ekonomik hem de pratiktir. OBRNHOMEN olarak toplu siparişlerinizde özel fiyat sunmaktayız.
    `,
    related: [
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
    ],
  },
  "tesbih-cesitleri-ve-anlami": {
    title: "Tesbih Çeşitleri ve Anlamları",
    excerpt: "İnci, akik, kuka ve ahşap tesbihler arasındaki farklar, her birinin özellikleri ve hangi durumda tercih edilmesi gerektiği.",
    category: "Bilgi",
    date: "2025-01-22",
    readTime: "5 dk",
    content: `
Tesbih, İslam geleneğinde Allah'ı zikretmek için kullanılan ve yüzyıllardır el sanatının güzel bir ürünü olan manevi bir araçtır. Farklı taşlar ve materyallerden yapılan tesbihler, hem kullanım amaçları hem de estetik özellikleri bakımından birbirinden ayrılır.

## İnci Tesbih

İnci tesbihler, zarifliği ve inceliğiyle öne çıkar. Genellikle 33 ya da 99 taneli olan inci tesbihler özellikle hanımlar arasında çok tercih edilir. Doğal inci tesbihler hem manevi hem de maddi değer taşır.

## Akik Tesbih

Hz. Peygamber'in (s.a.v.) akik taşını sevdiğine dair rivayetler nedeniyle akik tesbihler ayrı bir öneme sahiptir. Kırmızı, sarı ve beyaz renk seçenekleriyle dikkat çeken akik tesbihler sağlam yapısıyla uzun yıllar kullanılabilir.

## Kuka Tesbih

Kuka, Afrika'da yetişen bir ağacın tohumundan yapılır. Hafifliği ve doğal görünümüyle öne çıkan kuka tesbihler hac ve umre hediyeliği olarak da sıkça tercih edilir.

## Ahşap Tesbih

Öd ağacı, gül ağacı ve sandal ağacından yapılan tesbihler doğal kokusuyla kullanıcısına huzur verir. Özellikle öd ağacından yapılanlar Orta Doğu'da çok rağbet görür.

## Hangi Tesbihi Seçmeliyim?

- **Günlük kullanım için:** Hafif ve dayanıklı kuka veya ahşap tesbih
- **Hediye için:** Kutulu inci veya akik tesbih seti
- **Hac umre hatırası için:** Kuka veya özel baskılı tesbih
    `,
    related: [
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
    ],
  },
  "mevlut-hediyesi-fikirleri": {
    title: "Mevlüt Hediyesi Fikirleri 2025",
    excerpt: "Mevlüt törenlerinde misafirlere verilecek en güzel hediyelik setleri ve toplu sipariş avantajları.",
    category: "Rehber",
    date: "2025-02-03",
    readTime: "3 dk",
    content: `
Mevlüt törenleri, doğum, ölüm yıl dönümü veya özel günlerde düzenlenen ve misafirlere şükran ifadesi olarak hediyelik dağıtılan anlamlı organizasyonlardır. Doğru hediyeyi seçmek hem misafirlerinizi mutlu eder hem de töreninizin hatırasını yaşatır.

## Mevlüt Hediyelerinde Öne Çıkan Ürünler

**Tesbih + Örtü Seti:** En klasik mevlüt hediyesidir. Kadife kese içinde sunulan tesbih ve namaz örtüsü kombinasyonu her yaştan misafir tarafından beğenilir.

**Misvak Seti:** Sünnete uygun bu hediye, küçük ama anlamlı bir tercih olarak öne çıkar.

**Kuran-ı Kerim:** Cep boy veya çanta boy Kuran-ı Kerim, uzun yıllar kullanılacak kalıcı bir hediyedir.

**Zikirmatik:** Modern ve pratik, her yaşa hitap eden popüler bir mevlüt hediyesidir.

## Toplu Sipariş Avantajları

50 adet ve üzeri siparişlerde özel fiyat ve ücretsiz kargo avantajından yararlanabilirsiniz. Mevlüt organizasyonunuzun tarihini ve ürün tercihlerinizi WhatsApp üzerinden iletmeniz yeterlidir.
    `,
    related: [
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Namaz Örtüsü", href: "/koleksiyon/Namaz Örtüsü" },
    ],
  },
  "seccade-secerken-dikkat-edilmesi-gerekenler": {
    title: "Seccade Seçerken Dikkat Edilmesi Gerekenler",
    excerpt: "Kadife, şipinger ve özel dokuma seccadeler arasında nasıl karar verirsiniz? Kalite kriterleri ve bakım önerileri.",
    category: "Bilgi",
    date: "2025-02-14",
    readTime: "4 dk",
    content: `
Seccade, her Müslümanın günde en az beş kez kullandığı ve bu nedenle kalitesine özellikle dikkat edilmesi gereken bir ibadet aracıdır. Piyasada onlarca farklı model ve materyal bulunmakla birlikte, doğru seccadeyi seçmek biraz bilgi gerektirir.

## Seccade Materyalleri

**Kadife Seccade:** Yumuşak dokusu ve lüks görünümüyle kadife seccadeler hem ev kullanımı hem de hediye için idealdir. Kalın yapısı sayesinde zeminden gelen soğuğu yalıtır.

**Şipinger Seccade:** Hafifliği ve kolay taşınabilirliğiyle şipinger seccadeler yolculuklar ve dışarı çıkmalar için tercih edilir.

**Özel Dokuma (İpek Karışımlı):** Daha özenli bir seçim arıyorsanız ipek karışımlı veya özel el dokuma seccadeler uzun ömürlü ve estetik bir tercihtir.

## Boyut Rehberi

- **Standart:** 70x110 cm — tek kişilik günlük kullanım
- **Büyük boy:** 80x120 cm — rahat namaz kılmak isteyenler için
- **Çocuk:** 50x80 cm — çocuklara özel küçük boy

## Bakım Önerileri

- Yıkamadan önce etiketi kontrol edin; kadife seccadeler genellikle kuru temizleme gerektirir
- Doğrudan güneş ışığına maruz bırakmayın, renkler solar
- Katlamak yerine rulo yaparak saklayın, bu şekil bozulmasını önler
    `,
    related: [
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
      { label: "Namaz Örtüsü", href: "/koleksiyon/Namaz Örtüsü" },
    ],
  },
  "ihram-nedir-nasil-kullanilir": {
    title: "İhram Nedir, Nasıl Kullanılır?",
    excerpt: "Hac ve umre ibadetinin sembolü olan ihramın özellikleri, nasıl giyildiği ve dikkat edilmesi gereken noktalar.",
    category: "Rehber",
    date: "2025-03-05",
    readTime: "4 dk",
    content: `
İhram, hac ve umre ibadetini yerine getirecek erkek hacıların giydiği, iki parçadan oluşan dikişsiz beyaz örtüdür. Mikat sınırlarında giyilmesi zorunlu olan ihram, hac ibadetinin en bilinen sembollerinden biridir.

## İhramın Özellikleri

İhram, iki beyaz dikişsiz kumaş parçasından oluşur. Üst parça "rida", alt parça ise "izar" olarak adlandırılır. Bu örtüler pamuklu veya sentetik kumaştan üretilebilir; ancak doğal pamuk tercih edilmesi tavsiye edilir.

**Neden Dikişsiz Olmalıdır?**

İhramın dikişsiz olması, hac ibadeti süresince tüm hacıların sosyal statü farkı gözetmeksizin Allah'ın huzurunda eşit olduğunu simgeler.

## İhrama Girerken Dikkat Edilmesi Gerekenler

1. **Niyet ve telbiye:** İhrama girerken niyet edilir ve telbiye getirilir.
2. **Boyut:** İhram kumaşları yeterince geniş ve uzun olmalıdır.
3. **Kalite:** Uzun saatler giyileceğinden ince ve nefes alabilir kumaş seçilmelidir.
4. **Yedek almak:** Uzun hac/umre yolculuğu için bir yedek ihram seti bulundurmak pratiktir.

## İhram Nasıl Bağlanır?

En yaygın yöntemde izar bele dolanarak tutturulur, rida ise sol omuzun altından geçirilip sağ omuzu açıkta bırakacak şekilde sarılır. Dikişsiz olduğu için önceden pratik yapmak faydalı olacaktır.

## İhram Sonrası

Hac veya umre ibadeti tamamlandığında ihramdan çıkılır ve tıraş (hilak) veya saç kısaltma işlemi yapılır. OBRNHOMEN'de saf pamuklu, nefes alabilir ihram setleri mevcuttur; hac ve umre hazırlığınız için koleksiyonumuzu inceleyebilirsiniz.
    `,
    related: [
      { label: "İhram Koleksiyonu", href: "/koleksiyon/İhram" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
    ],
  },
  "namaz-ortusu-secim-rehberi": {
    title: "Namaz Örtüsü (Eşarp) Seçim Rehberi",
    excerpt: "Pamuklu, vual ve saten namaz örtüleri arasındaki farklar; doğru seçim için dikkat edilmesi gereken kriterler.",
    category: "Rehber",
    date: "2025-03-12",
    readTime: "4 dk",
    content: `
Namaz kılarken başı ve boynu örten namaz örtüsü, namazın farzlarından biridir. Piyasada farklı malzeme ve tasarımlarda onlarca seçenek bulunduğundan doğru namaz örtüsünü bulmak zaman zaman zor olabilir.

## Namaz Örtüsü Materyalleri

**Vual (Tül) Kumaş:** Hafif yapısıyla yaz aylarında tercih edilir. Nefes alabilir olmakla birlikte ince yapısı nedeniyle altına astar giyilmesi önerilir.

**Pamuklu Örtü:** En klasik ve yaygın tercihlerden biridir. Her mevsim kullanılabilir, yıkamaya dayanıklıdır.

**Saten ve İpek Karışımlı:** Özel günler ve bayramlarda tercih edilen bu örtüler hem şık hem de konforludur.

**Pileli (Volanlı) Örtü:** Pratik yapısı ve yerinde kalma özelliğiyle öne çıkar; namaz esnasında yer değiştirmez.

## Seçimde Dikkat Edilmesi Gerekenler

1. **Boy ve genişlik:** Örtünün boyun ve göğüs kısmını tamamen kapatması şarttır.
2. **Saydamlık:** İnce ve şeffaf kumaşlar namaz için uygun değildir.
3. **Kayma direnci:** Namazda sürekli düzeltmek zorunda kalmamak için iç astarı olan modeller tercih edilebilir.
4. **Kolay bakım:** Bazı örtüler yalnızca elle yıkama gerektirir; etiketi kontrol edin.

## Hediye Olarak Namaz Örtüsü

Namaz örtüsü hac, umre ve mevlüt törenleri için anlamlı bir hediye seçeneğidir. Kutulu setler, tesbih veya misvak ile kombine edilerek daha kapsamlı hediyeler hazırlanabilir. OBRNHOMEN koleksiyonunda farklı renk ve malzemelerde namaz örtüleri bulabilirsiniz.
    `,
    related: [
      { label: "Namaz Örtüsü", href: "/koleksiyon/Namaz Örtüsü" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
    ],
  },
  "ramazan-hediyesi-fikirleri": {
    title: "Ramazan Hediyesi Fikirleri 2025",
    excerpt: "Ramazan ayında sevdiklerinize verebileceğiniz en anlamlı hediyeler: tesbih setleri, seccade, Kuran ve kombine hediyelik setler.",
    category: "Rehber",
    date: "2025-03-20",
    readTime: "3 dk",
    content: `
Ramazan, ruhani anlamda zenginleşmenin ve yakınlarla paylaşmanın yoğun şekilde yaşandığı kutlu bir aydır. Ramazan boyunca verilecek güzel bir hediye, bu özel atmosferi daha da anlamlı kılar. İşte 2025 Ramazan'ı için en güzel hediye fikirleri:

## Tesbih Setleri

Ramazan boyunca zikir ve ibadet yoğunlaşır. Bu nedenle tesbih, Ramazan hediyelerinin vazgeçilmezi hâline gelmiştir. İnci, akik veya kuka tesbih; kadife kese ile birlikte sunulduğunda hem kullanışlı hem de zarif bir hediye olur.

## Seccade

Yeni bir seccade, Ramazan ayı boyunca beş vakit namazda sevdiklerinize eşlik edecektir. Kadife veya özel dokuma seccadeler kalıcı ve anlamlı bir tercih olarak öne çıkar.

## Kuran-ı Kerim ve Dini Kitaplar

Ramazan'da Kuran okuma alışkanlığı arttığından güzel ciltli bir Kuran-ı Kerim veya mealli baskı çok değerli bir hediyedir. Cep boyu setler de sıkça tercih edilmektedir.

## Misvak Seti

Sünneti yaşatmak isteyenler için misvak, mütevazı ama değerli bir Ramazan hediyesidir. Özel kutusunda sunulan misvak setleri hem kullanışlı hem de sembolik anlam taşır.

## Kombine Hediyelik Setler

- **Tesbih + Misvak Seti**
- **Seccade + Namaz Örtüsü Seti**
- **Tesbih + Kuran Seti**

Toplu Ramazan hediyeliği için OBRNHOMEN olarak özel fiyat ve paketleme imkânı sunuyoruz. Detaylar için WhatsApp: +90 531 689 38 49
    `,
    related: [
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
    ],
  },
  "toplu-hediyelik-siparis-rehberi": {
    title: "Toplu Hediyelik Sipariş Rehberi",
    excerpt: "Mevlüt, düğün, hac organizasyonu ve kurumsal etkinlikler için toplu hediyelik siparişinde nelere dikkat edilmeli?",
    category: "Rehber",
    date: "2025-04-01",
    readTime: "3 dk",
    content: `
Mevlüt, düğün, nişan veya hac/umre organizasyonları için çok sayıda kişiye hediye almak zaman ve bütçe açısından zorlu olabilir. Doğru planlama yapıldığında toplu hediyelik siparişi hem ekonomik hem de pratik bir çözümdür.

## Ne Zaman Toplu Sipariş?

Toplu hediyelik genellikle şu durumlar için tercih edilir:

- **Mevlüt töreni:** 50-300 misafire hediyelik dağıtımı
- **Düğün ve nişan:** Davetlilere takı ya da nikâh masası hediyesi
- **Hac/umre kafilesi:** Kalabalık gruba aynı anda hediye
- **Kurumsal:** Şirket etkinlikleri veya dini özel günler

## En Çok Tercih Edilen Toplu Hediyelikler

1. **Tesbih setleri** — Kadife kese içinde, farklı boyutlarda
2. **Misvak seti** — Küçük, hafif ve ekonomik
3. **Seccade** — Orta ve büyük ölçekli organizasyonlar için
4. **Kombine set** — Tesbih + örtü + misvak bir arada

## Sipariş Süreci

**Adım 1:** Hediye verilecek kişi sayısını ve bütçeyi belirleyin.
**Adım 2:** WhatsApp hattımızdan ürün kodu ve adet bildirin.
**Adım 3:** 24 saat içinde özel toplu fiyat ve kargo koşullarınızı paylaşırız.
**Adım 4:** Ödeme sonrası paketleme ve kargo takip numarası iletilir.

50 adet ve üzeri siparişlerde **ücretsiz kargo** ve **özel fiyat** uygulanmaktadır. OBRNHOMEN WhatsApp: +90 531 689 38 49
    `,
    related: [
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
    ],
  },
  "dugun-nisanda-hediyelik-onerileri": {
    title: "Düğün ve Nişan Hediyeliği Önerileri",
    excerpt: "Düğün ve nişan törenlerinde davetlilere verilecek en anlamlı dini hediyelikler: tesbih, seccade ve kombine setler.",
    category: "Rehber",
    date: "2025-04-10",
    readTime: "3 dk",
    content: `
Düğün ve nişan törenlerinde davetlilere verilen hediyelikler, o özel günün bir hatırası olarak yıllarca saklanır. Anlamlı, kullanışlı ve estetik bir hediye seçmek hem ev sahiplerini hem de davetlileri mutlu eder.

## Neden Dini Hediyelikler?

- **Kalıcılık:** Tesbih ve seccade yıllarca, hatta kuşaklar boyu kullanılır.
- **Anlamlılık:** İbadet aracı olan hediyeler sevap değeri taşır.
- **Evrensellik:** Her yaştan misafire uygun, hiç reddedilmeyen hediyelerdir.

## Düğün Hediyeliği Önerileri

**Tesbih Seti (Kadife Kese İçinde):** En klasik düğün hediyeliğidir. İnci, akik, kuka ve kristal tesbihler arasından bütçeye göre seçim yapılabilir.

**Misvak + Tesbih Kombine Set:** Pratik ve anlam dolu bu set, hem küçük bütçelere hem de büyük kalabalıklara uygundur.

**Namaz Örtüsü (Eşarp):** Özellikle hanım misafirlere yönelik hediyelik örtü setleri popülerdir.

**Seccade:** Daha özenli bir hediye arıyorsanız seccade idealdir; küçük ölçekli törenler için özellikle tercih edilir.

## Nişan Hediyeliği Önerileri

Nişan organizasyonlarında genellikle daha küçük ve sembolik hediyeler tercih edilir:

- Cep boy Kuran seti
- Misvak seti
- Küçük tesbih + kese

50 adet ve üzeri toplu siparişlerde özel paketleme ve fiyat avantajı sunulmaktadır. Detaylar için WhatsApp: +90 531 689 38 49
    `,
    related: [
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
    ],
  },
  "ceyizlik-tesbih-seti-nasil-hazirlanir": {
    title: "Çeyizlik Tesbih Seti Nasıl Hazırlanır?",
    excerpt: "Türk geleneğinde çeyiz sandığının vazgeçilmezi: çeyizlik tesbih ve seccade setleri nasıl hazırlanır, nelere dikkat edilmeli?",
    category: "Bilgi",
    date: "2025-04-18",
    readTime: "4 dk",
    content: `
Türk geleneğinde çeyiz sandığı, yeni evlenecek çiftin hayatını birlikte kurmak için hazırladığı eşya topluluğudur. Bu özel koleksiyona eklenen çeyizlik tesbih seti, hem manevi bir dokunuş hem de değerli bir hatıra olarak öne çıkar.

## Çeyizlik Tesbih Neden Önemlidir?

Tesbih, namaz ve zikir için kullanılan bir ibadet aracı olmasının yanı sıra çeyiz sandığında şans ve bereket getireceğine inanılan simgesel bir yer tutar. Özellikle annenin kızına verdiği çeyizlik tesbih, manevi bir armağan olarak kuşaktan kuşağa aktarılır.

## Çeyizlik Tesbih Seti İçeriği

**Tesbih:** İnci, akik veya altın kaplama tesbih tercih edilir. 33 veya 99 taneli olması kullanım alışkanlığına göre belirlenir.

**Kadife Kese:** Tesbihin korunması için kaliteli bir kadife veya deri kese olmazsa olmazdır.

**Seccade:** Eşleşen renk ve desende bir seccade seti tamamlar.

**Namaz Örtüsü:** Hanım çeyizi için seccade ile uyumlu bir namaz örtüsü eklenebilir.

## Seçim Kriterleri

1. **Dayanıklılık:** Çeyizlik ürünler uzun yıllar kullanılacağından kaliteli malzeme önceliğiniz olmalı.
2. **Estetik:** Renk ve tasarım uyumu, setin bir bütün olarak değerini artırır.
3. **Kutulama:** Özel bir kutu veya kese içinde sunulan set hediye olarak da idealdir.

OBRNHOMEN koleksiyonunda özelleştirilebilir çeyizlik tesbih ve seccade setleri mevcuttur. İstenilen renk, boyut ve ambalaj kombinasyonları için WhatsApp: +90 531 689 38 49
    `,
    related: [
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
      { label: "Seccade Koleksiyonu", href: "/koleksiyon/Seccade" },
      { label: "Namaz Örtüsü", href: "/koleksiyon/Namaz Örtüsü" },
    ],
  },
  "misvak-nedir-faydalari": {
    title: "Misvak Nedir? Faydaları ve Kullanımı",
    excerpt: "Sünnetin yaşayan sembolü misvak hakkında her şey: nedir, faydaları nelerdir, nasıl kullanılır?",
    category: "Bilgi",
    date: "2025-04-25",
    readTime: "4 dk",
    content: `
Misvak, Arak ağacının dallarından elde edilen ve ağız hijyenini sağlamak için kullanılan doğal bir diş temizleme aracıdır. Hz. Peygamber'in (s.a.v.) sık sık kullandığı ve tavsiye ettiği misvak, İslam geleneğinde önemli bir sünnettir.

## Misvakın Tarihçesi

Misvak kullanımı İslamiyet'ten çok önce Orta Doğu ve Afrika'da yaygındı. Peygamber Efendimiz'in misvak kullanımını teşvik eden pek çok hadisi bulunmaktadır. Bugün modern araştırmalar da misvakın ağız sağlığına katkısını bilimsel olarak doğrulamaktadır.

## Misvakın Faydaları

**Ağız Hijyeni:** Misvakta bulunan doğal antibakteriyel maddeler diş çürümelerini ve diş eti sorunlarını önler.

**Doğal Beyazlatma:** İçeriğindeki maddeler dişleri doğal yollarla beyazlatır.

**Nefes Tazeliği:** Misvak kullanımı ağız kokusunu giderir ve nefesi tazelar.

**Diş Eti Sağlığı:** Düzenli kullanım diş etlerini güçlendirir ve kanamaları azaltır.

## Misvak Nasıl Kullanılır?

1. Misvağın uç kısmı yaklaşık 1 cm kadar soyulur.
2. Lif yapısındaki uç kısım ıslatılarak ağıza alınır.
3. Diş fırçası gibi ileri geri hareketle dişler, diş etleri ve dil temizlenir.
4. Her kullanım sonrasında ucun biraz kesilmesi önerilir.

## Misvak Hediye Olarak

Misvak; hac, umre ve mevlüt törenleri için anlamlı, kullanışlı ve uygun maliyetli bir hediye seçeneğidir. Toplu hediyeliklerde de sıkça tercih edilir. OBRNHOMEN'de doğal arak ağacından üretilen misvak setleri mevcuttur.
    `,
    related: [
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
    ],
  },
  "din-kitabi-secimi-rehberi": {
    title: "Din Kitabı Seçimi: Nelere Dikkat Edilmeli?",
    excerpt: "Kuran-ı Kerim, Delailü'l Hayrat ve ilmihal gibi dini kitapları seçerken dikkat edilmesi gereken kriterler ve hediye önerileri.",
    category: "Bilgi",
    date: "2025-05-02",
    readTime: "4 dk",
    content: `
Kuran-ı Kerim, tefsirler ve İslami bilgi kitapları; hac, umre, mevlüt ve düğün gibi özel günlerin en değerli hediyelerinden biridir. Ancak doğru kitabı seçmek bazen zorlaşabilir.

## Kuran-ı Kerim Seçimi

**Baskı Kalitesi:** Sayfa kalitesi ve baskı netliği okunabilirlik açısından belirleyicidir. Uzun süreli kullanım için kalın ve dayanıklı sayfa tercih edin.

**Boyut Seçeneği:**
- **Cep boy:** Seyahat ve taşıma için ideal
- **Orta boy (çanta boyu):** Günlük kullanım için dengeli seçim
- **Büyük boy (rahle boyu):** Ev okuma ve toplu ibadet için

**Mealli veya Mealiz:** Kuran okuması kuvvetli olmayanlar için Türkçe meal ve okunuş içeren baskılar tercih edilebilir.

**Cilt Kalitesi:** Deri veya suni deri ciltli baskılar uzun yıllar dayanır. Fermuar kapaklı modeller ek koruma sağlar.

## Diğer Dini Kitaplar

**Delailü'l Hayrat:** Salavat-ı şerife kitabı olarak bilinen bu eser hac ve umre hediyeliğinde sıkça tercih edilir.

**Cevşen:** Dua ve zikir kitabı olarak popülerdir; küçük boy baskılar hediye için idealdir.

**İlmihal:** İslami ibadet ve fıkıh bilgisi için kapsamlı bir kaynak; hem yetişkinler hem gençler için uygundur.

## Kime Hediye Edilecek?

- **Çocuklar için:** Resimli Kur'an kıssaları veya çocuk ilmihalleri
- **Gençler için:** Modern baskılı, Türkçe açıklamalı Kuran
- **Yetişkinler için:** Büyük boy, deri ciltli klasik baskı

OBRNHOMEN koleksiyonunda kaliteli din kitabı seçenekleri mevcuttur. Hediye paketleme için WhatsApp: +90 531 689 38 49
    `,
    related: [
      { label: "Hediyelik Setler", href: "/koleksiyon/Hediyelik Set" },
      { label: "Tesbih Koleksiyonu", href: "/koleksiyon/Tesbih" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://obrnhomen.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["OBRNHOMEN"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `https://obrnhomen.com/blog/${slug}` },
  };
}

function renderContent(content: string) {
  return content.trim().split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-8 mb-3" style={{ color: "#1D1D1F" }}>{line.slice(3)}</h2>;
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>{line.slice(2, -2)}</p>;
    if (line.match(/^\*\*(.+?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/);
      return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#444" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>;
    }
    if (line.startsWith("- ") || line.match(/^\d+\. /)) return <li key={i} className="text-sm leading-relaxed mb-1.5 ml-4 list-disc" style={{ color: "#555" }}>{line.replace(/^[-\d.]+\s/, "")}</li>;
    if (line.trim() === "") return <div key={i} className="h-3" />;
    return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>{line}</p>;
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "OBRNHOMEN", url: "https://obrnhomen.com" },
    publisher: {
      "@type": "Organization",
      name: "OBRNHOMEN",
      logo: { "@type": "ImageObject", url: "https://obrnhomen.com/icons/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://obrnhomen.com/blog/${slug}` },
  };

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <div className="pt-36 pb-12 px-6" style={{ background: "#F5F5F7" }}>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: "#86868B" }}>
            <Link href="/" className="hover:text-black transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <span>/</span>
            <span style={{ color: "#1D1D1F" }} className="line-clamp-1">{post.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] tracking-[0.3em] uppercase px-2 py-0.5" style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}>
              {post.category}
            </span>
            <span className="text-[10px]" style={{ color: "#86868B" }}>{post.readTime} okuma</span>
            <span className="text-[10px]" style={{ color: "#86868B" }}>
              {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em", color: "#1D1D1F" }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div className="prose-content">
          {renderContent(post.content)}
        </div>

        {/* İlgili Ürünler */}
        {post.related.length > 0 && (
          <div className="mt-14 pt-10 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "#86868B" }}>İlgili Ürünler</p>
            <div className="flex flex-wrap gap-2">
              {post.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="px-5 py-2.5 text-xs tracking-[0.15em] uppercase border transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
                  style={{ borderColor: "#e5e5e5", color: "#1D1D1F" }}
                >
                  {r.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 text-center border" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)" }}>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>OBRNHOMEN</p>
          <p className="text-sm mb-5" style={{ color: "#86868B" }}>
            El işçiliğiyle hazırlanan tesbih, seccade ve hediyelik ürünleri keşfedin.
          </p>
          <Link
            href="/koleksiyon"
            className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
            style={{ background: "#1D1D1F", color: "#c9a84c" }}
          >
            Koleksiyonu Gör
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-xs tracking-widest uppercase transition-colors hover:text-black" style={{ color: "#86868B" }}>
            ← Tüm Yazılar
          </Link>
        </div>
      </div>
    </div>
  );
}
