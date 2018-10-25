import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

interface Response {
  userId: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Our socket connection
  private socket;
  messages = [];
  userId;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://localhost:3000/login').subscribe(({ userId }: Response) => {
      console.log(userId);
      this.userId = userId;
      this.socket = io('http://localhost:3000?userId=' + userId);
      this.socket.on('message', data => {
        console.log(data);

        this.messages.push(data);
      })
    });
  }
}
