import type { Metadata } from "next";
import Link from "next/link";
import WholesaleLeadForm from "@/app/components/WholesaleLeadForm";
import { WHATSAPP_URL } from "@/lib/storeNav";

const URL = "https://www.obrnhomen.com/fr";

export const metadata: Metadata = {
  title: { absolute: "Grossiste articles islamiques en Turquie | Tapis de prière, tasbih, coffrets Ramadan – OBRNHOMEN" },
  description:
    "Fournisseur grossiste à Istanbul : tapis de prière, tasbihs, Corans, parfums, ihram et coffrets cadeaux Ramadan, Aïd, Hajj & Omra. Pas de minimum total, commandes mixtes, marque blanche. Recevez nos catalogues par e-mail.",
  keywords: [
    "grossiste articles islamiques", "tapis de prière en gros", "grossiste tapis de prière turquie", "tasbih en gros",
    "coffret ramadan en gros", "coffret cadeau aid grossiste", "cadeaux hajj omra en gros", "fournisseur produits islamiques turquie",
    "grossiste islamique istanbul", "tapis de prière marque blanche",
  ],
  alternates: { canonical: URL, languages: { fr: URL, en: "https://www.obrnhomen.com/en/wholesale", "tr-TR": "https://www.obrnhomen.com/toptan", "x-default": "https://www.obrnhomen.com/en/wholesale" } },
  openGraph: { title: "Grossiste articles islamiques à Istanbul – OBRNHOMEN", description: "Tapis de prière, tasbihs, Corans et coffrets Ramadan, Hajj & Omra pour les boutiques.", url: URL, locale: "fr_FR", type: "website" },
};

const ADIMLAR = [
  ["Recevez les catalogues", "Remplissez le formulaire — nos catalogues Coffrets et Articles à l'unité arrivent dans votre boîte mail."],
  ["Envoyez codes et quantités", "ex. A-01 x 5, C-02 x 20 sur WhatsApp ou par e-mail. Commandes mixtes bienvenues."],
  ["Recevez votre proforma", "Prix en EUR ou USD sous 24 heures, avec une estimation de livraison vers votre pays."],
  ["Acompte de 50 %", "Nous préparons votre commande dès réception de l'acompte."],
  ["Photos, solde, expédition", "Vous voyez photos/vidéos de vos produits, réglez le solde, et nous expédions avec suivi."],
];

const CATS = [
  ["Tapis de prière", "Velours, peluche, chenille, gobelin – unis ou brodés, dont grand format 80×120 cm."],
  ["Tasbihs & compteurs", "Perles de verre, cristal, kuka – 99 et 33 grains, compteurs digitaux."],
  ["Corans & livres de prières", "Corans en arabe (poche, moyen, grand format), Yasin, livres de douas."],
  ["Coffrets Ramadan & Aïd", "Coffrets prêts à offrir : tapis, tasbih, Yasin, parfum – personnalisables."],
  ["Hajj & Omra", "Ihram (dont 110×260 cm), coffrets pour pèlerins, miswak, savon sans parfum."],
  ["Parfums & cadeaux", "Musc et attar sans alcool, khôl, foulards, robes de prière, petits cadeaux."],
];

const SSS: [string, string][] = [
  ["Y a-t-il un minimum de commande ?", "Pas de minimum total. Le minimum est d'un lot par article (les articles à l'unité se commandent à la pièce) : une petite commande d'essai est la bienvenue."],
  ["Envoyez-vous des échantillons ?", "Nous n'envoyons pas d'échantillons gratuits – commencez plutôt par une petite commande d'essai, qui fonctionne comme une commande normale."],
  ["Devises et paiement ?", "Devis en EUR ou USD. Paiement par virement bancaire international : 50 % d'acompte, solde avant expédition."],
  ["Comment livrez-vous ?", "Par transporteur express porte-à-porte, prix selon le poids de la commande – ou remise à votre transitaire à Istanbul (EXW). Les droits et la TVA à l'import sont à la charge de l'acheteur."],
  ["Pouvez-vous imprimer notre logo ou des prénoms ?", "Oui. Impression de prénoms ou de logo et emballage en marque blanche sont possibles pour les coffrets, boîtes et sachets."],
  ["Puis-je choisir les couleurs ?", "Les couleurs sont généralement assorties. Pour des couleurs précises, dites-le-nous et nous vérifions la disponibilité."],
  ["Quel délai de préparation ?", "Le stock disponible part en quelques jours ; les commandes plus grandes ou personnalisées prennent plus de temps. La date est confirmée sur votre proforma."],
];

