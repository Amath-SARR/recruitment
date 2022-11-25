import { CampagneService } from './../../entreprise/campagne/campagne.service';
import { Campagne } from './../../entreprise/campagne/campagne';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/admin/user/user';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EntrepriseService } from '../entreprise/entreprise.service';
import { Entreprise } from '../entreprise/entreprise';
import { TypeOffre } from 'src/app/admin/type-offre/type-offre';
import { TypeOffreService } from 'src/app/admin/type-offre/type-offre.service';
import { Hashtag } from 'src/app/admin/hashtag/hashtag';
import { HashtagService } from 'src/app/admin/hashtag/hashtag.service';
import { CategorieEmploi } from 'src/app/admin/categorie-emploi/categorie-emploi';
import { CategorieEmploiService } from 'src/app/admin/categorie-emploi/categorie-emploi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  entreprises: Entreprise[] = [];
  typeOffres: TypeOffre[] = [];
  selectedTypeOffres: TypeOffre[] = [];
  isLoadingTypeOffres = false;
  hashtags: Hashtag[] = [];
  isLoadingHashtags = false;
  selectedHashtags: Hashtag[] = [];
  selectedCategorieEmploi: CategorieEmploi[] = [];
  isLoadingCategorieEmplois = false;
  CategorieEmplois: CategorieEmploi[] = [];
  currentUser: User;
  subscriptions: Subscription[] = [];
  static isLogin = false;
  campagnes: Campagne[] = [];
  stateCandidat: any;

  constructor(
    public authSrv: AuthService,
    public router: Router,
    private modal: NzModalService,
    public typeOffreSrv: TypeOffreService,
    public hashtagSrv: HashtagService,
    public categorieEmploiSrv: CategorieEmploiService,
    public entrepriseSrv: EntrepriseService,
    public campagneSrv: CampagneService) {
    this.currentUser = Object.create(null);
  }

  ngOnInit(): void {
    let subscription = this.authSrv.currentUserProvider
      .subscribe((user) => this.currentUser = user);
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
    this.getActiveCampagnes()
    this.redirectEntrepriseFormUserExperience()
    this.getActiveEntreprises();
    this.stateCandidat = history.state;
    this.redirectCandidatureForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-85
     * @since 31.01.22
     * @description Redirige l'utilisateur vers la page de creation d'entreprise
   */
  redirectEntrepriseForm() {
    if (!this.currentUser) {
      this.showLoginConfirm();
    } else {
      this.router.navigate(["/entreprise", "new"]);
    }
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-85
     * @since 31.01.22
     * @description Une fois l'authentification réussie et decidé à créer une entreprise il sera directement redirigé vers
     * le formulaire de création d'entreprise et non pas au niveau de la page d'acceuil
   */
  redirectEntrepriseFormUserExperience() {
    if (this.currentUser && HomeComponent.isLogin == true) {
      this.router.navigate(["/entreprise", "new"]);
      HomeComponent.isLogin = false;
    }
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-85
     * @since 31.01.22
     * @description Redirige l'utilisateur vers la page de connexion
   */
  redirectLoginForm() {
    HomeComponent.isLogin = true;
    this.router.navigate(["/login"]);
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-85
     * @since 31.01.22
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
    * Gère l'affichage des entreprises actives au niveau de l'acceuil
    * @author Mariama Fatou Sarr DIOP
    * @since 01/02/2022
    * @link https://recrutore.atlassian.net/browse/RAD-11
    */
  getActiveEntreprises() {
    this.entrepriseSrv.getActiveEntreprises()
      .then((data: Entreprise[]) => {
        this.entreprises = data;
      })
      .catch(() => { });
  }
  /**
  * Gère l'affichage des campagnes actives au niveau de l'acceuil
  * @author El Hadji Amath SARR
  * @since 07/02/2022
  * @link https://recrutore.atlassian.net/browse/RAD-10
  */
  getActiveCampagnes() {
    this.campagneSrv.getActiveCampagnes()
      .then((data: Campagne[]) => {
        this.campagnes = data;
      })
      .catch(() => { });
  }

  /**
  * * @author Cheikh Tidiane GUEYE
    * @link https://recrutore.atlassian.net/browse/RAD-19
    * @since 11.02.22
    * @description Redirige l'utilisateur vers la page de depot de candidature.
  */
  redirectCandidatureForm() {
    if (this.stateCandidat.isLogin) {
      this.router.navigate(["/campagne", this.stateCandidat.campagneUid, "candidature"]);
    }
  }


  /**
  * Gère le filtrage des campagnes par type d'offre par hastags
  * et par categorie d'emploi au niveau de l'acceuil
  * @author Mamadou Fam
  * @since 07/02/2022
  * @link https://recrutore.atlassian.net/browse/RAD-67
  */
  filtreActiveCampagnes() {
    this.campagnes = [];
    let type_offre_ids = this.selectedTypeOffres.map(value => value.id);
    let hashtag_ids = this.selectedHashtags.map(value => value.id);
    let categorie_emploi_ids = this.selectedCategorieEmploi.map(value => value.id);
    let resultat_filtre =
    {
      type_offre_ids: type_offre_ids,
      hashtag_ids: hashtag_ids,
      categorie_emploi_ids: categorie_emploi_ids
    };
    if (this.selectedTypeOffres.length != 0 || this.selectedHashtags.length != 0 || this.selectedCategorieEmploi.length != 0) {
      this.campagneSrv.filtreActiveCampagnes(resultat_filtre)
        .then((data: Campagne[]) => {
          this.campagnes = data;
        })
        .catch(() => { });
    }
    else {
      this.getActiveCampagnes();
    }
  }

  /**
 * @author Mamadou Fam
 * @copyright MMD
 * @link https://recrutore.atlassian.net/browse/RAD-67
 * @since 11.02.22
 * @description Récupére tous les types d'offre
 * @returns void
 */
  getAllTypeOffre() {
    if (this.typeOffres.length == 0) {
      this.isLoadingTypeOffres = true;
      this.typeOffreSrv.findAll()
        .then((data: TypeOffre[]) => {
          this.typeOffres = data;
        })
        .catch(() => { })
        .finally(() => { this.isLoadingTypeOffres = false; });
    }
  }

  /**
   * @author Mamadou Fam
   * @copyright MMD
   * @link https://recrutore.atlassian.net/browse/RAD-67
   * @since 13.02.22
   * @description Récupére tous les hashtags
   */
  getAllHashtags() {
    if (this.hashtags.length == 0) {
      this.isLoadingHashtags = true;
      this.hashtagSrv.findAll()
        .then((data: Hashtag[]) => {
          this.hashtags = data;
        })
        .catch(() => { })
        .finally(() => { this.isLoadingHashtags = false; });
    }
  }

  /**
   * @author Mamadou FAM
   * @copyright MMD
   * @since 13.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-67
   * @description Récupère tous catégories d'emploi lorsque la liste des catégories d'emploi est vide
   */
  getAllCategorieEmplois() {
    if (this.CategorieEmplois.length == 0) {
      this.isLoadingCategorieEmplois = true;
      this.categorieEmploiSrv.findAll()
        .then((data: CategorieEmploi[]) => {
          this.CategorieEmplois = data;
        })
        .catch(() => { })
        .finally(() => { this.isLoadingCategorieEmplois = false; });
    }
  }
}


