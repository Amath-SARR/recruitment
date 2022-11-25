import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { User } from './user';
import { BamboHttpService } from '../../shared/services/bambo-http.service';
import { UserMessage } from './user-message';
import { FilterModel } from './user-list/filterModel';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor(public override http: BamboHttpService) {
    super(http);
    this.prefix = 'user';
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 02.02.22
   * @description Permet l'envoi de message à un type d'utilisateur
   * @param userMessage
   * @returns Promise
   */
  sendUserMessage(userMessage: UserMessage) {
    return this.http.post(`${this.prefix}/message`, userMessage);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Crée un utilisateur administrateur
   * @param user
   * @returns Promise
   */
  createAdmin(user: User) {
    return this.http.post(`${this.prefix}/admin-create`, user);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Confirm le compte d'un utilisateur s'il clique sur le lien de confirmation
   * depuis sa boite email
   * @param user
   * @returns Promise
   */
  confirmAccount(token: string) {
    return this.http.post(`${this.prefix}/confirm-account/${token}`, {});
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Met à jour l'email du user s'il décide de le changer
   * après s'être rendu compte qu'il y'a problème
   * @param user
   * @param email le nouvel email à utiliser pour remplacer l'ancien
   * @returns Promise
   */
  updateUserEmailOnRegister(user: User, email: string) {
    return this.http.post(`${this.prefix}/change-email-on-register/${user.email}`, { email });
  }

  /**
   * @author Mamadou Fam & Moussa FOFANA
   * since 28.01.22
   * @param user
   * @returns Promise
   */
  changePassword(user: User) {
    return this.http.put(`${this.prefix}/change-password/${user.id}`, user);
  }

  /**
   * @author Mamadou Fam
   * since 02.02.22
   * @param user
   * @returns Promise
   */
  uploadPhoto(user: User) {
    return this.http.put(`${this.prefix}/update-photo/${user.id}`, user);
  }

/**
 * @author Mamadou lamine BEYE
 * @since 10.02.22
 * @description Permet de filtrer la liste des users
 * @link https://recrutore.atlassian.net/browse/RAD-69
 * @param data
 * @returns Promise
 */
  filterUser(data: any) {
    return this.http.post('user-filtrer', data);
  }
}
