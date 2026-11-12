/**
 * Site configuration — the ONLY file you need to edit for contact details.
 *
 * Empty values are handled gracefully:
 *  - Empty `whatsapp`  → the floating WhatsApp button is not rendered and the
 *                        WhatsApp card on the contact page shows "available soon".
 *  - Empty `email`     → email card shows "available soon", mail links are hidden.
 *  - Empty `linkedin`  → LinkedIn card shows "available soon", footer link hidden.
 *  - Empty `siteUrl`   → canonical / hreflang use root-relative URLs and
 *                        sitemap.xml is not generated.
 *
 * After editing, run:  npm run build
 */
export default {
  /** Production URL without trailing slash, e.g. "https://www.example.com" */
  siteUrl: '',

  contact: {
    /** International format, digits only, no "+" or spaces, e.g. "905XXXXXXXXX" */
    whatsapp: '905496118240',
    /** Phone number shown on the site, e.g. "+90 5XX XXX XX XX" */
    phone: '+90 549 611 82 40',
    /** Public e-mail address */
    email: '',
    /** Full LinkedIn profile URL */
    linkedin: ''
  },

  /**
   * Endpoint that receives the contact form as JSON (POST).
   * The bundled `server.mjs` implements `/api/contact`.
   * You may also point this to a form service (e.g. a serverless function).
   */
  formEndpoint: '/api/contact'
};
