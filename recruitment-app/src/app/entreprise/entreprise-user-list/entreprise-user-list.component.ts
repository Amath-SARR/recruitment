import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';

@Component({
  selector: 'app-entreprise-user-list',
  templateUrl: './entreprise-user-list.component.html',
  styleUrls: ['./entreprise-user-list.component.css']
})
export class EntrepriseUserListComponent implements OnInit {

  entreprises:Entreprise[] = [];
  pageSizeOptions = [9,36,72,96];
  itemsPerPage = 9;
  paginationData: any = {};
  filterFields = ['name'];
  searchField = null;
  errors: any = { };
  // paginate: any; 

  
  constructor( public entrepriseSrv: EntrepriseService) {
   }

  ngOnInit(): void {
    // this.paginate();
  }

  /**
   * 
   * @authoe Fatou DIOUF
   * @since 02.02.22
   */

  findALl(){
    this.entrepriseSrv.paginate(this.itemsPerPage)
    .then((data: Entreprise[])=>{
      this.paginationData = data;
      this.entreprises = this.paginationData;
    })
    .catch(()=>{ });
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
