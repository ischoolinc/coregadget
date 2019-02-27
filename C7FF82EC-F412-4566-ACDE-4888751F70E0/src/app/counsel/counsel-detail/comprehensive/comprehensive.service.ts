import { Injectable } from '@angular/core';
import { DsaService } from '../../../dsa.service';
import { QSubject, FillInSection } from './core';

@Injectable({
  providedIn: 'root'
})
export class ComprehensiveService {

  constructor(public dsaService: DsaService) { }

  /**取得填寫梯次 */
  async getFillInSection(studentId: string): Promise<FillInSection[]> {
    const rsp = await this.dsaService.send("GetFillInSection", {
      StudentID: studentId
    });
    return [].concat(rsp.FillInSection || []);
  }

  /**取得填寫資料 */
  async getFillInData(studentId: string, sectionId: string): Promise<QSubject[]> {
    const rsp = await this.dsaService.send("GetFillInData", {
      Request: {
        StudentID: studentId,
        FillInSectionID: sectionId,
      }
    });
    const res = [].concat(rsp.QuestionSubject || []) as QSubject[];
    res.map(qSubj => {
      qSubj.QuestionGroup = [].concat(qSubj.QuestionGroup || []);
      qSubj.QuestionGroup.map(qGroup => {
        qGroup.QuestionQuery = [].concat(qGroup.QuestionQuery || []);
        qGroup.QuestionQuery.map(qQuery => {
          qQuery.QuestionText = [].concat(qQuery.QuestionText || []);
          qQuery.QuestionText.map(qText => {
            qText.Require = JSON.parse('' + qText.Require) || false;
            qText.Options = [].concat(qText.Options || []);
            qText.Options.map(qOption => {
              qOption.AnswerChecked = JSON.parse('' + qOption.AnswerChecked) || false;
              qOption.AnswerMatrix = [].concat(JSON.parse('' + qOption.AnswerMatrix) || []);
              qOption.AnswerComplete = JSON.parse('' + qOption.AnswerComplete) || false;
            });
          });
        });
      });
    });
    return res;
  }
}
