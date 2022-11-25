import { Component, Input, OnInit } from '@angular/core';
import { Collaborateur } from '../collaborateur';
import { CollaborateurService } from '../collaborateur.service';

@Component({
  selector: 'app-collaborateur-list',
  templateUrl: './collaborateur-list.component.html',
  styleUrls: ['./collaborateur-list.component.css']
})
export class CollaborateurListComponent implements OnInit {

  collaborateurs: Collaborateur[] = []
  @Input() entreprise_id!: number;
  collaborateur!: Collaborateur
  itemsPerPage = 9;
  pageSizeOptions = [9, 18, 54, 120];
  paginationData: any = {};
  filterFields = ['user.email', 'user.telephone', 'user.name'];
  searchField = null;

  constructor(public collaborateurSrv: CollaborateurService) { }

  ngOnInit(): void {
    this.paginate();
  }

  paginate() {
    this.collaborateurSrv.paginateByEntreprise(this.entreprise_id, this.itemsPerPage)
      .then((data: Collaborateur) => {
        this.paginationData = data;
        this.collaborateurs = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.collaborateurSrv.paginateByEntreprise(this.entreprise_id, this.itemsPerPage)
      .then((data: Collaborateur[]) => {
        this.paginationData = data;
        this.collaborateurs = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.collaborateurSrv.paginateByEntreprise(this.entreprise_id, this.itemsPerPage, pageNumber)
      .then((data: Collaborateur[]) => {
        this.paginationData = data;
        this.collaborateurs = this.paginationData.data;
      })
      .catch(() => { });
  }
}
