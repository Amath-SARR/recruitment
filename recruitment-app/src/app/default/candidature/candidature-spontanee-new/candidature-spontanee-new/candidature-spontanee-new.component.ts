import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { FileService } from 'src/app/shared/services/file.service';
import { Candidature } from '../../candidature';
import { CandidatureService } from '../../candidature.service';

@Component({
  selector: 'app-candidature-spontanee-new',
  templateUrl: './candidature-spontanee-new.component.html',
  styleUrls: ['./candidature-spontanee-new.component.css']
})
export class CandidatureSpontaneeNewComponent implements OnInit {

  entreprises: Entreprise[] = [];
  isCandidatureSpontaneeCreating = false;
  candidatureSpontanee: Candidature;
  error: any = {};
  public Editor = ClassicEditorBuild;

  constructor(public entrepriseSrv: EntrepriseService,
     public router: Router,
     public candidatureSrv: CandidatureService,
     public activatedRoute: ActivatedRoute,
     public fileSrv: FileService) 
     { 

      this.candidatureSpontanee = new Candidature();

     }

  ngOnInit(): void {    
  }

    /**
   * @author Fatou DIOUF
   * @since 18.02.22
   * @link 
   * @param any
   * @description Convertit un fichier en base 64 
   */
  handleChooseCVFile(event: any) {
    this.fileSrv.convertImageToBase64String(event)
      .then((base64_cv: string) => {
        this.candidatureSpontanee.cv = base64_cv
      })
      .catch(() => { });
  }

  /**
   * 
   * @description convertit l'image uploadé en base en base 64 et l'enregistre
   */
  uploadPhoto(photo: any) {
    this.fileSrv.convertImageToBase64String(photo)
      .then((data: string) => {
        this.candidatureSpontanee.photo = data
      })
      .catch(() => { });
  }

  /**
   * @author Fatou DIOUF
   * @since 18.02.22
   * @link
   * @description Enregistre une candidature Spontanee dans la base de donnée
   */
  save() {
    this.isCandidatureSpontaneeCreating = true;
    this.candidatureSpontanee.entreprise_uid = this.activatedRoute.snapshot.params["uid"];
    this.candidatureSrv.storeCandidatureSpontanee(this.candidatureSpontanee)
      .then((entreprise: Entreprise) => {
        this.candidatureSrv.http.toastr.success("Candidature Spontanée enregistré avec succès!");
        this.router.navigate(['/entreprise/',entreprise.uid]);
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.error = err.data;
        }
      })
      .finally(() => { 
        this.isCandidatureSpontaneeCreating = false 
      });
  }

}
