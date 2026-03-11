import { describe, expect, it } from 'vitest';
import {
  slugify as browserLatinSlugify,
  transl as browserLatinTransl,
  transliterate as browserLatinTransliterate,
} from '../browser/latin';
import {
  slugify as latinSlugify,
  transliterate as latinTransliterate,
} from './latin';

describe('latin build', () => {
  it('transliterates Latin characters', async () => {
    expect((await latinTransliterate('S\u00e3o Paulo')).result).toBe(
      'Sao Paulo'
    );
  });

  it('omits non-Latin characters', async () => {
    expect((await latinTransliterate('\u4f60\u597d')).result).toBe('');
  });

  it('slugifies Latin-only strings', async () => {
    expect((await latinSlugify('S\u00e3o Paulo')).result).toBe('sao-paulo');
  });
});

describe('browser latin exports', () => {
  it('exposes transl alias', () => {
    expect(browserLatinTransl).toBe(browserLatinTransliterate);
  });

  it('slugifies via browser build', async () => {
    expect((await browserLatinSlugify('S\u00e3o Paulo')).result).toBe(
      'sao-paulo'
    );
  });
});
