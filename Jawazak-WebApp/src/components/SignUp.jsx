import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { isPasswordValid } from '../utils/validation';
import "../styles/signup.css";
import moiLogo from "../assets/moi-logo.jpeg";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    // Client-side password validation
    const { valid, reasons } = isPasswordValid(password);
    if (!valid) {
      setLoading(false);
      setErrorMsg('Password must be at least 8 characters and include uppercase, lowercase, number and special character.');
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");

    alert("تم إنشاء الحساب بنجاح! الرجاء التحقق من بريدك الإلكتروني.");
    // Use router navigation instead of direct window location change (test-friendly)
    try {
      navigate('/sign-in');
    } catch (e) {
      // fallback for environments without router
      try {
        window.location.href = "/sign-in";
      } catch (err) {
        // ignore in tests
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">

        <img src={moiLogo} alt="MOI Logo" className="signup-logo" />

        <h2 className="signup-title">إنشاء حساب</h2>
        <p className="signup-subtitle">النظام الإلكتروني للجوازات اللبنانية</p>

        <form onSubmit={handleSubmit} className="signup-form">

          <label className="signup-label">
            الاسم الأول
            <input
              type="text"
              value={firstName}
              className="signup-input"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label className="signup-label">
            اسم العائلة
            <input
              type="text"
              value={lastName}
              className="signup-input"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label className="signup-label">
            البريد الإلكتروني
            <input
              type="email"
              className="signup-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="signup-label">
            كلمة المرور
            <input
              type="password"
              className="signup-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "جاري إنشاء الحساب…" : "إنشاء حساب"}
          </button>

          {errorMsg && <p className="signup-error">{errorMsg}</p>}
        </form>

        <p className="signup-footer">
          لديك حساب بالفعل؟ <Link to="/sign-in">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}