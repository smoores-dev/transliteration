// biome-ignore-all lint: imported from pinyin

import { Mapping, StepMap } from '../common/map';
import { ENUM_PINYIN_MODE, ENUM_PINYIN_STYLE } from './constant';
import CompoundSurnamePinyinData from './data/compound_surname';
import DICT_ZI from './data/dict-zi'; // 单个汉字拼音数据。
import DICT_PHRASES from './data/phrases-dict'; // 词组拼音数据。
import SurnamePinyinData from './data/surname';
import type { IPinyin, IPinyinAllOptions, IPinyinOptions } from './declare';
import { toFixed } from './format';
import { combo, compact, convertUserOptions, hasKey } from './util';

export default class Pinyin {
  private segmenter = new Intl.Segmenter('zh-Hans-CN', {
    granularity: 'word',
  });

  /**
   * 拼音转换入口。
   */
  pinyin(
    hans: string,
    options?: IPinyinOptions
  ): { result: string; mapping: Mapping } {
    if (typeof hans !== 'string') {
      return { result: '', mapping: new Mapping() };
    }
    const opt: IPinyinAllOptions = convertUserOptions(options);

    return this.segment_pinyin(hans, opt);
  }

  /**
   * 不使用分词算法的拼音转换。
   */
  normal_pinyin(hans: string, options: IPinyinAllOptions): string[][] {
    const pys: string[][] = [];
    let nohans = '';

    for (let i = 0, l = hans.length; i < l; i++) {
      const words = hans[i];
      const firstCharCode = words.charCodeAt(0);

      if (DICT_ZI[firstCharCode]) {
        // 处理前面的“非中文”部分。
        if (nohans.length > 0) {
          pys.push([nohans]);
          nohans = ''; // 重置“非中文”缓存。
        }
        pys.push(this.single_pinyin(words, options));
      } else {
        nohans += words;
      }
    }

    // 清理最后的非中文字符串。
    if (nohans.length > 0) {
      pys.push([nohans]);
      nohans = ''; // reset non-chinese words.
    }
    return pys;
  }

  /**
   * 单字拼音转换。
   * @param {String} han, 单个汉字
   * @return {Array} 返回拼音列表，多音字会有多个拼音项。
   */
  single_pinyin(han: string, options: IPinyinAllOptions): string[] {
    if (typeof han !== 'string') {
      return [];
    }
    if (han.length !== 1) {
      return this.single_pinyin(han.charAt(0), options);
    }

    const hanCode = han.charCodeAt(0);

    if (!DICT_ZI[hanCode]) {
      return [han];
    }

    const pys = DICT_ZI[hanCode].split(',');
    if (!options.heteronym) {
      return [toFixed(pys[0], ENUM_PINYIN_STYLE.NORMAL)];
    }

    // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
    const py_cached: Record<string, string> = {};
    const pinyins = [];
    for (let i = 0, l = pys.length; i < l; i++) {
      const py = toFixed(pys[i], ENUM_PINYIN_STYLE.NORMAL);
      if (hasKey(py_cached, py)) {
        continue;
      }
      py_cached[py] = py;

      pinyins.push(py);
    }
    return pinyins;
  }

  segment(hans: string): Intl.SegmentData[] {
    return Array.from(this.segmenter.segment(hans));
  }

  /**
   * 将文本分词，并转换成拼音。
   */
  segment_pinyin(
    hans: string,
    options: IPinyinAllOptions
  ): { result: string; mapping: Mapping } {
    const mapping = new Mapping();
    const phrases = this.segment(hans);
    let result = '';
    let nohans = '';
    for (let i = 0, l = phrases.length; i < l; i++) {
      const words = phrases[i];
      const space = phrases[i + 1]?.isWordLike ? ' ' : '';

      if (!words.isWordLike) {
        if (space.length) {
          mapping.appendMap(
            new StepMap([
              result.length,
              words.segment.length,
              words.segment.length + space.length,
            ])
          );
        }
        result += words.segment + space;
        continue;
      }

      const firstCharCode = words.segment.charCodeAt(0);

      if (DICT_ZI[firstCharCode]) {
        // ends of non-chinese words.
        if (nohans.length > 0) {
          result += nohans + space;
          nohans = ''; // reset non-chinese words.
        }

        const newPys =
          words.segment.length === 1
            ? this.normal_pinyin(words.segment, options)
            : this.phrases_pinyin(words.segment, options);

        const pyWords = newPys.map(([py]) => py);
        const pyStr = pyWords.join(' ') + space;
        if (pyStr.length !== words.segment.length) {
          mapping.appendMap(
            new StepMap([result.length, words.segment.length, pyStr.length])
          );
        }

        result += pyStr;
        continue;
      }

      nohans += words;
    }

    // 清理最后的非中文字符串。
    if (nohans.length > 0) {
      result += nohans;
    }
    return { result, mapping };
  }

