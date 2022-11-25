import { Hashtag } from './hashtag';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';

@Injectable({
  providedIn: 'root'
})
export class HashtagService extends BaseService<Hashtag> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'hashtag';
  }
}
