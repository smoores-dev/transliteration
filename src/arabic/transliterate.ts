// biome-ignore-all lint: imported from arabic-transliterate
import { Mapping } from '../common/map';

export function transliterate(input: string) {
  // Arabic Unicode : exact appearing letter available in multiple planes and mapped here
  const mapping = new Mapping();

  let ligatures;

  /*
      const fixedligatures = fixedligatures.json;
    */

  const arabicToLatin = {
    ' ': ' ',
    ',': ',',
    ';': ';',
    '?': '?',
    '!': '!',
    '"': '"',
    "'": "'",
    '(': '(',
    ')': ')',
    ':': ':',
    '+': '+',
    '=': '=',
    '/': '/',
    '-': '-',
    '<': '<',
    '>': '>',
    '*': '*',
    '|': '|',
    '\\': '\\',
    '﷼': '€',
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    _: '_',
    '%': '%',
    '@': '@',
    ˆ: 'ˆ',
    '`': '`',
    '´': '´',
    '˜': '˜',
    '·': '·',
    '˙': '˙',
    '¯': '¯',
    '¨': '¨',
    '˚': '˚',
    '˝': '˝',
    ˇ: 'ˇ',
    '¸': '¸',
    '˛': '˛',
    '˘': '˘',
    '’': '’',
    '،': ',',
    '؍': '/',
    '؎': '§',
    '؏': '',
    '؛': ';',
    '؞': ':',
    '؟': '?',
    '٭': '*',
    '۔': '.',
    '۝': '',
    '۞': '',
    '۩': '',
    '۽': '',
    '﴾': ')',
    '﴿': '(',
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٪': '%',
    '؆': '∛',
    '؇': '∜',
    '؉': '‰',
    '؊': '‱',
    ﺞ: 'j',
    ﺠ: 'j',
    ﺟ: 'j',
    ﺝ: 'j',
    ـج: 'j',
    ـجـ: 'j',
    جـ: 'j',
    ج: 'j',
    ﺚ: 'th',
    ﺜ: 'th',
    ﺛ: 'th',
    ﺙ: 'th',
    ـث: 'th',
    ـثـ: 'th',
    ثـ: 'th',
    ث: 'th',
    ﺖ: 't',
    ﺘ: 't',
    ﺗ: 't',
    ﺕ: 't',
    ـت: 't',
    ـتـ: 't',
    تـ: 't',
    ت: 't',
    ﺐ: 'b',
    ﺒ: 'b',
    ﺑ: 'b',
    ﺏ: 'b',
    ـب: 'b',
    ـبـ: 'b',
    بـ: 'b',
    ب: 'b',
    ﺲ: 's',
    ﺴ: 's',
    ﺳ: 's',
    ﺱ: 's',
    ـس: 's',
    ـسـ: 's',
    سـ: 's',
    س: 's',
    ﺰ: 'z',
    ﺯ: 'z',
    ـز: 'z',
    ز: 'z',
    ﺮ: 'r',
    ﺭ: 'r',
    ـر: 'r',
    ر: 'r',
    ﺬ: 'dh',
    ﺫ: 'dh',
    ـذ: 'dh',
    ذ: 'dh',
    ﺪ: 'd',
    ﺩ: 'd',
    ـد: 'd',
    د: 'd',
    ﺦ: 'kh',
    ﺨ: 'kh',
    ﺧ: 'kh',
    ﺥ: 'kh',
    ـخ: 'kh',
    ـخـ: 'kh',
    خـ: 'kh',
    خ: 'kh',
    ﺢ: 'ḥ',
    ﺤ: 'ḥ',
    ﺣ: 'ḥ',
    ﺡ: 'ḥ',
    ـح: 'ḥ',
    ـحـ: 'ḥ',
    حـ: 'ḥ',
    ح: 'ḥ',
    ﻆ: 'ẓ',
    ﻈ: 'ẓ',
    ﻇ: 'ẓ',
    ﻅ: 'ẓ',
    ـظ: 'ẓ',
    ـظـ: 'ẓ',
    ظـ: 'ẓ',
    ظ: 'ẓ',
    ﻂ: 'ṭ',
    ﻄ: 'ṭ',
    ﻃ: 'ṭ',
    ﻁ: 'ṭ',
    ـط: 'ṭ',
    ـطـ: 'ṭ',
    طـ: 'ṭ',
    ط: 'ṭ',
    ﺾ: 'ḍ',
    ﻀ: 'ḍ',
    ﺿ: 'ḍ',
    ﺽ: 'ḍ',
    ـض: 'ḍ',
    ـضـ: 'ḍ',
    ضـ: 'ḍ',
    ض: 'ḍ',
    ﺺ: 'ṣ',
    ﺼ: 'ṣ',
    ﺻ: 'ṣ',
    ﺹ: 'ṣ',
    ـص: 'ṣ',
    ـصـ: 'ṣ',
    صـ: 'ṣ',
    ص: 'ṣ',
    ﺶ: 'sh',
    ﺸ: 'sh',
    ﺷ: 'sh',
    ﺵ: 'sh',
    ـش: 'sh',
    ـشـ: 'sh',
    شـ: 'sh',
    ش: 'sh',
    ﻚ: 'k',
    ﻜ: 'k',
    ﻛ: 'k',
    ﻙ: 'k',
    ـك: 'k',
    ـڪ: 'k',
    ـکـ: 'k',
    كـ: 'k',
    ڪـ: 'k',
    ڪ: 'k',
    ك: 'k',
    ﻖ: 'q',
    ﻘ: 'q',
    ﻗ: 'q',
    ﻕ: 'q',
    ـق: 'q',
    ـقـ: 'q',
    قـ: 'q',
    ق: 'q',
    ﻒ: 'f',
    ﻔ: 'f',
    ﻓ: 'f',
    ﻑ: 'f',
    ـف: 'f',
    ـفـ: 'f',
    فـ: 'f',
    ف: 'f',
    ﻎ: 'gh',
    ﻐ: 'gh',
    ﻏ: 'gh',
    ﻍ: 'gh',
    ـغ: 'gh',
    ـغـ: 'gh',
    غـ: 'gh',
    غ: 'gh',
    ﻊ: 'ʿ',
    ﻌ: 'ʿ',
    ﻋ: 'ʿ',
    ﻉ: 'ʿ',
    ـع: 'ʿ',
    ـعـ: 'ʿ',
    عـ: 'ʿ',
    ع: 'ʿ',
    ﻴ: 'y',
    ﻳ: 'y',
    ﻱ: 'y',
    ـي: 'y',
    ـيـ: 'y',
    يـ: 'y',
    ي: 'y',
    ﮮ: 'ī',
    ﮯ: 'ī',
    ے: 'ī',
    ﻮ: 'w',
    ﻭ: 'w',
    ـو: 'w',
    و: 'w',
    ﻪ: 'h',
    ﻬ: 'h',
    ﻫ: 'h',
    ﻩ: 'h',
    ـه: 'h',
    ـهـ: 'h',
    هـ: 'h',
    ه: 'h',
    ﻦ: 'n',
    ﻨ: 'n',
    ﻧ: 'n',
    ﻥ: 'n',
    ـن: 'n',
    ـنـ: 'n',
    نـ: 'n',
    ن: 'n',
    ﻢ: 'm',
    ﻤ: 'm',
    ﻣ: 'm',
    ﻡ: 'm',
    ـم: 'm',
    ـمـ: 'm',
    مـ: 'm',
    م: 'm',
    ﻞ: 'l',
    ﻠ: 'l',
    ﻟ: 'l',
    ﻝ: 'l',
    ـل: 'l',
    ـلـ: 'l',
    لـ: 'l',
    ل: 'l',
    '\u066B': '.',
    '٬': ',',
    ﺀ: 'ʾ',
    ء: 'ʾ',
    ﺔ: 't',
    ﺓ: 'a',
    ـة: 't',
    ة: 'a',
    پ: '',
    ﭖ: '',
    چ: '',
    ﭺ: '',
    ژ: '',
    ﮊ: '',
    گ: '',
    ﮒ: '',
    ال: 'al-',
  };
  // TODO  "ال":"al-" and  "ال":"-l-"
  // TODO "ة" : "at", "ة":"h" , "ة":"a"
  const vowels = {
    ا: 'a',
    ﺎ: 'a',
    ﺍ: 'a',
    ﴼ: 'ā',
    ﴽ: 'ā',
    ای: 'ā',
    ﻭ: 'u',
    و: 'ū',
    ﻱ: 'ī',
    ي: 'ī',
    'ّيِ': 'ī',
    'ّوُ': 'ū',
    وَ: 'aw',
    یَ: 'ay',
    '\u064E': 'a',
    '\u0618': 'a',
    '\uFE76': 'a',
    '\uFE77': 'a',
    '\u064F': 'u',
    '\u0619': 'u',
    '\uFE78': 'u',
    '\uFE79': 'u',
    '\u0650': 'i',
    '\u061A': 'i',
    '\uFE7A': 'i',
    '\uFE7B': 'i',
    'ا َ': 'ā',
    'ا ُ': 'ū',
    'ا ِ': 'ī',
    '\uFE74': 'in',
    '\u08F2': 'in',
    '\u064D': 'in',
    '\uFE72': 'un',
    '\u08F1': 'un',
    '\u064C': 'un',
    '\uFE70': 'an',
    '\uFE71': 'an',
    '\u08F0': 'an',
    '\u064B': 'an',
    أُ: 'u',
    أَ: 'a',
    إِ: 'i',
    ئُ: 'ū',
    ئِ: 'i',
    ـئ: 'i',
    ـئـ: 'i',
    ئـ: 'i',
    ئ: 'i',
    ـؤ: 'u',
    ؤ: 'u',
    ـإ: 'i',
    إ: 'i',
    ٵ: 'a',
    ـأ: 'a',
    أ: 'a',
    ـآ: 'ā',
    آ: 'ā',
    ـى: 'y',
    ـىـ: 'y',
    ىـ: 'ā',
    ى: 'y',
    ؤُ: 'u',
    أْ: 'a',
    ئْ: 'i',
    ؤْ: 'u',
    ﱝ: '',
    ﲐ: '',
    'ٔ': 'ʾ',
    'ٕ': 'ʾ',
  }; // TODO Reading Flow only then required "أُ":"ʾu","أَ":"ʾa","إِ":"ʾi"
  const diacritics: Record<string, string> = {};
  ligatures = {
    ﻻ: 'la',
    ﻼ: 'la',
    لأ: 'laʾ',
    لْأ: 'laʾ',
    ﻶ: 'lā',
    ﻸ: 'laʾ',
    ﻹ: 'laʾ',
    ﻺ: 'laʾ',
  };

  // TODO determine vocalised or unvocalised in text
  const textVocalisation = [
    '\uFE70',
    '\uFE71',
    '\uFE72',
    '\uFE74',
    '\u08F0',
    '\u08F1',
    '\u08F2',
    '\u064C',
    '\u064D',
    '\u064B',
    '\u08F0',
    '\u08F1',
    '\u08F2',
    '\u064E',
    '\u0618',
    '\uFE76',
    '\uFE77',
    '\u064F',
    '\u0619',
    '\uFE78',
    '\uFE79',
    '\u0650',
    '\uFE7A',
    '\uFE7B',
    '\u061A',
    '◌ٰ',
    '◌ٖ',
    '\uFE7E',
    '\u0652',
  ];
  // Fatha, Kasra, Damma : Normal, Small, Isolated, Medial forms included above
  const shaddaForms = [
    '\uFC5E',
    '\uFC60',
    '\uFC61',
    '\uFC62',
    '\uFC63',
    '\uFCF2',
    '\uFCF3',
    '\uFCF4',
    '\uFC5F',
    '\u0651',
    '\uFE7D',
    '\uFE7C',
  ];

  let resultLa = '';
  const textAr = input;

  // TODO - Normalisation of Arabic - Unicode block : U+060 to U+06F
  // textAr = textAr

  for (let u = 0; u < textAr.length; u++) {
    if (textAr[u].indexOf('\n') > -1) {
      resultLa = resultLa + '\n';
    } else if (textAr[u] && diacritics[textAr[u]]) {
      //console.log("1. Diacritic ", textAr[u], " : " , diacritics[textAr[u]] )
      resultLa = resultLa + diacritics[textAr[u]];
    } else if (textAr[u] && ligatures[textAr[u]]) {
      //console.log("2. Ligature ", textAr[u], " : " , ligatures[textAr[u]] )
      resultLa = resultLa + ligatures[textAr[u]];
    } else if (textAr[u] && shaddaForms.indexOf(textAr[u]) > -1) {
      // Shadda rules
      /* if (vowels[textAr[u-1]] == "a" && !arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels]) {
            //console.log("3. Shadda - a long ", textAr[u], vowels[textAr[u-1] as keyof typeof vowels])
            resultLa = resultLa.slice(0, -1) + "ā";
          } else if (vowels[textAr[u-1]] == "i" && !arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels]) {
            //console.log("3. Shadda - i long ", textAr[u], vowels[textAr[u-1] as keyof typeof vowels])
            resultLa = resultLa.slice(0, -1) + "ī";
          } else if (vowels[textAr[u-1]] == "u" && !arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels]) {
            //console.log("3. Shadda - u long ", textAr[u], vowels[textAr[u-1] as keyof typeof vowels as keyof typeof vowels])
            resultLa = resultLa.slice(0, -1) + "ū";
          } else */
      if (
        textVocalisation.indexOf(textAr[u - 1]) > -1 &&
        !arabicToLatin[
          textAr[
            u - 1
          ] as keyof typeof arabicToLatin as keyof typeof arabicToLatin
        ] &&
        vowels[textAr[u - 1] as keyof typeof vowels as keyof typeof vowels] !=
          'a' &&
        vowels[textAr[u - 1] as keyof typeof vowels] != 'i' &&
        vowels[textAr[u - 1] as keyof typeof vowels] != 'u'
      ) {
        //console.log("3. Shadda - vocalised ", textAr[u], textVocalisation.indexOf(textAr[u-1]))
        resultLa = resultLa + resultLa[resultLa.length - 1];
      } /*  else if (arabicToLatin[textAr[u-1]] && arabicToLatin[textAr[u-1]].length == 2 && !arabicToLatin[textAr[u+2]] && textAr[u+2 as keyof typeof arabicToLatin] != " ") {
            //console.log("3. Shadda 2-consonant not followed by consonant - ", textAr[u], arabicToLatin[textAr[u-1] + textAr[u-2] as keyof typeof arabicToLatin])
            resultLa = resultLa + resultLa[resultLa.length - 2] + resultLa[resultLa.length - 1] + "a";
          } */ else if (
        arabicToLatin[textAr[u - 1] as keyof typeof arabicToLatin] &&
        arabicToLatin[textAr[u - 1] as keyof typeof arabicToLatin].length == 2
      ) {
        //console.log("3. Shadda 2-consonant - ", textAr[u], arabicToLatin[textAr[u-1] + textAr[u-2] as keyof typeof arabicToLatin])
        resultLa =
          resultLa +
          resultLa[resultLa.length - 2] +
          resultLa[resultLa.length - 1];
      } /*  else if (arabicToLatin[textAr[u-1]] && arabicToLatin[textAr[u-1]].length == 1 && arabicToLatin[textAr[u+2]] && textAr[u+2 as keyof typeof arabicToLatin] != " ") {
            //console.log("3. Shadda 1-consonant not followed by consonant - ", textAr[u], arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin])
            resultLa = resultLa + resultLa[resultLa.length - 1] + "a";
          } */ else if (
        arabicToLatin[textAr[u - 1] as keyof typeof arabicToLatin] &&
        arabicToLatin[textAr[u - 1] as keyof typeof arabicToLatin].length == 1
      ) {
        //console.log("3. Shadda 1-consonant - ", textAr[u], arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin])
        resultLa = resultLa + resultLa[resultLa.length - 1];
      } else {
        //console.log("3. Shadda - ", textAr[u], arabicToLatin[textAr[u-1] as keyof typeof arabicToLatin])
        resultLa =
          resultLa.slice(0, -1) +
          resultLa[resultLa.length - 2] +
          resultLa[resultLa.length - 1];
      }
    } else if (
      ((textAr[u - 2] == ' ' &&
        textAr[u - 1] &&
        textAr[u] != '' &&
        textAr[u + 2] == ' ') ||
        (textAr[u - 2] == ' ' &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == '\n') ||
        (textAr[u - 2] == '\n' &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == ' ') ||
        (textAr[u - 2] == ' ' &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == undefined) ||
        (textAr[u - 2] == '\n' &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == undefined) ||
        (textAr[u - 2] == undefined &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == ' ') ||
        (textAr[u - 2] == '\n' &&
          textAr[u - 1] &&
          textAr[u] != '' &&
          textAr[u + 2] == '\n') ||
        (textAr[u - 2] == undefined &&
          textAr[u - 1] &&
          textAr[u + 2] == undefined)) &&
      (arabicToLatin[
        (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
      ] ||
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels])
    ) {
      // Isolate double position
      if (vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]) {
        //console.log("4. Isolate double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1] as keyof typeof vowels])
        resultLa =
          resultLa.slice(0, -1) +
          vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]; // Isolate double vowel position
      } else {
        //console.log("4. Isolate double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1] as keyof typeof arabicToLatin])
        resultLa =
          resultLa.slice(0, -1) +
          arabicToLatin[
            (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
          ]; // Isolate double consonant position
      }
    } else if (
      textAr[u + 1] == ' ' &&
      arabicToLatin[(textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin]
    ) {
      // Initial position with double character consonant
      //console.log("5. Initial double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1] as keyof typeof arabicToLatin])
      resultLa =
        resultLa.slice(0, -1) +
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ];
    } else if (
      textAr[u + 1] == ' ' &&
      vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]
    ) {
      // Initial position with double character vowel
      //console.log("6. Initial double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1] as keyof typeof vowels])
      resultLa =
        resultLa.slice(0, -1) +
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels];
    } else if (
      textAr[u] &&
      arabicToLatin[(textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin]
    ) {
      // Medial Position with double character consonant
      //console.log("7. Medial double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1] as keyof typeof arabicToLatin])
      resultLa =
        resultLa.slice(0, -1) +
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ];
    } else if (
      textAr[u] &&
      vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]
    ) {
      // Medial Position with double character vowel
      //console.log("8. Medial double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1] as keyof typeof vowels])
      resultLa =
        resultLa.slice(0, -1) +
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels];
    } else if (
      (textAr[u - 1] == ' ' &&
        textAr[u] &&
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ]) ||
      (textAr[u - 1] == '\n' &&
        textAr[u] &&
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ]) ||
      (textAr[u - 1] == undefined &&
        textAr[u] &&
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ])
    ) {
      // Final double character consonant position
      //console.log("9. Final double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1] as keyof typeof arabicToLatin])
      resultLa =
        resultLa.slice(0, -1) +
        arabicToLatin[
          (textAr[u] + textAr[u - 1]) as keyof typeof arabicToLatin
        ]; // TODO OT & MT "ه" is NOT final and ة constructed rules
    } else if (
      (textAr[u - 1] == ' ' &&
        textAr[u] &&
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]) ||
      (textAr[u - 1] == '\n' &&
        textAr[u] &&
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels]) ||
      (textAr[u - 1] == undefined &&
        textAr[u] &&
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels])
    ) {
      // Final double character vowel position
      //console.log("10. Final double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1] as keyof typeof vowels])
      resultLa =
        resultLa.slice(0, -1) +
        vowels[(textAr[u] + textAr[u - 1]) as keyof typeof vowels];
    } else if (
      ((textAr[u - 1] == ' ' && textAr[u] != '' && textAr[u + 1] == ' ') ||
        (textAr[u - 1] == ' ' && textAr[u] != '' && textAr[u + 1] == '\n') ||
        (textAr[u - 1] == '\n' && textAr[u] != '' && textAr[u + 1] == ' ') ||
        (textAr[u - 1] == ' ' &&
          textAr[u] != '' &&
          textAr[u + 1] == undefined) ||
        (textAr[u - 1] == '\n' &&
          textAr[u] != '' &&
          textAr[u + 1] == undefined) ||
        (textAr[u - 1] == undefined &&
          textAr[u] != '' &&
          textAr[u + 1] == ' ') ||
        (textAr[u - 1] == '\n' && textAr[u] != '' && textAr[u + 1] == '\n') ||
        (textAr[u - 1] == undefined &&
          textAr[u] != '' &&
          textAr[u + 1] == undefined)) &&
      (arabicToLatin[textAr[u] as keyof typeof arabicToLatin] ||
        vowels[textAr[u] as keyof typeof vowels])
    ) {
      // Isolate position
      if (vowels[textAr[u] as keyof typeof vowels]) {
        //console.log("11. Isolate vowel ", textAr[u] , " : ", vowels[textAr[u] as keyof typeof vowels])
        resultLa = resultLa + vowels[textAr[u] as keyof typeof vowels]; // Isolate vowel position
      } else {
        //console.log("11. Isolate consonant ", textAr[u] , " : ", arabicToLatin[textAr[u] as keyof typeof arabicToLatin])
        resultLa =
          resultLa + arabicToLatin[textAr[u] as keyof typeof arabicToLatin]; // Isolate consonant position
      }
    } else if (
      textAr[u] &&
      textAr[u - 1] == ' ' &&
      arabicToLatin[textAr[u] as keyof typeof arabicToLatin]
    ) {
      // Initial consonant position
      //console.log("12. Initial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u] as keyof typeof arabicToLatin])
      resultLa =
        resultLa + arabicToLatin[textAr[u] as keyof typeof arabicToLatin]; // TODO Capitalisation of Letter
    } else if (
      textAr[u] &&
      textAr[u - 1] == ' ' &&
      vowels[textAr[u] as keyof typeof vowels]
    ) {
      // Initial vowel position
      //console.log("13. Initial vowel ", textAr[u] , " : ", vowels[textAr[u] as keyof typeof vowels])
      resultLa = resultLa + vowels[textAr[u] as keyof typeof vowels]; // TODO Capitalisation of Letter
    } else if (
      (textAr[u - 1] == ' ' &&
        textAr[u] &&
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin]) ||
      (textAr[u - 1] == '\n' &&
        textAr[u] &&
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin]) ||
      (textAr[u - 1] == undefined &&
        textAr[u] &&
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin])
    ) {
      // Final consonant position
      if (
        textAr[u] == 'ـة' ||
        textAr[u] == 'ﺔ' ||
        textAr[u] == 'ﺓ' ||
        textAr[u] == 'ة'
      ) {
        //console.log("14. Final consonant - constructus modus ", textAr[u])
        resultLa = resultLa + 'a';
      } else {
        //console.log("14. Final consonant ", textAr[u] , " : ", arabicToLatin[textAr[u] as keyof typeof arabicToLatin])
        resultLa =
          resultLa + arabicToLatin[textAr[u] as keyof typeof arabicToLatin]; // TODO OT & MT "ه" is NOT final
      }
    } else if (
      (textAr[u - 1] == ' ' &&
        textAr[u] &&
        vowels[textAr[u] as keyof typeof vowels]) ||
      (textAr[u - 1] == '\n' &&
        textAr[u] &&
        vowels[textAr[u] as keyof typeof vowels]) ||
      (textAr[u - 1] == undefined &&
        textAr[u] &&
        vowels[textAr[u] as keyof typeof vowels])
    ) {
      // Final vowel position
      //console.log("15. Final vowel ", textAr[u] , " : ", vowels[textAr[u] as keyof typeof vowels])
      resultLa = resultLa + vowels[textAr[u] as keyof typeof vowels];
    } else if (
      textAr[u] &&
      arabicToLatin[textAr[u] as keyof typeof arabicToLatin]
    ) {
      // Medial consonant Position
      if (
        (textAr[u] == 'ﺓ' || textAr[u] == 'ة') &&
        textAr[u + 1] != ' ' &&
        textAr[u + 1] != '\n' &&
        textAr[u + 1] != undefined
      ) {
        //console.log("16. Medial consonant - constructus modus ", textAr[u])
        resultLa = resultLa + 't';
      } else if (
        (textAr[u] == 'ﺓ' || textAr[u] == 'ة') &&
        vowels[textAr[u - 1] as keyof typeof vowels] != 'a'
      ) {
        //console.log("16. Medial consonant - constructus modus ", textAr[u])
        resultLa = resultLa + 'a';
      } else if (
        (textAr[u] == 'ﺓ' || textAr[u] == 'ة') &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a'
      ) {
        //console.log("16. Medial consonant - constructus modus ", textAr[u])
        resultLa = resultLa.slice(0, -1) + 'ā';
      } else if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'y' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'i'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ī';
      } else {
        //console.log("16. Medial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u] as keyof typeof arabicToLatin])
        resultLa =
          resultLa + arabicToLatin[textAr[u] as keyof typeof arabicToLatin];
      }
      if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'l' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a'
      ) {
        // al-
        //console.log("16. Medial consonant al- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels])
        resultLa = resultLa + '-';
      } else if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'l' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'i'
      ) {
        //il-
        //console.log("16. Medial consonant il- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels])
        resultLa = resultLa + '-';
      } else if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'l' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'u'
      ) {
        //ul-
        //console.log("16. Medial consonant ul- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels])
        resultLa = resultLa + '-';
      } else if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'l' &&
        textAr[u - 1] == 'ٱ'
      ) {
        // l-
        //console.log("16. Medial consonant l- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels])
        resultLa = resultLa + '-';
      } else if (
        arabicToLatin[textAr[u] as keyof typeof arabicToLatin] == 'w' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'u'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", arabicToLatin[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof arabicToLatin as keyof typeof vowels])
        resultLa = resultLa.slice(0, -2) + 'ū';
      }
    } else if (textAr[u] && vowels[textAr[u] as keyof typeof vowels]) {
      // Medial vowel Position
      //console.log("17. Medial vowel ", textAr[u] , " : ", vowels[textAr[u] as keyof typeof vowels])

      // TODO 3 character vowels and long vowels : إِ followed by ي = ī
      // ءُ followed by و = ū or ئِ followed by ي = ī or أُ followed by و = ū
      // ا َ followed by ءْ = ā

      if (
        vowels[textAr[u] as keyof typeof vowels] == 'a' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a' &&
        textAr[u - 1] + textAr[u] != 'أَ' &&
        textAr[u - 1] + textAr[u] != 'ﺍَ'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ā';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'a' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a' &&
        (textAr[u - 1] + textAr[u] == 'ﺍَ' || textAr[u - 1] + textAr[u] == 'أَ')
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa;
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'a' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'ʾa'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -2) + 'a'; // TODO Reading Flow only then ʾā
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'a' &&
        shaddaForms.indexOf(textAr[u - 1]) > -1
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ā';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'an' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'an'; // "ān"
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'ā' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ā';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'i' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'i'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ī';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'i' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'ʾi'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -2) + 'ʾī';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'i' &&
        (textAr[u - 1] == 'ا' ||
          vowels[textAr[u - 1] as keyof typeof vowels] == 'a')
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'i';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'in' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'i'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'in'; // "īn"
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'u' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'u'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ū';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'u' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'a'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'u';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'u' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'ʾa'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -2) + 'u';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'u' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'ʾu'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -2) + 'ʾū';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'u' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'ا'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'ū';
      } else if (
        vowels[textAr[u] as keyof typeof vowels] == 'un' &&
        vowels[textAr[u - 1] as keyof typeof vowels] == 'u'
      ) {
        //console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1] as keyof typeof vowels])
        resultLa = resultLa.slice(0, -1) + 'un'; // "ūn"
      } else {
        resultLa = resultLa + vowels[textAr[u] as keyof typeof vowels];
      }
    }
  }
  // Form īīaa should be īya or iyya
  if (resultLa.indexOf('īīaa') > -1) {
    //
    const unprocessed = resultLa.split(' ');
    let processed = '';
    const arabicWords = textAr.split(' ');

    for (let i = 0; i < unprocessed.length; i++) {
      if (arabicWords[i] && unprocessed[i].indexOf('īīaa') > -1) {
        //console.log("word being processed īīaa ", unprocessed[i])
        processed =
          processed +
          unprocessed[i].replace('īīaa', 'īya') +
          ' ' +
          unprocessed[i].replace('īīaa', 'iyya') +
          ' ';
      } else {
        //console.log("word not processed ", unprocessed[i])
        processed = processed + unprocessed[i] + ' ';
      }
    }
    resultLa = processed;
  }
  resultLa = resultLa
    .replaceAll(' il-', ' il')
    .replaceAll('-il-', '-il')
    .replaceAll(' ul-', ' ul')
    .replaceAll('-ul-', '-ul'); // il-,ul- : when non-definite article used

  return { result: resultLa, mapping };
}
/*
  Github : https://github.com/Vyshantha/arabic-transliterate/
  NPM Package : https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/
    https://snyk.io/blog/best-practices-create-modern-npm-package/
    https://docs.npmjs.com/creating-node-js-modules

  npm init
  npm link (test)
  npm link <name-of-package>
  node script.js

  npm login
  npm publish

  npm install <name-of-package>
*/
