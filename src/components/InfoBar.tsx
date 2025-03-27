"use client";

import { useEffect, useState } from "react";

export default function InfoBar() {
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [dealsMessage, setDealsMessage] = useState<string>("");

  useEffect(() => {
    // Haal de verificatiestatus van de gebruiker op
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user status');
        }
        const data = await response.json();
        setIsEmailVerified(data.emailVerified);
      } catch (error) {
        console.error('Error fetching user status:', error);
        setIsEmailVerified(false); // Fallback als de status niet kan worden opgehaald
      }
    };

    // Simuleer een API-aanroep om deals op te halen
    const fetchDeals = async () => {
      setDealsMessage("🔥 Deals van de dag: 20% korting op alle producten!");
    };

    fetchUserStatus();
    fetchDeals();
  }, []);

  if (isEmailVerified === null) {
    return null; // Wacht tot de verificatiestatus is opgehaald
  }

  return (
    <div
      className={`py-2 px-4 text-center ${
        isEmailVerified ? "bg-green-600" : "bg-orange-600"
      } text-white`}
    >
      {!isEmailVerified ? (
        <p>
          <strong>Let op:</strong> U moet uw e-mailadres verifiëren om toegang
          te krijgen tot alle functies. Gaan naar het dashboard
        </p>
      ) : (
        <p>{dealsMessage}</p>
      )}
    </div>
  );
}
