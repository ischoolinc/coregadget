import { Injectable } from '@angular/core';
import { SentenceDissector, TokenData, KeywordPattern } from './sentence-dissector';

@Injectable({
  providedIn: 'root'
})
export class SentenceService {

  private _pattern: RegExp = new RegExp(KeywordPattern, 'i');

  constructor() { }

  /**
   * 解析字串。
   * @param sentence 飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）
   * @param matrix ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜']
   */
  public apply(sentence: string, matrix: string[]) {
    const interpreter = new SentenceDissector(sentence);
    return interpreter.applyMatrix(matrix);
  }

  /** 建立解析器。 */
  public create(sentence: string) {
    return new SentenceDissector(sentence);
  }

  public join(tokens: TokenData[]) {
    const words = tokens.map(v => v.type === 'literally' ? v.text : v.value);
    return words.join('');
  }

  /** 測試是否文字中包含了可以產生 input 的 keyword(執行 1000 次約 2 ~ 3 亳秒)。 */
  public test(sentence: string) {
    return this._pattern.test(sentence);
  }
}
