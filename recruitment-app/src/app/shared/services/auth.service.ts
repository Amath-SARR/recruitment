import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BamboHttpService } from './bambo-http.service';
import { User } from '../../admin/user/user';
import { GoogleLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * @author Moussa FOFANA
 * @copyright bamboguirassy
 * @since 22.01.22
 * @description Cette classe définit les mécanismes de connexion et de déconnexion
 * des utilisateurs, les tokens, l'utilisateur connecté
 * @class AuthService
 */
export class AuthService {

  private tokenName = 'Bearer';
  private token: String | null = null;
  private currentUserManager: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentUserProvider = this.currentUserManager.asObservable();

  constructor(public http: BamboHttpService) { }

  /**
   * @author Moussa FOFANA
   * @since 22.01.22
   * @description Cette méthode retourne le nom du token
   * qui sera envoyé dans le Authorization Header des requêtes
   * @copyright bamboguirassy
   * @returns string
   */
  public getTokenName() {
    return this.tokenName;
  }

  /**
   * @author Moussa Fofana
   * @description Retourne le token de l'utilisateur, le token est retourné si
   * défini sinon le token est récupéré du localStorage
   * @since 22.01.22
   * @copyright bamboguirassy
   * @returns token
   */
  public getToken() {
    if (this.token == null) {
      return this.token = localStorage.getItem(this.tokenName);
    }
    return this.token;
  }

  /**
   * @author Moussa Fofana
   * @description Retourne le token de l'utilisateur, le token est retourné si
   * défini sinon le token est récupéré du localStorage
   * @since 22.01.22
   * @copyright bamboguirassy
   * @returns token
   */
  public removeAllConnexionData() {
    this.token == null
    localStorage.removeItem(this.tokenName);
    this.currentUserManager.next(null);
  }

  /**
   * @author Moussa FOFANA
   * @description Recupére le token venu du serveur
   * puis stocke le token dans la variable token
   * puis stocke le token dans le localStorage pour récupération ultérieure
   * @since 21.01.22
   * @copyright bamboguirassy
   * @param token
   */
  public setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenName, token);
  }

  /**
   * @author Moussa FOFANA
   * @description Définit l'utilisateur dans le subject afin de le propager
   * à tous les programmes qui souhaitent récuperer l'utilisateur connecté
   * @param user
   * @copyright bamboguirassy
   * @since 21.01.22
   */
  setCurrentUser(user: any) {
    this.currentUserManager.next(user);
  }

  /**
   * @author Moussa FOFANA
   * @description Recupere l'utilisateur connecté
   * Cette fonction est surtout appelée pendant l'initialisation
   * du projet pour récuperer le user à partir du Token
   * @since 21.01.22
   * @copyright bamboguirassy
   * @returns Promise
   */
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.http.get('current-user')
        .then((user: any) => {
          this.setCurrentUser(user);
          resolve(user);
        }).catch(() => {
          resolve(null);
        });
    });
  }

  /**
   * @author Moussa FOFANA
   * @since 21.01.22
   * @description Connecte l'utilisateur grace à ses identifiants
   * @param loginData
   * @copyright bamboguirassy
   * @returns Promise
   */
  login(loginData: { email: string, password: string }) {
    return this.http.post('login', loginData);
  }

  /**
   * @author Moussa Fofana
   * @since 21.01.22
   * @description Envoie le token courant au serveur
   * pour déconnecter l'utilisateur
   * @copyright bamboguirassy
   * @returns Promise
   */
  logout() {
    return this.http.post('logout', {});
  }

  /**
   * @author MAMADOU LAMINE BEYE
   * @since 30.01.22
   * @description Envoie un lien de reinitialisation du mot de passe à l'utilisateur
   * @copyright bamboguirassy
   * @returns Promise
   */
  sendLinkPassword(loginData: { email: string }) {
    return this.http.post('send-reset-link', loginData);
  }

  /**
   * @author MAMADOU LAMINE BEYE
   * @since 30.01.22
   * @description Envoie un le token généré avec l'email au serveur pour verifier
   * la validite
   * @copyright bamboguirassy
   * @returns Promise
   */
  verifyToken(loginData: { confirmationToken: string }) {
    return this.http.post('verify-token', loginData);
  }
  /**
   * @author MAMADOU LAMINE BEYE
   * @since 30.01.22
   * @description met à jour le mot de passe de l'utilisateur
   * la validite
   * @copyright bamboguirassy
   * @returns Promise
   */
  updatePassword(loginData: { email: string; password: string; password_confirmation: string; }) {
    return this.http.post('change-password', loginData);
  }

  socialSignIn(userData:any) {
    return this.http.post('social-login-callback', userData);
  }

  redirect() {
    return this.http.get('redirect');
  }
}
