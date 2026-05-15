// ──────────────────────────────────────────────────────────────
// 🔑 Get your FREE Google Gemini API key in 30 seconds:
//    https://aistudio.google.com/app/apikey
//    (Sign in with Google → "Create API key" → copy & paste below)
// ──────────────────────────────────────────────────────────────
const API_KEY = "AIzaSyDVf1WVeMxwuxkXE9b_tvoo5BmzUCij6k4"; // ← paste fresh key (revoke the old one!)

const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-2.5-flash:generateContent?key=${API_KEY}`; // free tier: 1,500 req/day

const SYSTEM_INSTRUCTION =
  "You are a cybersecurity education AI. " +
  "You ONLY answer questions related to cybersecurity, hacking, malware, phishing, privacy, digital safety, networking security, cyber attacks, or online threats. " +
  "If a question is unrelated to cybersecurity, refuse to answer. " +
  "For unrelated questions, respond ONLY with: 'This AI only explains cybersecurity topics.' " +
  "Do not attempt to connect unrelated topics to cybersecurity. " +
  "For cybersecurity topics, explain clearly using these sections: 'What is it', 'How it works', and 'How to stay safe'. " +
  "Use simple formatting with short paragraphs and bullet points only when necessary."+
  "Use simple language and practical explanations. Response under 300 words.";

// ──────────────────────────────────────────────
// Preset attack buttons
// ──────────────────────────────────────────────
function pickAttack(name, btn) {
    document.getElementById("attackInput").value = name;
    document.querySelectorAll(".preset-btn").forEach((b) =>
        b.classList.remove("active")
    );
    btn.classList.add("active");
    explain();
}

// ──────────────────────────────────────────────
// Main explain function – calls Google Gemini API
// ──────────────────────────────────────────────
async function explain() {
    const input = document.getElementById("attackInput");
    const attack = input.value.trim();
    if (!attack) return;

    const btn = document.getElementById("explainBtn");
    const output = document.getElementById("output");
    const title = document.getElementById("output-title");

    // Loading state
    btn.disabled = true;
    btn.textContent = "Loading...";
    title.style.display = "block";
    title.textContent = attack;
    output.innerHTML = '<span class="loading">Explaining</span>';

    try {
        const res = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: "Explain the " + attack + " attack or threat." }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.7
                }
            })
        });

        const data = await res.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            output.innerHTML = marked.parse(
    data.candidates[0].content.parts[0].text
);
        } else if (data.error) {
            // Surface API error messages (e.g. invalid key, quota exceeded)
            output.innerHTML = `<span class="error">API error: ${data.error.message}</span>`;
        } else {
            output.innerHTML =
                '<span class="error">Something went wrong. Try again.</span>';
        }
    } catch (err) {
        console.error(err);
        output.innerHTML =
            '<span class="error">Connection error. Check your API key or internet connection.</span>';
    }

    // Reset button
    btn.disabled = false;
    btn.textContent = "Explain →";
}

// ──────────────────────────────────────────────
// Allow pressing Enter to submit
// ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("attackInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") explain();
    });
});

// ══════════════════════════════════════════════════════════════
// MATRIX RAIN CANVAS ANIMATION
// ══════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", function matrixRain() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const FONT_SIZE = 14;
    let columns, drops;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / FONT_SIZE);
        drops = Array(columns).fill(1);
    }

    function draw() {
        // Fade effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = FONT_SIZE + "px 'Share Tech Mono', monospace";

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const bright = Math.random() > 0.95;

            ctx.fillStyle = bright ? "#00FF41" : "#00BB33";
            ctx.shadowColor = "#00FF41";
            ctx.shadowBlur = bright ? 12 : 5;

            ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

            if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    resize();
    window.addEventListener("resize", resize);
    setInterval(draw, 40);
})();

