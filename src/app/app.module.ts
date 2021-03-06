import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorWrapperComponent } from './editor-wrapper/editor-wrapper.component';

import { AuthenticationService } from './shared/authentication.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { MatButtonModule, MatIconModule, MatInputModule, MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    EditorWrapperComponent,
    LoginPageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthGuardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatIconModule, MatInputModule, MatCardModule,
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
