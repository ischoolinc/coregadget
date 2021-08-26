import { TargetType } from "./my-course";

export interface GadgetCustomCloudServiceRec {
  UID?: string;
  TargetType: TargetType;
  TargetId: number;
  ServiceId: string;
  Link: string;
  Enabled: boolean;
  Sequence?: string;
}
