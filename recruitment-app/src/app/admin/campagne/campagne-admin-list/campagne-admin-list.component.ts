import { Component, OnInit } from '@angular/core';
import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { CampagneService } from '../../../entreprise/campagne/campagne.service';

@Component({
  selector: 'app-campagne-admin-list',
  templateUrl: './campagne-admin-list.component.html',
  styleUrls: ['./campagne-admin-list.component.css']
})
export class CampagneAdminListComponent implements OnInit {
  campagnes: Campagne[] = [];
  itemsPerPage = 10;
  pageSizeOptions = [10, 30, 60, 100];
  paginationData: any = {};

  constructor(public campagneSrv: CampagneService) { }

  ngOnInit(): void {
    this.paginate();
  }


  paginate() {
    this.campagneSrv.paginate(this.itemsPerPage)
      .then((data: any) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }


  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.campagneSrv.paginate(this.itemsPerPage)
      .then((data: Campagne[]) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }


  changePagination(pageNumber: any) {
    this.campagneSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: Campagne[]) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }

}
