import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string = '';
  password: string = '';
  error = new BehaviorSubject('');
  
  hide = true;

  ngOnInit(){}


  constructor(public router: Router, public authenticationService: AuthenticationService) { }

  async onSubmit(submitter: string) {
    try {
      if (submitter === 'signin') {
        await this.signIn();
      } else {
        await this.signUp();
      }
    } catch (e) {
      if (e.code && e.code.startsWith('auth/') && e.message) {
        this.error.next(e.message)
      }
      this.error.next((submitter === 'signin' ? 'Login' : 'Sign up') + ' has failed');
      throw e;
    }

    this.goToEditor(true);
  }

  goToEditor(replaceUrl: boolean = false) {
    return this.router.navigate(['/editor'], { replaceUrl: replaceUrl || false });
  }

  async signUp() {
    await this.authenticationService.SignUp(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  async signIn() {
    this.email = '';
    this.password = '';
  }

  signOut() {
    this.authenticationService.SignOut();
  }

}
