import React from "react";

export function ApplicationInformation({ setApplicationStarted }) {
  return (
    <section>
      <p>You can now start your passport application.</p>
      <ol>
        <li>Gather required documents: ID, photos, proof of address.</li>
        <li>Fill the passport application form (click below to start).</li>
        <li>Upload scanned documents when prompted.</li>
        <li>Submit payment and await confirmation.</li>
      </ol>
      <button onClick={() => setApplicationStarted(true)}>
        Start Passport Application
      </button>
    </section>
  );
}
