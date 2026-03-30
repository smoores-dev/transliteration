import { type Charmap, charmap } from '../../data/charmap';
import { transliterate as zhTransliterate } from '../chinese/transliterate';
import { transliterate as hebTransliterate } from '../hebrew/transliterate';
import { transliterate as jpTransliterate } from '../japanese/transliterate';
import type {
  IntervalArray,
  OptionReplaceArray,
  OptionReplaceCombined,
  OptionReplaceObject,
  OptionsTransliterate,
} from '../types';
import { Mapping, StepMap } from './map';

import {
  deepClone,
  escapeRegExp,
  findStrOccurrences,
  hasChinese,
  hasPunctuationOrSpace,
  inRange,
  regexpReplaceCustom,
} from './utils';

const SURROGATE_HIGH_REGEX = /[\uD800-\uDBFF]/;
const SURROGATE_LOW_REGEX = /[\uDC00-\uDFFF]/;
const REDOS_SAFE_REGEX = /[^\s\S]/;

export const defaultOptions: OptionsTransliterate = {
  ignore: [],
  replace: [],
  replaceAfter: [],
  trim: false,
  unknown: '',
  fixChineseSpacing: true,
};

export class Transliterate {
  get options(): OptionsTransliterate {
    return deepClone({ ...defaultOptions, ...this.confOptions });
  }

  protected confOptions: OptionsTransliterate;
  protected defaultMap: Charmap;
  protected map: Charmap;

  constructor(
    confOptions: OptionsTransliterate = deepClone(defaultOptions),
    map: Charmap = charmap
  ) {
    this.confOptions = confOptions;
    this.defaultMap = map;
    this.map = map;
  }

  /**
   * Set default config
   * @param options
   */
  config(options?: OptionsTransliterate, reset = false): OptionsTransliterate {
    if (reset) {
      this.confOptions = {};
    }
    if (options && typeof options === 'object') {
      this.confOptions = deepClone(options);
    }
    return this.confOptions;
  }

  async localeAwareReplace(
    str: string,
    opt: OptionsTransliterate,
    ignoreRanges?: IntervalArray
  ): Promise<{ result: string; mapping: Mapping }> {
    if (!opt.locale) {
      return this.codeMapReplace(str, opt, ignoreRanges);
    }

    switch (opt.locale.language) {
      case 'he': {
        return hebTransliterate(str);
      }
      case 'ja': {
        return await jpTransliterate(str);
      }
      case 'zh': {
        return zhTransliterate(str);
      }
      default: {
        return this.codeMapReplace(str, opt, ignoreRanges);
      }
    }
  }

  /**
   * Replace the source string using the code map
   * @param str
   * @param ignoreRanges
   * @param unknown
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex algorithm for character mapping with Chinese spacing
  codeMapReplace(
    str: string,
    opt: OptionsTransliterate,
    ignoreRanges: IntervalArray = []
  ): { result: string; mapping: Mapping } {
    let index = 0;
    let result = '';
    const mapping = new Mapping();
    const strContainsChinese = opt.fixChineseSpacing && hasChinese(str);
    let lastCharHasChinese = false;
    for (let i = 0; i < str.length; i++) {
      // Get current character, taking surrogates in consideration
      const char =
        SURROGATE_HIGH_REGEX.test(str[i]) &&
        SURROGATE_LOW_REGEX.test(str[i + 1])
          ? str[i] + str[i + 1]
          : str[i];
      let s: string;
      let ignoreFixingChinese = false;
      // Check if current character is in ignored list or UTF-32 surrogate pair
      const isIgnored =
        inRange(index, ignoreRanges) ||
        (char.length === 2 && inRange(index + 1, ignoreRanges));

      if (isIgnored) {
        s = char;
        // if it's the first character of an ignored string, then leave ignoreFixingChinese to true
        if (
          !ignoreRanges.find((range) => range[1] >= index && range[0] === index)
        ) {
          ignoreFixingChinese = true;
        }
      } else {
        s = this.map[char] || opt.unknown || '';
      }
      // fix Chinese spacing issue
      if (strContainsChinese) {
        if (
          lastCharHasChinese &&
          !ignoreFixingChinese &&
          !hasPunctuationOrSpace(s)
        ) {
          s = ` ${s}`;
        }
        lastCharHasChinese = !!s && hasChinese(char);
      }
      result += s;
      mapping.appendMap(new StepMap([i, char.length, s.length]));
      index += char.length;
      // If it's UTF-32 then skip next character
      i += char.length - 1;
    }
    return { result, mapping };
  }

  /**
   * Convert the object version of the 'replace' option into tuple array one
   * @param option replace option to be either an object or tuple array
   * @return return the paired array version of replace option
   */
  formatReplaceOption(option: OptionReplaceCombined): OptionReplaceArray {
    if (Array.isArray(option)) {
      // return a new copy of the array
      return deepClone(option);
    }
    // convert object option to array one
    const replaceArr: OptionReplaceArray = [];
    for (const key in option as OptionReplaceObject) {
      /* v8 ignore next 3 */
      if (Object.hasOwn(option, key)) {
        replaceArr.push([key, option[key]]);
      }
    }
    return replaceArr;
  }

