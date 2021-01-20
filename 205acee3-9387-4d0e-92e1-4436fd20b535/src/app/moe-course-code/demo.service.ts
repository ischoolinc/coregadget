import { GadgetService } from './../core/gadget.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor(
    private http: HttpClient,
    private gadget: GadgetService
  ) { }

  public getGraduationPlan() {
    return this.http.get('./assets/plan_demo.xml', {
      responseType: 'text'
    });
  }
}
