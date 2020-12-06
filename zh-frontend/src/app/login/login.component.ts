import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../login-response';
import {Router} from '@angular/router';
import {RegisterResponse} from '../RegisterResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private http: HttpClient;
  private  router: Router;
  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }
  // tslint:disable-next-line:typedef
  login(name: HTMLInputElement, pass: HTMLInputElement) {
    const actualuser = new User();
    actualuser.username = name.value;
    actualuser.password = pass.value;

    this.http.post<LoginResponse>('https://localhost:44346/login', actualuser).subscribe(response => {
      const token = response.token;
      console.log(token);
      if (token != null && token.toString().length > 3) {
        sessionStorage.setItem('token', token);
        this.router.navigate(['chat']);
      }
    }, error => {
      if (error.status.toString() === '401') {
        window.alert('Invalid username or password.');
        name.value = '';
        pass.value = '';
      } else {
        window.alert('Server is down.');
        name.value = '';
        pass.value = '';
      }
    });
  }

  // tslint:disable-next-line:typedef
  registration(email: HTMLInputElement, password: HTMLInputElement){
    const actualuser = new User();
    actualuser.email = email.value;
    actualuser.password = password.value;

    this.http.post<RegisterResponse>('https://localhost:44346/register', actualuser).subscribe(response => {
      const username = response.username;
      // tslint:disable-next-line:triple-equals
      console.log(username);
      if (username !== ' '){
        window.alert('Successfully registered!');
        email.value = '';
        password.value = '';
      }
    });
  }

  ngOnInit(): void {
  }

}
