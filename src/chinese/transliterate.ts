import Pinyin, { getPinyinInstance } from './pinyin';

export const transliterate = getPinyinInstance(new Pinyin());
