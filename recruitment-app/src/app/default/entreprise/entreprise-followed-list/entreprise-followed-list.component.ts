import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from './../entreprise.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entreprise-followed-list',
  templateUrl: './entreprise-followed-list.component.html',
  styleUrls: ['./entreprise-followed-list.component.css']
})
export class EntrepriseFollowedListComponent implements OnInit {

  constructor(public entrepriseSrv: EntrepriseService) { }

  entreprisesFollowed: Entreprise[] = [];
  searchField = null;
  filterFields = ['name', 'email', 'siteWeb', 'presentation', 'telephone', 'adresse'];

  ngOnInit(): void {
    this.getEntrepisesFollowed();
  }

  /**
   * @author ALioune Badara FAM
   * @copyright ABF
   * @since 09.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-96
   * @description Recupère les entreprises suivis par l'utilisateur connecté
   * @returns void
   */
  getEntrepisesFollowed() {
    this.entrepriseSrv.findEntreprisesFollowed()
      .then((data: Entreprise[]) => {
        this.entreprisesFollowed = data;
      })
      .catch(() => { })
  }

}
