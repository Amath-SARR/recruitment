import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { EntrepriseService } from 'src/app/default/entreprise/entreprise.service';
import { AchatSms } from 'src/app/entreprise/achat-sms/achat-sms';
import { AchatSmsService } from 'src/app/entreprise/achat-sms/achat-sms.service';

@Component({
  selector: 'app-payment-sms-confirmation',
  templateUrl: './payment-sms-confirmation.component.html',
  styleUrls: ['./payment-sms-confirmation.component.css']
})
export class PaymentSmsConfirmationComponent implements OnInit {
  achatSms:any = null;
  constructor(public achatSmsSrv:AchatSmsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAchatSms();
  }

  /**
   * Retourne les informations d'un achat sms
   * @author Mariama Fatou Sarr DIOP
   * @since 11/02/2022
   */
  getAchatSms() {
    this.achatSmsSrv.findByUid(this.activatedRoute.snapshot.params["uid"])
      .then((data: AchatSms) => {
        this.achatSms = data;
      })
      .catch(() => {
        this.router.navigate(['/']);
       })
  }


}
