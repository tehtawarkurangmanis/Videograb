const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

const patterns = {
  youtube: /(youtube\.com|youtu\.be)/i,
  tiktok: /tiktok\.com/i,
  instagram: /instagram\.com/i,
  facebook: /(facebook\.com|fb\.watch)/i
};

function detectPlatform(url) {
  for (const [name, regex] of Object.entries(patterns)) {
    if (regex.test(url)) return name;
  }
  return null;
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "VideoGrab API" });
});

app.post("/api/info", (req, res) => {
  const value = String(req.body?.url || "").trim();

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return res.status(400).json({
      success: false,
      error: "URL tidak valid."
    });
  }

  const platform = detectPlatform(value);
  if (!platform) {
    return res.status(400).json({
      success: false,
      error: "Platform belum didukung."
    });
  }

  res.json({
    success: true,
    platform,
    url: parsed.toString(),
    message: "URL berhasil diterima. Mesin pemrosesan media belum diaktifkan."
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`VideoGrab running on port ${PORT}`);
});
