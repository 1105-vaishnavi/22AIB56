// src/pages/RedirectPage.js
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShortLink, incrementClick } from "../Utils/Storage";
import { logEvent } from "../Middleware/Logger";

export default function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getShortLink(shortcode);
    if (!data) {
      logEvent("Invalid shortcode", { shortcode });
      navigate("/");
      return;
    }

    if (Date.now() > data.expiry) {
      logEvent("Link expired", { shortcode });
      navigate("/");
      return;
    }

    incrementClick(shortcode);
    logEvent("Redirecting", { shortcode, url: data.originalUrl });
    window.location.href = data.originalUrl;
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
}
