import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mycourse';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get('/auth/getAccessToken').subscribe(console.log);
    this.http.get('/auth/getMyInfo').subscribe(console.log);
    this.http.get('/service/gadget/selected_context').subscribe(console.log);
  }
}
