import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { Invitation } from './invitation';
import { BamboHttpService } from 'src/app/shared/services/bambo-http.service';
import { User } from 'src/app/admin/user/user';

@Injectable({
  providedIn: 'root'
})
export class InvitationService extends BaseService<Invitation> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'invitation';
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 03.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-14
   */
  verifyToken(verify: { uid: string }) {
    return this.http.post(`${this.prefix}/uid`, verify);
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 03.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-14
   */
  saveUserAndCollaborateur(user: User) {
    return this.http.post(`${this.prefix}/new-user-collaborateur`, user);
  }
}
