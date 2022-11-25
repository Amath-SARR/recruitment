import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { CampagneService } from 'src/app/entreprise/campagne/campagne.service';
import { FileService } from 'src/app/shared/services/file.service';
import { Candidature } from '../candidature';
import { CandidatureService } from '../candidature.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'test-candidature-new',
  templateUrl: './candidature-new.component.html',
  styleUrls: ['./candidature-new.component.css']
})
export class CandidatureNewComponent implements OnInit {

  campagne: Campagne;
  isCandidatureCreating = false;
  candidature = new Candidature();
  public Editor = ClassicEditor;

  constructor(public candidatureSrv: CandidatureService, public activatedRoute: ActivatedRoute,
     public campagneSrv: CampagneService, public fileSrv: FileService,
     public router: Router) {
    this.candidature = new Candidature();
    this.campagne = Object.create(null);
  }

  ngOnInit(): void {
    this.findCampagne()
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 10.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-19
   * @param any
   * @description Retourne les données d'une campagne en fonction de l'uid donne en parametre
   */
  findCampagne() {
    this.campagneSrv.findByUid(this.activatedRoute.snapshot.params["uid"])
      .then((data: Campagne) => {
        this.campagne = data;
      })
      .catch(() => { })
  }

  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 11.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-19
   * @param any
   * @description Convertit un fichier en base 64
   */
  handleChooseCVFile(event: any) {
    this.fileSrv.convertImageToBase64String(event)
      .then((base64_cv: string) => {
        this.candidature.cv = base64_cv
      })
      .catch(() => { });
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @since 11.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-19
   * @param any
   * @description Enregistre une candidature
   */
  save() {
    this.isCandidatureCreating = true;
    this.candidature.campagne_id = this.campagne.id;
    this.candidature.campagne_uid = this.campagne.uid;
    this.candidatureSrv.save(this.candidature)
      .then((candidature: Candidature) => {
        this.candidatureSrv.http.toastr.success("Candidature créé avec succès!");
        this.router.navigate(['/campagne',candidature.campagne?.uid,'details']);
      }).catch(() => {
      })
      .finally(() => { this.isCandidatureCreating = false });
  }
}
