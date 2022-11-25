import { EntrepriseFollowedListComponent } from './entreprise/entreprise-followed-list/entreprise-followed-list.component';
import { HomeComponent } from './home/home.component';
import { EntrepriseNewComponent } from './entreprise/entreprise-new/entreprise-new.component';
import { Route } from '@angular/router';
import { EntrepriseShowComponent } from './entreprise/entreprise-show/entreprise-show.component';
import { CampagnePublicShowComponent } from './campagne/campagne-public-show/campagne-public-show.component';
import { CandidatureNewComponent } from './candidature/candidature-new/candidature-new.component';
import { CandidatCandidatureListComponent } from './candidature/candidat-candidature-list/candidat-candidature-list.component';
import { CandidatureShowComponent } from './candidature/candidature-show/candidature-show.component';
import { CandidatureSpontaneeNewComponent } from './candidature/candidature-spontanee-new/candidature-spontanee-new/candidature-spontanee-new.component';

export const defaultRoutes: Route = {
  path: '', children: [
    { path: '', component: HomeComponent },
    {
      path: 'entreprise', children: [
        { path: 'new', component: EntrepriseNewComponent },
        { path: ':uid', component: EntrepriseShowComponent }
      ]
    },
    {
      path: 'campagne', children: [
        { path: ':uid/details', component: CampagnePublicShowComponent },
        { path: ':uid/candidature', component: CandidatureNewComponent },
      ],
    },
    { path: 'entreprises-favorites', component: EntrepriseFollowedListComponent
    },
    {
      path: 'candidature', component: CandidatCandidatureListComponent
    },
    {
      path: 'candidature', children: [
        { path: ':uid', component: CandidatureShowComponent },
        { path: ':spontanee/new/:uid', component: CandidatureSpontaneeNewComponent},
        { path: ':entreprise_id/:uid', component: CandidatureShowComponent },
      ],
    },
    { path: 'entreprises-favorites', component: EntrepriseFollowedListComponent }
  ]
};
