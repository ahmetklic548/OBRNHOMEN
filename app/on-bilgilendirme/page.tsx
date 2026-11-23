import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Items } from "@/app/components/LegalPage";
import { SELLER, ORDER_TERMS, fill } from "@/lib/legal";

const URL = "https://www.obrnhomen.com/on-bilgilendirme";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description: "OBRNHOMEN siparişleri için ön bilgilendirme formu: satıcı bilgileri, ödeme, teslimat ve cayma hakkı.",
  alternates: { canonical: URL },
};

const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

export default function Page() {
  return (
    <LegalPage
      current="/on-bilgilendirme"
      title="Ön Bilgilendirme Formu"
      intro={<p>Siparişinizi vermeden önce bilmeniz gerekenleri burada topladık. Bu form, Mesafeli Sözleşmeler Yönetmeliği md. 5 uyarınca sözleşme kurulmadan önce size sunulur.</p>}
      sections={[
        {
          title: "Satıcı",
          body: (
            <Items>{[
              <>{fill(SELLER.unvan, "Satıcı unvanı")} — {SELLER.marka}</>,
              <>{SELLER.adres}</>,
              ...(SELLER.vergiNo ? [<>Vergi dairesi / no: {fill(SELLER.vergiDairesi, "Vergi dairesi")} / {SELLER.vergiNo}</>] : []),
              <>Telefon / WhatsApp: {SELLER.telefon} · E-posta: {SELLER.eposta}</>,
            ]}</Items>
          ),
        },
        {
          title: "Ürün ve toplam fiyat",
          body: <p>Sepetinizdeki ürünlerin adı, adedi (paket/adet), rengi, birim fiyatı ve vergiler dahil toplam tutarı ödeme sayfasındaki sipariş özetinde gösterilir. Kargo: {tl(ORDER_TERMS.kargoUcreti)} ({tl(ORDER_TERMS.ucretsizKargoUstu)} ve üzeri ücretsiz). Kapıda ödeme hizmet bedeli: {tl(ORDER_TERMS.kapidaOdemeBedeli)}.</p>,
        },
        {
          title: "Ödeme",
          body: <p>Kredi/banka kartıyla (PayTR güvenli ödeme, taksit seçenekleriyle) veya kapıda ödeme ile. Kart bilgileriniz bize ulaşmaz, saklanmaz.</p>,
        },
        {
          title: "Teslimat",
          body: <p>Siparişiniz {ORDER_TERMS.kargoyaVerme} içinde kargoya verilir (yasal azami süre 30 gün). Kargo takip numarası size iletilir; <Link href="/kargo-takip" className="underline">Sipariş Takip</Link> sayfasından da izleyebilirsiniz.</p>,
        },
        {
          title: "Cayma hakkı",
          body: (
            <>
              <p>Teslimden itibaren {ORDER_TERMS.cayma} gün içinde gerekçe göstermeden cayabilirsiniz. İade kargosu ücretsizdir; ödemeniz ürün bize ulaştıktan sonra en geç {ORDER_TERMS.iadeOdeme} gün içinde iade edilir.</p>
              <p>Kişiye özel hazırlanan (isimli/yazılı) ürünlerde ve ambalajı açılmış hijyen ürünlerinde (misvak, esans, zemzem vb.) cayma hakkı kullanılamaz.</p>
            </>
          ),
        },
        {
          title: "Şikâyet ve itiraz",
          body: <p>Şikâyetlerinizi WhatsApp veya e-posta ile iletebilirsiniz. Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Ayrıntılar <Link href="/mesafeli-satis-sozlesmesi" className="underline">Mesafeli Satış Sözleşmesi</Link>'ndedir.</p>,
        },
      ]}
    />
  );
}
