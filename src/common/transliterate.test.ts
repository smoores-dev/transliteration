/**
 * Tests are taken from Text-Unidecode-0.04/test.pl
 *
 * @see <http://search.cpan.org/~sburke/Text-Unidecode-0.04/lib/Text/Unidecode.pm>
 */
import { describe, expect, it } from 'vitest';
import { charmap } from '../../data/charmap';
import { transliterate as baseTransliterate } from '../node';
import type {
  OptionReplaceArray,
  OptionReplaceCombined,
  OptionReplaceObject,
} from '../types';
import { defaultOptions, Transliterate } from './transliterate';

const DIGITS_REGEX = /\d+/;
const DIGIT_GLOBAL_REGEX = /\d/g;
const WORLD_CASE_INSENSITIVE_REGEX = /world/i;

async function tr(...args: Parameters<typeof baseTransliterate>) {
  return (await baseTransliterate(...args)).result;
}

describe('transliterate()', () => {
  describe('Purity tests', () => {
    it('should return ASCII characters unchanged', async () => {
      const tests: string[] = [];
      for (let i = 1; tests.length < 127; i += 1) {
        tests.push(String.fromCharCode(i));
      }

      for (const str of tests) {
        expect(await tr(str)).toBe(str);
      }
    });
  });

  describe('Basic string tests', () => {
    it('should handle basic strings', async () => {
      const tests: (string | number)[] = [
        '',
        1 / 10,
        'I like pie.',
        '\n',
        '\r\n',
        'I like pie.\n',
      ];

      for (const str of tests) {
        expect(await tr(str.toString())).toBe(str.toString());
      }
    });
  });

  describe('Complex tests', () => {
    it('should transliterate various scripts correctly', async () => {
      const tests: [string, string][] = [
        ['Æneid', 'AEneid'],
        ['étude', 'etude'],
        ['北亰', 'Bei Jing'],
        ['ᔕᓇᓇ', 'shanana'],
        ['ᏔᎵᏆ', 'taliqua'],
        ['ܦܛܽܐܺ', "ptu'i"],
        ['अभिजीत', 'abhijiit'],
        ['অভিজীত', 'abhijiit'],
        ['അഭിജീത', 'abhijiit'],
        ['മലയാലമ്', 'mlyaalm'],
        ['げんまい茶', 'genmaiCha'],
        [`\u0800\u1400${unescape('%uD840%uDD00')}`, ''],
      ];

      for (const [str, result] of tests) {
        expect(await tr(str)).toBe(result);
      }
    });
  });

  describe('With ignore option', () => {
    it('should ignore specified characters', async () => {
      const tests: [string, string[], string][] = [
        ['Æneid', ['Æ'], 'Æneid'],
        ['你好，世界！', ['，', '！'], 'Ni Hao，Shi Jie！'],
        ['你好，世界！', ['你好', '！'], '你好,Shi Jie！'],
      ];
      for (const [str, ignore, result] of tests) {
        expect(await tr(str, { ignore })).toBe(result);
      }
    });
  });

  describe('With replace option', () => {
    it('should replace specified strings', async () => {
      const tests: [string, OptionReplaceCombined, string][] = [
        ['你好，世界！', [['你好', 'Hola']], 'Hola,Shi Jie!'],
        ['你好，世界！', { 你好: 'Hola' }, 'Hola,Shi Jie!'],
        ['你好，世界!', { 好: 'Good' }, 'Ni Good,Shi Jie!'],
      ];
      for (const [str, replace, result] of tests) {
        expect(await tr(str, { replace })).toBe(result);
      }
    });

    it('should handle replace with ignore', async () => {
      expect(
        await tr('你好，世界！', {
          replace: { 好: 'Good' },
          ignore: ['界'],
        })
      ).toBe('Ni Good,Shi 界!');
    });
  });

  describe('With replaceAfter option', () => {
    it('should replace after transliteration', async () => {
      const tests: [string, OptionReplaceCombined, string][] = [
        ['你好，世界！', [['Ni Hao', 'Hola']], 'Hola,Shi Jie!'],
        ['你好，世界！', { 'Ni Hao': 'Hola' }, 'Hola,Shi Jie!'],
      ];
      for (const [str, replaceAfter, result] of tests) {
        expect(await tr(str, { replaceAfter })).toBe(result);
      }
    });
  });

  describe('With replace / replaceAfter and ignore options', () => {
    it('should handle combined options', async () => {
      expect(
        await tr('你好, 世界!', {
          replace: [
            ['你好', 'Hola'],
            ['世界', 'mundo'],
          ],
          ignore: ['¡', '!'],
        })
      ).toBe('Hola, mundo!');

      expect(
        await tr('你好，世界！', {
          replaceAfter: [['你', 'tú']],
          ignore: ['你'],
        })
      ).toBe('tú Hao,Shi Jie!');
    });
  });

  describe('With trim option', () => {
    it('should trim whitespace when enabled', async () => {
      expect(await tr(' \t\r\n你好，世界！\t\r\n ', { trim: true })).toBe(
        'Ni Hao,Shi Jie!'
      );
      expect(await tr(' \t\r\n你好，世界！\t\r\n ', { trim: false })).toBe(
        ' \t\r\nNi Hao,Shi Jie!\t\r\n '
      );
    });
  });

  describe('With unknown option', () => {
    it('should use placeholder for unknown characters', async () => {
      expect(await tr('🚀', { unknown: '?' })).toBe('?');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', async () => {
      expect(await tr('')).toBe('');
    });

    it('should handle strings with only whitespace', async () => {
      expect(await tr('   ')).toBe('   ');
      expect(await tr('\t\n\r')).toBe('\t\n\r');
    });

    it('should handle mixed scripts in single string', async () => {
      expect(await tr('你好 Hello 世界')).toBe('Ni Hao Hello Shi Jie');
      expect(await tr('Café 北京 Tokyo')).toBe('Cafe Bei Jing Tokyo');
    });

    it('should handle surrogate pairs (UTF-32 characters)', async () => {
      // Mathematical bold capital A (U+1D400)
      expect(await tr('\uD835\uDC00')).toBe('');
      // CJK Extension B character
      expect(await tr('\uD840\uDC00')).toBe('');
    });

    it('should handle very long strings', async () => {
      const longChinese = '你好'.repeat(100);
      const result = await tr(longChinese);
      expect(result).toContain('Ni Hao');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle strings with numbers', async () => {
      expect(await tr('你好123世界')).toBe('Ni Hao 123Shi Jie');
      expect(await tr('2024年')).toBe('2024Nian');
    });

    it('should handle strings with special ASCII characters', async () => {
      expect(await tr('Hello@World#2024!')).toBe('Hello@World#2024!');
      expect(await tr('你好@世界')).toBe('Ni Hao@Shi Jie');
    });

    it('should handle consecutive non-ASCII characters', async () => {
      expect(await tr('éèêë')).toBe('eeee');
      expect(await tr('üöä')).toBe('uoa');
    });

    it('should handle Korean characters', async () => {
      expect(await tr('안녕하세요')).toBe('annyeonghaseyo');
    });

    it('should handle Arabic characters', async () => {
      expect(await tr('مرحبا')).toBe('mrHb');
    });

    it('should handle Russian/Cyrillic characters', async () => {
      expect(await tr('Привет')).toBe('Privet');
      expect(await tr('Москва')).toBe('Moskva');
    });

    it('should handle Greek characters', async () => {
      expect(await tr('Αθήνα')).toBe('Athina');
    });

    it('should handle Thai characters', async () => {
      expect(await tr('สวัสดี')).toBe('swasdii');
    });

    it('should handle Hebrew characters', async () => {
      expect(await tr('שלום', { locale: new Intl.Locale('he') })).toBe('shlvm');
    });

    it('should handle Hebrew characters with niqqud', async () => {
      expect(await tr('שָׁלוֹם', { locale: new Intl.Locale('he') })).toBe(
        'shalom'
      );
    });

    it('should handle Japanese characters', async () => {
      expect(
        await tr('オークの木の下に座っている', {
          locale: new Intl.Locale('ja'),
        })
      ).toBe('oku no konoshita ni suwatte iru');
    });

    it('should transliterate Japanese and Kanji the same', async () => {
      console.log(await tr('街', { locale: new Intl.Locale('ja') }));
      console.log(await tr('まち', { locale: new Intl.Locale('ja') }));
      expect(await tr('街', { locale: new Intl.Locale('ja') })).toBe(
        await tr('まち', { locale: new Intl.Locale('ja') })
      );
    });

    it('should handle Chinese characters', async () => {
      expect(
        await tr('很多人看了，都说他们做得很好。', {
          locale: new Intl.Locale('zh-CN'),
        })
      ).toBe('hen duo ren kan le， du shuo ta men zuo de hen hao。');
    });

    it('should handle Chinese with multiple pin yin heteronyms', async () => {
      expect(
        await tr('音乐老师说快乐的人更容易学音乐。', {
          locale: new Intl.Locale('zh-CN'),
        })
      ).toBe('yin yue lao shi shuo kuai le de ren geng rong yi xue yin yue。');
    });

    it('should handle more Chinese with multiple pin yin heteronyms', async () => {
      expect(
        await tr('他小时候在上海长大，现在头发很长。', {
          locale: new Intl.Locale('zh-CN'),
        })
      ).toBe(
        'ta xiao shi hou zai shang hai zhang da， xian zai tou fa hen chang。'
      );
    });
  });

  describe('Chinese spacing behavior', () => {
    it('should add spaces between Chinese characters by default', async () => {
      expect(await tr('你好')).toBe('Ni Hao');
      expect(await tr('北京市')).toBe('Bei Jing Shi');
    });

    it('should not add extra spaces around punctuation', async () => {
      expect(await tr('你好，世界')).toBe('Ni Hao,Shi Jie');
    });

    it('should handle fixChineseSpacing option', async () => {
      expect(await tr('你好', { fixChineseSpacing: false })).toBe('NiHao');
      expect(await tr('你好', { fixChineseSpacing: true })).toBe('Ni Hao');
    });
  });

  describe('Replace with regex', () => {
    it('should handle regex patterns in replace option', async () => {
      expect(
        await tr('test123test', { replace: [[DIGITS_REGEX, 'NUM']] })
      ).toBe('testNUMtest');
    });

    it('should handle global regex patterns', async () => {
      expect(await tr('a1b2c3', { replace: [[DIGIT_GLOBAL_REGEX, 'X']] })).toBe(
        'aXbXcX'
      );
    });

    it('should handle regex with flags', async () => {
      expect(
        await tr('Hello WORLD', {
          replace: [[WORLD_CASE_INSENSITIVE_REGEX, 'Earth']],
        })
      ).toBe('Hello Earth');
    });
  });

  describe('With non-string source', () => {
    it('should convert non-string source to string', async () => {
      // Covers line 214 - force convert to string
      expect(await tr(123 as unknown as string)).toBe('123');
      expect(await tr(null as unknown as string)).toBe('null');
      expect(await tr(undefined as unknown as string)).toBe('undefined');
    });
  });
});