export default function FrenchPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fr",
    mainEntity: SSS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <div lang="fr" style={{ background: "#fafaf8" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="border-b border-stone-200 px-6 py-14 text-center">
        <p className="text-[12px] uppercase tracking-[0.35em] text-[#9a7a2c]">Grossiste · Istanbul, Turquie</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl text-stone-900 md:text-5xl" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Articles islamiques et coffrets cadeaux pour votre boutique
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-stone-600">
          Tapis de prière, tasbihs, Corans, parfums, ihram et coffrets Ramadan, Aïd, Hajj &amp; Omra prêts à offrir — directement d&apos;Istanbul
          pour les boutiques, sites en ligne, agences de voyage et mosquées en France, en Belgique, en Afrique et partout dans le monde.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#catalogue" className="rounded-md bg-black px-6 py-3.5 text-[15px] font-semibold text-white">Recevoir les catalogues</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="rounded-md border border-stone-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-stone-900">WhatsApp</a>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 text-[14px] text-stone-700 sm:grid-cols-4">
          {[["600+", "produits"], ["Aucun", "minimum total"], ["EUR / USD", "proforma sous 24 h"], ["Marque", "blanche & logo"]].map(([a, b]) => (
            <div key={b} className="rounded-lg border border-stone-200 bg-white p-3"><div className="text-[18px] font-semibold text-stone-900">{a}</div>{b}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Nos produits</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map(([b, a]) => (
            <div key={b} className="rounded-lg border border-stone-200 bg-white p-4 text-[14px] text-stone-600"><div className="mb-1 text-[16px] font-semibold text-stone-900">{b}</div>{a}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <h2 className="mb-6 text-center text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Comment commander</h2>
        <ol className="grid gap-4 md:grid-cols-5">
          {ADIMLAR.map(([b, a], i) => (
            <li key={b} className="rounded-lg border border-stone-200 bg-white p-4 text-[14px] text-stone-600">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-[13px] font-semibold text-white">{i + 1}</div>
              <div className="mb-1 font-semibold text-stone-900">{b}</div>{a}
            </li>
          ))}
        </ol>
      </section>

      <section id="catalogue" className="border-y border-stone-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Recevez nos catalogues grossiste</h2>
          <p className="mb-6 mt-2 text-[15px] text-stone-600">Deux catalogues PDF en français — <b>Coffrets</b> et <b>Articles à l&apos;unité</b> — envoyés à votre e-mail en une minute. <Link href="/en/wholesale#catalogue" className="underline">English version</Link></p>
          <WholesaleLeadForm dil="fr" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-4 text-2xl text-stone-900" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Questions fréquentes</h2>
        {SSS.map(([q, a]) => (
          <details key={q} className="border-b border-stone-200 py-4">
            <summary className="cursor-pointer text-[16px] font-medium text-stone-900">{q}</summary>
            <p className="mt-2 text-[15px] leading-relaxed text-stone-600">{a}</p>
          </details>
        ))}
        <p className="mt-8 text-[15px] text-stone-600">À lire : <Link href="/fr/blog/grossiste-tapis-de-priere-turquie" className="underline">grossiste tapis de prière en Turquie</Link> · <Link href="/fr/blog" className="underline">tous les guides grossiste</Link>.</p>
      </section>
    </div>
  );
}
