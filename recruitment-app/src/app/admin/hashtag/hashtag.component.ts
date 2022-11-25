import { PromiseError } from './../../shared/classes/promise-error';
import { HashtagService } from './hashtag.service';
import { Component, OnInit } from '@angular/core';
import { Hashtag } from './hashtag';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css'],
})
export class HashtagComponent implements OnInit {
  hashtags: Hashtag[] = [];
  hashtagModel = new Hashtag();
  errors: any = {};
  visible: boolean = false
  itemsPerPage = 40;
  pageSizeOptions = [40, 80, 120, 160];
  paginationData: any = {};
  separatorKeysCodes: number[] = [ENTER];
  hashtagItems: Hashtag[] = [];


  constructor(public hashtagSrv: HashtagService) {
  }


  ngOnInit(): void {
    this.paginate();
  }


  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 27.01.22
     * @description Enregistre l'hashtag ajouté au niveau de l'input dans une liste en évitant les répétitions d'hashtags
     * @param MatChipInputEvent
   */
  addHashtag(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      let hashtag = new Hashtag
      hashtag.nom = value
      const undefine = this.hashtagItems.find(element => element.nom.toLowerCase() === hashtag.nom.toLowerCase())
      if (undefine === undefined) {
        this.hashtagItems.push(hashtag);
      }
    }
    event.chipInput!.clear();
  }

  /**
     * * @author Alioune Badara FAM
       * @copyright ABF
       * @link https://recrutore.atlassian.net/browse/RAD-68
       * @since 27.01.22
       * @description Supprime un hashtag d'une liste d'hashtags
       * @param Hashtag
     */
  removeHashtag(hashtag: Hashtag) {
    const index = this.hashtagItems.indexOf(hashtag);
    if (index >= 0) {
      this.hashtagItems.splice(index, 1);
    }
  }

  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 26.01.22
     * @description Fais apparaître/disparaitre la section Ajouter Hashtag
   */
  isVisible() {
    this.visible = !this.visible
  }


  paginate() {
    this.hashtagSrv.paginate(this.itemsPerPage)
      .then((data: Hashtag[]) => {
        this.paginationData = data;
        this.hashtags = this.paginationData.data;
      })
      .catch(() => { });
  }


  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.hashtagSrv.paginate(this.itemsPerPage)
      .then((data: Hashtag[]) => {
        this.paginationData = data;
        this.hashtags = this.paginationData.data;
      })
      .catch(() => { });
  }


  changePagination(pageNumber: any) {
    this.hashtagSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: Hashtag[]) => {
        this.paginationData = data;
        this.hashtags = this.paginationData.data;
      })
      .catch(() => { });
  }


  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @description Stocke tous les hashtags dans un tableau d'hastags
   */
  findAll() {
    this.hashtagSrv.findAll()
      .then(
        (data: Hashtag[]) => {
          this.hashtags = data
        }
      )
      .catch(
        () => { }
      );
  }


  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @description Sauvegarde liste d'hashtags dans la base de donnée
   */
  save() {
    if (this.hashtagItems.length != 0) {
      for (let hashtag of this.hashtagItems) {
        this.hashtagSrv.save(hashtag)
          .then(() => { })
          .catch((err: PromiseError) => {
            if (err.validationError) {
              this.errors = err.data;
            }
          })
          .finally(() => { this.hashtagSrv.http.toastr.success("Hashtags ajoutés avec succès") });
      }
      this.hashtagItems = []
      this.paginate()
    }
    else {
      this.hashtagSrv.http.toastr.error("Veuillez ajouter au moins un hashtag")
    }
  }



  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 26.01.22
     * @description Met à jour un hashtag
     * @param Hashtag
   */
  update(event: string | number, hashtag: Hashtag) {
    hashtag.nom = String(event)
    this.hashtagSrv.update(hashtag)
      .then((data: Hashtag) => {
        let findIndex = this.hashtags.findIndex(element => element.nom == hashtag.nom)
        this.hashtags[findIndex] = data
        this.paginate();
        this.hashtagSrv.http.toastr.info("Hashtag modifié avec succès")
      })
      .catch(() => {
        this.paginate()
      });
  }

  /**
   * * @author Alioune Badara FAM
     * @copyright ABF
     * @link https://recrutore.atlassian.net/browse/RAD-68
     * @since 25.01.22
     * @description Supprime un hashtag
     * @param Hashtag
   */
  remove(hashtag: Hashtag) {
    this.hashtagSrv.removeObject(hashtag)
      .then((data: Hashtag) => {
        const index = this.hashtags.findIndex(element => element.nom == data.nom)
        if (index > -1) {
          this.hashtags.splice(index, 1)
        }
        this.paginate()
        this.hashtagSrv.http.toastr.info("Hashtag supprimé avec succès")
      })
      .catch(() => {
        this.paginate()
      });
  }

}

