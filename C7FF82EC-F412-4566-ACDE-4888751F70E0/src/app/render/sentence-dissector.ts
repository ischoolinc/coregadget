
export const KeywordPattern = '\%([r]?)(text(area)?)([0-9]{1,2})?\%';

// text 折解器。
export class SentenceDissector {

  private _expressions: Expression[];
  private _containsTextArea = false;

  constructor(private text: string) {
    this._expressions = this.interpret();

    for (const exp of this._expressions) {
      if (exp.isTextArea) {
        this._containsTextArea = true;
        break;
      }
    }
  }

  /** 是否包含了 TextArea 輸入框。 */
  public get containsTextArea() {
    return this._containsTextArea;
  }

  public applyMatrix(matrix: string[]) {

    const records: TokenData[] = [];

    for (let i = 0 ; i < this._expressions.length; i++) {
      const exp = this._expressions[i];
      const value = matrix[i] || '';

      if (exp instanceof LiterallyExpression) {
        records.push({
          type: 'literally',
          text: exp.text,
          value: exp.text,
          size: 0,
          required: true
        } as TokenData);
      } else if (exp instanceof KeywordExpression) {
        records.push({
          type: 'keyword',
          text: exp.text,
          value: value,
          size: exp.size,
          required: exp.require
        } as TokenData);
      }
    }

    return records;
  }

  private interpret() {

    const reg = new RegExp(KeywordPattern, 'gmi');
    const sentence = this.text;
    const parts: Expression[] = [];

    let part: RegExpExecArray = null;
    let previousLast = 0;

    // 不斷 match 直到 match 不到。
    while ((part = reg.exec(sentence)) !== null) {

      if (previousLast !== part.index) {
        const parta = sentence.substring(previousLast, part.index);
        parts.push(Expression.parse(parta));
      }

      const partb = sentence.substring(part.index, reg.lastIndex);
      parts.push(Expression.parse(partb));

      previousLast = reg.lastIndex;
    }

    // 如果句字還有最後一段，就直接處理。
    if (sentence.length > previousLast) {
      const text = sentence.substring(previousLast, sentence.length);
      parts.push(Expression.parse(text));
    }

    return parts;
  }
}

// 代表一個 token，例如：%TEXT3% 解析後的結果。
export interface TokenData {

  type: TokenType;

  text: string; // keyword 字串。

  value: string; // 使用者輸入的值。

  size: number; // 寬度。

  required: boolean; // 是否必填，目前無用。
}

export class Expression {

  protected _text: string;

  protected _type: TokenType;

  protected _isTextArea = false;

  constructor() {
  }

  public get text() {
    return this._text;
  }

  public get type() {
    return this._type;
  }

  public get isTextArea() {
    return this._isTextArea;
  }

  public static parse(text: string) {
    const pattern = new RegExp(KeywordPattern, 'i');
    const matchs = pattern.exec(text);

    if (matchs) {
      return new KeywordExpression(matchs, text);
    } else {
      return new LiterallyExpression(text);
    }
  }
}

export class LiterallyExpression extends Expression {

  constructor(text: string) {
    super();

    this._text = text;
    this._type = 'literally';
  }
}

export class KeywordExpression extends Expression {

  constructor(regexp: RegExpExecArray, text: string) {
    super();

    this._text = text;
    this._type = 'keyword';

    // g0 => full, g1 => required, g2 => text | textarea, g3 => area, g4 => length
    // length < 0 是自動寬度。

    if (regexp[3] && regexp[3].toLowerCase() === 'area') {
      this.size = -1;
      this._isTextArea = true;
    } else {
      this.size = +regexp[4] || 0;
    }

    this.require = ['R', 'r'].indexOf(regexp[1]) >= 0 ? true : false;
  }

  public size: number;

  public require: boolean;
}

export type TokenType = 'literally' | 'keyword';
