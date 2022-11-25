import { SmsPack } from './SmsPack';
import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SmsPackService extends BaseService<SmsPack>{

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'smspack';
  }

  /**
   * @author El Hadji Amath SARR
   * @since 25.01.22
   * @description Crée un pack sms
   * @param smsPack
   * @returns Promise
   */
  createSmsPack(smsPack: SmsPack) {
    return this.http.post(`${this.prefix}`, smsPack);
  }
}
