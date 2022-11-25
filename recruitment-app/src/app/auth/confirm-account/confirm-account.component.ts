import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/admin/user/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {

  constructor(public userSrv: UserService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let token = this.activatedRoute.snapshot.params['token'];
    this.userSrv.confirmAccount(token)
      .then(() => {
        this.userSrv.http.toastr.success("Votre compte est activé avec succès !!!");
        this.router.navigate(['/login']);
      }).catch(() => { });

  }



}
