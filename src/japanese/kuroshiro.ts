// biome-ignore-all lint: imported from kuroshiro

import { Mapping } from '@storyteller-platform/mapping';
import {
  hasHiragana,
  hasJapanese,
  hasKana,
  hasKanji,
  hasKatakana,
  isHiragana,
  isJapanese,
  isKana,
  isKanji,
  isKatakana,
  kanaToHiragna,
  kanaToKatakana,
  kanaToRomaji,
  patchTokens,
  ROMANIZATION_SYSTEM,
  Token,
  toRawRomaji,
} from './util';

type Analyzer = {
  init(): Promise<void>;
  parse(str: string): Token[];
};

type Options = {
  delimiter_start?: string;
  delimiter_end?: string;
};

/**
 * Kuroshiro Class
 */
class Kuroshiro {
  private _analyzer: Analyzer | null;
  /**
   * Constructor
   * @constructs Kuroshiro
   */
  constructor() {
    this._analyzer = null;
  }

  /**
   * Initialize Kuroshiro
   * @memberOf Kuroshiro
   * @instance
   * @returns {Promise} Promise object represents the result of initialization
   */
  async init(analyzer: Analyzer) {
    if (
      !analyzer ||
      typeof analyzer !== 'object' ||
      typeof analyzer.init !== 'function' ||
      typeof analyzer.parse !== 'function'
    ) {
      throw new Error('Invalid initialization parameter.');
    } else if (this._analyzer == null) {
      await analyzer.init();
      this._analyzer = analyzer;
    } else {
      throw new Error('Kuroshiro has already been initialized.');
    }
  }

  /**
   * Convert given string to target syllabary with options available
   * @memberOf Kuroshiro
   * @instance
   * @param {string} str Given String
   * @param {Object} [options] Settings Object
   * @param {string} [options.to="hiragana"] Target syllabary ["hiragana"|"katakana"|"romaji"]
   * @param {string} [options.mode="normal"] Convert mode ["normal"|"spaced"|"okurigana"|"furigana"]
   * @param {string} [options.romajiSystem="hepburn"] Romanization System ["nippon"|"passport"|"hepburn"]
   * @param {string} [options.delimiter_start="("] Delimiter(Start)
   * @param {string} [options.delimiter_end=")"] Delimiter(End)
   * @returns {Promise} Promise object represents the result of conversion
   */
  async convert(str: string, options?: Options) {
    options = options || {};
    options.delimiter_start = options.delimiter_start || '(';
    options.delimiter_end = options.delimiter_end || ')';
    str = str || '';

    const mapping = new Mapping();

    const rawTokens = await this._analyzer!.parse(str);
    const tokens = patchTokens(rawTokens);

    let result = '';

    // A token is "word-like" if its surface contains a letter or number.
    // Whitespace/punctuation tokens are separators and provide their own
    // separation, so we only insert a separating space between two adjacent
    // word-like tokens. Adding a space after every token (as before) doubled
    // separators, which slugify's collapse stage then removed — corrupting the
    // composed mapping's length for any text containing spaces or punctuation.
    const isWordLike = (token: Token | undefined) =>
      token != null && /[\p{L}\p{N}]/u.test(token.surface_form);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const preToken = hasJapanese(token.surface_form)
        ? token.pronunciation || token.reading
        : token.surface_form;
      // Strip any characters the romanizer couldn't convert (e.g. a kanji
      // with no reading, which toRawRomaji returns unchanged). Left in, they
      // survive into the output only to be deleted by slugify later, and that
      // multi-token-spanning deletion corrupts the composed mapping's length.
      let romaji = toRawRomaji(preToken, ROMANIZATION_SYSTEM.HEPBURN).replace(
        /[^\x00-\x7F]/g,
        ''
      );
      // A separator token that romanizes to nothing (e.g. ・) must still
      // separate its neighbors — emit a space for slugify to turn into a
      // separator, otherwise the words on either side fuse together.
      // Word-like tokens that romanize to nothing (e.g. a kanji with no
      // reading) stay a clean deletion; their word-like neighbors already
      // provide the separating space.
      if (romaji.length === 0 && !isWordLike(token)) {
        romaji = ' ';
      }
      // Only insert a separating space when this token actually produced
      // romaji and both it and the next token are word-like. A token that
      // romanizes to nothing must not emit a trailing space, or it doubles the
      // separator and corrupts the mapping.
      const space =
        romaji.length > 0 && isWordLike(token) && isWordLike(tokens[i + 1])
          ? ' '
          : '';
      if (token.surface_form.length !== romaji.length + space.length) {
        mapping.insertMap(
          token.verbose.word_position - 1,
          token.surface_form.length,
          romaji.length + space.length
        );
      }
      result += romaji + space;
    }
    return { result, mapping };
  }

  static Util = {
    isHiragana,
    isKatakana,
    isKana,
    isKanji,
    isJapanese,
    hasHiragana,
    hasKatakana,
    hasKana,
    hasKanji,
    hasJapanese,
    kanaToHiragna,
    kanaToKatakana,
    kanaToRomaji,
  };
}

export default Kuroshiro;
