export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type, words, includeAyah } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // Short style hints (replace with your own if desired)
    const styleHints = `صراط مستقيم ثثر ححلوو ككهنو سهل ححهسس، سيدنا المؤيد الشيرازي فرماوسس ححهسس كه: 
وكونه ممدا على سقر * احد من سيف ادق من شعر
صراط مستقيم ني ايك صفة سوطط ححهسس كه يه تلوار ني دهار كرتا بهي تيز ححهسس، يعني سوطط كه جه مثل تيز تلوار هر ححيز
نسس كاثثي دسس ححهسس يه} مثل صراط مستقيم - جه حق نو راستھ ححهسس - يه تمام مشكلو نسس كاثثي دسس ححهسس، اهنا ثثر ححلنار سي هر دُشوارككي دور تهئي جائي ححهسس، 
هوسس صراط مستقيم ني بيجي صفة سوطط ححهسس كه يه بال كرتا بهي زيادة باريك ححهسس، يعني جنة نو راستھ - يه راستھ ثثر ححلنار ني زندككي نا هر امر ما، يهاطط لكك كه 
باريك ما باريك امر ما بهي اهنسس هداية دسس ححهسس كه تميطط اْم كرو، اْم نھ كرو، انسس ايم بهي هداية دسس ححهسس كه تميطط اْم 
نھ كري سكتا هوئي تو اْم كرو، يه بهي نھ كري سكتا هوئي تو اْم كرو، يعني ايم هداية دسس ححهسس كه شريعة ما ككهني وُسعة ححهسس، اهنا مطابق عمل كروو ككهنو سهل ححهسس`;

    // Description of essay types
    const typeDescription = {
        Expository: "Explains or informs about a topic objectively. Focus on clarity and facts.",
        Descriptive: "Paints a vivid picture using sensory details. Use rich, evocative language.",
        Analytical: "Breaks down a topic into parts and examines relationships. Use logic and reasoning.",
        Narrative: "Tells a story or recounts events. Use a clear sequence and engaging flow.",
        Other: "Balanced style, suitable for general topics."
    };

    const ayahInstruction = includeAyah
        ? "In the Bayan, include **at least one Quranic verse** (with reference, e.g., 'سورۃ البقرۃ آیت ۲۸۶') and **one authentic Hadith** (e.g., 'قال رسول الله ﷺ') that are relevant to the topic."
        : "Do **not** include any Quranic verses or Hadith. Write a purely expository/descriptive essay based on the topic.";

    const systemPrompt = `
You are a master essay writer in **Lisan-ud-Dawat**, the language of the Dawoodi Bohra community.
You write in pure Lisan-ud-Dawat – a natural mix of Arabic, Urdu, and Gujarati written in Arabic script.
You can use English or Roman letters in the essay. All the exampales are style guides to learn fromand are not context to copy from. 
You know that lisa ud dawat has their diffrent alphabeta which are not in arabic,
 so you have understood it and leearn the launguage as it is.

## TASK
Write a **complete, well-structured** essay in **pure Lisan-ud-Dawat** on the topic: "${topic}".
The essay must follow the **${type}** style. Style description: ${typeDescription[type] || typeDescription.Other}.
Length: **at least ${words} words**. Do not stop until the essay is complete and meets the word count.

## STRUCTURE (do NOT use headings)
Your essay must have these three parts in order, flowing naturally:
1. **Muqaddama** (introduction) – introduce the topic gracefully, set the context.
2. **Bayan** (body) – develop the main ideas logically. ${ayahInstruction}
3. **Natijah** (conclusion) – summarise and conclude with a thoughtful ending.

## LANGUAGE REQUIREMENTS
- The entire essay must be in **pure Lisan-ud-Dawat**. Use vocabulary and sentence structures typical of Dawoodi Bohra sermons.
- Study the following short phrases for style inspiration, but **create entirely new sentences**:
  ${styleHints}
- Do **not** mention any Sahabah, Khalifas, or contemporary figures by name – only Allah and the Prophet ﷺ may be referenced.

## OUTPUT
Return **only the essay text** – no headings, no notes, no explanations. The essay should be a single block of text (paragraphs separated by blank lines) in Lisan-ud-Dawat script.
`;

    try {
        // Tokens: roughly words * 2.5 (since Arabic is denser) + buffer
        const maxTokens = Math.min(parseInt(words) * 3 + 600, 6000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9,          // balanced creativity
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
