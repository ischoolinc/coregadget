
/**
 * 代表每一學期學分數資訊。
 */
export class CreditSet {

  private credits: number[] = [NaN, NaN, NaN, NaN, NaN, NaN];

  constructor() {
  }

  [Symbol.iterator]() {
    return this.credits;
  }

  /** 設定指定學期的學分數。 */
  public set(semester: 1 | 2 | 3 | 4 | 5 | 6, credit: number) {
    this.credits[semester - 1] = credit;
  }

  public static parse(credits: string) {
    const cs = new CreditSet();

    const map = new Map<string, number>([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 5],
      ['6', 6],
      ['A', 1],
      ['B', 2],
      ['C', 3],
      ['D', 4],
      ['E', 5],
      ['F', 6],
    ]);

    const line = credits.toUpperCase();
    for (let i = 0; i <= 5; i++) {
      const credit = line[i];

      if(!credit) continue;

      if(map.has(credit)) {
        cs.credits[i] = map.get(credit)!;
      }
    }

    return cs;
  }
}
