import { Component, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { Utils } from '../util';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styles: []
})
export class TemplateComponent implements OnInit {

  head: string;
  accessPoint: string;
  commentTemplateInfo: any;
  defaultTemplate: any;
  userDefineTemplate: any;
  loading: boolean;
  error: any;
  addText: string;
  constructor(private gadget: GadgetService) { }
  contract :Contract;

 async ngOnInit() {
//取得contract 連線
 this.contract= await this.gadget.getContract('kcis');
 this.getCommentTemplate();
console.log("template=",this.commentTemplateInfo);
  }




async getCommentTemplate() {
  try {
    this.loading = true;
     console.log("進入getTemplate")
    // 呼叫 service。
    const rsp = await this.contract.send('behavior.GetCommentTemplate');
    console.log("rsp=",rsp)
    this.commentTemplateInfo = Utils.array(rsp, "Response/CommentTemplate");
    this.defaultTemplate = [];
    this.userDefineTemplate = [];
    for (const comment of this.commentTemplateInfo) {
      if (comment.IsDefault === 't') {
        this.defaultTemplate.push(comment);
      } else {
        this.userDefineTemplate.push(comment);
      }
    }

    // console.log(this.commentTemplateInfo);
    // console.log(this.defaultTemplate);
    // console.log(this.userDefineTemplate);
  } catch (err) {
    console.log(err);
  } finally {
    this.loading = false;
  }

}

async add() {
  // console.log(this.addText);

  if (this.addText !== undefined) {
    try {
      this.loading = true;

      // 呼叫 service。
      this.commentTemplateInfo = (await this.contract.send('behaviorForAll.AddCommentTemplate', {
        Request: {
          CommentTemplate: {
            Field: {
              Comment: this.addText,
            }
          }
        }
      })).Response.CommentTemplate;

    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
    //this.userDefineTemplate.push({ Comment: this.addText });
    this.getCommentTemplate ();
  } else {
    alert("請輸入 Comment");
  }

}

async delete(comment) {
  console.log(comment);
  this.userDefineTemplate = this.userDefineTemplate.filter(v => v.Uid != comment.Uid);
  try {
    this.loading = true;

    // 呼叫 service。
    this.commentTemplateInfo = (await this.contract.send('behaviorForAll.DelCommentTemplate', {
      Request: {
        CommentTemplate: {
          Condition: {
            Uid: comment.Uid
          }
        }
      }
    })).Response.CommentTemplate;

  } catch (err) {
    console.log(err);
  } finally {
    this.loading = false;
  }


}




}



