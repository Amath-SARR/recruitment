import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { DomaineIntervention } from './domaine-intervention';

@Injectable({
  providedIn: 'root'
})
export class DomaineInterventionService extends BaseService<DomaineIntervention> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'domaineintervention';
  }

}
