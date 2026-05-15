export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    // AI system instruction
    const SYSTEM_INSTRUCTION =
        "You are a cybersecurity education AI. " +
        "You ONLY answer questions related to cybersecurity, hacking, malware, phishing, privacy, digital safety, networking security, cyber attacks, or online threats. " +
        "If a question is unrelated to cybersecurity, refuse to answer. " +
        "For unrelated questions, respond ONLY with: 'This AI only explains cybersecurity topics.' " +
        "Do not attempt to connect unrelated topics to cybersecurity. " +
        "For cybersecurity topics, explain clearly using these sections: 'What is it', 'How it works', and 'How to stay safe'. " +
        "Use simple formatting with short paragraphs and bullet points only when necessary. " +
        "Use simple language and practical explanations. Response under 300 words.";

    try {

        // Secret Gemini API key from Vercel environment variables
        const apiKey = process.env.GEMINI_API_KEY;

        // Get attack name from frontend
        const { attack } = req.body;

        // Gemini endpoint
        const GEMINI_URL =
            `https://generativelanguage.googleapis.com/v1beta/models/` +
            `gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Request to Gemini
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                system_instruction: {
                    parts: [
                        {
                            text: SYSTEM_INSTRUCTION
                        }
                    ]
                },

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text:
                                    "Explain the " +
                                    attack +
                                    " attack or threat."
                            }
                        ]
                    }
                ],

                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.7
                }

            })
        });

        const data = await response.json();

        // Successful response
        if (
            data.candidates &&
            data.candidates[0]?.content?.parts[0]?.text
        ) {

            return res.status(200).json({
                reply:
                    data.candidates[0]
                        .content.parts[0].text
            });

        }

        // Gemini API error
        else if (data.error) {

            return res.status(500).json({
                error: data.error.message
            });

        }

        // Unknown failure
        else {

            return res.status(500).json({
                error: "Something went wrong."
            });

        }

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }

}