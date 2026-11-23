import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Items } from "@/app/components/LegalPage";
import { SELLER, fill } from "@/lib/legal";

const URL = "https://www.obrnhomen.com/kvkk";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "OBRNHOMEN kişisel verilerin korunması aydınlatma metni: hangi veriler, hangi amaçla işlenir, kimlerle paylaşılır, haklarınız.",
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <LegalPage
      current="/kvkk"
      title="KVKK Aydınlatma Metni"
      intro={<p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) md. 10 uyarınca, kişisel verilerinizi nasıl işlediğimizi sade bir dille anlatıyoruz. Verilerinizi yalnızca gerektiği kadar topluyor, emanet bilip koruyoruz.</p>}
      sections={[
        {
          title: "Veri sorumlusu",
          body: <p>{fill(SELLER.unvan, "Satıcı unvanı")} ({SELLER.marka}) — {SELLER.adres}. İletişim: {SELLER.eposta}</p>,
        },
        {
          title: "Hangi verileri işliyoruz?",
          body: (
            <Items>{[
              "Kimlik ve iletişim: ad soyad, telefon, e-posta, teslimat adresi.",
              "Sipariş bilgileri: aldığınız ürünler, tutar, ödeme yöntemi, sipariş ve kargo numarası, hediye kartına yazılmasını istediğiniz isimler.",
              "Hesap bilgileri: Google ile giriş yaparsanız adınız ve e-posta adresiniz.",
              "İşlem güvenliği: IP adresi, tarayıcı bilgisi, site kayıtları.",
              "Pazarlama (yalnızca izin verirseniz): bülten aboneliği e-postanız, çerez onayı verdiyseniz site kullanım istatistikleri.",
            ]}</Items>
          ),
        },
        {
          title: "Neden işliyoruz? (amaç ve hukuki sebep)",
          body: (
            <Items>{[
              <>Siparişinizi almak, hazırlamak, kargolamak, iade/değişim yapmak — <em>sözleşmenin kurulması ve ifası</em> (KVKK md. 5/2-c).</>,
              <>Fatura düzenlemek, kayıtları yasal süre saklamak — <em>hukuki yükümlülük</em> (md. 5/2-ç).</>,
              <>Dolandırıcılığı önlemek, site güvenliği, hak arama — <em>meşru menfaat</em> ve <em>hakkın tesisi</em> (md. 5/2-e, f).</>,
              <>Kampanya/bülten e-postası, reklam ölçümü, analitik çerezler — <em>açık rızanız</em> (md. 5/1). Rızanızı dilediğiniz an geri alabilirsiniz.</>,
            ]}</Items>
          ),
        },
        {
          title: "Kimlerle paylaşıyoruz?",
          body: (
            <>
              <p>Verilerinizi satmıyoruz. Yalnızca hizmetin gerektirdiği kadarını şu taraflarla paylaşıyoruz:</p>
              <Items>{[
                "Kargo firmaları (teslimat ve iade için ad, adres, telefon).",
                "PayTR ödeme kuruluşu (kartla ödeme; kart bilgileriniz doğrudan PayTR'ye girilir, bize gelmez).",
                "Mali müşavir ve e-fatura hizmet sağlayıcısı (fatura için).",
                "Barındırma ve altyapı: Vercel (site), Google Firebase (sipariş kayıtları, giriş). Bu sunucular yurt dışında olabilir; aktarım KVKK md. 9 kapsamında yapılır.",
                "Yalnızca çerez onayı verdiyseniz: Google Analytics ve Meta (Facebook/Instagram) ölçüm araçları.",
                "Kanunen yetkili kamu kurumları (talep hâlinde).",
              ]}</Items>
            </>
          ),
        },
        {
          title: "Ne kadar saklıyoruz?",
          body: <p>Sipariş ve fatura kayıtları vergi mevzuatı gereği 10 yıl, diğer veriler işleme amacı sona erene kadar saklanır; süre dolunca silinir, yok edilir veya anonim hâle getirilir. Bülten aboneliğinizi iptal ettiğinizde e-postanız listeden çıkarılır.</p>,
        },
        {
          title: "Haklarınız (KVKK md. 11)",
          body: (
            <>
              <Items>{[
                "Verinizin işlenip işlenmediğini öğrenme, işlendiyse bilgi isteme,",
                "Amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,",
                "Aktarıldığı kişileri bilme,",
                "Eksik/yanlış işlenmişse düzeltilmesini, şartları varsa silinmesini isteme,",
                "Otomatik analizle aleyhinize bir sonuç çıkmasına itiraz etme,",
                "Kanuna aykırı işleme nedeniyle zarara uğradıysanız tazminat isteme.",
              ]}</Items>
              <p>Başvurunuzu {SELLER.eposta} adresine veya yukarıdaki adrese yazılı olarak iletebilirsiniz. En geç 30 gün içinde ücretsiz cevap veririz.</p>
              <p>Çerezlerle ilgili ayrıntılar: <Link href="/gizlilik" className="underline">Gizlilik ve Çerez Politikası</Link>.</p>
            </>
          ),
        },
      ]}
    />
  );
}
