import type { OptionsSlugify } from '../types';
import type { Mapping } from './map';
import {
  defaultOptions as defaultOptionsTransliterate,
  Transliterate,
} from './transliterate';
import { deepClone, escapeRegExp, regexpReplaceCustom } from './utils';

// Slugify
export const defaultOptions: OptionsSlugify = {
  ...deepClone(defaultOptionsTransliterate),
  allowedChars: 'a-zA-Z0-9-_.~',
  lowercase: true,
  separator: '-',
  uppercase: false,
  fixChineseSpacing: true,
};

export class Slugify extends Transliterate {
  get options(): OptionsSlugify {
    return deepClone({ ...defaultOptions, ...this.confOptions });
  }

  /**
   * Set default config
   * @param options
   */
  config(options?: OptionsSlugify, reset = false): OptionsSlugify {
    if (reset) {
      this.confOptions = {};
    }
    if (options && typeof options === 'object') {
      this.confOptions = deepClone(options);
    }
    return this.confOptions;
  }

  /**
   * Slugify
   * @param str
   * @param options
   */
  slugify(
    str: string,
    options?: OptionsSlugify
  ): { result: string; mapping: Mapping } {
    const opts = typeof options === 'object' ? options : {};
    const opt: OptionsSlugify = deepClone({ ...this.options, ...opts });

    // remove leading and trailing separators
    const sep: string = opt.separator ? escapeRegExp(opt.separator) : '';

    const tr = this.transliterate(str, opt);
    let slug = tr.result;
    const mapping = tr.mapping;

    const result = regexpReplaceCustom(
      slug,
      new RegExp(`[^${opt.allowedChars}]+`, 'g'),
      opt.separator ?? '-',
      opt.ignore ?? []
    );
    slug = result.result;
    mapping.appendMapping(result.mapping);
    if (sep) {
      // Collapse consecutive separators into one
      slug = slug.replace(new RegExp(`${sep}+`, 'g'), opt.separator as string);
      // Remove leading and trailing separators
      slug = slug.replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '');
    }

    if (opt.lowercase) {
      slug = slug.toLowerCase();
    }
    if (opt.uppercase) {
      slug = slug.toUpperCase();
    }
    return { result: slug, mapping };
  }
}
