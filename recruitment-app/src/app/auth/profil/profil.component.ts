import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/admin/user/user';
import { UserService } from 'src/app/admin/user/user.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { FileService } from 'src/app/shared/services/file.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {

  user: any;
  userModel = new User();
  isProfilUpdate = false;
  isPhotoUploading = false;
  isPasswordUpdate = false;
  errors: any = {};
  subscriptions: Subscription[] = [];
  constructor(public authSrv: AuthService, public userSrv: UserService, public fileSrv: FileService) {

  }

  ngOnInit(): void {
    this.getConnectedUsers();
  }

  /**
   * @author Moussa FOFANA
   * @since 28.01.22
   * @copyright bamboguirassy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  /**
   * @author Mamadou Fam
   * @description fonction qui Recupere les donnée l'utilisateur connecté
   * @since 26.01.22
   */
  getConnectedUsers() {
    let subscription = this.authSrv.currentUserProvider.subscribe(
      (data: any) => {
        this.user = data;
      }
    );
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }

  }


  /**
 * @author  mamadou FAM
 * @since 26.01.22
 * @description fonction qui met à jour les données de l'utilisateur
 */
  updateProfil() {
    this.userModel = this.user;
    this.isProfilUpdate = true;
    this.userSrv.update(this.userModel)
      .then(() => {
        this.authSrv.http.toastr.success("Profil mis à jour avec succès");
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isProfilUpdate = false });
  }

  changePassword() {
    this.userModel = this.user;
    this.isPasswordUpdate = true;
    this.userSrv.changePassword(this.userModel)
      .then(() => {
        this.authSrv.http.toastr.success("Mot de passe mis à jour avec succès");
        this.userModel = new User();
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isPasswordUpdate = false });
  }

  handleFileSelect(evt: any) {
    this.fileSrv.convertImageToBase64String(evt)
      .then((data: string) => {
        this.user.photo = data;
        this.userModel = this.user;
        this.isPhotoUploading = true;
        this.userSrv.uploadPhoto(this.userModel)
          .then((user: User) => {
            this.authSrv.setCurrentUser(user);
            this.authSrv.http.toastr.success("Photo mis à jour avec succès");
          }).catch((err: PromiseError) => {
            if (err.validationError) {
              this.errors = err.data;
            }
          })
          .finally(() => { this.isPhotoUploading = false });
      })
      .catch(() => { });
  }
}
