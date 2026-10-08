const form = document.getElementById("downloadForm");
const urlInput = document.getElementById("videoUrl");
const pasteBtn = document.getElementById("pasteBtn");
const error = document.getElementById("error");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");

let selectedPlatform = "auto";

const patterns = {
  youtube: /(youtube\.com|youtu\.be)/i,
  tiktok: /tiktok\.com/i,
  instagram: /instagram\.com/i,
  facebook: /(facebook\.com|fb\.watch)/i
};

document.querySelectorAll(".platform").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".platform").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    selectedPlatform = btn.dataset.platform;
    error.hidden = true;
  });
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) urlInput.value = text.trim();
  } catch {
    urlInput.focus();
  }
});

function detectPlatform(url) {
  for (const [name, regex] of Object.entries(patterns)) {
    if (regex.test(url)) return name;
  }
  return null;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  error.hidden = true;
  result.hidden = true;

  const value = urlInput.value.trim();
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    error.textContent = "Masukkan URL yang valid.";
    error.hidden = false;
    return;
  }

  const detected = detectPlatform(value);
  if (!detected) {
    error.textContent = "URL harus berasal dari YouTube, TikTok, Instagram, atau Facebook.";
    error.hidden = false;
    return;
  }

  if (selectedPlatform !== "auto" && selectedPlatform !== detected) {
    error.textContent = `Link ini terdeteksi sebagai ${detected}, bukan ${selectedPlatform}.`;
    error.hidden = false;
    return;
  }

  const button = form.querySelector(".main-btn");
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Memeriksa...";

  try {
    const response = await fetch("/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: parsed.toString() })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Terjadi kesalahan.");
    }

    resultText.textContent =
      `Platform terdeteksi: ${data.platform}. Backend berhasil menerima URL.`;
    result.hidden = false;
  } catch (err) {
    error.textContent = err.message || "Server tidak dapat dihubungi.";
    error.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
