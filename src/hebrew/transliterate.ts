// biome-ignore-all lint: imported from hebrew-transliteration
import { Text } from 'havarotjs';
import { SylOpts } from 'havarotjs/text';
import { Word } from 'havarotjs/word';
import { Mapping, StepMap } from '../common/map';
import { sylRules, wordRules } from './rules';
import { sblSimple } from './sbl-simple';
import { SBL, Schema } from './schema';

/**
 *  Gets the syllable options from a partial schema
 *
 * @private
 * @param schema
 * @returns syllable options passed into havarotjs
 *
 * @remarks
 * Sanitizes the SylOpts of the schema so as to not pass in undefined
 */
const getSylOpts = (schema: Partial<Schema>): SylOpts => {
  return {
    allowNoNiqqud: schema.allowNoNiqqud,
    article: schema.article,
    holemHaser: schema.holemHaser,
    ketivQeres: schema.ketivQeres,
    longVowels: schema.longVowels,
    qametsQatan: schema.qametsQatan,
    shevaAfterMeteg: schema.shevaAfterMeteg,
    shevaWithMeteg: schema.shevaWithMeteg,
    sqnmlvy: schema.sqnmlvy,
    strict: schema.strict,
    wawShureq: schema.wawShureq,
  };
};

/**
 * Transliterates Hebrew text according to a given schema
 *
 * @param text - a string or {@link https://charlesloder.github.io/havarotjs/classes/text.Text.html | Text} of Hebrew characters
 * @param schema - a {@link Schema} for transliterating the text
 * @returns a transliterated text
 *
 * @example
 * Default
 * ```ts
 * import { transliterate } from "hebrew-transliteration";
 *
 * transliterate("אֱלֹהִים");
 * // "ʾĕlōhîm";
 * ```
 *
 * @example
 * Using `Partial<Schema>`
 * ```ts
 * import { transliterate } from "hebrew-transliteration";
 *
 * transliterate("שָׁלוֹם", { SHIN: "sh" })
 * // shālôm
 * ```
 *
 * @example
 * Using a custom `Schema`
 * ```ts
 * import { transliterate, Schema } from "hebrew-transliteration";
 *
 * const schema = new Schema({ ALEF: "'", BET: "B", ... QAMETS: "A", ... }) // truncated for brevity
 *
 * transliterate("אָ֣ב", schema)
 * // 'AB
 * ```
 *
 * @remarks
 * If no {@link Schema} is passed, then the package defaults to SBL's academic style. You can pass in a partial schema that will modify SBL's academic style.
 * If you need a fully custom schema, it is best to use the {@link Schema} constructor.
 *
 */
export const transliterate = (text: string | Text) => {
  const transSchema = new SBL(sblSimple);
  const mapping = new Mapping();
  const newText =
    text instanceof Text ? text : new Text(text, getSylOpts(transSchema ?? {}));
  const transliterated = newText.words.map((word) => {
    const transliteration = wordRules(word, transSchema);

    if (!(transliteration instanceof Word)) {
      return [word, `${transliteration}${word.whiteSpaceAfter ?? ''}`] as const;
    }

    const syllableTransliteration = transliteration.syllables
      .map((s) => sylRules(s, transSchema))
      .reduce((a, c, i) => {
        if (!i) {
          return a + c;
        }

        if (!transSchema.SYLLABLE_SEPARATOR) {
          return a + c;
        }

        if (c.includes(transSchema.SYLLABLE_SEPARATOR)) {
          return a + c;
        }

        return a + transSchema.SYLLABLE_SEPARATOR + c;
      }, '');

    return [
      word,
      `${syllableTransliteration}${word.whiteSpaceAfter ?? ''}`,
    ] as const;
  });

  let i = 0;
  for (const [word, t] of transliterated) {
    mapping.appendMap(new StepMap([i, word.original.length, t.length]));
  }

  const result = transliterated.map(([_, t]) => t).join('');

  return { result, mapping };
};
