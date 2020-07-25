import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EditorWrapperComponent } from './editor-wrapper/editor-wrapper.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/editor']);

const routes: Routes = [
  { component: LoginPageComponent, path: '' },
  { component: EditorWrapperComponent, path: 'editor',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },

},
  { component: PageNotFoundComponent, path: '**' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
