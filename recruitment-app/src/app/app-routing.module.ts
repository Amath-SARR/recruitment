import { CandidatureShowComponent } from './default/candidature/candidature-show/candidature-show.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminRoutes } from './admin/admin-routes';
import { PostRegisterComponent } from './auth/post-register/post-register.component';
import { ConfirmAccountComponent } from './auth/confirm-account/confirm-account.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { ProfilComponent } from './auth/profil/profil.component';
import { defaultRoutes } from './default/default-routes';
import { HomeComponent } from './default/home/home.component';
import { entrepriseRoutes } from './entreprise/entreprise-routes';
import { CandidatCandidatureListComponent } from './default/candidature/candidat-candidature-list/candidat-candidature-list.component';
import { CandidatureSpontaneeNewComponent } from './default/candidature/candidature-spontanee-new/candidature-spontanee-new/candidature-spontanee-new.component';

const routes: Routes = [
  {'path':'',component: HomeComponent},
  { 'path': 'login', component: LoginComponent },
  { 'path': 'profil', component: ProfilComponent },
  { 'path': 'register', component: RegisterComponent },
  { 'path': 'post-register', component: PostRegisterComponent },
  { 'path': 'confirm-account/:token', component: ConfirmAccountComponent },
  { 'path': 'change-password/:token', component: RecoverPasswordComponent },
  { 'path': 'candidature', component:CandidatCandidatureListComponent },
  { 'path': 'candidature/spontanee/new', component:CandidatureSpontaneeNewComponent },


  defaultRoutes,
  adminRoutes,
  entrepriseRoutes,
  { 'path': '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
