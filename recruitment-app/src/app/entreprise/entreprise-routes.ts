import { Route } from '@angular/router';
import { CampagneUserListComponent } from './campagne/campagne-user-list/campagne-user-list.component';
import { CampagneNewComponent } from './campagne/campagne-new/campagne-new.component';
import { EntrepriseEditComponent } from './entreprise-edit/entreprise-edit/entreprise-edit.component';
import { InvitationNewComponent } from './invitation/invitation-new/invitation-new.component';
import { InvitationConfirmComponent } from './invitation/invitation-confirm/invitation-confirm.component';
import { AchatSmsComponent } from './achat-sms/achat-sms.component';
import { MesEntreprisesComponent } from './mes-entreprises/mes-entreprises.component';
import { CampagneAdminShowComponent } from './campagne/campagne-admin-show/campagne-admin-show.component';
import { PaymentSmsConfirmationComponent } from '../shared/paymentSms/payment-sms-confirmation/payment-sms-confirmation.component';
import { PaymentSmsErrorComponent } from '../shared/paymentSms/payment-sms-error/payment-sms-error.component';
import { CampagneCandidatureListComponent } from './candidature/campagne-candidature-list/campagne-candidature-list.component';
import { EntrepriseCampagneListComponent } from '../admin/entreprise/entreprise-campagne-list/entreprise-campagne-list.component';
import { CandidatCandidatureListComponent } from '../default/candidature/candidat-candidature-list/candidat-candidature-list.component';

export const entrepriseRoutes: Route = {
  path: '', children: [
    { path: 'mes-campagnes', component: CampagneUserListComponent },
    { path: 'mes-entreprises', component: MesEntreprisesComponent },
    { path: 'mes-candidatures', component: CandidatCandidatureListComponent },

    {
      path: 'campagne', children: [
        { path: 'new', component: CampagneNewComponent },
        { path: ':uid/admin', component: CampagneAdminShowComponent },
        { path: ':uid/listecandidature', component: CampagneCandidatureListComponent}
      ],
    },
    {
      path: 'entreprise', children: [
        { path: ':uid/edit', component: EntrepriseEditComponent },
        { path: ':uid/achat-sms', component: AchatSmsComponent },
        { path: ':uid/achat-sms-confirmation',component:PaymentSmsConfirmationComponent},
        { path: ':uid/achat-sms-error',component:PaymentSmsErrorComponent}
      ]
    },
    {
      path: 'achatsms', children: [
        { path: ':uid/confirmation',component:PaymentSmsConfirmationComponent},
        { path: ':uid/error',component:PaymentSmsErrorComponent}
      ]
    },
    {
      path: 'invitation', children: [
        { path: ':uid/create', component: InvitationNewComponent },
        { path: ':uid/confirm', component: InvitationConfirmComponent }
      ]
    },
  ]


}

