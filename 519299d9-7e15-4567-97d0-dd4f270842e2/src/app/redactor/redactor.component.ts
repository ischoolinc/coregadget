import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, delayWhen } from 'rxjs/operators';

declare const $R: any;

@Component({
  selector: 'app-redactor',
  templateUrl: './redactor.component.html',
  styleUrls: ['./redactor.component.scss']
})
export class RedactorComponent implements OnInit, OnDestroy {

  private $dispose = new Subject<void>();
  private $html = new BehaviorSubject<string>('');

  constructor() { }

  @ViewChild('content') editor: ElementRef<HTMLTextAreaElement>;

  @Input() set html(str: string) {
    this.$html.next(str);
  }

  @Output() htmlChange = new EventEmitter<string>();

  @Output() focus = new EventEmitter<any>();

  ngOnInit() {
    // https://img.youtube.com/vi/lnhiRllXEP8/maxresdefault.jpg
    // https://www.youtube.com/watch?v=lnhiRllXEP8
    const changeEvent = this.htmlChange;
    const focusEvent = this.focus;
    const options = {
      lang: 'zh_tw',
      buttons: ['html', 'format', 'bold', 'italic', 'lists', 'link'],
      plugins: ['video', 'addimage'], // 插入影片、圖片功能。
      autoparseVideo: false, // 關閉自動解析影片功能，這會打壞圖片功能...
      paragraphize: false,  // 不要破壞原本 attr 的結構
      callbacks: {
        started() {
          // 在這裡只能用 this.source.setCode 這類 api 進行操作，其他方式可能不運作。
          // console.log('editor started...');
        },
        changed(html: string) {
          changeEvent.emit(html);
        },
        focus(e: any) {
          focusEvent.emit(e);
        }
      }
    };

    // 這行執行完 editor 就會準備好。
    $R(this.editor.nativeElement, options);

    this.$html.pipe(
      takeUntil(this.$dispose),
    ).subscribe(htmlstr => {
      $R(this.editor.nativeElement, 'source.setCode', htmlstr || '');
    });

  }

  ngOnDestroy() {
    this.$dispose.next();
  }

}
