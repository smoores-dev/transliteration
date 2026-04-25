import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import Kuroshiro from './kuroshiro';

let kuroshiroInstance : Kuroshiro | null = null

async function getKuroshiroInstance() {
  if (kuroshiroInstance) {
    return kuroshiroInstance
  }
  kuroshiroInstance = new Kuroshiro()
  await kuroshiroInstance.init(new KuromojiAnalyzer())
  return kuroshiroInstance
}

export async function transliterate(input: string) {
  const kuroshiro = await getKuroshiroInstance()

  return await kuroshiro.convert(input);
}
