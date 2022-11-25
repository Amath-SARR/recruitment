import { Follower } from './entreprise-show/follower';
export class Entreprise {
  id!: number;
  uid: string | undefined;
  name: string | undefined;
  telephone: string | undefined;
  email: string | undefined;
  logo: string | undefined;
  logo_path: string | undefined;
  siteWeb: string | undefined;
  adresse: string | undefined;
  candidatureSpontanee: boolean = true;
  presentation: string | undefined;
  user_id: number | undefined;
  boolean: boolean = true;
  created_at: string | undefined;
  updated_at: string | undefined;
  follower: Follower = Object.create(null);
  followed: boolean | undefined;
  is_owner: boolean | undefined;
  is_collaborateur: boolean | undefined;
  domaineInterventionIds: (number | undefined)[] = [];
}
