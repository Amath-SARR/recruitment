import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { CampagneService } from 'src/app/entreprise/campagne/campagne.service';

@Component({
  selector: 'app-campagne-similaire-list',
  templateUrl: './campagne-similaire-list.component.html',
  styleUrls: ['./campagne-similaire-list.component.css']
})
export class CampagneSimilaireListComponent implements OnInit {

  @Input() campagne_id: number | undefined;
  campagnes: Campagne[] = [];
  pageSizeOptions = [9, 36, 72, 96];
  itemsPerPage = 9;
  paginationData: any = {};

  constructor(public campagneSrv: CampagneService, private router: Router) { }

  ngOnInit(): void {
    this.paginateSimilarCampagnes();
  }

  navigateToCampagneShow(uid: string | undefined) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/campagne', uid, 'details']));
  }

  paginateSimilarCampagnes() {
    this.campagneSrv.paginateSimilarCampagnes(this.campagne_id, this.itemsPerPage)
      .then((data: any) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number, campagneId: number | undefined) {
    this.campagne_id = campagneId;
    this.itemsPerPage = itemsPerPage;
    this.campagneSrv.paginateSimilarCampagnes(this.campagne_id, this.itemsPerPage)
      .then((data: any) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.campagneSrv.paginateSimilarCampagnes(this.campagne_id, this.itemsPerPage, pageNumber)
      .then((data: any) => {
        this.paginationData = data;
        this.campagnes = this.paginationData.data;
      })
      .catch(() => { });
  }


}
