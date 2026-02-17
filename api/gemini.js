export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type, words, includeAyah } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // ========== PASTE YOUR SHORT STYLE HINTS BELOW ==========
    // 3-5 short phrases (one line each) that capture Lisan-ud-Dawat flavor.
    // Examples: "الحمدللہ رب العالمین", "علم کی فضیلت بہت عظیم ہے", etc.
    const styleHints = `الفلك المحيط اْ دنيا نا عالم ما تمام حركة نا اصل ححهسس... فلك محيط ني حركة سي} تمام خلقة نو وجود ححهسس، اهنا ثثھروا  نا سبب} تمام افلاك انسس تاراؤ ثثھرسس ححهسس، 
... هر زمان ما حق نا صاحب نو مقام - الفلك المحيط ني مثل ححهسس، يه مؤمنين نسس هداية دسس ححهسس تو ثثهلسس خود حركة كرسس ححهسس، عمل كرسس ححهسس، انسس ثثححھي مؤمنين نسس حركة كراوسس ححهسس، عمل كراوسس ححهسس ...
هوسس جه شخص ني position اهوي هوئي كه اهنا ككهر ما، يا مجتمع ما، يا تعليم نا ميدان ما، يا ويثثار نا مجال ما مهوضضا هوئي...
اككر جو يه خود عمل كري نسس كوئي وات كهسسس تو اهنو اثر جُدو} ثثرٌسسس، ايم كظظوائي ححهسس، English نا اندر اداء كريئسس كه
"Actions speak louder than words."`;
    // ========================================================

    const ayahInstruction = includeAyah
        ? "In the Bayan, include **at least one Quranic verse** (with reference, e.g., 'سورۃ البقرۃ آیت ۲۸۶') and **one authentic Hadith** (e.g., 'قال رسول الله ﷺ') that are relevant to the topic."
        : "Do **not** include any Quranic verses or Hadith. Write a purely expository/descriptive essay based on the topic.";

    const systemPrompt = `
You are a master writer of **insha** (essays) in **Lisan-ud-Dawat**, the language of the Dawoodi Bohra community. You are also an expert in English composition
and Islamic knowledge. All the exampales are style guides to learn fromand are not context to copy from. 
You know that lisa ud dawat has their diffrent alphabeta which are not in arabic,
 so you have understood it and leearn the launguage as it is.

## UNDERSTANDING INSHA TYPES
- **Expository**: Explains or informs about a topic objectively.
- **Descriptive**: Paints a vivid picture using sensory details.
- **Analytical**: Breaks down a topic into parts and examines relationships.
- **Narrative**: Tells a story or recounts events.

## YOUR TASK
The user has provided a **topic**, an **insha type**, a **desired word count** (approximately ${words} words), and a request to ${includeAyah ? "include" : "exclude"} Quranic verses and Hadith.

Follow these internal steps (but output only the final Lisan-ud-Dawat essay):

1. **English Essay Drafting**: Create a coherent English essay on the topic, following the specified type and roughly ${words} words. Use proper structure (introduction, body, conclusion). Do not output this draft.
2. **Translation & Transformation**: Convert the English essay into pure **Lisan-ud-Dawat**, adapting it to the authentic style. Use the style hints below as a guide for tone, vocabulary, and rhythm. Ensure the Lisan-ud-Dawat version flows naturally with:
   - **Muqaddama** (introduction)
   - **Bayan** (body, with logical development)
   - **Natijah** (conclusion)
   Do **not** include any headings – just the text.
3. **Apply Ayah/Hadith Instruction**: ${ayahInstruction}
4. **Final Output**: Produce only the Lisan-ud-Dawat essay – no English, no notes, no explanations.

## STYLE HINTS (short phrases illustrating Lisan-ud-Dawat flavor)
${styleHints}

## USER REQUEST
- **Topic**: ${topic}
- **Type**: ${type}
- **Desired Word Count**: approximately ${words} words
- **Include Ayah & Hadith**: ${includeAyah ? "Yes" : "No"}

Now generate the Lisan-ud-Dawat essay:
`;

    try {
        // Estimate tokens: words * 2 (Arabic uses more characters) + buffer
        const maxTokens = Math.min(parseInt(words) * 2 + 500, 4000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 1.0,
                    maxOutputTokens: maxTokens,
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
