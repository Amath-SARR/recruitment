import { Component, OnInit } from '@angular/core';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { DomaineIntervention } from '../domaine-intervention';
import { DomaineInterventionService } from '../domaine-intervention.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-domaine-intervention-list',
  templateUrl: './domaine-intervention-list.component.html',
  styleUrls: ['./domaine-intervention-list.component.css']
})
export class DomaineInterventionListComponent implements OnInit {

  domaineInterventions: DomaineIntervention[] = [];
  domaineInterventionModel = new DomaineIntervention();
  domaineInterventionModelUpdate = new DomaineIntervention();
  isDomaineInterventionCreating = false;
  errors: any = {};
  isVisible = false;
  isVisibleFormAjout = false;
  pageSizeOptions = [9, 36, 72, 96];
  itemsPerPage = 9;
  paginationData: any = {};
  searchField = null;
  filterFields = ['nom', 'description'];

  constructor(public domaineSrv: DomaineInterventionService, private modal: NzModalService) {
    this.domaineInterventionModel = new DomaineIntervention();
    this.domaineInterventionModelUpdate = new DomaineIntervention();
  }

  ngOnInit(): void {
    this.paginate();
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 25.01.22
   * @description Affiche l'ensemble des domaines d'interventions
   * @return Promise
   */
  findAll() {
    this.domaineSrv.findAll()
      .then((data: DomaineIntervention[]) => {
        this.domaineInterventions = data;
      })
      .catch(() => { });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 25.01.22
   * @description Permet l'enregistrement d'un domaine d'intervention
   * @return Promise
   */
  save() {
    this.isDomaineInterventionCreating = true;
    this.domaineSrv.save(this.domaineInterventionModel)
      .then((data: DomaineIntervention) => {
        this.domaineInterventions = [data, ...this.domaineInterventions];
        this.domaineInterventionModel = new DomaineIntervention();
        this.domaineSrv.http.toastr.success("Domaine d'intervention créé avec succès!");
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isDomaineInterventionCreating = false });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 26.01.22
   * @description Permet la suppression d'un domaine d'intervention
   * @param DomaineIntervention
   * @return Promise
   */
  delete(domaineIntervention: DomaineIntervention) {
    this.domaineSrv.removeObject(domaineIntervention)
      .then(() => {
        var pos = this.domaineInterventions.indexOf(domaineIntervention);
        if (pos > -1) {
          this.domaineInterventions.splice(pos, 1);
        }
        this.paginate();
        this.domaineSrv.http.toastr.success("Domaine d'intervention supprimé avec succès!");
      })
      .catch(() => {
       });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 26.01.22
   * @description Mettre à jour un domaine d'intervention
   * @param DomaineIntervention
   * @return Promise
   */
  update(domaineIntervention: DomaineIntervention) {
    this.domaineSrv.update(domaineIntervention)
      .then(() => {
        this.domaineInterventions = [...this.domaineInterventions];
        this.domaineInterventionModelUpdate = new DomaineIntervention();
        this.domaineSrv.http.toastr.info("Domaine d'intervention modifié avec succès!");
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
    this.isVisible = false;
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 27.01.22
   * @description Gestion de l'affichage du formulaire d'ajout de domaine d'intervention
   * @return boolean
   */
  showFormAjout() {
      this.isVisibleFormAjout = !this.isVisibleFormAjout;
  }

  showModal(domaineIntervention: DomaineIntervention): void {
    this.isVisible = true;
    this.domaineInterventionModelUpdate = domaineIntervention;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(domaineIntervention: DomaineIntervention): void {
    this.modal.confirm({
      nzTitle: 'Êtes-vous sûr de supprimer cette tâche ?',
      nzOkText: 'Oui',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(domaineIntervention),
      nzCancelText: 'Non',
    });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @description Permet l'affichage des éléments de façon paginée
   * @since 27.01.22
   * @return Promise
   */
  paginate() {
    this.domaineSrv.paginate(this.itemsPerPage)
      .then((data: DomaineIntervention[]) => {
        this.paginationData = data;
        this.domaineInterventions = this.paginationData.data;
      })
      .catch(() => { });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 27.01.22
   * @param itemsPerPage
   * @return Promise
   */
  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.domaineSrv.paginate(this.itemsPerPage)
      .then((data: DomaineIntervention[]) => {
        this.paginationData = data;
        this.domaineInterventions = this.paginationData.data;
      })
      .catch(() => { });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 27.01.22
   * @param pageNumber
   * @return Promise
   */
  changePagination(pageNumber: any) {
    this.domaineSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: DomaineIntervention[]) => {
        this.paginationData = data;
        this.domaineInterventions = this.paginationData.data;
      })
      .catch(() => { });
  }
}
