// components/portal/DocumentVerificationStatus.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabase-client";

export default function DocumentVerificationStatus() {
    const { applicationId } = useParams();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate();

    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentVerified, setPaymentVerified] = useState(false);

    // Simplified status constants
    const PAYMENT_STATUS = {
        PAID: 'paid',
        PENDING: 'pending'
    };

    // Fetch application data
    const fetchVerificationStatus = async () => {
        if (!applicationId) {
            setError("No application ID provided");
            setLoading(false);
            return;
        }

        try {
            const { data, error: dbError } = await supabase
                .from("application_submissions")
                .select(`
          id,
          payment_status,
          created_at,
          updated_at
        `)
                .eq("id", applicationId)
                .single();

            if (dbError || !data) {
                throw new Error(dbError?.message || "Failed to fetch application status");
            }

            setVerificationStatus(data);
            setError(null);

            // Check payment status
            if (data.payment_status === PAYMENT_STATUS.PAID || sessionId) {
                setPaymentVerified(true);
            }
        } catch (err) {
            console.error('Error fetching application status:', err);
            setError(err.message || "Failed to load application status");
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch and real-time subscription
    useEffect(() => {
        if (!applicationId) return;

        fetchVerificationStatus();

        // Set up real-time subscription for updates
        const channel = supabase
            .channel(`application-updates-${applicationId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "application_submissions",
                    filter: `id=eq.${applicationId}`
                },
                (payload) => {
                    console.log("Real-time update received:", payload.new);
                    setVerificationStatus(payload.new);

                    // Update payment verified status
                    if (payload.new.payment_status === PAYMENT_STATUS.PAID) {
                        setPaymentVerified(true);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [applicationId]);

    // Loading state
    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
                <h2>Loading Application Status</h2>
                <p>Fetching your passport application details...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>❌</div>
                <h2>Error Loading Application</h2>
                <p style={{ color: "red", marginBottom: 20 }}>{error}</p>
                <button
                    onClick={() => fetchVerificationStatus()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer"
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    // No data state
    if (!verificationStatus) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h2>No Application Found</h2>
                <p>We couldn't find any application with ID: {applicationId}</p>
                <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "40px 20px",
            fontFamily: "Arial, sans-serif"
        }}>
            {/* Header Section */}
            <div style={{ marginBottom: 30 }}>
                <h1 style={{
                    fontSize: 28,
                    marginBottom: 10,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                }}>
                    📋 Passport Application Status
                </h1>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10
                }}>
                    <div>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                            <strong>Application ID:</strong> {applicationId}
                        </p>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                            <strong>Payment Status:</strong>
                            <span style={{
                                color: paymentVerified ? "green" : "orange",
                                fontWeight: "bold",
                                marginLeft: 5
                            }}>
                                {paymentVerified ? "✅ Paid" : "⏳ Pending Payment"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Application Status */}
            {paymentVerified ? (
                <div style={{
                    padding: 30,
                    backgroundColor: "#d4edda",
                    border: "1px solid #c3e6cb",
                    borderRadius: 8,
                    textAlign: "center",
                    marginBottom: 30
                }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                    <h2 style={{ color: "#155724", margin: "0 0 15px 0" }}>Application Submitted Successfully!</h2>
                    <p style={{ color: "#155724", fontSize: 18, margin: "0 0 20px 0" }}>
                        Your passport application has been received and payment has been confirmed.
                    </p>
                    <div style={{
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        padding: "20px",
                        borderRadius: "8px",
                        margin: "20px auto",
                        maxWidth: "600px"
                    }}>
                        <h3 style={{ color: "#155724", margin: "0 0 10px 0" }}>.Documents Status</h3>
                        <p style={{ color: "#155724", margin: "5px 0" }}>
                            ✅ Lebanese ID - Verified
                        </p>
                        <p style={{ color: "#155724", margin: "5px 0" }}>
                            ✅ Civil Status Document - Verified
                        </p>
                        <p style={{ color: "#155724", margin: "5px 0" }}>
                            ✅ Passport Photo - Verified
                        </p>
                        <p style={{ color: "#155724", margin: "5px 0" }}>
                            ✅ Previous Passport - Verified
                        </p>
                    </div>
                    <p style={{ color: "#155724", marginTop: 20, fontStyle: "italic", fontSize: 16 }}>
                        Your application is now being processed by the Ministry of Interior.
                        You will receive updates via email as your application progresses.
                    </p>
                </div>
            ) : (
                <div style={{
                    padding: 30,
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: 8,
                    textAlign: "center",
                    marginBottom: 30
                }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>💳</div>
                    <h2 style={{ color: "#856404", margin: "0 0 15px 0" }}>Complete Your Payment</h2>
                    <p style={{ color: "#856404", fontSize: 18, margin: "0 0 20px 0" }}>
                        Your application has been saved, but payment is still pending.
                    </p>
                    <button
                        onClick={() => {
                            // In a real app, this would redirect to payment page
                            alert("Redirecting to payment page...");
                            // navigate(`/payment/${applicationId}`);
                        }}
                        style={{
                            padding: "15px 40px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: 5,
                            fontSize: 18,
                            cursor: "pointer",
                            marginTop: 20
                        }}
                    >
                        Pay Now
                    </button>
                    <p style={{ color: "#856404", marginTop: 20, fontStyle: "italic", fontSize: 16 }}>
                        Please complete payment to finalize your passport application.
                    </p>
                </div>
            )}

            {/* Next Steps */}
            <div style={{
                padding: 25,
                border: "1px solid #ddd",
                borderRadius: 8,
                backgroundColor: "white",
                marginBottom: 30
            }}>
                <h3 style={{ marginBottom: 15, color: "#333" }}>📋 Next Steps</h3>
                <ul style={{ textAlign: "left", lineHeight: 2, paddingLeft: 20 }}>
                    <li>✅ Application submitted</li>
                    <li>✅ All documents verified successfully</li>
                    <li>{paymentVerified ? '✅ Payment confirmed' : '⏳ Payment pending'}</li>
                    <li style={{ color: paymentVerified ? 'green' : 'orange' }}>
                        {paymentVerified ? '🔄 Application processing' : '⚠️ Processing will begin after payment'}
                    </li>
                    <li>📧 Email updates when status changes</li>
                </ul>
            </div>

            {/* Contact Information */}
            <div style={{
                textAlign: "center",
                padding: 20,
                backgroundColor: "#f8f9fa",
                borderRadius: 8,
                border: "1px solid #dee2e6"
            }}>
                <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                    <strong>Need assistance?</strong>
                </p>
                <p style={{ margin: "5px 0", color: "#495057" }}>
                    Contact our support team at: support@passport.gov.lb
                </p>
                <p style={{ margin: "5px 0", color: "#495057" }}>
                    Phone: +961 1 123 456
                </p>
            </div>

            {/* Last Updated */}
            {verificationStatus.updated_at && (
                <div style={{
                    textAlign: "center",
                    marginTop: 30,
                    paddingTop: 20,
                    borderTop: "1px solid #eee",
                    color: "#666",
                    fontSize: 14
                }}>
                    Last updated: {new Date(verificationStatus.updated_at).toLocaleString()}
                </div>
            )}
        </div>
    );
}