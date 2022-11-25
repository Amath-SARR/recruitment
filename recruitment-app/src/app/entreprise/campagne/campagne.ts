import { CategorieEmploi } from './../../admin/categorie-emploi/categorie-emploi';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { State } from 'src/app/admin/states/state';
import { User } from '../../admin/user/user';
import { Candidature } from '../../default/candidature/candidature';
export class Campagne {
  id: number | undefined;
  array_id_types_offres_selected: number[] = [];
  entreprise_id: number | undefined;
  categorie_emploi: CategorieEmploi = Object.create(null);;
  titre: string | undefined;
  lieu: string | undefined;
  photo: string | undefined;
  dateLancement: Date | undefined;
  dateCloture: Date | undefined;
  description: string = '';
  created_at: string | undefined;
  updated_at: string | undefined;
  uid: string | undefined;
  states: State[] = [];
  entreprise: Entreprise | undefined;
  user: User = Object.create(null);
  photo_path: string | undefined;
  name: string | undefined;
  active: boolean | undefined;
  categorie_emploi_id: number | undefined;
  hashtagIds: (number | undefined)[] = [];
  candidature: Candidature | undefined; // candidature de l'utilisateur connecté
  // temp fields
  stateIds: (number | undefined)[] = [];
}
