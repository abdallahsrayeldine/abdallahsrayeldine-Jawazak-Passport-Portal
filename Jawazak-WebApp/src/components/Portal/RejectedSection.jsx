import React, { useState } from "react";

export function RejectedSection({ supportEmail = "support@jawazak.example" }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      "Verification rejected — assistance needed"
    );
    const body = encodeURIComponent(`${message}\n\nUser email: ${email}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section>
      <h3>Verification Rejected</h3>
      <p>
        We're sorry — your verification attempt was rejected. Common reasons
        include mismatched documents, poor image quality, or missing data.
      </p>
      <p>If you'd like help, contact our support team using the form below.</p>

      {sent ? (
        <p>
          Thanks — your email client will open so you can send details to
          support.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Your email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Message
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Contact Support</button>
        </form>
      )}
    </section>
  );
}
