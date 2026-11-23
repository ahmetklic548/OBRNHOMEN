import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Items } from "@/app/components/LegalPage";
import { SELLER, ORDER_TERMS, fill } from "@/lib/legal";

const URL = "https://www.obrnhomen.com/mesafeli-satis-sozlesmesi";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "OBRNHOMEN mesafeli satış sözleşmesi: taraflar, ürün, ödeme, teslimat, cayma hakkı ve uyuşmazlık çözümü.",
  alternates: { canonical: URL },
};

const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

export default function Page() {
  return (
    <LegalPage
      current="/mesafeli-satis-sozlesmesi"
      title="Mesafeli Satış Sözleşmesi"
      intro={<p>Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, {SELLER.site} üzerinden verilen siparişler için geçerlidir. Siparişi onaylamanızla birlikte elektronik ortamda kurulmuş olur.</p>}
      sections={[
        {
          title: "1. Taraflar",
          body: (
            <>
              <p><strong>SATICI</strong></p>
              <Items>{[
                <>Unvan: {fill(SELLER.unvan, "Satıcı unvanı")} ({SELLER.marka})</>,
                <>Adres: {SELLER.adres}</>,
                <>Vergi dairesi / no: {fill(SELLER.vergiDairesi, "Vergi dairesi")} / {fill(SELLER.vergiNo, "Vergi no")}</>,
                ...(SELLER.mersisNo ? [<>MERSİS no: {SELLER.mersisNo}</>] : []),
                <>Telefon / WhatsApp: {SELLER.telefon}</>,
                <>E-posta: {SELLER.eposta}</>,
              ]}</Items>
              <p><strong>ALICI</strong></p>
              <p>Sipariş formunda adı, soyadı, adresi, telefonu ve e-posta adresi bulunan kişidir. Alıcının bu bilgileri sipariş onay e-postasında da yer alır.</p>
            </>
          ),
        },
        {
          title: "2. Sözleşmenin konusu",
          body: <p>Alıcının {SELLER.site} sitesinden elektronik ortamda siparişini verdiği, sipariş özetinde nitelikleri ve satış fiyatı belirtilen ürünlerin satışı ve teslimi ile tarafların hak ve yükümlülükleridir.</p>,
        },
        {
          title: "3. Ürün, fiyat ve ödeme",
          body: (
            <>
              <p>Ürünlerin cinsi, adedi (paket/adet), rengi ve vergiler dahil satış fiyatı ödeme sayfasındaki sipariş özetinde ve sipariş onay e-postasında yer alır. İlan edilen fiyatlar siparişin verildiği an için geçerlidir.</p>
              <Items>{[
                <>Kargo ücreti {tl(ORDER_TERMS.kargoUcreti)}'dir; {tl(ORDER_TERMS.ucretsizKargoUstu)} ve üzeri siparişlerde kargo ücretsizdir.</>,
                <>Kartla ödemeler PayTR güvenli ödeme altyapısıyla alınır; kart bilgileri satıcı tarafından görülmez ve saklanmaz. Taksit seçenekleri ödeme ekranında gösterilir.</>,
                <>Kapıda ödemede kargo firması {tl(ORDER_TERMS.kapidaOdemeBedeli)} hizmet bedeli alır; bu bedel sipariş özetinde gösterilir.</>,
                <>Kartla yapılan ödemelerde, ödemenin banka tarafından herhangi bir sebeple iptal edilmesi hâlinde satıcı teslim yükümlülüğünden kurtulur.</>,
              ]}</Items>
            </>
          ),
        },
        {
          title: "4. Teslimat",
          body: (
            <>
              <p>Ürünler, siparişin onaylanmasından itibaren {ORDER_TERMS.kargoyaVerme} içinde kargoya verilir; her durumda yasal azami süre olan 30 günü geçmez. Teslimat, alıcının sipariş formunda belirttiği adrese anlaşmalı kargo firmasıyla yapılır.</p>
              <p>Teslim sırasında paketi kontrol etmenizi, hasarlı pakette kargo görevlisine tutanak tutturmanızı rica ederiz. Alıcı dışında birine yapılan teslimden (adreste bulunan kişi) satıcı sorumlu tutulamaz.</p>
              <p>Toptan, kafile ve özel hazırlanan siparişlerde teslim süresi teklifte ayrıca yazılı olarak bildirilir.</p>
            </>
          ),
        },
        {
          title: "5. Cayma hakkı",
          body: (
            <>
              <p>Alıcı, ürünü teslim aldığı tarihten itibaren <strong>{ORDER_TERMS.cayma} gün</strong> içinde hiçbir gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir. Cayma bildirimi WhatsApp ({SELLER.telefon}) veya e-posta ({SELLER.eposta}) ile sipariş numarası belirtilerek yapılır.</p>
              <p>Bildirimden sonra size bir iade kodu gönderilir; ürünü 10 gün içinde bu kodla anlaşmalı kargo firmasına <strong>ücretsiz</strong> teslim edersiniz. Ürün bize ulaştıktan sonra ödemeniz en geç {ORDER_TERMS.iadeOdeme} gün içinde (genellikle 7 gün içinde), ödeme yaptığınız yönteme iade edilir. Ayrıntılar: <Link href="/returns" className="underline">İade Şartları</Link>.</p>
            </>
          ),
        },
        {
          title: "6. Cayma hakkının kullanılamayacağı durumlar",
          body: (
            <Items>{[
              "Alıcının isteğiyle kişiye özel hazırlanan ürünler (isim, tarih veya özel yazı basılan/işlenen ürünler, alıcıya özel hazırlanan setler).",
              "Teslimden sonra ambalajı açılmış, sağlık ve hijyen açısından iadesi uygun olmayan ürünler (misvak, esans/koku, zemzem ve benzeri).",
              "Teslimden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılamayan ürünler.",
            ]}</Items>
          ),
        },
        {
          title: "7. Ayıplı ürün",
          body: <p>Kusurlu, hasarlı veya siparişe uygun olmayan ürünlerde alıcı; ücretsiz değişim, ücret iadesi, ayıp oranında indirim veya ücretsiz onarım haklarından birini kullanabilir. Bu durumda kargo dahil tüm masraflar satıcıya aittir.</p>,
        },
        {
          title: "8. Kişisel veriler",
          body: <p>Alıcının kişisel verileri siparişin yerine getirilmesi amacıyla <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>'nde açıklandığı şekilde işlenir.</p>,
        },
        {
          title: "9. Uyuşmazlık çözümü",
          body: <p>Şikâyetlerinizi önce bize iletmenizi rica ederiz; çözüm için elimizden geleni yaparız. Uyuşmazlıklarda, Ticaret Bakanlığınca her yıl ilan edilen parasal sınırlar dahilinde alıcının veya satıcının yerleşim yerindeki Tüketici Hakem Heyetleri, bu sınırları aşan durumlarda Tüketici Mahkemeleri yetkilidir. Başvurular e-Devlet üzerinden (TÜBİS) de yapılabilir.</p>,
        },
        {
          title: "10. Yürürlük",
          body: <p>Alıcı, ödeme sayfasında bu sözleşmeyi ve Ön Bilgilendirme Formu'nu okuduğunu onaylayarak siparişi verdiğinde sözleşme kurulmuş sayılır. Sözleşmenin bir örneği sipariş onay e-postasındaki bağlantıdan her zaman görüntülenebilir.</p>,
        },
      ]}
    />
  );
}
