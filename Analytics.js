// src/pages/Analytics.js
import React from "react";
import { getAllShortLinks } from "../Utils/Storage";

export default function Analytics() {
  const links = getAllShortLinks();

  return (
    <div className="container">
      <h1>Analytics</h1>
      <table>
        <thead>
          <tr>
            <th>Shortcode</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.shortcode}>
              <td>{link.shortcode}</td>
              <td>{link.originalUrl}</td>
              <td>{link.clicks}</td>
              <td>{new Date(link.expiry).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
