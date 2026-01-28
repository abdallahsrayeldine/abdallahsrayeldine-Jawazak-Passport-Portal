import { useEffect, useRef, useState } from 'react';

export default function ChatWithAI() {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      setIsLoading(false);
      console.log('Chatbase iframe loaded successfully');
    };

    const handleIframeError = () => {
      setHasError(true);
      setIsLoading(false);
      console.error('Failed to load Chatbase iframe');
    };

    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      iframe.addEventListener('error', handleIframeError);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('error', handleIframeError);
      }
    };
  }, []);

  if (hasError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 140px)', // Account for nav bar height
        textAlign: 'center',
        padding: '2rem'
      }}>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
          Failed to load the AI chat. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="chatbase-container" style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 140px)', // Nav bar is approximately 140px tall
      minHeight: '600px', // Minimum height for smaller screens
      display: 'flex',
      flexDirection: 'column'
    }}>
      {isLoading && (
        <div className="chatbase-loading" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          zIndex: 10,
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #3b82f6',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: '500',
            color: '#1e293b'
          }}>
            Loading AI assistant...
          </p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="https://www.chatbase.co/chatbot-iframe/BO0Vjty_TNSpzGHT3XDh3"
        width="100%"
        height="100%"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'block',
          flex: 1,
          minHeight: 0, // Allow iframe to shrink properly
          width: '100%',
          backgroundColor: 'white'
        }}
        frameBorder="0"
        allow="microphone; camera"
        allowFullScreen
        title="AI Chat Assistant"
        aria-label="Chat with AI assistant"
      ></iframe>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .chatbase-container {
            height: calc(100vh - 120px); // Smaller nav bar on mobile
          }
        }
      `}</style>
    </div>
  );
}