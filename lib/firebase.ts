import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, remove, push, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrFxXUtrcH0zZaNEEBQleMuRQbZxv15tI",
  authDomain: "danny-bar-app.firebaseapp.com",
  databaseURL: "https://danny-bar-app-default-rtdb.firebaseio.com",
  projectId: "danny-bar-app",
  storageBucket: "danny-bar-app.firebasestorage.app",
  messagingSenderId: "381228564748",
  appId: "1:381228564748:web:2aaefd793e96ae14b30929",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ─── Order helpers ───

export function subscribeToOrders(callback: (orders: any[]) => void) {
  const ordersRef = ref(db, "orders");
  return onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const orders = Object.entries(data).map(([key, val]: [string, any]) => ({
      ...val,
      _key: key,
    }));
    orders.sort((a, b) => a.timestamp - b.timestamp);
    callback(orders);
  });
}

export async function addOrder(order: any) {
  const ordersRef = ref(db, "orders");
  const newRef = push(ordersRef);
  await set(newRef, order);
}

export async function updateOrderStatus(key: string, status: string) {
  const orderRef = ref(db, `orders/${key}/status`);
  await set(orderRef, status);
}

export async function removeOrder(key: string) {
  const orderRef = ref(db, `orders/${key}`);
  await remove(orderRef);
}

export async function clearDoneOrders() {
  const ordersRef = ref(db, "orders");
  const snapshot = await get(ordersRef);
  const data = snapshot.val();
  if (!data) return;
  const promises = Object.entries(data)
    .filter(([_, val]: [string, any]) => val.status === "done")
    .map(([key]) => remove(ref(db, `orders/${key}`)));
  await Promise.all(promises);
}
