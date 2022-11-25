import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidature } from '../candidature';
import { CandidatureService } from '../candidature.service';

@Component({
  selector: 'app-candidat-candidature-list',
  templateUrl: './candidat-candidature-list.component.html',
  styleUrls: ['./candidat-candidature-list.component.css']
})
export class CandidatCandidatureListComponent implements OnInit {

  candidatures:Candidature[] = [];
  pageSizeOptions = [9,36,72,96];
  itemsPerPage = 2;
  paginationData: any = {};
  filterFields = ['titre'];
  searchField = null;
  errors: any = { };


  constructor(public candidatureSrv: CandidatureService,  public activatedRoute: ActivatedRoute) {
  }


/**
 * Affiche la liste des candidatures d'un candidat
 * @author Fatou DIOUF
 * @since 15.02.22
 * @link
 */

  ngOnInit(): void {
    this.paginateCandidatureByUserId();
  }

  paginateCandidatureByUserId() {
    this.candidatureSrv.paginateCandidatureByUserId(this.itemsPerPage)
      .then((data: Candidature[]) => {
        this.paginationData = data;
        this.candidatures = this.paginationData.data;
      })
      .catch(() => { });
  }


  changePageSize(itemsPerPage: number ) {
    this.itemsPerPage = itemsPerPage;
    this.candidatureSrv.paginateCandidatureByUserId(this.itemsPerPage)
      .then((data: Candidature[]) => {
        this.paginationData = data;
        this.candidatures = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.candidatureSrv.paginateCandidatureByUserId(this.itemsPerPage,pageNumber)
      .then((data: Candidature[]) => {
        this.paginationData = data;
        this.candidatures= this.paginationData.data;
      })
      .catch(() => { });
  }




}
