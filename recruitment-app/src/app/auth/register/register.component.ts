import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/admin/user/user';
import { UserService } from '../../admin/user/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errors = [];
  user: User;
  registering = false;
  constructor(public userSrv: UserService, public authSrv: AuthService, public router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
  }

  register() {
    this.registering = true;
    this.userSrv.save(this.user)
    .then((data)=>{
      this.authSrv.setToken(data.token);
      this.authSrv.setCurrentUser(data.user);
      this.userSrv.http.toastr.success("Votre est créé avec succès, un lien de confirmation est envoyé à l'adresse email indiqué...");
      this.router.navigate(['/post-register']);
    })
    .catch(()=>{})
    .finally(()=>this.registering = false);
  }

}
