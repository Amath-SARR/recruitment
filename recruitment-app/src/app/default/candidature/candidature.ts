import { Campagne } from 'src/app/entreprise/campagne/campagne';
import { User } from '../../admin/user/user';
import { StateCampagne } from '../campagne-state/StateCampagne';
export class Candidature {
  id: number | undefined;
  uid: string | undefined;
  campagne_id: number | undefined;
  campagne_uid: string | undefined;
  source: string | undefined;
  motivation: string='';
  cv: string | undefined;
  cv_path: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
  campagne: Campagne | undefined;
  user: User = Object.create(null);
  current_state: StateCampagne|undefined;
  photo_path: string|undefined;
  interessant: boolean|undefined;
  entreprise_id: number | undefined;
  entreprise_uid: string | undefined;
  poste: string | undefined;
  photo: string | undefined;
  user_id: number | undefined;
}
