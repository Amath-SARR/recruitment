import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/admin/user/user';
import { Campagne } from '../campagne';
import { CampagneService } from '../campagne.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { State } from 'src/app/admin/states/state';
import { StateService } from 'src/app/admin/states/state.service';

@Component({
  selector: 'app-campagne-admin-show',
  templateUrl: './campagne-admin-show.component.html',
  styleUrls: ['./campagne-admin-show.component.css']
})
export class CampagneAdminShowComponent implements OnInit {

  campagnes: Campagne[] = [];
  campagne = new Campagne();
  user = new User();
  statut_campage: string = "";

  public isEditStateClicked: any;
  notSelectedStates: State[] = [];
  selectedStates: State[] = [];
  showEditState = false;


  constructor(public stateSrv: StateService, public campagneSrv: CampagneService, public route: ActivatedRoute,
    private modal: NzModalService, public router: Router) { }

  ngOnInit(): void {
    this.campagne.uid = this.route.snapshot.params["uid"];
    this.findCampagne(this.campagne.uid);

    this.isEditStateClicked = history.state;
    if (this.isEditStateClicked.isEditStateClicked) {
      this.showEditState = true;
    }
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
    this.selectedStates.sort((state1, state2) => state1.ordre - state2.ordre)
  }

  /**
    * Recupere la campagne à partir de son uid et compare la date de cloture avec la date actuelle du système
    * @author Mamadou Fam
    * @since 08/02/2022
    * @link https://recrutore.atlassian.net/browse/RAD-18
    */
  findCampagne(uid: string | undefined) {
    this.campagneSrv.findByUid(uid)
      .then((data: Campagne) => {
        this.campagne = data;
        this.getCurrentCampagneStates(this.campagne.id);
        if (this.showEditState) {
          this.getNotSelectedCurrentCampagneStates(this.campagne.id);
        }
        if (this.campagne.active) {
          this.statut_campage = "en cours";
        } else {
          this.statut_campage = "cloturée";
        }
      })
      .catch(() => { })
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 08.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-79
   * @description Supprime une campagne
   * @returns void
   */
  delete() {
    this.campagneSrv.removeObject(this.campagne)
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        this.campagneSrv.http.toastr.success("Campagne correctement supprimée");
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
      nzTitle: 'Êtes vous sûr de vouloir supprimer cet campagne',
      nzOkText: 'Oui, je suis sûr',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(),
      nzCancelText: 'Non, annuler',
    });
  }

  /**
   * supprime une campagne
   * @author Mamadou Lamine BEYE
   * @since 08/02/2022
   * @param campagne
   */
  remove(uid: string | undefined) {
    this.campagneSrv.removeByUid(this.campagne.uid)
      .then((data) => {
        this.router.navigate(['/admin/campagne'])
      })
      .catch(() => {
      });
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 21.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Active l'édition des statuts de la campagne et charge les statuts non sélectionés lors de sa création
   */
  toggleActiveEditState() {
    this.showEditState = !this.showEditState;
    this.getNotSelectedCurrentCampagneStates(this.campagne.id);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 21.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Désactive l'édition des statuts de la campagne et recharge les statuts sélectionés lors de sa création
   */
  cancelEditState() {
    this.showEditState = !this.showEditState;
    this.getCurrentCampagneStates(this.campagne.id);
  }


  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 21.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Récupère les statuts sélectionnés lors de la création de la campagne
   * @param id (number | undefined)
   */
  getCurrentCampagneStates(id: number | undefined) {
    this.campagneSrv.getCurrentCampagneStates(id)
      .then((data: State[]) => {
        this.selectedStates = data;
      })
      .catch(() => { });
  }


  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 21.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Récupère les statuts non sélectionnés lors de la création de la campagne
   * @param id (number | undefined)
   */
  getNotSelectedCurrentCampagneStates(id: number | undefined) {
    this.campagneSrv.getNotSelectedCurrentCampagneStates(id)
      .then((data: State[]) => {
        this.notSelectedStates = data;
      })
      .catch(() => { });
  }


  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 21.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Met à jour les statuts de la campagne
   */
  updateState() {
    let stateIds = this.selectedStates.map(element => element.id);
    let campagneModel = new Campagne();
    campagneModel.stateIds = stateIds
    let objectStateIds = { stateIds: stateIds }
    this.campagneSrv.updateState(this.campagne.id, objectStateIds)
      .then(() => {
        this.campagneSrv.http.toastr.success('Mise à jour effectuée avec succès');
        this.showEditState = false;
      })
      .catch(() => { })
      .finally(() => {
        this.getCurrentCampagneStates(this.campagne.id);
      });
  }

}
