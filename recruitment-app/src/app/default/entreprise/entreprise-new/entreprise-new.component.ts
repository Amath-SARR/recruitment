import { DomaineInterventionService } from './../../../admin/domaineIntervention/domaine-intervention.service';
import { DomaineIntervention } from './../../../admin/domaineIntervention/domaine-intervention';
import { PromiseError } from './../../../shared/classes/promise-error';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from 'src/app/shared/services/file.service';
import { Entreprise } from '../entreprise';
import { EntrepriseService } from '../entreprise.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-entreprise-new',
  templateUrl: './entreprise-new.component.html',
  styleUrls: ['./entreprise-new.component.css']
})
export class EntrepriseNewComponent implements OnInit {

  entreprise: Entreprise;
  isEntrepriseCreating = false;
  errors: any;
  seletedDomaineInterventions: DomaineIntervention[] = [];
  domaineInterventions: DomaineIntervention[] = [];
  isLoadingDomaineInterventions = false;
  @ViewChild('formID') form: any;
  public Editor = ClassicEditor;

  constructor(public entrepriseSrv: EntrepriseService, public fileSrv: FileService, public router: Router, public domaineInterventionSrv: DomaineInterventionService) {
    this.entreprise = new Entreprise();
  }

  ngOnInit(): void { }

  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-8
     * @since 31.01.22
     * @description Enregistre le logo uploadé en base64
     * @param event
     * @returns Promise
   */
  imageUpload(event: any) {
    this.fileSrv.convertImageToBase64String(event)
      .then((data: string) => {
        this.entreprise.logo = data
      })
      .catch(() => { })
  }


  /**
   * @author Alioune Badara FAM
   * @copyright ABF
   * @since 08.02.22
   * @link https://recrutore.atlassian.net/browse/RAD-114
   * @description Récupère la liste des domaines d'intervention
   * @returns void
   */
  getAllDomaineIntervention() {
    if (this.domaineInterventions.length == 0) {
      this.isLoadingDomaineInterventions = true;
      this.domaineInterventionSrv.findAll()
        .then((data: DomaineIntervention[]) => {
          this.domaineInterventions = data;
        })
        .catch(() => { })
        .finally(() => { this.isLoadingDomaineInterventions = false });
    }

  }


  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-8
     * @since 31.01.22
     * @description Sauvegarde une entreprise
     * @returns Promise
   */
  save() {
    this.isEntrepriseCreating = true;
    this.entreprise.domaineInterventionIds = this.seletedDomaineInterventions.map(domaineIntervention => domaineIntervention.id);
    this.entrepriseSrv.save(this.entreprise)
      .then((entreprise: Entreprise) => {
        this.entreprise = new Entreprise();
        this.form.nativeElement.reset();
        this.entrepriseSrv.http.toastr.success("Entrepise enregistrée avec succès");
        this.router.navigate(['/entreprise', entreprise.uid]);
      })
      .catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => this.isEntrepriseCreating = false);
  }

}
