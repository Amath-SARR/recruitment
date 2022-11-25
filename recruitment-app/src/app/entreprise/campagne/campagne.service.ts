import { Campagne } from './campagne';
import { BaseService } from 'src/app/shared/services/base.service';
import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { Candidature } from 'src/app/default/candidature/candidature';

@Injectable({
  providedIn: 'root'
})
export class CampagneService extends BaseService<Campagne> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = "campagne";
  }

  getActiveCampagnes() {
    return this.http.get(`${this.prefix}/active`);
  }

  /**
  * @author Mamadou Fam
  * @copyright MMD
  * @since 11.02.22
  * @link https://recrutore.atlassian.net/browse/RAD-67
  * @description Récupére les campagnes en fonction du filtre appliqué
  * @returns Promise
  */
  filtreActiveCampagnes(filtre: any) {
    return this.http.post(`${this.prefix}/active/filtre`, filtre);
  }

  findByUid(uid: string | undefined) {
    return this.http.get(`${this.prefix}/${uid}`);
  }

  removeByUid(uid: string | undefined) {
    return this.http.delete(`${this.prefix}/${uid}`);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 09.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-112
   * @description Récupère toutes les campagnes ratatchées aux différentes entreprises de l'utilisateur connecté
   * @returns Promise
   */
  findCampagnesConnectedUser() {
    return this.http.get(`${this.prefix}/for-current-user`);
  }

  paginateCampagneById(itemsPerPage: number, entreprise_id: number, pageNumber = null) {
    if (pageNumber) {
      return this.http.get(`${this.prefix}/paginate/${itemsPerPage}/${entreprise_id}?page=${pageNumber}&entreprise_id=${entreprise_id}`);
    }
    return this.http.get(`${this.prefix}/paginate/${itemsPerPage}/${entreprise_id}?entreprise_id=${entreprise_id}`);
  }

  paginateSimilarCampagnes(campagne_id: number | undefined, itemsPerPage: number, pageNumber = null) {
    if (pageNumber) {
      return this.http.get(`${this.prefix}/paginateSimilarCampagne/${campagne_id}/${itemsPerPage}?page=${pageNumber}`);
    }
    return this.http.get(`${this.prefix}/paginateSimilarCampagne/${campagne_id}/${itemsPerPage}`);
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-24
     * @since 16.02.22
     * @description Envoie les informations d'une candidature.
   */
  sendCandidatureRapport(candidature: Candidature | undefined) {
    return this.http.post(`${this.prefix}/candidature/send-candidature-rapport`, candidature);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 18.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Récupère tous les différents statuts de la campagne courante
   * @param id (number | undefinded)
   * @returns Promise
   */
  getCurrentCampagneStates(id: number | undefined) {
    return this.http.get(`${this.prefix}/states/${id}`);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 18.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Récupère tous les statuts n'ayant pas été sélectionnés lors de la création de la campagne courante
   * @param id (number | undefinded)
   * @returns Promise
   */
  getNotSelectedCurrentCampagneStates(id: number | undefined) {
    return this.http.get(`${this.prefix}/states/not-selected/${id}`);
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 18.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-124
   * @description Met à jour les statuts de la campagne
   * @param id (number | undefinded)
   * @param objectStateIds {stateIds: (number | undefined)[]}
   * @returns Promise
   */
  updateState(id: number | undefined, objectStateIds: { stateIds: (number | undefined)[]; }) {
    return this.http.put(`${this.prefix}/states/${id}`, objectStateIds);
  }
}
