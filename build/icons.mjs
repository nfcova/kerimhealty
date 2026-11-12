// Minimal line icons (24×24, 1.4px stroke). Inline SVG — no icon library.
const wrap = (body, cls = '') =>
  `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  arrow: () => wrap('<path d="M4 12h15M13 6l6 6-6 6"/>', 'icon--arrow'),
  arrowUpRight: () => wrap('<path d="M7 17L17 7M8 7h9v9"/>'),
  growth: () => wrap('<path d="M3 20h18"/><path d="M5 16l5-5 3.5 3.5L20 8"/><path d="M15 8h5v5"/>'),
  network: () => wrap('<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M10.9 6.9l-4.8 9.2M13.1 6.9l4.8 9.2M7.2 18h9.6"/>'),
  process: () => wrap('<rect x="3" y="4" width="7" height="6" rx="1"/><rect x="14" y="14" width="7" height="6" rx="1"/><path d="M6.5 10v3a2 2 0 0 0 2 2H14"/><path d="M17.5 14v-3a2 2 0 0 0-2-2H10"/>'),
  compass: () => wrap('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  building: () => wrap('<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M3 21h18M8 8h3M8 12h3M8 16h3"/>'),
  clinic: () => wrap('<rect x="3" y="7" width="18" height="14" rx="1"/><path d="M8 7V4h8v3M12 11v6M9 14h6"/>'),
  box: () => wrap('<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>'),
  globe: () => wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  shield: () => wrap('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
  target: () => wrap('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  handshake: () => wrap('<path d="M3 11l4-4 4 2 3-2 7 5"/><path d="M3 11l6 6a1.5 1.5 0 0 0 2.1 0l.4-.4M21 12l-6 5.5a1.5 1.5 0 0 1-2.1 0l-4-3.8"/><path d="M11 9l-2 2a1.4 1.4 0 0 0 2 2l2-1.5"/>'),
  clock: () => wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  check: () => wrap('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  info: () => wrap('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'),
  alert: () => wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>'),
  mail: () => wrap('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6l8.5 7 8.5-7"/>'),
  phone: () => wrap('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>'),
  pin: () => wrap('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  linkedin: () => wrap('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.5 1-2.7 2.4-2.7S16.5 11.6 16.5 13v4M12 10.5V17"/>'),
  chat: () => wrap('<path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/><path d="M8 9h8M8 12.5h5"/>'),
  doc: () => wrap('<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  layers: () => wrap('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
  loader: () => wrap('<path d="M12 3a9 9 0 1 0 9 9"/>'),
  whatsapp: () =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>`
};
