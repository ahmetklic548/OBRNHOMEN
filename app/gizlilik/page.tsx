import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Items } from "@/app/components/LegalPage";
import CookieSettingsButton from "@/app/components/CookieSettingsButton";
import { SELLER } from "@/lib/legal";

const URL = "https://www.obrnhomen.com/gizlilik";

export const metadata: Metadata = {
  title: "Gizlilik ve Çerez Politikası",
  description: "OBRNHOMEN gizlilik ve çerez politikası: hangi çerezleri kullanıyoruz, nasıl yönetirsiniz.",
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <LegalPage
      current="/gizlilik"
      title="Gizlilik ve Çerez Politikası"
      intro={<p>Sitemizde yalnızca gerekli çerezler kendiliğinden çalışır. Ölçüm ve reklam çerezleri ancak siz &quot;Kabul et&quot; derseniz devreye girer.</p>}
      sections={[
        {
          title: "Çerez nedir?",
          body: <p>Çerezler ve benzeri teknolojiler (tarayıcı depolaması), siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük dosyalardır. Sepetinizin kaybolmaması gibi temel işlevler için gereklidirler.</p>,
        },
        {
          title: "Zorunlu çerezler (her zaman açık)",
          body: (
            <Items>{[
              "Sepet, favoriler ve toptan listesi (tarayıcınızda saklanır).",
              "Google ile giriş oturumu (Firebase).",
              "Ödeme güvenliği (PayTR ödeme ekranı).",
              "Çerez tercihiniz ve yazı büyütme (A+) tercihiniz.",
              "Kafile/ortak kodu ile geldiyseniz o kodun hatırlanması.",
            ]}</Items>
          ),
        },
        {
          title: "Ölçüm ve reklam çerezleri (izninizle)",
          body: (
            <Items>{[
              "Google Analytics 4 — hangi sayfaların ziyaret edildiğini, siparişlerin hangi kaynaktan geldiğini anonim istatistik olarak ölçer.",
              "Meta Pixel (Facebook/Instagram) — reklamlarımızın işe yarayıp yaramadığını ölçer, ilgilenebileceğiniz ürünleri göstermemize yardım eder.",
            ]}</Items>
          ),
        },
        {
          title: "Tercihinizi değiştirin",
          body: (
            <>
              <p>Tercihinizi istediğiniz zaman değiştirebilirsiniz. Tarayıcı ayarlarınızdan da çerezleri silebilir veya engelleyebilirsiniz.</p>
              <CookieSettingsButton />
            </>
          ),
        },
        {
          title: "Kişisel verileriniz",
          body: <p>Hangi verileri neden işlediğimiz ve haklarınız için <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>'ne bakabilirsiniz. Sorularınız için: {SELLER.eposta}</p>,
        },
      ]}
    />
  );
}
