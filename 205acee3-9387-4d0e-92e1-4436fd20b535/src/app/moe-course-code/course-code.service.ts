import { CodeField } from './record';
import { MappingTable } from './mapping-table';
import { CourseCode } from './course-code';
import { ListName, MOEService } from './moe.service';
import { Injectable } from '@angular/core';
import { Field } from './field';
import { CourseCodeTable } from './course-code-table';

@Injectable({
  providedIn: 'root'
})
export class CourseCodeService {

  private tables: Map<Field, MappingTable> | null = null;

  private extTables = new  Map<Field, CodeField[]>();

  constructor(
    private moe: MOEService
  ) {}


  /** 取得指定的課程代碼表。 */
  public async getCourseCodeTable(groupCode: string): Promise<CourseCodeTable> {
    const sixteen = await this.moe.getCourseCodeTable(groupCode);
    const cct = new CourseCodeTable(sixteen.Response.Code);

    try {
      await this.applyDescription(cct.getCodesRef());
    } catch(err) {
      console.log(err);
    }


    return cct;
  }
  /**
   * 套用課程代碼中每個欄位的中文說明。
   * @param codeList 課程代碼清單。
   */
  public async applyDescription(codeList: CourseCode[]) {

    if(!this.tables) {
      await this.loadTables();

      if(!this.tables) return;
    }

    for(const code of codeList) {
      for(const field of [Field.N03,
        Field.N04,
        Field.N05,
        Field.N06,
        Field.N07,
        Field.N08,
        Field.N09,
        Field.N10]) {

        const map = this.tables.get(field);

        if(!map) continue;

        code.setDescription(field, map);
      }
    }
  }

  /**
   * 針對指定的欄位增加延申的對照資料，例如：班群(索引：6)。
   * @param field 要延申的欄位。
   * @param values 對照表清單。
   */
  public addExtTable(field: Field, values: CodeField[]) {
    this.extTables.set(field, values);
  }

  private async loadTables() {
    this.tables = new Map<Field, MappingTable>();

    const argList = [
      { name: ListName.SCH, field: Field.N03, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.GRP, field: Field.N04, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.DEP, field: Field.N05, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.CLA, field: Field.N06, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.CAT, field: Field.N07, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.MOD, field: Field.N08, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.ATT1, field: Field.N09, keyName: '代碼', valueName: '代碼說明' },
      { name: ListName.FLD, field: Field.N10, keyName: '代碼', valueName: '代碼說明' },
    ]

    for(const arg of argList) {
      const mapdata = await this.moe.getList(arg.name).toPromise();
      const map = new MappingTable(arg.keyName, arg.valueName, mapdata);

      if(this.extTables.has(arg.field)) {
        this.extTables.get(arg.field)?.forEach(v => map.addCode(v));
      }

      this.tables.set(arg.field, map);
    }
  }

}
