import { Campagne } from './../campagne';
import { Component, OnInit } from '@angular/core';
import { CampagneService } from '../campagne.service';

@Component({
  selector: 'app-campagne-user-list',
  templateUrl: './campagne-user-list.component.html',
  styleUrls: ['./campagne-user-list.component.css']
})
export class CampagneUserListComponent implements OnInit {

  constructor(public campagneSrv: CampagneService) { }

  campagnes: Campagne[] = [];

  ngOnInit(): void {
    this.getCurrentUserCampagnes();
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 09.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-112
   * @description Enregistre toutes les campagnes ratatchées aux différentes entreprises de l'utilisateur connecté dans une liste
   */
   getCurrentUserCampagnes() {
    this.campagneSrv.findCampagnesConnectedUser()
      .then((data) => {
        this.campagnes = data;
      })
      .catch(() => { });
  }

}
