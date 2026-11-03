/** Referans linkinden (?ref=KOD veya ?kod=KOD) gelen kod tarayıcıda 30 gün saklanır;
 *  ödeme ekranında kupon alanına kendiliğinden uygulanır. */
const KEY = "obrnhomen-ref";
const TTL = 30 * 24 * 60 * 60 * 1000;

export function saveRef(kod: string) {
  try { localStorage.setItem(KEY, JSON.stringify({ kod, at: Date.now() })); } catch {}
}

export function readRef(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { kod, at } = JSON.parse(raw) as { kod?: string; at?: number };
    if (!kod || !at || Date.now() - at > TTL) { localStorage.removeItem(KEY); return null; }
    return kod;
  } catch {
    return null;
  }
}

export function clearRef() {
  try { localStorage.removeItem(KEY); } catch {}
}
