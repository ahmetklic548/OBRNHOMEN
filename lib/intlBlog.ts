// Yurt dışı alıcılar için EN/FR blog yazıları. Fiyat/MOQ uydurma yok:
// sadece sitedeki gerçek bilgiler (karışık sipariş, toplam minimum yok, özel etiket,
// 24 saatte proforma, %50 kapora, kataloglar e-posta ile).

export type IntlLang = "en" | "fr";

export interface IntlPost {
  slug: string;
  lang: IntlLang;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

export const INTL_UI: Record<IntlLang, {
  blog: string; home: string; homeHref: string; wholesaleHref: string; cta: string; ctaBtn: string;
  waText: string; read: string; all: string; blogTitle: string; blogDesc: string; blogH1: string; blogSub: string;
}> = {
  en: {
    blog: "Blog", home: "Home", homeHref: "/en", wholesaleHref: "/en/wholesale",
    cta: "Shop owner or reseller? Get our wholesale catalogues by e-mail. Mixed orders welcome, private label available.",
    ctaBtn: "Get the catalogues",
    waText: "Hello OBRNHOMEN, I'm writing from abroad about wholesale. Country:\nProducts:\nQuantity:",
    read: "min read", all: "← All articles",
    blogTitle: "Wholesale Guides | Islamic Gifts from Turkey – OBRNHOMEN",
    blogDesc: "Practical guides for shops and resellers importing prayer mats, tasbih, Qurans and Ramadan, Hajj & Umrah gift sets from Istanbul.",
    blogH1: "Wholesale guides", blogSub: "Practical notes for shops importing Islamic gifts from Istanbul.",
  },
  fr: {
    blog: "Blog", home: "Accueil", homeHref: "/fr", wholesaleHref: "/fr",
    cta: "Boutique ou revendeur ? Recevez nos catalogues grossiste par e-mail. Commandes mixtes bienvenues, marque blanche possible.",
    ctaBtn: "Recevoir les catalogues",
    waText: "Bonjour OBRNHOMEN, je vous écris de l'étranger pour une commande en gros. Pays :\nProduits :\nQuantités :",
    read: "min de lecture", all: "← Tous les articles",
    blogTitle: "Guides grossiste | Articles islamiques de Turquie – OBRNHOMEN",
    blogDesc: "Guides pratiques pour les boutiques et revendeurs qui importent tapis de prière, tasbihs, Corans et coffrets Ramadan, Hajj & Omra depuis Istanbul.",
    blogH1: "Guides grossiste", blogSub: "Conseils pratiques pour importer des articles islamiques depuis Istanbul.",
  },
};

export const INTL_POSTS: IntlPost[] = [
  {
    slug: "how-to-buy-prayer-mats-wholesale-from-turkey",
    lang: "en",
    title: "How to Buy Prayer Mats Wholesale from Turkey",
    excerpt: "What shops should check before importing Turkish prayer rugs: types, sizes, packing, samples, payment and shipping.",
    date: "2026-11-25",
    readTime: "4",
    content: `
Turkey is one of the main sources of prayer mats (sajadah) for shops in Europe, Africa and the Middle East. Buying wholesale from Istanbul is simple if you know what to ask for.

## 1. Know the types you want to stock

Most shops mix a few types so every customer budget is covered:
- **Velvet and plush prayer rugs:** soft, the classic best seller, often sold in gift boxes.
- **Chenille and embroidered rugs:** a more premium look for gifts.
- **Large sizes (80×120 cm):** popular for mosques, families and Ramadan gifts.
- **Plain and patterned designs:** ask which colours are in stock before you order.

## 2. Ask for mixed orders

You do not have to fill a whole order with one product. At OBRNHOMEN mixed orders are welcome: prayer mats together with tasbih, Qurans, attar or gift sets in one shipment. There is no minimum total, which makes a first test order easy.

## 3. Check packing and branding

Ask how products are packed (boxes, organza bags, shrink wrap) and whether private label is available if you want your own brand on the packaging.

## 4. Payment and proforma

A normal process: you send product codes and quantities, you receive a proforma invoice with prices in USD or EUR, and production or preparation starts after a deposit. We work with a 50% deposit and send the proforma within 24 hours.

## 5. Shipping

For small orders (a few cartons), express or postal services work. For pallets or a full shipment, freight by sea or air is cheaper per kilo. Shipping cost depends on your country and total weight, so ask for a quote together with your product list.

## Next step

Send us the products and quantities you are considering, together with your country, and we will prepare a proforma and a shipping estimate.
`,
  },
  {
    slug: "ramadan-gift-sets-wholesale-guide",
    lang: "en",
    title: "Ramadan and Eid Gift Sets: A Wholesale Buying Guide for Shops",
    excerpt: "How to plan Ramadan and Eid gift stock: what sells, when to order and how to keep a small first order.",
    date: "2026-11-25",
    readTime: "4",
    content: `
Ramadan and Eid are the busiest weeks of the year for Islamic gift shops. Stock needs to be ordered weeks ahead, because production, packing and shipping all take time.

## What sells every year

- **Yasin and tasbih sets** in organza bags or boxes, easy to give in bulk.
- **Prayer mat and tasbih sets** for family gifts.
- **Mini Quran sets** and Quran with velvet or boxed covers.
- **Attar (alcohol-free) and miswak** as small add-on gifts at the counter.

## Plan your order timeline

Start talking to your supplier at least two months before Ramadan. Work backwards from the date you want the goods in your shop: add time for your customs clearance, shipping, and the order preparation after the deposit.

## Start with a mixed test order

If you are new to a supplier, begin with a mixed order of several set types. You can see quality, packing and delivery time with limited risk, and repeat the best sellers.

## Group and bulk sets

For mosques, associations and Hajj or Umrah groups we prepare ready gift sets for 20 to 100 pilgrims, packed per person. Ask for the group set catalogue.

## How to order from OBRNHOMEN

1. Fill in the catalogue form on our wholesale page.
2. Send product codes and quantities on WhatsApp or e-mail.
3. Receive your proforma (USD or EUR) within 24 hours with a shipping estimate.
4. Pay the 50% deposit and we prepare your order.
`,
  },
  {
    slug: "importing-islamic-gifts-from-turkey-to-africa",
    lang: "en",
    title: "Importing Islamic Gifts from Turkey to West Africa: A Practical Checklist",
    excerpt: "Documents, payment, shipping and import duty points for shops in Senegal and other West African markets.",
    date: "2026-11-25",
    readTime: "5",
    content: `
Many shops in West Africa buy prayer mats, tasbih and gift sets from Istanbul. The steps are the same in most countries, but duties and checks differ, so confirm the details with your local customs agent.

## Documents you will need

- **Commercial invoice** (English or French) with product description and HS code.
- **Packing list** with weights and number of cartons.
- **Certificate of origin** if your importer needs it for duty rates.

## Duties and taxes

Import duty, VAT and local fees are normally paid by the buyer when goods arrive. The rate depends on the HS code of each product and on your country. For larger consignments some countries require a pre-shipment inspection or a cargo tracking document before the goods leave, so ask your importer or forwarder early.

## Shipping options

- **Express or postal:** fast, good for samples and small orders.
- **Air freight:** for urgent medium shipments.
- **Sea freight (LCL or full container):** the cheapest per kilo for large orders, but slower.

Goods with batteries, for example electronic tasbih counters or Quran reading pens, have extra rules for air transport, so tell your forwarder if your order includes them.

## Payment

We send a proforma in USD or EUR and start preparing the order after a 50% deposit. The balance is paid before shipping.

## Get a quote

Send us your country, product list and quantities and we will prepare a proforma and a shipping estimate.
`,
  },
  {
    slug: "grossiste-tapis-de-priere-turquie",
    lang: "fr",
    title: "Grossiste tapis de prière en Turquie : comment commander",
    excerpt: "Ce que les boutiques doivent vérifier avant d'importer des tapis de prière turcs : types, tailles, emballage, paiement et livraison.",
    date: "2026-11-25",
    readTime: "4",
    content: `
La Turquie est l'une des principales sources de tapis de prière (sajjada) pour les boutiques en Europe, en Afrique et au Moyen-Orient. Commander en gros depuis Istanbul est simple si vous savez quoi demander.

## 1. Choisissez vos types de tapis

La plupart des boutiques mélangent plusieurs types pour couvrir tous les budgets :
- **Tapis en velours et peluche :** doux, le grand classique, souvent vendus en coffret.
- **Tapis chenille et brodés :** un rendu plus haut de gamme pour les cadeaux.
- **Grandes tailles (80×120 cm) :** appréciées des familles et pour les cadeaux de Ramadan.
- **Modèles unis ou à motifs :** demandez les couleurs disponibles avant de commander.

## 2. Demandez une commande mixte

Inutile de remplir une commande avec un seul produit. Chez OBRNHOMEN, les commandes mixtes sont bienvenues : tapis de prière, tasbihs, Corans, attar ou coffrets cadeaux dans un même envoi. Il n'y a pas de minimum de commande total, ce qui facilite une première commande test.

## 3. Emballage et marque

Demandez comment les produits sont emballés (boîtes, sachets organza, film) et si la marque blanche est possible pour mettre votre propre marque sur l'emballage.

## 4. Paiement et proforma

Le déroulement classique : vous envoyez les codes produits et quantités, vous recevez une facture proforma en USD ou en EUR, et la préparation commence après un acompte. Nous travaillons avec un acompte de 50 % et envoyons la proforma sous 24 heures.

## 5. Livraison

Pour de petites commandes (quelques cartons), l'express ou la poste conviennent. Pour des palettes ou un envoi complet, le fret maritime ou aérien est moins cher au kilo. Le coût dépend de votre pays et du poids total : demandez un devis avec votre liste de produits.

## Étape suivante

Envoyez-nous les produits et quantités envisagés avec votre pays, nous préparons une proforma et une estimation de livraison.
`,
  },
  {
    slug: "coffrets-cadeaux-ramadan-en-gros",
    lang: "fr",
    title: "Coffrets cadeaux Ramadan et Aïd en gros : guide pour les boutiques",
    excerpt: "Comment préparer son stock de cadeaux pour le Ramadan et l'Aïd : ce qui se vend, quand commander et comment démarrer petit.",
    date: "2026-11-25",
    readTime: "4",
    content: `
Le Ramadan et l'Aïd sont les semaines les plus fortes de l'année pour les boutiques d'articles islamiques. Le stock doit être commandé des semaines à l'avance, car préparation, emballage et transport prennent du temps.

## Ce qui se vend chaque année

- **Coffrets Yasin et tasbih** en sachets organza ou en boîte, faciles à offrir en nombre.
- **Coffrets tapis de prière et tasbih** pour les cadeaux en famille.
- **Mini coffrets Coran** et Corans à couverture velours ou en coffret.
- **Attar (sans alcool) et siwak** comme petits cadeaux à la caisse.

## Prévoyez le calendrier

Contactez votre fournisseur au moins deux mois avant le Ramadan. Comptez à rebours depuis la date à laquelle vous voulez la marchandise en boutique : dédouanement, transport et préparation après l'acompte.

## Démarrez avec une commande mixte test

Avec un nouveau fournisseur, commencez par une commande mixte de plusieurs types de coffrets. Vous voyez la qualité, l'emballage et le délai avec un risque limité, puis vous recommandez les meilleures ventes.

## Coffrets pour groupes

Pour les mosquées, associations et groupes de Hajj ou d'Omra, nous préparons des coffrets prêts pour 20 à 100 pèlerins, emballés par personne. Demandez le catalogue groupes.

## Comment commander chez OBRNHOMEN

1. Remplissez le formulaire de catalogue sur notre page grossiste.
2. Envoyez codes et quantités sur WhatsApp ou par e-mail.
3. Recevez votre proforma (USD ou EUR) sous 24 heures avec une estimation de livraison.
4. Versez l'acompte de 50 % et nous préparons votre commande.
`,
  },
  {
    slug: "importer-articles-islamiques-de-turquie-vers-la-france-et-le-senegal",
    lang: "fr",
    title: "Importer des articles islamiques de Turquie vers la France et le Sénégal",
    excerpt: "Documents, paiement, transport et droits d'import : les points à vérifier pour les boutiques en France et en Afrique de l'Ouest.",
    date: "2026-11-25",
    readTime: "5",
    content: `
De nombreuses boutiques en France et en Afrique de l'Ouest achètent tapis de prière, tasbihs et coffrets cadeaux à Istanbul. Les étapes sont proches d'un pays à l'autre, mais les droits et contrôles diffèrent : confirmez les détails avec votre transitaire ou déclarant en douane.

## Documents nécessaires

- **Facture commerciale** (anglais ou français) avec description des produits et code SH.
- **Liste de colisage** avec poids et nombre de cartons.
- **Certificat d'origine** si votre importateur en a besoin pour les droits.

## Droits et taxes

Les droits de douane, la TVA et les frais locaux sont normalement à la charge de l'acheteur à l'arrivée. Le taux dépend du code SH de chaque produit et du pays. Pour les envois importants, certains pays exigent une inspection avant expédition ou un document de suivi de cargaison avant le départ : renseignez-vous tôt auprès de votre importateur ou transitaire.

## Modes de transport

- **Express ou poste :** rapide, adapté aux échantillons et petites commandes.
- **Fret aérien :** pour les envois moyens urgents.
- **Fret maritime (groupage ou conteneur complet) :** le moins cher au kilo pour les grosses commandes, mais plus lent.

Les produits contenant des piles, comme les compteurs tasbih électroniques ou les stylos lecteurs de Coran, ont des règles particulières en transport aérien : prévenez votre transitaire si votre commande en contient.

## Paiement

Nous envoyons une proforma en USD ou en EUR et préparons la commande après un acompte de 50 %. Le solde est réglé avant l'expédition.

## Demander un devis

Envoyez-nous votre pays, la liste de produits et les quantités, nous préparons une proforma et une estimation de livraison.
`,
  },
];

export function postsByLang(lang: IntlLang) {
  return INTL_POSTS.filter((p) => p.lang === lang);
}
export function getPost(lang: IntlLang, slug: string) {
  return INTL_POSTS.find((p) => p.lang === lang && p.slug === slug);
}
