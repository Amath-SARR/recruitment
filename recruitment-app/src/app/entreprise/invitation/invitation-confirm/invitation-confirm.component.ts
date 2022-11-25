import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/admin/user/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Invitation } from '../invitation';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'app-invitation-confirm',
  templateUrl: './invitation-confirm.component.html',
  styleUrls: ['./invitation-confirm.component.css']
})
export class InvitationConfirmComponent implements OnInit {
  user: User;
  userInvite: Invitation;
  isRegistering = false;

  constructor(private invitationSrv: InvitationService, public activatedRoute: ActivatedRoute, public router: Router, public authSrv: AuthService) {
    this.user = new User();
    this.userInvite = new Invitation();
  }

  ngOnInit(): void {
    this.verifyToken()
  }

  /**
   * @description Permet une vérification du token d'invitation
   * @author Cheikh Tidiane GUEYE
   * @since 03.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-14
   * @return Promise
   */
  verifyToken() {
    this.invitationSrv.verifyToken({ 'uid': this.activatedRoute.snapshot.params['uid'] })
    .then((response) => {
      if (response.collaborated) {
        this.router.navigate(['entreprise', response.invitation?.entreprise?.uid]);
        this.invitationSrv.http.toastr.success("Désormais, vous êtes collaborateur de l'entreprise");
      } else {
        let data = response.invitation
        this.userInvite = data;
        this.user.email = data.email;
        this.user.telephone = data.telephone;
        this.user.name = data.prenoms + ' ' + data.nom;
      }
    }).catch(() => {
     })
  }

  /**
   * @description Permet l'enregistrement de l'invite comme user
   * @author Cheikh Tidiane GUEYE
   * @since 03.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-14
   */
  register() {
    this.isRegistering = true;
    this.user.uid = this.activatedRoute.snapshot.params['uid'];
    this.invitationSrv.saveUserAndCollaborateur(this.user)
    .then((data)=>{
      this.authSrv.setToken(data.token);
      this.authSrv.setCurrentUser(data.user);
      this.router.navigate(['/post-register']);
      this.invitationSrv.http.toastr.success("Désormais, vous êtes collaborateur de l'entreprise");
      this.invitationSrv.http.toastr.success("Un email est de confirmation de compte est envoyé à votre adresse email...");
    })
    .catch(()=>{})
    .finally(()=>this.isRegistering = false);
  }
}
