declare module 'kuroshiro-analyzer-kuromoji' {
  import type { Token } from './japanese/util';
  class KuromojiAnalyzer {
    init(): Promise<void>;
    parse(str: string): Token[];
  }
  export = KuromojiAnalyzer;
}
