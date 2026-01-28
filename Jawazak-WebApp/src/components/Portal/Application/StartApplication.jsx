import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import PageGeneralInfo from "./PageGeneralInfo";
import PageMoreInfo from "./PageMoreInfo";
import PageUploadDocuments from "./PageUploadDocuments";

export function StartApplication({
  setApplicationStarted,
  session,
  skipToPayment = false,
  applicationIdFromPortal = null,
}) {
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [applicationId, setApplicationId] = useState(null); // Store database ID

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    fathers_name: "",
    mothers_name: "",
    place_of_birth: "",
    date_of_birth: "",
    gender: "",
    place_of_registration: "",
    registration_number: "",
    governorate: "",
    district: "",
    town: "",
    street: "",
    phone_mobile: "",
    phone_home: "",
    document_lebanese_id: null,
    document_civil_status: null,
    document_passport_photo: null,
    document_old_passport: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const uploadDocuments = async () => {
    try {
      const paths = {
        idPath: null,
        civilPath: null,
        passportPath: null,
        oldPassportPath: null,
      };

      const uploadFile = async (file, bucketName, pathPrefix) => {
        if (!file) return null;

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(`${pathPrefix}/${fileName}`, file);

        if (error) throw error;
        return data.path;
      };

      const [idPath, civilPath, passportPath, oldPassportPath] =
        await Promise.all([
          uploadFile(form.document_lebanese_id, "lebanese_id", session.user.id),
          uploadFile(
            form.document_civil_status,
            "civil_status",
            session.user.id
          ),
          uploadFile(
            form.document_passport_photo,
            "passport_photo",
            session.user.id
          ),
          uploadFile(
            form.document_old_passport,
            "old_passport",
            session.user.id
          ),
        ]);

      return {
        idPath,
        civilPath,
        passportPath,
        oldPassportPath,
      };
    } catch (error) {
      console.error("Error uploading documents:", error);
      throw new Error("Failed to upload documents. Please try again.");
    }
  };

  const uploadForm = async () => {
    try {
      const document_paths = await uploadDocuments();

      const response = await fetch(
        import.meta.env.VITE_EDGE_FUNCTION_UPLOAD_PASSPORT_APPLICATION,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            auth_user_id: session.user.id,
            application_data: form,
            document_paths,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      const result = await response.json();
      setApplicationId(result.application_id);
      return result.application_id;
    } catch (error) {
      console.error("Error uploading form:", error);
      throw error;
    }
  };

  const handlePayment = async (applicationId) => {
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

      const response = await fetch(
        import.meta.env.VITE_EDGE_FUNCTION_CREATE_CHECKOUT_SESSION,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
            application_id: applicationId,
            site_url: siteUrl,
          }),
        }
      );

      const data = await response.json();
      console.log("Stripe checkout response:", data);

      if (!response.ok || !data.checkout_url) {
        throw new Error(
          data.error || "Failed to create Stripe checkout session"
        );
      }

      return data.checkout_url;
    } catch (error) {
      console.error("❌ Error creating checkout session:", error);
      throw error;
    }
  };

  const verifyWithFaceTec = async (applicationId) => {
    const serverUrl = import.meta.env.VITE_FACETEC_SERVER_URL;
    const signinParam = import.meta.env.VITE_FACETEC_SIGNIN;
    
    let cameFrom = window.location.origin;
    cameFrom = encodeURIComponent(cameFrom);
    
    const url = `${serverUrl}/?${signinParam}&camefrom=${cameFrom}&applicationid=${applicationId}`;
    window.location.href = url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {

      const dbApplicationId = await uploadForm();

      setApplicationId(dbApplicationId);

      await verifyWithFaceTec(dbApplicationId);

    } catch (error) {
      console.error("🔥 Submission error:", error);
      setError(error.message || "An error occurred during submission");
      alert(`❌ Error: ${error.message || "Please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const resume = async () => {
      const idToUse =
        applicationIdFromPortal ||
        applicationId ||
        new URLSearchParams(window.location.search).get("application_id");
      if (!idToUse) {
        setError("Missing application id to resume payment.");
        return;
      }

      try {
        setIsSubmitting(true);
        const checkoutUrl = await handlePayment(idToUse);
        window.location.href = checkoutUrl;
      } catch (err) {
        console.error("Error resuming payment:", err);
        setError(err.message || "Failed to resume payment");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (skipToPayment) resume();
  }, [skipToPayment]);

  return (
    <>
      <button onClick={() => setApplicationStarted(false)} style={{ display: "none" }}>
        Back to Instructions
      </button> 

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: 20 }}>
        <h2>Application Submission</h2>

        {error && (
          <div
            style={{
              color: "#ef4444",
              backgroundColor: "#fee2e2",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        {page === 1 && (
          <PageGeneralInfo
            form={form}
            handleChange={handleChange}
            next={() => setPage(2)}
          />
        )}
        {page === 2 && (
          <PageMoreInfo
            form={form}
            handleChange={handleChange}
            next={() => setPage(3)}
            back={() => setPage(1)}
          />
        )}
        {page === 3 && (
          <PageUploadDocuments
            form={form}
            handleChange={handleChange}
            back={() => setPage(2)}
            submit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </>
  );
}
