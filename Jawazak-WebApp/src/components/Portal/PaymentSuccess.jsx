import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { supabase } from '../supabase-client';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sessionId = searchParams.get('session_id');
    const applicationId = searchParams.get('application_id');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (sessionId) {
                    console.log("Verifying payment with session ID:", sessionId);

                    // You could make an API call here to verify the payment status
                    // For now, we'll just log it
                }

                if (applicationId) {
                    console.log("Application ID:", applicationId);
                }

            } catch (error) {
                console.error("Error verifying payment:", error);
            }
        };

        verifyPayment();
    }, [sessionId, applicationId]);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
            <div style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                fontSize: '40px'
            }}>
                ✓
            </div>
            <h1 style={{ color: '#4CAF50' }}>Payment Successful ✅</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                Your passport application fee has been processed successfully.
            </p>
            {sessionId && (
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
                    Session ID: {sessionId}
                </p>
            )}
            {applicationId && (
                <p style={{ fontSize: '14px', color: '#999' }}>
                    Application ID: {applicationId}
                </p>
            )}
            <div style={{ marginTop: '40px' }}>
                <button
                    onClick={() => navigate('/portal')}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                >
                    Go to My Applications
                </button>
            </div>
        </div>
    );
}