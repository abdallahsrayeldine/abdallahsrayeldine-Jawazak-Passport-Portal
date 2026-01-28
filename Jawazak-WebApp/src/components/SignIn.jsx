import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import "../styles/signin.css";
import moiLogo from "../assets/moi-logo.jpeg"; // ← NEW

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setEmail("");
    setPassword("");
    window.location.href = "/portal";
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <img
          src={moiLogo}          // ← UPDATED
          alt="MOI Logo"         // ← UPDATED
          className="signin-logo"
        />

        <h2 className="signin-title">تسجيل الدخول</h2>
        <p className="signin-subtitle">النظام الإلكتروني للجوازات اللبنانية</p>

        <form onSubmit={handleSubmit} className="signin-form">
          <label className="signin-label">
            البريد الإلكتروني
            <input
              type="email"
              className="signin-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="signin-label">
            كلمة المرور
            <input
              type="password"
              className="signin-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "جاري تسجيل الدخول…" : "تسجيل الدخول"}
          </button>

          {errorMsg && <p className="signin-error">{errorMsg}</p>}
        </form>

        <p className="signin-footer">
          ليس لديك حساب؟ <Link to="/sign-up">إنشاء حساب</Link>
        </p>
      </div>
    </div>
  );
}