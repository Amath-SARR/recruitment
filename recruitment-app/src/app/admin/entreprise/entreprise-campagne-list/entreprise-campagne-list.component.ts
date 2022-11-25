import { Component, Input, NgModule, OnInit } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { CampagneService } from 'src/app/entreprise/campagne/campagne.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@NgModule({
  imports: [
    MatSliderModule,
  ]
})
class AppModule { }
@Component({
  selector: 'app-entreprise-campagne-list',
  templateUrl: './entreprise-campagne-list.component.html',
  styleUrls: ['./entreprise-campagne-list.component.css']
})

export class EntrepriseCampagneListComponent implements OnInit {

  campagnes: Campagne[] = [];
  entreprise: Entreprise;
  @Input() entreprise_id!: any
  filterFields = ['titre'];
  searchField = null;
  pageSizeOptions = [9, 36, 72, 96];
  itemsPerPage = 9;
  visibleModal = false;
  paginationData: any = {};
  errors: any = {};
  isCampagneEntrepriseCreating = false;
  campagneUpdate = new Campagne();
  public Editor = ClassicEditor;

  public isEditStateClicked = {
    isEditStateClicked: true
  };

  constructor(public campagneSrv: CampagneService, public entrepriseSrv: EntrepriseService, public activatedRoute: ActivatedRoute, private modal: NzModalService) {
    this.entreprise = Object.create(null);
  }

  ngOnInit(): void {
    this.paginateCampagneById();
  }


  findAll() {
    this.campagneSrv.findAll()
      .then((data: Campagne[]) => {
        this.campagnes = data;
      })
      .catch(() => { });
  }

  paginateCampagneById() {
    this.campagneSrv.paginateCampagneById(this.itemsPerPage, this.entreprise_id)
      .then((data: Campagne[]) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number, entreprise_id: number) {
    this.itemsPerPage = itemsPerPage;
    this.entreprise_id = entreprise_id;
    this.campagneSrv.paginateCampagneById(this.itemsPerPage, this.entreprise_id)
      .then((data: Campagne[]) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.campagneSrv.paginateCampagneById(this.itemsPerPage, pageNumber)
      .then((data: Campagne[]) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }
  showModal(campagne: Campagne): void {
    this.campagneUpdate = campagne;
    this.visibleModal = true;

  }

  handleOk(): void {
    this.update();

  }

  handleCancel(): void {
    this.visibleModal = false;
    this.paginateCampagneById();
  }

  update() {
    this.campagneSrv.update(this.campagneUpdate)
      .then(() => {
        this.campagneUpdate = Object.create(null);
        this.campagneSrv.http.toastr.info("Les informations de la campagne sont correctement modifiées.")
        this.visibleModal = false;
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isCampagneEntrepriseCreating = false });
  }

  delete(campagne: Campagne) {
    this.campagneSrv.removeObject(campagne)
      .then(() => {
        this.paginateCampagneById();
      })
      .catch(() => { })
      .finally(() => {
        this.campagneSrv.http.toastr.success("Campagne correctement supprimée");
      });
  }

  showDeleteConfirm(campagne: Campagne): void {
    this.modal.confirm({
      nzTitle: 'Êtes vous sûr de vouloir supprimer cette campagne',
      nzOkText: 'Oui, je suis sûr',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(campagne),
      nzCancelText: 'Non, annuler',
    });
  }

}


