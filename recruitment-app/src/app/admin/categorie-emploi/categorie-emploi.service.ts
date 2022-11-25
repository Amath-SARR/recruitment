import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { CategorieEmploi } from './categorie-emploi';

@Injectable({
  providedIn: 'root'
})
export class CategorieEmploiService extends BaseService<CategorieEmploi>  {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'categorieemploi';
  }



}
