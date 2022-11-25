
import { Component, OnInit } from '@angular/core';
import { PromiseError } from '../../../shared/classes/promise-error';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategorieEmploi } from '../categorie-emploi';
import { CategorieEmploiService } from '../categorie-emploi.service';
@Component({
  selector: 'app-categorie-emploi-list',
  templateUrl: './categorie-emploi-list.component.html',
  styleUrls: ['./categorie-emploi-list.component.css']
})
/**
 * @author Abdou Aziz Sy NDIAYE
 * @since 26.01.22
 * @copyright bamboguirassy
 * @link
 */
export class CategorieEmploiListComponent implements OnInit {

  searchField = null;
  filterFields = ['name'];
  pageSizeOptions = [10, 40, 80, 100];
  itemsPerPage = 10;
  paginationData: any = {};
  visibleModal = false;
  Visible = false;
  isCategorieCreating = false;
  categorieModel = new CategorieEmploi();
  categorieEmplois: CategorieEmploi[] = [];
  errors: any = {};
  categorieUpdate = new CategorieEmploi();
  constructor(public categorieSrv: CategorieEmploiService, private modal: NzModalService) {
    this.categorieModel = new CategorieEmploi();
  }

  ngOnInit(): void {
    this.paginate();
  }

  isVisible() {
    this.Visible = true;
  }

  save() {
    this.isCategorieCreating = true;
    this.categorieSrv.save(this.categorieModel)
      .then((data: CategorieEmploi) => {
        this.categorieEmplois = [data, ...this.categorieEmplois];
        this.categorieModel = new CategorieEmploi();
        this.categorieSrv.http.toastr.success("La création est effectuée avec succès.")
        this.ngOnInit();
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isCategorieCreating = false });
  }

  update() {
    this.categorieSrv.update(this.categorieUpdate)
      .then((data: CategorieEmploi) => {
        this.categorieSrv.http.toastr.info("Les informations de la catégorie sont correctement modifiées.")
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isCategorieCreating = false });
  }

  findAll() {
    this.categorieSrv.findAll()
      .then((data: CategorieEmploi[]) => {
        this.categorieEmplois = data;
      })
      .catch(() => { });
  }


  paginate() {
    this.categorieSrv.paginate(this.itemsPerPage)
      .then((data: CategorieEmploi[]) => {
        this.paginationData = data;
        this.categorieEmplois = this.paginationData.data;
      })
      .catch(() => { });
  }


  showModal(categorie: CategorieEmploi): void {
    this.categorieUpdate = categorie;
    this.visibleModal = true;

  }

  handleOk(): void {
    this.update();
    this.visibleModal = false;

  }

  handleCancel(): void {
    this.visibleModal = false;
    this.paginate();
  }


  showDeleteConfirm(categorie: CategorieEmploi): void {
    this.modal.confirm({
      nzTitle: 'Voulez vous vraiment supprimer cette catégorie ?',
      nzOkText: 'Oui',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.categorieSrv.removeObject(categorie)
        .then(() => {
          this.paginate();
          this.categorieSrv.http.toastr.success("La Suppression est effectuée avec succès.");
        }).catch((err: PromiseError) => {
          if (err.validationError) {
            this.errors = err.data;
          }
        })
        .finally(() => { this.isCategorieCreating = false }),
      nzCancelText: 'Non',
      nzOnCancel: () => ''
    });

  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.categorieSrv.paginate(this.itemsPerPage)
      .then((data: CategorieEmploi[]) => {
        this.paginationData = data;
        this.categorieEmplois = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.categorieSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: CategorieEmploi[]) => {
        this.paginationData = data;
        this.categorieEmplois = this.paginationData.data;
      })
      .catch(() => { });
  }

}
