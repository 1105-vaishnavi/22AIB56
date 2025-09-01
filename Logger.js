// src/middleware/logger.js
// Custom logging middleware (NO console.log allowed in app code directly)
export const logEvent = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const log = { timestamp, message, data };
  localStorage.setItem(`log_${timestamp}`, JSON.stringify(log));
};
