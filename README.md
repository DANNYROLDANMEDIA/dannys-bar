# 🥃 Danny's Bar — Party Drink Order System

Guests scan a QR code, browse your cocktail menu, and place orders.  
You see every order in real-time on your phone with the full recipe.

---

## Quick Setup (15 minutes)

### Step 1: Create a Firebase project (free)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** → name it `dannys-bar` → continue
3. Skip Google Analytics → **Create Project**
4. In the left sidebar, click **Build → Realtime Database**
5. Click **Create Database** → choose your region → **Start in test mode** → Enable
6. In the left sidebar, click the **gear icon → Project Settings**
7. Scroll down to **"Your apps"** → click the **web icon** `</>`
8. Name it `dannys-bar` → **Register app**
9. You'll see a `firebaseConfig` object — **copy those values**

### Step 2: Paste your Firebase config

Open `lib/firebase.ts` and replace the placeholder values:

```ts
const firebaseConfig = {
  apiKey: "AIzaSy...",            // your actual key
  authDomain: "dannys-bar.firebaseapp.com",
  databaseURL: "https://dannys-bar-default-rtdb.firebaseio.com",
  projectId: "dannys-bar",
  storageBucket: "dannys-bar.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

### Step 3: Deploy to Vercel

1. Create a new GitHub repo: `dannys-bar`
2. Push this project to it:
   ```bash
   cd dannys-bar
   git init
   git add .
   git commit -m "Danny's Bar v1"
   git remote add origin https://github.com/YOUR_USERNAME/dannys-bar.git
   git push -u origin main
   ```
3. Go to [Vercel](https://vercel.com) → **New Project** → Import your `dannys-bar` repo
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy** — done in ~60 seconds

### Step 4: Generate your QR code

1. Your app is now live at `https://dannys-bar.vercel.app` (or whatever Vercel assigns)
2. For guests, the order page is: `https://your-url.vercel.app/guest`
3. Your bartender dashboard is: `https://your-url.vercel.app/bartender`
4. Generate a QR code for the guest URL at [qr-code-generator.com](https://www.qr-code-generator.com/) or any free QR tool
5. Print it or display it at your party!

---

## How It Works

| Screen | URL | Who sees it |
|--------|-----|-------------|
| Splash | `/` | Anyone — choose guest or bartender |
| Guest menu | `/guest` | Your guests (QR code points here) |
| Bartender | `/bartender` | You |

**Guest flow:** Enter name → tap a drink → add optional note → order  
**Bartender flow:** See orders arrive → tap to expand recipe → Start Making → Mark Done → Close ticket

- Sound alert + vibration when new orders come in
- Guests can add notes like "extra lime" or "no salt"
- You see full ingredients for every order
- Close tickets individually or clear all done orders

---

## App Icon (optional)

For a proper home screen icon, create a 512x512 PNG of the 🥃 emoji on a dark background and save it as:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

---

## Firebase Security (optional, for after your first party)

The database starts in **test mode** (open for 30 days). For longer use, update your Realtime Database rules to:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    }
  }
}
```

This keeps orders readable/writable by anyone (fine for a party app on your own URL).

---

## Adding or Editing Drinks

All cocktail recipes are in `lib/cocktails.ts`. Just edit that file, push to GitHub, and Vercel auto-deploys.
