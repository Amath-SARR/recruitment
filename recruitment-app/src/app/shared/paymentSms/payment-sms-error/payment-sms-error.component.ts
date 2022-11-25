import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AchatSmsService } from 'src/app/entreprise/achat-sms/achat-sms.service';

@Component({
  selector: 'app-payment-sms-error',
  templateUrl: './payment-sms-error.component.html',
  styleUrls: ['./payment-sms-error.component.css']
})
export class PaymentSmsErrorComponent implements OnInit {

  isCreating = false;
  errors: any = {};
  oldAchatSmsUID: string;
  constructor(public achatSmsSrv:AchatSmsService, public activatedRoute: ActivatedRoute) {
    this.oldAchatSmsUID = activatedRoute.snapshot.params['uid'];
  }

  ngOnInit(): void {
  }

  /**
   * Permet de recommencer un achat sms échoué
   * @author Mariama Fatou Sarr DIOP
   * @since 11/02/2022
   */
  restartPayment() {
    this.isCreating = true;
    this.achatSmsSrv.restore(this.oldAchatSmsUID)
      .then((url) => {
        location.href = url;
      })
      .catch(() => {})
      .finally(() => {
        this.isCreating = false;
      });
  }
}
