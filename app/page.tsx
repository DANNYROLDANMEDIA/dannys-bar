"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 300,
        background: "radial-gradient(ellipse,rgba(212,135,46,.15) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ fontSize: 56, marginBottom: 12, animation: "fadeIn .6s ease" }}>🥃</div>
      <h1 style={{
        fontFamily: "'Playfair Display',Georgia,serif", fontSize: 32, fontWeight: 700,
        background: "linear-gradient(135deg,#ede4d4,#d4872e)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: 6, animation: "fadeIn .6s ease .1s both",
      }}>
        Danny&apos;s Bar
      </h1>
      <p style={{
        fontSize: 13, color: "rgba(237,228,212,.4)", letterSpacing: 2,
        textTransform: "uppercase", marginBottom: 48, animation: "fadeIn .6s ease .2s both",
      }}>
        Order system
      </p>

      <div style={{
        display: "flex", flexDirection: "column", gap: 14,
        width: "100%", maxWidth: 300, animation: "fadeIn .6s ease .3s both",
      }}>
        <button
          onClick={() => router.push("/guest")}
          style={{
            padding: 18, borderRadius: 14, border: "1px solid rgba(212,135,46,.4)",
            background: "rgba(212,135,46,.1)", color: "#d4872e", fontSize: 16,
            fontWeight: 600, cursor: "pointer", fontFamily: "'Playfair Display',serif",
            transition: "all .2s",
          }}
        >
          🍹 I&apos;m ordering a drink
        </button>
        <button
          onClick={() => router.push("/bartender")}
          style={{
            padding: 18, borderRadius: 14, border: "1px solid rgba(237,228,212,.15)",
            background: "rgba(237,228,212,.04)", color: "#ede4d4", fontSize: 16,
            fontWeight: 600, cursor: "pointer", fontFamily: "'Playfair Display',serif",
            transition: "all .2s",
          }}
        >
          🥃 I&apos;m the bartender
        </button>
      </div>
    </div>
  );
}
