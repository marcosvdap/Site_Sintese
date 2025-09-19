// src/components/CookieConsent.js
import { useState, useEffect } from "react";


export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        Usamos cookies para melhorar sua experiência. Ao continuar navegando,
        você aceita nossa política de cookies.
      </p>
      <div>
        <button onClick={handleAccept}>Aceitar</button>
        <button onClick={handleReject}>Rejeitar</button>
      </div>
    </div>
  );
}
