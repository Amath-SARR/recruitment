import { Component, OnInit } from '@angular/core';
import { CampagneService } from 'src/app/entreprise/campagne/campagne.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/admin/user/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-campagne-public-show',
  templateUrl: './campagne-public-show.component.html',
  styleUrls: ['./campagne-public-show.component.css']
})
export class CampagnePublicShowComponent implements OnInit {

  campagne: Campagne;
  currentUser: User;
  public stateCandidat = {
    isLogin: false,
    campagneUid: this.activatedRoute.snapshot.params["uid"]
  }
  isRapportSending = false;

  constructor(public authSrv: AuthService, public campagneSrv: CampagneService, public activatedRoute: ActivatedRoute, public router: Router, private modal: NzModalService) {
    this.campagne = Object.create(null);
    this.currentUser = Object.create(null);
  }

  ngOnInit(): void {
    this.findCampagne(this.activatedRoute.snapshot.params["uid"]);
    this.authSrv.currentUserProvider.subscribe((user) => this.currentUser = user);
  }

  findCampagne(uid: string | undefined) {
    this.campagneSrv.findByUid(uid)
      .then((data: Campagne) => {
        this.campagne = data;
      })
      .catch(() => { })
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-19
     * @since 10.02.22
     * @description Redirige l'utilisateur connecte vers la page de creation de candidature ou affiche un modal s'il
     * n'est pas connecte.
   */
  redirectCandidatureForm() {
    if (!this.currentUser) {
      this.showLoginConfirm();
    } else {
      this.router.navigate(["/campagne", this.campagne.uid, "candidature"]);
    }
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-19
     * @since 10.02.22
     * @description Affiche le modal demandant à l'utilisateur s'il souhaite se connecter
   */
  showLoginConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Veuillez vous connecter ou ouvrir un compte',
      nzOkType: 'primary',
      nzOkText: 'Se Connecter',
      nzCancelText: 'Annuler',
      nzOnOk: () => this.redirectLoginForm(),
    });
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-19
     * @since 10.02.22
     * @description Redirige l'utilisateur vers la page de login avec le statut du candidat à savoir l'uid de la campagne pour
     * laquelle il souhaite postuler et s'il est connecte ou pas.
   */
  redirectLoginForm() {
    this.router.navigate(["/login"], { state: this.stateCandidat });
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-24
     * @since 16.02.22
     * @description Envoie les informations d'une candidature correspondant à une campagne spécifique.
   */
  sendCandidatureRapport() {
    this.isRapportSending = true;
    this.campagneSrv.sendCandidatureRapport(this.campagne.candidature)
      .then(() => {
        this.campagneSrv.http.toastr.success("Veuillez vérifier votre boîte email! Le rapport vous a été envoyé.");
      }).catch(() => {
      })
      .finally(() => { this.isRapportSending = false });
  }
}
