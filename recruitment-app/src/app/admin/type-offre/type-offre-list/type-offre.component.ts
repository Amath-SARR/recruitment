import { Component, Injector, OnInit } from '@angular/core';
import { TypeOffreService } from '../type-offre.service';
import { TypeOffre } from '../type-offre';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-type-offre',
  templateUrl: './type-offre.component.html',
  styleUrls: ['./type-offre.component.css']
})
/**
 * @author Fatou Diouf
 * @since 26.01.22
 * @copyright bamboguirassy
 *
 */

export class TypeOffreComponent implements OnInit {

  typeOffres: TypeOffre[] = [];
  searchField = null;
  typeOffreModel: TypeOffre;
  typeOffreUpdate: TypeOffre;
  filterFields = ['name', 'description', 'type'];
  paginationData: any = {};
  pageSizeOptions = [9, 36, 72, 96];
  itemsPerPage = 9;
  visible = false;
  isVisible = false;
  nzTitle = ""
  istypeOffreCreating = false;
  errors: any = {};
  typeOffre: TypeOffre ={
    id:undefined,
    name:undefined,
    description:undefined,
    type: undefined,
  }


  constructor(public typeOffreSrv: TypeOffreService, private modal: NzModalService,public injector: Injector ) {

    this.typeOffreModel = new TypeOffre();
    this.typeOffreUpdate = new TypeOffre()
   }

  ngOnInit(): void {

    this.paginate();
  }

  // public get toastr(): ToastrService {
  //   return this.injector.get(ToastrService);
  // }
  view_Ad_TypeOffre() {
    this.visible = true;
  }

  /**
  *@author Fatou Diouf
 * @since 26.01.22
 * @copyright bamboguirassy
 * @return Promise
   */

  save() {
    this.istypeOffreCreating = true;
    this.typeOffreSrv.save(this.typeOffreModel)
      .then((data: TypeOffre) => {
        this.typeOffres = [data, ...this.typeOffres];
        this.typeOffreModel = new TypeOffre();
        this.typeOffreSrv.http.toastr.success("création Type effectué avec succès");
        this.ngOnInit();
      }).catch((err: PromiseError)=> {
        if (err.validationError){
          this.errors = err.data;
        }
      })
      .finally(()=> { this.istypeOffreCreating = false });
  }

  update() {
    this.typeOffreSrv.update(this.typeOffre)
    .then((data: TypeOffre) => {
      this.typeOffreSrv.http.toastr.info("Type Modifiée avec succès")
    }).catch((err: PromiseError) => {
      if (err.validationError) {
        this.errors = err.data;
      }
    })
    .finally(() => { this.istypeOffreCreating = false });
  }

  findAll() {
    this.typeOffreSrv.findAll()
     .then((data:TypeOffre[])=>{
       this.typeOffres = data;
     })
     .catch(() => {});
}

  paginate() {
    this.typeOffreSrv.paginate(this.itemsPerPage)
      .then((data: TypeOffre[]) => {
        this.paginationData = data;
        this.typeOffres = this.paginationData.data;
      })
      .catch(() => { });
  }

  showModal(typeOffre:TypeOffre): void {
    this.typeOffreUpdate=typeOffre;
    this.isVisible = true;

  }

  handleOk(): void {
    this.update();
    this.isVisible = false;

  }

  handleCancel(): void {
    this.isVisible = false;
    this.paginate();
  }

  showDeleteConfirm(typeOffre:any): void {
    this.modal.confirm({
      nzTitle: 'Voulez vous vraiment supprimer ce type d\'offre?',
      nzOkText: 'Oui',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>this.typeOffreSrv.removeObject(typeOffre)
      .then(() => {
       this.typeOffreSrv.http.toastr.success("La suppression à réussie");
        this.ngOnInit();
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.istypeOffreCreating = false }),
        //  nzCancelText: 'No',
    });

  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.typeOffreSrv.paginate(this.itemsPerPage)
      .then((data: TypeOffre[]) => {
        this.paginationData = data;
        this.typeOffres = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.typeOffreSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: TypeOffre[]) => {
        this.paginationData = data;
        this.typeOffres = this.paginationData.data;
      })
      .catch(() => { });
  }


}


