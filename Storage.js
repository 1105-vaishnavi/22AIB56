// src/utils/storage.js
// Manages shortlinks & analytics
export const saveShortLink = (shortcode, data) => {
  localStorage.setItem(`short_${shortcode}`, JSON.stringify(data));
};

export const getShortLink = (shortcode) => {
  const item = localStorage.getItem(`short_${shortcode}`);
  return item ? JSON.parse(item) : null;
};

export const getAllShortLinks = () => {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("short_"))
    .map((key) => JSON.parse(localStorage.getItem(key)));
};

export const incrementClick = (shortcode) => {
  const data = getShortLink(shortcode);
  if (data) {
    data.clicks += 1;
    saveShortLink(shortcode, data);
  }
};