describe('replaceSawait tr()', () => {
  it('should replace strings correctly', () => {
    const transliterate = new Transliterate();
    const replaceString = transliterate.replaceString.bind(transliterate);
    const tests: [string, [string | RegExp, string][], string][] = [
      [
        'abbc',
        [
          ['a', 'aa'],
          [/b+/g, 'B'],
        ],
        'aaBc',
      ],
      ['abbc', [[false as unknown as string, '']], 'abbc'],
    ];
    for (const [str, replace, result] of tests) {
      expect(replaceString(str, replace).result).toBe(result);
    }
  });
});

describe('transliterate.config()', () => {
  it('should read and reset config', () => {
    baseTransliterate.config(defaultOptions);
    expect(baseTransliterate.config()).toEqual(defaultOptions);
    baseTransliterate.config(undefined, true);
    expect(baseTransliterate.config()).toEqual({});
  });
});

describe('transliterate.setData()', () => {
  it('should set and reset custom codemap', async () => {
    const map = { a: 'A', b: 'B', c: 'C' };
    baseTransliterate.setData(map);
    expect(baseTransliterate.setData(map)).toEqual({ ...charmap, ...map });
    expect(await tr('abc')).toBe('ABC');
    expect(baseTransliterate.setData(undefined, true)).toEqual(charmap);
    expect(await tr('abc')).toBe('abc');
  });

  it('should only include own properties from data', async () => {
    // Create object with inherited property to cover Object.hasOwn branch
    const proto = { inherited: 'value' };
    const map = Object.create(proto) as { [key: string]: string };
    map.a = 'A';
    baseTransliterate.setData(undefined, true);
    baseTransliterate.setData(map);
    expect(await tr('a')).toBe('A');
    // inherited property should not be added
    expect(await tr('inherited')).toBe('inherited');
    baseTransliterate.setData(undefined, true);
  });
});

