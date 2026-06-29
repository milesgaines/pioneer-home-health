/* Pioneer Home Health Services — runtime config
   The publishable key is safe to expose: Row Level Security allows the public
   (anon) role to INSERT only — no reading, updating, or deleting form data. */
window.PIONEER_CONFIG = {
  // Supabase: stores every submission (Row Level Security = insert-only from the web).
  SUPABASE_URL: "https://tgkgdquivdoquxamtgcr.supabase.co",
  SUPABASE_KEY: "sb_publishable_n2L0n-54EUL26R4jEu3buQ_EZ0PY6mT",
  // Email delivery: submissions are emailed here via FormSubmit (no backend server needed).
  // First submission triggers a one-time activation email to this address — click the link once
  // and every future submission lands in the inbox. Returns JSON, so there is NO redirect/popup.
  NOTIFY_EMAIL: "pioneerhomehealthservices@gmail.com"
};
