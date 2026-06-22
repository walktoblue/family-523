require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없습니다. .env.local을 확인하세요.');
  process.exit(1);
}

const supabaseAdmin = createClient(url, key);

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
