import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client.jsx";
import "./PreviousApplications.css";

export default function PreviousApplications({ profile }) {
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uniqueUserId = profile?.unique_user_id;
    if (!uniqueUserId) {
      setApplications([]);
      return;
    }

    let isMounted = true;
    async function fetchApplications() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("all_application_submission_view")
        .select("*")
        .eq("unique_user_id", uniqueUserId)
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) {
        setError(error.message || "Failed to load previous applications.");
        setApplications([]);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    }

    fetchApplications();
    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (!profile) {
    return null;
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  }

  function statusClass(status) {
    const s = (status || "").toString().toLowerCase();
    if (s.includes("pending")) return "status-pending";
    if (s.includes("verified") || s.includes("approved"))
      return "status-verified";
    if (s.includes("reject") || s.includes("rejected"))
      return "status-rejected";
    return "status-unknown";
  }

  return (
    <div className="previous-applications">
      <h3>Previous Applications</h3>

      {loading && <div className="loading">Loading previous applications…</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && applications?.length === 0 && (
        <div className="empty">No previous applications found.</div>
      )}

      {!loading && !error && applications?.length > 0 && (
        <ul className="app-list">
          {applications.map((app) => {
            const status = app.application_status ?? app.status ?? "Unknown";
            return (
              <li
                className="app-card"
                key={app.id ?? app.uuid ?? app.application_id}
              >
                <div className="app-card-header">
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    {(app.full_name ??
                      `${app.first_name ?? ""} ${
                        app.last_name ?? ""
                      }`.trim()) ||
                      "Unnamed"}
                  </div>
                  <div className={`status-badge ${statusClass(status)}`}>
                    {status}
                  </div>
                </div>

                <div className="app-field">
                  <span className="field-label">ID:</span>
                  <span>{app.id ?? app.application_id ?? "—"}</span>
                </div>

                {app.uuid && (
                  <div className="app-field">
                    <span className="field-label">UUID:</span>
                    <span>{app.uuid}</span>
                  </div>
                )}

                <div className="app-field">
                  <span className="field-label">Created:</span>
                  <span>{formatDate(app.created_at ?? app.submitted_at)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