  /**
   * 词语注音
   * @param {String} phrases, 指定的词组。
   * @param {Object} options, 选项。
   * @return {Array}
   */
  phrases_pinyin(phrases: string, options: IPinyinAllOptions): string[][] {
    const py: string[][] = [];
    if (hasKey(DICT_PHRASES, phrases)) {
      //! copy pinyin result.
      DICT_PHRASES[phrases].forEach(function (item: string[], idx: number) {
        py[idx] = [];
        if (options.heteronym) {
          item.forEach(function (py_item, py_index) {
            py[idx][py_index] = toFixed(py_item, ENUM_PINYIN_STYLE.NORMAL);
          });
        } else {
          py[idx][0] = toFixed(item[0], ENUM_PINYIN_STYLE.NORMAL);
        }
      });
    } else {
      for (let i = 0, l = phrases.length; i < l; i++) {
        py.push(this.single_pinyin(phrases[i], options));
      }
    }
    return py;
  }

  groupPhrases(phrases: string[][]): string[] {
    if (phrases.length === 1) {
      return phrases[0];
    }

    const grouped = combo(phrases);

    return grouped;
  }

  // 姓名转成拼音
  surname_pinyin(hans: string, options: IPinyinAllOptions): string[][] {
    return this.compound_surname(hans, options);
  }

  // 复姓处理
  compound_surname(hans: string, options: IPinyinAllOptions): string[][] {
    const len = hans.length;
    let prefixIndex = 0;
    let result: string[][] = [];
    for (let i = 0; i < len; i++) {
      const twowords: string = hans.substring(i, i + 2);
      if (hasKey(CompoundSurnamePinyinData, twowords)) {
        if (prefixIndex <= i - 1) {
          result = result.concat(
            this.single_surname(hans.substring(prefixIndex, i), options)
          );
        }
        const pys = CompoundSurnamePinyinData[twowords].map(
          (item: string[]) => {
            return item.map((ch: string) =>
              toFixed(ch, ENUM_PINYIN_STYLE.NORMAL)
            );
          }
        );
        result = result.concat(pys);

        i = i + 2;
        prefixIndex = i;
      }
    }
    // 处理复姓后面剩余的部分。
    result = result.concat(
      this.single_surname(hans.substring(prefixIndex, len), options)
    );
    return result;
  }

  // 单姓处理
  single_surname(hans: string, options: IPinyinAllOptions) {
    let result: string[][] = [];
    for (let i = 0, l = hans.length; i < l; i++) {
      const word = hans.charAt(i);
      if (hasKey(SurnamePinyinData, word)) {
        const pys = SurnamePinyinData[word].map((item: string[]) => {
          return item.map((ch: string) =>
            toFixed(ch, ENUM_PINYIN_STYLE.NORMAL)
          );
        });
        result = result.concat(pys);
      } else {
        result.push(this.single_pinyin(word, options));
      }
    }
    return result;
  }

  /**
   * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
   *
   * @param {String} hanA 汉字字符串 A。
   * @return {String} hanB 汉字字符串 B。
   * @return {Number} 返回 -1，0，或 1。
   */
  compare(hanA: string, hanB: string): number {
    const pinyinA = this.pinyin(hanA);
    const pinyinB = this.pinyin(hanB);
    return String(pinyinA).localeCompare(String(pinyinB));
  }

  compact(pys: string[][]): string[][] {
    return compact(pys);
  }
}

export function getPinyinInstance(py: Pinyin) {
  const pinyin = <IPinyin>py.pinyin.bind(py);
  pinyin.compare = py.compare.bind(py);
  pinyin.compact = py.compact.bind(py);

  // pinyin styles: 兼容 v2.x 中的属性透出
  pinyin.STYLE_TONE = ENUM_PINYIN_STYLE.TONE;
  pinyin.STYLE_TONE2 = ENUM_PINYIN_STYLE.TONE2;
  pinyin.STYLE_TO3NE = ENUM_PINYIN_STYLE.TO3NE;
  pinyin.STYLE_NORMAL = ENUM_PINYIN_STYLE.NORMAL;
  pinyin.STYLE_INITIALS = ENUM_PINYIN_STYLE.INITIALS;
  pinyin.STYLE_FIRST_LETTER = ENUM_PINYIN_STYLE.FIRST_LETTER;
  pinyin.STYLE_PASSPORT = ENUM_PINYIN_STYLE.PASSPORT;

  // pinyin mode: 兼容 v2.x 中的属性透出
  pinyin.MODE_NORMAL = ENUM_PINYIN_MODE.NORMAL;
  pinyin.MODE_SURNAME = ENUM_PINYIN_MODE.SURNAME;
  // pinyin.MODE_PLACENAME = ENUM_PINYIN_MODE.PLACENAME;

  return pinyin;
}
