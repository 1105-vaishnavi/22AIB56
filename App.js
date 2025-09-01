import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RedirectPage from "./pages/RedirectPage";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:shortcode" element={<RedirectPage />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}
