import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { User } from 'src/app/admin/user/user';
import { UserService } from 'src/app/admin/user/user.service';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error = '';
  loginModel = { email: '', password: '', device: navigator.userAgent };
  recoverForm = { email: '' };
  sendingLink = false
  user: any;
  isLoging = false;
  response: any
  socialPlatformProvider!: string;

  stateCandidat: any;

  constructor(private socialAuthSrv: SocialAuthService, public authSrv: AuthService, public router: Router, public userSrv: UserService) {
    this.user = new User
  }

  ngOnInit(): void {
    this.stateCandidat=history.state;
  }

  /**
   * @author Moussa FOFANA
   * @since 22.01.2022
   * @link https://recrutore.atlassian.net/browse/RAD-6
   * @description Gérer le processus de connexion de l'utilisateur
   * @copyright bamboguirassy
   * @returns void
   */
  login() {
    this.isLoging = true;
    this.authSrv.login(this.loginModel)
      .then((data: any) => {
        this.authSrv.setToken(data.token);
        this.authSrv.setCurrentUser(data.user);
        this.stateCandidat.isLogin = true;
        this.router.navigate([''], { state: this.stateCandidat});

      }).catch(() => { })
      .finally(() => this.isLoging = false);
  }

  /**
   * @author Mamadou lamine Bèye
   * @copyright bamboguirassy
   * @since 27.01.22
   * @description cette fonction prends en parametre l'email de l'utilisateur
   * et envoie un mail de reinitialiation avec un token
   */

  resetPassword() {
    this.sendingLink = true
    this.authSrv.sendLinkPassword(this.user).then((data) => {
      this.userSrv.http.toastr.success(data)
    }).catch(() => {
    }).finally(() => this.sendingLink = false);

  }

  /**
   * gere le processus d'inscription via google
   * @author Mamadou lamine Bèye
   * @copyright bamboguirassy
   * @since 06.02.22
   * @description gere la connexion via les reseaux sociaux
   * @returns void
   */
  loginWithGoogle() {
      this.socialAuthSrv.signIn(GoogleLoginProvider.PROVIDER_ID).then(
        (userData) => {
          this.authSrv.socialSignIn(userData).then((response) => {
            this.authSrv.setToken(response.token);
            this.authSrv.setCurrentUser(response.user);
            this.router.navigate(['']);
          });
        }
      );
  }

  /**
   * gere le processus d'inscription/connexion via facebook
   * @author Moussa FOFANA
   * @copyright bamboguirassy
   * @since 11.02.22
   * @description gere la connexion via les reseaux sociaux
   * @returns void
   */
  loginWithFacebook() {
      this.socialAuthSrv.signIn(FacebookLoginProvider.PROVIDER_ID).then(
        (userData) => {
          this.authSrv.socialSignIn(userData).then((response) => {
            this.authSrv.setToken(response.token);
            this.authSrv.setCurrentUser(response.user);
            this.router.navigate(['']);
          });
        }
      );
  }
}
