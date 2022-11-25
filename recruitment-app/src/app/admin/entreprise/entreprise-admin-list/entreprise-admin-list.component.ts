import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
@Component({
  selector: 'app-entreprise-admin-list',
  templateUrl: './entreprise-admin-list.component.html',
  styleUrls: ['./entreprise-admin-list.component.css']
})
export class EntrepriseAdminListComponent implements OnInit {

  entreprises: Entreprise[] = [];
  filterFields = ['name', 'email', 'titre'];
  searchField = null;
  pageSizeOptions = [10, 20, 40, 100];
  itemsPerPage = 10;
  paginationData: any = {};
  errors: any = {};




  constructor(public entrepriseSrv: EntrepriseService) {
  }

  ngOnInit(): void {
    this.paginate();
  }

  /**
   * @author Fatou DIOUF
   * @since 01.02.22
   */

  findAll() {
    this.entrepriseSrv.findAll()
      .then((data: Entreprise[]) => {
        this.entreprises = data;
      })
      .catch(() => { });
  }

  paginate() {
    this.entrepriseSrv.paginate(this.itemsPerPage)
      .then((data: Entreprise[]) => {
        this.paginationData = data;
        this.entreprises = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.entrepriseSrv.paginate(this.itemsPerPage)
      .then((data: Entreprise[]) => {
        this.paginationData = data;
        this.entreprises = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.entrepriseSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: Entreprise[]) => {
        this.paginationData = data;
        this.entreprises = this.paginationData.data;
      })
      .catch(() => { });
  }

}
