import { Candidature } from './../../../default/candidature/candidature';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { User } from 'src/app/admin/user/user';
import { CandidatureService } from 'src/app/default/candidature/candidature.service';
import { Campagne } from '../../campagne/campagne';
import { CampagneService } from '../../campagne/campagne.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder, NzTableFilterComponent } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-campagne-candidature-list',
  templateUrl: './campagne-candidature-list.component.html',
  styleUrls: ['./campagne-candidature-list.component.css']
})
export class CampagneCandidatureListComponent implements OnInit {

  candidatures : Candidature[] = [];
  @Input() campagne :Campagne = Object.create(null);
  user = new User();
  filterFields = ['candidature.user.name'];
  searchField = null;
  pageSizeOptions = [10, 50, 100, 200];
  itemsPerPage = 10;
  isVisible = false;
  paginationCandidatures: any = {};
  errors: any = {};
  searchValue = '';
  visible = false;

  constructor(public candidatureSrv : CandidatureService) {}

  ngOnInit(): void {
    this.getCandidaturesCampagne();
  }

  /**
   * Gère l'affichage de la liste des candidatures d'une campagne
   * @author Mariama Fatou Sarr DIOP
   * @since 14/02/2022
   */
  getCandidaturesCampagne() {
    this.candidatureSrv.getCandidaturesPerCampagne(this.campagne,this.itemsPerPage)
      .then((data: Candidature[]) => {
        this.paginationCandidatures = data;
        this.candidatures = this.paginationCandidatures.data;
      })
      .catch(() => {})
  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.candidatureSrv.getCandidaturesPerCampagne(this.campagne,this.itemsPerPage)
      .then((data: Campagne[]) => {
        this.paginationCandidatures = data;
        this.candidatures = this.paginationCandidatures.data;
      })
      .catch(() => {});
  }

  changePagination(pageNumber : any){
    this.candidatureSrv.getCandidaturesPerCampagne(this.campagne, this.itemsPerPage, pageNumber)
    .then((data:Candidature[]) => {
      this.paginationCandidatures = data;
      this.candidatures = this.paginationCandidatures.data;
    })
    .catch(() => {});
  }

  listOfCandidatures = [...this.candidatures];

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfCandidatures = this.candidatures
    .filter(item => item.user.name!.indexOf(this.searchValue) !== -1);
  }



  filterSource = [
    { text: 'Seneweb', value: 'Seneweb' },
  ];

  parseText(text: string) {
    const dom = new DOMParser().parseFromString(
    '<!doctype html><body>' + text,
    'text/html');
    const decodedString = dom.body.textContent;
    return decodedString;
  }

  /**
  * @author El Hadji Amath SARR
  * @since 17.02.2022
  * @link https://recrutore.atlassian.net/browse/RAD-43
   * @description La fonction qui modifie le champ interessant en true
   * @param candidature
   * @return promise
   */
   switchInteressantState(candidature: Candidature) {
      candidature.interessant = !candidature.interessant;
      this.candidatureSrv.updateWithEntrepriseAdminMW(this.campagne.entreprise_id, candidature)
      .then(() => {
        this.candidatureSrv.http.toastr.success("Statut importance candidature changé avec succès !");
      })
      .catch(() => {});
  }
}