describe('formatReplaceOption', () => {
  it('should format replace options correctly', () => {
    const transliterate = new Transliterate();
    const formatReplaceOption =
      transliterate.formatReplaceOption.bind(transliterate);
    const optObj: OptionReplaceObject = { a: 'b', c: 'd' };
    const optArr: OptionReplaceArray = [
      ['a', 'b'],
      ['c', 'd'],
    ];
    expect(formatReplaceOption(optObj)).toEqual(optArr);
    expect(formatReplaceOption(optArr)).toEqual(optArr);
    expect(formatReplaceOption(optArr)).not.toBe(optArr);
  });

  it('should only include own properties', () => {
    const transliterate = new Transliterate();
    const formatReplaceOption =
      transliterate.formatReplaceOption.bind(transliterate);
    // Create object with inherited property
    const proto = { inherited: 'value' };
    const optObj = Object.create(proto) as OptionReplaceObject;
    optObj.own = 'ownValue';
    expect(formatReplaceOption(optObj)).toEqual([['own', 'ownValue']]);
  });
});

describe('mapping', () => {
  it('should produce an empty mapping for latin script', async () => {
    const input = 'This is English';
    const mapping = (await baseTransliterate(input)).mapping;
    expect(mapping.maps).toHaveLength(0);
    expect(mapping.map(0)).toBe(0);
    expect(mapping.map(input.length - 1)).toBe(input.length - 1);
  });

  it('should produce a correct mapping for non-latin script', async () => {
    const input = 'сидя под дубом';
    const mapping = (await baseTransliterate(input)).mapping;
    expect(mapping.map(0)).toBe(0);
    expect(mapping.map(input.length)).toBe(15);
  });

  it('should produce a correct mapping for Japanese', async () => {
    const input = 'オークの木の下に座っている';
    const { mapping } = await baseTransliterate(input, {
      locale: new Intl.Locale('ja'),
    });
    expect(mapping.map(0)).toBe(0);
    expect(mapping.map(3)).toBe(4);
    expect(mapping.map(4)).toBe(7);
    expect(mapping.map(13)).toBe(31);
  });

  it('should produce a correct mapping for Chinese', async () => {
    const input = '很多人看了，都说他们做得很好。';
    const { mapping } = await baseTransliterate(input, {
      locale: new Intl.Locale('zh-CN'),
    });
    expect(mapping.map(0)).toBe(0);
    expect(mapping.map(2)).toBe(8);
    expect(mapping.map(3)).toBe(12);
    expect(mapping.map(15)).toBe(50);
  });

  it('should produce a correct mapping for surrogate pairs', async () => {
    const input = '\uD840\uDC00';
    const { mapping } = await baseTransliterate(input);
    expect(mapping.map(0)).toBe(0);
    expect(mapping.map(input.length)).toBe(0);
  });
});
