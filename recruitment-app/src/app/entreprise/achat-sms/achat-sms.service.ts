import { Injectable } from '@angular/core';
import { SmsPackService } from 'src/app/admin/sms-pack/sms-pack.service';
import { SmsPack } from 'src/app/admin/sms-pack/SmsPack';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { AchatSms } from './achat-sms';

@Injectable({
  providedIn: 'root'
})
export class AchatSmsService extends BaseService<AchatSms> {

  constructor(public override http: BamboHttpService  ) {
    super(http);
    this.prefix = 'achatsms';
  }

   /**
   * Recupère les informations d'achatSms par son uid
   * @author Mariama Fatou Sarr DIOP
   * @since 11/02/2022
   * @param uid
   */
  findByUid(uid: string) {
    return this.http.get(`${this.prefix}/${uid}`);
  }

  /**
   * Refaire un achat échoué
   * @author Mariama Fatou Sarr DIOP
   * @since 11/02/2022
   * @param achatsms
   */
  restore(uid: string){
    return this.http.post(`${this.prefix}/restore/${uid}`,null);
  }
}
