import { Jsonx } from '@1campus/jsonx';
import { SubjectGroupKey } from './subject-group-key';
import { SubjectGroup } from './subject-group';
import { Required, RequiredBy} from './common';
import { Subject } from './subject';

export class GraduationPlan {

  private subjGroups = new Map<string, SubjectGroup>();

  constructor() { }

  /** 指定的科目群組是否存在。 */
  public has(key: SubjectGroupKey) {
    return this.subjGroups.has(key.identify);
  }

  /**
   * 取得科目資訊。
   */
  public get(key: SubjectGroupKey) {
    return this.subjGroups.get(key.identify);
  }

  [Symbol.iterator](): IterableIterator<SubjectGroup> {
    return this.subjGroups.values();
  }

  public static parse(xml: string) {
    const gp = new GraduationPlan();

    const gpx = Jsonx.parse(xml);

    for(const subjx of gpx.child('GraduationPlan').children('Subject')) {
      const subjName = subjx.getAttr('SubjectName');
      const req = subjx.getAttr('Required') as Required;
      const reqBy = subjx.getAttr('RequiredBy') as RequiredBy;

      const sgKey = new SubjectGroupKey(subjName, req, reqBy);

      const subjGroup = GraduationPlan.newOrGet(gp, sgKey);

      const subj = new Subject(subjx);

      subjGroup.addSubject(subj);
    }

    return gp;
  }

  /**
   * 在現有課程規劃中取得或是建立科目群組。
   */
  private static newOrGet(gp: GraduationPlan, sgKey: SubjectGroupKey) {
    let subjGroup: SubjectGroup;

    if (gp.subjGroups.has(sgKey.identify)) {
      subjGroup = gp.subjGroups.get(sgKey.identify)!;
    } else {
      subjGroup = new SubjectGroup(sgKey);
      gp.subjGroups.set(sgKey.identify, subjGroup);
    }

    return subjGroup;
  }
}
