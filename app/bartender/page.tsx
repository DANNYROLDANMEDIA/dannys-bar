"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  subscribeToOrders,
  updateOrderStatus,
  removeOrder,
  clearDoneOrders,
} from "@/lib/firebase";

// Simple beep using Web Audio API
function playAlert() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
    // Vibrate if supported
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } catch (e) {
    // Audio not available
  }
}

export default function BartenderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const prevCountRef = useRef(0);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    const unsub = subscribeToOrders((newOrders) => {
      const pendingCount = newOrders.filter((o: any) => o.status === "pending").length;
      // Alert on new pending orders (not on first load)
      if (!initialLoadRef.current && pendingCount > prevCountRef.current) {
        playAlert();
      }
      initialLoadRef.current = false;
      prevCountRef.current = pendingCount;
      setOrders(newOrders);
    });
    return () => unsub();
  }, []);

  const pending = orders.filter((o) => o.status === "pending");
  const making = orders.filter((o) => o.status === "making");
  const done = orders.filter((o) => o.status === "done");

  const handleStatus = async (key: string, status: string) => {
    await updateOrderStatus(key, status);
  };

  const handleClose = async (key: string) => {
    await removeOrder(key);
    if (expanded === key) setExpanded(null);
  };

  const handleClearDone = async () => {
    await clearDoneOrders();
  };

  const statusAction: Record<string, string> = { pending: "making", making: "done" };
  const statusLabel: Record<string, string> = { pending: "Start Making", making: "Mark Done" };
  const statusColors: Record<string, any> = {
    pending: { bg: "rgba(212,135,46,.12)", border: "rgba(212,135,46,.4)", text: "#d4872e" },
    making: { bg: "rgba(100,180,255,.12)", border: "rgba(100,180,255,.4)", text: "#7ab8e0" },
  };

  const renderOrder = (order: any) => {
    const colors = statusColors[order.status];
    const isExpanded = expanded === order._key;

    return (
      <div
        key={order._key}
        style={{
          borderRadius: 12, marginBottom: 8, overflow: "hidden",
          background: "rgba(237,228,212,.04)",
          border: "1px solid rgba(237,228,212,.08)",
        }}
      >
        {/* Header row */}
        <div
          onClick={() => setExpanded(isExpanded ? null : order._key)}
          style={{
            padding: "14px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{order.icon}</span>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 600,
                fontFamily: "'Playfair Display',serif",
              }}>
                {order.drink}
              </div>
              <div style={{ fontSize: 13, color: "rgba(237,228,212,.5)", marginTop: 2 }}>
                <span style={{ color: "#d4872e", fontWeight: 600 }}>{order.guest}</span>
                {" · "}{order.time}
              </div>
              {order.note && (
                <div style={{
                  fontSize: 12, color: "#a8b545", marginTop: 3, fontStyle: "italic",
                }}>
                  &ldquo;{order.note}&rdquo;
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {order.status !== "done" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatus(order._key, statusAction[order.status]);
                }}
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.bg, color: colors.text,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                {statusLabel[order.status]}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(order._key);
                }}
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  border: "1px solid rgba(126,200,160,.4)",
                  background: "rgba(126,200,160,.1)", color: "#7ec8a0",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                ✕ Close
              </button>
            )}
            <span style={{
              color: "rgba(237,228,212,.2)", fontSize: 16,
              transition: "transform .2s",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
            }}>
              ›
            </span>
          </div>
        </div>

        {/* Expanded ingredients */}
        {isExpanded && (
          <div style={{ padding: "0 16px 14px", borderTop: "1px solid rgba(237,228,212,.06)" }}>
            {order.method && (
              <div style={{
                display: "inline-block", padding: "3px 8px", borderRadius: 6,
                marginTop: 10, marginBottom: 8,
                fontSize: 11, fontWeight: 500,
                background: "rgba(212,135,46,.1)", color: "#d4872e",
              }}>
                {order.method}
              </div>
            )}
            {(order.ingredients || []).map((ing: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "baseline", padding: "5px 0",
                  borderBottom:
                    i < (order.ingredients || []).length - 1
                      ? "1px solid rgba(237,228,212,.05)"
                      : "none",
                }}
              >
                <span style={{
                  fontWeight: 600, color: "#d4872e",
                  minWidth: 75, fontSize: 14,
                }}>
                  {ing.amount}
                </span>
                <span style={{ fontSize: 14, color: "rgba(237,228,212,.7)" }}>
                  {ing.item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "36px 20px 16px", position: "relative" }}>
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 250,
          background: "radial-gradient(ellipse,rgba(212,135,46,.14) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700,
          background: "linear-gradient(135deg,#ede4d4,#d4872e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Bartender View
        </h1>
        <p style={{ fontSize: 13, color: "rgba(237,228,212,.45)", marginTop: 4 }}>
          {pending.length} pending · {making.length} in progress · {done.length} done
        </p>
      </div>

      <div style={{ padding: "0 20px 40px", maxWidth: 500, margin: "0 auto" }}>
        {/* Pending */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: 2, color: "#d4872e", marginBottom: 10,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: "#d4872e",
                display: "inline-block", animation: "pulse 1.5s infinite",
              }} />
              New Orders ({pending.length})
            </div>
            {pending.map(renderOrder)}
          </div>
        )}

        {/* Making */}
        {making.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: 2, color: "#7ab8e0", marginBottom: 10,
            }}>
              🍸 In Progress ({making.length})
            </div>
            {making.map(renderOrder)}
          </div>
        )}

        {/* Done */}
        {done.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 10,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: 2, color: "#7ec8a0",
              }}>
                ✅ Done ({done.length})
              </div>
              <button
                onClick={handleClearDone}
                style={{
                  padding: "4px 10px", borderRadius: 6,
                  border: "1px solid rgba(237,228,212,.12)",
                  background: "transparent", color: "rgba(237,228,212,.4)",
                  fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Clear all
              </button>
            </div>
            {done.map(renderOrder)}
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            color: "rgba(237,228,212,.25)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍸</div>
            <div style={{ fontSize: 15 }}>No orders yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Orders will appear here in real-time
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