  /**
   * Search and replace a list of strings(regexps) and return the result string
   * @param source Source string
   * @param searches Search-replace string(regexp) pairs
   */
  replaceString(
    source: string,
    searches: OptionReplaceArray,
    ignore: string[] = []
  ): { result: string; mapping: Mapping } {
    const clonedSearches = deepClone(searches);
    const mapping = new Mapping();
    let result = source;
    for (const item of clonedSearches) {
      switch (true) {
        case item[0] instanceof RegExp:
          item[0] = new RegExp(
            item[0].source,
            `${item[0].flags.replace('g', '')}g`
          );
          break;
        case typeof item[0] === 'string' && item[0].length > 0:
          item[0] = new RegExp(escapeRegExp(item[0]), 'g');
          break;
        default:
          item[0] = REDOS_SAFE_REGEX; // Prevent ReDos attack
      }
      const replaceResult = regexpReplaceCustom(
        result,
        item[0],
        item[1],
        ignore
      );
      result = replaceResult.result;
      mapping.appendMapping(replaceResult.mapping);
    }
    return { result, mapping };
  }

  /**
   * Set charmap data
   * @param {Charmap} [data]
   * @param {boolean} [reset=false]
   * @memberof Transliterate
   */
  setData(data?: Charmap, reset = false): Charmap {
    if (reset) {
      this.map = deepClone(this.defaultMap);
    }
    if (data && typeof data === 'object' && Object.keys(data).length) {
      this.map = deepClone(this.map);
      for (const from in data) {
        /* v8 ignore next 5 */
        if (
          Object.hasOwn(data, from) &&
          from.length < 3 &&
          from <= '\udbff\udfff'
        ) {
          this.map[from] = data[from];
        }
      }
    }
    return this.map;
  }

  /**
   * Main transliterate function
   * @param source The string which is being transliterated
   * @param options Options object
   */
  async transliterate(
    source: string,
    options?: OptionsTransliterate
  ): Promise<{ result: string; mapping: Mapping }> {
    const opts = typeof options === 'object' ? options : {};
    const opt: OptionsTransliterate = deepClone({
      ...this.options,
      ...opts,
    });

    const mapping = new Mapping();
    // force convert to string
    let str = typeof source === 'string' ? source : String(source);

    const replaceOption: OptionReplaceArray = this.formatReplaceOption(
      opt.replace as OptionReplaceCombined
    );
    if (replaceOption.length) {
      const result = this.replaceString(str, replaceOption, opt.ignore);
      str = result.result;
      mapping.appendMapping(result.mapping);
    }

    // ignore
    const ignoreRanges: IntervalArray =
      opt.ignore && opt.ignore.length > 0
        ? findStrOccurrences(str, opt.ignore)
        : [];
    const { result: codeMapResult, mapping: codeMapping } =
      await this.localeAwareReplace(str, opt, ignoreRanges);
    str = codeMapResult;
    mapping.appendMapping(codeMapping);

    // trim spaces at the beginning and ending of the string
    if (opt.trim) {
      str = str.trim();
    }

    const replaceAfterOption: OptionReplaceArray = this.formatReplaceOption(
      opt.replaceAfter as OptionReplaceCombined
    );
    if (replaceAfterOption.length) {
      const result = this.replaceString(str, replaceAfterOption);
      str = result.result;
      mapping.appendMapping(result.mapping);
    }
    return { result: str, mapping };
  }
}
