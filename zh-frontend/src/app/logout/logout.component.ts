import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {LoginResponse} from '../login-response';
import {RegisterResponse} from '../RegisterResponse';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  private http: HttpClient;
  private  router: Router;
  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
    const token = sessionStorage.getItem('token');
    if (token == null || token.toString().length < 3){
      this.router.navigate(['login']);
    }
  }
  logout(){
        sessionStorage.setItem('token', ' ');
        window.alert('You logged out!');
        this.router.navigate(['login']);
    }
  ngOnInit(): void {
  }

}
