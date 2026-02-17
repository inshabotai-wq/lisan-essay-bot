export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type, words, includeAyah } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // Short style hints (replace with your own)
    const styleHints = `و جه مثل افلاك انسس خصوصًا فلك البروج ككهنا محفوظ ححهسس انسس ككهنا بلند ححهسس، يه} مثل سازوار ححهسس كه مؤمنين نا ككهرو ما بروج ني خوبيو هوئي، 
يھ سوطط؟ كه مؤمنين انسس مؤمنين نا ككهرو انسس يه سككلا ني هر ححيز بلندي ني نهاية ثثر هوئي انسس محفوظ هوئي، انسس جه مثل تاراؤ اولياء الله ني تأثير قبول كرسس ححهسس يه} مثل مؤمنين انسس مؤمنين نا ككهرو هوئي، جه ما يه سككلا انسس اهنا فرزندو ولي  الله ني تأثير قبول كرتا هوئي،
امام احمد المستور يه مدينة فاضلة روحانية ني ذكر فرماوي، انسس ايم واضح كيدو ححهسس كه هر مؤمن نو ككهر يه شان نو هوئي كه زمين نا لوككو نا بد  اخلاق نو اثر اهنا ثثر نھ ثثرٌسس، باطل نا لوككو نا علم نا موج نو اثر بهي اهنا ثثر نھ ثثرٌسس، خراب عقيدة نو دُهنوو بهي اهني طرف نھ ححرٌهسس، بلكه هر مؤمن نو ككهر اتنو بلند هوئي كه بيسرا ككهرو ثثر اشراف كرسس، يعني مؤمن نو ككهر بيسرا لوككو واسطسس خير ني مثال بنسس، سككلا ايم ححاهسس كه سككلا نا ككهرو بهي مؤمن نا ككهر ني مثل بلند انسس محفوظ هوئي. 
`;

    const ayahInstruction = includeAyah
        ? "Include at least one Quranic verse (with reference, e.g., 'سورۃ البقرۃ آیت ۲۸۶') and one authentic Hadith (e.g., 'قال رسول الله ﷺ') relevant to the topic."
        : "Do not include any Quranic verses or Hadith. Write a purely expository/descriptive essay.";

    const systemPrompt = `
You are a master essay writer in Lisan-ud-Dawat, the language of the Dawoodi Bohra community. All the exampales are style guides to learn fromand are not context to copy from. 
You know that lisa ud dawat has their diffrent alphabeta which are not in arabic,
 so you have understood it and leearn the launguage as it is.

## TASK
Write a **complete** essay in pure Lisan-ud-Dawat on the topic: "${topic}".
The essay style must be: **${type}**.
Length: approximately ${words} words. Do not stop until the essay is complete.

## STRUCTURE (do NOT use headings)
- **Muqaddama** (introduction)
- **Bayan** (body, with logical development)
- **Natijah** (conclusion)

## REQUIREMENTS
- ${ayahInstruction}
- Use the following phrases as style inspiration (but do not copy them directly):
${styleHints}
- Do not mention any Sahabah, Khalifas, or contemporary figures by name.
- Write only in Lisan-ud-Dawat script. The user may have typed the topic in Roman letters – ignore that and output only in Lisan-ud-Dawat.

## OUTPUT
Return only the essay text – no headings, no commentary, no explanations.
`;

    try {
        const maxTokens = Math.min(parseInt(words) * 3 + 500, 4000); // generous

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
