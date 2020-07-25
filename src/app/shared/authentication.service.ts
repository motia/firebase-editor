import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: Observable<firebase.User>;
  loggedIn: boolean = false;

  constructor(
    private angularFireAuth: AngularFireAuth,
    ) {
      this.userData = angularFireAuth.authState;
    }

    /* Sign up */
    async SignUp(email: string, password: string) {
      try {
        const res = await this.angularFireAuth
        .auth.createUserWithEmailAndPassword(email, password);
        console.log('Successfully signed up!', res);
      } catch(error) {
        console.log(email, password)
        console.log('Something is wrong:', error.message);
        throw error
      }
    }

    /* Sign in */
    SignIn(email: string, password: string) {
      return this.angularFireAuth
      .auth.signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        console.log('Successfully signed in!');
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
        throw error;
      });
    }

    /* Sign out */
    SignOut() {
      return this.angularFireAuth
      .auth.signOut();
    }
  }
