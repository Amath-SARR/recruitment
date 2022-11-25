import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/user/user';
import { UserService } from 'src/app/admin/user/user.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-post-register',
  templateUrl: './post-register.component.html',
  styleUrls: ['./post-register.component.css']
})
export class PostRegisterComponent implements OnInit, OnDestroy {

  currentUser: User;
  subscriptions: Subscription[] = [];
  isChangePasswordSectionVisible = false;
  isConfirmMessageVisible = true;
  newEmail = '';
  isEmailChanging = false;

  constructor(private authSrv: AuthService, public userSrv: UserService) {
    this.currentUser = Object.create(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    let subscription = this.authSrv.currentUserProvider
      .subscribe((user) => this.currentUser = user);
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
  }

  showChangePasswordSectionVisible() {
    this.isChangePasswordSectionVisible = true;
    this.isConfirmMessageVisible = false;
  }

  changeEmail() {
    this.isEmailChanging = true;
    this.userSrv.updateUserEmailOnRegister(this.currentUser,this.newEmail)
    .then((data)=>{
      this.newEmail = '';
      this.isChangePasswordSectionVisible = false;
      this.isConfirmMessageVisible = true;
      this.currentUser = data;
      this.userSrv.http.toastr.success("Votre compte a été mis à jour avec succès, un lien de confirmation est envoyé sur le nouvel email !!!");
    })
    .catch(()=>{})
    .finally(()=> this.isEmailChanging = false);
  }

}
