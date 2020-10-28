import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreRuleService {

  constructor(private gadget: GadgetService) { 

  }
}


