import { createHash } from "crypto";

/** Sunucu içi çağrı anahtarı (paytr-notify → send-sms). Ortam değişkenlerinden türetilir, istemciye gitmez. */
export function smsIcAnahtar() {
  return createHash("sha256").update(`sms:${process.env.PAYTR_MERCHANT_KEY ?? ""}:${process.env.PAYTR_MERCHANT_SALT ?? ""}`).digest("hex");
}
