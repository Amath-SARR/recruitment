import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class StateService extends BaseService<State> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'state';
  }
}
