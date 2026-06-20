const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  "https://zbxnadgqarloklefhrph.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieG5hZGdxYXJsb2tsZWZocnBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTkxMzI3OCwiZXhwIjoyMDk3NDg5Mjc4fQ.LhlqGBZ-jyyDH_qX_gGC8RvuKQIWF419GbqH1AQR_Gk"
);

async function main() {
  const { data, error } = await supabaseAdmin.storage.createBucket("family-photos", {
    public: true,
    allowedMimeTypes: ["image/*"],
    fileSizeLimit: 5 * 1024 * 1024,
  });
  if (error && !error.message.includes("already exists")) {
    console.error("Error:", error.message);
  } else {
    console.log("Bucket ready:", data?.name ?? "family-photos (already existed)");
  }
}

main();
