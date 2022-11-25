import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor  from '@ckeditor/ckeditor5-build-classic';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-entreprise-edit',
  templateUrl: './entreprise-edit.component.html',
  styleUrls: ['./entreprise-edit.component.css']
})
export class EntrepriseEditComponent implements OnInit {


  entreprises: Entreprise[] = [];
  errors: any = {};
  //entrepriseUpdate = new Entreprise();
  form: any;
  entreprise = new Entreprise();
  isUpdating = false;
  public Editor = ClassicEditor;

  constructor(public entrepriseSrv: EntrepriseService, private router: Router, private location: Location,
    private activatedRoute: ActivatedRoute, public fileSrv: FileService) { }

  ngOnInit(): void {
    this.entreprise.uid = this.activatedRoute.snapshot.params["uid"];
    this.showOldValues(this.entreprise.uid);
    this.entreprise = new Entreprise();
    // this.entrepriseUpdate = new Entreprise();
  }

  /**
   * Gère l'affichage des anciennes valeurs au niveau de l'input
   * @author Mariama Fatou Sarr DIOP
   * @since 02/02/2022
   * @param uid
   */

  showOldValues(uid: string | undefined) {
    this.entrepriseSrv.findByUid(uid)
      .then((data: Entreprise) => {
        this.entreprise = data;
      })
      .catch(() => {
        this.router.navigate(['/']);
      })
  }

  // updateimageUpload(event:any){
  //   this.fileSrv.convertImageToBase64String(event)
  //     .then((data: string) => {
  //       this.entreprise.logo = data
  //     })
  //     .catch(() => { })
  // }

  /**
   * Gère la mise à jour d'une entreprise
   * @author Mariama Fatou Sarr DIOP
   * @since 02/02/2022
   * @param entreprise
   */
  update(entreprise: Entreprise) {
    this.entrepriseSrv.update(entreprise)
      .then(() => {
        this.entreprises = [...this.entreprises];
        this.entreprise = new Entreprise();
        this.entrepriseSrv.http.toastr.info("Modification effectuée avec succès");
        this.location.back();
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      }).finally(() => this.isUpdating = false);
  }

  // uploadLogo(){
  //   this.entrepriseSrv.uploadphoto(this.entreprise)
  //   .then(()=>{
  //     this.entrepriseSrv.http.toastr.success("mis à jour efféctué avec succès")
  //   }).catch((err:PromiseError)=>{
  //     if(err.validationError){
  //       this.errors = err.data;
  //     }
  //   })
  // }



}
