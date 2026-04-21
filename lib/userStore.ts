import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid:       string;
  name:      string;
  email:     string;
  phone?:    string;
  address?:  string;
  createdAt: number;
}

export interface SavedOrder {
  merchant_oid: string;
  items:        { name: string; price: number; qty: number }[];
  total:        number;
  date:         number;
  status:       "success" | "failed" | "pending";
}

/* Kullanıcı profili getir veya oluştur */
export async function getOrCreateUser(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const ref  = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data() as UserProfile;

  const profile: UserProfile = {
    uid,
    name:      data.name  ?? "",
    email:     data.email ?? "",
    createdAt: Date.now(),
  };
  await setDoc(ref, profile);
  return profile;
}

/* Profil güncelle (telefon, adres) */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data as Record<string, unknown>);
}

/* Sipariş kaydet */
export async function saveOrder(uid: string, order: SavedOrder) {
  const ref = doc(db, "users", uid, "orders", order.merchant_oid);
  await setDoc(ref, order);
}

/* Siparişleri getir */
export async function getOrders(uid: string): Promise<SavedOrder[]> {
  const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
  const q    = query(collection(db, "users", uid, "orders"), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as SavedOrder);
}
