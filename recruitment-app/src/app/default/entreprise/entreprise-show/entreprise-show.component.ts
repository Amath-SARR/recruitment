import { entrepriseRoutes } from './../../../entreprise/entreprise-routes';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from './../entreprise.service';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FileService } from 'src/app/shared/services/file.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/admin/user/user.service';
import { FollowerService } from '../follower.service';
import { Follower } from './follower';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-entreprise-show',
  templateUrl: './entreprise-show.component.html',
  styleUrls: ['./entreprise-show.component.css']
})
export class EntrepriseShowComponent implements OnInit {

  entreprise: Entreprise;
  errors: any = {};
  isUpdateLogo = false;
  isFollowProcessing = false;

  constructor(private modal: NzModalService, public entrepriseSrv: EntrepriseService, private activatedRoute: ActivatedRoute,
    private router: Router, public authSrv: AuthService, public userSrv: UserService,
    public followerSrv: FollowerService, public fileSrv: FileService) {
    this.entreprise = Object.create(null);
  }

  ngOnInit(): void {
    this.getByUid();


  }

  redirectionCandidatureSpontanee() {
    if (this.entreprise.candidatureSpontanee == true) {
        this.router.navigate(['/candidature/spontanee/new',this.entreprise.uid]);
        
    } else {
      this.entrepriseSrv.http.toastr.info("L'entreprise n’autorise pas les candidatures spontanées");
      
    }
    
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 01.02.22
   * @description Récupère les informations de l'entreprise avec l'uid donné; Si l'uid donné n'existe pas, rédirige vers la page d'accueil
   * @param string
   * @param undefined
   */
  getByUid() {
    this.entrepriseSrv.findByUid(this.activatedRoute.snapshot.params["uid"])
      .then((data: Entreprise) => {
        this.entreprise = data;        
      })
      .catch(() => {
        this.router.navigate(['/']);
      })
  }

  /**
   * Permet de faire la mise à jour du logo d'une entreprise
   * @author Mariama Fatou Sarr DIOP
   * @since 03.02.22
   * @param event
   */

  updateImage(event: any) {
    this.fileSrv.convertImageToBase64String(event)
      .then((data: string) => {
        this.entreprise.logo = data;
        this.isUpdateLogo = true;
        this.entrepriseSrv.uploadphoto(this.entreprise)
          .then((entreprise: Entreprise) => {
            this.entreprise = entreprise;
            this.entrepriseSrv.http.toastr.success("Logo mis à jour avec succès")
          })
          .catch((err: PromiseError) => {
            if (err.validationError) {
              this.errors = err.data;
            }
          })
          .finally(() => { this.isUpdateLogo = false });
      })
      .catch(() => { });
  }

  /**
  * @author El Hadji Amath SARR
  * @since 02.02.22
  * @link https://recrutore.atlassian.net/browse/RAD-99
  * @description La fonction pour sauvegarder l'utilisateur qui suit une entreprise
  * @param entreprise
  * @return promise
  */
  followEntreprise() {
    this.isFollowProcessing = true;
    let follower = new Follower();
    follower.entreprise_id = this.entreprise.id;
    this.followerSrv.save(follower)
      .then((data: Follower) => {
        this.entreprise.follower = data;
        this.entreprise.followed = true;
        this.followerSrv.http.toastr.success("Désormais, vous receivez tous les informations de cette entreprise !");
      })
      .catch(() => { })
      .finally(() => this.isFollowProcessing = false);
  }

  /**
  * @author El Hadji Amath SARR
  * @since 02.04.22
  * @link https://recrutore.atlassian.net/browse/RAD-99
  * @description La fonction pour supprimer l'utilisateur qui ne suit plus l'entreprise
  * @param entreprise
  * @return promise
  */
  unfollowEntreprise() {
    this.isFollowProcessing = true;
    this.followerSrv.removeObject(this.entreprise.follower)
      .then(() => {
        this.entreprise.follower = Object.create(null);
        this.entreprise.followed = false;
        this.entrepriseSrv.http.toastr.success("Vous ne recevrez plus les informations de de cette entreprise !");
      })
      .catch(() => { })
      .finally(() => this.isFollowProcessing = false);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 08.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-79
   * @description Supprime une entreprise
   * @returns void
   */
  delete() {
    this.entrepriseSrv.removeObject(this.entreprise)
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        this.entrepriseSrv.http.toastr.success("Entreprise correctement supprimée");
        this.router.navigate(['/']);
      });
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 08.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-79
   * @description Affiche le modal de confirmation pour la suppresion d'une entrepise
   */
  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Êtes vous sûr de vouloir supprimer cet entreprise',
      nzOkText: 'Oui, je suis sûr',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(),
      nzCancelText: 'Non, annuler',
    });
  }

}

