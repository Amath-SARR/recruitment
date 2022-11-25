import { SmsPack } from './../SmsPack';
import { SmsPackService } from './../sms-pack.service';
import { Component, OnInit } from '@angular/core';
import { PromiseError } from 'src/app/shared/classes/promise-error';
@Component({
  selector: 'app-sms-pack',
  templateUrl: './sms-pack.component.html',
  styleUrls: ['./sms-pack.component.css']
})
export class SmsPackComponent implements OnInit {

  smsPacks: SmsPack[] = [];
  smsPack = new SmsPack();
  delSmsPack = new SmsPack();
  editSmsPack = new SmsPack();
  errors: any = {};
  isVisibleModalEdit = false;
  isVisibleModalDelete = false;
  isCreateLoading = false;
  itemsPerPage = 9;
  pageSizeOptions = [9, 18, 36, 96];
  paginationData: any = {};

  constructor(public smsPackSrv: SmsPackService) {
    this.smsPack = new SmsPack();
  }

  ngOnInit(): void {
    this.findAll();
    this.paginate();
  }

   /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction pour sauvegarder un pack sms
   * @return promise
   */
  save() {
    this.isCreateLoading = true;
    this.smsPackSrv.createSmsPack(this.smsPack)
      .then((data: SmsPack) => {
        this.smsPackSrv.http.toastr.success("Pack SMS créé avec succès !");
        this.smsPacks = [data, ...this.smsPacks];
        this.smsPack = new SmsPack();
        this.paginate()
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isCreateLoading = false;})
  }

   /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction pour chercher tous les données dans la base de données
   * @return promise
   */
  findAll() {
    this.smsPackSrv.findAll()
      .then((data: SmsPack[]) => {
        this.smsPacks = data;
      })
      .catch(() => { });
  }

   /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction suppression d'un pack sms
   * @return promise
   */
  deleteSmsPack(smsPack: SmsPack) {
    this.smsPackSrv.removeObject(smsPack)
      .then((data: SmsPack) => {
        this.smsPackSrv.http.toastr.success("Suppression reussie !");
        this.smsPacks = [data];
        this.paginate()
      })
      .catch(() => { this.paginate() });
    this.isVisibleModalDelete = false;
  }

  /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction d'affichage modale pour confirmer la suppression d'un pack sms
   * @param smsPack
   * @return boolean
   */
  showModalDelete(smsPack: SmsPack) {
    this.isVisibleModalDelete = true;
    this.delSmsPack = smsPack;
  }

  /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction de modification d'un pack sms
   * @param smsPack
   * @return promise
   */
  updateSmsPack(smsPack: SmsPack) {
    this.smsPackSrv.update(smsPack)
      .then((data: SmsPack) => {
        this.smsPackSrv.http.toastr.success("Modification reussie !");
        this.smsPacks = [data];
        this.paginate()
      })
      .catch(() => { this.paginate() });
    this.isVisibleModalEdit = false;
  }

  /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction d'affichage modale pour modifier un pack sms
   * @param smsPack
   * @return boolean
   */
  showModalEdit(smsPack: SmsPack) {
    this.isVisibleModalEdit = true;
    this.editSmsPack = smsPack;
  }

   /**
   * @author El Hadji Amath SARR
   * @since 29.01.22
   * @link https://recrutore.atlassian.net/browse/RAD-95
   * @description La fonction pour fermer un modale pour modifier ou supprimer un pack sms
   * @return boolean
   */
  handleCancel(): void {
    this.isVisibleModalEdit = false;
    this.isVisibleModalDelete = false;
  }

  paginate() {
    this.smsPackSrv.paginate(this.itemsPerPage)
      .then((data: SmsPack[]) => {
        this.paginationData = data;
        this.smsPacks = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.smsPackSrv.paginate(this.itemsPerPage)
      .then((data: SmsPack[]) => {
        this.paginationData = data;
        this.smsPacks = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.smsPackSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: SmsPack[]) => {
        this.paginationData = data;
        this.smsPacks = this.paginationData.data;
      })
      .catch(() => { });
  }
}
