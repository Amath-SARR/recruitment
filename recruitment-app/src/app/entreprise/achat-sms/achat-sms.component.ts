import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmsPackService } from 'src/app/admin/sms-pack/sms-pack.service';
import { SmsPack } from 'src/app/admin/sms-pack/SmsPack';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { AchatSms } from './achat-sms';
import { AchatSmsService } from './achat-sms.service';

@Component({
  selector: 'app-achat-sms',
  templateUrl: './achat-sms.component.html',
  styleUrls: ['./achat-sms.component.css']
})
export class AchatSmsComponent implements OnInit {

  smsPacks: SmsPack[] = [];
  entreprise = new Entreprise();
  smsPack = new SmsPack();
  achatSms : AchatSms[] = [];
  isCreating = false;
  achatSmsModel = new AchatSms();
  errors: any = {};

  constructor(public achatSmsSrv: AchatSmsService, public entrepriseSrv: EntrepriseService, public route: ActivatedRoute, public packSmsSrv: SmsPackService) { }

  ngOnInit(): void {
    this.entreprise.uid = this.route.snapshot.params["uid"];
    this.getAvailablePacks();
    this.getCurrentEntreprise(this.entreprise.uid);
  }

  /**
   * Recupère les Packs disponibles au niveau de la page de l'achat
   * @author Mariama Fatou Sarr DIOP
   * @since 07/02/2022
   */
  getAvailablePacks() {
    this.packSmsSrv.findAll()
      .then((data: SmsPack[]) => {
        this.smsPacks = data;
      })
      .catch(() => { });
  }

  /**
   * Recupère l'entreprise qui bénéficie de l'achat
   * @author Mariama Fatou Sarr DIOP
   * @since 07/02/2022
   * @param uid
   */
  getCurrentEntreprise(uid: string | undefined) {
    this.entrepriseSrv.findByUid(uid)
      .then((data: Entreprise) => {
        this.entreprise = data;
      })
      .catch(() => {
      })
  }

  /**
   * Redirige vers l'API de paiement
   * @author Mariama Fatou Sarr DIOP
   * @since 07/02/2022
   * @param smsPack
   */
  initPayment(smsPack: SmsPack) {
    this.isCreating = true;
    let achatSms = new AchatSms();
    achatSms.sms_pack_id = smsPack.id;
    achatSms.entreprise_id = this.entreprise.id;
    this.achatSmsSrv.save(achatSms)
      .then((url) => {
        location.href = url;
      })
      .catch(() => {})
      .finally(() => {
        this.isCreating = false;
      });
  }



}
