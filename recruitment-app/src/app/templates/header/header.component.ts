import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/admin/user/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscriptions: Subscription[] = [];

  constructor(public authSrv: AuthService, public router: Router, public toastr: ToastrService) {
    this.currentUser = Object.create(null);
  }

  ngOnInit(): void {
    let subscription = this.authSrv.currentUserProvider
      .subscribe((user: User) => this.currentUser = user);
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  logout() {
    this.authSrv.logout()
      .then(() => {
        // remove all connexion data : token , localStorage token, currentUser
        this.authSrv.removeAllConnexionData();
        this.toastr.info("Vous êtes déconnecté avec succès !");
        this.router.navigate(['']);
      })
      .catch(() => { });
  }

}
