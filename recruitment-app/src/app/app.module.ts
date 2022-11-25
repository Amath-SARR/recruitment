import { SmsPackComponent } from './admin/sms-pack/sms-pack/sms-pack.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';
import { HttpTokenInterceptorService } from './shared/services/http-token-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './templates/footer/footer.component';
import { HeaderComponent } from './templates/header/header.component';
import { HomeComponent } from './default/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NZ_I18N, fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import fr from '@angular/common/locales/fr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UserListComponent } from './admin/user/user-list/user-list.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProfilComponent } from './auth/profil/profil.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomaineInterventionListComponent } from './admin/domaineIntervention/domaine-intervention-list/domaine-intervention-list.component';
import { HashtagComponent } from './admin/hashtag/hashtag.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PostRegisterComponent } from './auth/post-register/post-register.component';
import { CategorieEmploiListComponent } from './admin/categorie-emploi/categorie-emploi-list/categorie-emploi-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { NgPipesModule } from 'ng-pipes';
import { ConfirmAccountComponent } from './auth/confirm-account/confirm-account.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { MatChipsModule } from '@angular/material/chips';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TypeOffreComponent } from './admin/type-offre/type-offre-list/type-offre.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxEditInlineModule } from 'ngx-edit-inline';
import { StateComponent } from './admin/states/state/state.component';
import { EntrepriseNewComponent } from './default/entreprise/entreprise-new/entreprise-new.component';
import { EntrepriseShowComponent } from './default/entreprise/entreprise-show/entreprise-show.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { EntrepriseAdminListComponent } from './admin/entreprise/entreprise-admin-list/entreprise-admin-list.component';
import { CampagneUserListComponent } from './entreprise/campagne/campagne-user-list/campagne-user-list.component';
import { CampagneNewComponent } from './entreprise/campagne/campagne-new/campagne-new.component';
import { EntrepriseEditComponent } from './entreprise/entreprise-edit/entreprise-edit/entreprise-edit.component';
import { InvitationNewComponent } from './entreprise/invitation/invitation-new/invitation-new.component';
import { InvitationConfirmComponent } from './entreprise/invitation/invitation-confirm/invitation-confirm.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { EntrepriseUserListComponent } from './entreprise/entreprise-user-list/entreprise-user-list.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AchatSmsComponent } from './entreprise/achat-sms/achat-sms.component';
import { MesEntreprisesComponent } from './entreprise/mes-entreprises/mes-entreprises.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CampagneAdminShowComponent } from './entreprise/campagne/campagne-admin-show/campagne-admin-show.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CampagnePublicShowComponent } from './default/campagne/campagne-public-show/campagne-public-show.component';
import { MatButtonModule } from '@angular/material/button';
import { CampagneAdminListComponent } from './admin/campagne/campagne-admin-list/campagne-admin-list.component';
import { EntrepriseFollowedListComponent } from './default/entreprise/entreprise-followed-list/entreprise-followed-list.component';
import { PaymentSmsConfirmationComponent } from './shared/paymentSms/payment-sms-confirmation/payment-sms-confirmation.component';
import { PaymentSmsErrorComponent } from './shared/paymentSms/payment-sms-error/payment-sms-error.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AppSettings } from './social-config/SocialSettings';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CollaborateurListComponent } from './entreprise/collaborateur/collaborateur-list/collaborateur-list.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { EntrepriseCampagneListComponent } from './admin/entreprise/entreprise-campagne-list/entreprise-campagne-list.component';
import { CandidatureNewComponent } from './default/candidature/candidature-new/candidature-new.component';
import { CandidatureShowComponent } from './default/candidature/candidature-show/candidature-show.component';
import { CampagneCandidatureListComponent } from './entreprise/candidature/campagne-candidature-list/campagne-candidature-list.component';
import { CampagneSimilaireListComponent } from './default/campagne/campagne-similaire-list/campagne-similaire-list.component';
import { CandidatCandidatureListComponent } from './default/candidature/candidat-candidature-list/candidat-candidature-list.component';
import { NzTableModule,  NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder, NzTableFilterComponent } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'; 
import { CandidatureSpontaneeNewComponent } from './default/candidature/candidature-spontanee-new/candidature-spontanee-new/candidature-spontanee-new.component';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { EntrepriseCandidatureSpontaneeListComponent } from './admin/entreprise/entreprise-candidature-spontanee-list/entreprise-candidature-spontanee-list.component';

registerLocaleData(fr);
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    ProfilComponent,
    SmsPackComponent,
    DomaineInterventionListComponent,
    HashtagComponent,
    PostRegisterComponent,
    CategorieEmploiListComponent,
    ConfirmAccountComponent,
    TypeOffreComponent,
    SmsPackComponent,
    RecoverPasswordComponent,
    StateComponent,
    EntrepriseNewComponent,
    EntrepriseShowComponent,
    SmsPackComponent,
    EntrepriseAdminListComponent,
    CampagneUserListComponent,
    CampagneNewComponent,
    EntrepriseUserListComponent,
    EntrepriseEditComponent,
    InvitationNewComponent,
    InvitationConfirmComponent,
    AchatSmsComponent,
    MesEntreprisesComponent,
    CampagneAdminShowComponent,
    CampagnePublicShowComponent,
    CampagneAdminListComponent,
    EntrepriseFollowedListComponent,
    PaymentSmsConfirmationComponent,
    PaymentSmsErrorComponent,
    EntrepriseCampagneListComponent,
    CollaborateurListComponent,
    CandidatureNewComponent,
    CandidatureShowComponent,
    CampagneCandidatureListComponent,
    CandidatureShowComponent,
    CampagneSimilaireListComponent,
    CandidatCandidatureListComponent,
    CandidatureSpontaneeNewComponent,
    EntrepriseCandidatureSpontaneeListComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added
    NzButtonModule,
    NzPaginationModule,
    NzCardModule,
    NzInputModule,
    NzModalModule,
    NzModalModule,
    NgxEditInlineModule,
    NzIconModule,
    NzSpinModule,
    NzGridModule,
    MatChipsModule,
    NzSkeletonModule,
    NgPipesModule,
    NzBadgeModule,
    NzSwitchModule,
    NzSelectModule,
    SocialLoginModule,
    NzCheckboxModule,
    NzTabsModule,
    CKEditorModule,
    LoadingBarHttpClientModule,
    NzSpinModule,
    NzToolTipModule,
    DragDropModule,
    MatButtonModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzResultModule,
    NzAlertModule,
    NzTableModule,
    NzDropDownModule,
    NzTimelineModule
  ],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AuthService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptorService, multi: true
    },
    { provide: NZ_I18N, useValue: fr_FR },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              AppSettings.GOOGLE_CLIENT_ID
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              AppSettings.FACEBOOK_CLIENT_ID
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    FooterComponent,
    HeaderComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }

export function appInitFactory(authService: AuthService): () => Promise<any> {
  return () => authService.getCurrentUser();
}
