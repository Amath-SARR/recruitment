import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { BamboHttpService } from '../../shared/services/bambo-http.service';
import { Collaborateur } from './collaborateur';

@Injectable({
  providedIn: 'root'
})
export class CollaborateurService extends BaseService<Collaborateur> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = "collaborateur";
  }

  /**
   * @author El Hadji Amath SARR
   * @since 11.02.22
   * @description Pagine des enregistrements avec le nombre d'élement par page et
   * la prochaine page à charger si définie
   * @param entreprise_id
   * @param itemsPerPage
   * @param pageNumber
   * @param entreprise_id
   * @returns Promise
   */
  paginateByEntreprise(entreprise_id: number, itemsPerPage: number, pageNumber = null) {
    if (pageNumber) {
      return this.http.get(`${this.prefix}/paginate/${itemsPerPage}/${entreprise_id}?page=${pageNumber}`);
    }
    return this.http.get(`${this.prefix}/paginate/${itemsPerPage}/${entreprise_id}`);
  }
}
