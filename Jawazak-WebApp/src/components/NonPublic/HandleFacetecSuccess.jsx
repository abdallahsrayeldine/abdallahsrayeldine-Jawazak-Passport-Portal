import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HandleFacetecSuccess({ session }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const ranRef = useRef(false); // To prevent multiple executions

  const searchParams = new URLSearchParams(location.search);
  const facetecSuccess = searchParams.get("facetecSuccess"); // "true" or "false"
  const mode = searchParams.get("mode"); // "signup" or "signin"
  const externalDatabaseRefID = searchParams.get("externalDatabaseRefID"); // UUID
  const applicationId = searchParams.get("applicationid"); // "none" or the actual id

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (
      
      !facetecSuccess ||
     
      !mode ||
     
      !externalDatabaseRefID ||
     
      !session?.access_token ||
     
      !session.user?.id
    
    )
      return;

    const logSigning = async () => {
      try {
        setLoading(true);
        await fetch(import.meta.env.VITE_EDGE_FUNCTION_LOG_SIGNUP, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            auth_user_id: session.user.id,
            mode,
            externalDatabaseRefID,
          }),
        });

        console.log(
          "Navigating to portal with applicationId:------------------------------",
          applicationId
        );

        if (applicationId && applicationId !== "none") {  
          navigate(`/portal/?applicationid=${applicationId}`);
        } else {
          navigate("/portal");
        }
      } catch (err) {
        console.error("Error logging signing:", err);
        setLoading(false);
      }
    };

    if (facetecSuccess === "true") logSigning();
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.25)",
            pointerEvents: "auto",
          }}
          aria-hidden={!loading}
        >
          <button
            disabled
            style={{
              padding: "12px 20px",
              fontSize: 16,
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "not-allowed",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Processing...
          </button>
        </div>
      )}

      <p>Processing... {session?.user?.id}</p>
    </>
  );
}

export default HandleFacetecSuccess;