
export type SemesterList = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 代表每一學期學分數資訊。
 */
export class CreditSet {

  private credits: number[] = [NaN, NaN, NaN, NaN, NaN, NaN];

  constructor() {
  }

  [Symbol.iterator]() {
    return this.credits.values();
  }

  /** 設定指定學期的學分數。 */
  public set(semester: SemesterList, credit: number) {
    this.credits[semester - 1] = credit;
  }

  public setByGradeYear(gradeYear: number, semester: number, credit: number) {
    const map = new Map<string, number>([
      ['11', 0], ['12', 1],
      ['21', 2], ['22', 3],
      ['31', 4], ['32', 5],
    ]);

    this.credits[map.get(`${gradeYear}${semester}`)!] = credit;
  }

  /** 取得指定學期的學分數。 */
  public get(semester: SemesterList) {
    return this.credits[semester - 1]
  }

  /** 取得可用來比較的字串。 */
  public get unifiedKey() {
    return this.credits.join(':');
  }

  public diff(other: CreditSet) {
    const result = new CreditSet();
    for (let i = 1; i <= this.credits.length; i++) {
      const a = this.get(i as SemesterList);
      const b = other.get(i as SemesterList);

      if(a !== b) {
        result.set(i as any, b);
      } else {
        result.set(i as any, NaN);
      }
    }

    return result;
  }

  public clone() {
    const newone = new CreditSet();
    newone.credits = [...this.credits];
    return newone;
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
