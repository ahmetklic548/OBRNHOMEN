declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function gtag(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

interface GaItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export function trackViewItem(product: {
  slug: string;
  name: string;
  price: number;
  category: string;
}) {
  gtag("view_item", {
    currency: "TRY",
    value: product.price,
    items: [
      {
        item_id: product.slug,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      } satisfies GaItem,
    ],
  });
}

export function trackAddToCart(product: {
  slug: string;
  name: string;
  price: number;
  category?: string;
}) {
  gtag("add_to_cart", {
    currency: "TRY",
    value: product.price,
    items: [
      {
        item_id: product.slug,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      } satisfies GaItem,
    ],
  });
}

export function trackBeginCheckout(
  total: number,
  items: { slug: string; name: string; price: number; qty: number }[]
) {
  gtag("begin_checkout", {
    currency: "TRY",
    value: total,
    items: items.map(
      (i): GaItem => ({
        item_id: i.slug,
        item_name: i.name,
        price: i.price,
        quantity: i.qty,
      })
    ),
  });
}

export function trackPurchase(
  transactionId: string,
  total: number,
  items: { slug: string; name: string; price: number; qty: number }[]
) {
  gtag("purchase", {
    transaction_id: transactionId,
    currency: "TRY",
    value: total,
    items: items.map(
      (i): GaItem => ({
        item_id: i.slug,
        item_name: i.name,
        price: i.price,
        quantity: i.qty,
      })
    ),
  });
}
