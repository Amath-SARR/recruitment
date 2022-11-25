import { User } from "src/app/admin/user/user";
import { Entreprise } from "src/app/default/entreprise/entreprise";
import { BaseClass } from "src/app/shared/classes/base-class";

export class Invitation extends BaseClass {
  entreprise: Entreprise | undefined;
  entreprise_id: number | undefined;
  user: User | undefined;
  email: string | undefined;
  uid: string | undefined;
  prenoms: string | undefined;
  nom: string | undefined;
  telephone: string | undefined;
}
