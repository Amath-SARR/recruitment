import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/user/user';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-mes-entreprises',
  templateUrl: './mes-entreprises.component.html',
  styleUrls: ['./mes-entreprises.component.css']
})
/**
 * @author Abdou Aziz Sy NDIAYE
 * @since 04.02.22
 * @copyright bamboguirassy
 * @link
 */
export class MesEntreprisesComponent implements OnInit {
  entreprises: Entreprise[] = [];
  searchField = null;
  filterFields = ['name', 'email', 'telephone'];
  pageSizeOptions = [10, 20, 40, 100];
  itemsPerPage = 10;
  paginationData: any = {};
  constructor(public authSrv: AuthService, public entrepriseSrv: EntrepriseService) {
  }

  ngOnInit(): void {

    this.entrepriseSrv.findEntrepriseByUser()
      .then((data: Entreprise[]) => {
        this.entreprises = data;
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
