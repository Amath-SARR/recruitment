import { Route } from "@angular/router";
import { SmsPackComponent } from "./sms-pack/sms-pack/sms-pack.component";
import { DomaineInterventionListComponent } from "./domaineIntervention/domaine-intervention-list/domaine-intervention-list.component";
import { HashtagComponent } from "./hashtag/hashtag.component";
import { UserListComponent } from "./user/user-list/user-list.component";
import { CategorieEmploiListComponent } from './categorie-emploi/categorie-emploi-list/categorie-emploi-list.component';
import { TypeOffreComponent } from "./type-offre/type-offre-list/type-offre.component";
import { StateComponent } from "./states/state/state.component";
import { EntrepriseAdminListComponent } from "./entreprise/entreprise-admin-list/entreprise-admin-list.component";
import { CampagneAdminListComponent } from './campagne/campagne-admin-list/campagne-admin-list.component';


export const adminRoutes: Route = {
  path: 'admin',
  children: [
    {
      path: 'user', children: [
        { path: '', component: UserListComponent },
      ]
    },
    { path: 'smspack', component: SmsPackComponent },
    {
      path: 'categorieemploi', children: [
        { path: '', component: CategorieEmploiListComponent }
      ],
    },
    {
      path: 'hashtags', component: HashtagComponent
    },
    {
      path: 'domaineIntervention', component: DomaineInterventionListComponent
    },
    {
      path: 'typeoffre', component: TypeOffreComponent
    },
    {
      path: 'statuts', component: StateComponent
    },
    {
      path: 'entreprise', component: EntrepriseAdminListComponent
    },
  
    {
      path: 'campagne', component: CampagneAdminListComponent
    }
  ]
}
