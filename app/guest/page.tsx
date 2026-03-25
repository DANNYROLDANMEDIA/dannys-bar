"use client";

import { useState, useEffect } from "react";
import { cocktails } from "@/lib/cocktails";
import { addOrder, subscribeToOrders, removeOrder } from "@/lib/firebase";

const statusLabels: Record<string, string> = { pending: "In Queue", making: "Being Made", done: "Ready!", canceled: "Canceled" };
const statusPercent: Record<string, number> = { pending: 33, making: 66, done: 100, canceled: 0 };
const statusColor: Record<string, string> = { pending: "#d4872e", making: "#7ab8e0", done: "#7ec8a0", canceled: "#e34b4b" };

const MAX_ACTIVE_DRINKS = 2;

export default function GuestPage() {
  const [search, setSearch] = useState("");
  const [selectedDrink, setSelectedDrink] = useState<typeof cocktails[0] | null>(null);
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [orderSent, setOrderSent] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  // Age verification
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [isUnder21, setIsUnder21] = useState(false);

  // Drink limit popup
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  // Martini options
  const [martiniDirty, setMartiniDirty] = useState(false);
  const [martiniSpirit, setMartiniSpirit] = useState("Gin");
  const [showMartiniOptions, setShowMartiniOptions] = useState(false);

  useEffect(() => {
    if (!guestName.trim()) return;
    const unsub = subscribeToOrders((allOrders) => {
      const mine = allOrders.filter(
        (o: any) => o.guest?.toLowerCase() === guestName.trim().toLowerCase()
      );
      setMyOrders(mine);
    });
    return () => unsub();
  }, [guestName]);

  const filtered = cocktails.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.spirit.toLowerCase().includes(search.toLowerCase())
  );

  // Count active (non-done, non-canceled) orders
  const activeOrderCount = myOrders.filter(
    (o) => o.status === "pending" || o.status === "making"
  ).length;

  const handleSelectDrink = (c: typeof cocktails[0]) => {
    if (selectedDrink?.name === c.name) {
      setSelectedDrink(null);
      setShowMartiniOptions(false);
      return;
    }

    // Check drink limit before selecting
    if (activeOrderCount >= MAX_ACTIVE_DRINKS) {
      setShowLimitPopup(true);
      setTimeout(() => setShowLimitPopup(false), 3500);
      return;
    }

    setSelectedDrink(c);
    setNote("");
    setMartiniDirty(false);
    setMartiniSpirit("Gin");
    setShowMartiniOptions(!!c.hasOptions);
  };

  const handleOrder = async () => {
    if (!selectedDrink || !guestName.trim() || sending) return;

    // Double-check limit
    if (activeOrderCount >= MAX_ACTIVE_DRINKS) {
      setShowLimitPopup(true);
      setTimeout(() => setShowLimitPopup(false), 3500);
      return;
    }

    const isDirty = selectedDrink.hasOptions?.dirty && martiniDirty;
    const chosenIngredients = isDirty && selectedDrink.dirtyIngredients
      ? selectedDrink.dirtyIngredients
      : selectedDrink.ingredients;

    const order: any = {
      drink: selectedDrink.name,
      icon: selectedDrink.icon,
      spirit: selectedDrink.spirit,
      method: selectedDrink.method,
      ingredients: chosenIngredients,
      guest: guestName.trim(),
      note: note.trim() || null,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      timestamp: Date.now(),
      status: "pending",
    };

    if (selectedDrink.hasOptions) {
      if (selectedDrink.hasOptions.dirty) order.dirty = martiniDirty;
      if (selectedDrink.hasOptions.spiritChoice) {
        order.spiritChoice = martiniSpirit;
        order.drink = martiniDirty ? `Dirty Martini (${martiniSpirit})` : `Martini (${martiniSpirit})`;
      }
    }

    setSending(true);
    try {
      await addOrder(order);
      setOrderSent(order);
      setSelectedDrink(null);
      setNote("");
      setShowMartiniOptions(false);
      setTimeout(() => setOrderSent(null), 3000);
    } catch (e) {
      console.error("Order failed:", e);
    }
    setSending(false);
  };

  const handleAcknowledgeCancel = async (key: string) => {
    await removeOrder(key);
  };

  const activeOrders = myOrders.filter((o) =>
    o.status === "pending" || o.status === "making" || o.status === "canceled" ||
    (o.status === "done" && Date.now() - o.timestamp < 120000)
  );

  // ─── AGE VERIFICATION SCREEN ───
  if (ageVerified === null) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 300,
          background: "radial-gradient(ellipse,rgba(212,135,46,.15) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>🥃</div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif", fontSize: 28, fontWeight: 700,
          background: "linear-gradient(135deg,#ede4d4,#d4872e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8,
        }}>
          Danny&apos;s Bar
        </h1>
        <p style={{
          fontSize: 18, fontFamily: "'Playfair Display',serif", color: "#ede4d4",
          marginBottom: 32, textAlign: "center",
        }}>
          Are you 21 years of age or older?
        </p>
        <div style={{
          display: "flex", gap: 14, width: "100%", maxWidth: 300,
        }}>
          <button
            onClick={() => setAgeVerified(true)}
            style={{
              flex: 1, padding: 16, borderRadius: 14,
              border: "1px solid rgba(126,200,160,.4)",
              background: "rgba(126,200,160,.1)", color: "#7ec8a0",
              fontSize: 18, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Playfair Display',serif",
              transition: "all .2s",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => { setAgeVerified(false); setIsUnder21(true); }}
            style={{
              flex: 1, padding: 16, borderRadius: 14,
              border: "1px solid rgba(237,228,212,.15)",
              background: "rgba(237,228,212,.04)", color: "#ede4d4",
              fontSize: 18, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Playfair Display',serif",
              transition: "all .2s",
            }}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  // ─── UNDER 21 SCREEN ───
  if (isUnder21) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20, position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 300,
          background: "radial-gradient(ellipse,rgba(212,135,46,.15) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧃</div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700,
          color: "#ede4d4", marginBottom: 12,
        }}>
          Sorry, no drinks for you!
        </h1>
        <p style={{
          fontSize: 16, color: "rgba(237,228,212,.6)", maxWidth: 300,
          lineHeight: 1.6, marginBottom: 32,
        }}>
          You must be 21 or older to order cocktails. But don&apos;t worry — ask Danny for a juice or soda! 🥤
        </p>
        <button
          onClick={() => { setAgeVerified(null); setIsUnder21(false); }}
          style={{
            padding: "12px 28px", borderRadius: 12,
            border: "1px solid rgba(237,228,212,.15)",
            background: "rgba(237,228,212,.04)", color: "rgba(237,228,212,.5)",
            fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  // ─── MAIN MENU ───
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 140 }}>
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

      {/* My Orders Tracker */}
      {activeOrders.length > 0 && (
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{
            borderRadius: 14, overflow: "hidden",
            background: "rgba(237,228,212,.04)", border: "1px solid rgba(237,228,212,.08)",
            padding: "12px 16px",
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: 2, color: "#d4872e", marginBottom: 10,
            }}>
              Your Orders
            </div>
            {activeOrders.map((order, idx) => {
              const isCanceled = order.status === "canceled";
              const pct = statusPercent[order.status] || 33;
              const color = statusColor[order.status] || "#d4872e";
              const label = statusLabels[order.status] || "In Queue";

              return (
                <div key={order._key || idx} style={{ marginBottom: idx < activeOrders.length - 1 ? 14 : 0 }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20, opacity: isCanceled ? 0.4 : 1 }}>{order.icon}</span>
                      <span style={{
                        fontSize: 14, fontWeight: 600, fontFamily: "'Playfair Display',serif",
                        textDecoration: isCanceled ? "line-through" : "none",
                        opacity: isCanceled ? 0.5 : 1,
                      }}>
                        {order.drink}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: color,
                      textTransform: "uppercase", letterSpacing: 1,
                    }}>
                      {label}
                    </span>
                  </div>

                  {isCanceled ? (
                    <div style={{
                      padding: "10px 14px", borderRadius: 10,
                      background: "rgba(227,75,75,.08)", border: "1px solid rgba(227,75,75,.2)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: 13, color: "#e34b4b" }}>
                        The bartender canceled this order
                      </span>
                      <button
                        onClick={() => handleAcknowledgeCancel(order._key)}
                        style={{
                          padding: "6px 14px", borderRadius: 8, border: "none",
                          background: "#e34b4b", color: "#1a1410",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: "100%", height: 6, borderRadius: 3,
                        background: "rgba(237,228,212,.08)", overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${pct}%`, height: "100%", borderRadius: 3,
                          background: color,
                          transition: "width 0.6s ease, background 0.4s ease",
                        }} />
                      </div>
                      <div style={{
                        display: "flex", justifyContent: "space-between", marginTop: 4,
                        fontSize: 10, color: "rgba(237,228,212,.3)",
                      }}>
                        <span style={{ color: pct >= 33 ? color : undefined }}>Ordered</span>
                        <span style={{ color: pct >= 66 ? color : undefined }}>Making</span>
                        <span style={{ color: pct >= 100 ? color : undefined }}>Ready</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              onClick={() => handleSelectDrink(c)}
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

      {/* Martini Options Popup */}
      {showMartiniOptions && selectedDrink?.hasOptions && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "16px 20px 28px",
          background: "linear-gradient(transparent, #1a1410 15%)",
          zIndex: 10,
        }}>
          <div style={{
            background: "#231d16", border: "1px solid rgba(212,135,46,.25)",
            borderRadius: 16, padding: "20px 18px", marginBottom: 10,
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display',serif",
              textAlign: "center", marginBottom: 16, color: "#ede4d4",
            }}>
              🍸 Customize Your Martini
            </div>

            {selectedDrink.hasOptions.dirty && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: 1.5, color: "rgba(212,135,46,.7)", marginBottom: 8,
                }}>
                  Do you want it Dirty?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[false, true].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => setMartiniDirty(val)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                        border: `1px solid ${martiniDirty === val ? "rgba(212,135,46,.5)" : "rgba(237,228,212,.12)"}`,
                        background: martiniDirty === val ? "rgba(212,135,46,.15)" : "rgba(237,228,212,.04)",
                        color: martiniDirty === val ? "#d4872e" : "#ede4d4",
                        fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                        transition: "all .2s",
                      }}
                    >
                      {val ? "🫒 Dirty" : "✨ Classic"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDrink.hasOptions.spiritChoice && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: 1.5, color: "rgba(212,135,46,.7)", marginBottom: 8,
                }}>
                  Choose your spirit
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {selectedDrink.hasOptions.spiritChoice.map((spirit) => (
                    <button
                      key={spirit}
                      onClick={() => setMartiniSpirit(spirit)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                        border: `1px solid ${martiniSpirit === spirit ? "rgba(212,135,46,.5)" : "rgba(237,228,212,.12)"}`,
                        background: martiniSpirit === spirit ? "rgba(212,135,46,.15)" : "rgba(237,228,212,.04)",
                        color: martiniSpirit === spirit ? "#d4872e" : "#ede4d4",
                        fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                        transition: "all .2s",
                      }}
                    >
                      {spirit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input
              placeholder="Add a note (e.g. extra olives)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, marginBottom: 10,
                border: "1px solid rgba(237,228,212,.1)", background: "rgba(237,228,212,.06)",
                color: "#ede4d4", fontSize: 13, outline: "none", fontFamily: "inherit",
              }}
            />

            <button
              onClick={handleOrder}
              disabled={!guestName.trim() || sending}
              style={{
                width: "100%", padding: 14, borderRadius: 12, border: "none",
                background: guestName.trim() ? "#d4872e" : "rgba(212,135,46,.3)",
                color: guestName.trim() ? "#1a1410" : "rgba(26,20,16,.5)",
                fontSize: 15, fontWeight: 700, cursor: guestName.trim() ? "pointer" : "default",
                fontFamily: "'Playfair Display',serif",
                transition: "all .2s", opacity: sending ? 0.6 : 1,
              }}
            >
              {sending
                ? "Sending..."
                : guestName.trim()
                ? `Order ${martiniDirty ? "Dirty " : ""}Martini (${martiniSpirit})`
                : "Enter your name first"}
            </button>
          </div>
        </div>
      )}

      {/* Regular order bar */}
      {selectedDrink && !showMartiniOptions && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 20px 28px",
          background: "linear-gradient(transparent, #1a1410 25%)",
          zIndex: 10,
        }}>
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

      {/* Drink limit popup */}
      {showLimitPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10,8,6,.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20,
        }}>
          <div style={{
            background: "#231d16", border: "1px solid rgba(212,135,46,.3)",
            borderRadius: 20, padding: "32px 24px", maxWidth: 340,
            textAlign: "center", animation: "slideUp .3s ease",
            boxShadow: "0 24px 80px rgba(0,0,0,.6)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛑</div>
            <h2 style={{
              fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700,
              color: "#d4872e", marginBottom: 8,
            }}>
              You Need To Slow Down!
            </h2>
            <p style={{
              fontSize: 14, color: "rgba(237,228,212,.6)", lineHeight: 1.6,
              marginBottom: 12,
            }}>
              Let&apos;s start with two drinks. Wait for your current orders to be ready before ordering more.
            </p>
            <p style={{
              fontSize: 12, color: "rgba(212,135,46,.5)", lineHeight: 1.6,
              marginBottom: 20, fontStyle: "italic",
            }}>
              Ephesians 5:18 &ldquo;Also, do not get drunk with wine, in which there is debauchery, but keep getting filled with spirit.&rdquo;
            </p>
            <button
              onClick={() => setShowLimitPopup(false)}
              style={{
                padding: "12px 32px", borderRadius: 12, border: "none",
                background: "#d4872e", color: "#1a1410",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Playfair Display',serif",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
