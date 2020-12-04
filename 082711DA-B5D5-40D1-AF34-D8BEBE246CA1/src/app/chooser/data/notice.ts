import { SafeHtml } from '@angular/platform-browser';

export class NoticeRecord {
  Id: string;
  Title: string;
  Message: string;
  DisplaySender: string;
  PostTime: string;
  Readed: string;
  Unread: string;
  TargetRole: string;
  rawMessage?: SafeHtml;
}
