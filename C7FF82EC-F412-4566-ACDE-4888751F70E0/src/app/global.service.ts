import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public selectItemText: string;
  public selectTarget: string;

  constructor() { }
}
