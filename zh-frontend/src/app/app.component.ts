import { Component } from '@angular/core';
import {Router} from '@angular/router';
import construct = Reflect.construct;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatWithMe';
  private  router: Router;

  constructor(router: Router) {
    this.router = router;
    this.router.navigate(['/login']);
  }
}
