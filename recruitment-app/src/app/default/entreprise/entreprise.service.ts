import { User } from 'src/app/admin/user/user';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { Entreprise } from './entreprise';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService extends BaseService<Entreprise> {
  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = "entreprise";
  }

  getActiveEntreprises() {
    return this.http.get(`${this.prefix}/actives`);
  }

  findByUid(uid: string | undefined) {
    return this.http.get(`${this.prefix}/${uid}`);
  }

  uploadphoto(entreprise: Entreprise) {
    return this.http.put(`${this.prefix}/update-logo/${entreprise.uid}`, entreprise)
  }

  findEntrepriseByUser() {
    return this.http.get(`${this.prefix}/for-current-user`);
  }

  /**
   * @author ALioune Badara FAM
   * @copyright ABF
   * @since 09.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-96
   * @description Recupère les entreprises suivis par l'utilisateur connecté
   * @returns void
   */
  findEntreprisesFollowed() {
    return this.http.get(`${this.prefix}/followed`);
  }

}
