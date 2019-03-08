export class QOption {
  constructor() {}
  answer_code: string;
  answer_text: string;
  answer_value: string;
  answer_martix: string[];
  answer_complete: boolean;
  answer_checked: boolean;

  public setAnswerCheck() {
    this.answer_checked = !this.answer_checked;

    // if (this.answer_checked) {
    //   if (this.answer_martix.length > 0) {
    //     this.answer_value = this.answer_martix.join("");
    //   } else {
    //     this.answer_value = this.answer_text;
    //   }
    // } else {
    //   this.answer_value = "";
    // }
  }
}
