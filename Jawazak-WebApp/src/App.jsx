import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Portal from "./components/Portal/Portal";
import ChatWithAI from "./components/ChatWithAI";
import HandleFacetecSuccess from "./components/NonPublic/HandleFacetecSuccess";
import PaymentSuccess from "./components/Portal/PaymentSuccess";
import PaymentCancelled from "./components/Portal/PaymentCancelled";
import DocumentVerificationStatus from "./components/Portal/DocumentVerificationStatus";
import Footer from "./components/Footer";
import moiLogo from "./assets/moi-logo.jpeg";
import { supabase } from "./supabase-client";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");
  const navigate = useNavigate();

  const fetchSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    } catch (err) {
      console.error("Error fetching session:", err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      try {
        if (typeof listener === "function") {
          listener();
        } else if (listener?.subscription?.unsubscribe) {
          listener.subscription.unsubscribe();
        } else if (listener?.data?.subscription?.unsubscribe) {
          listener.data.subscription.unsubscribe();
        }
      } catch (err) {
        // ignore cleanup errors
      }
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error", err);
    } finally {
      setSession(null);
      navigate("/");
    }
  };

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #3b82f6",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {/* ===================== NAVBAR ===================== */}
      <nav
        className="app-nav"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          height: "70px",
          background: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          zIndex: 1000,
        }}
      >
        {/* LEFT SIDE: Logo + Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={moiLogo}
            alt="MOI Logo"
            style={{ width: "55px", height: "55px", objectFit: "contain" }}
          />

          {session?.user?.email && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#003366",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                {session.user.email[0].toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#003366",
                }}
              >
                {session.user.email}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <Link
            to="/"
            style={{ fontSize: "18px", fontWeight: "600", color: "#1a3d7c" }}
          >
            {lang === "en" ? "Home" : "الرئيسية"}
          </Link>
          <Link
            to="/chat-with-ai"
            style={{ fontSize: "18px", fontWeight: "600", color: "#1a3d7c" }}
          >
            {lang === "en" ? "Chat with AI" : "الدردشة مع الذكاء الاصطناعي"}
          </Link>
          <span
            onClick={() => scrollToSection("about")}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a3d7c",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "About Jawazak" : "عن جوازك"}
          </span>
          <span
            onClick={() => scrollToSection("apply")}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a3d7c",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "How to Apply" : "كيفية التقديم"}
          </span>

          {!session && (
            <Link
              to="/sign-in"
              style={{ fontSize: "18px", fontWeight: "600", color: "#1a3d7c" }}
            >
              {lang === "en" ? "Sign In" : "تسجيل الدخول"}
            </Link>
          )}

          {session && (
            <span
              onClick={logout}
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "crimson",
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Log Out" : "تسجيل الخروج"}
            </span>
          )}
        </div>
      </nav>

      {/* ===================== PAGE CONTENT ===================== */}
      <main style={{ paddingTop: "120px", padding: "24px" }}>
        <Routes>
          <Route path="/" element={<Home session={session} lang={lang} />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/chat-with-ai" element={<ChatWithAI />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route
            path="/document-verification/:applicationId"
            element={<DocumentVerificationStatus />}
          />

          {session && (
            <>
              <Route path="/portal" element={<Portal session={session} />} />
              <Route
                path="/facetec-done"
                element={<HandleFacetecSuccess session={session} />}
              />
            </>
          )}

          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Go to Home
                </button>
              </div>
            }
          />
        </Routes>
      </main>

      {/* ===================== FOOTER ===================== */}
      <Footer lang={lang} />
    </>
  );
}

export default App;
