import { ClassRecord, ClassStudentRecord } from './chooser.component';

export abstract class SelectionResult {

  constructor() {}

  /** 要顯示的文字。 */
  abstract get displayText(): string;

  get previewable(): boolean { return false; }

  abstract get IdList(): string[];
}

export class StudentSelection extends SelectionResult {

  constructor(
    private student: ClassStudentRecord
  ) {
    super();
  }

  get displayText(): string {
    // 普通科一年一班 王同學（510002）
    const { StudentName, StudentNumber } = this.student;

    return `${StudentName} (${StudentNumber})`;
  }

  get IdList(): string[] {
    return [this.student.StudentID];
  }
}

export class ClassSelection extends SelectionResult {

  constructor(
    public record: ClassRecord
  ) {
    super();
  }

  get displayText(): string {
    const {className } = this.record;

    return `${className} (共 ${this.record.students.length} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    return this.record.students.map(s => s.StudentID);
  }
}
