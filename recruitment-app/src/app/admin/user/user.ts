import { Entreprise } from 'src/app/default/entreprise/entreprise';
/**
 * @author Moussa Fofana
 * @copyright bamboguirassy
 * @since 22.01.22
 */
export class User {
  id: number | undefined;
  name: string | undefined;
  email: string = "";
  email_verified_at: string | undefined;
  presentation: string | undefined;
  profession: string | undefined;
  type: string | undefined;
  created_at: string | undefined;
  telephone: string | undefined;
  enabled: boolean = false;
  password: string | undefined;
  password_confirmation: string | undefined;
  photo: string | undefined;
  photo_path: string | undefined;
  uid: string | undefined;
  entreprises_count = 0;
  is_entreprise_followed: boolean | undefined;
  followed_entreprises_count = 0;
  //variable temporaire
  selected: boolean = false;
}
