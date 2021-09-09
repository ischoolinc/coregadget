export type ImportMode = 'ADD' | 'EDIT' | 'DELETE';

export interface ImportFieldRec {
  name: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  hidden: boolean;
}

export type FieldName = 'StudentId' | 'StudentName' | 'Gender' | 'StudentNumber' | 'SeatNo'
  |'LinkAccount' | 'StudentCode' | 'ParentCode' | 'ClassId' | 'ClassName' | 'StudentStatus'
  | 'StudentNumber^StudentStatus';
