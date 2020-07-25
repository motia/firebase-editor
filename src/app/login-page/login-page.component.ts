import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string = 'ok@me.com';
  password: string;

  ngOnInit(){}


  constructor(public router: Router, public authenticationService: AuthenticationService) { }

  async onSubmit(submitter: string) {
    console.log({submitter})
    if (submitter === 'signin') {
      await this.signIn();
    } else {
      await this.signUp();
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
