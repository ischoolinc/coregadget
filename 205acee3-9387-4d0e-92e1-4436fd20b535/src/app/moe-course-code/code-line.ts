/** 代表課程代碼中某區段代碼的文字與相對應的中文名稱。 */
export type CodeField = { value: string, description: string };

/** 代表一整組的課程代碼資料。 */
export class CodeLine extends Array<CodeField> {
}
