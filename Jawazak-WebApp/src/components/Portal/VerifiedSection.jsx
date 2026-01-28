import React, { useState, useEffect } from "react";
import { ApplicationInformation } from "./ApplicationInformation";
import { StartApplication } from "./Application/StartApplication";
import PreviousApplications from "./PreviousApplications";

export function VerifiedSection({
  session,
  skipToPayment = false,
  applicationId = null,
  profile,
}) {
  const [applicationStarted, setApplicationStarted] = useState(false);

  useEffect(() => {
    if (skipToPayment) setApplicationStarted(true);
  }, [skipToPayment]);

  return (
    <>
      {applicationStarted ? (
        <StartApplication
          setApplicationStarted={setApplicationStarted}
          session={session}
          skipToPayment={skipToPayment}
          applicationIdFromPortal={applicationId}
        />
      ) : (
        <ApplicationInformation setApplicationStarted={setApplicationStarted} />
      )}

      <PreviousApplications profile={profile} />
    </>
  );
}
