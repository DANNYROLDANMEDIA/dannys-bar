"use client";

import { useState } from "react";
import { cocktails } from "@/lib/cocktails";
import { addOrder } from "@/lib/firebase";

export default function GuestPage() {
  const [search, setSearch] = useState("");
  const [selectedDrink, setSelectedDrink] = useState<typeof cocktails[0] | null>(null);
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [orderSent, setOrderSent] = useState<any>(null);
  const [sending, setSending] = useState(false);

  const filtered = cocktails.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.spirit.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = async () => {
    if (!selectedDrink || !guestName.trim() || sending) return;
    setSending(true);
    const order = {
      drink: selectedDrink.name,
      icon: selectedDrink.icon,
      spirit: selectedDrink.spirit,
      method: selectedDrink.method,
      ingredients: selectedDrink.ingredients,
      guest: guestName.trim(),
      note: note.trim() || null,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      timestamp: Date.now(),
      status: "pending",
    };
    try {
      await addOrder(order);
      setOrderSent(order);
      setSelectedDrink(null);
      setNote("");
      setTimeout(() => setOrderSent(null), 3000);
    } catch (e) {
      console.error("Order failed:", e);
    }
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "36px 20px 16px", position: "relative" }}>
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 250,
          background: "radial-gradient(ellipse,rgba(212,135,46,.14) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 36, marginBottom: 4 }}>🥃</div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif", fontSize: 26, fontWeight: 700,
          background: "linear-gradient(135deg,#ede4d4,#d4872e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Danny&apos;s Bar
        </h1>
        <p style={{ fontSize: 13, color: "rgba(237,228,212,.45)", marginTop: 4 }}>
          Tap a drink to order
        </p>
      </div>

      {/* Name input */}
      <div style={{ padding: "0 20px 10px" }}>
        <input
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          style={{
            width: "100%", padding: "11px 16px", borderRadius: 12,
            border: "1px solid rgba(237,228,212,.12)", background: "rgba(237,228,212,.05)",
            color: "#ede4d4", fontSize: 15, outline: "none", fontFamily: "inherit",
          }}
        />
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 14px", position: "relative" }}>
        <span style={{
          position: "absolute", left: 34, top: 11,
          color: "rgba(237,228,212,.3)", fontSize: 15, pointerEvents: "none",
        }}>⌕</span>
        <input
          placeholder="Search drinks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "11px 16px 11px 40px", borderRadius: 12,
            border: "1px solid rgba(237,228,212,.12)", background: "rgba(237,228,212,.05)",
            color: "#ede4d4", fontSize: 15, outline: "none", fontFamily: "inherit",
          }}
        />
      </div>

      {/* Drink grid */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {filtered.map((c) => {
          const isSelected = selectedDrink?.name === c.name;
          return (
            <div
              key={c.name}
              onClick={() => {
                setSelectedDrink(isSelected ? null : c);
                if (isSelected) setNote("");
              }}
              style={{
                padding: "16px 14px", borderRadius: 14, cursor: "pointer",
                background: isSelected ? "rgba(212,135,46,.15)" : "rgba(237,228,212,.04)",
                border: `1px solid ${isSelected ? "rgba(212,135,46,.5)" : "rgba(237,228,212,.08)"}`,
                transition: "all .2s", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{c.icon}</div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                fontFamily: "'Playfair Display',serif", marginBottom: 3,
              }}>
                {c.name}
              </div>
              <div style={{ fontSize: 11, color: "rgba(237,228,212,.4)" }}>
                {c.spirit} · {c.method}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "rgba(237,228,212,.3)",
        }}>
          No drinks match your search.
        </div>
      )}

      {/* Bottom order bar */}
      {selectedDrink && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 20px 28px",
          background: "linear-gradient(transparent, #1a1410 25%)",
          zIndex: 10,
        }}>
          {/* Note input */}
          <input
            placeholder="Add a note (e.g. extra lime, no salt)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10, marginBottom: 8,
              border: "1px solid rgba(237,228,212,.1)", background: "rgba(237,228,212,.06)",
              color: "#ede4d4", fontSize: 13, outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleOrder}
            disabled={!guestName.trim() || sending}
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "none",
              background: guestName.trim() ? "#d4872e" : "rgba(212,135,46,.3)",
              color: guestName.trim() ? "#1a1410" : "rgba(26,20,16,.5)",
              fontSize: 16, fontWeight: 700,
              cursor: guestName.trim() ? "pointer" : "default",
              fontFamily: "'Playfair Display',serif",
              letterSpacing: ".3px", transition: "all .2s",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending
              ? "Sending..."
              : guestName.trim()
              ? `Order ${selectedDrink.icon} ${selectedDrink.name}`
              : "Enter your name first"}
          </button>
        </div>
      )}

      {/* Confirmation toast */}
      {orderSent && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#2a4a2a", border: "1px solid #7ec8a0", borderRadius: 14,
          padding: "14px 24px", zIndex: 100, textAlign: "center",
          animation: "slideUp .3s ease",
          boxShadow: "0 12px 40px rgba(0,0,0,.5)",
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#7ec8a0" }}>Order sent!</div>
          <div style={{ fontSize: 12, color: "rgba(237,228,212,.5)", marginTop: 2 }}>
            {orderSent.icon} {orderSent.drink} for {orderSent.guest}
          </div>
        </div>
      )}
    </div>
  );
}
