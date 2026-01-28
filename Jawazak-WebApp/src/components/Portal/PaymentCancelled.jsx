import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentCancelled() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const applicationId = searchParams.get('application_id');

    useEffect(() => {
        if (applicationId) {
            console.log("Payment cancelled for application:", applicationId);
            // You could potentially clean up or mark the application as cancelled here
        }
    }, [applicationId]);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
            <div style={{
                backgroundColor: '#F44336',
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
                ✗
            </div>
            <h1 style={{ color: '#F44336' }}>Payment Cancelled ❌</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Your payment was not completed. You can try again or contact support if you need assistance.
            </p>
            {applicationId && (
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
                    Application ID: {applicationId}
                </p>
            )}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        backgroundColor: '#999',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#777'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#999'}
                >
                    Try Again
                </button>
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
                    My Applications
                </button>
            </div>
        </div>
    );
}