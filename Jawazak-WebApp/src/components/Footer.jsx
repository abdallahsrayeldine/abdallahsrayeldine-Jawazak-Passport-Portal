import React from "react";
import { Link } from "react-router-dom";
import moiLogo from "../assets/moi-logo.jpeg";

export default function Footer({ lang = "en" }) {
  return (
    <footer
      style={{
        background: "#091a36",
        color: "white",
        padding: "60px 20px 30px",
        marginTop: "80px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "50px",
        }}
      >
        {/* Branding */}
        <div style={{ maxWidth: "300px" }}>
          <img
            src={moiLogo}
            alt="MOI Logo"
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "14px",
              objectFit: "cover",
              marginBottom: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          />

          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "10px",
              letterSpacing: "0.5px",
            }}
          >
            {lang === "en" ? "Jawazak" : "جوازك"}
          </h2>

          <p
            style={{
              color: "white",   // ←← جعل النص أبيض بالكامل
              opacity: 1,
              lineHeight: "1.7",
              fontSize: "15px",
            }}
          >
            {lang === "en"
              ? "A secure digital identity platform offering citizens modern identity and passport services."
              : "منصة هوية رقمية آمنة توفر للمواطنين خدمات الهوية وجواز السفر بشكل حديث وسلس."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            style={{
              fontSize: "19px",
              fontWeight: "600",
              marginBottom: "14px",
              borderBottom: "2px solid #2e4a7b",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            {lang === "en" ? "Quick Links" : "روابط سريعة"}
          </h3>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "8px",
              fontSize: "15px",
            }}
          >
            <li>
              <Link
                to="/"
                style={{ opacity: 0.85, transition: "0.3s", color: "white" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
              >
                {lang === "en" ? "Home" : "الرئيسية"}
              </Link>
            </li>

            <li>
              <Link
                to="/chat-with-ai"
                style={{ opacity: 0.85, transition: "0.3s", color: "white" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
              >
                {lang === "en" ? "Chat with AI" : "الدردشة مع الذكاء الاصطناعي"}
              </Link>
            </li>

            <li>
              <Link
                to="/sign-in"
                style={{ opacity: 0.85, transition: "0.3s", color: "white" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
              >
                {lang === "en" ? "Sign In" : "تسجيل الدخول"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div style={{ minWidth: "220px" }}>
          <h3
            style={{
              fontSize: "19px",
              fontWeight: "600",
              marginBottom: "14px",
              borderBottom: "2px solid #2e4a7b",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            {lang === "en" ? "Contact" : "تواصل معنا"}
          </h3>

          <p style={{ opacity: 0.85, marginBottom: "6px" }}>
            {lang === "en" ? "Support Email:" : "البريد الإلكتروني للدعم:"}
          </p>

          <a
            href="mailto:support@jawazak.com"
            style={{
              color: "#9ec7ff",
              fontWeight: "600",
              letterSpacing: "0.3px",
            }}
          >
            support@jawazak.com
          </a>
        </div>
      </div>

      <hr
        style={{
          borderColor: "rgba(255,255,255,0.15)",
          margin: "35px 0 20px",
        }}
      />

      <p
        style={{
          textAlign: "center",
          opacity: 0.6,
          fontSize: "14px",
          letterSpacing: "0.3px",
        }}
      >
        © {new Date().getFullYear()}{" "}
        {lang === "en"
          ? "Jawazak. All rights reserved."
          : "جوازك. جميع الحقوق محفوظة."}
      </p>
    </footer>
  );
}