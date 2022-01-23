export type ImportMode = 'ADD' | 'EDIT';

export interface ImportFieldRec {
  name: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  hidden: boolean;
}

export type FieldName = 'TeacherId' | 'TeacherName' | 'Nickname' | 'Gender' | 'LinkAccount' | 'TeacherName^Nickname' | 'TeacherCode' | 'TeacherNumber';
