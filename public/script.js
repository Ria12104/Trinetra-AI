// ──────────────────────────────────────────────
// Cybersecurity AI Frontend
// API key is now safely stored on backend
// ──────────────────────────────────────────────

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
// Main explain function
// Calls YOUR backend instead of Gemini directly
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

    output.innerHTML =
        '<span class="loading">Explaining</span>';

    try {

        // Calls Vercel backend route
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                attack
            })
        });

        const data = await res.json();

        // Success
        if (data.reply) {

            output.innerHTML =
                marked.parse(data.reply);

        }

        // API/backend error
        else if (data.error) {

            output.innerHTML =
                `<span class="error">API error: ${data.error}</span>`;

        }

        // Unknown error
        else {

            output.innerHTML =
                '<span class="error">Something went wrong. Try again.</span>';

        }

    } catch (err) {

        console.error(err);

        output.innerHTML =
            '<span class="error">Connection error. Try again later.</span>';

    }

    // Reset button
    btn.disabled = false;
    btn.textContent = "Explain →";
}

// ──────────────────────────────────────────────
// Allow pressing Enter to submit
// ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("attackInput")
        .addEventListener("keydown", (e) => {

            if (e.key === "Enter") {
                explain();
            }

        });

});

// ══════════════════════════════════════════════
// MATRIX RAIN CANVAS ANIMATION
// ══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", function matrixRain() {

    const canvas = document.getElementById("matrix-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const CHARS =
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

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

        ctx.font =
            FONT_SIZE + "px 'Share Tech Mono', monospace";

        for (let i = 0; i < drops.length; i++) {

            const char =
                CHARS[Math.floor(Math.random() * CHARS.length)];

            const bright = Math.random() > 0.95;

            ctx.fillStyle =
                bright ? "#00FF41" : "#00BB33";

            ctx.shadowColor = "#00FF41";

            ctx.shadowBlur =
                bright ? 12 : 5;

            ctx.fillText(
                char,
                i * FONT_SIZE,
                drops[i] * FONT_SIZE
            );

            if (
                drops[i] * FONT_SIZE > canvas.height &&
                Math.random() > 0.975
            ) {
                drops[i] = 0;
            }

            drops[i]++;

        }

    }

    resize();

    window.addEventListener("resize", resize);

    setInterval(draw, 40);

});