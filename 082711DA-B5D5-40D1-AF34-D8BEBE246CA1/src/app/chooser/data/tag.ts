export class TagPrefix {
  Prefix: string;
  MemberCount: number;
  MemberIds: string[];
  Tags: TagRecord[];
  checked?: boolean;
  [x: string]: any;
}

export class TagRecord {
  TagId: string;
  Name: string;
  Prefix: string;
  MemberIds: string[];
  checked?: boolean;
}
