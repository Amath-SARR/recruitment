import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { TypeOffre } from './type-offre';


@Injectable({
  providedIn: 'root'
})
export class TypeOffreService extends BaseService<TypeOffre> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'typeoffre';
   }
}
