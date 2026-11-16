declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// GA4 olay adı → Meta Pixel standart olay adı
const META_EVENTS: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
};

function fbqTrack(name: string, params?: Record<string, unknown>) {
  const metaName = META_EVENTS[name];
  if (!metaName || typeof window === "undefined" || typeof window.fbq !== "function") return;
  const items = (params?.items as GaItem[] | undefined) ?? [];
  const data = {
    currency: params?.currency ?? "TRY",
    value: params?.value,
    content_type: "product",
    content_ids: items.map((i) => i.item_id),
    contents: items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
    num_items: items.reduce((a, i) => a + (i.quantity || 0), 0),
  };
  const eventID = typeof params?.transaction_id === "string" ? { eventID: params.transaction_id } : undefined;
  if (eventID) window.fbq("track", metaName, data, eventID);
  else window.fbq("track", metaName, data);
}

function gtag(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
  fbqTrack(name, params);
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
