import { HashtagService } from './../../../admin/hashtag/hashtag.service';
import { CategorieEmploi } from './../../../admin/categorie-emploi/categorie-emploi';
import { TypeOffreService } from './../../../admin/type-offre/type-offre.service';
import { TypeOffre } from './../../../admin/type-offre/type-offre';
import { Subscription } from 'rxjs';
import { EntrepriseService } from './../../../default/entreprise/entreprise.service';
import { CampagneService } from './../campagne.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Campagne } from '../campagne';
import { FileService } from 'src/app/shared/services/file.service';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { User } from 'src/app/admin/user/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { State } from 'src/app/admin/states/state';
import { StateService } from '../../../admin/states/state.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CategorieEmploiService } from 'src/app/admin/categorie-emploi/categorie-emploi.service';
import { Hashtag } from 'src/app/admin/hashtag/hashtag';


@Component({
  selector: 'app-campagne-new',
  templateUrl: './campagne-new.component.html',
  styleUrls: ['./campagne-new.component.css']
})
export class CampagneNewComponent implements OnInit, OnDestroy {

  campagne: Campagne;
  entreprises: Entreprise[] = [];
  typeOffres: TypeOffre[] = [];
  selectedEntreprise!: Entreprise;
  selectedTypeOffres: TypeOffre[] = [];
  currentUser: User;
  subscriptions: Subscription[] = [];
  isCampagneCreating = false;
  errors: any;
  @ViewChild('formID') form: any;
  isLoadingEntreprises = false;
  isLoadingTypeOffres = false;
  tooltipTitle: string | undefined;
  states: State[] = [];
  public Editor = ClassicEditor;
  initialStates: State[] = [];
  selectedSates: State[] = [];
  selectedCategorieEmploi: CategorieEmploi;
  isLoadingCategorieEmplois = false;
  CategorieEmplois: CategorieEmploi[] = [];
  hashtags: Hashtag[] = [];
  isLoadingHashtags = false;
  selectedHashtags: Hashtag[] = [];


  constructor(public campagneSrv: CampagneService,
    public fileSrv: FileService,
    public entrepriseSrv: EntrepriseService,
    public authSrv: AuthService,
    public typeOffreSrv: TypeOffreService,
    public stateSrv: StateService,
    public router: Router,
    public categorieEmploiSrv: CategorieEmploiService,
    public hashtagSrv: HashtagService
  ) {
    this.campagne = new Campagne();
    this.selectedCategorieEmploi = new CategorieEmploi();
    this.currentUser = Object.create(null);
  }

  ngOnInit(): void {
    let subscription = this.authSrv.currentUserProvider
      .subscribe((user: User) => this.currentUser = user);
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
    this.getStates();
  }

  dropState(event: CdkDragDrop<State[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.selectedSates.sort((state1, state2) => state1.ordre - state2.ordre)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getStates() {
    this.stateSrv.findAll()
      .then((states: State[]) => {
        this.initialStates = states.filter(state => state.type == 'intermediaire');
        this.selectedSates = states.filter(state => state.type != 'intermediaire');
      })
      .catch(() => { })
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 04.02.22
   * @description Fais disparaître le tooltip lorsque le formulaire est valide
   * @returns void
   */
  hideTooltip() {
    if (
      this.selectedEntreprise != undefined &&
      this.selectedTypeOffres.length != 0 &&
      this.campagne.photo != undefined &&
      this.campagne.dateLancement != undefined &&
      this.campagne.dateCloture != undefined &&
      this.campagne.titre != undefined &&
      this.campagne.lieu != undefined &&
      this.campagne.description != undefined
    ) {
      this.tooltipTitle = "";
    }
    else {
      this.tooltipTitle = "Veuillez remplir tous les champs";
    }
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-16
   * @since 04.02.22
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
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-16
   * @since 04.02.22
   * @description Vérifie si un type de type d'offre est déjà sélectionné ou non
   * @param TypeOffre
   * @returns boolean
   */
  isTypeOffreSelected(value: TypeOffre) {
    let isTypeSelected = this.selectedTypeOffres?.find(element => element.type == value.type);
    if (isTypeSelected === undefined) {
      return false;
    }
    return true;
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-118
   * @since 10.02.22
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
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-118
   * @since 10.02.22
   * @description Vérifie si le nom d'un hashtag est déjà sélectionné ou non
   * @param Hashtag
   * @returns boolean
   */
  isHashtagSelected(hashtag: Hashtag) {
    let found_hashtag = this.selectedHashtags?.find(element => element.nom == hashtag.nom);
    if (found_hashtag === undefined) {
      return false;
    }
    return true;
  }

  /**
    * @author Alioune Badara FAM
    * @copyright ABF
    * @link https://recrutore.atlassian.net/browse/RAD-16
    * @since 04.02.22
    * @description Récupére les entreprises créés par l'utilisateur courant
    * @returns void
   */
  getAllEntreprisesOfCurrentUser() {
    if (this.entreprises.length == 0) {
      this.isLoadingEntreprises = true;
      this.entrepriseSrv.findEntrepriseByUser()
        .then((data: Entreprise[]) => {
          this.entreprises = data;
        })
        .catch(() => { })
        .finally(() => { this.isLoadingEntreprises = false });
    }
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 10.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-118
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

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-16
   * @since 04.02.22
   * @description Convertit l'image uploadé en base en base 64 et l'enregistre
   * @returns void
   */
  uploadPhoto(photo: any) {
    this.fileSrv.convertImageToBase64String(photo)
      .then((data: string) => {
        this.campagne.photo = data
      })
      .catch(() => { });
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @link https://recrutore.atlassian.net/browse/RAD-16
   * @since 04.02.22
   * @description Enregistre un hashtag dans la base de donnée
   * @returns void
   */
  save() {
    this.isCampagneCreating = true;
    this.campagne.entreprise_id = this.selectedEntreprise.id;
    this.campagne.categorie_emploi_id = this.selectedCategorieEmploi.id;
    this.campagne.array_id_types_offres_selected = this.selectedTypeOffres.map(typeOffre => typeOffre.id!);
    this.campagne.stateIds = this.selectedSates.map(state => state.id);
    this.campagne.hashtagIds = this.selectedHashtags.map(hashtag => hashtag.id);
    this.campagneSrv.save(this.campagne)
      .then((campagne: Campagne) => {
        this.campagneSrv.http.toastr.success("Campagne enregistrée avec succès");
        this.router.navigate(['/campagne', campagne.uid, 'admin']);
        this.campagne = new Campagne();
        this.selectedEntreprise = new Entreprise();
        this.selectedTypeOffres = [];
        this.form.nativeElement.reset();
      })
      .catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => {
        this.isCampagneCreating = false;
      });
  }
}
