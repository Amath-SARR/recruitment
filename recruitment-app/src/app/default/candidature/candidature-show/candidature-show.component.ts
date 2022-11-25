import { CandidatureService } from './../candidature.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Candidature } from '../candidature';
import { CampagneService } from 'src/app/entreprise/campagne/campagne.service';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';
import { State } from 'src/app/admin/states/state';
import { StateCandidature } from './StateCandidature';

@Component({
  selector: 'app-candidature-show',
  templateUrl: './candidature-show.component.html',
  styleUrls: ['./candidature-show.component.css']
})
export class CandidatureShowComponent implements OnInit {
  candidature: Candidature;
  isConfirmeReception = false;
  states: StateCandidature[] = [];

  constructor(public candidatureSrv: CandidatureService, public activatedRoute: ActivatedRoute,
    public campagneSrv: CampagneService) {
    this.candidature = Object.create(null);
  }

  ngOnInit(): void {
    this.findCandidature();
  }

  /**
 * @author El Hadji Amath SARR
 * @since 14.02.22
 * @link https://recrutore.atlassian.net/browse/RAD-59
 * @description Retourne les données d'une candidature en fonction de l'uid donné en parametre
 */
  findCandidature() {
    this.candidatureSrv.findByUid(this.activatedRoute.snapshot.params['entreprise_id'], this.activatedRoute.snapshot.params["uid"])
      .then((data: any) => {
        this.candidature = data;
      })
      .catch(() => { })
  }

  /**
    * @author Cheikh Tidiane GUEYE
    * @since 17.02.22
    * @link https://recrutore.atlassian.net/browse/RAD-51
    * @description Permet l'envoi d'un email pour confirmer la réception d'une candidature à une camapgne
  */
  confirmeReception(candidature: Candidature) {
    this.candidatureSrv.sendConfirmeReceptionEmail(this.activatedRoute.snapshot.params['entreprise_id'],candidature)
      .then(() => {
        this.findCandidature();
        this.candidatureSrv.http.toastr.success("Confirmation de la réception envoyée par email au candidat !");
      }).catch(() => {
      });
  }

}
