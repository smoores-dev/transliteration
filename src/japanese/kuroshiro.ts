// biome-ignore-all lint: imported from kuroshiro

import { Mapping, StepMap } from '../common/map';
import {
  getStrType,
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
  toRawHiragana,
  toRawKatakana,
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

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const preToken = hasJapanese(token.surface_form)
        ? token.pronunciation || token.reading
        : token.surface_form;
      const romaji = toRawRomaji(preToken, ROMANIZATION_SYSTEM.HEPBURN);
      const space = i === tokens.length - 1 ? '' : ' ';
      if (token.surface_form.length !== romaji.length + space.length) {
        mapping.appendMap(
          new StepMap([
            result.length,
            token.surface_form.length,
            romaji.length + space.length,
          ])
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
