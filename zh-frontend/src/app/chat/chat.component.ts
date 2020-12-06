import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Message} from '../../Message';
import {Signalr} from '../signalr';
import {RegisterResponse} from '../RegisterResponse';
import {count} from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private  router: Router;
  private token: string;
  private http: HttpClient;
  public Messages: Array<Message>;
  private  sr: Signalr;
  constructor(router: Router, http: HttpClient) {
    this.router = router;
    this.http = http;
    this.Messages = new Array<Message>();
    this.token = sessionStorage.getItem('token');
    if (this.token == null || this.token.toString().length < 3){
      this.router.navigate(['login']);
    }
    else{
      const headers = {
        'Content-Type' : 'application/json',
        Authorization : 'Bearer ' + this.token
      };
      const options = {headers};
      this.http.get<Message[]>('https://localhost:44346/api/Message', options).subscribe(r => {
        this.Messages = r;
        console.log(r);
      });

      this.sr = new Signalr('https://localhost:44346/chatHub');
      this.sr.register('NewMessage', t => {
        this.Messages.push(t);
        return true;
      });
      this.sr.start();
    }
  }
  // tslint:disable-next-line:typedef
  sendMessage(message: HTMLInputElement) {
    const mess = new Message();
    mess.msg = message.value;
    this.token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type' : 'application/json',
      Authorization : 'Bearer ' + this.token
    };
    const options = {headers};
    this.http.post('https://localhost:44346/api/Message', mess, options).subscribe();
    message.value = '';
  }

  ngOnInit(): void {
  }

}
