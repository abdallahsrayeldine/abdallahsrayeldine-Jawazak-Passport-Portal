import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase-client";
import { PendingSection } from "./PendingSection";
import { VerifiedSection } from "./VerifiedSection";
import { RejectedSection } from "./RejectedSection";

import bgImage from "../../assets/bg.jpeg";
// background image

export default function Portal({ session }) {
  const [profile, setProfile] = useState(null);
  const [facetecResume, setFacetecResume] = useState({
    skipToPayment: false,
    applicationId: null,
  });

  useEffect(() => {
    const getParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const applicationId = searchParams.get("applicationid");

      if (applicationId) {
        setFacetecResume({ skipToPayment: true, applicationId });
      }
    };

    const loadProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profile_public_view")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!error && data) setProfile(data);
      else {
        console.error("Failed to load profile status", error);
        setProfile(null);
      }
    };

    loadProfile();
    getParams();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "120px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#1a3d7c",
          }}
        >
          Portal
        </h1>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "20px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {profile
            ? `Your account's status is: ${profile?.profile_status}`
            : "Loading account status..."}
        </p>

        <div>
          {profile?.profile_status === "pending_facetec_scan" && (
            <PendingSection />
          )}

          {profile?.profile_status === "verified" && (
            <VerifiedSection
              session={session}
              skipToPayment={facetecResume.skipToPayment}
              applicationId={facetecResume.applicationId}
              profile={profile}
            />
          )}

          {profile?.profile_status === "rejected" && <RejectedSection />}
        </div>
      </div>
    </div>
  );
}
