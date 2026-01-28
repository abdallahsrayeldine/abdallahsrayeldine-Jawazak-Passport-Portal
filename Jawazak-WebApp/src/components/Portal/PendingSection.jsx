import React from "react";


export function PendingSection({ onVerify }) {
  
  const handleVerify = () => {
    const serverUrl = import.meta.env.VITE_FACETEC_SERVER_URL;
    const signupParam = import.meta.env.VITE_FACETEC_SIGNUP;

    let cameFrom = window.location.origin;
    cameFrom = encodeURIComponent(cameFrom);
    const url = `${serverUrl}/?${signupParam}&camefrom=${cameFrom}`;
    window.location.href = url;
  };

  return (
    <section>
      <h3>Verify your identity</h3>
      <p>
        To complete verification we ask for a short scan of your ID and a
        selfie. The verification provider will guide you through the steps.
      </p>
      <ol>
        <li>Click the button below to open the verification service.</li>
        <li>Follow the on-screen instructions to upload/scan your ID.</li>
        <li>Take a selfie when requested, then submit.</li>
        <li>Return here — status will update automatically when processed.</li>
      </ol>
      <button
  onClick={handleVerify}
  style={{
    backgroundColor: "#1a3d7c",
    color: "white",
    padding: "12px 26px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#274f9f")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a3d7c")}
>
  Verify Account
</button>

    </section>
  );
}
