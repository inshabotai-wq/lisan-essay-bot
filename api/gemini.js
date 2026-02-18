// ============================================================
// ULTIMATE LISAN-UD-DAWAT ESSAY GENERATOR
// Pre‑fine‑tuning version with maximum prompt engineering
// Addresses all 10 documented problems
// ============================================================

module.exports = async function handler(req, res) {
    // --- Only accept POST requests ---
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- Extract request parameters ---
    const { topic, type, words, includeAyah } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // ============================================================
    // 1. PASTE A PERFECT EXAMPLE INSHA HERE (replace with your own)
    // ============================================================
    // This should be one of your 600‑word typed insha, in pure
    // Lisan‑ud‑Dawat, using the correct double‑letter conventions.
    // The AI will use it as a style guide.
    const perfectExample = `
بسم الله الرحمن الرحيم
الحمد لله رب العالمين والصلاة والسلام على سيدنا محمد وآله الطاهرين

(كونوا ربانيين بما كنتم تعلمون الكتاب وبما كنتم تدرسون
سيدنا و مولا نا عالي قدر مفضل سيف الدين ط ع نو احسان ؛, کے جے وقت طالب علم مؤمن نے جامعة ما داخلھ نو شرف حاصل تهائي ؛، تو  يے نعمة نا ساتهے اهنے مساکن محمدية ما جگه عناية فرماوے ؛، کے جظظا ں  يھ شريعة ثثر تمرين كرسس ؛ انے كونو ربيين نو حكم اتهاوے؛  ھوے جسس مثل اْ مساكن محمدية كسس جسس مساكن  طيبة في جنات عدن  ني مثل ححهسس  كسس جهان امان انسس سكون ححهسس تو يه مساكن ما طالب علم اهني حياة جامعية نسس مسالمة نا ساتهـ كئي طرح ككزارسس ححهسس اهنسس مولى ني وعظ نورانية سي برکة لئي نے ذكر كرئيسس.
 مساكن محمدية   Most peaceful and safe ككهر ححهسس، يه كئي طرح كسس سيدنا عالي قدر مفضل سيف الدين ط ع يه سنة 1438ما  عشرة مباركة ما “طلبت الامن”  ني وعظ ما فرماوے ؛”ميں يھ Peace and safety نسس  طلب كيدو تو ميں يه ايم ديكهو كسس ككناهو نسس موكي ديوا سي امان ملسس ححهسس" انسس سيدنا عبد علي سيف الدين ر ض فرماوسس ححهسس -
من كان معتصما بعصمته ? لم يرتطم في الخطاء والخطل
جھ شخص امام الزمان ع م ني عصمة سي ولككسسس تو بولوا ما انسس عمل كروا ما يھ ككناه ما نظظيں ثثهنسسس تو ستر نا زمان ما دعاة مطلقين ع م جھ سككلا عصمة نا صاحبو ححهسس اهنا مساكن ما اهني عصمة سي وابسطه رهي سوں كوئي ككناه تهائي ؟ بلكھ مساکن ما اهوو ماحول بنايو كھ  طالب علم واسطسس ككناه كروو ج ككهنو مشكل تهئي جائي كسس جسس نا سبب اْ مساكن ما Peace and safety ححهسس. 
سيدنا عالي قدر مفضل سيف الدين ط ع مسالمة ني ذکر جدي يعنيCapricorn ني صفة ما فرماوے ححهے  “جدي يعني سينككڑا والو بكرو ، امام احمد المستور ع م فرماوسس ححهے كھ بكرا ني خاصية سوں ؟  كھ مسالمةReconciliation  .واهني تأثير ما جھ جنائي ححهسس يھcaring  انسس sensitive  هوئي ححهسس “ تو يھج مثل طالب علم جيوارسس مساكن ما رهسس ححهسس  تو يھ اهنا بيجا بهائيو نو ككهنو خيال راكهسس ححهسس اهنا feelings  واسطسس ككهنا sensitive  هوئي ححهسس انسس اهنا بهائي واسطسس  care  كرسس ححهسس. جھ  مثل کے موھٹا طلبة چھوٹا طلبة نے کتابو والوا ما مدد کرے ؛، جيوارے يے اوّلا ما آوے ؛ تو اھنے واڑي کرتا سيکھاوے ؛، جو کوئي طلبة نے کوئي عمل کروو مشکل لاگتو ھوئي ؛ تو بيجا اھنے سھارو آپے ؛ انے يے ج مثل گھنا اھوا عمل ايک طلبة بيجا طلبة واسطے سہلائي سي لئي اوتھے ؛ز.
مولى ط ع فرماوسس ححهسس كھ “مسالمة يعني جهككرو نھ كروو انسس دل نھ دكهاوو”  تارے مولى ط ع يھ مساكن ني تعمير اهوي كيدي كھ اهما وسنار نسس كوئي وقت اهوا عمل كروو تو كجا بلكھ اهنو خيال بهي نظظيں اْؤتو، بيجا طلبة سي جهككرو نھ كري يھ مولى نو دل تو  نظظيں ج  دكهاؤتا بلكھ بيجا نسس مدد كري مسالمة نا ساتهـ Peaceful  ماحول ما رهسس ححهسس.
جدي ني ايك هجي خوبي سوں ححهسس كھ اهما جنايا هوا شخص Hardworking leader  هوئي ححهسس تو مساكن ما طالب علم Hardworking كئي طرح بنسس ححهسس، كھ طالب علم نو شغل، علم طلب كروو ححهسس، تو يھ ثثورا دن جامعة ما علم حاصل کرے ححهسس انے يھ علم نو ثثهل جھ تواضع اْوو جوئيسس يھ تواضع نا ساتهـ يھ اهنا بهائيو ساتهـ ملسس ححهسس، يھ علم نسس اهني جككه ما موكسس ححهسس انسس راتسس قصيدة ما امام حسين ع س نو ثثر جوش ماتم كري علم نو خلاصة حاصل کري لے ححهسس، تو ثثورا دن نو Hard work نو سلسلسة مساكن ما تمام تهائي ححهسس. اھنو نتيجھ  Hardworking leader  يھ مساکن ما بنھ ؛ .خدا تعالى سيدنا عالي قدر مفضل سيف الدين ط ع كھ جسس نا قدم مبارك همارو مساكن ححهسس يھ مولىط ع نسس صحة و عافية نا مساكن طيبة ما باقي راكهجو  اْمين . 
)

والله اعلم بالصواب
    `.trim();

    // ============================================================
    // 2. STYLE HINTS (short phrases capturing the flavour)
    // ============================================================
    const styleHints = `
- افتتاح كلام: الحمدللہ رب العالمین
- مقام ثنا: صلی اللہ علیہ و آلہ و سلم
- استفاده از دو حروف: گ = كك, چ = حح, پ = ثث, ē = سس, چھ = ححهسس
- الفاظ خاص: محبت, عبادت, فضیلت, نور, ہدایت
- اختتام: واللہ اعلم بالصواب، و آخر دعوانا ان الحمد للہ رب العالمین
    `.trim();

    // ============================================================
    // 3. TYPE DESCRIPTIONS (to enforce essay type)
    // ============================================================
    const typeDesc = {
        Expository:   "Explain or inform objectively. Focus on clarity and facts.",
        Descriptive:  "Paint a vivid picture using sensory details. Use rich, evocative language.",
        Analytical:   "Break down the topic into parts and examine relationships. Use logic and reasoning.",
        Narrative:    "Tell a story or recount events. Use a clear sequence and engaging flow.",
        Other:        "Write a balanced essay suitable for general topics."
    };

    // ============================================================
    // 4. AYAH/HADITH INSTRUCTION (based on toggle)
    // ============================================================
    const ayahInstruction = includeAyah
        ? "In the Bayan, include **at least one Quranic verse** (with reference, e.g., 'سورۃ البقرۃ آیت ۲۸۶') and **one authentic Hadith** (e.g., 'قال رسول الله ﷺ') that are relevant to the topic. Use them naturally within the discussion, and provide the reference."
        : "Do **not** include any Quranic verses or Hadith. Write a purely expository/descriptive essay based on the topic.";

    // ============================================================
    // 5. SPECIAL OPENING INSTRUCTION (for love topics)
    // ============================================================
    const isLoveTopic = topic.includes("محبت") || topic.includes("mohabbat") || topic.includes("mari mohabbat");
    const openingInstruction = isLoveTopic
        ? "Start by describing how people in today's world express love – often materialistic, worldly, and transient. Then, transition to the author's personal love for Aale Muhammad (the Prophet's family), explaining why this love is higher, eternal, and spiritually fulfilling."
        : "";

    // ============================================================
    // 6. THE ULTIMATE SYSTEM PROMPT (addressing all 10 problems)
    // ============================================================
    const systemPrompt = `
You are a master essay writer in **Lisan-ud-Dawat**, the language of the Dawoodi Bohra community. 
You have studied hundreds of authentic sermons and have internalised the style, vocabulary, and rhythm. 
You write in pure Lisan-ud-Dawat – a natural blend of Arabic, Urdu, and Gujarati words written in Arabic script. All the exampales are style guides to learn fromand are not context to copy from. 
You know that lisa ud dawat has their diffrent alphabeta which are not in arabic,
 so you have understood it and leearn the launguage as it is.
You can use English or Roman letters, and you strictly follow the orthographic conventions: 
- **گ** is written as **كك**
- **چ** is written as **حح**
- **پ** is written as **ثث**
- The **ē** sound (as in "ē bhaiyo") is written as **سس**
- The word **"chae"** (છે) is written as **ححهسس**

## CRITICAL INSTRUCTION – LENGTH
The user has requested an essay of **at least ${words} words**. You MUST write a complete essay that reaches this length. Do NOT stop until you have written at least ${words} words. If you finish the main ideas early, continue by adding more details, examples, explanations, or relevant quotations to expand the essay. Under no circumstances should you output a short response.

## TASK
Write a **complete, well-structured** essay in **pure Lisan-ud-Dawat** on the topic: "${topic}".
The essay must follow the **${type}** style. Style description: ${typeDesc[type] || typeDesc.Other}.

${openingInstruction}

## STRUCTURE (do NOT use headings)
Your essay must have these three parts in order, flowing naturally:
1. **Muqaddama** (introduction) – introduce the topic gracefully, set the context.
2. **Bayan** (body) – develop the main ideas logically. ${ayahInstruction}
3. **Natijah** (conclusion) – summarise and conclude with a thoughtful ending (often a prayer).

## LANGUAGE REQUIREMENTS
- The entire essay must be in **pure Lisan-ud-Dawat**. Use vocabulary and sentence structures typical of Dawoodi Bohra sermons.
- Study the following short phrases for style inspiration, but **create entirely new sentences**:
  ${styleHints}
- Do **not** mention any Sahabah, Khalifas, or contemporary figures by name – only Allah and the Prophet ﷺ may be referenced.

## FEW-SHOT EXAMPLE (STUDY THIS FOR STYLE – DO NOT COPY)
Below is a perfect example of a Lisan-ud-Dawat insha. Study its structure, vocabulary, and flow, but create a completely new essay for the given topic.
--- BEGIN EXAMPLE ---
${perfectExample}
--- END EXAMPLE ---

## OUTPUT
Return **only the essay text** – no headings, no notes, no explanations. The essay should be a single block of text (paragraphs separated by blank lines) in Lisan-ud-Dawat script. Remember: it must be at least ${words} words long.
`;

    // ============================================================
    // 7. GENERATION CONFIG (maximised for length & quality)
    // ============================================================
    const maxTokens = Math.min(parseInt(words) * 4 + 1000, 8000); // generous for 600+ words

    try {
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
            console.error('Gemini API error:', JSON.stringify(data, null, 2));
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
};
