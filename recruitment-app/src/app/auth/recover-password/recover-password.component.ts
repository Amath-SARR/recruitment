import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/admin/user/user';
import { UserService } from 'src/app/admin/user/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  recoverPasswordForm = { email: '', password: '', password_confirmation: '' }
  confirmationToken: any;
  user: any;
  errors: undefined;
  registering = true;
  show: boolean = false;
  pageError: boolean = false;
  updatingPasswordLoading = false; // changed by M FOFANA

  constructor(private authSrv: AuthService, public activatedRoute: ActivatedRoute, public userSrv: UserService, public router: Router) {
    this.user = new User
    this.confirmationToken = this.activatedRoute.snapshot.params['token']
  }

  ngOnInit(): void {
    this.verifyToken()
  }

  /**
   * @author MAMADOU LAMINE BEYE
   * @copyright bamboguirassy
   * @since 27.01.22
   * @description Cette fonction permet de verifier la validite le token envoyer par l'utilisateur
   * pour modifier son mot de passe
   */
  verifyToken() {
    this.authSrv.verifyToken({ 'confirmationToken': this.activatedRoute.snapshot.params['token'] })
      .then((data) => {
        this.user = data;
        this.show = true;
        this.userSrv.http.toastr.success("Merci de renseigner votre nouveau mot de passe")
      }).catch(() => {
        this.pageError = true;
        this.userSrv.http.toastr.error("Lien expiré ou token invalide")
      })

  }
  /**
   * @author MAMADOU LAMINE BEYE
   * @copyright bamboguirassy
   * @since 27.01.22
   * @description Cette fonction permet à l'utilisateur de mettre à jour son mot de passe
   */
  updatePassword() {
    this.updatingPasswordLoading = true;
    this.authSrv.updatePassword(this.user).then((data: any) => {
      this.updatingPasswordLoading = true;
      this.userSrv.http.toastr.success(data);
      this.userSrv.http.toastr.success("Merci de vous connecter avec votre nouveau mot de passe...");
      this.router.navigate(['/login']);
    }).catch(() => {
    }).finally(() => this.updatingPasswordLoading = false);;
  }
}
