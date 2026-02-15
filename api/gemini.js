export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // ========== PASTE SHORT STYLE EXCERPTS BELOW ==========
    // Use 2-3 very short phrases (one sentence each) to convey tone.
    // These are just to remind the AI of the flavor, not to provide content.
    const styleHints = `[Paste a short phrase showing respectful tone, e.g., "الحمدللہ رب العالمین"]
[Paste a phrase with typical vocabulary, e.g., "علم کی فضیلت بہت عظیم ہے"]
[Paste a concluding phrase, e.g., "واللہ اعلم بالصواب"]`;
    // =======================================================

    const systemPrompt = `
# CORE TASK
You are an expert writer in Lisan-ud-Dawat. Write a **completely original** essay in pure Lisan-ud-Dawat about the following topic:

**Topic:** ${topic}

The essay must be **${type || 'General'}** in style (if "Other", use a balanced style).

# STRUCTURE (do NOT use headings)
1. **Muqaddama (مقدمہ)** – introduce the topic gracefully.
2. **Bayan (بیان)** – develop the topic logically, including **at least one Quranic verse** (with reference, e.g., "سورۃ البقرۃ آیت ۲۸۶") and **one authentic Hadith** (e.g., "قال رسول الله ﷺ") that are relevant to the topic.
3. **Natijah (نتیجہ)** – conclude thoughtfully, possibly with a prayer or moral.

# STYLE GUIDANCE
The following short phrases illustrate the desired tone and vocabulary. Study them, but **create entirely new sentences** – do not copy them.
--- STYLE HINTS ---
${styleHints}
--- END HINTS ---

# CRITICAL RULES
- **Never copy any example text** – every sentence must be original.
- **Never include headings** like "مقدمہ:" – just write flowing text.
- **Do not mention any Sahabah, Khalifas, or contemporary figures by name** – only Allah and the Prophet ﷺ may be referenced.
- **Do not fabricate Quranic verses or Hadith** – use only authentic ones you know.
- **Length: approximately 200 words** (the user requested this). Be concise but rich.
- **Output only the essay** – no commentary, no notes, no translations.
- **Write in pure Lisan-ud-Dawat script** – ignore any Roman letters in the topic.

# YOUR ESSAY (begin directly):
`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 1.0,
                    maxOutputTokens: 800,      // ~400-500 words, enough for 200 words
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);
            return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
        }

        const essay = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (essay) {
            res.status(200).json({ essay });
        } else {
            console.error('No essay in response:', data);
            res.status(500).json({ error: 'Failed to generate essay', details: data });
        }
    } catch (error) {
        console.error('API call failed:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}
