import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import Kuroshiro from './kuroshiro';

export async function transliterate(input: string) {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());

  return await kuroshiro.convert(input);
}
