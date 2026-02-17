export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, type, words, includeAyah } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_KEY;

    // Short style hints – replace with your own if desired
    const styleHints = `1447 - المجلس الثاني
اسس برادرو! تاراؤ ني تأثير نو علم ححهسس مككر ايم نھ بنسس كه كوئي يه علم جاني نسس تاراؤ نوايمان لاوسس، انسس ايم كهي دسس كه جه ححهسس تھ تاراؤ ححهسس، تاراؤ} سككلي ححيزو كرسس ححهسس، انسس اْ وات بھولي جائي كه اهنا ثثيدا نا كرنار خدا ححهسس، كه جه ني مشيئة سي سككلو تهائي ححهسس، اْ مثل كوئي اعتقاد راكهسس تو يه كفر ني وات ححهسس، اْسمان نا بروج انسس تاراؤ تمام عالَم ثثر تأثير ناكهسس ححهسس جه نا سبب تمام عالَم ني نشؤونما تهائي ححهسس، مككر خود يه بروج ثثر تأثير كون ناكهسس ححهسس كه روحاني تاراؤ جه اولياء الله ححهسس.
***
مؤمنين ني جماعة! تو جه مثل افلاك انسس خصوصًا فلك البروج ككهنا محفوظ ححهسس انسس ككهنا بلند ححهسس، يه} مثل سازوار ححهسس كه مؤمنين نا ككهرو ما بروج ني خوبيو هوئي، 
يھ سوطط؟ كه مؤمنين انسس مؤمنين نا ككهرو انسس يه سككلا ني هر ححيز بلندي ني نهاية ثثر هوئي انسس محفوظ هوئي، انسس جه مثل تاراؤ اولياء الله ني تأثير قبول كرسس ححهسس يه} مثل مؤمنين انسس مؤمنين نا ككهرو هوئي، جه ما يه سككلا انسس اهنا فرزندو ولي  الله ني تأثير قبول كرتا هوئي،
امام احمد المستور يه مدينة فاضلة روحانية ني ذكر فرماوي، انسس ايم واضح كيدو ححهسس كه هر مؤمن نو ككهر يه شان نو هوئي كه زمين نا لوككو نا بد  اخلاق نو اثر اهنا ثثر نھ ثثرٌسس، باطل نا لوككو نا علم نا موج نو اثر بهي اهنا ثثر نھ ثثرٌسس، خراب عقيدة نو دُهنوو بهي اهني طرف نھ ححرٌهسس، بلكه هر مؤمن نو ككهر اتنو بلند هوئي كه بيسرا ككهرو ثثر اشراف كرسس، يعني مؤمن نو ككهر بيسرا لوككو واسطسس خير ني مثال بنسس، سككلا ايم ححاهسس كه سككلا نا ككهرو بهي مؤمن نا ككهر ني مثل بلند انسس محفوظ هوئي. 
***
مؤمنين ني جماعة! ثثظظلا بُرج نو نام حَمَل ححهسس  - Aries ححهسس، حَمَل يعني بكري نو بححو، امام احمد المستور فرماوسس ححهسس، كه حَمَل ني خاصية سوطط ححهسس، كه اهما حلم - يعني بُردباري هوئي ححهسس، جه نسس English ما forbearance كظظوا ما اْوسس ححهسس، 
بُردبار شخص كون كظظوائي، كه جه شخص ما تحمّل كروا ني، صبر انسس برداشت كروا ني قوة هوئي  ...
اسس بُردبار لوككو! مؤمنين نا ككهرو ما بهي يه مثل باوا ماطط نسس حلم سي انسس بُردباري سي عمل كروو جوئيسس، والدين نسس صبر انسس برداشت كروا ني خوبي اثثناوي جوئيسس، فرزندو نا سؤالو سي انسس اهنسس جوابو ديوا سي تهاكي نھ جاوو جوئيسس، انسس غُصّھ نھ تهاوو جوئيسس، انسس هرككز كوئي بهي سبب سي فرزندو نسس ماروو تو نھ} جوئيسس.
***
اسس دانشمندو! بار بُروج ما سي بيسرو بُرج ثَور ححهسس - Taurus، ثَور يعني بَيل، اهني ذكر ما امام احمد المستور فرماوسس ححهسس كه يه مِحنتو انسس جفاكش هوئي ححهسس، hardworking هوئي ححهسس، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه لوككو جنائي ححهسس يه اهنا hard work ما ككهنا stable هوئي ححهسس، ككهني محنة كرسس ححهسس... 
تو اسس عزيزو! height of hard work سوطط ححهسس كه كوئي شخص محنة كري كري نسس independent بني جائي، يه مثل هر مؤمن نا ككهر ما بهي فرزندو نسس جفاكشي سكهاوي جوئيسس، غرض يه كه هر كام خود كري سكسس.   
***
مؤمنين ني جماعة! هوسس تيسرو بُرج جَوزاء ححهسس - Gemini... جه اْ بُرج ني تأثير ما جنائي ححهسس تھ شخص multifaceted هوئي ححهسس، الكك الكك خوبيو اهما هوئي ححهسس، انسس ايم بهي بنسس كه ايك خوبي نا ساتهـ اهني opposite خوبي بهي اهما هوئي... 
هوسس height of being multifaceted سوطط ححهسس كه انسان اهني الكك الكك خوبي نسس برابر اهنا موقع ما استعمال كرسس، جه نا سبب اهني طبيعة ما توازن اْوسس، اعتدال اْوسس... يه} مثل هر ماطط باوا نسس اهنا فرزندو ني تربية balance راكهي نسس كروي جوئيسس. 
***
اسس بھائيو انسس بهنو! ححوتھو بُرج سَرَطان ححهسس - Cancer ححهسس... اْ بُرج ني تأثير ما جه جنايا هوئي يه ككهنا loyal هوئي ححهسس، وفادار هوئي ححهسس...
اسس والدين ني جماعة! تميطط سككلا تمارا ككهرو ما حسين امام يه جه وفاداري نو عظيم درس سكهايو ححهسس اهني روشني ما فرزندو ني تربية كرجو، فرزندو نسس وفادار بناؤجو، يه سككلا ويثثار نا امور ما، family نا امور ما، دوستو نا امور ما، عباد  الله نا امور ما، مُلك نا امور ما، مؤمنين نا امور ما، جماعة نا امور ما، يه مثل هر امر ما وفادار هوئي، انسس سككلا كرتا اعلى يه كه ولي الله ساتهسس وفادار هوئي، اهني محبة انسس خدمة ما جه كام كوئي نھ كرتو هوئي يه كرسس، انسس خدمة واسطسس جه جھ اُضضھاوو ثثرٌسس يه زحمة اُضضھاوسس، انسس اهما قرباني بهي اْثثوي ثثرٌسس تو اْثثي دسس، انسس فداء فداء تهئي  جائي.
***
اسس خردمندو! ثثانححمو بُرج اَسَد ححهسس - Leo، جه ما تاراؤ ني ككوضضھوَن كيوي ححهسس كه جه شخص اهنسس ديكهسس تو اهنسس ايك شير ني شكل ني مثل نظر اْوسس، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه جنايا هوئي ححهسس يه ككهنا confident هوئي ححهسس، امام احمد المستور فرماوسس ححهسس كه شير ني خاصية شجاعة يعني بهادُري ححهسس...
يھ} مثل ماطط باوا ككهر ما فرزندو نسس جهاد اكبر كروا واسطسس همة افزائي كرسس، يه سككلا هميشھ ثثوتانا نفس امّارة ساتهـ جهاد كرتا رهسس، غُصّھ نسس مارتا رهسس.
***
مؤمنين ني جماعة! ححھضضو بُرج سُنْبُلَة ححهسس - Virgo، سُنبُلَة يعني اناج نا دانھ ؤ نا خوشھ، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه جنايا هوئي ححهسس يه ككهنا practical هوئي ححهسس، انسس هر situation نسس برابر analyse كرسس ححهسس، اْ بُرج نا تاراؤ اهوي دٌهب سي موكايا ححهسس كه ايم نظر اْوسس ححهسس كه كُنوارا بئيرو ككيظظوطط نا خوشھ نسس اُضضھاوسس ححهسس، يه سوطط تعبير كرسس ححهسس كه اناج اُككي ككيو ححهسس انسس اهني كضضني تهئي ككئي ححهسس انسس خوشحالي اْوي ككئي ححهسس، 
خوشحالي يعني prosperity  ... مؤمنين واسطسس خوشحالي سوطط ححهسس كه هر situation نسس برابر analyse كري نسس سمجهي جائي كه اهما خدا ني نعمة ححهسس، انسس يه سككلا خدا ني نعمتو نو احساس كرسس، اهنا ثثر شكر كرتا هوئي، 
هوسس height of prosperity سوطط ححهسس كه زيادة ما زيادة خوشحالي نا موقع ثثر اْنسو نكالوو، كونا ثثر اْنسو نكالوو، كه جه مولى نا سبب خوشحالي باقي ححهسس... يه مولى كون كه سيد الشهداء امام حسين...
اسس مؤمنين مؤمنات! اْ مثل height of prosperity ثثر تمارا فرزندو ني تربية كرجو... فرزند امام حسين ني مجلس ما جائي، وعظ ما  جائي.
***
هوسس ساتمو بُرج ميزان ححهسس - Libra ححهسس، جه ما تاراؤ ني دٌھب ايك ترازو ني مثل نظر اْوسس ححهسس، ترازو انصاف كروا ني نشاني ححهسس، ايم كظظوائي ححهسس كه جه ني ولادة اْ بُرج ني تأثير ما تهائي ححهسس اهما fairness - يعني انصاف ني خوبي ككهني هوئي ححهسس...
كوئي شخص بيجا نا واسطسس ايم كهسس كه اْ ححيز اهنسس ملوي جوئيسس كيم كه يه زيادة اولى ححهسس، تو يه انصاف كظظوائي، مككر كوئي شخص نسس كوئي ححيز ملي} ككئي ححهسس انسس اهنا بعد ايم كهسس كه منسس نظظيطط بلكه بيجا نسس اْثثي دو تو يه height of fairness كظظوائي...
تو والدين نسس فرزندو ني اهوي تربية كروي جوئيسس، كه هر فرزند ايم خيال راكهسس كه خدا اهنا بهائي مؤمن نسس انسس هر مخلوق نسس جه بهي نعمة اْثثسس ححهسس يه عدل سي} اْثثسس ححهسس، كيم كه خدا ظلم كرسس} نظظيطط، اككر اْ مثل اهني صورة هسسس تو يه كوئي وار كوئي نسس حسد نظظيطط كرسس.  
***
مؤمنين ني جماعة! اْضضھمو بُرج عَقْرَب ححهسس  - Scorpio، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه جنائي ححهسس يه هميشھ مستقبل نو - future نو plan كرسس ححهسس، تدبير كرسس ححهسس ... Height of planning سوطط كه خدا ثثر توكل كه خدا بهتر} كرسسس ... تو ايك تدبير نا ساتهسس بيسري تدبيرو بهي كرتا رهوو جوئيسس، انسس هر ايك تدبير ما خدا ثثر بهروسو راكهوو جوئيسس، انسس اككر كوئي بهي تدبير ما كاميابي نھ ملسس تو تھ وقت زيادة خدا ثثر بهروسو راكهوو جوئيسس. 
***
اسس عزيز برادرو! نمو بُرج قَوس ححهسس - Sagittarius، يه بُرج نا تاراؤ ايك شخص ني مثل نظر اْوسس ححهسس جه نو اوثثر نو حصة انسان ححهسس انسس نيححسس نو حصة ككھورٌو ححهسس، جه يه كمان كهينححي نسس تير ساندهو ححهسس، 
جھ شخص تير نسس نشان ثثر مارسس ححهسس اهنسس focus كروا ني ضرورة ثثرٌسس ححهسس، ايم كظظوائي ححهسس كه اْ  بُرج ني تأثير ما جه جنايا هوئي ححهسس يه اهني طلب ما focused هوئي ححهسس...
يھ} مثل مؤمنين ايمان نا ككهر ما - والدين  - فرزندو ني اهوي تربية كرسس كه فرزندو هر كام برابر focus كري نسس كرسس.
***
اسس دوستو! دسمو بُرج جَدْي ححهسس - Capricorn، جَدي يعني سينككرٌا والو بكرو، امام احمد المستور فرماوسس ححهسس كه بكرا ني خاصية سوطط ححهسس كه مُسَالَمة - reconciliation، يعني صُلح كروو، جهككرٌو نھ كروو، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه جنائي ححهسس يه sensitive انسس caring هوئي ححهسس، يه كوئي نو دل نظظيطط دُكهاؤتا انسس جهككرٌو نظظيطط كرتا...
ايمان نا ككهر ما والدين فرزندو ني اهوي تربية كرسس كه فرزندو ما جهككرٌو كروا ني عادة نھ ثثرٌسس، مردو انسس بئيرو اْثثس ما جھككرٌو نظظيطط كرسس بلكه هميشھ ايك بيجا نسس سمجهسسس انسس خوشحال زندككي ككزارسسس تو فرزندو بهي يه} مثل عمل كرسسس، ككهنو خيال راكهوو جوئيسس سككلا نسس.
***
مؤمنين ني جماعة! اككيارمو بُرج دَلو ححهسس - Aquarius ححهسس، دَلو يعني دٌول، يه بُرج ما تاراؤ اهوي دٌهب سي موكايا هوا ححهسس كه كوئي ايك شخص دٌول ما سي ثثاني ريرٌي رهيا ححهسس، يه سوطط تعبير كرسس ححهسس كه هر مخلوق ثثر رحمة كروو انسس اهني حالة دُرست تهائي يه واسطسس كوشش كروو، ايم كظظوائي ححهسس كه جه ني ولادة اْ بُرج ني تأثير ما تهئي هوئي ححهسس يه بيسرا لوككونسس مدد كرنار هوئي ححهسس...
اسس برادرو! ايمان نا ككهر ما والدين نسس رحمة، شفقة انسس محبة سي فرزندو ني تربية كروي جوئيسس، فرزندو نسس  influence كري نسس اهني حالة نسس بظظتر حالة ني طرف change كرتا رهوو جوئيسس، اهنسس دُرست كرتا رهوو جوئيسس.
***
مؤمنين ني جماعة! بارمو بُرج حُوت ححهسس - Pisces، حُوت ني سوطط معنى كه مھوضضي مححھي، ايم كظظوائي ححهسس كه اْ بُرج ني تأثير ما جه جنائي ححهسس يه ككهنا perceptive هوئي ححهسس، يعني سمجهدار هوئي ححهسس، 
امام احمد المستور فرماوسس ححهسس كه حُوت ني خوبي يه ححهسس كه يه خاموش رهسس ححهسس، شور نتهي كرتي، يه سوطط تعبير كرسس ححهسس سككلو جانوا نا بعد بهي امانة داري سي بهيد نسس ححهثثاوو جوئيسس، confidentiality راكهوي جوئيسس... 
اسرار ني حفاظة كروا ني خوبي، امانة داري ني خوبي نسس اولياء الله ككهني مھوضضي خوبي ككردانسس ححهسس، 
تو اسس عزادارو! ايمان نا ككهر ما confidentiality ني بلندي هووي جوئيسس، سححو بولوا ثثر انسس سِر نسس ححھثثاوا ثثر فرزندو ني تربية تهاوي جوئيسس.
*** `;

    // Essay type descriptions
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
You are a master essay writer in **Lisan-ud-Dawat**, the language of the Dawoodi Bohra community. All the exampales are style guides to learn fromand are not context to copy from. 
You know that lisa ud dawat has their diffrent alphabeta which are not in arabic,
 so you have understood it and leearn the launguage as it is. You write in pure Lisan-ud-Dawat – a natural mix of Arabic, Urdu, and Gujarati written in Arabic script. You never use English or Roman letters in the essay.

## CRITICAL WORD COUNT REQUIREMENT
The user has requested an essay of **at least ${words} words**. You MUST write a complete essay that reaches this length. Do NOT stop until you have written at least ${words} words. If you finish the main ideas early, continue by adding more details, examples, explanations, relevant quotations, or further elaboration. Under no circumstances should you output a short response. The essay must be full and comprehensive.

## TASK
Write a **complete, well-structured** essay in **pure Lisan-ud-Dawat** on the topic: "${topic}".
The essay must follow the **${type}** style. Style description: ${typeDescription[type] || typeDescription.Other}.

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

## OUTPUT FORMAT
Return **only the essay text** – no headings, no notes, no explanations. The essay should be a single block of text (paragraphs separated by blank lines) in Lisan-ud-Dawat script. Remember: it must be at least ${words} words long. Start writing now.
`;

    try {
        // Use maximum tokens to ensure length
        const maxTokens = 8192; // max for gemini-2.5-flash

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
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
