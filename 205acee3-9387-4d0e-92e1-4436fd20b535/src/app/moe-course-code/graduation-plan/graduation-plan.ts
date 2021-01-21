import { CourseCodeRecord } from './../course-code-record';
import { DiffSubject } from './../diff-subject';
import { CourseCodeTable } from './../course-code-table';
import { Jsonx } from '@1campus/jsonx';
import { SubjectKey } from '../subject-key';
import { SubjectGroup } from './subject-group';
import { Required, RequiredBy} from './common';
import { Subject } from './subject';
import { UnifiedSubject } from '../unified-subject';

export class GraduationPlan {

  private subjGroups = new Map<string, SubjectGroup>();

  constructor() { }

  /** 指定的科目群組是否存在。 */
  public has(key: SubjectKey) {
    return this.subjGroups.has(key.identify);
  }

  /**
   * 取得科目資訊。
   */
  public get(key: SubjectKey) {
    return this.subjGroups.get(key.identify);
  }

  [Symbol.iterator](): IterableIterator<SubjectGroup> {
    return this.subjGroups.values();
  }

  /** 對照課程代碼表。 */
  public fillCorrespondingCourseCode(courseTable: CourseCodeTable) {

    for(const subj of this) {
      subj.fillCorrespondingCourseCode(courseTable);
    }
  }

  /**
   * 取得與課程代碼表的差異資料。
   */
  public diff(courseTable: CourseCodeTable) {
    const changeset: DiffSubject[] = [];
    const moe: UnifiedSubject[] = [];
    const cp: UnifiedSubject[] = [];

    for(const subj of courseTable) {
      moe.push(subj.getUnifiedSubject());
    }

    for(const subj of this) {
      cp.push(subj.getUnifiedSubject());
    }
    const cpmap = new Map<string, UnifiedSubject>(cp.map(v => [v.getUnifiedKey(), v]));

    // 比較兩個科目清單差異。
    for(const moesubj of moe) {
      if(cpmap.has(moesubj.getUnifiedKey())) { // check modify

        const cpsubj = cpmap.get(moesubj.getUnifiedKey())!;
        const diff = cpsubj.getDiff(moesubj);
        if (diff) { changeset.push(diff); }

      } else { // add
        changeset.push(new DiffSubject(moesubj, 'new'));
      }
    }

    return changeset;
  }

  public static parse(xml: string) {
    const gp = new GraduationPlan();

    const gpx = Jsonx.parse(xml);

    for(const subjx of gpx.child('GraduationPlan').children('Subject')) {
      const subjName = subjx.getAttr('SubjectName');
      const req = subjx.getAttr('Required') as Required;
      const reqBy = subjx.getAttr('RequiredBy') as RequiredBy;

      const sgKey = new SubjectKey(subjName, req, reqBy);

      const subjGroup = GraduationPlan.newOrGet(gp, sgKey);

      const subj = new Subject(subjx);

      subjGroup.addSubject(subj);
    }

    return gp;
  }

  /**
   * 在現有課程規劃中取得或是建立科目群組。
   */
  private static newOrGet(gp: GraduationPlan, sgKey: SubjectKey) {
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
