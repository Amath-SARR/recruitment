import { Follower } from './entreprise-show/follower';
import { Injectable } from '@angular/core';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class FollowerService extends BaseService<Follower> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = "follower";
  }
}
