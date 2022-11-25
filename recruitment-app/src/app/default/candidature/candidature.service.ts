import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { Candidature } from './candidature';
import { Campagne } from 'src/app/entreprise/campagne/campagne';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService extends BaseService<Candidature> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'candidature';
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Met à jour un enregistrement donnée
   * @param object
   * @returns Promise
   */
   updateWithEntrepriseAdminMW(entrepriseId: number|undefined, candidature: Candidature) {
    return this.http.put(`${this.prefix}/${candidature.id}?entreprise_id=${entrepriseId}`, candidature);
  }

  /**
   * Affiche les candidatures d'un candidat
   * @author Fatou DIOUF
   * @since 16.02.22
   * @param itemsPerPage
   * @param user_id
   * @link https://recrutore.atlassian.net/browse/RAD-21
   * @returns
   */

  paginateCandidatureByUserId(itemsPerPage: number, pageNumber = null) {
    return this.http.get(`${this.prefix}/paginate/${itemsPerPage}?page=${pageNumber}`);

  }

  findByUid(entrepriseId: number, uid: string | undefined) {
    return this.http.get(`${this.prefix}/${uid}?entreprise_id=${entrepriseId}`);
  }
  /**
   * Gère l'affichage de la liste des candidatures d'une campagne
   * @auhor Mariama Fatou Sarr DIOP
   * @since 14/02/2022
   * @param id
   * @param itemsPerPage
   * @returns
   */
  getCandidaturesPerCampagne(campagne: Campagne, itemsPerPage: number | undefined, pageNumber = null) {
    return this.http.get(`${this.prefix}/campagne/${campagne.id}/${itemsPerPage}?page=${pageNumber}&entreprise_id=${campagne.entreprise_id}`);
  }

  /**
    * @author Cheikh Tidiane GUEYE
    * @since 17.02.22
    * @link https://recrutore.atlassian.net/browse/RAD-51
    * @description  Permet l'envoi des informations d'une campagne
    * @param candidature
    * @returns Promise
  */
  sendConfirmeReceptionEmail(entrepriseId: number, candidature: Candidature) {
    return this.http.post(`${this.prefix}/send-confirm-reception?entreprise_id=${entrepriseId}`, candidature);
  }

  getHistoricalStates(candidature: Candidature) {
    return this.http.get(`${this.prefix}/historical-states/${candidature.id}`)
  }

  /**
   * 
   * 
   * @param candidatureSpontanee 
   * @returns Promise
   */
  storeCandidatureSpontanee(candidatureSpontanee: Candidature) {
    return this.http.post(`${this.prefix}/spontanee/new`, candidatureSpontanee);
  }
}

